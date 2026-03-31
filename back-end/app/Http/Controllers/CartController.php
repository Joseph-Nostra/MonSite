<?php


namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;

use Illuminate\Http\Request;



class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        return response()->json([
            'cart' => $cart,
            'total_price' => $cart->sum(fn($i) => $i->price * $i->quantity),
            'total_quantity' => $cart->sum('quantity')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1'
        ]);

        $userId = $request->user()->id;
        $product = Product::findOrFail($request->product_id);

        $item = Cart::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->first();

        if ($item) {
            $item->increment('quantity', $request->quantity ?? 1);
        } else {
            $item = Cart::create([
                'user_id' => $userId,
                'product_id' => $product->id,
                'title' => $product->title,
                'price' => $product->price,
                'image' => $product->image,
                'quantity' => $request->quantity ?? 1,
            ]);
        }

        return response()->json($item);
    }

    public function update(Request $request, $id)
{
    $request->validate([
        'quantity' => 'required|integer|min:1'
    ]);

    $item = Cart::where('id', $id)
        ->where('user_id', $request->user()->id)
        ->firstOrFail();

    $item->update([
        'quantity' => $request->quantity
    ]);

    return response()->json($item);
}

    public function destroy(Request $request, $id)
    {
        Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['message' => 'Deleted']);
    }

}
