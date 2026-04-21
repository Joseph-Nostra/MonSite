<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
                'status' => $request->payment_method === 'delivery' ? 'processing' : 'pending',
                'payment_method' => $request->payment_method
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

            // 4. créer items + stock + notification
            $sellers = [];
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

                $product->decrement('stock', $item->quantity);

                if ($product->user_id) {
                    $sellers[$product->user_id][] = [
                        'title' => $product->title,
                        'quantity' => $item->quantity
                    ];
                }
            }

            // Notifications vendeurs
            foreach ($sellers as $sellerId => $products) {
                $productDetails = array_map(fn($p) => "{$p['title']} (x{$p['quantity']})", $products);
                Notification::create([
                    'user_id' => $sellerId,
                    'type' => 'order',
                    'message' => "🛒 Nouvelle commande (#{$order->id}) reçue.",
                    'data' => [
                        'order_id' => $order->id,
                        'client_name' => $request->shipping_address['full_name'],
                        'total_price' => $order->total,
                        'city' => $request->shipping_address['city'],
                        'items_count' => count($products)
                    ]
                ]);
            }

            // 5. vider panier
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            // 🔹 GESTION PAIEMENT EN LIGNE (STRIPE)
            if ($request->payment_method === 'card') {
                // Ici on devrait créer la session Stripe
                // Pour l'instant on retourne l'order, la redirection sera faite côté front ou via un autre endpoint
                return response()->json([
                    'message' => 'Commande créée, redirection vers le paiement...',
                    'order' => $order->load('items', 'shipping'),
                    'redirect_url' => null // Bientôt implémenté avec Stripe
                ]);
            }

            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order->load('items', 'shipping')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erreur lors de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
