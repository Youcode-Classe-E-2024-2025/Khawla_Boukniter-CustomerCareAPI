<?php

namespace App\Services;

use App\Repositories\ResponseRepository;
use App\Repositories\TicketRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;

class ResponseService
{
    protected $userRepository;
    protected $ticketRepository;
    protected $responseRepository;

    public function __construct(ResponseRepository $responseRepository, TicketRepository $ticketRepository, UserRepository $userRepository)
    {
        $this->responseRepository = $responseRepository;
        $this->ticketRepository = $ticketRepository;
        $this->userRepository = $userRepository;
    }

    public function getTicketResponses($id)
    {
        $ticket = $this->ticketRepository->findById($id);

        if (!$ticket) {
            return null;
        }

        if (Auth::id() !== $ticket->user_id && !$this->userRepository->isAgent(Auth::id())) {
            return null;
        }

        return $this->responseRepository->getTicketResponses($id);
    }

    public function getResponse($id)
    {
        $response = $this->responseRepository->findById($id);
        $ticket = $this->ticketRepository->findById($response->ticket_id);

        if (!$response) {
            return null;
        }

        if (Auth::id() !== $ticket->user_id && !$this->userRepository->isAgent(Auth::id())) {
            return null;
        }

        return $response;
    }

    public function createResponse($data)
    {
        $id = $data['ticket_id'];
        $ticket = $this->ticketRepository->findById($id);

        if (!$ticket) {
            return null;
        }

        if ($this->userRepository->isAgent(Auth::id())) {
            if ($ticket->agent_id !== Auth::id()) {
                return null;
            }
        } else {
            if ($ticket->user_id !== Auth::id()) {
                return null;
            }
        }

        $data['user_id'] = Auth::id();

        $response = $this->responseRepository->createResponse($data);

        if ($this->userRepository->isAgent(Auth::id()) && $ticket->status === 'open') {
            $this->ticketRepository->changeStatus($id, 'in_progress');
        }

        return $response;
    }

    public function updateResponse($id, $data)
    {
        $response = $this->responseRepository->findById($id);

        if (!$response) {
            return null;
        }

        if (Auth::id() !== $response->user_id) {
            return null;
        }

        $data = ['content' => $data['content'] ?? $response->content];

        return $this->responseRepository->updateResponse($id, $data);
    }

    public function deleteResponse($id)
    {
        $response = $this->responseRepository->findById($id);

        if (!$response) {
            return false;
        }

        if (Auth::id() !== $response->user_id && $this->userRepository->isAgent(Auth::id())) {
            return false;
        }

        return $this->responseRepository->deleteResponse($id);
    }
}
