<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = Review::where('product_id', $productId)
            ->with('user:id,name,avatar')
            ->latest()
            ->get();
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'images' => 'nullable|array'
        ]);

        $user = $request->user();

        // Optional: check if user hasn't already reviewed this product
        $existing = Review::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();
        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà évalué ce produit'], 422);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'images' => $request->images
        ]);

        return response()->json([
            'message' => 'Avis ajouté avec succès',
            'review' => $review->load('user:id,name,avatar')
        ], 201);
    }
}
