<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Report;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'reported_id' => 'required|exists:users,id',
            'reason' => 'required|string',
            'message_id' => 'nullable|exists:messages,id',
        ]);

        $report = Report::create([
            'reporter_id' => $request->user()->id,
            'reported_id' => $request->reported_id,
            'message_id' => $request->message_id,
            'reason' => $request->reason,
        ]);

        return response()->json(['success' => true, 'report' => $report], 201);
    }
}
