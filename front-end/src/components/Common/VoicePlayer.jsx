import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function VoicePlayer({ src, isMe, userAvatar, userName }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const onTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const onLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Mock waveform data
    const bars = [4, 8, 12, 10, 16, 14, 20, 18, 24, 22, 18, 14, 16, 12, 10, 8, 6, 10, 14, 18, 22, 20, 16, 12, 8, 4, 6, 10, 8, 12, 16, 14, 10, 6];

    return (
        <div className="premium-voice-player d-flex align-items-center gap-2 p-2 rounded-4" style={{ minWidth: '280px', backgroundColor: '#1e293b' }}>
            <audio 
                ref={audioRef} 
                src={src} 
                onTimeUpdate={onTimeUpdate} 
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
            
            {/* Play Button */}
            <button 
                type="button"
                className="btn btn-link text-white p-0 border-0 shadow-none d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
                onClick={togglePlay}
            >
                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>

            {/* Waveform & Time */}
            <div className="flex-grow-1 px-2">
                <div className="waveform-container d-flex align-items-center gap-1 mb-2" style={{ height: '30px' }}>
                    {bars.map((height, i) => {
                        const progress = (currentTime / (duration || 1)) * 100;
                        const barProgress = (i / bars.length) * 100;
                        const isActive = barProgress <= progress;
                        
                        return (
                            <div 
                                key={i}
                                className="waveform-bar"
                                style={{ 
                                    width: '3px', 
                                    height: `${height}px`, 
                                    backgroundColor: isActive ? '#3b82f6' : '#64748b',
                                    borderRadius: '4px',
                                    transition: 'all 0.1s ease'
                                }}
                            />
                        );
                    })}
                </div>
                <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '11px', color: '#94a3b8' }}>
                    <span>{formatTime(currentTime)}</span>
                    <span className="ms-auto">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* User Avatar with Mic Overlay */}
            <div className="position-relative ms-2">
                <UserAvatar name={userName} src={userAvatar} size={48} />
                <div 
                    className="position-absolute bottom-0 start-0 bg-dark rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '22px', height: '22px', border: '2px solid #1e293b' }}
                >
                    <Mic size={12} className="text-info" fill="#06b6d4" />
                </div>
            </div>

            <style>{`
                .premium-voice-player {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .premium-voice-player:hover {
                    background-color: #334155 !important;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
                }
                .waveform-bar:hover {
                    transform: scaleY(1.2);
                    background-color: #60a5fa !important;
                }
            `}</style>
        </div>
    );
}
