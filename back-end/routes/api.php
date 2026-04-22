<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Contact
Route::post('/contacts', [ContactController::class, 'store']);

/*
|--------------------------------------------------------------------------
| AUTH ROUTES (USER)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // User
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |---------------- CART ----------------
    */
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    /*
    |---------------- ORDERS ----------------
    */
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/checkout', [OrderController::class, 'checkout']);

    /*
    |---------------- NOTIFICATIONS ----------------
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/mark-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    /*
    |---------------- MESSAGES ----------------
    |*/
    Route::get('/messages', [MessageController::class, 'index']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);
    Route::get('/messages/{otherUserId}', [MessageController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store']);

    /*
    |---------------- PAYMENTS ----------------
    */
    Route::post('/payments/paypal/capture', [PaymentController::class, 'capturePayPalOrder']);
});

// Public payment routes (Webhooks)
Route::post('/payments/webhook/stripe', [PaymentController::class, 'handleStripeWebhook']);

/*
|--------------------------------------------------------------------------
| SELLER + ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin,vendeur'])->group(function () {

    // Products management
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/my-products', [ProductController::class, 'myProducts']);
});

/*
|--------------------------------------------------------------------------
| ADMIN ONLY ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{id}', [ContactController::class, 'show']);
});
