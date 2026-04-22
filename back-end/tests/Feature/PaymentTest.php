<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Cart;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_checkout_with_delivery()
    {
        $user = User::factory()->create(['role' => 'client']);
        $product = Product::factory()->create(['stock' => 10, 'price' => 100]);
        
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 100
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/orders/checkout', [
                'payment_method' => 'delivery',
                'shipping_address' => [
                    'full_name' => 'John Doe',
                    'address' => '123 Main St',
                    'city' => 'Casablanca',
                    'zip_code' => '20000',
                    'phone' => '0600000000'
                ]
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'payment_method' => 'delivery',
            'status' => 'processing'
        ]);
        
        // Stock should be decremented for delivery
        $this->assertEquals(8, $product->fresh()->stock);
    }

    public function test_can_checkout_with_stripe()
    {
        $user = User::factory()->create(['role' => 'client']);
        $product = Product::factory()->create(['stock' => 10, 'price' => 100]);
        
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 100
        ]);

        // Mock Stripe configuration
        config(['services.stripe.secret' => 'sk_test_mock']);

        $response = $this->actingAs($user)
            ->postJson('/api/orders/checkout', [
                'payment_method' => 'card',
                'shipping_address' => [
                    'full_name' => 'John Doe',
                    'address' => '123 Main St',
                    'city' => 'Casablanca',
                    'zip_code' => '20000',
                    'phone' => '0600000000'
                ]
            ]);

        // Note: This will fail if Stripe key is not valid, but we can see the logic
        $response->assertStatus(200);
        $response->assertJsonStructure(['clientSecret', 'order_id']);
    }
}
