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
        Schema::table('messages', function (Blueprint $table) {
            $table->boolean('is_edited')->default(false);
            $table->json('edit_history')->nullable();
            $table->json('deleted_for')->nullable();
            $table->boolean('is_deleted_for_everyone')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['is_edited', 'edit_history', 'deleted_for', 'is_deleted_for_everyone']);
        });
    }
};
