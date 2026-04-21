import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import api from "../axios";

export default function NavBar({ user, setUser, loading }) {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchTerm}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 fixed-top shadow-lg border-bottom border-secondary">
      <div className="container-fluid gap-3">
        {/* 🧱 1. LOGO (GAUCHE) */}
        <Link className="navbar-brand d-flex align-items-center gap-2 m-0" to="/products">
          <img src="/logo.png" alt="Logo" width="35" height="35" className="rounded-circle" />
          <span className="fw-bold text-uppercase d-none d-sm-inline" style={{ letterSpacing: '1px' }}>MonSite</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse d-lg-flex justify-content-between" id="navbarNav">
          
          {/* 🔍 1. BARRE DE RECHERCHE (CENTRE) */}
          <form className="d-flex mx-auto col-lg-5 mt-2 mt-lg-0" onSubmit={handleSearch}>
            <div className="input-group">
              <span className="input-group-text bg-secondary border-0 text-white-50 px-3 pr-0 rounded-start-pill">
                <i className="bi bi-search small"></i>
              </span>
              <input
                className="form-control bg-secondary border-0 text-white placeholder-light px-2"
                type="search"
                placeholder="Rechercher un produit..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '14px' }}
              />
              <button 
                className="btn btn-primary px-3 rounded-end-pill" 
                type="submit"
              >
                Chercher
              </button>
            </div>
          </form>

          <ul className="navbar-nav align-items-center gap-2 mt-3 mt-lg-0">
            {!loading && user ? (
              <>
                {/* ➕ 2. AJOUTER PRODUIT */}
                {(user.role === "vendeur" || user.role === "admin") && (
                  <li className="nav-item me-2">
                    <button 
                      className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-1 btn-main-action"
                      onClick={() => navigate("/add-product")}
                    >
                      <span className="h5 mb-0">+</span> <span className="small">Vendre</span>
                    </button>
                  </li>
                )}

                {/* 💬 MESSAGES */}
                <li className="nav-item">
                  <button
                    className="btn btn-icon-nav position-relative"
                    onClick={() => navigate("/messages")}
                    title="Messages"
                  >
                    <span className="fs-5">💬</span>
                    {unreadMessages > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark border-2 notification-badge">
                        {unreadMessages}
                      </span>
                    )}
                  </button>
                </li>

                {/* 🔔 NOTIFICATIONS */}
                <li className="nav-item">
                  <button
                    className="btn btn-icon-nav position-relative"
                    onClick={() => navigate("/notifications")}
                    title="Notifications"
                  >
                    <span className="fs-5">🔔</span>
                    {unread > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-dark border-2 notification-badge">
                        {unread}
                      </span>
                    )}
                  </button>
                </li>

                {/* 👤 4. MENU UTILISATEUR (DROPDOWN) */}
                <li className="nav-item dropdown ms-lg-2">
                  <button 
                    className="user-profile-btn dropdown-toggle" 
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="user-avatar text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name d-none d-md-inline">{user.name}</span>
                    <i className="bi bi-chevron-down small ms-1 opa-50"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-3 py-2 animate-dropdown" style={{ minWidth: '220px' }}>
                    <div className="px-3 py-2 mb-2">
                        <p className="mb-0 fw-bold small text-dark">{user.name}</p>
                        <p className="mb-0 text-muted small" style={{ fontSize: '11px' }}>{user.email || user.role}</p>
                    </div>
                    <li><hr className="dropdown-divider opacity-50" /></li>
                    
                    {user.role === 'vendeur' && (
                        <>
                            <li><button className="dropdown-item py-2" onClick={() => navigate("/my-products")}>📦 Mes Produits</button></li>
                            <li><button className="dropdown-item py-2" onClick={() => navigate("/stats")}>📊 Statistiques</button></li>
                        </>
                    )}
                    
                    {user.role === 'client' && (
                      <li><button className="dropdown-item py-2" onClick={() => navigate("/orders")}>📦 Mes Commandes</button></li>
                    )}
                    
                    <li><button className="dropdown-item py-2" onClick={() => navigate("/profile")}>👤 Mon Profil</button></li>
                    <li><button className="dropdown-item py-2" onClick={() => navigate("/settings")}>⚙️ Paramètres</button></li>
                    
                    <li><hr className="dropdown-divider opacity-50" /></li>
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
      </div>
      <style>{`
        .bg-secondary { background-color: rgba(255, 255, 255, 0.1) !important; }
        .placeholder-light::placeholder { color: rgba(255, 255, 255, 0.4); }
        .btn-icon-nav { background: transparent; border: none; padding: 8px; color: rgba(255,255,255,0.8); transition: all 0.2s; }
        .btn-icon-nav:hover { transform: translateY(-2px); color: #fff; }
        .notification-badge { font-size: 10px; padding: 4px 6px; }
        
        .user-profile-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 5px 12px 5px 5px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s;
        }
        .user-profile-btn:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); }
        .user-profile-btn::after { display: none; }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(45deg, #0d6efd, #00d2ff);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
        }
        .user-name { font-size: 14px; font-weight: 500; }
        .opa-50 { opacity: 0.5; }
        
        .dropdown-item { font-size: 14px; border-radius: 8px; margin: 0 8px; width: calc(100% - 16px); }
        .dropdown-item i { width: 20px; display: inline-block; }
        .animate-dropdown { animation: slideDown 0.3s ease-out; transform-origin: top right; }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .btn-main-action { transition: all 0.3s; }
        .btn-main-action:hover { transform: scale(1.05); box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4) !important; }
      `}</style>
    </nav>
  );
}