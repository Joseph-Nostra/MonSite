<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'product_id',
        'content',
        'read_at',
        'status',
        'file_path',
        'file_type',
        'reactions',
        'is_edited',
        'edit_history',
        'deleted_for',
        'is_deleted_for_everyone',
    ];

    protected $casts = [
        'reactions' => 'array',
        'read_at' => 'datetime',
        'edit_history' => 'array',
        'deleted_for' => 'array',
        'is_deleted_for_everyone' => 'boolean',
        'is_edited' => 'boolean',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
