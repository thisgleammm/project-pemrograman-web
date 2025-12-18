<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\SparepartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SparepartUsageController;

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

    Route::get('sparepart', [SparepartController::class, 'index'])->name('sparepart.index');
    Route::post('sparepart', [SparepartController::class, 'store'])->name('sparepart.store');
    Route::put('sparepart/{sparepart}', [SparepartController::class, 'update'])->name('sparepart.update');
    Route::delete('sparepart/{sparepart}', [SparepartController::class, 'destroy'])->name('sparepart.destroy');

    Route::get('booking', [BookingController::class, 'index'])->name('booking.index');
    Route::get('booking/{booking}', [BookingController::class, 'show'])->name('booking.show');
    Route::post('booking', [BookingController::class, 'store'])->name('booking.store');
    Route::put('booking/{booking}', [BookingController::class, 'update'])->name('booking.update');
    Route::delete('booking/{booking}', [BookingController::class, 'destroy'])->name('booking.destroy');

    Route::post('sparepart-usage', [SparepartUsageController::class, 'store'])->name('sparepart-usage.store');
    Route::delete('sparepart-usage/{sparepartUsage}', [SparepartUsageController::class, 'destroy'])->name('sparepart-usage.destroy');
});

require __DIR__.'/settings.php';
