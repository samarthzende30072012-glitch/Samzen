import React, { useState } from 'react';
import { SamzenLogo } from './SamzenLogo';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { User as UserType } from '../types';
import { User, LogIn, LogOut, Menu, X, ArrowUpRight, ShieldCheck, Wrench } from 'lucide-react';

interface NavbarProps {
  currentUser: UserType | null;
  onOpenAuth: (initialMode?: 'login' | 'signup') => void;
  onOpenAccount: () => void;
  onOpenServiceModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenAccount,
  onOpenServiceModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Founder & CEO', href: '#founder' },
    { label: 'About', href: '#about' },
    { label: 'Google Workspace', href: '#drive' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Work Process', href: '#process' },
    { label: 'Service Policy', href: '#policy' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b14]/90 backdrop-blur-md border-b border-[#1d2a3e] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element / wordmark logo */}
        <a href="#home" className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3da9fc] rounded-lg">
          <SamzenLogo size="md" showSubtitle={true} />
        </a>

        {/* Zone 2: 4-7 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#9db0c8]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-150 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions (Auth / User / Quick Contact) */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAccount}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1726] border border-[#3da9fc]/30 text-white text-xs font-semibold hover:border-[#3da9fc] transition shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
                <span className="text-[10px] text-[#59e3ff] uppercase px-1 rounded bg-[#3da9fc]/10">Portal</span>
              </button>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-[#9db0c8] hover:text-red-400 hover:bg-[#0e1726] transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#eef3fa] hover:text-[#59e3ff] transition whitespace-nowrap"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#070b14] bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] rounded-lg transition shadow-md shadow-[#3da9fc]/20 whitespace-nowrap"
              >
                <span>Sign Up</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <a
            href={SAMZEN_BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1d2a3e] bg-[#0b1220] hover:border-[#3da9fc]/60 text-[#59e3ff] text-xs font-medium transition"
          >
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {currentUser ? (
            <button
              onClick={onOpenAccount}
              className="p-1.5 rounded-lg bg-[#0e1726] border border-[#3da9fc]/30 text-[#59e3ff]"
            >
              <User className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs px-2.5 py-1 text-[#59e3ff] font-semibold"
            >
              Log In
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#0e1726] transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#1d2a3e] bg-[#070b14] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-[#9db0c8] pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-[#0e1726] hover:text-[#59e3ff] transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1d2a3e] flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#0e1726] border border-[#3da9fc] text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>My Account &amp; Support Requests</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 text-xs text-red-400 hover:bg-[#0e1726] rounded"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-[#0e1726] border border-[#1d2a3e] text-white"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-[#3da9fc] text-[#070b14]"
                >
                  Sign Up
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 text-center text-xs font-medium rounded bg-[#0b1220] border border-[#1d2a3e] text-[#59e3ff]"
              >
                WhatsApp Chat
              </a>
              <a
                href={SAMZEN_BRAND.gmailDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 text-center text-xs font-medium rounded bg-[#0b1220] border border-[#1d2a3e] text-[#eef3fa]"
              >
                Gmail Direct
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
