<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'cpu' => fake()->randomElement(['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5']),
            'ram' => fake()->randomElement(['8GB', '16GB', '32GB']),
            'storage_type' => fake()->randomElement(['SSD', 'HDD']),
            'storage_capacity' => fake()->randomElement(['256GB', '512GB', '1TB']),
            'gpu' => fake()->randomElement(['NVIDIA RTX 3050', 'NVIDIA RTX 4060', 'AMD Radeon']),
            'screen_size' => fake()->randomElement(['14"', '15.6"', '17"']),
            'brand' => fake()->randomElement(['Dell', 'HP', 'Lenovo', 'Asus']),
            'usage' => fake()->randomElement(['Gaming', 'Professional', 'Student']),
            'performance_level' => fake()->randomElement(['Entry', 'Mid-range', 'High-end']),
            'price' => fake()->randomFloat(2, 50, 5000),
            'discount_rate' => fake()->randomFloat(2, 0, 30),
            'image' => 'products/default.jpg',
            'youtube_url' => null,
            'stock' => 10,
            'sales_count' => 0,
            'is_active' => true,
            'is_preorder' => false,
            'release_date' => null,
            'is_new' => true,
        ];
    }
}