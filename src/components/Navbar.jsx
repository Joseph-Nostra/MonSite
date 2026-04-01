import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Code, Layout, Cpu, Briefcase, Mail, Github, Linkedin, MessageSquare, Compass, Eye, Zap, FileJson } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavItem = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 px-4 py-2 text-xs font-orbitron font-medium tracking-[0.2em] text-gray-400 hover:text-accent-blue transition-colors uppercase">
        {title} <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 w-72 mt-2 p-4 glass-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/3 h-full bg-white/20 skew-x-12 z-0"
              />
            <div className="absolute inset-0 bg-accent-blue/5 blur-3xl -z-10"></div>
            <div className="flex flex-col gap-1">
              {items.map((item, i) => 
                item.href.startsWith('http') || item.href.startsWith('#') ? (
                  <a 
                    key={i} 
                    href={item.href}
                    className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue group-hover/item:bg-accent-blue group-hover/item:text-black transition-all">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover/item:text-accent-blue transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-gray-500 leading-tight mt-0.5">{item.desc}</span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link 
                    key={i} 
                    to={item.href}
                    className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue group-hover/item:bg-accent-blue group-hover/item:text-black transition-all">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover/item:text-accent-blue transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-gray-500 leading-tight mt-0.5">{item.desc}</span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
    </div>
  );
};

const Navbar = () => {
  const navData = [
    {
      title: "Explorer",
      items: [
        { label: "À Propos", href: "#about", icon: <Compass size={16} />, desc: "Découvrez mon parcours et ma vision." },
        { label: "Mon CV", href: "/cv", icon: <FileJson size={16} />, desc: "Consultez mon CV professionnel." },
        { label: "Mon Approche", href: "#approach", icon: <Zap size={16} />, desc: "Comment je transforme vos idées en réalité." }
      ]
    },
    {
      title: "Lab Compétences",
      items: [
        { label: "Front-end", href: "#skills", icon: <Layout size={16} />, desc: "React, JavaScript & Design UI/UX." },
        { label: "Back-end", href: "#skills", icon: <Cpu size={16} />, desc: "Node.js, Laravel & Architecture API." },
        { label: "Dév Créatif", href: "#skills", icon: <Code size={16} />, desc: "Three.js & Expériences 3D." }
      ]
    },
    {
      title: "Travaux",
      items: [
        { label: "Projets", href: "#projects", icon: <Briefcase size={16} />, desc: "Une sélection de mes réalisations." },
        { label: "Études de Cas", href: "#projects", icon: <FileJson size={16} />, desc: "Analyse détaillée de mes travaux." },
        { label: "GitHub", href: "https://github.com/Joseph-Nostra", icon: <Github size={16} />, desc: "Mes contributions open source." }
      ]
    },
    {
      title: "Connexion",
      items: [
        { label: "Contact", href: "#contact", icon: <Mail size={16} />, desc: "Envoyez-moi un message direct." },
        { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={16} />, desc: "Rejoignez mon réseau professionnel." },
        { label: "WhatsApp", href: "https://wa.me/yournumber", icon: <MessageSquare size={16} />, desc: "Discutons de votre projet." }
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 backdrop-blur-xl border-b border-white/5 py-4">
      <div className="container mx-auto px-8 flex justify-between items-center text-white">
        <Link to="/" className="text-2xl font-orbitron font-black tracking-tighter hover:text-accent-blue transition-colors group">
          YZ<span className="text-accent-blue group-hover:animate-pulse">.</span>
        </Link>
        
        <div className="hidden lg:flex gap-2">
          {navData.map((nav, i) => (
            <NavItem key={i} title={nav.title} items={nav.items} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="#contact" 
            className="hidden sm:flex px-6 py-2 bg-linear-to-r from-accent-blue via-accent-purple to-accent-blue bg-size-[200%_auto] animate-gradient-x text-black rounded-full text-xs font-orbitron font-black hover:bg-white transition-all shadow-[0_0_15px_rgba(0,183,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            DISCUTONS
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
