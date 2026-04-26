import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function VoicePlayer({ src, isMe }) {
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
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const onSeek = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className={`d-flex align-items-center gap-3 p-2 rounded-4 shadow-sm w-100 ${isMe ? 'bg-primary bg-opacity-25' : 'bg-light'}`} style={{ minWidth: '220px' }}>
            <audio 
                ref={audioRef} 
                src={src} 
                onTimeUpdate={onTimeUpdate} 
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
            
            <button 
                type="button"
                className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${isMe ? 'btn-light text-primary' : 'btn-primary text-white'}`}
                style={{ width: '36px', height: '36px' }}
                onClick={togglePlay}
            >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            <div className="flex-grow-1 position-relative">
                <input 
                    type="range" 
                    className="form-range custom-voice-range w-100" 
                    min="0" 
                    max={duration || 100} 
                    value={currentTime}
                    onChange={onSeek}
                />
                <div className="d-flex justify-content-between mt-1" style={{ fontSize: '10px', opacity: 0.7 }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <Volume2 size={16} className="text-muted d-none d-sm-block" />

            <style>{`
                .custom-voice-range {
                    height: 4px;
                    background: ${isMe ? 'rgba(255,255,255,0.2)' : '#e2e8f0'};
                    border-radius: 2px;
                    outline: none;
                }
                .custom-voice-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: ${isMe ? '#fff' : '#0d6efd'};
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
}
