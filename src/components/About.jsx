import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative aspect-square rounded-3xl overflow-hidden glass border border-white/10">
            {/* Si l'utilisateur n'a pas mis d'image, on affiche un gradient placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-8xl font-black text-white/10">
              JS
            </div>
            {/* L'image réelle peut être ajoutée ici */}
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8">À Propos <span className="text-accent-blue">De Moi</span></h2>
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
            <p>
              Bonjour ! Je suis un développeur Full Stack passionné par l'innovation technique et le design d'interface. Avec une solide expertise en <span className="text-white font-semibold">Front-end</span> et <span className="text-white font-semibold">Back-end</span>, j'adore transformer des idées complexes en applications web fluides et interactives.
            </p>
            <p>
              Ma curiosité me pousse sans cesse à explorer de nouvelles technologies, qu'il s'agisse de <span className="text-accent-blue">Three.js</span> pour la 3D web ou d'optimisations DevOps complexes. Mon objectif est toujours de fournir un code propre, scalable et centré sur l'utilisateur.
            </p>
            <p>
              Au-delà du code, je m'intéresse de près à l'art génératif et à l'impact de l'IA sur le développement moderne. Je suis toujours ouvert à de nouveaux défis et collaborations passionnantes.
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="glass p-4 rounded-xl border border-white/5">
                <p className="text-accent-blue font-bold text-2xl">3+</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest">Années d'Expérience</p>
            </div>
            <div className="glass p-4 rounded-xl border border-white/5">
                <p className="text-accent-purple font-bold text-2xl">20+</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest">Projets Terminés</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
