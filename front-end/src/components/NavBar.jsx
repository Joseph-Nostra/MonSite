import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import api from "../axios";

export default function NavBar({ user, setUser, loading }) {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  useEffect(() => {
  if (!user) return;

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setUnread(res.data.unread_count);
    } catch (err) {
      console.error("Erreur notifications:", err);
    }
  };

  fetchNotifications();

  // 🔥 auto refresh toutes les 10s (optionnel mais PRO)
  const interval = setInterval(fetchNotifications, 10000);

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
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 fixed-top">
      
      {/* 🔥 SPA navigation */}
      <Link className="navbar-brand" to="/products">
        MonLogo
      </Link>

      <ul className="navbar-nav ms-auto align-items-center gap-2">

  {loading ? null : user ? (
    <>
      {/* USER NAME */}
      <li className="nav-item">
        <span className="nav-link">Bonjour, {user.name}</span>
      </li>

      {/* 🔔 NOTIFICATIONS */}
      <li className="nav-item">
        <button
          className="btn btn-light position-relative"
          onClick={() => navigate("/notifications")}
        >
          🔔
          {unread > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
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
    </nav>
  );
}