<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductView;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    /**
     * Get personalized recommendations for the user.
     */
    public function index(Request $request)
    {
        $user = $request->user('sanctum');
        $productIdsToExclude = [];

        if ($user) {
            // 1. Get products from wishlist to exclude and to find similar
            $wishlistItems = Wishlist::where('user_id', $user->id)->pluck('product_id')->toArray();
            $productIdsToExclude = array_merge($productIdsToExclude, $wishlistItems);

            // Find categories (usage) preferred by the user in wishlist
            $preferredUsages = Product::whereIn('id', $wishlistItems)
                ->groupBy('usage')
                ->select('usage', DB::raw('count(*) as count'))
                ->orderByDesc('count')
                ->pluck('usage')
                ->toArray();

            // 2. Get recently viewed products
            $recentViews = ProductView::where('user_id', $user->id)
                ->orderByDesc('updated_at')
                ->limit(10)
                ->pluck('product_id')
                ->toArray();
            
            $productIdsToExclude = array_merge($productIdsToExclude, $recentViews);

            // Find categories from recent views
            $viewedUsages = Product::whereIn('id', $recentViews)
                ->groupBy('usage')
                ->select('usage', DB::raw('count(*) as count'))
                ->orderByDesc('count')
                ->pluck('usage')
                ->toArray();

            $allPreferredUsages = array_unique(array_merge($preferredUsages, $viewedUsages));

            // Query recommendations
            $recommendations = Product::where('is_active', true)
                ->whereIn('usage', $allPreferredUsages)
                ->whereNotIn('id', $productIdsToExclude)
                ->inRandomOrder()
                ->limit(10)
                ->get();

            // If not enough, fill with popular products
            if ($recommendations->count() < 4) {
                $popular = Product::where('is_active', true)
                    ->whereNotIn('id', array_merge($productIdsToExclude, $recommendations->pluck('id')->toArray()))
                    ->orderByDesc('sales_count')
                    ->limit(10 - $recommendations->count())
                    ->get();
                $recommendations = $recommendations->concat($popular);
            }

            return response()->json($recommendations);
        }

        // For guest users, return popular products or based on session views
        $sessionId = $request->header('X-Session-Id') ?: $request->ip();
        $sessionViews = ProductView::where('session_id', $sessionId)
            ->orderByDesc('updated_at')
            ->limit(5)
            ->pluck('product_id')
            ->toArray();

        if (!empty($sessionViews)) {
            $sessionUsages = Product::whereIn('id', $sessionViews)->pluck('usage')->toArray();
            $recommendations = Product::where('is_active', true)
                ->whereIn('usage', $sessionUsages)
                ->whereNotIn('id', $sessionViews)
                ->limit(10)
                ->get();
            
            if ($recommendations->count() >= 4) {
                return response()->json($recommendations);
            }
        }

        // Default: Top sellers
        $recommendations = Product::where('is_active', true)
            ->orderByDesc('sales_count')
            ->limit(10)
            ->get();

        return response()->json($recommendations);
    }

    /**
     * Log a product view.
     */
    public function logView(Request $request, $productId)
    {
        $user = $request->user('sanctum');
        $sessionId = $request->header('X-Session-Id') ?: $request->ip();

        $view = ProductView::updateOrCreate(
            [
                'user_id' => $user ? $user->id : null,
                'product_id' => $productId,
                'session_id' => $user ? null : $sessionId,
            ],
            [
                'updated_at' => now()
            ]
        );

        $view->increment('view_count');

        return response()->json(['success' => true]);
    }
}
