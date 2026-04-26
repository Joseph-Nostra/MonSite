<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CallAction implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $receiverId;
    public $action; // 'accepted', 'rejected', 'ended'
    public $callId;

    public function __construct($receiverId, $action, $callId)
    {
        $this->receiverId = $receiverId;
        $this->action = $action;
        $this->callId = $callId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('messages.' . $this->receiverId),
        ];
    }
}
