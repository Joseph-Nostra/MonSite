<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    protected $fillable = [
        'order_id',
        'full_name',
        'address',
        'city',
        'zip_code',
        'phone',
        'status',
        'tracking_number',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
