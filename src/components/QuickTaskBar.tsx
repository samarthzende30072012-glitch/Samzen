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
  FileCheck2
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
  // Option cards arranged for clean display with exactly 4 items per row on screen (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
  const taskOptions = [
    {
      id: 'task-workspace',
      title: currentWorkspaceMember ? 'Team Portal' : 'Team Portal',
      subtitle: currentWorkspaceMember
        ? `${currentWorkspaceMember.name} (${maskAccessCode(currentWorkspaceMember.code)})`
        : 'Secure 8-character access code login.',
      badge: currentWorkspaceMember?.role === 'ceo' ? 'CEO Master' : (currentWorkspaceMember ? 'Active Session' : 'Protected'),
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
      icon: ShieldCheck,
      iconColor: 'text-amber-400',
      actionType: 'workspace' as const,
      borderColor: 'border-[#3da9fc] shadow-md shadow-[#3da9fc]/15',
      primaryActionLabel: currentWorkspaceMember
        ? (currentWorkspaceMember.role === 'ceo' || currentWorkspaceMember.role === 'cofounder' ? 'Open Admin' : 'Open Portal')
        : 'Enter Code',
    },
    {
      id: 'task-valuation',
      title: 'Company Valuation',
      subtitle: '₹1,15,237 verified digital network appraisal & assets.',
      badge: 'Official Appraisal',
      badgeColor: 'bg-[#3da9fc]/20 text-[#59e3ff] border-[#3da9fc]/40',
      icon: TrendingUp,
      iconColor: 'text-[#3da9fc]',
      href: '#valuation',
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'View Valuation',
    },
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
    {
      id: 'task-careers',
      title: 'Work With Us',
      subtitle: 'Earn 25% project commission as partner or sales affiliate.',
      badge: '25% Commission',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: Briefcase,
      iconColor: 'text-purple-400',
      href: '#careers',
      borderColor: 'border-[#1d2a3e] hover:border-purple-400/50',
      primaryActionLabel: 'Apply to Work',
    },
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
    {
      id: 'task-sponsors',
      title: 'Sponsor Ads',
      subtitle: 'Promote your brand across our 45+ network portals.',
      badge: 'From ₹49/wk',
      badgeColor: 'bg-[#59e3ff]/15 text-[#59e3ff] border-[#59e3ff]/40',
      icon: Megaphone,
      iconColor: 'text-[#59e3ff]',
      href: '#sponsorship',
      borderColor: 'border-[#1d2a3e] hover:border-[#59e3ff]',
      primaryActionLabel: 'Book Slot',
    },
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
    {
      id: 'task-ai',
      title: 'AI Assistant',
      subtitle: 'Instant answers on packages, delivery times & custom builds.',
      badge: 'Interactive AI',
      badgeColor: 'bg-[#0e1726] text-[#9db0c8] border-[#1d2a3e]',
      icon: Bot,
      iconColor: 'text-[#3da9fc]',
      href: '#ai-engine',
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'Ask AI Engine',
    },
    {
      id: 'task-contact',
      title: 'WhatsApp Chat',
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
    {
      id: 'task-create-site',
      title: 'Instant Website Builder',
      subtitle: 'Configure your custom site requirements & get instant quotes.',
      badge: 'Instant Quote',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: Sparkles,
      iconColor: 'text-cyan-400',
      actionType: 'create_site' as const,
      borderColor: 'border-[#1d2a3e] hover:border-cyan-400/50',
      primaryActionLabel: 'Start Builder',
    },
    {
      id: 'task-applications',
      title: 'Project Openings',
      subtitle: 'Open contracts, development projects, and collaboration gigs.',
      badge: 'Openings Live',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: FileCheck2,
      iconColor: 'text-blue-400',
      href: '#careers',
      borderColor: 'border-[#1d2a3e] hover:border-blue-400/50',
      primaryActionLabel: 'View Projects',
    },
    {
      id: 'task-network-reserves',
      title: 'Digital Reserves',
      subtitle: 'Audited directory of live brand assets and web properties.',
      badge: 'Audited Assets',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: Layers,
      iconColor: 'text-emerald-400',
      href: '#about',
      borderColor: 'border-[#1d2a3e] hover:border-emerald-400/50',
      primaryActionLabel: 'View Reserves',
    },
  ];

  return (
    <section id="directory" className="py-8 sm:py-10 border-b border-[#1d2a3e] bg-[#070b14]/95 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#59e3ff] px-2.5 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#3da9fc]" />
              <span>Direct Navigation &amp; Quick Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Company Services &amp; Option Cards
            </h2>
            <p className="text-xs sm:text-sm text-[#9db0c8] mt-1 max-w-2xl">
              Tap any option card below to explore valuation, pricing, partnership, open projects, or enter the internal team portal.
            </p>
          </div>

          {onOpenCreateWebsite && (
            <button
              onClick={onOpenCreateWebsite}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/25 cursor-pointer flex-shrink-0 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#070b14]" />
              <span>Create Your Website</span>
            </button>
          )}
        </div>

        {/* 4 items per row on screen layout (Grid Stack - Exactly 4 per row, remaining neatly stacked below, zero horizontal swiping) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
                className={`panel h-full w-full bg-[#0e1726] border-2 ${opt.borderColor} rounded-2xl p-4 sm:p-4.5 transition-all duration-200 hover:bg-[#111c2e] hover:shadow-lg flex flex-col justify-between gap-3 text-left group`}
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className={`p-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] ${opt.iconColor} shadow-inner group-hover:scale-105 transition-transform flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border truncate max-w-[130px] ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-sm font-bold text-white group-hover:text-[#59e3ff] transition-colors leading-snug line-clamp-1">
                    {opt.title}
                  </h3>
                  <p className="text-xs text-[#9db0c8] mt-1 leading-relaxed line-clamp-2">
                    {opt.subtitle}
                  </p>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-2 border-t border-[#1d2a3e]/70 flex items-center justify-between text-xs font-semibold text-[#59e3ff] group-hover:text-white transition-colors">
                  <span className="truncate">{opt.primaryActionLabel}</span>
                  {opt.isExternal ? (
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 text-[#9db0c8] group-hover:text-[#59e3ff]" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-[#9db0c8] group-hover:translate-x-1 group-hover:text-[#59e3ff] transition-transform" />
                  )}
                </div>
              </div>
            );

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
