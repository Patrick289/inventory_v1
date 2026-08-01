<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    //Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard', [productController::class, 'index'])->name('dashboard');
    Route::post('products', [productController::class, 'store'])->name('products.store');
    Route::put('products/{product}', [productController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [productController::class, 'destroy'])->name('products.destroy');
});

require __DIR__.'/settings.php';
