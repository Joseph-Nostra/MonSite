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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_intent_id')->nullable()->after('payment_method');
            $table->string('paypal_order_id')->nullable()->after('payment_intent_id');
            $table->string('payment_status')->default('pending')->after('paypal_order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_intent_id', 'paypal_order_id', 'payment_status']);
        });
    }
};
