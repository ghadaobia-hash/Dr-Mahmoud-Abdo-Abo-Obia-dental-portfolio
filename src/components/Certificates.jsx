import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Eye, Award, X, Upload, Lock, LogOut, Loader2, GripVertical } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSupabaseCertificates } from '../hooks/useSupabaseCertificates';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';
import PasswordGate from './PasswordGate';
import Toast from './Toast';

// ── Certificate preview modal ─────────────────────────────────────────────
function CertModal({ cert, onClose }) {
  if (!cert) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <Award size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{cert.title}</h3>
            <p className="text-slate-500 text-sm">{cert.issuer}</p>
          </div>
        </div>
        {cert.date && <p className="text-sm text-slate-500 mb-4">Date: {cert.date}</p>}
        {cert.file_url && (
          cert.file_type === 'application/pdf'
            ? <iframe src={cert.file_url} className="w-full h-64 rounded-xl border border-slate-200" title="Certificate PDF" />
            : <img src={cert.file_url} alt={cert.title} className="w-full rounded-xl border border-slate-200 object-contain max-h-80" />
        )}
        {!cert.file_url && (
          <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
            No preview available
          </div>
        )}
      </div>
    </div>
  );
}

// ── Certificate form ──────────────────────────────────────────────────────
function CertForm({ initial, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [issuer, setIssuer] = useState(initial?.issuer || '');
  const [date, setDate] = useState(initial?.date || '');
  // fileField: { preview: string, file: File|null, fileType: string, fileName: string } | null
  const [fileField, setFileField] = useState(
    initial?.file_url
      ? { preview: initial.file_url, file: null, fileType: initial.file_type, fileName: initial.file_name }
      : null
  );
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = file.type === 'application/pdf'
      ? null  // PDFs can't be previewed via object URL easily
      : URL.createObjectURL(file);
    setFileField({ preview, file, fileType: file.type, fileName: file.name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, issuer, date, fileField });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Certificate Title *</label>
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Implant Dentistry Certificate"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Issuer</label>
          <input
            value={issuer}
            onChange={e => setIssuer(e.target.value)}
            placeholder="e.g. University of Hong Kong"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
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
          <label className="block text-sm font-semibold text-slate-700 mb-1">Upload File (Image or PDF)</label>
          <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="w-full px-4 py-2.5 rounded-xl border border-dashed border-blue-400 text-blue-600 text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            {fileField?.fileName || fileField?.file?.name || 'Choose File'}
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? 'Saving…' : 'Save Certificate'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-6 py-2.5 border border-slate-300 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Cert card inner content ───────────────────────────────────────────────
function CertCardInner({ cert, unlocked, onPreview, onEdit, onDelete, isOverlay, dragHandleProps }) {
  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm group ${
      isOverlay ? 'border-blue-400 shadow-2xl rotate-1 opacity-95 cursor-grabbing' : 'border-slate-200 card-hover'
    }`}>
      <div className="h-36 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {unlocked && !isOverlay && (
          <div
            {...dragHandleProps}
            className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-black/30 text-white cursor-grab active:cursor-grabbing hover:bg-black/50 transition"
            title="Drag to reorder"
          >
            <GripVertical size={15} />
          </div>
        )}
        {cert.file_url && cert.file_type !== 'application/pdf' ? (
          <img src={cert.file_url} alt={cert.title} className="w-full h-full object-cover" />
        ) : (
          <Award size={40} className="text-blue-200" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">{cert.title}</h3>
        {cert.issuer && <p className="text-slate-500 text-xs mb-0.5">{cert.issuer}</p>}
        {cert.date   && <p className="text-slate-400 text-xs">{cert.date}</p>}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button onClick={onPreview} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition">
            <Eye size={13} /> Preview
          </button>
          {unlocked && !isOverlay && (
            <>
              <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition">
                <Pencil size={13} /> Edit
              </button>
              <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition ml-auto">
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sortable wrapper ───────────────────────────────────────────────────────
function SortableCertCard({ cert, unlocked, editingId, saving, onEdit, onCancelEdit, onSaveEdit, onDelete, onPreview, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cert.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

  if (editingId === cert.id) {
    return (
      <div ref={setNodeRef} style={style}>
        <CertForm initial={cert} onSave={onSaveEdit} onCancel={onCancelEdit} saving={saving} />
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style}>
      <CertCardInner
        cert={cert}
        unlocked={unlocked}
        onPreview={onPreview}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function Certificates() {
  const { certificates, loading, saving, toast, addCert, updateCert, removeCert } = useSupabaseCertificates();
  const { data: certsOrder, save: saveOrder } = useContent('certs_order', []);

  const [showForm,      setShowForm]      = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [previewCert,   setPreviewCert]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showGate,      setShowGate]      = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [activeDragId,  setActiveDragId]  = useState(null);
  const { unlocked, unlock, lock } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const getFullOrder = () => {
    const stored = Array.isArray(certsOrder) ? certsOrder : [];
    const storedSet = new Set(stored);
    const remaining = certificates.filter(c => !storedSet.has(c.id)).map(c => c.id);
    return [...stored, ...remaining];
  };

  const ordered = (() => {
    const order = getFullOrder();
    const orderMap = Object.fromEntries(order.map((id, i) => [id, i]));
    return [...certificates].sort((a, b) => (orderMap[a.id] ?? 9999) - (orderMap[b.id] ?? 9999));
  })();

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
    if (ok) { setShowGate(false); if (pendingAction) { pendingAction(); setPendingAction(null); } }
    return ok;
  };

  const handleAdd = async (data) => {
    const newCert = await addCert(data);
    if (newCert) {
      await saveOrder([newCert.id, ...getFullOrder().filter(id => id !== newCert.id)]);
      setShowForm(false);
    }
  };

  const handleEdit = async (data) => {
    const ok = await updateCert(editingId, data);
    if (ok) setEditingId(null);
  };

  const handleDelete = async (id) => {
    await removeCert(id);
    await saveOrder(getFullOrder().filter(oid => oid !== id));
    setDeleteConfirm(null);
  };

  return (
    <section id="certificates" className="section-bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Achievements</p>
          <h2 className="text-4xl font-bold text-slate-900">Certificates</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        <p className="text-center text-slate-500 text-base mb-10 -mt-8">
          A collection of my certificates and achievements — earned through continuous learning and training.
        </p>

        {/* Add / Admin buttons */}
        {!showForm && editingId === null && (
          <div className="flex justify-center items-center gap-3 mb-10">
            <button
              onClick={() => requireAuth(() => setShowForm(true))}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-blue-500/20"
            >
              <Plus size={18} /> Add Certificate
            </button>
            {unlocked ? (
              <button onClick={lock} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 text-slate-500 text-sm hover:bg-slate-50 transition">
                <LogOut size={15} /> Lock
              </button>
            ) : (
              <button onClick={() => setShowGate(true)} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-blue-300 text-blue-600 text-sm hover:bg-blue-50 transition">
                <Lock size={15} /> Admin
              </button>
            )}
          </div>
        )}

        {showForm && (
          <div className="mb-10">
            <CertForm onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        )}

        {!loading && certificates.length === 0 && !showForm && (
          <div className="text-center py-20 text-slate-400">
            <Award size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No certificates yet</p>
            <p className="text-sm mt-1">Click "Add Certificate" to upload your first one.</p>
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
            <SortableContext items={ordered.map(c => c.id)} strategy={rectSortingStrategy}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ordered.map(cert => (
                  <SortableCertCard
                    key={cert.id}
                    cert={cert}
                    unlocked={unlocked}
                    editingId={editingId}
                    saving={saving}
                    onEdit={() => setEditingId(cert.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSaveEdit={handleEdit}
                    onDelete={() => setDeleteConfirm(cert.id)}
                    onPreview={() => setPreviewCert(cert)}
                    isDragging={activeDragId === cert.id}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeDragId ? (
                <CertCardInner
                  cert={ordered.find(c => c.id === activeDragId)}
                  unlocked={false}
                  isOverlay
                  onPreview={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ordered.map(cert => (
              <div key={cert.id}>
                <CertCardInner
                  cert={cert}
                  unlocked={false}
                  onPreview={() => setPreviewCert(cert)}
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
                <h3 className="font-bold text-slate-900">Delete Certificate?</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">This will permanently remove it from the database.</p>
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

        {previewCert && <CertModal cert={previewCert} onClose={() => setPreviewCert(null)} />}
        {showGate && <PasswordGate onSuccess={handleUnlock} onClose={() => { setShowGate(false); setPendingAction(null); }} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </section>
  );
}
