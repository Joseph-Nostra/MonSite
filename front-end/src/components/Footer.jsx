import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPaperPlane } from "react-icons/fa";
import Logo from "./Common/Logo";

export default function Footer() {
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
              Votre destination mode et technologie préférée. Nous offrons des produits de haute qualité avec un service client exceptionnel depuis 2024.
            </p>
            <div className="d-flex gap-2">
              {[
                { icon: FaFacebookF, color: '#1877F2', link: '#' },
                { icon: FaInstagram, color: '#E4405F', link: '#' },
                { icon: FaTwitter, color: '#1DA1F2', link: '#' },
                { icon: FaYoutube, color: '#FF0000', link: '#' }
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
            <h6 className="text-white fw-bold mb-4 text-uppercase small tracking-wider" style={{ letterSpacing: '1.5px' }}>Boutique</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li><Link to="/products" className="footer-link">Tous les produits</Link></li>
              <li><Link to="/products?new=true" className="footer-link">Nouveautés</Link></li>
              <li><Link to="/products?promo=true" className="footer-link">Promotions</Link></li>
              <li><Link to="/products?usage=gaming" className="footer-link">Collections</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="text-white fw-bold mb-4 text-uppercase small tracking-wider" style={{ letterSpacing: '1.5px' }}>Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li><Link to="/contact" className="footer-link">Contactez-nous</Link></li>
              <li><Link to="/info/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/info/shipping" className="footer-link">Livraison</Link></li>
              <li><Link to="/info/returns" className="footer-link">Retours</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-lg-4 ps-lg-4">
            <h6 className="text-white fw-bold mb-4 text-uppercase small tracking-wider" style={{ letterSpacing: '1.5px' }}>Newsletter</h6>
            <p className="small mb-4 opacity-75 text-slate-400">Rejoignez notre communauté et recevez 10% de réduction sur votre première commande.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control bg-white bg-opacity-5 border-secondary border-opacity-25 text-white ps-4 py-2 rounded-start-pill"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
                <button className="btn btn-primary rounded-end-pill px-4" type="submit">
                  <FaPaperPlane size={16} />
                </button>
              </div>
              {subscribed && <div className="text-success small mt-2 ps-3 animate__animated animate__fadeIn">Inscription réussie !</div>}
            </form>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-secondary opacity-10 mb-4" />

        {/* Copyright & Legal */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="small mb-0 opacity-50">&copy; {new Date().getFullYear()} MonSite. Tous droits réservés.</p>
          <div className="d-flex gap-4 small opacity-50 legal-links">
            <Link to="/info/privacy" className="footer-link fw-normal">Confidentialité</Link>
            <Link to="/info/terms" className="footer-link fw-normal">Conditions d'utilisation</Link>
            <Link to="/info/cookies" className="footer-link fw-normal">Cookies</Link>
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