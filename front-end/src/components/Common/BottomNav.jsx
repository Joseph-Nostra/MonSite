import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BottomNav = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bottom-nav d-md-none fixed-bottom bg-white border-top shadow-lg d-flex justify-content-around align-items-center" style={{ height: '70px', zIndex: 1040 }}>
            <button 
                className={`btn btn-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive('/products') ? 'text-primary' : 'text-muted'}`}
                onClick={() => navigate('/products')}
            >
                <i className={`bi bi-house${isActive('/products') ? '-fill' : ''} fs-4`}></i>
                <span style={{ fontSize: '10px' }}>Accueil</span>
            </button>

            <button 
                className={`btn btn-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive('/products') && location.search.includes('q=') ? 'text-primary' : 'text-muted'}`}
                onClick={() => {
                    navigate('/products');
                    // Focus search if on products
                }}
            >
                <i className="bi bi-search fs-4"></i>
                <span style={{ fontSize: '10px' }}>Recherche</span>
            </button>

            <button 
                className={`btn btn-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive('/messages') ? 'text-primary' : 'text-muted'}`}
                onClick={() => navigate('/messages')}
            >
                <i className={`bi bi-chat-dots${isActive('/messages') ? '-fill' : ''} fs-4`}></i>
                <span style={{ fontSize: '10px' }}>Chat</span>
            </button>

            <button 
                className={`btn btn-link text-decoration-none d-flex flex-column align-items-center gap-1 ${isActive('/settings') || isActive('/profile') ? 'text-primary' : 'text-muted'}`}
                onClick={() => navigate('/settings')}
            >
                <i className={`bi bi-person${isActive('/settings') || isActive('/profile') ? '-fill' : ''} fs-4`}></i>
                <span style={{ fontSize: '10px' }}>Profil</span>
            </button>

            <style>{`
                .bottom-nav {
                    background-color: var(--card-bg) !important;
                    border-color: var(--border-color) !important;
                }
                .bottom-nav .btn-link {
                    color: var(--text-color);
                    flex: 1;
                    padding: 8px 0;
                }
            `}</style>
        </div>
    );
};

export default BottomNav;
