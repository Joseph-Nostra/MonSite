import React from 'react';
import { motion } from 'framer-motion';

const SkillCard = ({ title, skills, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 flex flex-col gap-4 group"
  >
    <h3 className={`text-xl font-bold ${color} tracking-wider uppercase`}>{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 group-hover:border-accent-blue/30 transition-colors">
          {skill}
        </span>
      ))}
    </div>
  </motion.div>
);

const Skills = () => {
  const skillGroups = [
    {
      title: "Front-end",
      color: "text-accent-blue",
      skills: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS", "Framer Motion", "Three.js"]
    },
    {
      title: "Back-end",
      color: "text-accent-purple",
      skills: ["Node.js", "Express", "Laravel", "PHP", "REST API"]
    },
    {
      title: "Base de données",
      color: "text-emerald-400",
      skills: ["MySQL", "MongoDB", "PostgreSQL", "UML", "MCD/MLD"]
    },
    {
      title: "Outils & DevOps",
      color: "text-amber-400",
      skills: ["Git", "GitHub", "GitLab", "Docker", "DevOps", "SonarQube", "SonarScanner", "Agile (Scrum)"]
    },
    {
      title: "Autres",
      color: "text-rose-400",
      skills: ["Canvas", "Formation PIE", "Unit Testing", "Microservices"]
    }
  ];

  const languages = [
    { name: "Arabe", level: "Maternel", percent: 100 },
    { name: "Français", level: "Avancé", percent: 90 },
    { name: "Anglais", level: "Intermédiaire", percent: 75 }
  ];

  return (
    <section id="skills" className="py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-4">Mes <span className="text-accent-blue">Compétences</span></h2>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <SkillCard {...group} />
          </motion.div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-4">Langues</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {languages.map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass p-6 rounded-2xl border border-white/10"
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{lang.name}</h3>
                <p className="text-accent-blue text-sm uppercase tracking-widest">{lang.level}</p>
              </div>
              <span className="text-gray-500 font-mono">{lang.percent}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: `${lang.percent}%` }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className="h-full bg-gradient-to-r from-accent-blue to-accent-purple"
               />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
