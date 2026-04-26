<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CallInitiated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $caller;
    public $receiverId;
    public $type;
    public $callId;

    public function __construct($caller, $receiverId, $type = 'audio')
    {
        $this->caller = $caller;
        $this->receiverId = $receiverId;
        $this->type = $type;
        $this->callId = uniqid('call_');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('messages.' . $this->receiverId),
        ];
    }
}
