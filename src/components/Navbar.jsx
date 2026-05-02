import { useState, useEffect } from 'react';
import { Menu, X, Lock, Unlock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PasswordGate from './PasswordGate';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Courses', href: '#courses' },
  { label: 'Cases', href: '#cases' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#hero');
  const [showGate, setShowGate] = useState(false);
  const { unlocked, unlock, lock } = useAuth();

  const handleUnlock = (pw) => {
    const ok = unlock(pw);
    if (ok) setShowGate(false);
    return ok;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive('#' + sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#060d1a]/95 backdrop-blur-xl shadow-2xl border-b border-blue-900/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => handleNav('#hero')}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-sm">MA</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide hidden sm:block">
            Dr. Mahmoud Abdo
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => handleNav(href)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium ${
                active === href
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {unlocked ? (
            <button
              onClick={lock}
              title="Lock admin session"
              className="text-blue-400 hover:text-blue-300 p-2 rounded-lg transition"
            >
              <Unlock size={18} />
            </button>
          ) : (
            <button
              onClick={() => setShowGate(true)}
              title="Admin login"
              className="text-slate-500 hover:text-white p-2 rounded-lg transition"
            >
              <Lock size={18} />
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {showGate && (
        <PasswordGate
          onSuccess={handleUnlock}
          onClose={() => setShowGate(false)}
        />
      )}

      {open && (
        <div className="lg:hidden bg-[#060d1a]/98 backdrop-blur-xl border-t border-blue-900/20">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => handleNav(href)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active === href
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
