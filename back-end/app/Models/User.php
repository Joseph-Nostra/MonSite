<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Order[] $orders
 */
class User extends Authenticatable
{
    const ROLE_ADMIN = 'admin';
    const ROLE_SELLER = 'vendeur';
    const ROLE_CLIENT = 'client';
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role' // 🔥 AJOUTER
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function vendeur()
    {
        return $this->hasOne(Vendeur::class);
    }

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relation commandes
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function isAdmin() {
        return $this->role === self::ROLE_ADMIN;
    }
    public function isSeller() {
        return $this->role === self::ROLE_SELLER;
    }
    public function isClient() {
        return $this->role === self::ROLE_CLIENT;
    }
}
