<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();
            
            // Only update if it's been more than a minute to avoid excessive DB writes
            $lastSeen = $user->last_seen_at;
            if (!$user->is_online || !$lastSeen || $lastSeen->diffInMinutes(now()) >= 1) {
                $user->update([
                    'last_seen_at' => now(),
                    'is_online' => true
                ]);

                broadcast(new \App\Events\UserStatusUpdated($user->id, true, now()))->toOthers();
            }
        }

        return $next($request);
    }
}
