import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Search, ChevronLeft, ChevronRight, Images, Lock, LogOut } from 'lucide-react';
import { useCases } from '../hooks/useStorage';
import { useAuth } from '../hooks/useAuth';
import PasswordGate from './PasswordGate';

const CATEGORIES = [
  'All', 'Implantology', 'Restorative', 'Endodontics', 'Prosthodontics',
  'Aesthetic', 'Orthodontics', 'Surgery', 'Other'
];

function ImageUploadField({ label, value, onChange }) {
  const ref = useRef();
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      <div
        className="relative w-full h-32 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50 cursor-pointer overflow-hidden transition"
        onClick={() => ref.current.click()}
      >
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-blue-400 text-xs gap-1">
            <Upload size={20} />
            <span>{label}</span>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => onChange(ev.target.result);
            reader.readAsDataURL(file);
          }}
        />
      </div>
    </div>
  );
}

function CaseForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [category, setCategory] = useState(initial?.category || 'Implantology');
  const [desc, setDesc] = useState(initial?.desc || '');
  const [date, setDate] = useState(initial?.date || '');
  const [before, setBefore] = useState(initial?.before || null);
  const [after, setAfter] = useState(initial?.after || null);
  const [extras, setExtras] = useState(initial?.extras || []);
  const extrasRef = useRef();

  const handleExtras = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(
        file => new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        })
      )
    ).then(results => setExtras(prev => [...prev, ...results]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, category, desc, date, before, after, extras });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <h3 className="font-bold text-slate-900 text-lg">{initial ? 'Edit Case' : 'Add New Case'}</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Case Title *</label>
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Full Arch Implant Rehabilitation"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Brief case summary..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <ImageUploadField label="Before Image" value={before} onChange={setBefore} />
        <ImageUploadField label="After Image" value={after} onChange={setAfter} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Images</label>
        <input ref={extrasRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtras} />
        <button
          type="button"
          onClick={() => extrasRef.current.click()}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-blue-400 text-blue-600 text-sm rounded-xl hover:bg-blue-50 transition"
        >
          <Upload size={16} />
          Add More Images ({extras.length} added)
        </button>
        {extras.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {extras.map((src, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group">
                <img src={src} className="w-full h-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => setExtras(extras.filter((_, j) => j !== i))}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
          Save Case
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-slate-300 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition">
          Cancel
        </button>
      </div>
    </form>
  );
}

function CaseLightbox({ caseData, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  if (!caseData) return null;

  const allImages = [
    caseData.before && { src: caseData.before, label: 'Before' },
    caseData.after && { src: caseData.after, label: 'After' },
    ...(caseData.extras || []).map((src, i) => ({ src, label: `Photo ${i + 1}` })),
  ].filter(Boolean);

  const current = allImages[imgIdx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">{caseData.title}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded">{caseData.category}</span>
              {caseData.date && <span className="text-slate-400 text-xs">{caseData.date}</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={20} />
          </button>
        </div>

        {allImages.length > 0 ? (
          <div>
            <div className="relative bg-slate-900 h-72 sm:h-96 flex items-center justify-center">
              <img src={current.src} alt={current.label} className="max-h-full max-w-full object-contain" />
              {current.label && (
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 text-white text-xs font-semibold rounded-lg">
                  {current.label}
                </span>
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((imgIdx - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImgIdx((imgIdx + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === imgIdx ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    <img src={img.src} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
            No images uploaded for this case.
          </div>
        )}

        {caseData.desc && (
          <div className="px-5 py-4 border-t border-slate-100">
            <p className="text-slate-600 text-sm leading-relaxed">{caseData.desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClinicalCases() {
  const [cases, setCases] = useCases();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showGate, setShowGate] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
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

  const handleAdd = (data) => {
    setCases([...cases, { ...data, id: Date.now().toString() }]);
    setShowForm(false);
  };

  const handleEdit = (data) => {
    setCases(cases.map(c => c.id === editingId ? { ...data, id: editingId } : c));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setCases(cases.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = cases.filter(c => {
    const matchCat = filterCat === 'All' || c.category === filterCat;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.desc || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="cases" className="section-bg-gray py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
          <h2 className="text-4xl font-bold text-slate-900">Clinical Cases</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        <p className="text-center text-slate-500 text-base mb-10 -mt-8">
          A collection of my real clinical work — browse through my cases below.
        </p>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  filterCat === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {!showForm && editingId === null && (
          <div className="flex justify-center items-center gap-3 mb-10">
            <button
              onClick={() => requireAuth(() => setShowForm(true))}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-blue-500/20"
            >
              <Plus size={18} />
              Add Clinical Case
            </button>
            {unlocked && (
              <button
                onClick={lock}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 text-slate-500 text-sm hover:bg-slate-50 transition"
                title="Lock admin session"
              >
                <LogOut size={15} /> Lock
              </button>
            )}
            {!unlocked && (
              <button
                onClick={() => setShowGate(true)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-blue-300 text-blue-600 text-sm hover:bg-blue-50 transition"
                title="Admin login"
              >
                <Lock size={15} /> Admin
              </button>
            )}
          </div>
        )}

        {showForm && (
          <div className="mb-10">
            <CaseForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {filtered.length === 0 && !showForm && (
          <div className="text-center py-20 text-slate-400">
            <Images size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">
              {cases.length === 0 ? 'No cases yet' : 'No matching cases'}
            </p>
            <p className="text-sm mt-1">
              {cases.length === 0
                ? 'Click "Add Clinical Case" to document your first case.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(caseItem => (
            <div key={caseItem.id}>
              {editingId === caseItem.id ? (
                <CaseForm initial={caseItem} onSave={handleEdit} onCancel={() => setEditingId(null)} />
              ) : (
                <div
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm card-hover group cursor-pointer"
                  onClick={() => setActiveCase(caseItem)}
                >
                  {/* Image preview */}
                  <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {caseItem.after || caseItem.before ? (
                      <div className="flex h-full">
                        {caseItem.before && (
                          <div className="flex-1 relative overflow-hidden">
                            <img src={caseItem.before} alt="Before" className="w-full h-full object-cover" />
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded font-medium">Before</span>
                          </div>
                        )}
                        {caseItem.after && (
                          <div className="flex-1 relative overflow-hidden">
                            <img src={caseItem.after} alt="After" className="w-full h-full object-cover" />
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-blue-600/90 text-white text-xs rounded font-medium">After</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300">
                        <Images size={36} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
                    {(caseItem.extras?.length > 0) && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">
                        +{caseItem.extras.length}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug flex-1">{caseItem.title}</h3>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded shrink-0">{caseItem.category}</span>
                    </div>
                    {caseItem.desc && <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{caseItem.desc}</p>}
                    {caseItem.date && <p className="text-slate-400 text-xs mt-2">{caseItem.date}</p>}

                    {unlocked && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setEditingId(caseItem.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(caseItem.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition ml-auto"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Delete confirm */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <h3 className="font-bold text-slate-900">Delete Case?</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">This will permanently delete the case and all its images.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <CaseLightbox caseData={activeCase} onClose={() => setActiveCase(null)} />
        {showGate && <PasswordGate onSuccess={handleUnlock} onClose={() => { setShowGate(false); setPendingAction(null); }} />}
      </div>
    </section>
  );
}
