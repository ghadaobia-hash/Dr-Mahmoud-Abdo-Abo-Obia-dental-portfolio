import { useRef, useState } from 'react';
import { UserCircle, Target, Zap, Camera, Trash2, LogOut, Loader2, Pencil, Check, X as XIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import { useContent } from '../hooks/useContent';
import PasswordGate from './PasswordGate';
import Toast from './Toast';

const DEFAULT_BIO = [
  'Motivated dentist graduated from Faculty of Dentistry, Egyptian Russian University.',
  'My focus areas include implantology, fixed prosthodontics, digital guided surgery, CAD/CAM workflows, restorative dentistry, biomimetic dentistry, and occlusion.',
  'With hands-on experience producing over 1,000 surgical guides and training at specialized academies, I combine theoretical knowledge with real-world clinical application to achieve precise, predictable outcomes.',
  'I am deeply committed to continuous education, ethical practice, and integrating the latest digital technologies into everyday dentistry to deliver the best possible results for patients.',
];

const highlights = [
  { icon: <Target size={18} />, title: 'Goal-Oriented', desc: 'Focused on mastering full-arch implant workflows and digital surgery.' },
  { icon: <Zap size={18} />, title: 'Tech-Driven', desc: 'Leveraging RealGUIDE, Exocad & CAD/CAM to deliver precision dentistry.' },
  { icon: <UserCircle size={18} />, title: 'Patient-First', desc: 'Committed to ethical, evidence-based, and minimally invasive care.' },
];

export default function About() {
  const { photoUrl, loading, saving, toast, uploadPhoto, removePhoto } = useProfilePhoto();
  const [showGate, setShowGate] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const fileRef = useRef();
  const { unlocked, unlock, lock } = useAuth();

  const { data: bioParagraphs, save: saveBio, saving: savingBio } = useContent('about_bio', DEFAULT_BIO);
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

  const startEditBio = () => {
    const paragraphs = Array.isArray(bioParagraphs) ? bioParagraphs : [bioParagraphs];
    setBioText(paragraphs.join('\n\n'));
    setEditingBio(true);
  };

  const handleSaveBio = async () => {
    const paragraphs = bioText.split('\n\n').map((p) => p.trim()).filter(Boolean);
    await saveBio(paragraphs);
    setEditingBio(false);
  };

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

  // Admin picks a file → upload to Supabase
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadPhoto(file);
    e.target.value = ''; // reset so same file can be re-selected
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
          {/* ── Avatar block ─────────────────────────────────────────── */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative group">
              {/* Photo / initials / loading */}
              <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                {loading ? (
                  <Loader2 size={32} className="text-white/60 animate-spin" />
                ) : photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-5xl font-bold">MA</span>
                )}

                {/* Saving spinner overlay */}
                {saving && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                    <Loader2 size={28} className="text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Camera overlay on hover — triggers auth then file picker */}
              {!saving && (
                <button
                  onClick={() => requireAuth(() => fileRef.current.click())}
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Upload profile photo"
                >
                  <Camera size={24} className="text-white" />
                  <span className="text-white text-xs font-semibold">Change Photo</span>
                </button>
              )}

              {/* Remove button — only when photo exists and admin is logged in */}
              {photoUrl && unlocked && !saving && (
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition"
                  title="Remove photo"
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              )}

              {/* Tooth badge */}
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

            {/* Name + lock button */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Mahmoud Abdo Abo Obia</h3>
              <p className="text-blue-600 font-medium mt-1">Dentist</p>
              <p className="text-slate-500 text-sm mt-0.5">Egyptian Russian University · Faculty of Dentistry</p>
              {unlocked && (
                <button
                  onClick={lock}
                  className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-500 text-sm hover:bg-slate-100 transition"
                >
                  <LogOut size={14} /> Lock Session
                </button>
              )}
            </div>
          </div>

          {/* ── Bio ──────────────────────────────────────────────────── */}
          <div className="space-y-5 text-slate-600 leading-relaxed">
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                {editingBio ? (
                  <div>
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      rows={12}
                      className="w-full p-4 border border-blue-300 rounded-xl text-slate-700 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Write each paragraph separated by a blank line…"
                    />
                    <p className="text-xs text-slate-400 mt-1">Tip: separate paragraphs with a blank line.</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleSaveBio}
                        disabled={savingBio}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                      >
                        <Check size={14} /> {savingBio ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingBio(false)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition"
                      >
                        <XIcon size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  (Array.isArray(bioParagraphs) ? bioParagraphs : [bioParagraphs]).map((p, i) => (
                    <p key={i} className={i === 0 ? 'text-lg text-slate-700' : ''}>{p}</p>
                  ))
                )}
              </div>
              {unlocked && !editingBio && (
                <button
                  onClick={startEditBio}
                  title="Edit bio"
                  className="shrink-0 mt-1 p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Highlights ───────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {highlights.map(({ icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 card-hover group">
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

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </section>
  );
}
