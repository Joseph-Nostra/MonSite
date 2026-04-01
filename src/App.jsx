import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Approach from './components/Approach';
import Stats from './components/Stats';
import Skills from './components/Skills';
import Projects from './components/Projects';
import CreativeThree from './components/CreativeThree';
import Contact from './components/Contact';
import Footer from './components/Footer';

import BackgroundFX from './components/BackgroundFX';
import CanvasBackground from './components/CanvasBackground';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './components/PrivacyPolicy';
import LegalNotice from './components/LegalNotice';
import Resume from './components/Resume';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#030303] text-white selection:bg-accent-blue/30 overflow-x-hidden">

        <BackgroundFX />
        <CanvasBackground />
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <main className="relative z-10 container mx-auto px-4 md:px-8">
                <Hero />
                <Stats />
                <About />
                <Approach />
                <Skills />
                <CreativeThree />
                <Projects />
                <Contact />
              </main>
              <Footer />
            </>
          } />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal" element={<LegalNotice />} />
          <Route path="/cv" element={<Resume />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
