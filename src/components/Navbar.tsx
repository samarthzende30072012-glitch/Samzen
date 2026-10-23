import React, { useState } from 'react';
import { SamzenLogo } from './SamzenLogo';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { User as UserType, WorkspaceMember } from '../types';
import { 
  LogOut, 
  Sparkles, 
  TrendingUp, 
  Tag, 
  Crown, 
  Shield, 
  MessageSquare, 
  Layers, 
  ArrowRight,
  Info,
  Briefcase,
  Wrench,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentUser: UserType | null;
  currentWorkspaceMember?: WorkspaceMember | null;
  onOpenAuth: (initialMode?: 'login' | 'signup') => void;
  onOpenWorkspaceAuth: () => void;
  onOpenWorkspacePage: () => void;
  onOpenAccount: () => void;
  onOpenServiceModal: () => void;
  onOpenCreateWebsite?: () => void;
  onLogout: () => void;
  onWorkspaceLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentWorkspaceMember,
  onOpenAuth,
  onOpenWorkspaceAuth,
  onOpenWorkspacePage,
  onOpenAccount,
  onOpenCreateWebsite,
  onLogout,
  onWorkspaceLogout,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCeo = currentWorkspaceMember?.role === 'ceo' || currentWorkspaceMember?.code === '30072012';

  // Smooth anchor navigation handler: effortlessly glides down to target section
  const handleSmoothGlide = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const cleanId = targetId.replace(/^#/, '');
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      try {
        window.history.pushState(null, '', `#${cleanId}`);
      } catch {
        // ignore history state issues
      }
    }
    setMobileMenuOpen(false);
  };

  // Main navigation items
  const navItems = [
    { label: 'About', href: '#about', icon: Info, badge: null },
    { label: 'Valuation', href: '#valuation', icon: TrendingUp, badge: '₹1.15L' },
    { label: 'Plans', href: '#pricing', icon: Tag, badge: 'From ₹799' },
    { label: 'Services', href: '#services', icon: Wrench, badge: null },
    { label: 'Join Us', href: '#careers', icon: Briefcase, badge: 'Earn' },
    { label: 'Contact', href: '#contact', icon: PhoneCall, badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b14]/95 backdrop-blur-md border-b border-[#1d2a3e] shadow-lg shadow-black/40">
      {/* Primary Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleSmoothGlide(e, '#home')}
          className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3da9fc] rounded-lg"
          aria-label="SAMZEN Home"
        >
          <SamzenLogo size="md" showSubtitle={true} />
        </a>

        {/* Center: Clean Smooth Section Links (Desktop & Tablet) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleSmoothGlide(e, item.href)}
                className="btn-interactive px-2.5 py-1.5 rounded-lg text-[#9db0c8] hover:text-[#59e3ff] hover:bg-[#0e1726] border border-transparent hover:border-[#3da9fc]/30 transition flex items-center gap-1.5"
              >
                <Icon className="w-3.5 h-3.5 text-[#3da9fc]" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#3da9fc]/15 text-[#59e3ff] font-medium border border-[#3da9fc]/30">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions (Workspace Portal, Auth, WhatsApp, Create Website, Mobile Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* SECURE 8-DIGIT WORKSPACE PORTAL BUTTON */}
          {currentWorkspaceMember ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenWorkspacePage}
                className={`btn-interactive inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md cursor-pointer ${
                  isCeo
                    ? 'bg-gradient-to-r from-amber-400/20 to-[#3da9fc]/20 border-amber-400 text-amber-300 shadow-amber-400/10'
                    : 'bg-[#0e1726] border-[#3da9fc] text-[#59e3ff] shadow-[#3da9fc]/10'
                }`}
              >
                {isCeo ? (
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-[#3da9fc]" />
                )}
                <span className="max-w-[75px] sm:max-w-[120px] truncate">
                  {currentWorkspaceMember.name.split(' ')[0]} ({isCeo ? 'Admin' : 'Member'})
                </span>
                <ArrowRight className="w-3 h-3 text-[#59e3ff] hidden sm:inline" />
              </button>
              {onWorkspaceLogout && (
                <button
                  onClick={onWorkspaceLogout}
                  title="Secure Exit Workspace (requires 8-digit verification)"
                  className="btn-interactive p-1.5 rounded-xl text-[#9db0c8] hover:text-rose-400 hover:bg-[#0e1726] border border-[#1d2a3e] hover:border-rose-500/40 cursor-pointer transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenWorkspaceAuth}
              className="btn-interactive inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-[#0e1726] hover:bg-[#15233a] border border-[#3da9fc]/60 hover:border-[#59e3ff] text-white text-xs font-bold shadow-sm cursor-pointer transition"
            >
              <Shield className="w-3.5 h-3.5 text-[#3da9fc]" />
              <span className="whitespace-nowrap">Team Portal</span>
              <span className="hidden md:inline text-[10px] text-[#59e3ff] font-mono bg-[#070b14] px-1 rounded border border-[#1d2a3e]">
                8-Digit
              </span>
            </button>
          )}

          {/* Language Selector */}
          <LanguageSelector variant="navbar" />

          {/* Client Account / Public Login */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAccount}
                className="btn-interactive inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#0e1726] border border-[#3da9fc]/40 text-white text-xs font-semibold hover:border-[#3da9fc] shadow-sm cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name}</span>
              </button>
              <button
                onClick={onLogout}
                title={t('nav.logout')}
                className="btn-interactive p-1.5 rounded-lg text-[#9db0c8] hover:text-red-400 hover:bg-[#0e1726] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-interactive hidden sm:inline-block px-2.5 py-1.5 text-xs font-semibold text-[#eef3fa] hover:text-[#59e3ff] rounded-lg hover:bg-[#0e1726] transition cursor-pointer"
            >
              {t('nav.login')}
            </button>
          )}

          {/* Direct WhatsApp Action */}
          <a
            href={SAMZEN_BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp Contact"
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-bold transition whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Primary Action Button: Create Your Website */}
          {onOpenCreateWebsite && (
            <button
              onClick={onOpenCreateWebsite}
              className="btn-shimmer-visible btn-glow-pulse btn-interactive inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/30 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#070b14]" />
              <span className="hidden sm:inline">Create Website</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-interactive lg:hidden p-2 rounded-xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#59e3ff] transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1d2a3e] bg-[#070b14]/98 backdrop-blur-xl px-4 py-4 shadow-2xl transition-all animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d2a3e]">
            <span className="text-xs uppercase font-bold tracking-wider text-[#59e3ff]">
              Quick Navigation
            </span>
            <span className="text-[11px] text-[#9db0c8]">
              Smooth Glide to Section
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleSmoothGlide(e, item.href)}
                  className="btn-interactive flex items-center justify-between p-2.5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] text-white text-xs font-semibold hover:text-[#59e3ff] transition"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#3da9fc]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#3da9fc]/20 text-[#59e3ff]">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Quick Actions in Mobile Drawer */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#1d2a3e]">
            {/* WhatsApp Contact */}
            <a
              href={SAMZEN_BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-bold text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Directly on WhatsApp (+91 86050 42855)</span>
            </a>

            {/* Client Login button if not logged in */}
            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] text-center text-xs font-semibold text-white hover:border-[#3da9fc]"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
