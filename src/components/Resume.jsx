import React from 'react';
import { ExternalLink } from 'lucide-react';

const Resume = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-8 md:p-16 print:p-0 font-serif">
      {/* Print/Download Button (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-end print:hidden">
        <a 
          href="/CV_Youssef_Zhar.pdf"
          download="CV_Youssef_Zhar.pdf"
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all font-sans font-bold text-sm tracking-widest uppercase no-underline"
        >
          Enregistrer en PDF
        </a>
      </div>

      {/* CV Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none p-12 md:p-16 border border-gray-100 print:border-none">

        {/* Header */}
        <header className="border-b-4 border-gray-900 pb-10 mb-12 flex flex-col items-center text-center gap-8">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 text-gray-900">YOUSSEF ZHAR</h1>
            <p className="text-xl font-bold text-gray-600 uppercase tracking-widest font-sans">Développeur Web Full Stack</p>
          </div>
          <div className="w-full flex flex-col items-start space-y-2 text-sm font-sans text-gray-600">
            <div className="flex items-center gap-3">
              <span>Skhirate Lot Maatouka 87</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="mailto:youssefzh850@gmail.com" className="hover:text-gray-900 transition-colors">youssefzh850@gmail.com</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Joseph-Nostra" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">github.com/Joseph-Nostra</a>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-16">
          {/* Left Column (Sidebar) */}
          <div className="space-y-12">
            
            {/* Compétences */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">COMPÉTENCES</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3 border-b border-gray-200 pb-1">Frontend</h4>
                  <ul className="text-sm space-y-1 text-gray-600 font-sans">
                    <li>React.js</li>
                    <li>JavaScript (ES6+)</li>
                    <li>HTML5 / CSS3</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3 border-b border-gray-200 pb-1">Backend</h4>
                  <ul className="text-sm space-y-1 text-gray-600 font-sans">
                    <li>Laravel</li>
                    <li>PHP</li>
                    <li>API REST</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3 border-b border-gray-200 pb-1">Base de données</h4>
                  <ul className="text-sm space-y-1 text-gray-600 font-sans">
                    <li>MySQL</li>
                    <li>MongoDB</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3 border-b border-gray-200 pb-1">Outils</h4>
                  <ul className="text-sm space-y-1 text-gray-600 font-sans">
                    <li>Git / GitHub / GitLab</li>
                    <li>Jira (Agile Scrum)</li>
                    <li>SonarQube / SonarScanner</li>
                    <li>Canvas</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Langues */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">LANGUES</h2>
              <ul className="text-sm space-y-3 font-sans">
                <li className="flex justify-between items-center"><span className="font-bold">Arabe</span> <span className="text-gray-400 italic">Natif</span></li>
                <li className="flex justify-between items-center"><span className="font-bold">Français</span> <span className="text-gray-400 italic">Bon</span></li>
                <li className="flex justify-between items-center"><span className="font-bold">Anglais</span> <span className="text-gray-400 italic">Intermédiaire</span></li>
              </ul>
            </section>

            {/* Intérêts */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">INTÉRÊTS</h2>
              <ul className="text-sm space-y-2 text-gray-600 font-sans">
                <li>Dév. Web & Tech</li>
                <li>Projets Digitaux</li>
                <li>Entrepreneuriat</li>
                <li>Auto-apprentissage</li>
              </ul>
            </section>

          </div>

          {/* Right Column (Main Content) */}
          <div className="md:col-span-2 space-y-12 border-l border-gray-100 pl-8 md:pl-16">
            
            {/* Profil */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gray-200"></span> PROFIL
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 italic">
                Étudiant en développement web Full Stack (2ème année), passionné par la création d’applications web modernes et performantes. Je maîtrise les technologies comme <span className="font-bold text-gray-900">React</span> et <span className="font-bold text-gray-900">Laravel</span> ainsi que la conception d’API REST. Curieux, motivé et rigoureux, je suis actuellement à la recherche d’un stage afin de mettre en pratique mes compétences techniques et contribuer à des projets concrets.
              </p>
            </section>

            {/* Projets */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gray-200"></span> PROJETS ACADÉMIQUES
              </h2>
              <div className="space-y-8">
                <div className="group">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-3 group-hover:text-gray-600 transition-colors">
                    Site E-commerce (PC & matériel informatique)
                  </h3>
                  <p className="text-gray-600 mb-4 font-sans text-sm">Technologies : React, Laravel, API REST</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Développement d'une plateforme e-commerce moderne avec gestion des produits, panier dynamique et système de commandes.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a href="https://github.com/Joseph-Nostra/lexigam" className="text-xs font-black  text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors">
                      <ExternalLink size={12} /> https://github.com/Joseph-Nostra/lexigam
                    </a>
                    <a href="https://github.com/Joseph-Nostra/MonSite" className="text-xs font-black  text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors">
                      <ExternalLink size={12} /> https://github.com/Joseph-Nostra/MonSite
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Formations */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gray-200"></span> FORMATIONS
              </h2>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold uppercase tracking-tight">ISTA Témara</h3>
                    <span className="text-sm font-sans text-gray-400 italic">2025 – Présent</span>
                  </div>
                  <p className="text-gray-700">Développement Digital – Option Full Stack</p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold uppercase tracking-tight">Programme PIE</h3>
                    <span className="text-sm font-sans text-gray-400 italic">2025 – Présent</span>
                  </div>
                  <p className="text-gray-700">Innovation & Entrepreneuriat (Gestion de projet)</p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold uppercase tracking-tight">Lycée Tahla</h3>
                    <span className="text-sm font-sans text-gray-400 italic">2023 – 2024</span>
                  </div>
                  <p className="text-gray-700">Baccalauréat Sciences de la Vie et de la Terre</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-100 text-center text-gray-400 text-[10px] uppercase tracking-[0.5em] font-sans">
          YOUSSEF ZHAR • DÉVELOPPEUR FULL STACK • 2025
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white; color: black; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { shadow: none !important; box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}} />
    </div>
  );
};

export default Resume;
