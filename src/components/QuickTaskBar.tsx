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
  Sparkles
} from 'lucide-react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { WorkspaceMember } from '../types';

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
  // Navigation items organized into a vertical stack
  const taskOptions = [
    {
      id: 'task-workspace',
      title: currentWorkspaceMember
        ? `Team Workspace (${currentWorkspaceMember.name})`
        : 'Internal Team Workspace & Project Board',
      subtitle: currentWorkspaceMember
        ? `Role: ${currentWorkspaceMember.position} • 8-Digit Code Active`
        : 'Log in with your 8-digit access code (CEO Master: 30072012)',
      badge: currentWorkspaceMember?.role === 'ceo' ? 'CEO Master Access' : 'Secure 8-Digit Portal',
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
      icon: ShieldCheck,
      iconColor: 'text-amber-400',
      actionType: 'workspace',
      borderColor: 'border-[#3da9fc] shadow-lg shadow-[#3da9fc]/15',
      primaryActionLabel: currentWorkspaceMember
        ? (currentWorkspaceMember.role === 'ceo' || currentWorkspaceMember.role === 'cofounder' ? 'Open Admin Page' : 'Open Members Portal')
        : 'Enter 8-Digit Code',
    },
    {
      id: 'task-valuation',
      title: 'Company Network Valuation: ₹1,15,237',
      subtitle: 'Verified appraisal covering 45+ portals, brand equity, proprietary digital assets & pipelines.',
      badge: 'Official Appraisal',
      badgeColor: 'bg-[#3da9fc]/20 text-[#59e3ff] border-[#3da9fc]/40',
      icon: TrendingUp,
      iconColor: 'text-[#3da9fc]',
      href: '#valuation',
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'View Breakdown',
    },
    {
      id: 'task-founder',
      title: 'Founder & CEO: Mr. Samarth Zende',
      subtitle: '100% Owner of Company, Lead Full-Stack Architect & Founder.',
      badge: '100% Owner & Founder',
      badgeColor: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
      icon: Crown,
      iconColor: 'text-amber-400',
      href: '#founder',
      borderColor: 'border-[#1d2a3e] hover:border-amber-400/50',
      primaryActionLabel: 'Meet Founder',
    },
    {
      id: 'task-pricing',
      title: 'Website Pricing & Custom Development Plans',
      subtitle: 'From ₹799 up to ₹5,000+. Includes 7 to 21 days free post-delivery support.',
      badge: 'From ₹799',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: Tag,
      iconColor: 'text-emerald-400',
      href: '#pricing',
      borderColor: 'border-[#1d2a3e] hover:border-emerald-500/50',
      primaryActionLabel: 'Explore Plans',
    },
    {
      id: 'task-sponsors',
      title: 'Sponsorship & Ad Booking Portal',
      subtitle: 'Weekly ₹49, Monthly ₹149, Yearly ₹499, Lifetime ₹799. Verified backlink and brand reach.',
      badge: 'Slots Open (From ₹49)',
      badgeColor: 'bg-[#59e3ff]/15 text-[#59e3ff] border-[#59e3ff]/40',
      icon: Megaphone,
      iconColor: 'text-[#59e3ff]',
      href: '#sponsorship',
      borderColor: 'border-[#1d2a3e] hover:border-[#59e3ff]',
      primaryActionLabel: 'Book Ad Slot',
    },
    {
      id: 'task-careers',
      title: 'Work With Us (Earn 25% Project Commission)',
      subtitle: 'Join as Web Sales Affiliate, Frontend Helper, or Social Marketer with fast payouts.',
      badge: '25% Commission',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      icon: Briefcase,
      iconColor: 'text-purple-400',
      href: '#careers',
      borderColor: 'border-[#1d2a3e] hover:border-purple-400/50',
      primaryActionLabel: 'Apply to Work',
    },
    {
      id: 'task-trading',
      title: 'Pro Trading Course Partner',
      subtitle: 'Official strategic partner: Technical analysis, candlestick setups, and market mastery.',
      badge: 'Partner',
      badgeColor: 'bg-[#3da9fc]/10 text-[#59e3ff] border-[#3da9fc]/30',
      icon: BarChart2,
      iconColor: 'text-[#59e3ff]',
      href: 'https://protradingcourse.ai.studio',
      isExternal: true,
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'Visit Course',
    },
    {
      id: 'task-ai',
      title: 'AI Knowledge Engine & Assistant',
      subtitle: 'Get answers regarding our web development packages, pricing, timelines, and services.',
      badge: 'Interactive AI',
      badgeColor: 'bg-[#070b14] text-[#9db0c8] border-[#1d2a3e]',
      icon: Bot,
      iconColor: 'text-[#3da9fc]',
      href: '#ai-engine',
      borderColor: 'border-[#1d2a3e] hover:border-[#3da9fc]',
      primaryActionLabel: 'Ask AI Engine',
    },
    {
      id: 'task-contact',
      title: 'Direct WhatsApp & Contact Portal',
      subtitle: '1-tap WhatsApp consultation with Samarth Zende (+91 8605042855) or direct Gmail.',
      badge: 'Active & Responsive',
      badgeColor: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30',
      icon: MessageSquare,
      iconColor: 'text-[#25D366]',
      href: SAMZEN_BRAND.whatsappUrl,
      isExternal: true,
      borderColor: 'border-[#1d2a3e] hover:border-[#25D366]/50',
      primaryActionLabel: 'WhatsApp Chat',
    },
  ];

  return (
    <section id="directory" className="py-10 border-b border-[#1d2a3e] bg-[#070b14]/90 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#59e3ff] px-2.5 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#3da9fc]" />
              <span>Direct Vertical Navigation Stack</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Task Bar &amp; Direct Services Directory
            </h2>
            <p className="text-xs sm:text-sm text-[#9db0c8] mt-1">
              Scroll down smoothly through all company sections, pricing, tools, and the secure internal team workspace.
            </p>
          </div>

          {onOpenCreateWebsite && (
            <button
              onClick={onOpenCreateWebsite}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/25 cursor-pointer flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#070b14]" />
              <span>Create Your Website</span>
            </button>
          )}
        </div>

        {/* Clean, Smooth Vertical Stack (One below another - Zero horizontal swiping) */}
        <div className="space-y-3">
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
              }
            };

            const CardContent = (
              <div
                className={`panel w-full bg-[#0e1726] border-2 ${opt.borderColor} rounded-xl p-4 sm:p-5 transition-all duration-200 hover:bg-[#111c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left group`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`p-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] ${opt.iconColor} flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#59e3ff] transition-colors">
                        {opt.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#9db0c8] leading-relaxed">
                      {opt.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <span className="btn-interactive inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#070b14] group-hover:bg-[#3da9fc] border border-[#1d2a3e] group-hover:border-[#3da9fc] text-xs font-semibold text-[#59e3ff] group-hover:text-[#070b14] transition-all">
                    <span>{opt.primaryActionLabel}</span>
                    {opt.isExternal ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </span>
                </div>
              </div>
            );

            if (opt.actionType === 'workspace') {
              return (
                <div key={opt.id} onClick={handleCardClick} className="cursor-pointer">
                  {CardContent}
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
                {CardContent}
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
