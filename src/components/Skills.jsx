import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, FileJson, Atom, Cpu, Database, Zap, Layout, Terminal, Layers, Globe, Wind, Binary } from 'lucide-react';

const SkillIcon = ({ name }) => {
  const icons = {
    "React": <Atom size={14} />,
    "JavaScript / TypeScript": <Binary size={14} />,
    "HTML / CSS (Tailwind)": <Layout size={14} />,
    "Framer Motion": <Wind size={14} />,
    "Node.js": <Terminal size={14} />,
    "Laravel / PHP": <Code size={14} />,
    "REST / GraphQL": <Globe size={14} />,
    "Auth (JWT/Passport)": <Cpu size={14} />,
    "MySQL / MongoDB": <Database size={14} />,
    "UML / MCD / MLD": <FileJson size={14} />,
    "Microservices": <Layers size={14} />,
    "Cloud (Vercel/AWS)": <Globe size={14} />,
    "Three.js": <Zap size={14} />,
    "Canvas 2D/3D": <Palette size={14} />,
    "GLSL / Shaders": <Zap size={14} />,
    "GSAP Animations": <Wind size={14} />
  };
  return icons[name] || <Code size={14} />;
};

const SkillBar = ({ name, level, delay }) => (
  <div className="mb-8 last:mb-0 group/bar">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-3">
        <div className="text-accent-blue opacity-50 group-hover/bar:opacity-100 transition-opacity">
          <SkillIcon name={name} />
        </div>
        <span className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] group-hover/bar:text-white transition-colors">{name}</span>
      </div>
      <span className="text-xs font-mono text-accent-blue/50 group-hover/bar:text-accent-blue transition-colors">
        {level}%
      </span>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
        className="h-full bg-linear-to-r from-accent-blue via-accent-purple to-accent-blue bg-size-[200%_auto] animate-gradient-x shadow-[0_0_15px_rgba(0,183,255,0.3)]"
      />
    </div>
  </div>
);

const SkillGroup = ({ title, icon: Icon, skills, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
    className="p-10 glass-card border border-white/5 rounded-[2.5rem] hover:border-accent-blue/20 transition-all duration-700 group flex flex-col h-full relative overflow-hidden"
  >
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-blue/5 blur-[60px] -z-10 group-hover:bg-accent-blue/10 transition-all duration-700"></div>
    
    <div className="flex items-center gap-5 mb-12">
      <div className="p-4 bg-white/5 text-accent-blue rounded-2xl group-hover:bg-accent-blue group-hover:text-black transition-all duration-500 shadow-xl">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-black tracking-tighter uppercase text-white">{title}</h3>
    </div>
    <div className="grow space-y-6">
      {skills.map((skill, i) => (
        <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={delay + (i * 0.1)} />
      ))}
    </div>
  </motion.div>
);

const Skills = () => {
  const categories = [
    {
      title: "Front-end",
      icon: Layout,
      skills: [
        { name: "React", level: 95 },
        { name: "JavaScript / TypeScript", level: 90 },
        { name: "HTML / CSS (Tailwind)", level: 98 },
        { name: "Framer Motion", level: 85 }
      ]
    },
    {
      title: "Back-end",
      icon: Cpu,
      skills: [
        { name: "Node.js", level: 88 },
        { name: "Laravel / PHP", level: 82 },
        { name: "REST / GraphQL", level: 85 },
        { name: "Auth (JWT/Passport)", level: 90 }
      ]
    },
    {
      title: "Architecture",
      icon: Database,
      skills: [
        { name: "MySQL / MongoDB", level: 85 },
        { name: "UML / MCD / MLD", level: 92 },
        { name: "Microservices", level: 75 },
        { name: "Cloud (Vercel/AWS)", level: 80 }
      ]
    },
    {
      title: "Dév Créatif",
      icon: Zap,
      skills: [
        { name: "Three.js", level: 78 },
        { name: "Canvas 2D/3D", level: 82 },
        { name: "GLSL / Shaders", level: 65 },
        { name: "GSAP Animations", level: 90 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-32">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase">Skills <span className="text-accent-blue">Lab</span></h2>
        <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold font-orbitron italic">
          Maîtrise technique et exploration constante
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {categories.map((cat, index) => (
          <SkillGroup key={cat.title} {...cat} delay={index * 0.1} />
        ))}
      </div>
      
      <div className="mt-20 p-8 glass-card border border-white/5 rounded-3xl text-center">
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           {/* Placeholder for tech logos if needed */}
           <span className="text-sm font-orbitron tracking-widest font-bold">NEXT.JS</span>
           <span className="text-sm font-orbitron tracking-widest font-bold">DOCKER</span>
           <span className="text-sm font-orbitron tracking-widest font-bold">KUBERNETES</span>
           <span className="text-sm font-orbitron tracking-widest font-bold">PYTHON</span>
           <span className="text-sm font-orbitron tracking-widest font-bold">UML expert</span>
        </div>
      </div>
    </section>
  );
};

export default Skills;
