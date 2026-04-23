import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import { useTranslation } from "react-i18next";
import { Send, ArrowLeft, MoreVertical, CheckCheck } from "lucide-react";
import Logo from "./Common/Logo";

export default function Chat({ user }) {
  const { t } = useTranslation();
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
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
        if (res.data.length > 0 && !otherUser) {
            const firstMsg = res.data.find(m => m.sender_id !== user.id) || res.data.find(m => m.receiver_id !== user.id);
            if (firstMsg) {
                // We could fetch other user details properly if we had an endpoint
                // For now we might just have the name in the first message if included
            }
        }
      } catch (err) {
        console.error("Erreur fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s

    return () => clearInterval(interval);
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
      setMessages([...messages, res.data]);
      setContent("");
    } catch (err) {
      console.error("Erreur send message:", err);
    }
  };

  if (loading) return <div className="container mt-5 pt-5 text-center">Chargement du chat...</div>;

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
                <div className="chat-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                    {otherUserId.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h6 className="mb-0 fw-bold text-dark">{t('discussion') || 'Discussion'}</h6>
                    <small className="text-success d-flex align-items-center gap-1">
                        <span className="dot bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></span> {t('online') || 'En ligne'}
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
            return (
              <div 
                key={m.id} 
                className={`d-flex mb-4 ${isMe ? "justify-content-end" : "justify-content-start"}`}
              >
                {!isMe && (
                     <div className="chat-avatar-sm bg-secondary text-white rounded-circle d-none d-sm-flex align-items-center justify-content-center me-2 mt-auto" style={{ width: '28px', height: '28px', fontSize: '10px' }}>
                        {otherUserId.charAt(0).toUpperCase()}
                     </div>
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
                            <span className="fw-bold" style={{ fontSize: '10px' }}>${m.product.price}</span>
                        </div>
                    </div>
                  )}
                  <p className="mb-1" style={{ fontSize: '15px', lineHeight: '1.5' }}>{m.content}</p>
                  <div className="d-flex align-items-center justify-content-end gap-1 opacity-75" style={{ fontSize: "10px" }}>
                    <span title={fullDate} style={{ cursor: 'help' }}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck size={12} />}
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
