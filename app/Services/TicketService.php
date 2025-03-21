<?php

namespace App\Services;

use App\Repositories\TicketRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use tidy;

class TicketService
{
    protected $ticketRepository;
    protected $userRepository;

    public function __construct(TicketRepository $ticketRepository, UserRepository $userRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->userRepository = $userRepository;
    }

    public function getAllTickets($filters = [], $perpage = 10)
    {
        if (!$this->userRepository->isAgent(Auth::id())) {
            return $this->getUserTickets(Auth::id(), $filters, $perpage);
        }

        return $this->ticketRepository->getAllTickets($perpage, $filters);
    }

    public function getUserTickets($userId, $filters = [], $perpage = 10)
    {
        if (Auth::id() !== $userId && !$this->userRepository->isAgent(Auth::id())) {
            return $this->ticketRepository->getUserTickets(0, $perpage, $filters);
        }

        return $this->ticketRepository->getUserTickets($userId, $perpage, $filters);
    }

    public function getTicket($id)
    {
        $ticket = $this->ticketRepository->findById($id);

        if (!$ticket) {
            return null;
        }

        if (Auth::id() !== $ticket->user_id && !$this->userRepository->isAgent(Auth::id())) {
            return null;
        }

        return $ticket;
    }

    public function createTicket($data)
    {
        $data['user_id'] = Auth::id();
        $data['status'] = 'open';

        return $this->ticketRepository->createTicket($data);
    }

    public function updateTicket($id, $data)
    {
        $ticket = $this->ticketRepository->findById($id);

        if (!$ticket) {
            return null;
        }

        if (Auth::id() !== $ticket->user_id && !$this->userRepository->isAgent(Auth::id())) {
            return null;
        }

        if (!$this->userRepository->isAgent(Auth::id())) {
            $data = [
                'title' => $data['title'] ?? $ticket->title,
                'description' => $data['description'] ?? $ticket->description,
            ];
        }

        return $this->ticketRepository->updateTicket($id, $data);
    }

    public function deleteTicket($id)
    {
        $ticket = $this->ticketRepository->findById($id);

        if (!$ticket) {
            return false;
        }

        return $this->ticketRepository->deleteTicket($id);
    }
}
