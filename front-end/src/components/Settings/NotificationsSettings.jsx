import api from "../../axios";
import { Bell, CheckCircle, Trash2, Clock, BagCheck, MessageSquare, Settings, History } from "lucide-react";
import NotificationPreferences from "./NotificationPreferences";

const NotificationsSettings = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('history'); // 'history' or 'preferences'

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

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h3 className="fw-bold mb-0">Centre de notifications</h3>
        <div className="btn-group bg-light p-1 rounded-pill shadow-sm" style={{ width: 'fit-content' }}>
            <button 
                className={`btn btn-sm rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 ${activeSubTab === 'history' ? 'bg-white shadow-sm text-primary fw-bold' : 'text-muted'}`}
                onClick={() => setActiveSubTab('history')}
            >
                <History size={16} /> Historique
            </button>
            <button 
                className={`btn btn-sm rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 ${activeSubTab === 'preferences' ? 'bg-white shadow-sm text-primary fw-bold' : 'text-muted'}`}
                onClick={() => setActiveSubTab('preferences')}
            >
                <Settings size={16} /> Paramètres
            </button>
        </div>
      </div>

      {activeSubTab === 'preferences' ? (
          <NotificationPreferences user={user} />
      ) : (
          <>
            <div className="d-flex justify-content-end mb-3">
                {notifications.some(n => !n.is_read) && (
                    <button className="btn btn-link text-decoration-none small text-primary fw-bold p-0" onClick={markAllAsRead}>
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border-2 border-dashed">
                    <Bell size={48} className="text-muted opacity-25 mb-3" />
                    <p className="text-muted mb-0">Aucune notification pour le moment.</p>
                </div>
            ) : (
                <div className="list-group list-group-flush rounded-4 overflow-hidden shadow-sm border bg-white">
                {notifications.map((n) => (
                    <div
                    key={n.id}
                    className={`list-group-item list-group-item-action p-4 border-bottom d-flex align-items-start gap-3 transition-all ${!n.is_read ? "border-start border-4 border-primary" : ""}`}
                    onClick={() => !n.is_read && markAsRead(n.id)}
                    style={{ cursor: 'pointer' }}
                    >
                    <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm`} 
                        style={{ width: '48px', height: '48px', backgroundColor: n.type === 'order' ? '#e7f3ff' : '#fef2f2', color: n.type === 'order' ? '#0d6efd' : '#dc3545' }}>
                        {n.type === 'order' ? <BagCheck size={20} /> : <MessageSquare size={20} />}
                    </div>

                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className={`badge ${n.type === 'order' ? 'bg-primary' : 'bg-danger'} text-uppercase`} style={{ fontSize: '10px' }}>
                            {n.type}
                        </span>
                        <div className="d-flex align-items-center text-muted small gap-1">
                            <Clock size={12} />
                            {getRelativeTime(n.created_at)}
                        </div>
                        </div>
                        
                        <p className={`mb-2 ${!n.is_read ? 'fw-bold text-dark' : 'text-secondary'}`} style={{ fontSize: '15px' }}>{n.message}</p>

                        <div className="actions d-flex gap-3">
                            <button className="btn btn-link p-0 text-muted small text-decoration-none d-flex align-items-center gap-1" onClick={(e) => { e.stopPropagation(); archiveNotification(n.id); }}>
                                <Trash2 size={14} /> Archiver
                            </button>
                            {!n.is_read && (
                                <button className="btn btn-link p-0 text-primary small text-decoration-none d-flex align-items-center gap-1" onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}>
                                    <CheckCircle size={14} /> Lu
                                </button>
                            )}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </>
      )}
    </div>
  );
};

export default NotificationsSettings;
