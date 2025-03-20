<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function register(RegisterUserRequest $request)
    {
        $validated = $request->validated();

        $user = $this->userService->register($validated);

        if ($user) {
            return response()->json([
                'message' => 'user registered',
                'user' => $user,
            ], 201);
        }

        return response()->json(['message' => 'registration failed'], 422);
    }
}
