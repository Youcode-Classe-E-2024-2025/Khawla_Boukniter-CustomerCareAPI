<?php

namespace App\Repositories;

use App\Models\Ticket;

class TicketRepository
{
    protected $ticketModel;

    public function __construct(Ticket $ticketModel)
    {
        $this->ticketModel = $ticketModel;
    }

    public function getAllTickets($perpage = 10, $filters = [])
    {
        $query = $this->ticketModel->with(['user', 'agent']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search)->orWhere('description', 'like', '%' . $search);
            });
        }

        return $query->latest()->paginate($perpage);
    }

    public function getUserTickets($userId, $perpage = 10, $filters = [])
    {
        $query = $this->ticketModel->where('user_id', $userId)->with(['user', 'agent']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perpage);
    }

    public function getAgentTickets($agentId, $perpage = 10, $filters = [])
    {
        $query = $this->ticketModel->where('agent_id', $agentId)->with(['user', 'agent']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perpage);
    }

    public function findById($id)
    {
        return $this->ticketModel->with(['user', 'agent', 'responses.user'])->find($id);
    }

    public function createTicket($data)
    {
        return $this->ticketModel->create($data);
    }

    public function updateTicket($id, $data)
    {
        $ticket = $this->findById($id);

        if ($ticket) {
            $ticket->update($data);
            return $ticket;
        }

        return null;
    }

    public function deleteTicket($id)
    {
        $ticket = $this->findById($id);

        if ($ticket) {
            return $ticket->delete();
        }

        return false;
    }

    public function assignTicket($ticketId, $agentId)
    {
        $ticket = $this->findById($ticketId);

        if ($ticket) {
            $ticket->agent_id = $agentId;
            $ticket->status = 'in_progress';

            $ticket->save();

            return $ticket;
        }

        return null;
    }

    public function changeStatus($ticketId, $status)
    {
        $ticket = $this->findById($ticketId);

        if ($ticket) {
            $ticket->status = $status;

            if ($status === 'resolved') {
                $ticket->resolved_at = now();
            } else if ($status === 'cancelled') {
                $ticket->cancelled_at = now();
            }

            $ticket->save();

            return $ticket;
        }

        return null;
    }
}
