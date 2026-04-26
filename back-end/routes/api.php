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
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\InformationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\SimulatorController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ComparisonController;
use App\Http\Controllers\InvoiceController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);
Route::post('/products/{id}/view', [RecommendationController::class, 'logView']);
Route::get('/recommendations', [RecommendationController::class, 'index']);
Route::get('/comparison', [ComparisonController::class, 'index']);

// Simulator
Route::post('/simulator/recommend', [SimulatorController::class, 'recommend']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
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
    Route::get('/orders/{id}/invoice', [InvoiceController::class, 'download']);
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
    Route::post('/messages/call', [MessageController::class, 'initiateCall']);
    Route::post('/messages/call/action', [MessageController::class, 'handleCallAction']);
    Route::post('/messages/{message}/react', [MessageController::class, 'react']);
    Route::post('/messages/{message}/read', [MessageController::class, 'markAsRead']);
    Route::put('/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);

    /*
    |---------------- PAYMENTS ----------------
    */
    Route::post('/payments/paypal/capture', [PaymentController::class, 'capturePayPalOrder']);

    /*
    |---------------- SETTINGS ----------------
    */
    Route::post('/settings/profile', [SettingsController::class, 'updateProfile']);
    Route::post('/settings/password', [SettingsController::class, 'changePassword']);
    Route::get('/settings/addresses', [SettingsController::class, 'indexAddresses']);
    Route::post('/settings/addresses', [SettingsController::class, 'storeAddress']);
    Route::put('/settings/addresses/{id}', [SettingsController::class, 'updateAddress']);
    Route::delete('/settings/addresses/{id}', [SettingsController::class, 'destroyAddress']);
    Route::get('/settings/payments', [SettingsController::class, 'paymentHistory']);
    Route::get('/settings/revenue', [SettingsController::class, 'sellerRevenue']);
    Route::get('/settings/notifications/preferences', [SettingsController::class, 'getNotificationPreferences']);
    Route::post('/settings/notifications/preferences', [SettingsController::class, 'updateNotificationPreferences']);

    /*
    |---------------- REVIEWS & WISHLIST ----------------
    */
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
});

// Public payment routes (Webhooks)
Route::post('/stripe/webhook', [PaymentController::class, 'handleStripeWebhook']);

// Informational pages
Route::get('/info/{slug}', [InformationController::class, 'show']);

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

    // Orders management
    Route::get('/seller/orders', [OrderController::class, 'sellerOrders']);
    Route::get('/seller/customers', [OrderController::class, 'sellerCustomers']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
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
