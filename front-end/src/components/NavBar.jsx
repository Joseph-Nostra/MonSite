import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../axios";
import Logo from "./Common/Logo";
import LoadingSpinner from "./Common/LoadingSpinner";
import { useTranslation } from "react-i18next";
import UserAvatar from "./Common/UserAvatar";

export default function NavBar({ user, setUser, loading, theme, setTheme }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const showSearch = location.pathname === "/products";

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
    <header className="fixed-top shadow-lg navbar-custom" style={{ height: '70px', zIndex: 1050, backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="h-100 px-4 d-grid align-items-center" style={{ gridTemplateColumns: '1fr auto 1fr', gap: '20px' }}>
        
        {/* 🧱 1. LOGO (GAUCHE) */}
        <div className="d-flex align-items-center justify-content-start">
          <Logo />
        </div>

        {/* 🔍 2. BARRE DE RECHERCHE (CENTRE - Conditional) */}
        <div className="d-flex justify-content-center align-items-center" style={{ minWidth: '350px' }}>
          {showSearch ? (
            <form className="w-100" style={{ maxWidth: '450px' }} onSubmit={handleSearch}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-secondary border-0 text-white-50 px-3 rounded-start-pill">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  className="form-control search-input py-2"
                  type="search"
                  placeholder="Rechercher par nom, prix..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary px-4 rounded-end-pill fw-bold border-0" type="submit" style={{ background: 'linear-gradient(45deg, #0d6efd, #00d2ff)' }}>
                  Chercher
                </button>
              </div>
            </form>
          ) : (
            <div style={{ height: '38px', width: '350px' }}></div>
          )}
        </div>

        {/* 👤 3. ACTIONS (DROITE) */}
        <div className="d-flex align-items-center justify-content-end gap-3 text-nowrap">
          
          {/* THEME TOGGLE */}
          <button className="btn-icon-nav" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title={t('dark_mode')}>
            {theme === 'light' ? <i className="bi bi-moon-stars fs-5"></i> : <i className="bi bi-sun fs-5 text-warning"></i>}
          </button>

          {/* LANGUAGE DROPDOWN */}
          <div className="dropdown">
            <button className="btn-icon-nav dropdown-toggle border-0" data-bs-toggle="dropdown">
              <i className="bi bi-translate fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
               <li><button className="dropdown-item py-1" onClick={() => i18n.changeLanguage('fr')}>🇫🇷 Français</button></li>
               <li><button className="dropdown-item py-1" onClick={() => i18n.changeLanguage('en')}>🇺🇸 English</button></li>
               <li><button className="dropdown-item py-1" onClick={() => i18n.changeLanguage('ar')}>🇲🇦 العربية</button></li>
            </ul>
          </div>
          {!loading && user ? (
            <>
              {/* AJOUTER PRODUIT */}
              {(user.role === "vendeur" || user.role === "admin") && (
                <button 
                  className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2 btn-main-action border-0"
                  onClick={() => navigate("/add-product")}
                  style={{ fontSize: '14px', background: 'linear-gradient(45deg, #0d6efd, #00d2ff)' }}
                >
                  <i className="bi bi-plus-circle-fill"></i> Vendre
                </button>
              )}

              {/* MESSAGES */}
              <button className="btn-icon-nav position-relative" onClick={() => navigate("/messages")} title="Messages">
                <i className="bi bi-chat-dots fs-5"></i>
                {unreadMessages > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark border-2 notification-badge">{unreadMessages}</span>}
              </button>

              {/* DROPDOWN MENU */}
              <div className="dropdown ms-1">
                <button className="user-profile-btn dropdown-toggle border-0" data-bs-toggle="dropdown" aria-expanded="false" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <UserAvatar name={user.name} src={user.avatar} size={34} />
                    <div className="flex-grow-1 overflow-hidden d-none d-xl-block text-start">
                        <div className="fw-bold text-truncate text-white" style={{ fontSize: '14px' }}>{user.name}</div>
                        <div className="small text-muted d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                            <span className="dot bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></span> {t('online')}
                        </div>
                    </div>
                    <i className="bi bi-chevron-down small ms-1 text-muted"></i>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-3 py-2 animate-dropdown" style={{ minWidth: '240px' }}>
                  <div className="px-4 py-3 mb-1 bg-light rounded-top-4 mx-2 mt-2">
                      <div className="d-flex align-items-center gap-3">
                        <UserAvatar name={user.name} src={user.avatar} size={45} />
                        <div className="overflow-hidden">
                            <p className="mb-0 fw-bold text-white text-truncate">{user.name}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>{t('account')} {user.role.toUpperCase()}</p>
                        </div>
                      </div>
                  </div>
                  <li><hr className="dropdown-divider opacity-50 mx-2" /></li>
                  
                  {/* Mes commandes */}
                  <li><button className="dropdown-item py-2 px-3 d-flex align-items-center gap-3" onClick={() => navigate("/orders")}>
                    <i className="bi bi-bag-check text-primary"></i> {t('my_orders')}
                  </button></li>

                  {/* Favoris */}
                  <li><button className="dropdown-item py-2 px-3 d-flex align-items-center gap-3" onClick={() => navigate("/settings", { state: { tab: 'favorites' } })}>
                    <i className="bi bi-heart text-danger"></i> {t('favorites')}
                  </button></li>

                  {/* Mes produits (if vendor) */}
                  {(user.role === 'vendeur' || user.role === 'admin') && (
                    <li><button className="dropdown-item py-2 px-3 d-flex align-items-center gap-3" onClick={() => navigate("/my-products")}>
                      <i className="bi bi-box-seam text-primary"></i> {t('my_products')}
                    </button></li>
                  )}

                  {/* Statistiques (if vendor) */}
                  {(user.role === 'vendeur' || user.role === 'admin') && (
                    <li><button className="dropdown-item py-2 px-3 d-flex align-items-center gap-3" onClick={() => navigate("/stats")}>
                      <i className="bi bi-graph-up-arrow text-primary"></i> Statistiques
                    </button></li>
                  )}

                  <div className="dropdown-divider opacity-50 mx-2"></div>

                  {/* Paramètres */}
                  <li><button className="dropdown-item py-2 px-3 d-flex align-items-center gap-3" onClick={() => navigate("/settings")}>
                    <i className="bi bi-gear text-secondary"></i> Paramètres
                  </button></li>

                  <li><hr className="dropdown-divider opacity-50 mx-2" /></li>

                  {/* Déconnexion */}
                  <li><button className="dropdown-item py-2 px-3 text-danger fw-bold d-flex align-items-center gap-3" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Déconnexion
                  </button></li>
                </ul>
              </div>
            </>
          ) : !loading && (
            <div className="d-flex gap-2">
              <Link className="btn text-white fw-semibold" to="/login">Connexion</Link>
              <Link className="btn btn-primary rounded-pill px-4 fw-bold" to="/register">S'inscrire</Link>
            </div>
          )}
        </div>

      </div>
      <style>{`
        .navbar-custom {
            background-color: var(--card-bg);
            border-color: var(--border-color) !important;
            color: var(--text-color);
        }
        .bg-secondary { background-color: rgba(128, 128, 128, 0.1) !important; }
        .form-control { color: var(--text-color) !important; }
        .dropdown-menu { background-color: var(--card-bg); border: 1px solid var(--border-color); }
        .dropdown-item { color: var(--text-color) !important; }
        .input-group-text { background-color: rgba(255, 255, 255, 0.1) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: rgba(255, 255, 255, 0.7) !important; }
        .search-input { background-color: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: white !important; }
        .search-input::placeholder { color: rgba(255, 255, 255, 0.4) !important; }
        .btn-icon-nav { background: transparent; border: none; padding: 8px; color: var(--text-color); opacity: 0.7; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .btn-icon-nav:hover { transform: translateY(-2px); color: #fff; }
        .notification-badge { font-size: 10px; padding: 4.5px 6.5px; top: 8px !important; right: 0px !important; }
        
        .user-profile-btn { 
            display: flex; 
            align-items: center; 
            padding: 4px 12px;
            border-radius: 50px;
            transition: background 0.2s;
        }
        .user-profile-btn:hover { background: rgba(255, 255, 255, 0.1); }
        .user-profile-btn::after { display: none; }
        
        .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(45deg, #0d6efd, #00d2ff); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; }
        .user-name { font-size: 14px; }
        .dropdown-item { font-size: 14px; border-radius: 8px; margin: 0 8px; width: calc(100% - 16px); transition: all 0.2s; }
        .dropdown-item:hover { background: #f8f9fa; transform: translateX(3px); }
        .animate-dropdown { animation: slideDown 0.2s ease-out; transform-origin: top right; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .btn-main-action { transition: all 0.3s; }
        .btn-main-action:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4); }
      `}</style>
    </header>
  );
}