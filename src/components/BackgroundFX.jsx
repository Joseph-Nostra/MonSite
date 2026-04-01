import React from 'react';
import { motion } from 'framer-motion';

const BackgroundFX = () => {
  return (
    <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden print:hidden">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      {/* Faint Grid */}
      <div className="grid-overlay" />

      {/* Moving Gradients */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-blue/5 blur-[150px] rounded-full"
      />
      
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-purple/5 blur-[150px] rounded-full"
      />
    </div>
  );
};

export default BackgroundFX;
