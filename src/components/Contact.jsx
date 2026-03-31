import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-4">Me <span className="text-accent-blue">Contacter</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-8">Commençons un projet ensemble</h3>
          <p className="text-gray-400 mb-12 text-lg">
            Que vous ayez une idée précise ou que vous souhaitiez simplement discuter de nouvelles opportunités, n'hésitez pas à m'envoyer un message.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-accent-blue border border-white/10 group-hover:scale-110 group-hover:border-accent-blue/50 transition-all">
                    <Mail size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Email</p>
                    <p className="text-white">votre.email@example.com</p>
                </div>
            </div>
            
            <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-accent-purple border border-white/10 group-hover:scale-110 group-hover:border-accent-purple/50 transition-all">
                    <MapPin size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Localisation</p>
                    <p className="text-white">Casablanca, Maroc</p>
                </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Nom</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-accent-blue transition-colors text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-accent-blue transition-colors text-white"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Message</label>
              <textarea 
                rows="5"
                placeholder="Votre message ici..."
                className="bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-accent-blue transition-colors text-white resize-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3">
              Envoyer Message <Send size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
