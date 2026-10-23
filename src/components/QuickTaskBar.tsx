import React from 'react';
import {
  TrendingUp,
  Tag,
  Crown,
  Megaphone,
  Briefcase,
  BarChart2,
  Bot,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  FileCheck2,
  DollarSign,
  Info
} from 'lucide-react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { WorkspaceMember } from '../types';
import { maskAccessCode } from '../utils/securityMask';

interface QuickTaskBarProps {
  currentWorkspaceMember: WorkspaceMember | null;
  onOpenWorkspaceAuth: () => void;
  onOpenAdmin: () => void;
  onOpenMembers: () => void;
  onOpenCreateWebsite?: () => void;
}

export const QuickTaskBar: React.FC<QuickTaskBarProps> = ({
  currentWorkspaceMember,
  onOpenWorkspaceAuth,
  onOpenAdmin,
  onOpenMembers,
  onOpenCreateWebsite,
}) => {
  // Key navigation cards arranged in exact requested order: Valuation -> About -> Make Your Website -> Join Us -> Earn With Us etc.
  // 4 items appear per row on screen (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4), with remaining items neatly stacked below.
  const taskOptions = [
    // 1. Valuation
    {
      id: 'task-valuation',
      title: 'Company Valuation',
      subtitle: '₹1,15,237 verified digital network appraisal & assets.',
      badge: '₹1,15,237 Value',
      badgeColor: 'bg-[#3da9fc]/20 text-[#59e3ff] border-[#3da9fc]/40',
      icon: TrendingUp,
      iconColor: 'text-[#3da9fc]',
      href: '#valuation',
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'View Valuation',
    },
    // 2. About
    {
      id: 'task-about',
      title: 'About SAMZEN',
      subtitle: 'Company ecosystem, 45+ portals, verified reserves & tech vision.',
      badge: 'Company Profile',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: Info,
      iconColor: 'text-emerald-400',
      href: '#about',
      borderColor: 'border-[#1d2a3e] hover:border-emerald-500/50',
      primaryActionLabel: 'Learn More',
    },
    // 3. Make Your Website (Create Website Builder)
    {
      id: 'task-make-website',
      title: 'Make Your Website',
      subtitle: 'Custom quotes, plan calculator & fast delivery in 3 to 10 days.',
      badge: 'Instant Builder',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: Sparkles,
      iconColor: 'text-cyan-400',
      actionType: 'create_site' as const,
      borderColor: 'border-[#1d2a3e] hover:border-cyan-400/50',
      primaryActionLabel: 'Build Website',
    },
    // 4. Join Us (Work With Us / Roles)
    {
      id: 'task-join-us',
      title: 'Join Us',
      subtitle: 'Apply for Co-Founder, Executive Head, Contractor, or Caller roles.',
      badge: 'Open Roles',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: Briefcase,
      iconColor: 'text-blue-400',
      href: '#careers',
      borderColor: 'border-[#1d2a3e] hover:border-blue-400/50',
      primaryActionLabel: 'View Positions',
    },
    // 5. Earn With Us (Affiliate & 25% Commission)
    {
      id: 'task-earn-with-us',
      title: 'Earn With Us',
      subtitle: 'Earn up to 25% project commissions bringing website clients.',
      badge: '25% Commission',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: DollarSign,
      iconColor: 'text-purple-400',
      href: '#careers',
      borderColor: 'border-[#1d2a3e] hover:border-purple-400/50',
      primaryActionLabel: 'Start Earning',
    },
    // 6. Team Portal (Access Code Login)
    {
      id: 'task-portal',
      title: currentWorkspaceMember ? 'Team Portal' : 'Team Portal',
      subtitle: currentWorkspaceMember
        ? `${currentWorkspaceMember.name} (${maskAccessCode(currentWorkspaceMember.code)})`
        : 'Role-based tools with 8-character access code.',
      badge: currentWorkspaceMember?.role === 'ceo' ? 'CEO Master' : (currentWorkspaceMember ? 'Active Session' : 'Protected'),
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
      icon: ShieldCheck,
      iconColor: 'text-amber-400',
      actionType: 'workspace' as const,
      borderColor: 'border-[#3da9fc] shadow-md shadow-[#3da9fc]/15',
      primaryActionLabel: currentWorkspaceMember
        ? (currentWorkspaceMember.role === 'ceo' || currentWorkspaceMember.role === 'cofounder' ? 'Open Suite' : 'Open Portal')
        : 'Enter Code',
    },
    // 7. Founder & CEO
    {
      id: 'task-founder',
      title: 'Founder & CEO',
      subtitle: 'Mr. Samarth Zende: 100% Owner & Full-Stack Architect.',
      badge: '100% Owner',
      badgeColor: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      icon: Crown,
      iconColor: 'text-amber-400',
      href: '#founder',
      borderColor: 'border-[#1d2a3e] hover:border-amber-400/50',
      primaryActionLabel: 'Meet Founder',
    },
    // 8. Pricing Plans
    {
      id: 'task-pricing',
      title: 'Pricing & Plans',
      subtitle: 'Web development packages starting from ₹799 to ₹5,000+.',
      badge: 'From ₹799',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: Tag,
      iconColor: 'text-emerald-400',
      href: '#pricing',
      borderColor: 'border-[#1d2a3e] hover:border-emerald-500/50',
      primaryActionLabel: 'Explore Plans',
    },
    // 9. Sponsor Ads
    {
      id: 'task-sponsors',
      title: 'Sponsor Ads',
      subtitle: 'Promote your brand across our 45+ network portals from ₹49.',
      badge: 'From ₹49/wk',
      badgeColor: 'bg-[#59e3ff]/15 text-[#59e3ff] border-[#59e3ff]/40',
      icon: Megaphone,
      iconColor: 'text-[#59e3ff]',
      href: '#sponsorship',
      borderColor: 'border-[#1d2a3e] hover:border-[#59e3ff]',
      primaryActionLabel: 'Book Slot',
    },
    // 10. Trading Partner
    {
      id: 'task-trading',
      title: 'Trading Partner',
      subtitle: 'Pro Trading Course: Technical setups & candlestick mastery.',
      badge: 'Partner',
      badgeColor: 'bg-[#3da9fc]/15 text-[#59e3ff] border-[#3da9fc]/30',
      icon: BarChart2,
      iconColor: 'text-[#59e3ff]',
      href: 'https://protradingcourse.ai.studio',
      isExternal: true,
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'Visit Partner',
    },
    // 11. AI Assistant
    {
      id: 'task-ai',
      title: 'AI Knowledge Engine',
      subtitle: 'Instant answers on packages, delivery times & custom builds.',
      badge: 'Interactive AI',
      badgeColor: 'bg-[#0e1726] text-[#9db0c8] border-[#1d2a3e]',
      icon: Bot,
      iconColor: 'text-[#3da9fc]',
      href: '#ai-engine',
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'Ask AI Engine',
    },
    // 12. WhatsApp Direct
    {
      id: 'task-contact',
      title: 'WhatsApp Direct',
      subtitle: 'Direct 1-tap WhatsApp consultation with Samarth Zende.',
      badge: 'Active & Quick',
      badgeColor: 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30',
      icon: MessageSquare,
      iconColor: 'text-[#25D366]',
      href: SAMZEN_BRAND.whatsappUrl,
      isExternal: true,
      borderColor: 'border-[#1d2a3e] hover:border-[#25D366]/50',
      primaryActionLabel: 'WhatsApp',
    },
  ];

  return (
    <section id="directory" className="w-full py-6 sm:py-8 border-b border-[#1d2a3e] bg-[#070b14] relative">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Section Header - Maximized Screen Real Estate, Clean & Direct */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#59e3ff] px-2.5 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#3da9fc]" />
              <span>Direct Services &amp; Option Cards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Company Hub &amp; Quick Directory
            </h2>
            <p className="text-xs sm:text-sm text-[#9db0c8] mt-1">
              Select an option below to explore network valuation, about, website builder, open roles, earning commissions, or enter the internal team portal.
            </p>
          </div>

          {onOpenCreateWebsite && (
            <button
              onClick={onOpenCreateWebsite}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/25 cursor-pointer flex-shrink-0 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#070b14]" />
              <span>Make Your Website</span>
            </button>
          )}
        </div>

        {/* 4 Items Per Row Grid Stack (Zero horizontal swiping, cleanly stacked below, rectangular cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {taskOptions.map((opt) => {
            const Icon = opt.icon;

            const handleCardClick = () => {
              if (opt.actionType === 'workspace') {
                if (currentWorkspaceMember) {
                  if (currentWorkspaceMember.role === 'ceo' || currentWorkspaceMember.role === 'cofounder') {
                    onOpenAdmin();
                  } else {
                    onOpenMembers();
                  }
                } else {
                  onOpenWorkspaceAuth();
                }
              } else if (opt.actionType === 'create_site' && onOpenCreateWebsite) {
                onOpenCreateWebsite();
              }
            };

            const CardInner = (
              <div
                className={`panel h-full w-full bg-[#0e1726] border-2 ${opt.borderColor} rounded-2xl p-3.5 sm:p-4 transition-all duration-200 hover:bg-[#111c2e] hover:shadow-lg flex flex-col justify-between gap-2.5 text-left group`}
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <div className={`p-2 rounded-xl bg-[#070b14] border border-[#1d2a3e] ${opt.iconColor} shadow-inner group-hover:scale-105 transition-transform flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border truncate max-w-[120px] ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#59e3ff] transition-colors leading-snug line-clamp-1">
                    {opt.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#9db0c8] mt-1 leading-relaxed line-clamp-2">
                    {opt.subtitle}
                  </p>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-2 border-t border-[#1d2a3e]/70 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#59e3ff] group-hover:text-white transition-colors">
                  <span className="truncate">{opt.primaryActionLabel}</span>
                  {opt.isExternal ? (
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 text-[#9db0c8] group-hover:text-[#59e3ff]" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-[#9db0c8] group-hover:translate-x-1 group-hover:text-[#59e3ff] transition-transform" />
                  )}
                </div>
              </div>
            );

            const handleSmoothGlide = (e: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
              if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.replace(/^#/, '');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                  targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  try {
                    window.history.pushState(null, '', `#${targetId}`);
                  } catch {
                    // ignore
                  }
                }
              }
            };

            if (opt.actionType === 'workspace' || opt.actionType === 'create_site') {
              return (
                <div
                  key={opt.id}
                  onClick={handleCardClick}
                  className="cursor-pointer focus:outline-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick();
                    }
                  }}
                >
                  {CardInner}
                </div>
              );
            }

            return (
              <a
                key={opt.id}
                href={opt.href}
                onClick={(e) => handleSmoothGlide(e, opt.href)}
                target={opt.isExternal ? '_blank' : undefined}
                rel={opt.isExternal ? 'noopener noreferrer' : undefined}
                className="block focus:outline-none"
              >
                {CardInner}
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
