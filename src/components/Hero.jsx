import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10"
      >
        <h2 className="text-xl md:text-2xl font-orbitron tracking-[0.2em] text-accent-blue mb-4 uppercase">
          Développeur Full Stack
        </h2>
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
          VOTRE <span className="accent-text">NOM</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-10">
          Passionné par la création d'expériences numériques immersives, performantes et élégantes. Spécialisé en React, Node.js et les technologies 3D.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <motion.a 
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            Voir Mes Projets
          </motion.a>
          <motion.a 
            href="#contact"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border border-white/20 rounded-full font-bold backdrop-blur-sm transition-all"
          >
            Me Contacter
          </motion.a>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-accent-blue/50"
      >
        <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-current rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
