import React, { useState } from 'react';
import { ShieldAlert, LogOut, Key, AlertCircle } from 'lucide-react';

interface SecureLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedCode: string;
  memberName: string;
  onConfirmLogout: () => void;
}

export const SecureLogoutModal: React.FC<SecureLogoutModalProps> = ({
  isOpen,
  onClose,
  expectedCode,
  memberName,
  onConfirmLogout,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerifyAndLogout = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim();

    if (!clean) {
      setError('Please enter your 8-character access code to confirm logout.');
      return;
    }

    if (clean !== expectedCode.trim()) {
      setError('Verification failed: The entered code does not match your active session code.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setTimeout(() => {
      setIsVerifying(false);
      setInputCode('');
      onConfirmLogout();
      onClose();
    }, 400);
  };

  const insertSymbol = (sym: string) => {
    if (inputCode.length < 8) {
      setInputCode((prev) => (prev + sym).slice(0, 8));
      if (error) setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0e1726] border-2 border-rose-500/70 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-rose-500/10 text-[#eef3fa] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-[#070b14] border border-rose-500/40 text-rose-400 mb-2.5">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-heading text-white">
            Secure Workspace Exit
          </h3>
          <p className="text-xs text-[#9db0c8] mt-1">
            Re-enter your 8-character access code for <strong>{memberName}</strong> to verify your identity before ending this active session.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Code Verification Form */}
        <form onSubmit={handleVerifyAndLogout} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#9db0c8] uppercase tracking-wider">
                Re-enter 8-Character Access Code
              </label>
              <span className="text-[10px] text-rose-400 font-medium">Re-Verification</span>
            </div>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                maxLength={8}
                value={inputCode}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 8);
                  setInputCode(val);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                autoFocus
                className="w-full px-12 py-3 bg-[#070b14] border-2 border-[#1d2a3e] focus:border-rose-500 rounded-xl text-center text-xl sm:text-2xl font-mono tracking-[0.25em] text-white placeholder:text-[#50637a] focus:outline-none transition"
              />
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9db0c8] pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                title={showCode ? 'Mask code' : 'Peek code'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9db0c8] hover:text-white p-1 cursor-pointer transition"
              >
                {showCode ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Quick Symbol Insert */}
            <div className="mt-2 pt-1.5 border-t border-[#1d2a3e]/60 flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[10px] text-[#9db0c8]">Symbols:</span>
              <div className="flex items-center gap-1">
                {['#', '₹', '+', '×', '÷', '@', '%', '=', '/'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => insertSymbol(sym)}
                    className="px-1.5 py-0.5 rounded bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-xs font-mono text-rose-400 hover:text-white transition cursor-pointer"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#9db0c8] mt-1.5">
              <span>Security verification required</span>
              <span className="text-[#59e3ff]">{8 - inputCode.length} characters left</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setInputCode('');
                setError(null);
                onClose();
              }}
              disabled={isVerifying}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-[#9db0c8] hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              Cancel (Stay Logged In)
            </button>
            <button
              type="submit"
              disabled={isVerifying || inputCode.length !== 8}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isVerifying ? 'Verifying...' : 'Confirm Logout'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
