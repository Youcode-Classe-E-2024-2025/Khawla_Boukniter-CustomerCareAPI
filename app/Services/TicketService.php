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
        if ($this->userRepository->isAgent(Auth::id())) {
            return null;
        }

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

        if (Auth::id() !== $ticket->user_id || $this->userRepository->isAgent(Auth::id())) {
            return null;
        }

        $data = [
            'title' => $data['title'] ?? $ticket->title,
            'description' => $data['description'] ?? $ticket->description,
        ];

        return $this->ticketRepository->updateTicket($id, $data);
    }

    public function cancelTicket($id)
    {
        $ticket = $this->ticketRepository->findById($id);

        if (!$ticket) {
            return false;
        }

        if (Auth::id() !== $ticket->user_id) {
            return false;
        }

        return $this->ticketRepository->changeStatus($id, 'cancelled');
    }

    public function assignTicket($id)
    {
        if (!$this->userRepository->isAgent(Auth::id())) {
            return null;
        }

        $ticket = $this->ticketRepository->findById($id);
        if (!$ticket) {
            return null;
        }

        return $this->ticketRepository->assignTicket($id, Auth::id());
    }

    public function changeStatus($id, $status)
    {
        $ticket = $this->ticketRepository->findById($id);

        if (!$ticket) {
            return null;
        }

        if (!$this->userRepository->isAgent(Auth::id())) {
            if (Auth::id() !== $ticket->user_id || $status !== 'cancelled') {
                return null;
            }
        }

        return $this->ticketRepository->changeStatus($id, $status);
    }
}
