<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'image',
        'stock',
        'user_id' // 🔥 IMPORTANT
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
