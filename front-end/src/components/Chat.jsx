import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";

export default function Chat({ user }) {
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
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
    <div className="container mt-5 pt-5 mb-5">
      <div className="card shadow border-0" style={{ height: "70vh" }}>
        <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Discussion</h5>
          <button className="btn btn-sm btn-outline-light" onClick={() => navigate("/messages")}>Retour</button>
        </div>
        
        <div className="card-body overflow-auto p-4" style={{ flex: 1 }}>
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`d-flex mb-3 ${m.sender_id === user.id ? "justify-content-end" : "justify-content-start"}`}
            >
              <div 
                className={`p-3 rounded shadow-sm ${m.sender_id === user.id ? "bg-primary text-white" : "bg-light"}`}
                style={{ maxWidth: "70%" }}
              >
                {m.product && (
                  <div className="mb-2 p-2 bg-white text-dark rounded small border">
                    <strong>Produit:</strong> {m.product.title} (${m.product.price})
                  </div>
                )}
                <p className="mb-0">{m.content}</p>
                <small className="d-block mt-1 opacity-75" style={{ fontSize: "0.75rem" }}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="card-footer bg-white border-top-0 p-3">
          <form onSubmit={handleSend} className="d-flex gap-2">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Écrivez votre message..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn btn-primary px-4">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
