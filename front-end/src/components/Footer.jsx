import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPaperPlane } from "react-icons/fa";
import Logo from "./Common/Logo";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-900 pt-5 pb-4 border-top border-secondary border-opacity-10" style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>
      <div className="container">
        <div className="row gy-5 mb-5 align-items-start">
          {/* Brand Column */}
          <div className="col-lg-4 pe-lg-5">
            <div className="mb-4">
                <Logo size={45} className="d-inline-flex" />
            </div>
            <p className="small lh-lg mb-4 opacity-75 text-slate-400">
              {t('footer_desc')}
            </p>
            <div className="d-flex gap-2">
              {[
                { icon: FaFacebookF, color: '#1877F2', link: 'https://facebook.com' },
                { icon: FaInstagram, color: '#E4405F', link: 'https://instagram.com' },
                { icon: FaTwitter, color: '#1DA1F2', link: 'https://twitter.com' },
                { icon: FaYoutube, color: '#FF0000', link: 'https://youtube.com' }
              ].map((social, idx) => (
                <a 
                    key={idx} 
                    href={social.link} 
                    className="social-btn d-flex align-items-center justify-content-center rounded-circle transition-all bg-white bg-opacity-5"
                    style={{ width: '40px', height: '40px', color: 'inherit', textDecoration: 'none' }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="text-white fw-bold mb-4 text-uppercase small tracking-wider" style={{ letterSpacing: '1.5px' }}>{t('boutique')}</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li><Link to="/products" className="footer-link">{t('all_products')}</Link></li>
              <li><Link to="/products?new=true" className="footer-link">{t('new_arrivals')}</Link></li>
              <li><Link to="/products?promo=true" className="footer-link">{t('promotions')}</Link></li>
              <li><Link to="/products?usage=gaming" className="footer-link">{t('collections')}</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="text-white fw-bold mb-4 text-uppercase small tracking-wider" style={{ letterSpacing: '1.5px' }}>{t('support')}</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li><Link to="/contact" className="footer-link">{t('contact_us')}</Link></li>
              <li><Link to="/info/faq" className="footer-link">{t('faq')}</Link></li>
              <li><Link to="/info/shipping" className="footer-link">{t('shipping')}</Link></li>
              <li><Link to="/info/returns" className="footer-link">{t('returns')}</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-lg-4 ps-lg-4">
            <h6 className="text-white fw-bold mb-4 text-uppercase small tracking-wider" style={{ letterSpacing: '1.5px' }}>{t('newsletter')}</h6>
            <p className="small mb-4 opacity-75 text-slate-400">{t('newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control bg-white bg-opacity-5 border-secondary border-opacity-25 text-white ps-4 py-2 rounded-start-pill"
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
                <button className="btn btn-primary rounded-end-pill px-4" type="submit">
                  <FaPaperPlane size={16} />
                </button>
              </div>
              {subscribed && <div className="text-success small mt-2 ps-3 animate__animated animate__fadeIn">{t('subscribe_success')}</div>}
            </form>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-secondary opacity-10 mb-4" />

        {/* Copyright & Legal */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="small mb-0 opacity-50">&copy; {new Date().getFullYear()} MonSite. {t('all_rights')}</p>
          <div className="d-flex gap-4 small opacity-50 legal-links">
            <Link to="/info/privacy" className="footer-link fw-normal">{t('privacy')}</Link>
            <Link to="/info/terms" className="footer-link fw-normal">{t('terms')}</Link>
            <Link to="/info/cookies" className="footer-link fw-normal">{t('cookies')}</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link { color: #94a3b8; text-decoration: none; transition: all 0.3s; }
        .footer-link:hover { color: #fff; transform: translateX(5px); }
        .social-btn:hover { background-color: rgba(255,255,255,0.1) !important; color: #3b82f6 !important; transform: translateY(-3px); }
        .newsletter-form input:focus { box-shadow: none; border-color: #3b82f6; background: rgba(255,255,255,0.1); }
        .legal-links .footer-link:hover { transform: none; text-decoration: underline; }
      `}</style>
    </footer>
  );
}