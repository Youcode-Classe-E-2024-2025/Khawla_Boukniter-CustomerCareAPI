<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    protected $userModel;

    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    public function findByName($name)
    {
        return $this->userModel->where('name', $name)->first();
    }

    public function findByEmail($email)
    {
        return $this->userModel->where('email', $email)->first();
    }

    public function findById($id)
    {
        return $this->userModel->find($id);
    }

    public function isEmailUnique($email)
    {
        return $this->userModel->where('email', $email)->doesntExist();
    }

    public function createUser($userData)
    {
        return $this->userModel->create($userData);
    }

    public function getAllAgents()
    {
        return $this->userModel->where('role', 'agent')->get();
    }
}
