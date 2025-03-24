<?php

namespace App\Http\Controllers;

use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(
 *     name="Responses",
 *     description="API Endpoints for ticket responses"
 * )
 */
class ResponseController extends Controller
{
    protected $responseService;

    public function __construct(ResponseService $responseService)
    {
        $this->responseService = $responseService;
    }

    /**
     * @OA\Get(
     *     path="/api/tickets/{id}/responses",
     *     summary="Get all responses for a ticket",
     *     tags={"Responses"},
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
    public function index($id)
    {
        Log::info('Getting responses for ticket', ['ticket_id' => $id]);
        try {
            $responses = $this->responseService->getTicketResponses($id);
            Log::info('Retrieved responses successfully', ['count' => count($responses)]);

            return response()->json([
                'responses' => $responses,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error getting responses', [
                'ticket_id' => $id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving responses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/tickets/{ticket_id}/responses",
     *     summary="Add a response to a ticket",
     *     tags={"Responses"},
     *     security={{ "bearerAuth": {} }},
     * @OA\Parameter(
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
    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $validated['ticket_id'] = $id;

        $response = $this->responseService->createResponse($validated);

        if (!$response) {
            return response()->json([
                'message' => "you can't add response to this ticket"
            ], 403);
        }

        return response()->json([
            'response' => $response,
            'message' => 'response created'
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/response/{response}",
     *     summary="Get response details",
     *     tags={"Responses"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="response",
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
    public function show(string $id)
    {
        $response = $this->responseService->getResponse($id);

        if (!$response) {
            return response()->json([
                'message' => 'not fount',
            ], 404);
        }

        return response()->json([
            'response' => $response
        ], 200);
    }

    /**
     * @OA\Put(
     *     path="/api/response/{response}",
     *     summary="Update a response",
     *     tags={"Responses"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="response",
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
    public function update(Request $request, string $id)
    {
        $validated = $request->validate(['content' => 'required|string']);

        $response = $this->responseService->updateResponse($id, $validated);

        if (!$response) {
            return response()->json([
                'message' => 'not found',
            ], 404);
        }

        return response()->json([
            'response' => $response,
            'message' => 'response updated'
        ], 201);
    }

    /**
     * @OA\Delete(
     *     path="/api/response/{response}",
     *     summary="Delete a response",
     *     tags={"Responses"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="response",
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
    public function destroy(string $id)
    {
        $result = $this->responseService->deleteResponse($id);

        if (!$result) {
            return response()->json([
                'message' => 'not found',
            ], 404);
        }

        return response()->json([
            'message' => 'response deleted',
        ], 200);
    }
}
