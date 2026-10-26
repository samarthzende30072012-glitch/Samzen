import React, { useState } from 'react';
import { Shield, Key, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginWithAccessCode } from '../services/workspaceApi';
import { WorkspaceMember } from '../types';

interface AccessCodeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (member: WorkspaceMember) => void;
}

export const AccessCodeAuthModal: React.FC<AccessCodeAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [secondaryCode, setSecondaryCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [showSecondaryCode, setShowSecondaryCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Step 1 Trigger: Typing 301724 in the access code field dynamically reveals the "New Code" field
  const isStep1Triggered = code.trim().includes('301724');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPrimary = code.trim();
    const cleanSecondary = secondaryCode.trim();

    if (!cleanPrimary) {
      setError('Please enter your access code.');
      return;
    }

    let targetCode = cleanPrimary;

    // Step 2 Trigger: If 301724 was entered and 3007 is entered in the secondary "New Code" field (or typed directly)
    if (isStep1Triggered && cleanSecondary === '3007') {
      targetCode = '3007';
    } else if (cleanPrimary === '3007') {
      targetCode = '3007';
    } else if (isStep1Triggered && cleanSecondary) {
      targetCode = cleanSecondary;
    }

    setIsLoading(true);

    try {
      const res = await loginWithAccessCode(targetCode);
      if (res.success && res.member) {
        setSuccessMsg(res.message || 'Access granted!');
        setTimeout(() => {
          onSuccess(res.member!);
          onClose();
        }, 500);
      } else {
        setError('Invalid Code');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const insertSymbol = (sym: string) => {
    if (isStep1Triggered) {
      setSecondaryCode((prev) => (prev + sym).slice(0, 8));
    } else {
      setCode((prev) => (prev + sym).slice(0, 12));
    }
    if (error) setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#eef3fa] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#3da9fc]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#59e3ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center relative z-10 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-[#070b14] border border-[#1d2a3e] text-[#59e3ff] mb-3 shadow-inner">
            <Shield className="w-8 h-8 text-[#3da9fc] animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
            Team Portal Access
          </h2>
          <p className="text-xs sm:text-sm text-[#9db0c8] mt-1">
            Enter your official 8-digit access code issued by CEO Samarth Zende.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Access Code Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#9db0c8] uppercase tracking-wider">
                8-Digit Access Code
              </label>
            </div>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9.]*"
                maxLength={12}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                autoFocus
                className="w-full px-12 py-3.5 bg-[#070b14] border-2 border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-center text-xl sm:text-2xl font-mono tracking-[0.25em] text-white placeholder:text-[#50637a] placeholder:tracking-normal focus:outline-none transition duration-200"
              />
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9db0c8] pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                title={showCode ? 'Mask code' : 'Peek code'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9db0c8] hover:text-[#59e3ff] p-1 cursor-pointer transition"
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dynamic Step 1 Trigger Field: "New Code" field appears automatically when 301724 is typed */}
          {isStep1Triggered && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Code</span>
                </label>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Secondary Code Input
                </span>
              </div>
              <div className="relative">
                <input
                  type={showSecondaryCode ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={secondaryCode}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, 8);
                    setSecondaryCode(val);
                    if (error) setError(null);
                  }}
                  placeholder="Enter secondary code (3007)..."
                  autoFocus
                  className="w-full px-12 py-3 bg-[#070b14] border-2 border-amber-500/50 focus:border-amber-400 rounded-xl text-center text-lg sm:text-xl font-mono tracking-[0.2em] text-amber-200 placeholder:text-amber-700/60 placeholder:tracking-normal focus:outline-none transition"
                />
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowSecondaryCode(!showSecondaryCode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400/70 hover:text-amber-300 p-1 cursor-pointer transition"
                >
                  {showSecondaryCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Quick Symbol Bar */}
          <div className="mt-2 pt-2 border-t border-[#1d2a3e]/60 flex items-center justify-between gap-1 flex-wrap">
            <span className="text-[10px] text-[#9db0c8]">Quick symbols:</span>
            <div className="flex items-center gap-1">
              {['#', '₹', '+', '×', '÷', '@', '%'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => insertSymbol(sym)}
                  className="px-1.5 py-0.5 rounded bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-xs font-mono text-[#59e3ff] hover:text-white transition cursor-pointer"
                  title={`Insert ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-[#9db0c8] hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || (!code.trim() && !secondaryCode.trim())}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-bold text-xs shadow-lg shadow-[#3da9fc]/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#070b14] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Authenticate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Notice */}
        <div className="mt-4 text-center text-[11px] text-[#9db0c8] leading-relaxed">
          <p>
            Official access codes issued exclusively by <strong>CEO Samarth Zende</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
