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
        'is_preorder',
        'release_date',
        'youtube_url',
        'sales_count',
        'deleted_at'
    ];

    protected $appends = ['badges', 'average_rating'];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_rate' => 'decimal:2',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
        'is_preorder' => 'boolean',
        'release_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function getAverageRatingAttribute()
    {
        return round($this->reviews()->avg('rating'), 1) ?: 0;
    }

    public function getBadgesAttribute()
    {
        $badges = [];
        if ($this->is_preorder) $badges[] = ['type' => 'preorder', 'label' => 'Précommande', 'color' => 'info'];
        if ($this->sales_count > 50) $badges[] = ['type' => 'bestseller', 'label' => '🔥 Best Seller', 'color' => 'danger'];
        if ($this->stock > 0 && $this->stock < 5) $badges[] = ['type' => 'low_stock', 'label' => '⚡ Stock limité', 'color' => 'warning'];
        if ($this->discount_rate >= 15) $badges[] = ['type' => 'good_deal', 'label' => '💸 Bon prix', 'color' => 'success'];
        if ($this->is_new) $badges[] = ['type' => 'new', 'label' => 'Nouveau', 'color' => 'primary'];
        
        return $badges;
    }
}
