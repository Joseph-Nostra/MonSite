import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Github, ExternalLink, Trophy, Lightbulb, Target } from 'lucide-react';

const ProjectCard = ({ title, problem, solution, result, tags, github, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  // Deeper tilt for "ultra-premium" feel
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 rounded-[3.5rem] overflow-hidden p-10 md:p-16 mb-20 last:mb-0 hover:border-accent-blue/20 transition-colors duration-700"
    >
      {/* Dynamic Interaction Shadow */}
      <motion.div 
        style={{ x: shadowX, y: shadowY }}
        className="absolute inset-0 bg-accent-blue/5 blur-[120px] -z-10 group-hover:bg-accent-blue/10 transition-all duration-700"
      />
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div style={{ transform: "translateZ(60px)" }} className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-accent-blue font-orbitron font-black text-6xl opacity-10 group-hover:opacity-30 transition-opacity">0{index + 1}</span>
            <div className="h-px grow bg-white/5 group-hover:bg-accent-blue/20 transition-colors"></div>
          </div>
          
          <h3 className="text-5xl md:text-7xl font-black text-white group-hover:text-accent-blue transition-colors duration-500 uppercase tracking-tighter leading-none">
            {title}
          </h3>

          <div className="grid gap-8 mb-12">
            <div className="flex gap-5 group/item">
              <div className="mt-1 text-red-500/50 group-hover/item:text-red-500 transition-colors"><Target size={22} /></div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">Le Problème</h4>
                <p className="text-gray-400 text-base leading-relaxed font-light">{problem}</p>
              </div>
            </div>
            <div className="flex gap-5 group/item">
              <div className="mt-1 text-accent-blue/50 group-hover/item:text-accent-blue transition-colors"><Lightbulb size={22} /></div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">Ma Solution</h4>
                <p className="text-gray-400 text-base leading-relaxed font-light">{solution}</p>
              </div>
            </div>
            <div className="flex gap-5 group/item">
              <div className="mt-1 text-emerald-500/50 group-hover/item:text-emerald-500 transition-colors"><Trophy size={22} /></div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">Le Résultat</h4>
                <p className="text-gray-400 text-base leading-relaxed font-light">{result}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <span key={tag} className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-white/5 hover:border-accent-blue/30 hover:text-white transition-all">
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-6">
            <a href={github} target="_blank" rel="noreferrer" className="btn-premium flex items-center justify-center gap-4 group/btn">
              VOIR LE CODE <Github size={20} className="group-hover/btn:rotate-12 transition-transform" />
            </a>
          </div>
        </div>

        <div 
          className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden glass border border-white/10 group-hover:rotate-1 group-hover:scale-[1.02] transition-all duration-1000 ease-[0.22,1,0.36,1]" 
          style={{ transform: "translateZ(100px)" }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-accent-blue/20 to-accent-purple/20 mix-blend-overlay opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <div className="flex items-center justify-center h-full text-white/5 text-9xl font-black uppercase tracking-tighter select-none group-hover:text-accent-blue/10 transition-colors duration-1000">
             {title.split(' ')[0]}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse delay-75"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Portfolio Immersif",
      problem: "Créer une vitrine technologique qui ne soit pas juste un CV, mais une expérience mémorable pour les clients.",
      solution: "Intégration poussée de Three.js et Framer Motion avec un design premium en mode sombre et néon.",
      result: "Une augmentation significative du temps de session et des retours extrêmement positifs sur l'interactivité.",
      tags: ["Three.js", "React", "Framer Motion", "Tailwind"],
      github: "https://github.com/Joseph-Nostra/MonSite"
    },
    {
      title: "Lexigam E-commerce",
      problem: "Les sites e-commerce de gaming standard manquent souvent d'identité visuelle forte et de performance.",
      solution: "Développement d'une SPA ultra-rapide avec une UI inspirée des interfaces de jeux AAA.",
      result: "Performance Lighthouse de 99% et une interface qui captive immédiatement l'audience cible.",
      tags: ["React", "Node.js", "MongoDB", "Gaming UI"],
      github: "https://github.com/Joseph-Nostra/lexigam"
    },
    {
      title: "SaaS DashBoard",
      problem: "La visualisation de données complexes peut être écrasante sans une interface intuitive.",
      solution: "Création d'un tableau de bord analytique avec des graphiques interactifs et un mode sombre haute performance.",
      result: "Une réduction de 40% du temps nécessaire pour interpréter les métriques clés.",
      tags: ["React", "Chart.js", "Tailwind", "Firebase"],
      github: "https://github.com/Joseph-Nostra"
    }
  ];

  return (
    <section id="projects" className="py-32">
      <div className="mb-24">
        <h2 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter">Études de <span className="text-accent-blue">Cas</span></h2>
        <p className="text-gray-500 uppercase tracking-[0.4em] text-xs font-bold font-orbitron">Sélection de projets stratégiques</p>
      </div>

      <div className="space-y-24">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} {...project} index={index} />
        ))}
      </div>
      
      <div className="mt-32 p-12 glass-card rounded-[3rem] border border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-blue/5 blur-[100px] -z-10"></div>
        <h3 className="text-3xl font-black mb-6 uppercase tracking-widest">3 projets stratégiques sur GitHub</h3>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">Découvrez l'ensemble de mes contributions, expériences et expérimentations open-source.</p>
        <a 
          href="https://github.com/Joseph-Nostra" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-3 px-12 py-5 border border-white/10 rounded-full font-black text-xs tracking-widest hover:border-accent-blue transition-all"
        >
          EXPLORER GITHUB <ExternalLink size={20} />
        </a>
      </div>
    </section>
  );
};

export default Projects;
