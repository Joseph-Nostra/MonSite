<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    // 🔹 Liste des conversations uniques
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender:id,name', 'receiver:id,name'])
            ->latest()
            ->get()
            ->map(function ($message) use ($userId) {
                // Déterminer l'autre personne dans la conversation
                return $message->sender_id == $userId ? $message->receiver : $message->sender;
            })
            ->unique('id')
            ->values();

        return response()->json($conversations);
    }

    // 🔹 Historique avec un utilisateur spécifique
    public function show(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;

        $messages = Message::where(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $userId)->where('receiver_id', $otherUserId);
        })->orWhere(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $otherUserId)->where('receiver_id', $userId);
        })
        ->with('product:id,title,price')
        ->oldest()
        ->get();

        // Marquer comme lu
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    // 🔹 Envoyer un message
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'product_id' => 'nullable|exists:products,id',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'product_id' => $request->product_id,
            'content' => $request->content,
        ]);

        return response()->json($message, 201);
    }
}
