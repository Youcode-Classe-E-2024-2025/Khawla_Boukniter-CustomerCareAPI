<?php

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
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error or email already exists",
 *     )
 * )
 */

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
