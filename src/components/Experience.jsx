import { useState } from 'react';
import {
  Stethoscope, Monitor, Layers, BookOpen, Hospital,
  Trophy, GraduationCap, Plus, X, Pencil, Check, Loader2, Settings,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';

const PALETTES = [
  { Icon: Stethoscope, color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  { Icon: Monitor,     color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  { Icon: Layers,      color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  { Icon: BookOpen,    color: 'bg-sky-100 text-sky-700',       dot: 'bg-sky-500' },
  { Icon: Hospital,    color: 'bg-teal-100 text-teal-700',     dot: 'bg-teal-500' },
  { Icon: Trophy,      color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  { Icon: GraduationCap, color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
];

const DEFAULT_EXPERIENCES = [
  { title: 'Second Operator – Clinical Work', org: 'Egyptian Russian University – Faculty of Dentistry', type: 'Clinical', desc: 'Actively participated as second operator across multiple clinical disciplines including surgery, restorative, and prosthodontics.' },
  { title: 'Digital Guided Surgery Specialist', org: 'Turki Academy & Professional Training', type: 'Digital Surgery', desc: 'Acquired specialized training in full-arch digital implant workflows, surgical guide production, and guided placement protocols.' },
  { title: '1,000+ Surgical Guides Produced', org: 'RealGUIDE & Exocad Workflows', type: 'CAD/CAM', desc: 'Designed and produced over 1,000 tooth-supported and implant-supported surgical guides using RealGUIDE software.' },
  { title: 'Implant Marathons & Intensive Training', org: 'Turki Academy', type: 'Training', desc: 'Participated in multiple implant marathon courses covering immediate loading, full-arch rehabilitation, and digital planning.' },
  { title: 'Clinical Rotation', org: 'El Ghandour Hospital', type: 'Hospital', desc: 'Gained hospital-based clinical experience across surgical and general dentistry departments.' },
];

const BLANK = { title: '', org: '', type: '', desc: '' };

const DEFAULT_STATS = [
  { value: '1,000+', label: 'Surgical Guides' },
  { value: '5+',     label: 'Training Programs' },
  { value: '2',      label: 'Institutions' },
  { value: '4+',     label: 'Years Clinical' },
];

function ExperienceForm({ form, setForm, onSave, onCancel, saving }) {
  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
          <input {...field('title')} placeholder="Role or achievement" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Type / Badge</label>
          <input {...field('type')} placeholder="e.g. Clinical, Training" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Organisation</label>
          <input {...field('org')} placeholder="Institution or academy" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
          <textarea {...field('desc')} rows={3} placeholder="Brief description…" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition">Cancel</button>
      </div>
    </div>
  );
}

export default function Experience() {
  const { unlocked } = useAuth();
  const { data: experiences, save, saving }       = useContent('experiences', DEFAULT_EXPERIENCES);
  const { data: stats,       save: saveStats }    = useContent('exp_stats',   DEFAULT_STATS);

  const [editIdx, setEditIdx]         = useState(null);
  const [form, setForm]               = useState(BLANK);
  const [editingStats, setEditingStats] = useState(false);
  const [statsForm, setStatsForm]     = useState([]);

  const startEdit = (i) => { setForm({ ...experiences[i] }); setEditIdx(i); };
  const startAdd  = ()  => { setForm(BLANK); setEditIdx('new'); };
  const cancel    = ()  => { setEditIdx(null); setForm(BLANK); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const next = editIdx === 'new'
      ? [...experiences, form]
      : experiences.map((e, i) => (i === editIdx ? form : e));
    await save(next);
    cancel();
  };

  const remove = async (i) => {
    await save(experiences.filter((_, idx) => idx !== i));
    if (editIdx === i) cancel();
  };

  return (
    <section id="experience" className="section-bg-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Professional Journey</p>
          <h2 className="text-4xl font-bold text-slate-900">Clinical & Professional Experience</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Stats */}
        <div className="mb-16">
          {editingStats ? (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <p className="text-sm font-semibold text-slate-600 mb-4">Edit Stats</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {statsForm.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <input
                      value={stat.value}
                      onChange={e => setStatsForm(f => f.map((s, j) => j === i ? { ...s, value: e.target.value } : s))}
                      placeholder="e.g. 1,000+"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center text-blue-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      value={stat.label}
                      onChange={e => setStatsForm(f => f.map((s, j) => j === i ? { ...s, label: e.target.value } : s))}
                      placeholder="Label"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => { await saveStats(statsForm); setEditingStats(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Check size={14} /> Save
                </button>
                <button
                  onClick={() => setEditingStats(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {unlocked && (
                <button
                  onClick={() => { setStatsForm(stats.map(s => ({ ...s }))); setEditingStats(true); }}
                  title="Edit stats"
                  className="absolute -top-2 -right-2 p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition z-10"
                >
                  <Settings size={16} />
                </button>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ value, label }, i) => (
                  <div key={i} className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="text-3xl font-bold text-blue-700 mb-1">{value}</div>
                    <div className="text-slate-500 text-sm font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin controls */}
        {unlocked && (
          <div className="flex justify-end mb-4">
            <button
              onClick={startAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>
        )}

        {/* New-item form */}
        {editIdx === 'new' && (
          <ExperienceForm form={form} setForm={setForm} onSave={handleSave} onCancel={cancel} saving={saving} />
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent hidden md:block" />
          <div className="space-y-6">
            {experiences.map((exp, i) => {
              const { Icon, color, dot } = PALETTES[i % PALETTES.length];
              const isEditing = editIdx === i;
              return (
                <div key={i} className="relative md:pl-16">
                  <div className={`absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-white ${dot} shadow-sm hidden md:block`} />
                  {isEditing ? (
                    <ExperienceForm form={form} setForm={setForm} onSave={handleSave} onCancel={cancel} saving={saving} />
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 card-hover shadow-sm hover:border-blue-200 relative group">
                      {unlocked && (
                        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(i)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 pr-16">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{exp.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{exp.type}</span>
                          </div>
                          <p className="text-blue-600 text-sm font-medium mt-0.5">{exp.org}</p>
                          <p className="text-slate-500 text-sm mt-2 leading-relaxed">{exp.desc}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
