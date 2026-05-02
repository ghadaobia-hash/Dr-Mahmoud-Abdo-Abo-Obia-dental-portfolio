import { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';

export default function PasswordGate({ onSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = onSuccess(password);
    if (!ok) {
      setError(true);
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 relative transition-all ${shake ? 'animate-shake' : ''}`}
        onClick={e => e.stopPropagation()}
        style={shake ? { animation: 'shake 0.4s ease' } : {}}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Admin Access</h3>
          <p className="text-slate-500 text-sm mt-1 text-center">Enter your password to manage content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className={`w-full px-4 py-3 pr-12 rounded-xl border text-slate-800 text-sm focus:outline-none focus:ring-2 transition ${
                error
                  ? 'border-red-400 focus:ring-red-400 bg-red-50'
                  : 'border-slate-300 focus:ring-blue-500 bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium text-center">
              Incorrect password. Try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={17} />
            Unlock
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
