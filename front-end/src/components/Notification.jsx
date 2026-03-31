import { useEffect, useState } from "react";
import api from "../axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.put("/notifications/read-all");
  }, []);

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
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="container  mt-5 pt-5">
      <h3>🔔 Notifications</h3>

      {notifications.length === 0 && <p>Aucune notification</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`card p-2 mb-2 ${!n.is_read ? "bg-light" : ""}`}
        >
          <p>{n.message}</p>

          <div>
            {!n.is_read && (
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => markAsRead(n.id)}
              >
                Marquer comme lu
              </button>
            )}

            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteNotification(n.id)}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}