import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import profileImg from '../assets/profile.jpg';

const About = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div 
        onDoubleClick={() => console.log("%c🚀 Easter Egg: Passion Innovation Excellence!", "color: #00f2ff; font-size: 20px; font-weight: bold;")}
        className="grid md:grid-cols-2 gap-20 items-center"
      >
        <motion.div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative group cursor-pointer"
        >
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 1, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-linear-to-r from-accent-blue to-accent-purple rounded-3xl blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000" style={{ transform: "translateZ(-20px)" }}></div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden glass border border-white/10 shadow-2xl" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
              <img 
                src={profileImg} 
                alt="Youssef Zhar" 
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700"></div>
            </div>
          </motion.div>
        </motion.div>

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-black mb-2 uppercase tracking-tighter italic">L'Art du <span className="text-accent-blue text-glow">Code</span></h2>
            <div className="h-1 w-20 bg-accent-blue rounded-full"></div>
          </motion.div>

          <div className="space-y-6 text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Je suis <span className="text-white font-bold border-b border-accent-blue/30">Youssef Zhar</span>, un développeur Full Stack et technologue créatif passionné par l'innovation technique. 
              Spécialisé en <span className="text-white font-bold">React, Node.js et Three.js</span>, je fusionne la rigueur du développement système avec la magie de l'interactivité 3D.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative p-8 border-l-4 border-accent-blue bg-white/5 rounded-r-3xl italic text-gray-200 shadow-xl"
            >
              "Je ne construis pas seulement des applications, je façonne des expériences numériques."
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Mon approche repose sur un équilibre parfait entre performance brute et esthétique premium. Chaque projet est pour moi une opportunité de repousser les limites de ce qui est possible sur le web moderne.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-6"
          >
            <a href="#projects" className="px-10 py-5 bg-accent-blue text-black hover:bg-white transition-all rounded-full text-xs font-orbitron font-black tracking-[0.3em] shadow-xl shadow-accent-blue/20">VOIR MES TRAVAUX</a>
            <a href="#contact" className="px-10 py-5 glass-card border border-white/10 hover:border-accent-blue/50 transition-all rounded-full text-xs font-orbitron font-black tracking-[0.3em]">REJOINDRE LE PROJET</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
