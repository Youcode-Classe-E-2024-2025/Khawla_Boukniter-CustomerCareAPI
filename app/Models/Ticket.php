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
        'resolved_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agant_id');
    }

    public function reponses()
    {
        return $this->hasMany(Response::class);
    }
}
