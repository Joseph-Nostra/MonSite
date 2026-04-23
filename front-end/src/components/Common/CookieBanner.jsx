import React, { useState, useEffect } from 'react';
import { Shield, X, Check } from 'lucide-react';
import { useTranslation } from "react-i18next";

const CookieBanner = () => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleConsent = (choice) => {
        localStorage.setItem('cookie-consent', choice);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed-bottom p-4 animate__animated animate__fadeInUp" style={{ zIndex: 9999 }}>
            <div className="container">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="row align-items-center gap-4">
                            <div className="col-auto d-none d-md-block">
                                <div className="bg-primary bg-opacity-20 p-4 rounded-circle">
                                    <Shield size={48} className="text-primary" />
                                </div>
                            </div>
                            <div className="col">
                                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <Shield size={24} className="text-primary d-md-none" />
                                    {t('cookie_title')}
                                </h4>
                                <p className="text-slate-300 mb-0 lh-lg" style={{ fontSize: '0.95rem' }}>
                                    {t('cookie_desc')}
                                </p>
                            </div>
                            <div className="col-lg-auto d-flex flex-column flex-sm-row gap-2 mt-3 mt-lg-0">
                                <button 
                                    className="btn btn-outline-light rounded-pill px-4"
                                    onClick={() => handleConsent('refused')}
                                >
                                    {t('refuse_all')}
                                </button>
                                <button 
                                    className="btn bg-white text-dark rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => handleConsent('accepted')}
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
    );
};

export default CookieBanner;
