import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import { useTranslation } from "react-i18next";
import { Send, ArrowLeft, MoreVertical, CheckCheck, Check } from "lucide-react";
import echo from "../echo";
import UserAvatar from "./Common/UserAvatar";
import LoadingSpinner from "./Common/LoadingSpinner";

export default function Chat({ user }) {
  const { t } = useTranslation();
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await api.post("/messages", {
        receiver_id: otherUserId,
        content: content
      });
      setMessages(prev => [...prev, res.data]);
      setContent("");
    } catch (err) {
      console.error("Erreur send message:", err);
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
          <button className="btn btn-icon-light rounded-circle">
            <MoreVertical size={20} className="text-muted" />
          </button>
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
                  <p className="mb-1" style={{ fontSize: '15px', lineHeight: '1.5' }}>{m.content}</p>
                  <div className="d-flex align-items-center justify-content-end gap-1 opacity-75" style={{ fontSize: "10px" }}>
                    <span title={fullDate} style={{ cursor: 'help' }}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <span className={checkColor}>{checkIcon}</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        {/* Chat Footer */}
        <div className="card-footer bg-white border-top-0 p-3 px-4">
          <form onSubmit={handleSend} className="d-flex gap-2 bg-light p-2 rounded-pill shadow-sm align-items-center px-3">
            <input 
              type="text" 
              className="form-control border-0 bg-transparent shadow-none" 
              placeholder={t('write_message') || "Écrivez votre message..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                <Send size={18} />
            </button>
          </form>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
