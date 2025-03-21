<?php

namespace App\Repositories;

use App\Models\Response;

class ResponseRepository
{
    protected $responseModel;

    public function __construct(Response $response)
    {
        $this->responseModel = $response;
    }

    public function findById($id)
    {
        return $this->responseModel->with('user')->find($id);
    }

    public function getTicketResponses($id)
    {
        return $this->responseModel->where('ticket_id', $id)->with('users')->orderBy('created_at', 'desc')->get();
    }

    public function createResponse($data)
    {
        return $this->responseModel->create($data);
    }

    public function updateResponse($id, $data)
    {
        $response = $this->findById($id);

        if ($response) {
            $response->update($data);

            return $response;
        }

        return null;
    }

    public function deleteResponse($id)
    {
        $response = $this->findById($id);

        if ($response) {
            return $response->delete();
        }

        return false;
    }
}
