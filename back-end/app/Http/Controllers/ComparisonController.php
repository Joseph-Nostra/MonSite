<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ComparisonController extends Controller
{
    /**
     * Get products for comparison based on IDs.
     */
    public function index(Request $request)
    {
        $ids = $request->input('ids');
        
        if (empty($ids)) {
            return response()->json([]);
        }

        // Handle both array and comma-separated string
        if (is_string($ids)) {
            $ids = explode(',', $ids);
        }

        $products = Product::whereIn('id', $ids)
            ->where('is_active', true)
            ->get();

        return response()->json($products);
    }
}
