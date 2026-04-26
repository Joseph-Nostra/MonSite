import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../axios";
import Logo from "./Common/Logo";
import LoadingSpinner from "./Common/LoadingSpinner";
import { useTranslation } from "react-i18next";
import UserAvatar from "./Common/UserAvatar";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar({ user, setUser, loading, theme, setTheme }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const showSearch = location.pathname === "/products";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (searchTerm.trim()) {
        navigate(`/products?q=${searchTerm}`);
    }
  };

  return (
    <header 
        className={`fixed-top transition-all duration-300 ${isScrolled ? 'nav-scrolled shadow-2xl' : 'nav-initial'}`} 
        style={{ 
            height: '80px', 
            zIndex: 1050, 
            backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.95)' : '#0f172a',
            backdropFilter: isScrolled ? 'blur(12px)' : 'none',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
    >
      <div className="h-100 px-4 px-xl-5 d-flex align-items-center justify-content-between gap-4">
        
        {/* 🧱 1. LOGO */}
        <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="d-flex align-items-center flex-shrink-0"
        >
          <Logo />
        </motion.div>

        {/* 🔍 2. SEARCH (CENTERED) */}
        <div className="flex-grow-1 d-none d-md-flex justify-content-center" style={{ maxWidth: '600px' }}>
          {showSearch && (
            <motion.form 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-100" 
                onSubmit={handleSearch}
            >
              <div className="input-group search-group-premium overflow-hidden rounded-pill border border-white border-opacity-10 shadow-inner" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="input-group-text bg-transparent border-0 text-slate-500 ps-4">
                  <i className="bi bi-search fs-6"></i>
                </span>
                <input
                  className="form-control bg-transparent border-0 text-white py-2 ps-2"
                  type="search"
                  placeholder="Rechercher un produit, une référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '14px', boxShadow: 'none' }}
                />
                <button className="btn btn-primary px-4 py-2 fw-bold border-0 transition-all hover-glow" type="submit" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  {t('search')}
                </button>
              </div>
            </motion.form>
          )}
        </div>

        {/* 👤 3. ACTIONS */}
        <div className="d-flex align-items-center gap-2 gap-xl-3 text-nowrap">
          
          {/* THEME & LANG (DESKTOP) */}
          <div className="d-none d-lg-flex align-items-center gap-2 me-2 border-end border-white border-opacity-10 pe-3">
            <button className="nav-action-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title={t('dark_mode')}>
                {theme === 'light' ? <i className="bi bi-moon-stars"></i> : <i className="bi bi-sun text-warning"></i>}
            </button>

            <div className="dropdown">
                <button className="nav-action-btn dropdown-toggle border-0" data-bs-toggle="dropdown">
                    <i className="bi bi-translate"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-2xl border-0 rounded-4 mt-2 p-2 glass-dropdown">
                    <li><button className="dropdown-item rounded-3 py-2" onClick={() => i18n.changeLanguage('fr')}>🇫🇷 Français</button></li>
                    <li><button className="dropdown-item rounded-3 py-2" onClick={() => i18n.changeLanguage('en')}>🇺🇸 English</button></li>
                    <li><button className="dropdown-item rounded-3 py-2" onClick={() => i18n.changeLanguage('ar')}>🇲🇦 العربية</button></li>
                </ul>
            </div>
          </div>

          {!loading && user ? (
            <div className="d-flex align-items-center gap-2 gap-xl-3">
              {/* SELLER SPECIFIC ACTION */}
              {(user.role === "vendeur" || user.role === "admin") && (
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-lg border-0 d-none d-md-flex align-items-center gap-2 btn-vendre"
                  onClick={() => navigate("/add-product")}
                  style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', fontSize: '14px' }}
                >
                  <i className="bi bi-plus-circle"></i> Vendre
                </motion.button>
              )}

              {/* MESSAGES & NOTIFS */}
              <div className="d-flex align-items-center gap-1">
                <button className="nav-action-btn position-relative" onClick={() => navigate("/messages")} title="Messages">
                    <i className="bi bi-chat-left-dots"></i>
                    {unreadMessages > 0 && <span className="badge-notification">{unreadMessages}</span>}
                </button>

                <button className="nav-action-btn position-relative d-none d-sm-flex" onClick={() => navigate("/compare")} title="Comparer">
                    <i className="bi bi-arrow-left-right"></i>
                    {JSON.parse(localStorage.getItem('compare_ids') || '[]').length > 0 && (
                        <span className="badge-notification bg-cyan">{JSON.parse(localStorage.getItem('compare_ids') || '[]').length}</span>
                    )}
                </button>
              </div>

              {/* USER PROFILE */}
              <div className="dropdown ms-1 ms-xl-2">
                <button className="profile-trigger dropdown-toggle border-0" data-bs-toggle="dropdown">
                  <div className="d-flex align-items-center gap-2 gap-xl-3">
                    <div className="avatar-wrapper">
                        <UserAvatar name={user.name} src={user.avatar} size={38} />
                        <span className="status-indicator online"></span>
                    </div>
                    <div className="d-none d-lg-block text-start leading-none">
                        <div className="fw-bold text-white mb-0.5" style={{ fontSize: '13.5px', letterSpacing: '-0.01em' }}>{user.name}</div>
                        <div className="text-slate-400 font-medium d-flex align-items-center gap-1" style={{ fontSize: '10.5px' }}>
                            <span className="opacity-60">{user.role === 'vendeur' ? 'VENDEUR' : 'CLIENT'}</span>
                        </div>
                    </div>
                    <div className="chevron-icon-wrapper d-none d-sm-flex align-items-center justify-content-center">
                        <i className="bi bi-chevron-down text-slate-500" style={{ fontSize: '12px' }}></i>
                    </div>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-2xl border-0 rounded-4 mt-3 p-2 glass-dropdown animate-slide-in" style={{ minWidth: '260px' }}>
                  <div className="px-3 py-3 mb-2 bg-white bg-opacity-5 rounded-4 mx-1">
                      <div className="d-flex align-items-center gap-3">
                        <UserAvatar name={user.name} src={user.avatar} size={45} />
                        <div className="overflow-hidden">
                            <p className="mb-0 fw-bold text-white text-truncate">{user.name}</p>
                            <p className="mb-0 text-slate-500" style={{ fontSize: '11px' }}>{user.email}</p>
                        </div>
                      </div>
                  </div>
                  
                  <li><Link className="dropdown-item py-2" to="/orders"><i className="bi bi-bag me-3 text-primary"></i> {t('my_orders')}</Link></li>
                  <li><Link className="dropdown-item py-2" to="/settings" state={{ tab: 'favorites' }}><i className="bi bi-heart me-3 text-danger"></i> {t('favorites')}</Link></li>
                  
                  {/* Vendor Links */}
                  {(user.role === 'vendeur' || user.role === 'admin') && (
                    <>
                        <div className="dropdown-divider opacity-10 mx-2"></div>
                        <li><Link className="dropdown-item py-2" to="/my-products"><i className="bi bi-box-seam me-3 text-emerald"></i> {t('my_products')}</Link></li>
                        <li><Link className="dropdown-item py-2" to="/stats"><i className="bi bi-graph-up-arrow me-3 text-emerald"></i> Statistiques</Link></li>
                    </>
                  )}

                  <div className="dropdown-divider opacity-10 mx-2"></div>
                  <li><Link className="dropdown-item py-2" to="/settings"><i className="bi bi-gear me-3 text-slate-400"></i> {t('settings')}</Link></li>
                  <li><button className="dropdown-item py-2 text-danger fw-bold" onClick={handleLogout}><i className="bi bi-box-arrow-right me-3"></i> {t('logout')}</button></li>
                </ul>
              </div>
            </div>
          ) : !loading && (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-light rounded-pill px-4 fw-semibold border-0 hover-bg-light" to="/login">Connexion</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link className="btn btn-primary rounded-pill px-4 fw-bold shadow-lg border-0" to="/register" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>S'inscrire</Link>
              </motion.div>
            </div>
          )}
        </div>

      </div>
      <style>{`
        .nav-scrolled { transition: all 0.3s; }
        .nav-initial { transition: all 0.3s; }
        
        .nav-action-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
            padding: 0;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .nav-action-btn i { font-size: 1.25rem; }
        .nav-action-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.1);
        }
        
        .badge-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            font-size: 10px;
            font-weight: 800;
            min-width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #0f172a;
        }
        .bg-cyan { background: #06b6d4; }
        
        .profile-trigger {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06) !important;
            padding: 4px 10px 4px 4px;
            border-radius: 50px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .profile-trigger:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.12) !important;
            transform: translateY(-1px);
        }
        
        .chevron-icon-wrapper {
            width: 24px;
            height: 24px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 50%;
            margin-left: 4px;
            transition: all 0.2s;
        }
        .profile-trigger:hover .chevron-icon-wrapper {
            background: rgba(255, 255, 255, 0.08);
            transform: rotate(180deg);
        }
        
        .avatar-wrapper { position: relative; }
        .status-indicator {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid #0f172a;
        }
        .status-indicator.online { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
        
        .glass-dropdown {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .dropdown-item {
            color: #94a3b8 !important;
            font-weight: 500;
            transition: all 0.2s;
        }
        .dropdown-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #fff !important;
            transform: translateX(4px);
        }
        
        .hover-bg-light:hover { background: rgba(255, 255, 255, 0.05) !important; }
        .hover-glow:hover { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
        
        .animate-slide-in {
            animation: navSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            transform-origin: top right;
        }
        @keyframes navSlideIn {
            from { opacity: 0; transform: translateY(10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .text-emerald { color: #10b981 !important; }
        
        .btn-vendre {
            position: relative;
            overflow: hidden;
        }
        .btn-vendre::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            animation: shine 4s infinite;
        }
        @keyframes shine {
            0% { left: -100%; }
            20% { left: 100%; }
            100% { left: 100%; }
        }
      `}</style>
    </header>
  );
}