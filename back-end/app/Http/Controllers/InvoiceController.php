<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Download the invoice for a specific order.
     */
    public function download(Request $request, $id)
    {
        $order = Order::with(['items.product', 'user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }

        // Check if user is owner of the order or admin/vendeur
        $user = $request->user();
        if ($user->id !== $order->user_id && $user->role === 'client') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $pdf = Pdf::loadView('invoices.template', compact('order'));

        return $pdf->download("facture-{$order->id}.pdf");
    }
}
