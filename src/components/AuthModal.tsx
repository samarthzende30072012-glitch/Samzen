import React, { useState, useEffect } from 'react';
import { requestOtp, verifyOtp, signupUser, loginUser, resetPassword } from '../services/api';
import { User, OtpRequestResponse } from '../types';
import { X, Mail, Phone, Lock, User as UserIcon, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, KeyRound, ExternalLink, MessageSquare } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot_password';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'otp_verify' | 'forgot_password'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // OTP State
  const [otpResponse, setOtpResponse] = useState<OtpRequestResponse | null>(null);
  const [otpTarget, setOtpTarget] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [pendingAction, setPendingAction] = useState<'signup' | 'login' | 'recovery'>('signup');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  if (!isOpen) return null;

  // Handle Request OTP
  const handleRequestOtp = async (target: string, type: 'email' | 'phone', purpose: 'signup' | 'login' | 'recovery') => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await requestOtp(target, type, purpose);
      if (res.success) {
        setOtpResponse(res);
        setOtpTarget(target);
        setPendingAction(purpose);
        setTimerSeconds(60); // 60s cooldown for resend
        setMode('otp_verify');
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message || 'Failed to generate OTP.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while requesting OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Sign Up
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) return setErrorMessage('Please enter your full name.');
    if (!email.trim()) return setErrorMessage('Please enter a valid Gmail / email address.');
    if (password.length < 6) return setErrorMessage('Password must be at least 6 characters.');

    // Step 1: Send real OTP to the email before completing registration
    await handleRequestOtp(email.trim(), 'email', 'signup');
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const target = authMethod === 'email' ? email.trim() : phone.trim();

    if (!target) {
      return setErrorMessage(`Please enter your ${authMethod}.`);
    }

    setIsLoading(true);
    try {
      const res = await loginUser({
        identifier: target,
        password: password,
      });

      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.message || 'Login failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login request error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Login using OTP without password
  const handleOtpLoginRequest = async () => {
    const target = authMethod === 'email' ? email.trim() : phone.trim();
    if (!target) {
      return setErrorMessage(`Please enter your ${authMethod} to receive an OTP.`);
    }
    await handleRequestOtp(target, authMethod, 'login');
  };

  // Verify OTP submission
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpCode.length !== 6) {
      return setErrorMessage('Please enter the 6-digit verification code.');
    }

    setIsLoading(true);
    try {
      const verifyRes = await verifyOtp(otpTarget, otpCode);
      if (!verifyRes.success) {
        setIsLoading(false);
        return setErrorMessage(verifyRes.message || 'Invalid verification code.');
      }

      // Action routing based on purpose
      if (pendingAction === 'signup') {
        const signupRes = await signupUser({
          name,
          email,
          phone,
          password,
          otpVerified: true,
        });
        if (signupRes.success && signupRes.user) {
          onLoginSuccess(signupRes.user);
          onClose();
        } else {
          setErrorMessage(signupRes.message || 'Account registration failed.');
        }
      } else if (pendingAction === 'login') {
        const loginRes = await loginUser({
          identifier: otpTarget,
          isOtpLogin: true,
        });
        if (loginRes.success && loginRes.user) {
          onLoginSuccess(loginRes.user);
          onClose();
        } else {
          setErrorMessage(loginRes.message || 'OTP login failed.');
        }
      } else if (pendingAction === 'recovery') {
        setMode('forgot_password');
        setSuccessMessage('OTP verified! Enter your new password below.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Password Reset
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      return setErrorMessage('New password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setErrorMessage('Passwords do not match.');
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        identifier: otpTarget,
        newPassword: password,
        otpVerified: true,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setMode('login');
        }, 1500);
      } else {
        setErrorMessage(res.message || 'Password reset failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#9db0c8] hover:text-white rounded-lg hover:bg-[#1d2a3e] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#59e3ff] mb-1">
            <KeyRound className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>SAMZEN Client Account</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            {mode === 'login' && 'Log In to Account'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'otp_verify' && 'Verify 6-Digit OTP'}
            {mode === 'forgot_password' && 'Set New Password'}
          </h3>
          <p className="text-xs text-[#9db0c8] mt-1">
            {mode === 'login' && 'Access your website project status and service support.'}
            {mode === 'signup' && 'Register your details with verified email/phone verification.'}
            {mode === 'otp_verify' && `Real OTP dispatched to ${otpTarget}.`}
            {mode === 'forgot_password' && 'Enter your replacement password.'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= MODE: LOGIN ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Method switch: Email vs Phone */}
            <div className="flex p-1 bg-[#070b14] rounded-lg border border-[#1d2a3e]">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  authMethod === 'email' ? 'bg-[#1d2a3e] text-white' : 'text-[#9db0c8]'
                }`}
              >
                Gmail / Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  authMethod === 'phone' ? 'bg-[#1d2a3e] text-white' : 'text-[#9db0c8]'
                }`}
              >
                Mobile Phone
              </button>
            </div>

            {authMethod === 'email' ? (
              <div>
                <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Gmail / Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Phone Number (Calling / WhatsApp)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#c9d3dc]">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    const target = authMethod === 'email' ? email.trim() : phone.trim();
                    if (!target) {
                      setErrorMessage(`Enter your ${authMethod} first to receive a password recovery OTP.`);
                      return;
                    }
                    handleRequestOtp(target, authMethod, 'recovery');
                  }}
                  className="text-[11px] text-[#59e3ff] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:opacity-90 text-[#070b14] font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#3da9fc]/20"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>Log In with Password</span>
              )}
            </button>

            {/* Passwordless OTP login option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleOtpLoginRequest}
                className="text-xs text-[#59e3ff] hover:underline"
              >
                Or Log In instantly with 6-digit Real OTP
              </button>
            </div>

            <div className="pt-4 border-t border-[#1d2a3e] text-center text-xs text-[#9db0c8]">
              Don&rsquo;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#59e3ff] font-semibold hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE: SIGN UP ================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Full Name / Business Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahulsharma@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Phone Number (Calling / WhatsApp)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Create Password (Min. 6 chars)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:opacity-90 text-[#070b14] font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#3da9fc]/20"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Continue to Real OTP Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-3 border-t border-[#1d2a3e] text-center text-xs text-[#9db0c8]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#59e3ff] font-semibold hover:underline"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE: OTP VERIFY ================= */}
        {mode === 'otp_verify' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#3da9fc]/40 text-center">
              <p className="text-xs text-[#9db0c8] mb-1">Verification code sent to:</p>
              <p className="text-sm font-bold text-[#59e3ff] truncate">{otpTarget}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1 text-center">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full py-3 text-center tracking-[8px] text-xl font-bold font-mono rounded-lg bg-[#070b14] border border-[#1d2a3e] text-white focus:outline-none focus:border-[#3da9fc]"
              />
            </div>

            {/* Direct Verification Links for Gmail & WhatsApp */}
            <div className="space-y-2 pt-1">
              {otpResponse?.directGmailUrl && (
                <a
                  href={otpResponse.directGmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-xs text-[#eef3fa] flex items-center justify-center gap-2 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-[#3da9fc]" />
                  <span>Open in Gmail Web to View / Send Code</span>
                  <ExternalLink className="w-3 h-3 text-[#9db0c8]" />
                </a>
              )}

              {otpResponse?.directWhatsappUrl && (
                <a
                  href={otpResponse.directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-xs text-emerald-300 flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Verify with WhatsApp (+91 8605042855)</span>
                  <ExternalLink className="w-3 h-3 text-[#9db0c8]" />
                </a>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full py-2.5 rounded-lg bg-[#3da9fc] hover:bg-[#59e3ff] disabled:opacity-50 text-[#070b14] font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#3da9fc]/20"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>Confirm &amp; Complete Verification</span>
              )}
            </button>

            {/* Resend & Cooldown */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#9db0c8]">
              <button
                type="button"
                onClick={() => setMode(pendingAction === 'signup' ? 'signup' : 'login')}
                className="hover:text-white"
              >
                Change {authMethod}
              </button>

              <button
                type="button"
                disabled={timerSeconds > 0 || isLoading}
                onClick={() => handleRequestOtp(otpTarget, authMethod, pendingAction)}
                className="text-[#59e3ff] hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {timerSeconds > 0 ? `Resend in ${timerSeconds}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE: FORGOT PASSWORD ================= */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">New Password (Min. 6 chars)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs transition flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
