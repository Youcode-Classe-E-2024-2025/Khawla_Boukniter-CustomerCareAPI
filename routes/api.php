<?php

use App\Http\Controllers\ResponseController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);

    Route::apiResource('tickets', TicketController::class);

    Route::post('/tickets/{id}/cancel', [TicketController::class, 'cancel']);
    Route::post('/tickets/{id}/assign', [TicketController::class, 'assign']);
    Route::post('/tickets/{id}/status', [TicketController::class, 'changeStatus']);


    Route::apiResource('response', ResponseController::class)->except('index');

    Route::get('tickets/{id}/responses', [ResponseController::class, 'index']);
});
