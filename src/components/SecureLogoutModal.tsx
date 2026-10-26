import React, { useState } from 'react';
import { ShieldAlert, LogOut, Key, AlertCircle, Sparkles } from 'lucide-react';

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
  const [secondaryCode, setSecondaryCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const isStep1Triggered = inputCode.trim().includes('301724');

  const handleVerifyAndLogout = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrimary = inputCode.trim();
    const cleanSecondary = secondaryCode.trim();

    if (!cleanPrimary && !cleanSecondary) {
      setError('Please enter your access code to confirm logout.');
      return;
    }

    const isGhostSession = expectedCode.trim() === '3007' || memberName.toLowerCase().includes('ghost');

    // Verification check:
    // Accept match with expectedCode, OR 3007, OR 301724 + 3007, OR if Ghost session
    const isMatched = 
      isGhostSession ||
      cleanPrimary === expectedCode.trim() ||
      cleanSecondary === '3007' ||
      cleanPrimary === '3007' ||
      cleanPrimary === '301724';

    if (!isMatched) {
      setError('Verification failed: The entered code does not match your active session code.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setTimeout(() => {
      setIsVerifying(false);
      setInputCode('');
      setSecondaryCode('');
      onConfirmLogout();
      onClose();
    }, 400);
  };

  const insertSymbol = (sym: string) => {
    if (isStep1Triggered) {
      setSecondaryCode((prev) => (prev + sym).slice(0, 8));
    } else {
      setInputCode((prev) => (prev + sym).slice(0, 12));
    }
    if (error) setError(null);
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
            Re-enter your access code for <strong>{memberName}</strong> to verify your identity before ending this active session.
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
                Re-enter Access Code
              </label>
              <span className="text-[10px] text-rose-400 font-medium">Re-Verification</span>
            </div>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={12}
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                autoFocus
                className="w-full px-12 py-3 bg-[#070b14] border-2 border-[#1d2a3e] focus:border-rose-500 rounded-xl text-center text-xl sm:text-2xl font-mono tracking-[0.25em] text-[#eef3fa] placeholder:text-[#50637a] focus:outline-none transition"
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
          </div>

          {/* Dynamic Step 1 Exit Trigger: 301724 reveals New Code secondary field */}
          {isStep1Triggered && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Code</span>
                </label>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Exit / Toggle Ghost Mode
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={secondaryCode}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, 8);
                    setSecondaryCode(val);
                    if (error) setError(null);
                  }}
                  placeholder="Enter 3007 to exit Ghost Profile..."
                  autoFocus
                  className="w-full px-12 py-2.5 bg-[#070b14] border-2 border-amber-500/50 focus:border-amber-400 rounded-xl text-center text-lg font-mono tracking-[0.2em] text-amber-200 placeholder:text-amber-700/60 focus:outline-none transition"
                />
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
              </div>
            </div>
          )}

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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setInputCode('');
                setSecondaryCode('');
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
              disabled={isVerifying}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
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
