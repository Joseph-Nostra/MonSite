import React from 'react';
import { ExternalLink } from 'lucide-react';
import profileImg from '../assets/profile_new.jpg';

const Resume = () => {
  return (
    <div className="min-h-screen print:min-h-0 print:h-auto bg-white text-gray-900 p-8 md:p-16 print:p-0 font-serif">
      {/* Print/Download Button (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all font-sans font-bold text-sm tracking-widest uppercase shadow-lg border-none cursor-pointer"
        >
          Imprimer / Enregistrer en PDF
        </button>
      </div>

      {/* CV Container */}
      <div id="resume-container" className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none border border-gray-100 print:border-none p-0 mt-4">

        {/* Header - Navbar Style */}
        <header className="bg-gray-900 px-8 py-10 flex flex-row justify-between items-center gap-8 print:py-8">
          <div className="flex-1 space-y-6">
            <div className="text-left">
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-1 text-white leading-tight">YOUSSEF ZHAR</h1>
              <div className="inline-block px-3 py-1 bg-gray-800 rounded text-xs font-bold text-gray-300 uppercase tracking-widest font-sans">
                Développeur Web Full Stack
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[11px] font-sans text-gray-400 print:grid-cols-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📍</span>
                <span>Skhirate Lot Maatouka 87</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📧</span>
                <a href="mailto:youssefzh850@gmail.com" className="hover:text-white transition-colors">youssefzh850@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📞</span>
                <span>06 82 96 63 18</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">🔗</span>
                <a href="https://github.com/Joseph-Nostra" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">github.com/Joseph-Nostra</a>
              </div>
            </div>
          </div>

          <div className="w-28 h-32 md:w-32 md:h-36 rounded border-2 border-gray-800 overflow-hidden shadow-2xl shrink-0 bg-gray-800 print:w-28 print:h-32">
            <img 
              src={profileImg} 
              alt="Youssef Zhar" 
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <div className="p-8 flex flex-row gap-6 items-start">
          {/* Left Column (Sidebar) */}
          <div className="w-[30%] space-y-6 shrink-0">

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
                    <li>Jira (Agile Scrum) / UML</li>
                    <li>SonarQube / SonarScanner</li>
                    <li>Canvas / Figma</li>
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
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">INTÉRÊTS</h2>
              <ul className="text-[11px] space-y-1 text-gray-600 font-sans">
                <li>Dév. Web & Tech</li>
                <li>Projets Digitaux</li>
                <li>Entrepreneuriat</li>
                <li>Auto-apprentissage</li>
              </ul>
            </section>

          </div>

          {/* Right Column (Main Content) */}
          <div className="w-[70%] space-y-6 border-l border-gray-100 pl-6 shrink-0 overflow-visible">

            {/* Profil */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-gray-300"></span> PROFIL
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 italic">
                Étudiant en développement web Full Stack (2ème année), passionné par la création d’applications web modernes et performantes. Je maîtrise les technologies comme <span className="font-bold text-gray-900">React</span> et <span className="font-bold text-gray-900">Laravel</span> ainsi que la conception d’API REST. Curieux, motivé et rigoureux, je suis actuellement à la recherche d’un stage afin de mettre en pratique mes compétences techniques et contribuer à des projets concrets.
              </p>
            </section>

            {/* Projets */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-gray-300"></span> PROJETS ACADÉMIQUES
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-3 group-hover:text-gray-600 transition-colors">
                    Site E-commerce (PC & matériel informatique)
                  </h3>
                  <p className="text-gray-600 mb-2 font-sans text-[11px]">Technologies : React, Laravel, API REST</p>
                  <p className="text-gray-700 leading-relaxed text-[13px] mb-3">
                    Développement d'une plateforme e-commerce moderne avec gestion des produits, panier dynamique et système de commandes.
                  </p>
                  <div className="flex flex-col gap-1">
                    <a href="https://github.com/Joseph-Nostra/lexigam" className="text-[10px] font-black  text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors">
                      <ExternalLink size={10} /> https://github.com/Joseph-Nostra/lexigam
                    </a>
                    <a href="https://github.com/Joseph-Nostra/MonSite" className="text-[10px] font-black  text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors">
                      <ExternalLink size={10} /> https://github.com/Joseph-Nostra/MonSite
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Formations */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-gray-300"></span> FORMATIONS
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold uppercase tracking-tight">ISTA Témara</h3>
                    <span className="text-[11px] font-sans text-gray-400 italic">2024 – Présent</span>
                  </div>
                  <p className="text-[13px] text-gray-700">Développement Digital – Option Full Stack</p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold uppercase tracking-tight">Programme PIE</h3>
                    <span className="text-[11px] font-sans text-gray-400 italic">2024 – Présent</span>
                  </div>
                  <p className="text-[13px] text-gray-700">Innovation & Entrepreneuriat (Gestion de projet)</p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold uppercase tracking-tight">Lycée Tahla</h3>
                    <span className="text-[11px] font-sans text-gray-400 italic">2023 – 2024</span>
                  </div>
                  <p className="text-[13px] text-gray-700">Baccalauréat Sciences de la Vie et de la Terre</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-10 text-center text-gray-400 text-[9px] uppercase tracking-[0.5em] font-sans">
          YOUSSEF ZHAR • DÉVELOPPEUR FULL STACK • 2025
        </footer>
      </div>


      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body { background: white; color: black; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-gray-900 { background-color: #111827 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          header { 
            flex-direction: row !important; 
            align-items: flex-start !important; 
            justify-content: space-between !important; 
            text-align: left !important; 
            padding-top: 1.5rem !important; 
            padding-bottom: 1.5rem !important; 
          }
          header > div:first-child { text-align: left !important; align-items: flex-start !important; }
          header div.flex-col { align-items: flex-start !important; text-align: left !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { shadow: none !important; box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          @page { size: A4; margin: 0; }
          #resume-container { 
            border: none !important; 
            box-shadow: none !important; 
            width: 210mm; 
            max-width: none; 
            overflow: visible; 
            margin-top: 0 !important; 
          }
          .p-8 { padding: 1.5rem !important; }
          .space-y-6 > * + * { margin-top: 1rem !important; }
          .space-y-4 > * + * { margin-top: 0.5rem !important; }
          .mb-6 { margin-bottom: 1rem !important; }
          .mb-4 { margin-bottom: 0.5rem !important; }
          img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
    </div>
  );
};

export default Resume;
