import { useEffect, useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const archiveNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await api.patch("/notifications/mark-all");
    fetchNotifications();
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHrs = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHrs / 24);

    if (diffInSec < 60) return "À l'instant";
    if (diffInMin < 60) return `Il y a ${diffInMin} min`;
    if (diffInHrs < 24) return `Il y a ${diffInHrs} h`;
    return `Il y a ${diffInDays} j`;
  };

  const handleNotificationClick = (n) => {
    if (!n.is_read) markAsRead(n.id);
    
    if (n.type === 'message' && n.data?.sender_id) {
        navigate(`/chat/${n.data.sender_id}`);
    } else if (n.type === 'order' && n.data?.order_id) {
        navigate(`/orders/${n.data.order_id}`);
    }
  };

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5 pt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">🔔 Notifications</h3>
        {notifications.some(n => !n.is_read) && (
            <button className="btn btn-link text-decoration-none small" onClick={markAllAsRead}>
                Tout marquer comme lu
            </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
            <p className="text-muted mb-0">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="notification-list shadow-sm rounded-4 overflow-hidden bg-white">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item p-3 border-bottom d-flex align-items-start gap-3 transition-all cursor-pointer ${!n.is_read ? "unread-bg fw-bold" : ""}`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className={`icon-container rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm`} style={{ width: '45px', height: '45px', background: n.type === 'order' ? '#e7f3ff' : '#fef2f2' }}>
                <span className="h5 mb-0">
                  {n.type === 'order' ? '🛒' : n.type === 'message' ? '💬' : '🔔'}
                </span>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className={`badge ${n.type === 'order' ? 'bg-primary' : 'bg-danger'} text-uppercase small`} style={{ fontSize: '10px' }}>
                    {n.type}
                  </span>
                  <small className="text-muted">{getRelativeTime(n.created_at)}</small>
                </div>
                
                <p className="mb-2 text-dark" style={{ fontSize: '14px' }}>{n.message}</p>

                {n.data && (
                  <div className="data-preview bg-light p-2 rounded-3 mb-2 small text-muted border border-white">
                    {n.type === 'order' && (
                        <div className="row g-2">
                            <div className="col-6">👤 {n.data.client_name}</div>
                            <div className="col-6 text-end">💰 ${Number(n.data.total_price).toFixed(2)}</div>
                            <div className="col-12">📍 {n.data.city}</div>
                        </div>
                    )}
                    {n.type === 'message' && (
                        <div className="fst-italic">"{n.data.short_content}"</div>
                    )}
                  </div>
                )}

                <div className="actions d-flex gap-2">
                    {n.type === 'order' && (
                         <button className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1" onClick={(e) => { e.stopPropagation(); navigate(`/orders/${n.data.order_id}`); }}>
                            Voir la commande
                         </button>
                    )}
                    {n.type === 'message' && (
                         <button className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1" onClick={(e) => { e.stopPropagation(); navigate(`/chat/${n.data.sender_id}`); }}>
                            Répondre
                         </button>
                    )}
                    <button className="btn btn-sm btn-light rounded-pill px-3 py-1 border text-muted" onClick={(e) => { e.stopPropagation(); archiveNotification(n.id); }}>
                        Archiver
                    </button>
                </div>
              </div>

              {!n.is_read && <div className="unread-dot bg-primary rounded-circle" style={{ width: '10px', height: '10px', marginTop: '15px' }}></div>}
            </div>
          ))}
        </div>
      )}
      <style>{`
        .notification-item { transition: background 0.2s; position: relative; }
        .notification-item:hover { background: #f8fbff; }
        .unread-bg { background: rgba(13, 110, 253, 0.03); }
        .cursor-pointer { cursor: pointer; }
        .icon-container { transition: transform 0.2s; }
        .notification-item:hover .icon-container { transform: scale(1.1); }
      `}</style>
    </div>
  );
}