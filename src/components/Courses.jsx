import { useState } from 'react';
import { BookOpen, Award, Plus, X, Pencil, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';

const COLORS = [
  'from-blue-600 to-blue-800',
  'from-violet-600 to-violet-800',
  'from-indigo-600 to-indigo-800',
  'from-sky-600 to-sky-800',
  'from-teal-600 to-teal-800',
  'from-cyan-600 to-cyan-800',
  'from-blue-700 to-indigo-800',
  'from-purple-600 to-purple-800',
  'from-rose-600 to-rose-800',
];

const DEFAULT_COURSES = [
  { title: 'Kaizen Dental Academy Internship',                        provider: 'Kaizen Dental Academy',             category: 'Restorative & Aesthetic' },
  { title: 'GenAI for Dentists',                                       provider: 'Online – Continuing Education',     category: 'Technology & AI' },
  { title: 'Implant Dentistry',                                        provider: 'University of Hong Kong / Coursera', category: 'Implantology' },
  { title: 'Modern Prep Design and Margination',                       provider: 'Advanced Prosthodontics Course',    category: 'Prosthodontics' },
  { title: '3Shape Webinars',                                          provider: '3Shape Official',                   category: 'CAD/CAM & Digital' },
  { title: '3D Printing & Guided Implant Surgery',                     provider: 'Specialized Implant Training',      category: 'Digital Surgery' },
  { title: 'Efficiency & Accuracy in Full-Arch Implant Restorations',  provider: 'Advanced Implant Training',         category: 'Full-Arch' },
];

const BLANK = { title: '', provider: '', category: '' };

function CourseForm({ form, setForm, onSave, onCancel, saving }) {
  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5 col-span-full">
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
          <input {...field('title')} placeholder="Course title" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Provider</label>
          <input {...field('provider')} placeholder="Academy or platform" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
          <input {...field('category')} placeholder="e.g. Implantology" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
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

export default function Courses() {
  const { unlocked } = useAuth();
  const { data: courses, save, saving } = useContent('courses', DEFAULT_COURSES);

  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm]       = useState(BLANK);

  const startEdit = (i) => { setForm({ ...courses[i] }); setEditIdx(i); };
  const startAdd  = ()  => { setForm(BLANK); setEditIdx('new'); };
  const cancel    = ()  => { setEditIdx(null); setForm(BLANK); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const next = editIdx === 'new'
      ? [...courses, form]
      : courses.map((c, i) => (i === editIdx ? form : c));
    await save(next);
    cancel();
  };

  const remove = async (i) => {
    await save(courses.filter((_, idx) => idx !== i));
    if (editIdx === i) cancel();
  };

  return (
    <section id="courses" className="section-bg-gray py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Continuing Education</p>
          <h2 className="text-4xl font-bold text-slate-900">Courses & Training</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Admin add button */}
        {unlocked && (
          <div className="flex justify-end mb-4">
            <button
              onClick={startAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              <Plus size={14} /> Add Course
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* New-item form spans full width inside the grid */}
          {editIdx === 'new' && (
            <CourseForm form={form} setForm={setForm} onSave={handleSave} onCancel={cancel} saving={saving} />
          )}

          {courses.map((course, i) => {
            const color = COLORS[i % COLORS.length];
            return editIdx === i ? (
              <CourseForm key={i} form={form} setForm={setForm} onSave={handleSave} onCancel={cancel} saving={saving} />
            ) : (
              <div key={i} className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover shadow-sm group">
                {unlocked && (
                  <div className="absolute top-3 right-3 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(i)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                      <X size={13} />
                    </button>
                  </div>
                )}
                <div className={`h-1.5 bg-gradient-to-r ${color}`} />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md mb-2">
                        {course.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{course.title}</h3>
                      <p className="text-slate-500 text-xs mt-1">{course.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100 text-slate-400 text-xs">
                    <Award size={12} />
                    <span>Certificate of Completion</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
