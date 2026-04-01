import React from 'react';
import { motion } from 'framer-motion';
import { Brain, PenTool, Code2, Rocket } from 'lucide-react';

const ApproachStep = ({ icon: Icon, title, desc, step, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: true }}
    whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 242, 255, 0.1)" }}
    className="relative p-10 glass-card rounded-[2.5rem] border border-white/5 hover:border-accent-blue/30 transition-all group lg:h-full overflow-hidden"
  >
    <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent-blue text-black font-orbitron font-black text-xl flex items-center justify-center rounded-2xl shadow-xl z-20 group-hover:scale-110 transition-transform duration-500">
      0{step}
    </div>
    <div className="mb-8 p-5 bg-accent-blue/10 text-accent-blue rounded-2xl w-fit group-hover:bg-accent-blue group-hover:text-black transition-all duration-500">
      <Icon size={38} />
    </div>
    <h3 className="text-2xl md:text-3xl font-black mb-4 text-white uppercase tracking-tighter italic">{title}</h3>
    <p className="text-gray-400 text-lg leading-relaxed font-light">
      {desc}
    </p>
    <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-accent-blue/5 blur-3xl -z-10 group-hover:bg-accent-blue/15 transition-all duration-700"></div>
    
    {/* Animated Line */}
    <motion.div 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, delay: delay + 0.3 }}
      className="absolute bottom-0 left-10 right-10 h-0.5 bg-linear-to-r from-transparent via-accent-blue to-transparent opacity-30"
    />
  </motion.div>
);

const Approach = () => {
  const steps = [
    {
      icon: Brain,
      title: "Penser",
      desc: "Analyse approfondie de vos besoins, définition des objectifs et élaboration d'une stratégie technique sur mesure.",
      step: 1
    },
    {
      icon: PenTool,
      title: "Concevoir",
      desc: "Création d'interfaces intuitives et esthétiques (UI/UX) pour garantir une expérience utilisateur mémorable.",
      step: 2
    },
    {
      icon: Code2,
      title: "Construire",
      desc: "Développement propre, scalable et performant en utilisant les dernières technologies Full Stack.",
      step: 3
    },
    {
      icon: Rocket,
      title: "Évoluer",
      desc: "Optimisation continue, déploiement sécurisé et passage à l'échelle pour assurer la pérennité du projet.",
      step: 4
    }
  ];

  return (
    <section id="approach" className="py-32 relative overflow-hidden">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6">Mon <span className="text-accent-blue">Approche</span></h2>
        <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-[0.3em] text-xs font-bold font-orbitron">
          Transformer des idées en réalités numériques
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <ApproachStep key={step.step} {...step} delay={index * 0.1} />
        ))}
      </div>
    </section>
  );
};

export default Approach;
