import { useState } from 'react';
import {
  Wrench, Monitor, Camera, Smile, BarChart2, Layers,
  Settings, Image, FileText, Globe, Cpu, Printer,
  Users, Clock, Lightbulb, RefreshCw, Eye, MessageCircle,
  Presentation, BookOpen, Plus, X, Loader2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';

const SOFT_ICON_POOL   = [MessageCircle, Users, Clock, Lightbulb, RefreshCw, Eye, Smile, Presentation, BookOpen];
const CLINICAL_ICON_POOL = [Wrench, Settings, Layers, Globe, Camera, Smile, BarChart2, Image, FileText];
const TECH_ICON_POOL   = [Monitor, Cpu, Settings, Smile, Printer, Globe, Layers, Image, FileText, Monitor, Cpu, Settings];

const DEFAULT_SOFT = [
  'Communication Skills', 'Teamwork & Collaboration', 'Time Management',
  'Problem Solving', 'Adaptability', 'Attention to Detail',
  'Patient-Centered Communication', 'Presentation Skills', 'Research-Oriented Mindset',
];
const DEFAULT_CLINICAL = [
  'Operative Dentistry', 'Endodontics', 'Fixed Prosthodontics',
  'Implantology', 'Dental Photography', 'Aesthetic Dentistry',
  'Occlusion', 'Biomimetic Restorative Dentistry', 'Dental Case Documentation',
];
const DEFAULT_TECH = [
  { label: 'RealGUIDE', level: 100 },
  { label: 'Exocad', level: 100 },
  { label: 'CAD/CAM', level: 100 },
  { label: 'Digital Smile Design', level: 100 },
  { label: '3D Printing', level: 100 },
  { label: 'Implant Planning', level: 100 },
  { label: 'Full-Arch Guided Surgery', level: 100 },
  { label: 'Canva', level: 100 },
  { label: 'CapCut', level: 100 },
  { label: 'MS Word & PowerPoint', level: 100 },
];

export default function Skills() {
  const { unlocked } = useAuth();

  const { data: softSkills,     save: saveSoft,     saving: savingSoft }     = useContent('skills_soft',     DEFAULT_SOFT);
  const { data: clinicalSkills, save: saveClinical, saving: savingClinical } = useContent('skills_clinical', DEFAULT_CLINICAL);
  const { data: techSkills,     save: saveTech,     saving: savingTech }     = useContent('skills_tech',     DEFAULT_TECH);

  const [newSoft,     setNewSoft]     = useState('');
  const [newClinical, setNewClinical] = useState('');
  const [newTech,     setNewTech]     = useState('');

  const removeStr = (list, save, i) => save(list.filter((_, idx) => idx !== i));

  const addSoft = () => {
    if (!newSoft.trim()) return;
    saveSoft([...softSkills, newSoft.trim()]);
    setNewSoft('');
  };
  const addClinical = () => {
    if (!newClinical.trim()) return;
    saveClinical([...clinicalSkills, newClinical.trim()]);
    setNewClinical('');
  };
  const addTech = () => {
    if (!newTech.trim()) return;
    saveTech([...techSkills, { label: newTech.trim(), level: 100 }]);
    setNewTech('');
  };

  return (
    <section id="skills" className="section-bg-dark-navy py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Expertise</p>
          <h2 className="text-4xl font-bold text-white">Skills & Competencies</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        {/* ── Soft Skills ─────────────────────────────────────────────── */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            Soft Skills
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {softSkills.map((label, i) => {
              const Icon = SOFT_ICON_POOL[i % SOFT_ICON_POOL.length];
              return (
                <div
                  key={i}
                  className="relative flex items-center gap-3 p-4 rounded-xl glass border border-violet-500/15 group hover:border-violet-500/40 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <Icon size={18} />
                  </div>
                  <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors leading-tight">{label}</span>
                  {unlocked && (
                    <button
                      onClick={() => removeStr(softSkills, saveSoft, i)}
                      className="absolute top-1 right-1 p-0.5 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {unlocked && (
            <div className="flex gap-2 mt-4">
              <input
                value={newSoft}
                onChange={(e) => setNewSoft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSoft()}
                placeholder="Add soft skill…"
                className="flex-1 px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400"
              />
              <button
                onClick={addSoft}
                disabled={savingSoft}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {savingSoft ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ── Clinical Skills ────────────────────────────────────────── */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wrench size={16} className="text-white" />
              </div>
              Clinical Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clinicalSkills.map((label, i) => {
                const Icon = CLINICAL_ICON_POOL[i % CLINICAL_ICON_POOL.length];
                return (
                  <div
                    key={i}
                    className="relative flex items-center gap-3 p-4 rounded-xl glass border border-blue-500/15 group hover:border-blue-500/40 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon size={18} />
                    </div>
                    <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
                    {unlocked && (
                      <button
                        onClick={() => removeStr(clinicalSkills, saveClinical, i)}
                        className="absolute top-1 right-1 p-0.5 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {unlocked && (
              <div className="flex gap-2 mt-4">
                <input
                  value={newClinical}
                  onChange={(e) => setNewClinical(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addClinical()}
                  placeholder="Add clinical skill…"
                  className="flex-1 px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={addClinical}
                  disabled={savingClinical}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                >
                  {savingClinical ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
                </button>
              </div>
            )}
          </div>

          {/* ── Technical & Digital Skills ─────────────────────────────── */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Cpu size={16} className="text-white" />
              </div>
              Technical & Digital Skills
            </h3>
            <div className="space-y-4">
              {techSkills.map(({ label, level }, i) => {
                const Icon = TECH_ICON_POOL[i % TECH_ICON_POOL.length];
                return (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <span className="text-blue-400"><Icon size={16} /></span>
                        {label}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 text-xs font-bold">{level}%</span>
                        {unlocked && (
                          <button
                            onClick={() => saveTech(techSkills.filter((_, idx) => idx !== i))}
                            className="p-0.5 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                        style={{ width: `${level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {unlocked && (
              <div className="flex gap-2 mt-4">
                <input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTech()}
                  placeholder="Add tech skill…"
                  className="flex-1 px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button
                  onClick={addTech}
                  disabled={savingTech}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                >
                  {savingTech ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
