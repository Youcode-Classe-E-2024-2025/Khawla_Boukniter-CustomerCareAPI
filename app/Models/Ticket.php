<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'user_id',
        'agent_id',
        'title',
        'description',
        'status',
        'resolved_at',
        'cancelled_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}
