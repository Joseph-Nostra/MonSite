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
        Schema::table('products', function (Blueprint $table) {
            $table->string('brand')->nullable()->after('description');
            $table->string('usage')->nullable()->after('brand'); // gaming, office, student, pro, dev
            $table->string('performance_level')->nullable()->after('usage'); // entry, mid, high, ultra
            $table->decimal('discount_rate', 5, 2)->default(0)->after('price');
            $table->boolean('is_new')->default(true)->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['brand', 'usage', 'performance_level', 'discount_rate', 'is_new']);
        });
    }
};
