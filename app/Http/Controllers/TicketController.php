<?php

namespace App\Http\Controllers;

use App\Services\TicketService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Tickets",
 *     description="API Endpoints for ticket management"
 * )
 */
class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

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
    public function index(Request $request)
    {
        $filters = $request->only(['status', 'search']);
        $perpage = $request->input('perpage', 10);

        $tickets = $this->ticketService->getAllTickets($filters, $perpage);

        return response()->json([
            'tickets' => $tickets,
        ], 200);
    }

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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $ticket = $this->ticketService->createTicket($validated);

        if (!$ticket) {
            return response()->json([
                'message' => 'only clients can create tickets',
            ], 403);
        }

        return response()->json([
            'ticket' => $ticket,
            'message' => 'ticket created'
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/tickets/{ticket}",
     *     summary="Get ticket details",
     *     tags={"Tickets"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="ticket",
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
    public function show(string $id)
    {
        $ticket = $this->ticketService->getTicket($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'not found'
            ], 404);
        }

        return response()->json([
            'ticket' => $ticket
        ], 200);
    }

    /**
     * @OA\Put(
     *     path="/api/tickets/{ticket}",
     *     summary="Update a ticket",
     *     tags={"Tickets"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="ticket",
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
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string'
        ]);

        $ticket = $this->ticketService->updateTicket($id, $validated);

        if (!$ticket) {
            return response()->json([
                'message' => 'not found'
            ], 404);
        }

        return response()->json([
            'ticket' => $ticket,
            'message' => 'ticket updated',
        ], 201);
    }

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
    public function cancel(string $id)
    {
        $ticket = $this->ticketService->cancelTicket($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'not found'
            ], 404);
        }

        return response()->json([
            'message' => "ticket cancelled"
        ], 200);
    }

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
    public function assign($id)
    {
        $ticket = $this->ticketService->assignTicket($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'not found'
            ], 404);
        }

        return response()->json([
            'ticket' => $ticket,
            'message' => 'ticket assigned'
        ], 200);
    }

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
    public function changeStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:open,in_progress,resolved,closed,cancelled'
        ]);

        $ticket = $this->ticketService->changeStatus($id, $validated['status']);

        if (!$ticket) {
            return response()->json([
                'message' => 'not found'
            ], 404);
        }

        return response()->json([
            'ticket' => $ticket,
            'message' => 'status changed'
        ], 200);
    }
}
