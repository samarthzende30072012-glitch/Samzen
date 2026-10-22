import React from 'react';
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
  ArrowRight
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
  const isCeo = currentWorkspaceMember?.role === 'ceo' || currentWorkspaceMember?.code === '30072012';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b14]/95 backdrop-blur-md border-b border-[#1d2a3e] shadow-lg shadow-black/40">
      {/* Primary Brand & Navigation Bar (Single, smooth header - NO horizontal side-swiping) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <a 
          href="#home" 
          className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3da9fc] rounded-lg"
          aria-label="SAMZEN Home"
        >
          <SamzenLogo size="md" showSubtitle={true} />
        </a>

        {/* Center: Clean Smooth Section Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          <a
            href="#valuation"
            className="btn-interactive px-3 py-1.5 rounded-lg text-[#59e3ff] hover:text-white hover:bg-[#0e1726] border border-transparent hover:border-[#3da9fc]/30 transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Valuation (₹1.15L)</span>
          </a>

          <a
            href="#pricing"
            className="btn-interactive px-3 py-1.5 rounded-lg text-[#9db0c8] hover:text-[#59e3ff] hover:bg-[#0e1726] border border-transparent hover:border-[#3da9fc]/30 transition flex items-center gap-1.5"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Website Plans</span>
          </a>

          <a
            href="#directory"
            className="btn-interactive px-3 py-1.5 rounded-lg text-[#9db0c8] hover:text-[#59e3ff] hover:bg-[#0e1726] border border-transparent hover:border-[#3da9fc]/30 transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Task Directory</span>
          </a>
        </div>

        {/* Right: Actions (Workspace Portal, Auth, WhatsApp, Create Website) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SECURE 8-DIGIT WORKSPACE PORTAL BUTTON */}
          {currentWorkspaceMember ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenWorkspacePage}
                className={`btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md cursor-pointer ${
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
                <span className="max-w-[80px] sm:max-w-[130px] truncate">
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
              className="btn-interactive inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0e1726] hover:bg-[#15233a] border border-[#3da9fc]/60 hover:border-[#59e3ff] text-white text-xs font-bold shadow-sm cursor-pointer transition"
            >
              <Shield className="w-3.5 h-3.5 text-[#3da9fc]" />
              <span className="whitespace-nowrap">Team Portal</span>
              <span className="hidden sm:inline text-[10px] text-[#59e3ff] font-mono bg-[#070b14] px-1 rounded border border-[#1d2a3e]">
                8-Digit
              </span>
            </button>
          )}

          {/* Language Selector */}
          <LanguageSelector variant="navbar" />

          {/* Client Account / Public Login */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAccount}
                className="btn-interactive inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1726] border border-[#3da9fc]/40 text-white text-xs font-semibold hover:border-[#3da9fc] shadow-sm cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[80px] sm:max-w-[110px] truncate">{currentUser.name}</span>
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
            <div className="flex items-center gap-1">
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-interactive px-2.5 py-1.5 text-xs font-semibold text-[#eef3fa] hover:text-[#59e3ff] rounded-lg hover:bg-[#0e1726] transition cursor-pointer"
              >
                {t('nav.login')}
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
    </header>
  );
};
