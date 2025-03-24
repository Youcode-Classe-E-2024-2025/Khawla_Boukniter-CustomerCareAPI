<?php

/**
 * @OA\Tag(
 *     name="Tickets",
 *     description="API Endpoints for ticket management"
 * )
 */

/**
 * @OA\Get(
 *     path="/api/tickets",
 *     summary="Get all tickets",
 *     tags={"Tickets"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="status",
 *         in="query",
 *         description="Filter by status",
 *         required=false,
 *         @OA\Schema(type="string", enum={"open", "in_progress", "resolved", "closed", "cancelled"})
 *     ),
 *     @OA\Parameter(
 *         name="search",
 *         in="query",
 *         description="Search in title and description",
 *         required=false,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Parameter(
 *         name="perpage",
 *         in="query",
 *         description="Items per page",
 *         required=false,
 *         @OA\Schema(type="integer", default=10)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of tickets",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/tickets",
 *     summary="Create a new ticket",
 *     tags={"Tickets"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"title", "description"},
 *             @OA\Property(property="title", type="string"),
 *             @OA\Property(property="description", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Ticket created",
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Only clients can create tickets",
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */

/**
 * @OA\Get(
 *     path="/api/tickets/{id}",
 *     summary="Get ticket details",
 *     tags={"Tickets"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Ticket ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Ticket details",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Ticket not found",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */

/**
 * @OA\Put(
 *     path="/api/tickets/{id}",
 *     summary="Update a ticket",
 *     tags={"Tickets"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Ticket ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string"),
 *             @OA\Property(property="description", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Ticket updated",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Ticket not found",
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/tickets/{id}/cancel",
 *     summary="Cancel a ticket",
 *     tags={"Tickets"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Ticket ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Ticket cancelled",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Ticket not found",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/tickets/{id}/assign",
 *     summary="Assign ticket to current agent",
 *     tags={"Tickets"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Ticket ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Ticket assigned",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Ticket not found",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/tickets/{id}/status",
 *     summary="Change ticket status",
 *     tags={"Tickets"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Ticket ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"status"},
 *             @OA\Property(
 *                 property="status", 
 *                 type="string",
 *                 enum={"open", "in_progress", "resolved", "closed", "cancelled"}
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Status changed",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Ticket not found",
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */
