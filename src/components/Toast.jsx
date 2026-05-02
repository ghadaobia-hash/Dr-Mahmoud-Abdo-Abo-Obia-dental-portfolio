import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-sm animate-in ${
        type === 'success'
          ? 'bg-gradient-to-r from-emerald-600 to-green-600'
          : 'bg-gradient-to-r from-red-600 to-rose-600'
      }`}
      style={{ animation: 'slideUp 0.3s ease' }}
    >
      {type === 'success'
        ? <CheckCircle size={18} className="shrink-0" />
        : <AlertCircle size={18} className="shrink-0" />
      }
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 transition">
        <X size={15} />
      </button>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
