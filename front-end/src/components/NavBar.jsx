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

  // 🔥 auto refresh toutes les 10s (optionnel mais PRO)
  const interval = setInterval(fetchStats, 10000);

  return () => clearInterval(interval);

}, [user]);

  const handleLogout = async () => {
    try {
      // ❌ PAS de CSRF
      await api.post("/logout");

      // 🔥 supprimer token local
      localStorage.removeItem("token");

      setUser(null);
      navigate("/login");

    } catch (err) {
      console.error("Erreur déconnexion:", err.response?.data || err.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 fixed-top shadow-sm">
      
      {/* 🔥 SPA navigation */}
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/products">
        <img src="/logo.png" alt="MonSite Logo" width="40" height="40" className="rounded-circle" />
        <span className="fw-bold text-uppercase tracking-wider">MonSite</span>
      </Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center gap-3">

    {loading ? null : user ? (
      <>
        {/* USER NAME */}
        <li className="nav-item">
          <span className="nav-link text-white-50">Bienvenue, <strong className="text-white">{user.name}</strong></span>
        </li>

        {/* 💬 MESSAGES */}
        <li className="nav-item">
          <button
            className="btn btn-outline-light position-relative border-0"
            onClick={() => navigate("/messages")}
          >
            💬
            {unreadMessages > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadMessages}
              </span>
            )}
          </button>
        </li>

        {/* 🔔 NOTIFICATIONS */}
        <li className="nav-item">
          <button
            className="btn btn-outline-light position-relative border-0"
            onClick={() => navigate("/notifications")}
          >
            🔔
            {unread > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                {unread}
              </span>
            )}
          </button>
        </li>

      {/* 🛍️ ADD PRODUCT (vendeur/admin) */}
      {(user.role === "vendeur" || user.role === "admin") && (
        <li className="nav-item">
          <Link className="nav-link" to="/add-product">
            ➕ Ajouter produit
          </Link>
        </li>
      )}

      {/* 📦 ORDERS (client) */}
      {user.role === "client" && (
        <li className="nav-item">
          <Link className="nav-link" to="/orders">
            📦 Mes commandes
          </Link>
        </li>
      )}

      {/* 🚪 LOGOUT */}
      <li className="nav-item">
        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </li>
    </>
  ) : (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Connexion
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Inscription
        </Link>
      </li>
    </>
  )}
        </ul>
      </div>
    </nav>
  );
}