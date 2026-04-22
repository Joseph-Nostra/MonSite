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
            $table->string('full_name')->nullable()->after('user_id');
            $table->string('address')->nullable()->after('full_name');
            $table->string('city')->nullable()->after('address');
            $table->string('zip_code')->nullable()->after('city');
            $table->string('phone')->nullable()->after('zip_code');
            $table->text('notes')->nullable()->after('phone');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('cpu')->nullable()->after('description');
            $table->string('ram')->nullable()->after('cpu');
            $table->string('storage')->nullable()->after('ram');
            $table->string('gpu')->nullable()->after('storage');
            $table->string('screen_size')->nullable()->after('gpu');
            $table->boolean('is_active')->default(true)->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['full_name', 'address', 'city', 'zip_code', 'phone', 'notes']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['cpu', 'ram', 'storage', 'gpu', 'screen_size', 'is_active']);
        });
    }
};
