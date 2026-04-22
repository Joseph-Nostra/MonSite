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
        if (!Schema::hasColumn('orders', 'tracking_number')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('tracking_number')->nullable()->after('payment_status');
            });
        }
        if (!Schema::hasColumn('orders', 'carrier')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('carrier')->nullable()->after('tracking_number');
            });
        }
        if (!Schema::hasColumn('orders', 'shipping_label_url')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('shipping_label_url')->nullable()->after('carrier');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['tracking_number', 'carrier', 'shipping_label_url']);
        });
    }
};
