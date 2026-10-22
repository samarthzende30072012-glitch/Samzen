import React, { useState } from 'react';
import { Shield, Key, Lock, CheckCircle2, AlertCircle, Sparkles, Crown, ArrowRight, UserCheck } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode) {
      setError('Please enter your 8-digit access code.');
      return;
    }
    if (!/^\d{8}$/.test(cleanCode)) {
      setError('The access code must be exactly 8 numeric digits.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginWithAccessCode(cleanCode);
      if (res.success && res.member) {
        setSuccessMsg(res.message || 'Access granted!');
        setTimeout(() => {
          onSuccess(res.member!);
          onClose();
        }, 600);
      } else {
        setError(res.message || 'Invalid access code. Please verify and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const setPresetCode = (presetCode: string) => {
    setCode(presetCode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#3da9fc]/20 text-[#eef3fa] overflow-hidden"
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
            Internal Team Workspace
          </h2>
          <p className="text-xs sm:text-sm text-[#9db0c8] mt-1">
            Enter your secure 8-digit access code to enter the management dashboard or members portal.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#9db0c8] uppercase tracking-wider mb-2">
              8-Digit Numeric Access Code
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setCode(val);
                  if (error) setError(null);
                }}
                placeholder="e.g. 30072012"
                autoFocus
                className="w-full px-4 py-3.5 bg-[#070b14] border-2 border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-center text-2xl font-mono tracking-[0.35em] text-white placeholder:text-[#50637a] placeholder:tracking-normal focus:outline-none transition duration-200"
              />
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9db0c8] pointer-events-none" />
              {code.length === 8 && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold font-mono">
                  8/8
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#9db0c8] mt-2">
              <span>Must be exact 8 digits</span>
              <span className="text-[#59e3ff]">{8 - code.length} digits remaining</span>
            </div>
          </div>

          {/* Quick 1-Tap Credentials / Demo Helper */}
          <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-2">
            <div className="text-[11px] font-semibold text-[#9db0c8] flex items-center justify-between">
              <span>Quick Login Presets:</span>
              <span className="text-[10px] text-[#59e3ff] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#3da9fc]" /> Click to auto-fill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPresetCode('30072012')}
                className="p-2 rounded-lg bg-[#0e1726] border border-amber-400/40 hover:border-amber-400 text-left transition flex items-center gap-2 group cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-400 flex-shrink-0 group-hover:scale-110 transition" />
                <div className="min-w-0">
                  <div className="font-bold text-amber-300 text-[11px] truncate">CEO Samarth Zende</div>
                  <div className="text-[10px] font-mono text-[#9db0c8]">Code: 30072012</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPresetCode('84920153')}
                className="p-2 rounded-lg bg-[#0e1726] border border-[#3da9fc]/40 hover:border-[#3da9fc] text-left transition flex items-center gap-2 group cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#3da9fc] flex-shrink-0 group-hover:scale-110 transition" />
                <div className="min-w-0">
                  <div className="font-bold text-[#59e3ff] text-[11px] truncate">Co-Founder Sharven</div>
                  <div className="text-[10px] font-mono text-[#9db0c8]">Code: 84920153</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPresetCode('12345678')}
                className="p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e] hover:border-[#59e3ff] text-left transition flex items-center gap-2 group cursor-pointer sm:col-span-2"
              >
                <Lock className="w-4 h-4 text-[#9db0c8] flex-shrink-0 group-hover:text-[#59e3ff] transition" />
                <div className="min-w-0 flex-1 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-[11px]">Team Member (Aarav K.)</div>
                    <div className="text-[10px] text-[#9db0c8]">Full-Stack React Engineer</div>
                  </div>
                  <div className="text-[10px] font-mono text-[#59e3ff] bg-[#070b14] px-1.5 py-0.5 rounded border border-[#1d2a3e]">
                    12345678
                  </div>
                </div>
              </button>
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
              disabled={isLoading || code.length !== 8}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-bold text-xs shadow-lg shadow-[#3da9fc]/30 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        <div className="mt-6 pt-4 border-t border-[#1d2a3e] text-center text-[11px] text-[#9db0c8]">
          <span>Need an access code? Contact CEO Samarth Zende at </span>
          <a 
            href="https://wa.me/918605042855?text=Hello%20Samarth%2C%20I%20am%20a%20team%20member%20requesting%20an%208-digit%20SAMZEN%20workspace%20access%20code."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#59e3ff] hover:underline font-semibold"
          >
            WhatsApp +91 8605042855
          </a>
        </div>
      </div>
    </div>
  );
};
