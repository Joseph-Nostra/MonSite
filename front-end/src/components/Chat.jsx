import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import { useTranslation } from "react-i18next";
import { Send, ArrowLeft, MoreVertical, CheckCheck, Check, Mic, Square, Trash2, Phone, Video } from "lucide-react";
import echo from "../echo";
import UserAvatar from "./Common/UserAvatar";
import LoadingSpinner from "./Common/LoadingSpinner";
import VoicePlayer from "./Common/VoicePlayer";

export default function Chat({ user }) {
  const { t } = useTranslation();
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${otherUserId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Erreur fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // 🔥 Real-time Listeners
    const channel = echo.private(`messages.${user.id}`)
      .listen('MessageSent', (e) => {
        if (e.message.sender_id == otherUserId) {
            setMessages(prev => [...prev, e.message]);
            // Notify backend that we've seen this message if we are in the chat
            api.post(`/messages/${e.message.id}/read`);
        }
      })
      .listen('MessageStatusUpdated', (e) => {
        setMessages(prev => prev.map(m => 
            m.id === e.messageId ? { ...m, status: e.status, read_at: e.status === 'seen' ? new Date() : m.read_at } : m
        ));
      })
      .listen('CallInitiated', (e) => {
        setIncomingCall(e);
      })
      .listen('CallAction', (e) => {
        if (e.action === 'rejected' || e.action === 'ended') {
            setActiveCall(null);
            setIncomingCall(null);
        } else if (e.action === 'accepted') {
            setActiveCall(prev => prev ? { ...prev, status: 'ongoing' } : null);
        }
      })
      .listen('MessageReactionUpdated', (e) => {
        setMessages(prev => prev.map(m => 
            m.id === e.messageId ? { ...m, reactions: e.reactions } : m
        ));
      });

    // Presence listener
    const presenceChannel = echo.channel('presence-status')
        .listen('UserStatusUpdated', (e) => {
            if (e.userId == otherUserId) {
                setIsOtherOnline(e.isOnline);
            }
        });

    return () => {
        echo.leave(`messages.${user.id}`);
        echo.leave('presence-status');
    };
  }, [user, otherUserId, navigate]);

  useEffect(scrollToBottom, [messages]);

  const initiateCall = async (type) => {
    try {
      const res = await api.post("/messages/call", { receiver_id: otherUserId, type });
      setActiveCall({ otherUser, type, status: 'calling', callId: res.data.callId });
    } catch (err) {
      console.error("Call error:", err);
    }
  };

  const respondToCall = async (action) => {
    if (!incomingCall) return;
    try {
      await api.post("/messages/call/action", { 
        receiver_id: incomingCall.caller.id, 
        action, 
        call_id: incomingCall.callId 
      });
      if (action === 'accepted') {
        setActiveCall({ otherUser: incomingCall.caller, type: incomingCall.type, status: 'ongoing', callId: incomingCall.callId });
      }
      setIncomingCall(null);
    } catch (err) {
      console.error("Call action error:", err);
    }
  };

  const endActiveCall = async () => {
    if (!activeCall) return;
    try {
      await api.post("/messages/call/action", { 
        receiver_id: activeCall.otherUser.id, 
        action: 'ended', 
        call_id: activeCall.callId 
      });
      setActiveCall(null);
    } catch (err) {
      console.error("End call error:", err);
    }
  };

  const handleReact = async (messageId, reaction) => {
    try {
        const res = await api.post(`/messages/${messageId}/react`, { reaction });
        setMessages(prev => prev.map(m => 
            m.id === messageId ? { ...m, reactions: res.data } : m
        ));
    } catch (err) {
        console.error("Erreur réaction:", err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], "voice_message.webm", { type: 'audio/webm' });
        handleSend(null, audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error("Erreur micro:", err);
      alert("Impossible d'accéder au micro.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      audioChunksRef.current = [];
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async (e, file = null) => {
    if (e) e.preventDefault();
    if (!content.trim() && !file) return;

    const formData = new FormData();
    formData.append("receiver_id", otherUserId);
    if (content.trim()) formData.append("content", content);
    if (file) formData.append("file", file);

    try {
      const res = await api.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessages(prev => [...prev, res.data]);
      setContent("");
    } catch (err) {
      console.error("Erreur send message:", err);
      alert("Erreur lors de l'envoi du message.");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="container mt-5 pt-4 mb-5">
      <div className="card shadow-lg border-0 chat-card overflow-hidden" style={{ height: "80vh", borderRadius: '24px' }}>
        {/* Chat Header */}
        <div className="card-header bg-white border-bottom p-3 d-flex align-items-center justify-content-between px-4">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-icon-light rounded-circle" onClick={() => navigate("/messages")}>
                <ArrowLeft size={20} />
            </button>
            <div className="d-flex align-items-center gap-2">
                <UserAvatar name={otherUser?.name || "User"} size={40} />
                <div>
                    <h6 className="mb-0 fw-bold text-dark">{otherUser?.name || t('discussion')}</h6>
                    <small className={`${isOtherOnline ? 'text-success' : 'text-muted'} d-flex align-items-center gap-1`}>
                        <span className={`dot ${isOtherOnline ? 'bg-success' : 'bg-secondary'} rounded-circle`} style={{ width: '6px', height: '6px' }}></span> 
                        {isOtherOnline ? t('online') : t('offline') || 'Hors ligne'}
                    </small>
                </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-icon-light rounded-circle text-primary" title="Appel Audio" onClick={() => initiateCall('audio')}>
              <Phone size={20} />
            </button>
            <button className="btn btn-icon-light rounded-circle text-primary" title="Appel Vidéo" onClick={() => initiateCall('video')}>
              <Video size={20} />
            </button>
            <button className="btn btn-icon-light rounded-circle">
              <MoreVertical size={20} className="text-muted" />
            </button>
          </div>
        </div>
        
        {/* Chat Body */}
        <div className="card-body overflow-auto p-4 bg-chat-pattern" style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          {messages.map((m) => {
            const isMe = m.sender_id === user.id;
            const fullDate = new Date(m.created_at).toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            // Checkmark logic
            let checkIcon = <Check size={12} />;
            let checkColor = "text-white-50";
            if (m.status === 'delivered') {
                checkIcon = <CheckCheck size={12} />;
            } else if (m.status === 'seen' || m.read_at) {
                checkIcon = <CheckCheck size={12} />;
                checkColor = isMe ? "text-info" : "text-primary"; // Light blue for dark bg, primary for light bg
            }

            return (
              <div 
                key={m.id} 
                className={`d-flex mb-4 ${isMe ? "justify-content-end" : "justify-content-start"}`}
              >
                {!isMe && (
                     <UserAvatar name={otherUser?.name || "User"} size={28} className="me-2 mt-auto d-none d-sm-flex" />
                )}
                <div 
                  className={`chat-bubble p-3 shadow-sm ${isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-other"}`}
                  style={{ maxWidth: "75%", borderRadius: '18px' }}
                >
                  {m.product && (
                    <div className={`mb-2 p-2 rounded-3 small border d-flex gap-2 align-items-center ${isMe ? 'bg-white bg-opacity-10 border-white border-opacity-20 text-white' : 'bg-light border-secondary border-opacity-10'}`} onClick={() => navigate(`/product/${m.product.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="rounded overflow-hidden" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                            <img src={m.product.image ? `http://127.0.0.1:8000/storage/${m.product.image}` : "https://via.placeholder.com/40"} alt="" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                            <strong className="d-block text-truncate" style={{ fontSize: '11px' }}>{m.product.title}</strong>
                            <span className="fw-bold" style={{ fontSize: '10px' }}>{m.product.price}€</span>
                        </div>
                    </div>
                  )}
                  {m.file_path && (
                    <div className="mb-2">
                        {m.file_type === 'image' ? (
                            <img 
                                src={`http://127.0.0.1:8000/storage/${m.file_path}`} 
                                alt="Shared" 
                                className="img-fluid rounded-3 shadow-sm"
                                style={{ maxHeight: '250px', cursor: 'zoom-in' }}
                                onClick={() => window.open(`http://127.0.0.1:8000/storage/${m.file_path}`, '_blank')}
                            />
                        ) : (
                            <div className={`p-2 rounded-3 d-flex align-items-center gap-2 border ${isMe ? 'bg-white bg-opacity-10 border-white border-opacity-20 text-white' : 'bg-light border-secondary border-opacity-10'}`}>
                                <i className="bi bi-file-earmark-arrow-down fs-4"></i>
                                <div className="flex-grow-1 overflow-hidden">
                                    <div className="text-truncate small fw-bold">{m.file_path.split('/').pop()}</div>
                                    <a 
                                        href={`http://127.0.0.1:8000/storage/${m.file_path}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`small text-decoration-none ${isMe ? 'text-white text-opacity-75' : 'text-primary'}`}
                                    >
                                        Télécharger
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                  )}
                  {m.file_path && m.file_type === 'audio' && (
                    <div className="mb-2">
                        <VoicePlayer src={`http://127.0.0.1:8000/storage/${m.file_path}`} isMe={isMe} />
                    </div>
                  )}
                  {m.content && <p className="mb-1" style={{ fontSize: '15px', lineHeight: '1.5' }}>{m.content}</p>}
                  
                  {/* Reactions Display */}
                  {m.reactions && Object.keys(m.reactions).length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mt-2">
                          {Object.entries(m.reactions).map(([emoji, userIds]) => (
                              <div key={emoji} className={`rounded-pill px-2 py-1 small border d-flex align-items-center gap-1 ${isMe ? 'bg-white bg-opacity-20 border-white border-opacity-25' : 'bg-light border-secondary border-opacity-10'}`} style={{ fontSize: '12px', cursor: 'pointer' }} onClick={() => handleReact(m.id, emoji)}>
                                  <span>{emoji}</span>
                                  <span>{userIds.length}</span>
                              </div>
                          ))}
                      </div>
                  )}

                  <div className="d-flex align-items-center justify-content-end gap-1 opacity-75" style={{ fontSize: "10px" }}>
                    <span title={fullDate} style={{ cursor: 'help' }}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <span className={checkColor}>{checkIcon}</span>}
                  </div>

                  {/* Reaction Picker on Hover */}
                  <div className="reaction-picker position-absolute bottom-100 mb-2 bg-white shadow-lg rounded-pill p-1 d-none gap-1" style={{ left: isMe ? 'auto' : '0', right: isMe ? '0' : 'auto', border: '1px solid #e2e8f0' }}>
                      {['❤️', '😂', '😮', '😢', '👍', '🔥'].map(emoji => (
                          <button key={emoji} className="btn btn-sm btn-light rounded-circle p-1 border-0" style={{ fontSize: '18px' }} onClick={() => handleReact(m.id, emoji)}>
                              {emoji}
                          </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        {/* Chat Footer */}
        <div className="card-footer bg-white border-top-0 p-3 px-4">
          {isRecording ? (
            <div className="d-flex align-items-center gap-3 bg-light p-2 rounded-pill shadow-sm px-4">
                <div className="d-flex align-items-center gap-2 text-danger">
                    <span className="dot bg-danger rounded-circle animate-pulse" style={{ width: '10px', height: '10px' }}></span>
                    <span className="fw-bold fs-5">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex-grow-1 text-muted small">Enregistrement...</div>
                <button type="button" className="btn btn-link text-muted p-0" onClick={cancelRecording}>
                    <Trash2 size={20} />
                </button>
                <button type="button" className="btn btn-danger rounded-circle p-2 d-flex align-items-center justify-content-center" onClick={stopRecording}>
                    <Square size={18} />
                </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="d-flex gap-2 bg-light p-2 rounded-pill shadow-sm align-items-center px-3">
                <label className="btn btn-icon-light rounded-circle p-2 m-0 cursor-pointer" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-paperclip fs-4"></i>
                    <input 
                        type="file" 
                        className="d-none" 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleSend(e, file);
                        }} 
                    />
                </label>
                <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none" 
                placeholder={t('write_message') || "Écrivez votre message..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                />
                {content.trim() ? (
                    <button type="submit" className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                        <Send size={18} />
                    </button>
                ) : (
                    <button type="button" className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" onClick={startRecording} style={{ width: '40px', height: '40px' }}>
                        <Mic size={20} />
                    </button>
                )}
            </form>
          )}
        </div>
      </div>

      {/* 📞 INCOMING CALL MODAL */}
      {incomingCall && incomingCall.caller && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
            <div className="bg-white p-5 rounded-5 text-center shadow-lg animate-bounce" style={{ width: '320px' }}>
                <UserAvatar name={incomingCall.caller.name} size={100} className="mx-auto mb-4" />
                <h4 className="fw-bold mb-1">{incomingCall.caller.name}</h4>
                <p className="text-muted mb-4">{incomingCall.type === 'video' ? 'Appel vidéo entrant...' : 'Appel audio entrant...'}</p>
                <div className="d-flex justify-content-center gap-4">
                    <button className="btn btn-danger rounded-circle p-3" onClick={() => respondToCall('rejected')}>
                        <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
                    </button>
                    <button className="btn btn-success rounded-circle p-3" onClick={() => respondToCall('accepted')}>
                        {incomingCall.type === 'video' ? <Video size={24} /> : <Phone size={24} />}
                    </button>
                </div>
                <audio autoPlay loop src="/calling_tone.mp3" className="d-none" />
            </div>
        </div>
      )}

      {/* 📱 ACTIVE CALL OVERLAY */}
      {activeCall && activeCall.otherUser && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white" style={{ zIndex: 10000, background: '#0f172a' }}>
            <div className="text-center">
                <UserAvatar name={activeCall.otherUser.name} size={activeCall.type === 'video' ? 120 : 150} className="mx-auto mb-4 border border-4 border-primary" />
                <h2 className="fw-bold">{activeCall.otherUser.name}</h2>
                <div className={`badge ${activeCall.status === 'ongoing' ? 'bg-success' : 'bg-primary'} px-3 py-2 rounded-pill mt-2`}>
                   {activeCall.status === 'ongoing' ? 'Appel en cours' : 'Appel...'}
                </div>
            </div>
            
            <div className="mt-auto mb-5 d-flex gap-4">
                 <button className="btn btn-secondary rounded-circle p-3"><Mic size={24} /></button>
                 <button className="btn btn-danger rounded-circle p-4 shadow-lg" onClick={endActiveCall}>
                     <Phone size={32} style={{ transform: 'rotate(135deg)' }} />
                 </button>
                 {activeCall.type === 'video' && <button className="btn btn-secondary rounded-circle p-3"><Video size={24} /></button>}
            </div>
        </div>
      )}

      <style>{`
        .chat-card { border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important; }
        .bubble-me { border-bottom-right-radius: 4px !important; }
        .bubble-other { border-bottom-left-radius: 4px !important; }
        .btn-icon-light { background: #f1f5f9; border: none; padding: 10px; transition: all 0.2s; color: #475569; }
        .btn-icon-light:hover { background: #e2e8f0; color: #0f172a; }
        .bg-chat-pattern {
            background-color: #f8fafc;
            background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
            background-size: 20px 20px;
        }
        .chat-bubble { position: relative; transition: all 0.2s; }
        .chat-bubble:hover { transform: scale(1.01); }
        .chat-bubble:hover .reaction-picker { display: flex !important; }
        .animate-pulse { animation: pulse 1.5s infinite; }
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
