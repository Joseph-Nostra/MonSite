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
        $query = Product::with('user:id,name,email')->where('is_active', true);

        // Search engine (covers title, description, brand, specs)
        if ($request->filled('q')) {
            $searchTerm = $request->q;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('brand', 'like', '%' . $searchTerm . '%')
                  ->orWhere('cpu', 'like', '%' . $searchTerm . '%')
                  ->orWhere('gpu', 'like', '%' . $searchTerm . '%');
            });
        }

        // Technical Filters
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }
        if ($request->filled('usage')) {
            $query->where('usage', $request->usage);
        }
        if ($request->filled('performance')) {
            $query->where('performance_level', $request->performance);
        }
        if ($request->filled('ram')) {
            $query->where('ram', 'like', '%' . $request->ram . '%');
        }
        if ($request->filled('cpu_type')) { // e.g. i7, Ryzen
            $query->where('cpu', 'like', '%' . $request->cpu_type . '%');
        }
        if ($request->filled('gpu_type')) {
            $query->where('gpu', 'like', '%' . $request->gpu_type . '%');
        }
        
        // Pricing Filters
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float)$request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float)$request->max_price);
        }

        // Legacy/Special Filters
        if ($request->has('promo')) {
            $query->where('discount_rate', '>', 0);
        }
        if ($request->has('new')) {
            $query->where('is_new', $request->new === 'true');
        }

        if ($request->filled('seller_id')) {
            $query->where('user_id', $request->seller_id);
        }

        return $query->latest()->paginate(35);
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
        'brand' => 'nullable|string',
        'usage' => 'nullable|string',
        'performance_level' => 'nullable|string',
        'discount_rate' => 'nullable|numeric|min:0|max:100',
        'cpu' => 'nullable|string',
        'ram' => 'nullable|string',
        'storage_type' => 'nullable|string',
        'storage_capacity' => 'nullable|string',
        'gpu' => 'nullable|string',
        'screen_size' => 'nullable|string',
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
        'brand' => $request->brand,
        'usage' => $request->usage,
        'performance_level' => $request->performance_level,
        'discount_rate' => $request->discount_rate ?? 0,
        'cpu' => $request->cpu,
        'ram' => $request->ram,
        'storage_type' => $request->storage_type,
        'storage_capacity' => $request->storage_capacity,
        'gpu' => $request->gpu,
        'screen_size' => $request->screen_size,
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
        'brand' => 'sometimes|nullable|string',
        'usage' => 'sometimes|nullable|string',
        'performance_level' => 'sometimes|nullable|string',
        'discount_rate' => 'sometimes|nullable|numeric|min:0|max:100',
        'cpu' => 'sometimes|nullable|string',
        'ram' => 'sometimes|nullable|string',
        'storage_type' => 'sometimes|nullable|string',
        'storage_capacity' => 'sometimes|nullable|string',
        'gpu' => 'sometimes|nullable|string',
        'screen_size' => 'sometimes|nullable|string',
        'is_active' => 'sometimes|boolean',
    ]);

    $data = $request->all();

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
