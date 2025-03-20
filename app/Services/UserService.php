<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register($userData)
    {
        if ($this->userRepository->isEmailUnique($userData['email'])) {
            $userData['password'] = bcrypt($userData['password']);

            $user = $this->userRepository->createUser($userData);

            return $user;
        }

        return null;
    }
}
