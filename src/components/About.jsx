import { useRef, useState } from 'react';
import { UserCircle, Target, Zap, Camera, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PasswordGate from './PasswordGate';

const PHOTO_KEY = 'portfolio_profile_photo';

const highlights = [
  { icon: <Target size={18} />, title: 'Goal-Oriented', desc: 'Focused on mastering full-arch implant workflows and digital surgery.' },
  { icon: <Zap size={18} />, title: 'Tech-Driven', desc: 'Leveraging RealGUIDE, Exocad & CAD/CAM to deliver precision dentistry.' },
  { icon: <UserCircle size={18} />, title: 'Patient-First', desc: 'Committed to ethical, evidence-based, and minimally invasive care.' },
];

export default function About() {
  const [photo, setPhoto] = useState(() => localStorage.getItem(PHOTO_KEY) || null);
  const [showGate, setShowGate] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const fileRef = useRef();
  const { unlocked, unlock, lock } = useAuth();

  const requireAuth = (action) => {
    if (unlocked) { action(); return; }
    setPendingAction(() => action);
    setShowGate(true);
  };

  const handleUnlock = (pw) => {
    const ok = unlock(pw);
    if (ok) {
      setShowGate(false);
      if (pendingAction) { pendingAction(); setPendingAction(null); }
    }
    return ok;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target.result;
      setPhoto(data);
      localStorage.setItem(PHOTO_KEY, data);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    localStorage.removeItem(PHOTO_KEY);
  };

  return (
    <section id="about" className="section-bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">About Me</p>
          <h2 className="text-4xl font-bold text-slate-900">Who I Am</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Avatar block */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative group">
              {/* Photo or initials */}
              <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-5xl font-bold">MA</span>
                )}
              </div>

              {/* Camera overlay — always visible to admin, hover for others */}
              <button
                onClick={() => requireAuth(() => fileRef.current.click())}
                className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Upload profile photo"
              >
                <Camera size={24} className="text-white" />
                <span className="text-white text-xs font-semibold">Change Photo</span>
              </button>

              {/* Remove button (only when photo exists and unlocked) */}
              {photo && unlocked && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition"
                  title="Remove photo"
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              )}

              <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🦷</span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">Mahmoud Abdo Abo Obia</h3>
              <p className="text-blue-600 font-medium mt-1">Final-Year Dentist</p>
              <p className="text-slate-500 text-sm mt-0.5">Egyptian Russian University · Faculty of Dentistry</p>
              {unlocked && (
                <button
                  onClick={lock}
                  className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-500 text-sm hover:bg-slate-100 transition"
                  title="Lock admin session"
                >
                  <LogOut size={14} /> Lock Session
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-5 text-slate-600 leading-relaxed">
            <p className="text-lg text-slate-700">
              I am a final-year dentist in the clinical training year at the Faculty of Dentistry,
              Egyptian Russian University, with a strong passion for advanced and digital dentistry.
            </p>
            <p>
              My focus areas include <strong className="text-slate-800">implantology</strong>,{' '}
              <strong className="text-slate-800">digital guided surgery</strong>,{' '}
              <strong className="text-slate-800">CAD/CAM workflows</strong>,{' '}
              <strong className="text-slate-800">restorative dentistry</strong>,{' '}
              <strong className="text-slate-800">biomimetic dentistry</strong>, and{' '}
              <strong className="text-slate-800">occlusion</strong>.
            </p>
            <p>
              With hands-on experience producing over 1,000 surgical guides and training at specialized
              academies, I combine theoretical knowledge with real-world clinical application to achieve
              precise, predictable outcomes.
            </p>
            <p>
              I am deeply committed to continuous education, ethical practice, and integrating the latest
              digital technologies into everyday dentistry to deliver the best possible results for patients.
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {highlights.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 card-hover group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {icon}
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {showGate && (
        <PasswordGate
          onSuccess={handleUnlock}
          onClose={() => { setShowGate(false); setPendingAction(null); }}
        />
      )}
    </section>
  );
}
