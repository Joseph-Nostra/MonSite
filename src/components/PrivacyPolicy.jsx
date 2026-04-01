import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-accent-blue hover:underline mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Retour au portfolio
        </Link>
        
        <div className="glass-card p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <ShieldCheck size={40} className="text-accent-blue" />
            <h1 className="text-4xl font-bold">Politique de <span className="text-accent-blue">Confidentialité</span></h1>
          </div>
          
          <div className="space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Collecte des données</h2>
              <p>Les données personnelles collectées sur ce site sont uniquement celles que vous fournissez volontairement via le formulaire de contact (nom, email, message). Ces informations sont utilisées exclusivement pour répondre à vos demandes.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Utilisation des cookies</h2>
              <p>Ce portfolio peut utiliser des cookies de session techniques pour améliorer votre navigation. Aucun cookie de pistage tiers n'est utilisé à des fins publicitaires.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Vos droits</h2>
              <p>Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, vous pouvez me contacter via l'email fourni dans la section contact.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
