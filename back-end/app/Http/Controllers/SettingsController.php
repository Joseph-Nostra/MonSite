<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\Address;
use App\Models\Client;
use App\Models\Vendeur;

class SettingsController extends Controller
{
    /**
     * 👤 METTRE À JOUR LE PROFIL
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user->name = $request->name;
        $user->phone = $request->phone;

        if ($request->hasFile('avatar')) {
            // Supprimer l'ancien avatar si existe
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * 🔐 CHANGER LE MOT DE PASSE
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'L\'ancien mot de passe est incorrect'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }

    /**
     * 🏠 GESTION DES ADRESSES
     */
    public function indexAddresses(Request $request)
    {
        return response()->json($request->user()->addresses);
    }

    public function storeAddress(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'zip_code' => 'required|string',
            'phone' => 'required|string',
            'is_default' => 'boolean'
        ]);

        $user = $request->user();

        // Si c'est la première adresse ou marquée par défaut, décocher les autres
        if ($request->is_default || $user->addresses()->count() === 0) {
            $user->addresses()->update(['is_default' => false]);
            $is_default = true;
        } else {
            $is_default = false;
        }

        $address = $user->addresses()->create(array_merge($request->all(), ['is_default' => $is_default]));

        return response()->json($address);
    }

    public function updateAddress(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $request->validate([
            'full_name' => 'required',
            'address' => 'required',
            'city' => 'required',
            'zip_code' => 'required',
            'phone' => 'required',
            'is_default' => 'boolean'
        ]);

        if ($request->is_default) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($request->all());

        return response()->json($address);
    }

    public function destroyAddress(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $was_default = $address->is_default;
        $address->delete();

        // Si on a supprimé l'adresse par défaut, mettre une autre par défaut si existe
        if ($was_default) {
            $next = $request->user()->addresses()->first();
            if ($next) $next->update(['is_default' => true]);
        }

        return response()->json(['message' => 'Adresse supprimée']);
    }

    /**
     * 💳 HISTORIQUE DES PAIEMENTS (CLIENT)
     */
    public function paymentHistory(Request $request)
    {
        $payments = \App\Models\Payment::where('user_id', $request->user()->id)
            ->with('order')
            ->latest()
            ->get();

        return response()->json($payments);
    }

    /**
     * 🏪 STATISTIQUES REVENUS (VENDEUR)
     */
    public function sellerRevenue(Request $request)
    {
        $user = $request->user();
        
        // Toutes les commandes contenant des produits de ce vendeur
        $orderItems = \App\Models\OrderItem::whereHas('product', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->with(['order.payment', 'product'])->get();

        $totalRevenue = 0;
        $salesCount = 0;
        $transactions = [];

        foreach ($orderItems as $item) {
            $amount = $item->price * $item->quantity;
            $totalRevenue += $amount;
            $salesCount++;

            $transactions[] = [
                'order_id' => $item->order_id,
                'product' => $item->product->title,
                'amount' => $amount,
                'status' => $item->order->payment_status,
                'date' => $item->created_at,
                'method' => $item->order->payment_method ?? 'card'
            ];
        }

        return response()->json([
            'total_revenue' => $totalRevenue,
            'sales_count' => $salesCount,
            'commission_rate' => 0.05, // 5% de commission par exemple
            'net_revenue' => $totalRevenue * 0.95,
            'transactions' => $transactions
        ]);
    }

    /**
     * 🔔 RÉCUPÉRER LES PRÉFÉRENCES DE NOTIFICATION
     */
    public function getNotificationPreferences(Request $request)
    {
        $user = $request->user();
        $prefs = $user->notification_preferences;

        if (!$prefs) {
            // Valeurs par défaut selon le rôle
            if ($user->role === 'vendeur' || $user->role === 'admin') {
                $prefs = [
                    'new_order' => true,
                    'payment_received' => true,
                    'low_stock' => true,
                    'product_sold' => true,
                    'disputes' => true,
                    'channels' => ['email' => true, 'dashboard' => true, 'sms' => false]
                ];
            } else {
                $prefs = [
                    'orders' => ['confirmed' => true, 'shipping' => true, 'delivered' => true, 'canceled' => true],
                    'payments' => ['success' => true, 'failed' => true, 'refund' => true],
                    'promotions' => ['discounts' => true, 'promo_codes' => true, 'new_products' => true],
                    'delivery' => ['shipped' => true, 'out_for_delivery' => true, 'delivered' => true],
                    'channels' => ['email' => true, 'sms' => false, 'in_app' => true]
                ];
            }
        }

        return response()->json($prefs);
    }

    /**
     * 🔔 METTRE À JOUR LES PRÉFÉRENCES
     */
    public function updateNotificationPreferences(Request $request)
    {
        $user = $request->user();
        $user->update([
            'notification_preferences' => $request->all()
        ]);

        return response()->json(['message' => 'Préférences mises à jour', 'preferences' => $user->notification_preferences]);
    }
}
