<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Events\CallInitiated;
use App\Events\CallAction;
use App\Events\MessageReactionUpdated;

class MessageController extends Controller
{
    // 🔹 Gérer les actions d'appel (accepter, rejeter, raccrocher)
    public function handleCallAction(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'action' => 'required|in:accepted,rejected,ended',
            'call_id' => 'required|string',
        ]);

        broadcast(new CallAction($request->receiver_id, $request->action, $request->call_id))->toOthers();

        return response()->json(['success' => true]);
    }

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
        $unreadMessages = Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->get();

        if ($unreadMessages->count() > 0) {
            Message::whereIn('id', $unreadMessages->pluck('id'))->update([
                'read_at' => now(),
                'status' => 'seen'
            ]);

            foreach ($unreadMessages as $msg) {
                broadcast(new \App\Events\MessageStatusUpdated($msg->id, 'seen', $otherUserId))->toOthers();
            }
        }

        return response()->json($messages);
    }

    // 🔹 Envoyer un message
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required_without:file|nullable|string',
            'product_id' => 'nullable|exists:products,id',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        $filePath = null;
        $fileType = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('chat_attachments', 'public');
            
            $mime = $file->getMimeType();
            if (str_starts_with($mime, 'image/')) {
                $fileType = 'image';
            } elseif (str_starts_with($mime, 'audio/')) {
                $fileType = 'audio';
            } else {
                $fileType = 'file';
            }
        }

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'product_id' => $request->product_id,
            'content' => $request->content ?? '',
            'status' => 'sent',
            'file_path' => $filePath,
            'file_type' => $fileType,
        ]);

        // 🔥 Diffuser l'événement en temps réel
        broadcast(new \App\Events\MessageSent($message))->toOthers();

        // 🔥 Créer une notification pour le destinataire
        \App\Models\Notification::create([
            'user_id' => $request->receiver_id,
            'type' => 'message',
            'message' => "💬 Nouveau message de " . $request->user()->name,
            'data' => [
                'message_id' => $message->id,
                'sender_name' => $request->user()->name,
                'sender_id' => $request->user()->id,
                'short_content' => \Illuminate\Support\Str::limit($request->content, 50)
            ]
        ]);

        return response()->json($message, 201);
    }

    // 🔹 Nombre de messages non lus
    public function unreadCount(Request $request)
    {
        $count = Message::where('receiver_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    // 🔹 Marquer un message spécifique comme lu
    public function markAsRead(Request $request, Message $message)
    {
        if ($message->receiver_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($message->status !== 'seen') {
            $message->update([
                'read_at' => now(),
                'status' => 'seen'
            ]);

            broadcast(new \App\Events\MessageStatusUpdated($message->id, 'seen', $message->sender_id))->toOthers();
        }

        return response()->json(['success' => true]);
    }

    // 🔹 Initier un appel
    public function initiateCall(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'type' => 'required|in:audio,video',
        ]);

        $caller = $request->user();
        
        $event = new CallInitiated([
            'id' => $caller->id,
            'name' => $caller->name
        ], $request->receiver_id, $request->type);
        
        broadcast($event)->toOthers();

        return response()->json([
            'success' => true, 
            'message' => 'Call initiated',
            'callId' => $event->callId
        ]);
    }

    // 🔹 Réagir à un message
    public function react(Request $request, Message $message)
    {
        $request->validate([
            'reaction' => 'required|string', // emoji
        ]);

        $userId = $request->user()->id;
        $reactions = $message->reactions ?? [];

        // Si l'utilisateur a déjà réagi avec cet emoji, on le retire, sinon on l'ajoute
        if (isset($reactions[$request->reaction]) && in_array($userId, $reactions[$request->reaction])) {
            $reactions[$request->reaction] = array_values(array_diff($reactions[$request->reaction], [$userId]));
            if (empty($reactions[$request->reaction])) {
                unset($reactions[$request->reaction]);
            }
        } else {
            $reactions[$request->reaction][] = $userId;
        }

        $message->update(['reactions' => $reactions]);

        $otherUserId = ($message->sender_id == $userId) ? $message->receiver_id : $message->sender_id;
        broadcast(new MessageReactionUpdated($message->id, $reactions, $otherUserId))->toOthers();

        return response()->json($reactions);
    }
}
