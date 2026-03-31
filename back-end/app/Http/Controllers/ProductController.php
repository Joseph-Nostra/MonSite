<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 🔹 Liste tous les produits
    public function index()
    {
        return Product::with('user:id,name,email')->latest()->get();
    }

    // 🔹 Recherche
    public function search(Request $request)
    {
        $q = $request->input('q');
        if (!$q) return [];
        return Product::where('title', 'like', '%' . $q . '%')
            ->latest()
            ->get();
    }

    // 🔹 Voir un produit
    public function show($id)
    {
        $product = Product::with('user:id,name,email')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        return response()->json($product);
    }

    // 🔥 Ajouter produit (vendeur ou admin)
    public function store(Request $request)
{
    $user = $request->user();

    if (!$user || !in_array($user->role, ['admin', 'vendeur'])) {
        return response()->json(['message' => 'Accès refusé'], 403);
    }

    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'stock' => 'nullable|integer|min:0',
        'image' => 'nullable|image|max:2048',
    ]);

    $imagePath = null;

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
    }

    $product = Product::create([
        'title' => $request->title,
        'description' => $request->description,
        'price' => $request->price,
        'image' => $imagePath,
        'user_id' => $user->id,
    ]);

    return response()->json([
        'message' => 'Produit créé',
        'product' => $product
    ], 201);
}

    // 🔥 Modifier produit
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $product = Product::find($id);

        if (!$product) return response()->json(['message' => 'Produit non trouvé'], 404);

        if (!$user || ($user->role !== 'admin' && $product->user_id !== $user->id)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        if ($request->hasFile('image')) {
            $product->image = $request->file('image')->store('products', 'public');
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'sometimes|nullable|image|max:2048',
        ]);

        $product->update($request->only(['title', 'description', 'price', 'image']));

        return response()->json(['message' => 'Produit mis à jour', 'product' => $product]);
    }

    // 🔥 Supprimer produit
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $product = Product::find($id);

        if (!$product) return response()->json(['message' => 'Produit non trouvé'], 404);

        if (!$user || ($user->role !== 'admin' && $product->user_id !== $user->id)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Produit supprimé']);
    }

    // 🔥 Produits du vendeur connecté
    public function myProducts(Request $request)
    {
        $user = $request->user();

        if (!$user) return response()->json(['message' => 'Non authentifié'], 401);

        return Product::where('user_id', $user->id)->latest()->get();
    }
}
