<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class SimulatorController extends Controller
{
    /**
     * Recommend products based on budget and usage.
     */
    public function recommend(Request $request)
    {
        $request->validate([
            'budget' => 'required|numeric|min:0',
            'usage' => 'required|string|in:bureautique,gaming,etudiant,pro,creatif',
        ]);

        $budget = $request->budget;
        $usage = $request->usage;

        $query = Product::where('is_active', true)
            ->where('price', '<=', $budget);

        // Core recommendation logic based on usage
        switch ($usage) {
            case 'gaming':
                $query->where('usage', 'gaming')
                      ->orderByDesc('performance_level')
                      ->orderByDesc('price'); // Best possible for budget
                break;
            case 'creatif':
                $query->whereIn('usage', ['gaming', 'pro'])
                      ->where('ram', 'like', '%16GB%')
                      ->orWhere('ram', 'like', '%32GB%');
                break;
            case 'etudiant':
                $query->whereIn('usage', ['etudiant', 'bureautique'])
                      ->orderBy('price'); // Most affordable for budget
                break;
            case 'pro':
                $query->where('usage', 'pro')
                      ->orderByDesc('performance_level');
                break;
            default:
                $query->orderBy('price');
        }

        $recommendations = $query->limit(5)->get();

        return response()->json([
            'recommendations' => $recommendations,
            'message' => $recommendations->isEmpty() 
                ? "Désolé, aucun PC ne correspond exactement à votre budget pour cet usage." 
                : "Voici les meilleurs choix pour vous !"
        ]);
    }
}
