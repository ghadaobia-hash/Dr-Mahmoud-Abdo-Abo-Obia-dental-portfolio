import { ChevronDown, Microscope, Layers, Cpu, Heart } from 'lucide-react';

const tags = [
  { icon: <Microscope size={14} />, label: 'Implantology' },
  { icon: <Layers size={14} />, label: 'Digital Surgery' },
  { icon: <Cpu size={14} />, label: 'CAD/CAM' },
  { icon: <Heart size={14} />, label: 'Biomimetic' },
];

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden section-bg-dark-navy"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(96,165,250,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(96,165,250,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl bg-blue-600 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl bg-indigo-700 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl bg-blue-500 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-32">
        {/* LinkedIn CTA */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Check my digital work</p>
          <a
            href="https://www.linkedin.com/in/mahmoud-abdo-abo-obia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400/60 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>

        {/* Main name */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          <span className="text-white">Dr. Mahmoud</span>
          <br />
          <span className="text-gradient">Abdo Abo Obia</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Passionate dental professional specializing in{' '}
          <span className="text-blue-300 font-medium">implantology</span>,{' '}
          <span className="text-blue-300 font-medium">digital guided surgery</span>, and{' '}
          <span className="text-blue-300 font-medium">CAD/CAM workflows</span> — bridging
          clinical excellence with cutting-edge dental technology.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {tags.map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium"
            >
              {icon}
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => scrollTo('cases')}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            View Cases
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="px-8 py-3.5 glass border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400/50 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Contact Me
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollTo('about')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600 hover:text-slate-400 transition-colors animate-bounce"
        >
          <ChevronDown size={28} />
        </button>
      </div>
    </section>
  );
}
