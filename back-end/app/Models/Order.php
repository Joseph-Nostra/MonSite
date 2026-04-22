<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
    'user_id',
    'total',
    'status',
    'payment_method',
    'payment_intent_id',
    'paypal_order_id',
    'payment_status',
];

    // 🔥 relation user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔥 relation items
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    // 🔥 relation shipping
    public function shipping()
    {
        return $this->hasOne(Shipping::class);
    }
}
