<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'address',
        'city',
        'zip_code',
        'phone',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
