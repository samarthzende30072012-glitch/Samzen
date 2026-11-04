import React, { useState, useEffect } from 'react';
import { SamzenLogo } from './SamzenLogo';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { User as UserType, WorkspaceMember } from '../types';
import { 
  LogOut, 
  Sparkles, 
  Tag, 
  Crown, 
  Shield, 
  Layout,
  ArrowRight,
  PhoneCall,
  Menu,
  X,
  Sun,
  Moon,
  Calculator,
  Globe,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
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
  onOpenWorkPage?: () => void;
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
  onOpenWorkPage,
  onLogout,
  onWorkspaceLogout,
}) => {
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const isCeo = currentWorkspaceMember?.role === 'ceo' || currentWorkspaceMember?.code === '30072012';

  // Smooth Scroll-Spy tracking active section as user scrolls
  useEffect(() => {
    const sectionIds = ['home', 'pricing', 'calculator', 'portfolio', 'services', 'careers', 'contact'];
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 140;

      // Check if near bottom of page -> set to 'contact'
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
        setActiveSection('contact');
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - offset;
          if (scrollY >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth anchor navigation handler: effortlessly glides down to target section
  const handleSmoothGlide = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const cleanId = targetId.replace(/^#/, '');
    setActiveSection(cleanId);
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

  interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }

  // Main navigation items for Scroll-Spy
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '#home', icon: Sparkles },
    { id: 'pricing', label: 'Pricing', href: '#pricing', icon: Tag },
    { id: 'calculator', label: 'Calculator', href: '#calculator', icon: Calculator },
    { id: 'portfolio', label: 'Showcase', href: '#portfolio', icon: Globe },
    { id: 'services', label: '16 Industries', href: '#services', icon: Layout },
    { id: 'careers', label: 'Work With Us', href: '#careers', icon: Briefcase },
    { id: 'contact', label: 'Contact', href: '#contact', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-[#070b14]/90 backdrop-blur-xl border-b border-[#1d2a3e] shadow-xl shadow-black/50">
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

        {/* Center: Scroll-Spy Smooth Section Links (Desktop & Tablet) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleSmoothGlide(e, item.href)}
                className={`px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00f2fe]/20 via-[#3da9fc]/20 to-[#59e3ff]/20 text-[#00f2fe] border border-[#00f2fe]/60 shadow-[0_0_15px_rgba(0,242,254,0.35)] font-extrabold'
                    : 'text-[#9db0c8] hover:text-[#00f2fe] hover:bg-[#0e1726]/80 border border-transparent hover:border-[#3da9fc]/40 font-semibold'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00f2fe] animate-pulse' : 'text-[#3da9fc]'}`} />
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

        {/* Right: Actions (Workspace Portal, Auth, Theme Toggle, Create Website, Mobile Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* SECURE 8-DIGIT WORKSPACE PORTAL BUTTON */}
          {currentWorkspaceMember ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenWorkspacePage}
                className={`btn-interactive inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md cursor-pointer ${
                  isCeo
                    ? 'bg-gradient-to-r from-amber-400/20 to-amber-500/10 border-amber-400/60 text-amber-300 shadow-amber-400/10'
                    : 'bg-[#0e1726] border-slate-700 text-[#59e3ff] hover:border-slate-600'
                }`}
              >
                {isCeo ? (
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
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
              className="btn-interactive inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-[#0e1726] hover:bg-[#15233a] border border-slate-700 hover:border-slate-600 text-white text-xs font-bold shadow-sm cursor-pointer transition"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">Team Portal</span>
              <span className="hidden md:inline text-[10px] text-slate-300 font-mono bg-[#070b14] px-1 rounded border border-[#1d2a3e]">
                8-Digit
              </span>
            </button>
          )}

          {/* Language Selector */}
          <LanguageSelector variant="navbar" />

          {/* Dark/Light Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to bright colorful light mode' : 'Switch to vibrant neon dark mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="btn-interactive p-2 rounded-xl bg-[#0e1726]/80 hover:bg-[#152338] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#59e3ff] transition shadow-sm flex items-center justify-center cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>

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

          {/* Quick Direct Hotline Button */}
          <a
            href={SAMZEN_BRAND.callUrl}
            title="Direct Call & WhatsApp: +91 8605042855"
            className="btn-interactive hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e1726] border border-cyan-400/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono">8605042855</span>
          </a>

          {/* Primary Action Button: Create Your Website */}
          {onOpenCreateWebsite && (
            <button
              onClick={onOpenCreateWebsite}
              className="btn-shimmer-visible btn-glow-pulse btn-interactive inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00f2fe] via-[#3da9fc] to-[#59e3ff] text-[#070b14] font-extrabold text-xs shadow-lg shadow-[#00f2fe]/20 whitespace-nowrap cursor-pointer"
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
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleSmoothGlide(e, item.href)}
                  className={`btn-interactive flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#00f2fe]/15 border-[#00f2fe]/60 text-[#00f2fe] font-extrabold'
                      : 'bg-[#0e1726] border-[#1d2a3e] text-white hover:text-[#59e3ff]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00f2fe]' : 'text-[#3da9fc]'}`} />
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
            {/* Quick Direct Hotline & WhatsApp for mobile */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={SAMZEN_BRAND.callUrl}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 8605042855</span>
              </a>

              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#25D366] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>WhatsApp</span>
              </a>
            </div>

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
