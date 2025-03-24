<?php

/**
 * @OA\Tag(
 *     name="Responses",
 *     description="API Endpoints for ticket responses"
 * )
 */

/**
 * @OA\Get(
 *     path="/api/tickets/{ticket_id}/responses",
 *     summary="Get all responses for a ticket",
 *     tags={"Responses"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="ticket_id",
 *         in="path",
 *         description="Ticket ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of responses",
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
 *     path="/api/tickets/{ticket_id}/responses",
 *     summary="Add a response to a ticket",
 *     tags={"Responses"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="ticket_id",
 *         in="path",
 *         description="Ticket ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"content"},
 *             @OA\Property(property="content", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Response added",
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
 * @OA\Get(
 *     path="/api/responses/{id}",
 *     summary="Get response details",
 *     tags={"Responses"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Response ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Response details",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Response not found",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */

/**
 * @OA\Put(
 *     path="/api/responses/{id}",
 *     summary="Update a response",
 *     tags={"Responses"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Response ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"content"},
 *             @OA\Property(property="content", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Response updated",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Response not found",
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
 * @OA\Delete(
 *     path="/api/responses/{id}",
 *     summary="Delete a response",
 *     tags={"Responses"},
 *     security={{ "bearerAuth": {} }},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="Response ID",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Response deleted",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Response not found",
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *     )
 * )
 */
