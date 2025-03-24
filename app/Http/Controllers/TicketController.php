<?php

namespace App\Http\Controllers;

use App\Services\TicketService;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    /**
     * Display a listing of the resource.
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
     * Store a newly created resource in storage.
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
     * Display the specified resource.
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
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
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
