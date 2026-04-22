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
     * 👥 Liste commandes CLIENT
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items', 'shipping'])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }

    /**
     * 📄 Détails commande CLIENT
     */
    public function show($id, Request $request)
    {
        $order = Order::with(['items', 'shipping'])
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json($order);
    }
    /**
     * 🏪 Liste commandes VENDEUR
     */
    public function sellerOrders(Request $request)
    {
        $user = $request->user();

        // Trouver les IDs des commandes qui contiennent au moins un produit de ce vendeur
        $orderIds = OrderItem::whereHas('product', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->pluck('order_id')->unique();

        $orders = Order::whereIn('id', $orderIds)
            ->with(['items' => function($q) use ($user) {
                $q->whereHas('product', function($sq) use ($user) {
                    $sq->where('user_id', $user->id);
                });
            }, 'user'])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }

    /**
     * 👥 Liste clients du VENDEUR
     */
    public function sellerCustomers(Request $request)
    {
        $user = $request->user();

        // Trouver les IDs des utilisateurs ayant commandé au moins un produit de ce vendeur
        $customers = \App\Models\User::whereHas('orders', function($q) use ($user) {
            $q->whereHas('items', function($sq) use ($user) {
                $sq->whereHas('product', function($ssq) use ($user) {
                    $ssq->where('user_id', $user->id);
                });
            });
        })->get(['id', 'name', 'email', 'phone', 'avatar']);

        return response()->json([
            'customers' => $customers
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
            'notes' => 'nullable|string',
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
                'full_name' => $request->shipping_address['full_name'],
                'address' => $request->shipping_address['address'],
                'city' => $request->shipping_address['city'],
                'zip_code' => $request->shipping_address['zip_code'],
                'phone' => $request->shipping_address['phone'],
                'notes' => $request->notes,
                'total' => $total,
                'status' => 'pending', 
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending'
            ]);

            // 3. Créer shipping (compatibilité ancienne structure si nécessaire)
            \App\Models\Shipping::create([
                'order_id' => $order->id,
                'full_name' => $request->shipping_address['full_name'],
                'address' => $request->shipping_address['address'],
                'city' => $request->shipping_address['city'],
                'zip_code' => $request->shipping_address['zip_code'],
                'phone' => $request->shipping_address['phone'],
                'status' => 'pending'
            ]);

            // 4. créer items
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

            // 5. Cas Paiement à la livraison
            if ($request->payment_method === 'delivery') {
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
                        'message' => "🛒 Nouvelle commande (#{$order->id}) reçue !",
                        'data' => [
                            'order_id' => $order->id, 
                            'total_price' => $order->total,
                            'customer_name' => $order->full_name
                        ]
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

            // 🔹 PAYPAL
            if ($request->payment_method === 'paypal') {
                DB::commit();
                return response()->json([
                    'message' => 'Commande PayPal créée',
                    'order_id' => $order->id
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order->load('items')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur Checkout: " . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la commande', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * 🚀 MISE À JOUR STATUT (Vendeur/Admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        $order->status = $request->status;

        // Si livré pour COD, marquer comme payé
        if ($request->status === 'delivered' && $order->payment_method === 'delivery') {
            $order->payment_status = 'paid';
            // Mettre à jour la transaction de paiement correspondante
            \App\Models\Payment::where('order_id', $order->id)->update(['status' => 'paid']);
        }

        $order->save();

        // Notifier le client du changement de statut
        if ($oldStatus !== $request->status) {
            $statusLabels = [
                'pending' => 'En attente',
                'confirmed' => 'Confirmée',
                'processing' => 'En préparation',
                'shipped' => 'Expédiée',
                'delivered' => 'Livrée',
                'cancelled' => 'Annulée'
            ];

            Notification::create([
                'user_id' => $order->user_id,
                'type' => 'order_update',
                'message' => "📦 Votre commande #{$order->id} est maintenant : " . ($statusLabels[$request->status] ?? $request->status),
                'data' => ['order_id' => $order->id, 'status' => $request->status]
            ]);
        }

        return response()->json([
            'message' => 'Statut mis à jour',
            'order' => $order
        ]);
    }
}
