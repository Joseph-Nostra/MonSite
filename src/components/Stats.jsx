import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

const Counter = ({ value }) => {
  const numericValue = parseInt(value);
  const isPercent = value.includes('%');
  const isPlus = value.includes('+');
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, numericValue, { 
      duration: 2, 
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return controls.stop;
  }, [numericValue]);

  return (
    <span>
      {displayValue}
      {isPercent ? '%' : isPlus ? '+' : ''}
    </span>
  );
};

const StatCard = ({ value, label, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
    className="p-10 glass-card border border-white/5 rounded-[2.5rem] text-center relative overflow-hidden group hover:scale-105 transition-all duration-500"
  >
    <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-blue/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
    <h3 className="text-6xl md:text-8xl font-black mb-4 font-mono tracking-tighter text-white group-hover:text-accent-blue transition-colors duration-500">
      <Counter value={value} />
    </h3>
    <p className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.4em] font-bold font-orbitron">
      {label}
    </p>
    
    <motion.div 
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent-blue/30 rounded-full"
    />
  </motion.div>
);

const Stats = () => {
  const stats = [
    { value: "2+", label: "Ans d'Expérience", color: "from-accent-blue to-transparent" },
    { value: "3+", label: "Projets Terminés", color: "from-accent-purple to-transparent" },
    { value: "99%", label: "Score Performance", color: "from-emerald-500 to-transparent" },
    { value: "100%", label: "Satisfaction Client", color: "from-amber-500 to-transparent" }
  ];

  return (
    <section className="py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>
    </section>
  );
};

export default Stats;
