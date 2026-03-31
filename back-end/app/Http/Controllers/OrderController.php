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
                'status' => 'pending'
            ]);

            // 3. créer items + stock + notification
            $sellers = [];
            foreach ($cartItems as $item) {

    $product = Product::find($item->product_id);

    if (!$product->user_id) {
    continue; // ou throw exception claire
}

    // ✔ 1. CHECK STOCK AVANT TOUT
    if ($product->stock < $item->quantity) {
        throw new \Exception("Stock insuffisant pour {$product->title}");
    }

    // ✔ 2. CREATE ITEM
    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $item->product_id,
        'title' => $item->title,
        'price' => $product->price,
        'image' => $item->image,
        'quantity' => $item->quantity
    ]);

    // ✔ 3. DECREMENT STOCK
    $product->decrement('stock', $item->quantity);

    // ✔ 4. GROUP SELLERS
    $sellers[$product->user_id][] = $product->title;
}
            // notification
            foreach ($sellers as $sellerId => $products) {
                Notification::create([
                     'user_id' => $sellerId,
                     'type' => 'order',
                     'message' => "🛒 Nouvelle commande (#{$order->id}) contenant : ... " . implode(', ', $products)
                    ]);
                }

            // 4. vider panier
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order->load('items')
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
