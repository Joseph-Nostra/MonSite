<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendeur extends Model
{
    protected $fillable = ['user_id', 'boutique', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
