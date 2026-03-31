<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    // 🔹 Liste tous les contacts (admin)
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return response()->json(['contacts' => Contact::all()]);
    }

    // 🔹 Créer un contact
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($request->only(['name', 'email', 'subject', 'message']));

        return response()->json([
            'message' => 'Message envoyé avec succès !',
            'contact' => $contact
        ], 201);
    }

    // 🔹 Afficher un contact spécifique (admin)
    public function show(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json(['message' => 'Message non trouvé'], 404);
        }

        return response()->json($contact);
    }
}
