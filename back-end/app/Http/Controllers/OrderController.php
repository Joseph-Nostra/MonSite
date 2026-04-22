<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * 🔹 Liste commandes user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = $user->orders()
            ->with('items')
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }
    public function show(Request $request, $id)
{
    $order = Order::where('user_id', $request->user()->id)
        ->with('items')
        ->findOrFail($id);

    return response()->json([
        'order' => $order
    ]);
}

    /**
     * 🔥 CHECKOUT / CRÉER COMMANDE
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|in:card,paypal,delivery,bank_transfer',
            'shipping_address' => 'required|array',
            'shipping_address.full_name' => 'required|string|max:255',
            'shipping_address.address' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.zip_code' => 'required|string|max:20',
            'shipping_address.phone' => 'required|string|max:20',
        ]);

        $user = $request->user();

        $cartItems = Cart::where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Panier vide'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // 1. calcul total
            $total = $cartItems->sum(fn($item) => $item->price * $item->quantity);

            // 2. créer order
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'pending', // Toujours pending au début selon les nouveaux besoins
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending'
            ]);

            // 3. Créer shipping
            \App\Models\Shipping::create([
                'order_id' => $order->id,
                'full_name' => $request->shipping_address['full_name'],
                'address' => $request->shipping_address['address'],
                'city' => $request->shipping_address['city'],
                'zip_code' => $request->shipping_address['zip_code'],
                'phone' => $request->shipping_address['phone'],
                'status' => 'pending'
            ]);

            // 4. créer items (SANS décrémenter stock immédiatement pour les paiements en ligne)
            foreach ($cartItems as $item) {
                $product = Product::find($item->product_id);
                if (!$product) continue;

                if ($product->stock < $item->quantity) {
                    throw new \Exception("Stock insuffisant pour le produit : {$product->title}.");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'title' => $product->title,
                    'price' => $product->price,
                    'image' => $product->image,
                    'quantity' => $item->quantity
                ]);
            }

            // 5. Cas Paiement à la livraison -> Déjà en statut "pending", on valide juste les détails
            if ($request->payment_method === 'delivery') {
                // Créer l'enregistrement du paiement
                \App\Models\Payment::create([
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'amount' => $order->total,
                    'method' => 'cod',
                    'status' => 'pending',
                ]);
                
                // Décrémenter stock et notifier vendeurs
                $sellers = [];
                foreach ($cartItems as $item) {
                    $product = Product::find($item->product_id);
                    $product->decrement('stock', $item->quantity);
                    if ($product->user_id) {
                        $sellers[$product->user_id][] = ['title' => $product->title, 'quantity' => $item->quantity];
                    }
                }

                foreach ($sellers as $sellerId => $products) {
                    Notification::create([
                        'user_id' => $sellerId,
                        'type' => 'order',
                        'message' => "🛒 Nouvelle commande (#{$order->id}) à la livraison.",
                        'data' => ['order_id' => $order->id, 'total_price' => $order->total]
                    ]);
                }
            }

            // 6. vider panier
            Cart::where('user_id', $user->id)->delete();


            // 🔹 STRIPE
            if ($request->payment_method === 'card') {
                \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
                
                $intent = \Stripe\PaymentIntent::create([
                    'amount' => $order->total * 100, // Cents
                    'currency' => 'usd',
                    'metadata' => ['order_id' => $order->id],
                ]);

                $order->update(['payment_intent_id' => $intent->id]);

                DB::commit();
                return response()->json([
                    'message' => 'Intention de paiement créée',
                    'order_id' => $order->id,
                    'clientSecret' => $intent->client_secret
                ]);
            }

            // 🔹 PAYPAL (Simulé ou via SDK si installé)
            if ($request->payment_method === 'paypal') {
                // Ici on devrait créer l'ordre PayPal via API
                // Pour l'instant on retourne l'ID de la commande pour que le front gère avec le script PayPal
                DB::commit();
                return response()->json([
                    'message' => 'Commande PayPal créée',
                    'order_id' => $order->id
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order->load('items', 'shipping')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur Checkout: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return response()->json(['message' => 'Erreur lors de la commande', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * 🚀 MISE À JOUR STATUT (Vendeur/Admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,out_for_delivery,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        
        // Sécurité supplémentaire : vérifier si le vendeur possède les produits ? 
        // Pour l'instant on fait simple (Role check dans la route)

        $order->status = $request->status;

        // Si livré pour COD, marquer comme payé
        if ($request->status === 'delivered' && $order->payment_method === 'delivery') {
            $order->payment_status = 'paid';
        }

        $order->save();

        return response()->json([
            'message' => 'Statut mis à jour',
            'order' => $order
        ]);
    }
}
