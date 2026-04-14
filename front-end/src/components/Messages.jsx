import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function Messages({ user }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="container mt-5 pt-5 text-center">Chargement...</div>;

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Mes Messages</h2>
      {conversations.length === 0 ? (
        <div className="alert alert-info">Aucune conversation pour le moment.</div>
      ) : (
        <div className="list-group shadow-sm">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3"
              onClick={() => navigate(`/chat/${conv.id}`)}
            >
              <div>
                <h5 className="mb-1">{conv.name}</h5>
                <small className="text-muted">Démarrer la discussion</small>
              </div>
              <span className="badge bg-primary rounded-pill">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
