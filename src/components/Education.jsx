import { useState } from 'react';
import { GraduationCap, Award, Calendar, Plus, Pencil, X, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';

const COLORS = [
  'from-blue-600 to-indigo-700',
  'from-slate-500 to-slate-700',
  'from-violet-600 to-indigo-700',
  'from-teal-500 to-cyan-700',
  'from-amber-500 to-orange-600',
  'from-green-500 to-emerald-700',
];

const DEFAULT_EDUCATION = [
  {
    degree: "Bachelor's Degree of Oral & Dental Surgery Program",
    institution: 'Faculty of Dentistry – Egyptian Russian University',
    period: '2020 – 2025',
    detail: '',
  },
  {
    degree: 'High School Diploma – STEM',
    institution: 'Menofia STEM School',
    period: 'Graduated 2020',
    detail: 'Science, Technology, Engineering & Mathematics (STEM)',
  },
];

const BLANK = { degree: '', institution: '', period: '', detail: '' };

function EducationForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || BLANK);
  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Degree / Qualification *</label>
          <input {...field('degree')} placeholder="e.g. Bachelor's Degree of Oral & Dental Surgery" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Institution</label>
          <input {...field('institution')} placeholder="e.g. Egyptian Russian University" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Period</label>
          <input {...field('period')} placeholder="e.g. 2020 – 2025" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Detail (optional)</label>
          <input {...field('detail')} placeholder="e.g. Science, Technology, Engineering & Mathematics" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => { if (form.degree.trim()) onSave(form); }}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Education() {
  const { unlocked } = useAuth();
  const { data: education, save, saving } = useContent('education', DEFAULT_EDUCATION);

  const [editIdx, setEditIdx] = useState(null);
  const [adding,  setAdding]  = useState(false);

  const handleSave = async (form, idx) => {
    const next = education.map((e, i) => i === idx ? form : e);
    await save(next);
    setEditIdx(null);
  };

  const handleAdd = async (form) => {
    await save([...education, form]);
    setAdding(false);
  };

  const handleDelete = async (idx) => {
    await save(education.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  return (
    <section id="education" className="section-bg-gray py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Academic Background</p>
          <h2 className="text-4xl font-bold text-slate-900">Education</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Add button */}
        {unlocked && !adding && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              <Plus size={14} /> Add Education
            </button>
          </div>
        )}

        {/* Add form */}
        {adding && (
          <div className="mb-6">
            <EducationForm onSave={handleAdd} onCancel={() => setAdding(false)} saving={saving} />
          </div>
        )}

        <div className="space-y-6">
          {(Array.isArray(education) ? education : DEFAULT_EDUCATION).map((entry, idx) => {
            const color = COLORS[idx % COLORS.length];
            const Icon  = idx === 0 ? GraduationCap : Award;

            return (
              <div key={idx}>
                {editIdx === idx ? (
                  <EducationForm
                    initial={entry}
                    onSave={(form) => handleSave(form, idx)}
                    onCancel={() => setEditIdx(null)}
                    saving={saving}
                  />
                ) : (
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg relative group">
                    {unlocked && (
                      <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => setEditIdx(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row">
                      <div className={`bg-gradient-to-br ${color} sm:w-2 h-2 sm:h-auto w-full`} />
                      <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start w-full">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                          <Icon size={22} />
                        </div>
                        <div className="flex-1 pr-10">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">{entry.degree}</h3>
                              <p className="text-blue-600 font-semibold mt-1">{entry.institution}</p>
                              {entry.detail && <p className="text-slate-500 text-sm mt-1">{entry.detail}</p>}
                            </div>
                            <div className="text-right shrink-0">
                              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                <Calendar size={14} />
                                {entry.period}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
