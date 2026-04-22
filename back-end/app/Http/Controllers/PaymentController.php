<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Webhook;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    /**
     * 🔹 Webhook Stripe
     */
    public function handleStripeWebhook(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $endpoint_secret = config('services.stripe.webhook_secret');

        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            $this->finalizeOrder($paymentIntent->metadata->order_id, $paymentIntent->id, 'card');
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * 🔹 Capture PayPal Order
     */
    public function capturePayPalOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'paypal_order_id' => 'required'
        ]);

        $order = Order::findOrFail($request->order_id);
        
        // Ici on devrait appeler l'API PayPal pour capturer le paiement
        // Pour simplifier on simule la réussite si on reçoit l'ID (à sécuriser en prod)
        
        $this->finalizeOrder($order->id, $request->paypal_order_id, 'paypal');

        return response()->json([
            'message' => 'Paiement PayPal réussi',
            'order' => $order->load('items')
        ]);
    }

    /**
     * 🔹 Finaliser la commande (Status, Stock, Notifications, Transaction)
     */
    private function finalizeOrder($orderId, $transactionId, $method = 'card')
    {
        $order = Order::with('items')->find($orderId);
        if (!$order || $order->payment_status === 'paid') return;

        $order->update([
            'status' => 'processing',
            'payment_status' => ($method === 'cod' ? 'pending' : 'paid'),
        ]);

        // Créer l'enregistrement du paiement
        \App\Models\Payment::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'amount' => $order->total_price,
            'method' => $method,
            'status' => ($method === 'cod' ? 'pending' : 'paid'),
            'transaction_id' => $transactionId,
        ]);

        // Décrémenter stock et notifier vendeurs
        $sellers = [];
        foreach ($order->items as $item) {
            $product = Product::find($item->product_id);
            if ($product) {
                $product->decrement('stock', $item->quantity);
                if ($product->user_id) {
                    $sellers[$product->user_id][] = [
                        'title' => $product->title,
                        'quantity' => $item->quantity
                    ];
                }
            }
        }

        foreach ($sellers as $sellerId => $products) {
            $productDetails = array_map(fn($p) => "{$p['title']} (x{$p['quantity']})", $products);
            Notification::create([
                'user_id' => $sellerId,
                'type' => 'order',
                'message' => "💰 Nouveau paiement reçu pour la commande (#{$order->id}).",
                'data' => [
                    'order_id' => $order->id,
                    'total_price' => $order->total_price,
                ]
            ]);
        }
    }
}
