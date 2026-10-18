import React from 'react';
import { SamzenLogo } from './SamzenLogo';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { User as UserType } from '../types';
import { 
  User, 
  LogOut, 
  Sparkles, 
  TrendingUp, 
  Tag, 
  Crown, 
  Megaphone, 
  Briefcase, 
  BarChart2, 
  Bot, 
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentUser: UserType | null;
  onOpenAuth: (initialMode?: 'login' | 'signup') => void;
  onOpenAccount: () => void;
  onOpenServiceModal: () => void;
  onOpenCreateWebsite?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenAccount,
  onOpenCreateWebsite,
  onLogout,
}) => {
  const { t } = useLanguage();

  // Direct front-page navigation buttons (child-friendly, instant 1-tap jump)
  const directNavButtons = [
    {
      id: 'nav-val',
      label: 'Valuation: ₹1,15,237',
      shortLabel: '₹1.15L Valuation',
      href: '#valuation',
      icon: TrendingUp,
      accent: 'border-[#3da9fc] text-[#59e3ff] bg-[#3da9fc]/10',
      isExternal: false,
    },
    {
      id: 'nav-price',
      label: 'Website Plans (₹799+)',
      shortLabel: 'Pricing Plans',
      href: '#pricing',
      icon: Tag,
      accent: 'border-[#1d2a3e] text-[#eef3fa] hover:border-[#3da9fc]',
      isExternal: false,
    },
    {
      id: 'nav-founder',
      label: 'Founder & CEO',
      shortLabel: 'Samarth Zende',
      href: '#founder',
      icon: Crown,
      accent: 'border-[#1d2a3e] text-[#eef3fa] hover:border-[#3da9fc]',
      isExternal: false,
    },
    {
      id: 'nav-sponsors',
      label: 'Sponsor Ads (From ₹49)',
      shortLabel: 'Sponsor Ads',
      href: '#sponsorship',
      icon: Megaphone,
      accent: 'border-[#59e3ff]/40 text-[#59e3ff] hover:border-[#59e3ff]',
      isExternal: false,
    },
    {
      id: 'nav-careers',
      label: 'Work With Us (25%)',
      shortLabel: 'Earn With Us',
      href: '#careers',
      icon: Briefcase,
      accent: 'border-[#1d2a3e] text-[#eef3fa] hover:border-[#3da9fc]',
      isExternal: false,
    },
    {
      id: 'nav-trading',
      label: 'Pro Trading Course',
      shortLabel: 'Pro Trading',
      href: 'https://protradingcourse.ai.studio',
      icon: BarChart2,
      accent: 'border-[#3da9fc]/40 text-[#59e3ff] hover:border-[#59e3ff]',
      isExternal: true,
    },
    {
      id: 'nav-ai',
      label: 'AI Assistant',
      shortLabel: 'AI Engine',
      href: '#ai-engine',
      icon: Bot,
      accent: 'border-[#1d2a3e] text-[#eef3fa] hover:border-[#3da9fc]',
      isExternal: false,
    },
    {
      id: 'nav-contact',
      label: 'Contact & WhatsApp',
      shortLabel: 'Contact',
      href: '#contact',
      icon: MessageSquare,
      accent: 'border-[#1d2a3e] text-[#eef3fa] hover:border-[#25D366]',
      isExternal: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b14]/95 backdrop-blur-md border-b border-[#1d2a3e] shadow-lg shadow-black/40">
      
      {/* ROW 1: Brand Wordmark, Actions & Direct Portal Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo & Wordmark */}
        <a 
          href="#home" 
          className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3da9fc] rounded-lg"
          aria-label="SAMZEN Home"
        >
          <SamzenLogo size="md" showSubtitle={true} />
        </a>

        {/* Right: Actions (Language, Auth / Portal, Create Website CTA) - NO HAMBURGER */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector */}
          <LanguageSelector variant="navbar" />

          {/* User Account / Login */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAccount}
                className="btn-interactive inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1726] border border-[#3da9fc]/40 text-white text-xs font-semibold hover:border-[#3da9fc] shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[90px] sm:max-w-[120px] truncate">{currentUser.name}</span>
              </button>
              <button
                onClick={onLogout}
                title={t('nav.logout')}
                className="btn-interactive p-1.5 rounded-lg text-[#9db0c8] hover:text-red-400 hover:bg-[#0e1726]"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-interactive px-2.5 py-1.5 text-xs font-semibold text-[#eef3fa] hover:text-[#59e3ff] rounded-lg hover:bg-[#0e1726] transition"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn-interactive hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#eef3fa] hover:text-white bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] rounded-lg shadow-sm"
              >
                <span>{t('nav.signup')}</span>
              </button>
            </div>
          )}

          {/* Direct WhatsApp Action */}
          <a
            href={SAMZEN_BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-bold transition whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Primary Action Button: Create Your Website */}
          {onOpenCreateWebsite && (
            <button
              onClick={onOpenCreateWebsite}
              className="btn-shimmer-visible btn-glow-pulse btn-interactive inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/30 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Website</span>
            </button>
          )}

        </div>

      </div>

      {/* ROW 2: DIRECT FRONT-PAGE TOP NAVIGATION / BUTTON BAR (UNHIDDEN, NO HAMBURGER) */}
      <nav 
        aria-label="Direct Top Navigation"
        className="border-t border-[#1d2a3e] bg-[#0b1220]/90 px-2 sm:px-4 py-2 w-full overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {directNavButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <a
                key={btn.id}
                href={btn.href}
                target={btn.isExternal ? '_blank' : undefined}
                rel={btn.isExternal ? 'noopener noreferrer' : undefined}
                className={`btn-interactive flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  btn.accent
                } bg-[#0e1726] shadow-sm`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap sm:hidden">{btn.shortLabel}</span>
                <span className="whitespace-nowrap hidden sm:inline">{btn.label}</span>
                {btn.isExternal && <ArrowUpRight className="w-3 h-3 text-[#59e3ff] flex-shrink-0" />}
              </a>
            );
          })}
        </div>
      </nav>

    </header>
  );
};
