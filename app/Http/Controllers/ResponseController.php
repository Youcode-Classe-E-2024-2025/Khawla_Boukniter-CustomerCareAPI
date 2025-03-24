<?php

namespace App\Http\Controllers;

use App\Services\ResponseService;
use Illuminate\Http\Request;

class ResponseController extends Controller
{
    protected $responseService;

    public function __construct(ResponseService $responseService)
    {
        $this->responseService = $responseService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        $responses = $this->responseService->getTicketResponses($id);

        return response()->json([
            'responses' => $responses,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|string|exists:tickets,id',
            'content' => 'required|string'
        ]);

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
     * Display the specified resource.
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
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
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
