import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../axios";

export default function NavBar({ user, setUser, loading }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const showSearch = location.pathname === "/products" || location.pathname === "/";

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
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark shadow-lg border-bottom border-secondary py-0" style={{ height: '70px' }}>
      <div className="container-fluid d-flex align-items-center h-100 px-4">
        
        {/* 🧱 1. LOGO (GAUCHE) */}
        <div className="d-flex align-items-center" style={{ flex: '1', minWidth: '150px' }}>
          <Link className="navbar-brand d-flex align-items-center gap-2 m-0" to="/products">
            <img src="/logo.png" alt="Logo" width="35" height="35" className="rounded-circle" />
            <span className="fw-bold text-uppercase d-none d-md-inline" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>MonSite</span>
          </Link>
        </div>

        {/* 🔍 2. BARRE DE RECHERCHE (CENTRE - Conditional) */}
        <div className="d-none d-lg-flex justify-content-center align-items-center" style={{ flex: '2' }}>
          {showSearch ? (
            <form className="w-100" style={{ maxWidth: '500px' }} onSubmit={handleSearch}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-secondary border-0 text-white-50 px-3 rounded-start-pill">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  className="form-control bg-secondary border-0 text-white placeholder-light py-2"
                  type="search"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary px-4 rounded-end-pill fw-bold" type="submit">
                  Chercher
                </button>
              </div>
            </form>
          ) : (
            <div style={{ height: '38px' }}></div> // Spacer to keep layout consistent
          )}
        </div>

        {/* 👤 3. ACTIONS (DROITE) */}
        <div className="d-flex align-items-center justify-content-end gap-2" style={{ flex: '1', minWidth: '200px' }}>
            <ul className="navbar-nav flex-row align-items-center gap-1">
              {!loading && user ? (
                <>
                  {/* AJOUTER PRODUIT */}
                  {(user.role === "vendeur" || user.role === "admin") && (
                    <li className="nav-item me-1">
                      <button 
                        className="btn btn-primary rounded-pill px-3 py-1 fw-bold shadow-sm d-flex align-items-center gap-1 btn-main-action"
                        onClick={() => navigate("/add-product")}
                        style={{ fontSize: '13px' }}
                      >
                        <span className="h6 mb-0">+</span> Vendre
                      </button>
                    </li>
                  )}

                  {/* MESSAGES */}
                  <li className="nav-item">
                    <button className="btn-icon-nav position-relative" onClick={() => navigate("/messages")}>
                      <span className="fs-5">💬</span>
                      {unreadMessages > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark notification-badge">{unreadMessages}</span>}
                    </button>
                  </li>

                  {/* NOTIFICATIONS */}
                  <li className="nav-item">
                    <button className="btn-icon-nav position-relative" onClick={() => navigate("/notifications")}>
                      <span className="fs-5">🔔</span>
                      {unread > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-dark notification-badge">{unread}</span>}
                    </button>
                  </li>

                  {/* DROPDOWN MENU */}
                  <li className="nav-item dropdown ms-2">
                    <button className="user-profile-btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none', background: 'transparent' }}>
                      <div className="user-avatar text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name d-none d-xl-inline text-white ms-2">{user.name}</span>
                      <i className="bi bi-chevron-down small ms-1 text-white-50"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-3 py-2 animate-dropdown" style={{ minWidth: '220px' }}>
                      <div className="px-3 py-2 mb-1">
                          <p className="mb-0 fw-bold small text-dark">{user.name}</p>
                          <p className="mb-0 text-muted small" style={{ fontSize: '10px' }}>{user.role.toUpperCase()}</p>
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
                      <li><button className="dropdown-item py-2 text-danger fw-bold" onClick={handleLogout}>🚪 Déconnexion</button></li>
                    </ul>
                  </li>
                </>
              ) : !loading && (
                <>
                  <li className="nav-item"><Link className="nav-link fw-semibold py-1 px-3" to="/login">Connexion</Link></li>
                  <li className="nav-item"><Link className="btn btn-outline-primary rounded-pill px-4 py-1 fw-bold small" to="/register">S'inscrire</Link></li>
                </>
              )}
            </ul>
        </div>

      </div>
      <style>{`
        .bg-secondary { background-color: rgba(255, 255, 255, 0.1) !important; }
        .placeholder-light::placeholder { color: rgba(255, 255, 255, 0.3); }
        .btn-icon-nav { background: transparent; border: none; padding: 6px; color: rgba(255,255,255,0.7); transition: all 0.2s; }
        .btn-icon-nav:hover { transform: translateY(-2px); color: #fff; }
        .notification-badge { font-size: 9px; padding: 3px 5px; top: 5px !important; }
        
        .user-profile-btn { 
            display: flex; 
            align-items: center; 
            padding: 4px 8px;
            border-radius: 50px;
            transition: background 0.2s;
        }
        .user-profile-btn:hover { background: rgba(255, 255, 255, 0.1); }
        .user-profile-btn::after { display: none; }
        
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #0d6efd, #00d2ff); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
        .user-name { font-size: 14px; font-weight: 500; }
        .dropdown-item { font-size: 13px; border-radius: 8px; margin: 0 8px; width: calc(100% - 16px); }
        .animate-dropdown { animation: slideDown 0.2s ease-out; transform-origin: top right; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .btn-main-action:hover { transform: scale(1.05); }
      `}</style>
    </nav>
  );
}