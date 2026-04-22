<?php

namespace App\Http\Controllers;

use App\Models\Information;
use Illuminate\Http\Request;

class InformationController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $info = Information::where('slug', $slug)->firstOrFail();
        return response()->json($info);
    }
}
