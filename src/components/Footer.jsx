import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 border-t border-white/5 mt-32 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-accent-blue/5 blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <Link to="/" className="text-3xl font-orbitron font-black tracking-tighter text-white mb-6 group">
              YZ<span className="text-accent-blue group-hover:animate-pulse">.</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm text-center md:text-left leading-relaxed uppercase tracking-widest font-bold">
              Bâtir le futur du web avec créativité et précision.
            </p>
          </motion.div>

          <div className="flex gap-6">
            {[
              { icon: Github, href: "https://github.com/Joseph-Nostra" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Mail, href: "mailto:youssefzh850@gmail.com" }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.1, color: "var(--color-accent-blue)" }}
                className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center border border-white/5 transition-colors ease-out"
              >
                <social.icon size={26} />
              </motion.a>
            ))}
          </div>

          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onClick={scrollToTop} 
            className="group flex flex-col items-center gap-4 text-gray-500 hover:text-accent-blue transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
               <ChevronUp size={32} />
            </div>
            <span className="text-[10px] uppercase font-black font-orbitron tracking-[0.5em] opacity-50 group-hover:opacity-100">Top</span>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8"
        >
           <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black italic">
             © 2026 Youssef Zhar. Tous droits réservés. <span className="mx-4 text-accent-blue/30">//</span> Conçu pour l'excellence.
           </p>
           <div className="flex gap-12 items-center">
              <Link to="/privacy" className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-black hover:text-white transition-all hover:tracking-[0.4em]">Confidentialité</Link>
              <Link to="/legal" className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-black hover:text-white transition-all hover:tracking-[0.4em]">Mentions Légales</Link>
           </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
