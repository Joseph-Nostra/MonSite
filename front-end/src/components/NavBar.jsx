import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import api from "../axios";

export default function NavBar({ user, setUser, loading }) {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const resNotif = await api.get("/notifications");
        setUnread(resNotif.data.unread_count);
        const resMsg = await api.get("/messages/unread-count");
        setUnreadMessages(resMsg.data.unread_count);
      } catch (err) {
        console.error("Erreur stats:", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 fixed-top shadow-lg border-bottom border-secondary">
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/products">
        <div className="logo-icon bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          <span className="text-white fw-bold h4 mb-0">M</span>
        </div>
        <span className="fw-bold text-uppercase tracking-wider">MonSite</span>
      </Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center gap-3">
          {!loading && user ? (
            <>
              {/* 🟢 AJOUTER PRODUIT (Vendeur/Admin) - Highlighted */}
              {(user.role === "vendeur" || user.role === "admin") && (
                <li className="nav-item">
                  <button 
                    className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                    onClick={() => navigate("/add-product")}
                  >
                    <span className="h5 mb-0">+</span> Ajouter un produit
                  </button>
                </li>
              )}

              {/* 💬 MESSAGES */}
              <li className="nav-item">
                <button
                  className="btn btn-dark position-relative border-secondary rounded-circle p-2"
                  onClick={() => navigate("/messages")}
                  title="Messages"
                >
                  <span className="h5">💬</span>
                  {unreadMessages > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark">
                      {unreadMessages}
                    </span>
                  )}
                </button>
              </li>

              {/* 🔔 NOTIFICATIONS */}
              <li className="nav-item">
                <button
                  className="btn btn-dark position-relative border-secondary rounded-circle p-2"
                  onClick={() => navigate("/notifications")}
                  title="Notifications"
                >
                  <span className="h5">🔔</span>
                  {unread > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-dark">
                      {unread}
                    </span>
                  )}
                </button>
              </li>

              {/* 👤 PROFILE DROPDOWN */}
              <li className="nav-item dropdown">
                <button 
                  className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2 border-secondary rounded-pill px-3 py-2" 
                  data-bs-toggle="dropdown"
                >
                  <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                    <span className="small text-white">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="small fw-semibold">{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2" style={{ minWidth: '200px' }}>
                  <li className="dropdown-header">Compte {user.role}</li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item py-2" onClick={() => navigate("/profile")}>👤 Mon Profil</button></li>
                  {user.role === 'client' && (
                    <li><button className="dropdown-item py-2" onClick={() => navigate("/orders")}>📦 Mes Commandes</button></li>
                  )}
                  <li><button className="dropdown-item py-2" onClick={() => navigate("/settings")}>⚙️ Paramètres</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger fw-bold" onClick={handleLogout}>
                      🚪 Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : !loading && (
            <>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/login">Connexion</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-primary rounded-pill px-4 fw-bold" to="/register">S'inscrire</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <style>{`
        .navbar-dark .nav-link { color: rgba(255,255,255,0.8); transition: color 0.2s; }
        .navbar-dark .nav-link:hover { color: #fff; }
        .dropdown-item { transition: background 0.2s; }
        .dropdown-item:hover { background: #f8f9fa; }
        .tracking-wider { letter-spacing: 0.1em; }
      `}</style>
    </nav>
  );
}