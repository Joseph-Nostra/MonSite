import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const ProjectCard = ({ title, description, tags, github, demo, image }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="group relative h-[450px] rounded-3xl overflow-hidden glass border border-white/10"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
       {/* Placeholder pour l'image du projet */}
       <div className="text-6xl font-black text-white/5 uppercase tracking-tighter transform rotate-12">
          {title.split(' ')[0]}
       </div>
    </div>

    <div className="p-8 h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-accent-blue transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 flex-grow">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-accent-blue/70 border border-accent-blue/30 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <a 
          href={github} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-sm font-semibold hover:text-accent-blue transition-colors"
        >
          <Github size={18} /> Code
        </a>
        <a 
          href={demo} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-sm font-semibold hover:text-accent-blue transition-colors ml-auto group/btn"
        >
          Voir Projet <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Une plateforme complète avec panier, système de paiement et interface d'administration.",
      tags: ["React", "Laravel", "MySQL", "Tailwind"],
      github: "https://github.com",
      demo: "#",
      image: ""
    },
    {
      title: "Task Management App",
      description: "Outil de gestion de tâches avec collaboration en temps réel et notifications.",
      tags: ["React", "Express", "MongoDB", "Socket.io"],
      github: "https://github.com",
      demo: "#",
      image: ""
    },
    {
      title: "3D Portfolio Pro",
      description: "Ce site même ! Un exemple d'intégration de Three.js et React pour une interface premium.",
      tags: ["Three.js", "React", "Framer Motion"],
      github: "https://github.com",
      demo: "#",
      image: ""
    }
  ];

  return (
    <section id="projects" className="py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div>
          <h2 className="text-4xl font-bold mb-4">Mes <span className="text-accent-blue">Projets</span></h2>
          <p className="text-gray-400 max-w-lg">Une sélection de mes travaux récents, combinant performance et design soigné.</p>
        </div>
        <motion.a 
          href="https://github.com" 
          target="_blank"
          whileHover={{ x: 5 }}
          className="text-accent-blue font-bold flex items-center gap-2 mt-8 md:mt-0"
        >
          Voir plus sur GitHub <ExternalLink size={20} />
        </motion.a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
