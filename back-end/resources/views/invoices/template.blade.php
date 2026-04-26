<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture #{{ $order->id }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d6efd; padding-bottom: 20px; margin-bottom: 20px; }
        .company-info h2 { color: #0d6efd; margin: 0; }
        .invoice-details { text-align: right; }
        .customer-info { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8f9fa; text-align: left; padding: 10px; border-bottom: 1px solid #dee2e6; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total-box { text-align: right; font-size: 1.2em; font-weight: bold; }
        .footer { text-align: center; margin-top: 50px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div className="invoice-box">
        <table style="width: 100%; border-bottom: 2px solid #0d6efd; margin-bottom: 20px;">
            <tr>
                <td>
                    <h2 style="color: #0d6efd; margin: 0;">MonSite E-Commerce</h2>
                    <p style="font-size: 0.9em; margin: 5px 0;">123 Rue de l'Informatique, Casablanca</p>
                </td>
                <td style="text-align: right;">
                    <h1 style="margin: 0; color: #555;">FACTURE</h1>
                    <p style="margin: 5px 0;"><strong># {{ $order->id }}</strong></p>
                    <p style="margin: 5px 0;">Date: {{ $order->created_at->format('d/m/Y') }}</p>
                </td>
            </tr>
        </table>

        <div className="customer-info" style="margin-bottom: 40px;">
            <p className="mb-1 text-muted">Facturé à:</p>
            <h3 style="margin: 5px 0;">{{ $order->full_name }}</h3>
            <p style="margin: 0;">{{ $order->address }}, {{ $order->city }}, {{ $order->zip_code }}</p>
            <p style="margin: 0;">Tél: {{ $order->phone }}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Produit</th>
                    <th style="text-align: center;">Qté</th>
                    <th style="text-align: right;">Prix Unitaire</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product->title }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->price, 2) }} €</td>
                    <td style="text-align: right;">{{ number_format($item->price * $item->quantity, 2) }} €</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div className="total-box">
            <p>TOTAL À PAYER: <span style="color: #0d6efd;">{{ number_format($order->total, 2) }} €</span></p>
        </div>

        <div className="footer">
            <p>Merci pour votre confiance !</p>
            <p>Toute facture non payée dans les délais pourra faire l'objet de pénalités de retard.</p>
        </div>
    </div>
</body>
</html>
