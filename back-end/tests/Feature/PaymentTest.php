<?php

namespace Tests\Feature;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;
class PaymentTest extends TestCase
{
    use RefreshDatabase;
    public function test_can_checkout_with_delivery(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'role' => 'client',
        ]);
        /** @var Product $product */
        $product = Product::factory()->create([
            'stock' => 10,
            'price' => 100,
        ]);
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'title' => $product->title,
            'price' => $product->price,
            'image' => $product->image,
            'quantity' => 2,
        ]);
        $response = $this->actingAs($user)
            ->postJson('/api/orders/checkout', [
                'payment_method' => 'delivery',
                'shipping_address' => [
                    'full_name' => 'John Doe',
                    'address' => '123 Main St',
                    'city' => 'Casablanca',
                    'zip_code' => '20000',
                    'phone' => '0600000000',
                ],
            ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'payment_method' => 'delivery',
            'status' => 'pending',
        ]);
        $this->assertEquals(8, $product->fresh()->stock);
    }
    public function test_can_checkout_with_stripe(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'role' => 'client',
        ]);
        /** @var Product $product */
        $product = Product::factory()->create([
            'stock' => 10,
            'price' => 100,
        ]);
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'title' => $product->title,
            'price' => $product->price,
            'image' => $product->image,
            'quantity' => 1,
        ]);
        config([
            'services.stripe.secret' => 'sk_test_mock',
        ]);
        $stripe = Mockery::mock('alias:Stripe\Stripe');
        $stripe
            ->shouldReceive('setApiKey')
            ->once()
            ->with('sk_test_mock');
        $paymentIntent = (object) [
            'id' => 'pi_test_123456',
            'client_secret' => 'pi_test_secret_123456',
        ];
        $paymentIntentMock = Mockery::mock('alias:Stripe\PaymentIntent');
        $paymentIntentMock
            ->shouldReceive('create')
            ->once()
            ->with(Mockery::on(function ($data) {
                return is_array($data)
                    && isset($data['amount'])
                    && (float) $data['amount'] === 10000.0
                    && isset($data['currency'])
                    && $data['currency'] === 'usd'
                    && isset($data['metadata'])
                    && is_array($data['metadata'])
                    && isset($data['metadata']['order_id']);
            }))
            ->andReturn($paymentIntent);
        $response = $this->actingAs($user)
            ->postJson('/api/orders/checkout', [
                'payment_method' => 'card',
                'shipping_address' => [
                    'full_name' => 'John Doe',
                    'address' => '123 Main St',
                    'city' => 'Casablanca',
                    'zip_code' => '20000',
                    'phone' => '0600000000',
                ],
            ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'order_id',
            'clientSecret',
        ]);
        $response->assertJson([
            'clientSecret' => 'pi_test_secret_123456',
        ]);
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'payment_method' => 'card',
            'payment_intent_id' => 'pi_test_123456',
        ]);
    }
}
