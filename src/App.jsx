import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Courses from './components/Courses';
import ClinicalCases from './components/ClinicalCases';
import Certificates from './components/Certificates';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Skills />
      <Courses />
      <ClinicalCases />
      <Certificates />
      <Contact />
    </div>
  );
}
