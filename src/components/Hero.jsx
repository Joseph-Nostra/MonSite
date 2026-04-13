import React from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/profile.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-[#0a0a0a] pt-32 pb-10">
      {/* Background Noise & Grids */}
      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none"></div>

      {/* Top Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex justify-center mb-10 relative z-20"
      >
        <div className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#a3ff12] animate-pulse shadow-[0_0_15px_#a3ff12]"></div>
          <span className="text-[10px] font-orbitron font-black tracking-[0.4em] text-white/90 uppercase italic">Disponible pour nouveaux projets</span>
        </div>
      </motion.div>

      {/* Massive Typography Layer */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 select-none">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[18vw] md:text-[14vw] font-black leading-[0.75] uppercase tracking-tighter text-white"
          >
            YOUSSEF
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[18vw] md:text-[14vw] font-black leading-[0.75] uppercase tracking-tighter text-white"
          >
            ZHAR<span className="font-light opacity-50">©</span>
          </motion.h1>
        </div>

        {/* Bottom Info & CTA */}
        <div className="mt-16 md:mt-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-left max-w-sm"
          >
            <p className="text-gray-400 text-sm md:text-md leading-relaxed font-light uppercase tracking-widest">
              Je fusionne l'artisanat numérique et les technologies de pointe pour créer des sites web qui ne sont pas seulement beaux, mais qui redéfinissent l'interaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-10 py-5 bg-[#a3ff12] text-black rounded-full text-xs font-orbitron font-black tracking-widest transition-all shadow-[0_15px_40px_rgba(163,255,18,0.3)]"
              >
                DÉMARRER UN PROJET
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/cv"
                  className="inline-block px-10 py-5 border border-white/10 text-white rounded-full text-xs font-orbitron font-black tracking-widest hover:border-accent-blue transition-all"
                >
                  VOIR MON CV
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2, duration: 2 }}
            className="hidden md:flex flex-col items-center gap-4"
          >
            <span className="text-[10px] font-orbitron tracking-[0.5em] uppercase text-gray-500">Explorer</span>
            <motion.div
              animate={{ height: [0, 80, 0], y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-24 bg-linear-to-b from-accent-blue to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* Centered Profile Image with Gradient Fade */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-[90vw] md:w-[45vw] max-w-[700px] aspect-4/5 overflow-hidden"
        >
          <img
            src={profileImg}
            alt="Youssef Zhar"
            className="w-full h-full object-cover rounded-t-[15rem] mask-gradient brightness-75 hover:brightness-100 transition-all duration-1000 grayscale hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </motion.div>
      </div>

      {/* Decorative Atmosphere */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[180px] -z-10 rounded-full"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent-purple/10 blur-[180px] -z-10 rounded-full"></div>
    </section>
  );
};

export default Hero;
