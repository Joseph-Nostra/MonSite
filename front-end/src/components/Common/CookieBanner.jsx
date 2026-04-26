import React, { useState, useEffect } from 'react';
import { Shield, X, Check, Settings, Info } from 'lucide-react';
import { useTranslation } from "react-i18next";

const CookieBanner = ({ user }) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show banner if user is logged in and hasn't addressed it in this session
        const hasAddressedInSession = sessionStorage.getItem('cookie-addressed-this-session');
        
        if (user && !hasAddressedInSession) {
            // Small delay for better UX after login redirection
            const timer = setTimeout(() => {
                setVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (!user) {
            // Hide if user logs out
            setVisible(false);
            sessionStorage.removeItem('cookie-addressed-this-session');
        }
    }, [user]);

    const handleConsent = (choice) => {
        // In a real app, we might send this to the back-end or set specific cookies
        localStorage.setItem('cookie-consent', choice);
        sessionStorage.setItem('cookie-addressed-this-session', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed-bottom p-3 p-md-4 animate__animated animate__fadeInUp" style={{ zIndex: 10000 }}>
            <div className="container-fluid">
                <div className="card border-0 shadow-2xl rounded-5 overflow-hidden glass-banner mx-auto" style={{ 
                    maxWidth: '1200px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="row align-items-center g-4">
                            <div className="col-auto d-none d-lg-block">
                                <div className="icon-pulse rounded-circle p-4" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))' }}>
                                    <Shield size={42} className="text-primary" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <div className="bg-primary bg-opacity-20 p-2 rounded-3 d-lg-none">
                                        <Shield size={20} className="text-primary" />
                                    </div>
                                    <h4 className="fw-bold m-0 text-white letter-spacing-tight">
                                        {t('cookie_title')}
                                    </h4>
                                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-2 rounded-pill d-none d-sm-inline-block">
                                        <Info size={14} className="me-1 mb-1" /> Privacy First
                                    </span>
                                </div>
                                <p className="text-slate-400 mb-0 lh-relaxed" style={{ fontSize: '1rem', color: '#94a3b8' }}>
                                    {t('cookie_desc')}
                                </p>
                            </div>
                            <div className="col-xl-auto">
                                <div className="d-flex flex-wrap gap-2 justify-content-center">
                                    <button 
                                        className="btn btn-dark border-secondary rounded-pill px-4 py-2 hover-lift transition-all d-flex align-items-center gap-2"
                                        onClick={() => handleConsent('refused')}
                                        style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#e2e8f0', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                                    >
                                        <X size={18} />
                                        {t('refuse_all')}
                                    </button>
                                    <button 
                                        className="btn btn-dark border-secondary rounded-pill px-4 py-2 hover-lift transition-all d-flex align-items-center gap-2"
                                        onClick={() => handleConsent('custom')}
                                        style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#e2e8f0', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                                    >
                                        <Settings size={18} />
                                        {t('customize')}
                                    </button>
                                    <button 
                                        className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-lg hover-glow transition-all d-flex align-items-center gap-2"
                                        onClick={() => handleConsent('accepted')}
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }}
                                    >
                                        <Check size={18} />
                                        {t('accept_all')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .glass-banner {
                    animation: banner-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                    background-color: rgba(51, 65, 85, 0.8) !important;
                }
                .hover-glow:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
                }
                .icon-pulse {
                    animation: pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                }
                @keyframes banner-slide-up {
                    from { transform: translateY(100%) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                .letter-spacing-tight {
                    letter-spacing: -0.025em;
                }
            `}</style>
        </div>
    );
};

export default CookieBanner;
