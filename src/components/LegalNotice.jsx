import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-accent-blue hover:underline mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Retour au portfolio
        </Link>
        
        <div className="glass-card p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <FileText size={40} className="text-accent-blue" />
            <h1 className="text-4xl font-bold">Mentions <span className="text-accent-blue">Légales</span></h1>
          </div>
          
          <div className="space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Éditeur du site</h2>
              <p>Nom : Youssef Zhar<br />
                 Activité : Développeur Full Stack & Entrepreneur<br />
                 Localisation : Maroc, Skhirate</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Hébergement</h2>
              <p>Ce site est hébergé par [VOTRE HÉBERGEUR - ex: Vercel / Netlify / GitHub Pages].</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Propriété intellectuelle</h2>
              <p>L'ensemble du contenu de ce site (textes, images, code source) est la propriété exclusive de Youssef Zhar, sauf mention contraire. Toute reproduction est interdite sans autorisation préalable.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
