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
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 mb-8 text-blue-300 text-xs font-medium tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Final-Year Dentist · Clinical Training Year
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
