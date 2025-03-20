<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

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

    public function login($data)
    {
        $user = $this->userRepository->findByEmail($data['email']);

        if ($user && Hash::check($data['password'], $user->password)) {
            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token,
            ];
        }

        return null;
    }

    public function logout($user)
    {
        $user->tokens()->delete();

        return true;
    }
}
