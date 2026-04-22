<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'title',
        'description',
        'price',
        'image',
        'stock',
        'user_id',
        'brand',
        'usage',
        'performance_level',
        'discount_rate',
        'is_new',
        'cpu',
        'ram',
        'storage_type',
        'storage_capacity',
        'gpu',
        'screen_size',
        'is_active',
        'deleted_at'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_rate' => 'decimal:2',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
