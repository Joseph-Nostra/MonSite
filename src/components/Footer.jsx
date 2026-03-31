import React from 'react';
import { Github, Linkedin, Mail, Twitter, ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-white/10 mt-24">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-orbitron font-bold tracking-widest text-accent-blue mb-4 uppercase">PORTFOLIO</h2>
            <p className="text-gray-500 text-sm max-w-sm text-center md:text-left">
              Bâtir le futur du web avec passion, créativité et excellence technique.
            </p>
          </div>

          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-accent-blue hover:border-accent-blue/50 transition-all border border-white/10">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-accent-blue hover:border-accent-blue/50 transition-all border border-white/10">
              <Linkedin size={20} />
            </a>
            <a href="mailto:votre.email@example.com" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-accent-blue hover:border-accent-blue/50 transition-all border border-white/10">
              <Mail size={20} />
            </a>
          </div>

          <button 
            onClick={scrollToTop} 
            className="group flex flex-col items-center gap-2 text-gray-400 hover:text-accent-blue transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:-translate-y-2 transition-transform">
               <ChevronUp size={24} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Retour en haut</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-600 text-[10px] uppercase tracking-widest">
             © 2026 Tous droits réservés.
           </p>
           <div className="flex gap-8">
              <a href="#" className="text-gray-600 text-[10px] uppercase tracking-widest hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="text-gray-600 text-[10px] uppercase tracking-widest hover:text-white transition-colors">Mentions légales</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
