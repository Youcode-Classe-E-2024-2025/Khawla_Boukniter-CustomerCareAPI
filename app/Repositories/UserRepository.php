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

    public function isEmailUnique($email)
    {
        return $this->userModel->where('email', $email)->doesntExist();
    }

    public function createUser($userData)
    {
        return $this->userModel->create($userData);
    }
}
