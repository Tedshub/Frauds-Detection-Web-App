<?php
// routes/web.php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\FraudController;
use App\Http\Controllers\DashboardController; // <-- IMPORT THE NEW CONTROLLER

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- UPDATE THIS ROUTE ---
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
// -------------------------

// Transaction routes
Route::post('/predict', [TransactionController::class, 'predict'])->name('predict');

Route::get('/transactions', [TransactionController::class, 'index'])->middleware(['auth', 'verified'])->name('transactions.index');
Route::post('/transactions/predict', [TransactionController::class, 'predict'])->middleware(['auth', 'verified'])->name('transactions.predict');

// Fraud routes
Route::get('/fraudsList', [FraudController::class, 'index'])->middleware(['auth', 'verified'])->name('frauds.index');
Route::get('/frauds/{id}', [FraudController::class, 'show'])->middleware(['auth', 'verified'])->name('frauds.show');

// API routes for dropdown options
Route::get('/api/categories', [TransactionController::class, 'getCategories'])->middleware(['auth', 'verified']);
Route::get('/api/genders', [TransactionController::class, 'getGenders'])->middleware(['auth', 'verified']);
Route::get('/api/states', [TransactionController::class, 'getStates'])->middleware(['auth', 'verified']);
Route::get('/api/cities', [TransactionController::class, 'getCities'])->middleware(['auth', 'verified']);
Route::get('/api/days_of_week', [TransactionController::class, 'getDaysOfWeek'])->middleware(['auth', 'verified']);
Route::get('/api/months', [TransactionController::class, 'getMonths'])->middleware(['auth', 'verified']);
Route::get('/api/hours', [TransactionController::class, 'getHours'])->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
