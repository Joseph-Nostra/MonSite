import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import { useTranslation } from "react-i18next";
import { Send, ArrowLeft, MoreVertical, CheckCheck, Check, Mic, Square, Trash2, Phone, Video, Smile, Edit2, X, CornerUpLeft, ShieldAlert } from "lucide-react";
import echo from "../echo";
import UserAvatar from "./Common/UserAvatar";
import LoadingSpinner from "./Common/LoadingSpinner";
import VoicePlayer from "./Common/VoicePlayer";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showPickerId, setShowPickerId] = useState(null);
  const [showActionsId, setShowActionsId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [deleteModal, setDeleteModal] = useState(null); // { id, isMe }
  const [showHistoryId, setShowHistoryId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
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
      })
      .listen('MessageUpdated', (e) => {
        setMessages(prev => prev.map(m => 
            m.id === e.message.id ? e.message : m
        ));
      })
      .listen('MessageDeleted', (e) => {
        setMessages(prev => prev.map(m => 
            m.id === e.message.id ? e.message : m
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
    if (replyingTo) formData.append("parent_id", replyingTo.id);

    try {
      const res = await api.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessages(prev => [...prev, res.data]);
      setContent("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Erreur send message:", err);
      alert("Erreur lors de l'envoi du message.");
    }
  };

  const handleUpdate = async (messageId) => {
    if (!editContent.trim()) return;
    try {
        const res = await api.put(`/messages/${messageId}`, { content: editContent });
        setMessages(prev => prev.map(m => m.id === messageId ? res.data : m));
        setEditingId(null);
        setEditContent("");
    } catch (err) {
        console.error("Update error:", err);
    }
  };

  const handleDelete = async (messageId, type) => {
    try {
        const res = await api.delete(`/messages/${messageId}`, { data: { delete_type: type } });
        if (type === 'for_me') {
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } else {
            setMessages(prev => prev.map(m => m.id === messageId ? res.data.message : m));
        }
        setDeleteModal(null);
    } catch (err) {
        console.error("Delete error:", err);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
        await api.post("/reports", { reported_id: otherUserId, reason: reportReason });
        setShowReportModal(false);
        setReportReason("");
        alert("Signalement envoyé avec succès.");
    } catch (err) {
        console.error("Report error:", err);
    } finally {
        setReporting(false);
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
            <button className="btn btn-icon-light rounded-circle text-danger" title="Signaler" onClick={() => setShowReportModal(true)}>
              <ShieldAlert size={20} />
            </button>
            <button className="btn btn-icon-light rounded-circle">
              <MoreVertical size={20} className="text-muted" />
            </button>
          </div>
        </div>
        
        {/* Chat Body */}
        <div className="card-body overflow-auto p-4 bg-chat-pattern" style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          {messages
            .filter(m => !m.deleted_for?.includes(user.id))
            .map((m) => {
            const isMe = m.sender_id === user.id;
            const fullDate = new Date(m.created_at).toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const isEditing = editingId === m.id;
            
            // Checkmark logic
            let checkIcon = <Check size={12} />;
            let checkColor = "text-white-50";
            if (m.status === 'delivered') {
                checkIcon = <CheckCheck size={12} />;
            } else if (m.status === 'seen' || m.read_at) {
                checkIcon = <CheckCheck size={12} />;
                checkColor = isMe ? "text-info" : "text-primary";
            }

            return (
              <div 
                key={m.id} 
                className={`d-flex mb-4 ${isMe ? "justify-content-end" : "justify-content-start"}`}
              >
                {!isMe && (
                     <UserAvatar name={otherUser?.name || "User"} size={28} className="me-2 mt-auto d-none d-sm-flex" />
                )}
                
                <div className={`bubble-wrapper position-relative d-flex align-items-center ${isMe ? "flex-row-reverse" : "flex-row"}`} style={{ maxWidth: "85%" }}>
                  <div 
                    className={`chat-bubble p-3 shadow-sm ${m.is_deleted_for_everyone ? 'bg-light text-muted italic border' : (isMe ? "bg-primary text-white bubble-me" : "bg-white text-dark bubble-other")}`}
                    style={{ borderRadius: '18px', position: 'relative', border: m.is_deleted_for_everyone ? '1px dashed #cbd5e1' : 'none' }}
                  >
                    {m.is_deleted_for_everyone ? (
                        <p className="mb-0 small d-flex align-items-center gap-1 opacity-75">
                            <Trash2 size={14} /> <i>Ce message a été supprimé</i>
                        </p>
                    ) : (
                        <>
                        {m.parent && (
                            <div className={`mb-2 p-2 rounded-3 border-start border-4 small ${isMe ? 'bg-white bg-opacity-10 border-white border-opacity-50' : 'bg-light border-primary'}`} style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                                <strong className="d-block mb-1 opacity-75">{m.parent.sender_id === user.id ? 'Moi' : m.parent.sender?.name}</strong>
                                <div className="text-truncate opacity-75">{m.parent.content}</div>
                            </div>
                        )}
                        {m.product && !isEditing && (
                            <Link 
                                to={`/product/${m.product.id}`}
                                className={`mb-2 p-2 rounded-3 small border d-flex gap-2 align-items-center text-decoration-none shadow-sm transition-all hover-translate-y-px ${isMe ? 'bg-white bg-opacity-10 border-white border-opacity-20 text-white' : 'bg-light border-secondary border-opacity-10 text-dark'}`}
                            >
                                <div className="rounded overflow-hidden" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                    <img src={m.product.image ? `http://127.0.0.1:8000/storage/${m.product.image}` : "https://via.placeholder.com/40"} alt="" className="w-100 h-100 object-fit-cover" />
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <strong className="d-block text-truncate" style={{ fontSize: '11px' }}>{m.product.title}</strong>
                                    <span className="fw-bold" style={{ fontSize: '10px' }}>{m.product.price}€</span>
                                </div>
                            </Link>
                        )}
                        {m.file_path && !isEditing && (
                            <div className="mb-2">
                                {m.file_type === 'image' ? (
                                    <img 
                                        src={`http://127.0.0.1:8000/storage/${m.file_path}`} 
                                        alt="Shared" 
                                        className="img-fluid rounded-3 shadow-sm"
                                        style={{ maxHeight: '250px', cursor: 'zoom-in' }}
                                        onClick={() => window.open(`http://127.0.0.1:8000/storage/${m.file_path}`, '_blank')}
                                    />
                                ) : m.file_type === 'audio' ? (
                                    <VoicePlayer 
                                        src={`http://127.0.0.1:8000/storage/${m.file_path}`} 
                                        isMe={isMe} 
                                        userAvatar={isMe ? user.avatar : otherUser?.avatar}
                                        userName={isMe ? user.name : otherUser?.name}
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
                        
                        {isEditing ? (
                            <div className="edit-container">
                                <textarea 
                                    className="form-control form-control-sm border-0 shadow-none bg-transparent text-inherit"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    autoFocus
                                    style={{ color: isMe ? 'white' : 'inherit', minWidth: '200px' }}
                                />
                                <div className="d-flex justify-content-end gap-1 mt-2">
                                    <button className="btn btn-sm btn-link text-white p-0 opacity-75 hover-opacity-100" onClick={() => setEditingId(null)}>
                                        <X size={16} />
                                    </button>
                                    <button className="btn btn-sm btn-link text-white p-0" onClick={() => handleUpdate(m.id)}>
                                        <Check size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {m.content && <p className="mb-1" style={{ fontSize: '15px', lineHeight: '1.5' }}>{m.content}</p>}
                                
                                {m.is_edited && (
                                    <div className="mt-1">
                                        <button 
                                            className={`btn btn-link p-0 small text-decoration-underline border-0 bg-transparent ${isMe ? 'text-white-50' : 'text-muted'}`}
                                            style={{ fontSize: '11px' }}
                                            onClick={() => setShowHistoryId(showHistoryId === m.id ? null : m.id)}
                                        >
                                            message modifié
                                        </button>
                                        
                                        <AnimatePresence>
                                            {showHistoryId === m.id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                                    className="position-absolute bg-white shadow-lg rounded-3 p-2 text-dark"
                                                    style={{ zIndex: 110, width: '250px', top: '100%', left: isMe ? 'auto' : '0', right: isMe ? '0' : 'auto' }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                                                        <span className="fw-bold extra-small uppercase text-muted">Historique</span>
                                                        <X size={14} className="cursor-pointer" onClick={() => setShowHistoryId(null)} />
                                                    </div>
                                                    <div className="overflow-auto" style={{ maxHeight: '150px' }}>
                                                        {m.edit_history?.map((h, i) => (
                                                            <div key={i} className="mb-2 p-2 rounded bg-light border-start border-primary border-3">
                                                                <p className="mb-1 small text-dark" style={{ whiteSpace: 'pre-wrap' }}>{h.content}</p>
                                                                <span className="text-muted" style={{ fontSize: '9px' }}>{new Date(h.edited_at).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {/* Reactions Display */}
                        {m.reactions && Object.keys(m.reactions).length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mt-2">
                                {Object.entries(m.reactions).map(([emoji, userIds]) => (
                                    <div key={emoji} className={`rounded-pill px-2 py-1 small border d-flex align-items-center gap-1 ${isMe ? 'bg-white bg-opacity-20 border-white border-opacity-25' : 'bg-light border-secondary border-opacity-10'}`} style={{ fontSize: '12px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleReact(m.id, emoji); }}>
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
                        </>
                    )}
  
                    {/* Reaction Picker Content */}
                    <AnimatePresence>
                      {showPickerId === m.id && (
                          <motion.div 
                              initial={{ opacity: 0, scale: 0.8, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8, y: 10 }}
                              className="reaction-picker position-absolute bottom-100 mb-2 bg-white shadow-lg rounded-pill p-1 d-flex gap-1" 
                              style={{ left: isMe ? 'auto' : '0', right: isMe ? '0' : 'auto', border: '1px solid #e2e8f0', zIndex: 100 }}
                          >
                              {['❤️', '😂', '😮', '😢', '👍', '🔥'].map(emoji => (
                                  <button 
                                      key={emoji} 
                                      className="btn btn-sm btn-light rounded-circle p-1 border-0 transition-transform hover-scale" 
                                      style={{ fontSize: '18px' }} 
                                      onClick={() => {
                                          handleReact(m.id, emoji);
                                          setShowPickerId(null);
                                      }}
                                  >
                                      {emoji}
                                  </button>
                              ))}
                          </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Actions Menu Content */}
                    <AnimatePresence>
                        {showActionsId === m.id && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="position-absolute bottom-100 mb-2 bg-white shadow-lg rounded-3 py-1 overflow-hidden" 
                                style={{ right: isMe ? '0' : 'auto', left: isMe ? 'auto' : '0', border: '1px solid #e2e8f0', zIndex: 100, minWidth: '130px' }}
                            >
                                {isMe && !m.is_deleted_for_everyone && (
                                    <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-dark hover-bg-light small" onClick={() => { setEditingId(m.id); setEditContent(m.content); setShowActionsId(null); }}>
                                        <Edit2 size={14} className="text-muted" /> Modifier
                                    </button>
                                )}
                                <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-dark hover-bg-light small" onClick={() => { setReplyingTo(m); setShowActionsId(null); }}>
                                    <CornerUpLeft size={14} className="text-muted" /> Répondre
                                </button>
                                <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger hover-bg-light small" onClick={() => { setDeleteModal({ id: m.id, isMe }); setShowActionsId(null); }}>
                                    <Trash2 size={14} /> Supprimer
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
  
                  {/* Triggers (Smile & Actions) */}
                  {!m.is_deleted_for_everyone && (
                    <div className={`reaction-trigger px-2 d-none items-center gap-1`}>
                        <button 
                            className="btn btn-sm btn-light rounded-circle shadow-sm p-1 border-0 bg-white hover-scale" 
                            onClick={(e) => { e.stopPropagation(); setReplyingTo(m); }}
                            title="Répondre"
                            style={{ width: '32px', height: '32px' }}
                        >
                            <CornerUpLeft size={18} className="text-muted" />
                        </button>
                        <button 
                            className="btn btn-sm btn-light rounded-circle shadow-sm p-1 border-0 bg-white hover-scale" 
                            onClick={(e) => { e.stopPropagation(); setShowPickerId(showPickerId === m.id ? null : m.id); setShowActionsId(null); }}
                            style={{ width: '32px', height: '32px' }}
                        >
                            <Smile size={18} className="text-muted" />
                        </button>
                        <button 
                            className="btn btn-sm btn-light rounded-circle shadow-sm p-1 border-0 bg-white hover-scale" 
                            onClick={(e) => { e.stopPropagation(); setShowActionsId(showActionsId === m.id ? null : m.id); setShowPickerId(null); }}
                            style={{ width: '32px', height: '32px' }}
                        >
                            <MoreVertical size={18} className="text-muted" />
                        </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        {/* Chat Footer */}
        <div className="card-footer bg-white border-top-0 p-3 px-4">
          {replyingTo && (
              <div className="reply-preview bg-light border-start border-4 border-primary rounded-3 p-2 mb-2 d-flex justify-content-between align-items-center animate-slide-up">
                  <div className="overflow-hidden">
                      <small className="fw-bold d-block text-primary">{replyingTo.sender_id === user.id ? 'Moi' : replyingTo.sender?.name || otherUser?.name}</small>
                      <div className="small text-muted text-truncate">{replyingTo.content}</div>
                  </div>
                  <button className="btn btn-link text-muted p-0 ms-2" onClick={() => setReplyingTo(null)}>
                      <X size={16} />
                  </button>
              </div>
          )}
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

      {/* 🗑️ DELETE CONFIRMATION MODAL */}
      {deleteModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 10001, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-4 rounded-4 shadow-xl text-center" style={{ width: '350px' }}
              >
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 mx-auto mb-3" style={{ width: '60px' }}>
                    <Trash2 size={24} />
                  </div>
                  <h5 className="fw-bold mb-2">Supprimer le message ?</h5>
                  <p className="text-muted small mb-4">Cette action peut être permanente selon votre choix.</p>
                  
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-secondary rounded-pill py-2 small fw-bold" onClick={() => handleDelete(deleteModal.id, 'for_me')}>
                        Supprimer pour moi
                    </button>
                    {deleteModal.isMe && (
                        <button className="btn btn-danger rounded-pill py-2 small fw-bold" onClick={() => handleDelete(deleteModal.id, 'for_everyone')}>
                            Supprimer pour tout le monde
                        </button>
                    )}
                    <button className="btn btn-light rounded-pill py-2 small fw-bold mt-2" onClick={() => setDeleteModal(null)}>
                        Annuler
                    </button>
                  </div>
              </motion.div>
          </div>
      )}

      {/* ⚠️ REPORT MODAL */}
      {showReportModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 10002, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-4 rounded-4 shadow-xl" style={{ width: '400px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold mb-0">Signaler l'utilisateur</h5>
                      <X className="cursor-pointer" onClick={() => setShowReportModal(false)} />
                  </div>
                  <div className="mb-4">
                      <label className="form-label small fw-bold text-muted">Raison du signalement</label>
                      <select className="form-select border-0 bg-light rounded-3 p-3 shadow-none focus-ring" value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                          <option value="">Sélectionnez une raison</option>
                          <option value="Spam">Spam / Messages indésirables</option>
                          <option value="Harcèlement">Harcèlement</option>
                          <option value="Arnaque">Tentative d'arnaque</option>
                          <option value="Contenu inapproprié">Contenu inapproprié</option>
                          <option value="Autre">Autre</option>
                      </select>
                      {reportReason === 'Autre' && (
                          <textarea className="form-control border-0 bg-light rounded-3 p-3 mt-3 shadow-none" placeholder="Détails supplémentaires..." rows="3" onChange={(e) => setReportReason(e.target.value)}></textarea>
                      )}
                  </div>
                  <div className="d-grid">
                      <button className="btn btn-danger rounded-pill py-2 fw-bold" disabled={!reportReason || reporting} onClick={handleReport}>
                          {reporting ? <LoadingSpinner size="sm" /> : 'Envoyer le signalement'}
                      </button>
                  </div>
              </motion.div>
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
        .bubble-wrapper:hover .reaction-trigger { display: flex !important; }
        .hover-scale:hover { transform: scale(1.2); }
        .reaction-trigger { transition: all 0.2s; }
        .reaction-trigger.d-none { display: none !important; }
        .items-center { align-items: center; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .extra-small { font-size: 10px; }
        .uppercase { text-transform: uppercase; }
        .cursor-pointer { cursor: pointer; }
        .hover-opacity-100:hover { opacity: 1 !important; }
        .text-inherit { color: inherit; }
        .bubble-me textarea { color: white !important; }
        .bubble-other textarea { color: #1e293b !important; }
        .edit-container textarea { resize: none; overflow: hidden; background: rgba(0,0,0,0.05) !important; border-radius: 8px; padding: 5px; }
        .hover-translate-y-px:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important; }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out;
        }
        @keyframes slide-up {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .reply-preview {
            border-left-width: 4px !important;
            transition: all 0.3s ease;
        }
        .focus-ring:focus {
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
        }
        .shadow-xl {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
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
