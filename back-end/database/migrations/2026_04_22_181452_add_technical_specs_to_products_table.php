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
        if (!Schema::hasColumn('products', 'cpu')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('cpu')->nullable()->after('performance_level');
            });
        }
        if (!Schema::hasColumn('products', 'ram')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('ram')->nullable()->after('cpu');
            });
        }
        if (!Schema::hasColumn('products', 'gpu')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('gpu')->nullable()->after('ram');
            });
        }
        if (!Schema::hasColumn('products', 'storage_type')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('storage_type')->nullable()->after('gpu');
            });
        }
        if (!Schema::hasColumn('products', 'storage_capacity')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('storage_capacity')->nullable()->after('storage_type');
            });
        }
        if (!Schema::hasColumn('products', 'screen_size')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('screen_size')->nullable()->after('storage_capacity');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['cpu', 'ram', 'gpu', 'storage_type', 'storage_capacity', 'screen_size']);
        });
    }
};
