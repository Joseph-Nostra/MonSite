import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPaperPlane } from "react-icons/fa";
import Logo from "./Common/Logo";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="footer-premium pt-5 pb-4" style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', 
        color: '#94a3b8', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden'
    }}>
      {/* Decorative Glow */}
      <div className="footer-glow" style={{
          position: 'absolute',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
      }}></div>

      <div className="container-fluid px-4 px-md-5">
        <motion.div 
            className="row gy-5 mb-5 align-items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
        >
          {/* Brand Column */}
          <div className="col-lg-4 pe-xl-5">
            <motion.div variants={itemVariants} className="mb-4">
                <Logo size={48} className="d-inline-flex" />
            </motion.div>
            <motion.p variants={itemVariants} className="lh-lg mb-4 opacity-75 text-slate-400" style={{ fontSize: '0.95rem', maxWidth: '400px' }}>
              {t('footer_desc')}
            </motion.p>
            <motion.div variants={itemVariants} className="d-flex gap-3">
              {[
                { icon: FaFacebookF, color: '#1877F2', link: 'https://facebook.com' },
                { icon: FaInstagram, color: '#E4405F', link: 'https://instagram.com' },
                { icon: FaTwitter, color: '#1DA1F2', link: 'https://twitter.com' },
                { icon: FaYoutube, color: '#FF0000', link: 'https://youtube.com' }
              ].map((social, idx) => (
                <motion.a 
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    key={idx} 
                    href={social.link} 
                    className="social-btn d-flex align-items-center justify-content-center rounded-3 bg-white bg-opacity-5"
                    style={{ width: '42px', height: '42px', color: '#cbd5e1', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links Column */}
          <div className="col-6 col-md-3 col-lg-2">
            <motion.h6 variants={itemVariants} className="text-white fw-bold mb-4 text-uppercase small tracking-widest" style={{ letterSpacing: '2px' }}>{t('boutique')}</motion.h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              {['all_products', 'new_arrivals', 'promotions', 'collections'].map((key, i) => (
                <motion.li variants={itemVariants} key={i}>
                    <Link to={`/products${key === 'all_products' ? '' : `?${key === 'new_arrivals' ? 'new=true' : key === 'promotions' ? 'promo=true' : 'usage=gaming'}`}`} className="footer-link">
                        {t(key)}
                    </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-6 col-md-3 col-lg-2">
            <motion.h6 variants={itemVariants} className="text-white fw-bold mb-4 text-uppercase small tracking-widest" style={{ letterSpacing: '2px' }}>{t('support')}</motion.h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              {['contact_us', 'faq', 'shipping', 'returns'].map((key, i) => (
                <motion.li variants={itemVariants} key={i}>
                    <Link to={key === 'contact_us' ? '/contact' : `/info/${key}`} className="footer-link">
                        {t(key)}
                    </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-lg-4 ps-xl-5">
            <motion.h6 variants={itemVariants} className="text-white fw-bold mb-4 text-uppercase small tracking-widest" style={{ letterSpacing: '2px' }}>{t('newsletter')}</motion.h6>
            <motion.p variants={itemVariants} className="small mb-4 opacity-75 text-slate-400">{t('newsletter_desc')}</motion.p>
            <motion.form variants={itemVariants} onSubmit={handleSubscribe} className="newsletter-form-premium">
              <div className="input-group p-1 bg-white bg-opacity-5 rounded-pill border border-white border-opacity-10 shadow-inner">
                <input 
                  type="email" 
                  className="form-control bg-transparent border-0 text-white ps-4 py-2"
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontSize: '14px', boxShadow: 'none' }}
                />
                <button className="btn btn-primary rounded-pill px-4 ms-1 transition-all" type="submit" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }}>
                  <FaPaperPlane size={14} className="me-2" />
                  <span className="d-none d-sm-inline">S'abonner</span>
                </button>
              </div>
              {subscribed && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-success small mt-3 ps-3">{t('subscribe_success')}</motion.div>}
            </motion.form>
          </div>
        </motion.div>

        {/* Divider with animate */}
        <div className="footer-divider-container mb-4">
            <motion.hr 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "circOut" }}
                className="border-secondary opacity-10 m-0" 
            />
        </div>

        {/* Copyright & Legal */}
        <div className="row align-items-center gy-3">
          <div className="col-md-6 text-center text-md-start">
            <p className="small mb-0 opacity-50">&copy; {new Date().getFullYear()} <span className="text-white fw-bold">MonSite</span>. {t('all_rights')}</p>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-center justify-content-md-end gap-4 small opacity-50 legal-items">
              {['privacy', 'terms', 'cookies'].map((key) => (
                <Link key={key} to={`/info/${key}`} className="legal-link hover-white transition-all text-decoration-none">{t(key)}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link { 
            color: #94a3b8; 
            text-decoration: none; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            display: inline-block;
            font-size: 0.9rem;
        }
        .footer-link:hover { 
            color: #fff; 
            transform: translateX(8px); 
        }
        .social-btn:hover { 
            background: rgba(59, 130, 246, 0.15) !important; 
            color: #3b82f6 !important; 
            border-color: rgba(59, 130, 246, 0.3) !important;
        }
        .shadow-inner {
            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        }
        .newsletter-form-premium input::placeholder {
            color: rgba(148, 163, 184, 0.5);
        }
        .legal-link:hover {
            color: #fff !important;
            opacity: 1;
        }
        .tracking-widest {
            letter-spacing: 0.2em;
        }
      `}</style>
    </footer>
  );
}