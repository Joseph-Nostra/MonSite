<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $row) {
            $row->id();
            $row->foreignId('order_id')->constrained()->onDelete('cascade');
            $row->foreignId('user_id')->constrained()->onDelete('cascade');
            $row->decimal('amount', 10, 2);
            $row->string('method'); // stripe, paypal, cod
            $row->string('status')->default('pending'); // paid, pending, failed, refunded
            $row->string('transaction_id')->nullable(); // stripe/paypal intent id
            $row->json('metadata')->nullable();
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
