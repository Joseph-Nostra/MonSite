import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { useTranslation } from "react-i18next";
import { MessageCircle, Search, ChevronRight, MessageSquareDashed } from "lucide-react";

export default function Messages({ user }) {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchConversations = async () => {
      try {
        const res = await api.get("/messages");
        setConversations(res.data);
      } catch (err) {
        console.error("Erreur conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, navigate]);

  if (loading) return <div className="container mt-5 pt-5 text-center"><div className="spinner-border text-primary"></div></div>;

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5 pt-5 mb-5">
      <div className="header-box mb-4">
        <h2 className="fw-bold text-dark mb-1">
            <MessageCircle className="text-primary me-2" size={32} /> {t('my_messages_title') || "Mes Messages"}
        </h2>
        <p className="text-muted small">Retrouvez toutes vos discussions avec les vendeurs et acheteurs.</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom p-3 px-4">
           <div className="input-group bg-light rounded-pill px-3 py-1">
                <span className="input-group-text bg-transparent border-0 text-muted">
                    <Search size={18} />
                </span>
                <input 
                    type="text" 
                    className="form-control bg-transparent border-0 shadow-none" 
                    placeholder={t('search_conversation') || "Rechercher une conversation..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
           </div>
        </div>

        <div className="list-group list-group-flush">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-5">
                <MessageSquareDashed size={64} className="text-muted opacity-25 mb-3" />
                <h5 className="text-muted">{t('no_conversations') || "Aucune conversation pour le moment."}</h5>
                <p className="small text-secondary">Vos discussions apparaîtront ici.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                className="list-group-item list-group-item-action d-flex align-items-center gap-3 p-4 border-bottom transition-all"
                onClick={() => navigate(`/chat/${conv.id}`)}
              >
                <div className="avatar bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                    {conv.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0 fw-bold text-dark">{conv.name}</h6>
                        <small className="text-muted" style={{ fontSize: '11px' }}>En ligne</small>
                    </div>
                    <p className="mb-0 text-muted small text-truncate pe-4">Cliquez pour voir les messages...</p>
                </div>
                <ChevronRight size={20} className="text-muted opacity-50" />
              </button>
            ))
          )}
        </div>
      </div>

      <style>{`
        .list-group-item-action:hover {
            background-color: #f8fafc;
            transform: translateX(5px);
        }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
}
