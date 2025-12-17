<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('customer', [CustomerController::class, 'index'])->name('customer.index');
    Route::post('customer', [CustomerController::class, 'store'])->name('customer.store');
    Route::put('customer/{customer}', [CustomerController::class, 'update'])->name('customer.update');
    Route::delete('customer/{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy');

    Route::get('vehicle', [VehicleController::class, 'index'])->name('vehicle.index');
    Route::post('vehicle', [VehicleController::class, 'store'])->name('vehicle.store');
    Route::put('vehicle/{vehicle}', [VehicleController::class, 'update'])->name('vehicle.update');
    Route::delete('vehicle/{vehicle}', [VehicleController::class, 'destroy'])->name('vehicle.destroy');
});

require __DIR__.'/settings.php';
