<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
    'user_id',
    'total',
    'status',
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
}
