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
        'deleted_at'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
