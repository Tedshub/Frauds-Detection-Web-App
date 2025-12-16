<?php
// database/migrations/2025_12_15_085342_create_frauds_table.php
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
        Schema::create('frauds', function (Blueprint $table) {
            $table->id();
            $table->string('description')->nullable();

            // Kolom-kolom untuk setiap properti di dalam objek "input"
            $table->string('cc_num');
            $table->double('category', 8, 2);
            $table->decimal('amt', 12, 2);
            $table->double('gender', 3, 2);
            $table->double('city', 8, 2);
            $table->double('state', 8, 2);
            $table->integer('zip');
            $table->decimal('lat', 10, 8);
            $table->decimal('long', 11, 8);
            $table->integer('city_pop');
            $table->decimal('merch_lat', 10, 8);
            $table->decimal('merch_long', 11, 8);
            $table->double('hour', 4, 1);
            $table->double('dayofweek', 3, 1);
            $table->double('month', 3, 1);
            $table->unsignedTinyInteger('age');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('frauds');
    }
};
