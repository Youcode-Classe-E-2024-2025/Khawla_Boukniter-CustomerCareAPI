<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;

/**
 * @OA\Info(
 *     title="Customer Care API",
 *     version="1.0.0",
 *     description="API for Customer Care System",
 * )
 * @OA\Tag(
 *     name="Authentication",
 *     description="API Endpoints for authentication"
 * )
 * @OA\SecurityScheme(
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="bearerAuth"
 * )
 */
class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Register new user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="user", type="object", 
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string", format="email")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error or email already exists",
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="Login a user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User logged in",
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials",
     *     )
     * )
     */
    public function login(LoginUserRequest $request)
    {
        $validated = $request->validated();

        $result = $this->userService->login($validated);

        if ($result) {
            return response()->json([
                'message' => 'user logged in',
                'user' => $result['user'],
                'token' => $result['token'],
            ], 200);
        }

        return response()->json(['message' => 'invalid credentials'], 401);
    }

    /**
     * @OA\Post(
     *     path="/api/logout",
     *     summary="Logout a user",
     *     tags={"Authentication"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Response(
     *         response=200,
     *         description="User logged out",
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $this->userService->logout($request->user());

        return response()->json(['message' => 'user logged out'], 200);
    }
}
