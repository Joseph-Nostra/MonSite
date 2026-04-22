<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 🔹 Liste tous les produits
    public function index(Request $request)
    {
        $query = Product::with('user:id,name,email');

        // Search
        if ($request->has('q')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->q . '%')
                  ->orWhere('description', 'like', '%' . $request->q . '%')
                  ->orWhere('brand', 'like', '%' . $request->q . '%');
            });
        }

        // Filters
        if ($request->has('usage')) {
            $query->where('usage', $request->usage);
        }
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }
        if ($request->has('performance')) {
            $query->where('performance_level', $request->performance);
        }
        if ($request->has('new')) {
            $query->where('is_new', $request->new === 'true');
        }
        if ($request->has('promo')) {
            $query->where('discount_rate', '>', 0);
        }
        if ($request->has('budget')) {
            // Logic for budget ranges like "budget=5000-8000"
            $range = explode('-', $request->budget);
            if (count($range) === 2) {
                $query->whereBetween('price', [(float)$range[0], (float)$range[1]]);
            } elseif (str_contains($request->budget, '+')) {
                $query->where('price', '>=', (float)$request->budget);
            } else {
                $query->where('price', '<=', (float)$request->budget);
            }
        }

        return $query->latest()->get();
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
        'stock' => $request->stock ?? 0,
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

    $request->validate([
        'title' => 'sometimes|string|max:255',
        'description' => 'sometimes|nullable|string',
        'price' => 'sometimes|numeric|min:0',
        'stock' => 'sometimes|integer|min:0',
        'image' => 'sometimes|nullable|image|max:2048',
    ]);

    $data = $request->only(['title', 'description', 'price', 'stock']);

    // ✅ gérer image séparément
    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')->store('products', 'public');
    }
    
    $product->update($data);

    return response()->json([
        'message' => 'Produit mis à jour',
        'product' => $product
    ]);
}

    // 🔥 Supprimer produit (Soft Delete)
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $product = Product::find($id);

        if (!$product) return response()->json(['message' => 'Produit non trouvé'], 404);

        if (!$user || ($user->role !== 'admin' && $product->user_id !== $user->id)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $product->delete(); // Soft delete thanks to trait

        // Notification for seller
        Notification::create([
            'user_id' => $user->id,
            'type' => 'product_deleted',
            'message' => "Le produit '{$product->title}' a été supprimé (archivé)."
        ]);

        return response()->json(['message' => 'Produit supprimé (archivé)']);
    }

    // 🔥 Produits du vendeur connecté
    public function myProducts(Request $request)
    {
        $user = $request->user();

        if (!$user) return response()->json(['message' => 'Non authentifié'], 401);

        return Product::where('user_id', $user->id)->latest()->get();
    }
}
