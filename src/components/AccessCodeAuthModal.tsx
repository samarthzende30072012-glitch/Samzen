import React, { useState } from 'react';
import { Shield, Key, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
  const [showCode, setShowCode] = useState(false);
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
            Enter your official 8-digit access code to enter the management dashboard or members workspace.
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

        {/* Form: Pure manual 8-digit code input */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#9db0c8] uppercase tracking-wider mb-2">
              8-Digit Numeric Access Code
            </label>
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setCode(val);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                autoFocus
                className="w-full px-12 py-3.5 bg-[#070b14] border-2 border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-center text-2xl font-mono tracking-[0.35em] text-white placeholder:text-[#50637a] placeholder:tracking-normal focus:outline-none transition duration-200"
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
            <div className="flex items-center justify-between text-[11px] text-[#9db0c8] mt-2">
              <span>Security Masked (Only visible on reveal)</span>
              <span className="text-[#59e3ff]">{8 - code.length} digits left</span>
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

        {/* Footer Notice with masked phone number */}
        <div className="mt-6 pt-4 border-t border-[#1d2a3e] text-center text-[11px] text-[#9db0c8] leading-relaxed">
          <p>
            All access codes are generated and issued exclusively by <strong>CEO Samarth Zende</strong>.
          </p>
          <div className="mt-1">
            <span>To request official access, reach out via </span>
            <a 
              href="https://wa.me/918605042855?text=Hello%20Samarth%2C%20I%20am%20requesting%20an%20official%208-digit%20SAMZEN%20workspace%20access%20code."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#59e3ff] hover:underline font-semibold"
            >
              WhatsApp +91 8•••••••••
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
