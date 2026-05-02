import { useState, useRef } from 'react';
import {
  Plus, Pencil, Trash2, X, Upload, Search,
  ChevronLeft, ChevronRight, Images, Lock, LogOut, Loader2, GripVertical, Cpu,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSupabaseCases } from '../hooks/useSupabaseCases';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';
import PasswordGate from './PasswordGate';
import Toast from './Toast';

const CATEGORIES = [
  'All', 'Full-Arch', 'Single Implant', 'Multiple Implants',
  'Immediate Loading', 'Bone Grafting', 'Sinus Lift', 'Other',
];

// ── Image upload field ─────────────────────────────────────────────────────
function ImageUploadField({ label, value, onChange }) {
  const ref = useRef();
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      <div
        className="relative w-full h-32 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50 cursor-pointer overflow-hidden transition"
        onClick={() => ref.current.click()}
      >
        {value?.preview ? (
          <img src={value.preview} alt={label} className="w-full h-full object-cover" />
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
            onChange({ preview: URL.createObjectURL(file), file });
          }}
        />
      </div>
    </div>
  );
}

// ── Case form ──────────────────────────────────────────────────────────────
function CaseForm({ initial, onSave, onCancel, saving }) {
  const [title,    setTitle]    = useState(initial?.title || '');
  const [category, setCategory] = useState(initial?.category || 'Full-Arch');
  const [desc,     setDesc]     = useState(initial?.description || '');
  const [date,     setDate]     = useState(initial?.date || '');
  const [before,   setBefore]   = useState(initial?.before_url ? { preview: initial.before_url, file: null } : null);
  const [after,    setAfter]    = useState(initial?.after_url  ? { preview: initial.after_url,  file: null } : null);
  const [extras,   setExtras]   = useState((initial?.extras || []).map(url => ({ preview: url, file: null })));
  const extrasRef = useRef();

  const handleExtras = (e) => {
    const files = Array.from(e.target.files);
    setExtras(prev => [...prev, ...files.map(file => ({ preview: URL.createObjectURL(file), file }))]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, category, desc, date, before, after, extras });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <h3 className="font-bold text-slate-900 text-lg">{initial ? 'Edit Case' : 'Add New Digital Case'}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Case Title *</label>
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Full Arch Guided Surgery" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief case summary..." className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <ImageUploadField label="Before Image" value={before} onChange={setBefore} />
        <ImageUploadField label="After Image"  value={after}  onChange={setAfter}  />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Images</label>
        <input ref={extrasRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtras} />
        <button type="button" onClick={() => extrasRef.current.click()} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-blue-400 text-blue-600 text-sm rounded-xl hover:bg-blue-50 transition">
          <Upload size={16} /> Add More Images ({extras.length} added)
        </button>
        {extras.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {extras.map((item, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group">
                <img src={item.preview} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => setExtras(extras.filter((_, j) => j !== i))} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition">
                  <X size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60">
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? 'Saving…' : 'Save Case'}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="px-6 py-2.5 border border-slate-300 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition disabled:opacity-60">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Lightbox ───────────────────────────────────────────────────────────────
function CaseLightbox({ caseData, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  if (!caseData) return null;

  const allImages = [
    caseData.before_url && { src: caseData.before_url, label: 'Before' },
    caseData.after_url  && { src: caseData.after_url,  label: 'After'  },
    ...(caseData.extras || []).map((src, i) => ({ src, label: `Photo ${i + 1}` })),
  ].filter(Boolean);

  const current = allImages[imgIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">{caseData.title}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded">{caseData.category}</span>
              {caseData.date && <span className="text-slate-400 text-xs">{caseData.date}</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={20} /></button>
        </div>

        {allImages.length > 0 ? (
          <div>
            <div className="relative bg-slate-900 h-72 sm:h-96 flex items-center justify-center">
              <img src={current.src} alt={current.label} className="max-h-full max-w-full object-contain" />
              {current.label && (
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 text-white text-xs font-semibold rounded-lg">{current.label}</span>
              )}
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((imgIdx - 1 + allImages.length) % allImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"><ChevronLeft size={18} /></button>
                  <button onClick={() => setImgIdx((imgIdx + 1) % allImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"><ChevronRight size={18} /></button>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === imgIdx ? 'border-indigo-500' : 'border-transparent'}`}>
                    <img src={img.src} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-slate-50 text-slate-400 text-sm">No images uploaded for this case.</div>
        )}

        {caseData.description && (
          <div className="px-5 py-4 border-t border-slate-100">
            <p className="text-slate-600 text-sm leading-relaxed">{caseData.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Card inner content ─────────────────────────────────────────────────────
function CaseCardInner({ caseItem, unlocked, onClick, onEdit, onDelete, isOverlay, dragHandleProps }) {
  if (!caseItem) return null;
  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm group ${
        isOverlay
          ? 'border-indigo-400 shadow-2xl rotate-1 opacity-95 cursor-grabbing'
          : 'border-slate-200 card-hover cursor-pointer'
      }`}
      onClick={onClick}
    >
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {unlocked && !isOverlay && (
          <div
            {...dragHandleProps}
            onClick={e => e.stopPropagation()}
            className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-black/40 text-white cursor-grab active:cursor-grabbing hover:bg-black/60 transition"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </div>
        )}
        {caseItem.after_url || caseItem.before_url ? (
          <div className="flex h-full">
            {caseItem.before_url && (
              <div className="flex-1 relative overflow-hidden">
                <img src={caseItem.before_url} alt="Before" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded font-medium">Before</span>
              </div>
            )}
            {caseItem.after_url && (
              <div className="flex-1 relative overflow-hidden">
                <img src={caseItem.after_url} alt="After" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-indigo-600/90 text-white text-xs rounded font-medium">After</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><Images size={36} /></div>
        )}
        {caseItem.extras?.length > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">+{caseItem.extras.length}</span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-900 text-sm leading-snug flex-1">{caseItem.title}</h3>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded shrink-0">{caseItem.category}</span>
        </div>
        {caseItem.description && <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{caseItem.description}</p>}
        {caseItem.date && <p className="text-slate-400 text-xs mt-2">{caseItem.date}</p>}

        {unlocked && !isOverlay && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100" onClick={e => e.stopPropagation()}>
            <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition">
              <Pencil size={12} /> Edit
            </button>
            <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition ml-auto">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sortable wrapper ───────────────────────────────────────────────────────
function SortableCaseCard({ caseItem, unlocked, editingId, saving, onEdit, onCancelEdit, onSaveEdit, onDelete, onClick, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: caseItem.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

  if (editingId === caseItem.id) {
    return (
      <div ref={setNodeRef} style={style}>
        <CaseForm initial={caseItem} onSave={onSaveEdit} onCancel={onCancelEdit} saving={saving} />
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style}>
      <CaseCardInner
        caseItem={caseItem}
        unlocked={unlocked}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function DigitalCases() {
  const { cases, loading, saving, toast, addCase, updateCase, removeCase } = useSupabaseCases('digital_cases');
  const { data: casesOrder, save: saveOrder } = useContent('digital_cases_order', []);
  const [showForm,      setShowForm]      = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [activeCase,    setActiveCase]    = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search,        setSearch]        = useState('');
  const [filterCat,     setFilterCat]     = useState('All');
  const [showGate,      setShowGate]      = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [activeDragId,  setActiveDragId]  = useState(null);
  const { unlocked, unlock, lock } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const getFullOrder = () => {
    const stored = Array.isArray(casesOrder) ? casesOrder : [];
    const storedSet = new Set(stored);
    const remaining = cases.filter(c => !storedSet.has(c.id)).map(c => c.id);
    return [...stored, ...remaining];
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveDragId(null);
    if (!over || active.id === over.id) return;
    const order = getFullOrder();
    const oldIdx = order.indexOf(active.id);
    const newIdx = order.indexOf(over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    await saveOrder(arrayMove(order, oldIdx, newIdx));
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

  const handleAdd = async (data) => {
    const newCase = await addCase(data);
    if (newCase) {
      await saveOrder([newCase.id, ...getFullOrder().filter(id => id !== newCase.id)]);
      setShowForm(false);
    }
  };

  const handleEdit = async (data) => {
    const ok = await updateCase(editingId, data);
    if (ok) setEditingId(null);
  };

  const handleDelete = async (id) => {
    await removeCase(id);
    await saveOrder(getFullOrder().filter(oid => oid !== id));
    setDeleteConfirm(null);
  };

  const filtered = (() => {
    const order = getFullOrder();
    const orderMap = Object.fromEntries(order.map((id, i) => [id, i]));
    return cases
      .filter(c => {
        const matchCat = filterCat === 'All' || c.category === filterCat;
        const matchSearch =
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          (c.description || '').toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      })
      .sort((a, b) => (orderMap[a.id] ?? 9999) - (orderMap[b.id] ?? 9999));
  })();

  return (
    <section id="digital-cases" className="section-bg-dark-navy py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Digital Workflow</p>
          <h2 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Cpu size={32} className="text-indigo-400" />
            Digital Guided Surgery Cases
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mx-auto mt-4" />
        </div>

        <p className="text-center text-slate-400 text-base mb-10 -mt-8">
          Real digital guided surgery cases — from planning to surgical guide production and placement.
        </p>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  filterCat === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:border-indigo-400/50 hover:text-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add / Admin buttons */}
        {!showForm && editingId === null && (
          <div className="flex justify-center items-center gap-3 mb-10">
            <button
              onClick={() => requireAuth(() => setShowForm(true))}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
            >
              <Plus size={18} /> Add Digital Case
            </button>
            {unlocked ? (
              <button onClick={lock} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-white/20 text-slate-400 text-sm hover:bg-white/5 transition">
                <LogOut size={15} /> Lock
              </button>
            ) : (
              <button onClick={() => setShowGate(true)} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-indigo-500/40 text-indigo-400 text-sm hover:bg-indigo-500/10 transition">
                <Lock size={15} /> Admin
              </button>
            )}
          </div>
        )}

        {showForm && (
          <div className="mb-10">
            <CaseForm onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && !showForm && (
          <div className="text-center py-20 text-slate-500">
            <Cpu size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-400">{cases.length === 0 ? 'No digital cases yet' : 'No matching cases'}</p>
            <p className="text-sm mt-1">{cases.length === 0 ? 'Click "Add Digital Case" to upload your first case.' : 'Try adjusting your search or filter.'}</p>
          </div>
        )}

        {/* Sortable grid */}
        {unlocked ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={({ active }) => setActiveDragId(active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveDragId(null)}
          >
            <SortableContext items={filtered.map(c => c.id)} strategy={rectSortingStrategy}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(caseItem => (
                  <SortableCaseCard
                    key={caseItem.id}
                    caseItem={caseItem}
                    unlocked={unlocked}
                    editingId={editingId}
                    saving={saving}
                    onEdit={() => setEditingId(caseItem.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSaveEdit={handleEdit}
                    onDelete={() => setDeleteConfirm(caseItem.id)}
                    onClick={() => setActiveCase(caseItem)}
                    isDragging={activeDragId === caseItem.id}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeDragId ? (
                <CaseCardInner
                  caseItem={filtered.find(c => c.id === activeDragId)}
                  unlocked={false}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(caseItem => (
              <div key={caseItem.id}>
                <CaseCardInner
                  caseItem={caseItem}
                  unlocked={false}
                  onClick={() => setActiveCase(caseItem)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><Trash2 size={18} className="text-red-500" /></div>
                <h3 className="font-bold text-slate-900">Delete Case?</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">This will permanently delete the case and all its images.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} disabled={saving} className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Deleting…' : 'Delete'}
                </button>
                <button onClick={() => setDeleteConfirm(null)} disabled={saving} className="flex-1 py-2.5 border border-slate-300 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition disabled:opacity-60">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <CaseLightbox caseData={activeCase} onClose={() => setActiveCase(null)} />
        {showGate && <PasswordGate onSuccess={handleUnlock} onClose={() => { setShowGate(false); setPendingAction(null); }} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </section>
  );
}
