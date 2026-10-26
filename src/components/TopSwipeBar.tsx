import React, { useRef, useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';

interface TopSwipeBarProps {
  onOpenCreateWebsite?: () => void;
  onOpenWorkspaceAuth?: () => void;
  onOpenWorkPage?: () => void;
}

interface SwipeBarItem {
  id: string;
  label: string;
  subtext: string;
  icon: any;
  iconColor: string;
  badgeClass: string;
  targetId?: string;
  action?: 'create_website' | 'workspace' | 'work_hub';
  externalUrl?: string;
}

export const TopSwipeBar: React.FC<TopSwipeBarProps> = ({
  onOpenCreateWebsite,
  onOpenWorkspaceAuth,
  onOpenWorkPage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('14 Yrs Old');

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -260 : 260;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleTagClick = (tag: SwipeBarItem) => {
    setActiveTag(tag.label);
    if (tag.action === 'create_website' && onOpenCreateWebsite) {
      onOpenCreateWebsite();
      return;
    }
    if (tag.action === 'workspace' && onOpenWorkspaceAuth) {
      onOpenWorkspaceAuth();
      return;
    }
    if (tag.action === 'work_hub') {
      if (onOpenWorkPage) {
        onOpenWorkPage();
      } else {
        const el = document.getElementById('careers') || document.getElementById('work');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    if (tag.targetId) {
      const el = document.getElementById(tag.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (tag.externalUrl) {
      window.open(tag.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const items: SwipeBarItem[] = [
    {
      id: 'founder-tag',
      label: '14 Yrs Old',
      subtext: 'Founder & CEO',
      icon: Crown,
      iconColor: 'text-amber-400',
      badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      targetId: 'founder',
    },
    {
      id: 'trading-tag',
      label: 'Pro Trading',
      subtext: 'Featured Partner',
      icon: BarChart2,
      iconColor: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      targetId: 'partner',
    },
    {
      id: 'ai-engine-tag',
      label: 'AI Engine',
      subtext: 'Knowledge Base',
      icon: Bot,
      iconColor: 'text-purple-400',
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      targetId: 'ai-engine',
    },
    {
      id: 'contact-tag',
      label: 'Contact',
      subtext: 'Direct WhatsApp',
      icon: MessageSquare,
      iconColor: 'text-[#25D366]',
      badgeClass: 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30',
      targetId: 'contact',
    },
    {
      id: 'pricing-tag',
      label: 'Pricing Plans',
      subtext: 'From ₹799',
      icon: Tag,
      iconColor: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      targetId: 'pricing',
    },
    {
      id: 'sponsors-tag',
      label: 'Sponsor Ads',
      subtext: 'From ₹49/wk',
      icon: Megaphone,
      iconColor: 'text-[#59e3ff]',
      badgeClass: 'bg-[#59e3ff]/15 text-[#59e3ff] border-[#59e3ff]/30',
      targetId: 'sponsorship',
    },
    {
      id: 'valuation-tag',
      label: '₹1.15L Valuation',
      subtext: 'Ecosystem Net Worth',
      icon: TrendingUp,
      iconColor: 'text-[#3da9fc]',
      badgeClass: 'bg-[#3da9fc]/15 text-[#59e3ff] border-[#3da9fc]/40',
      targetId: 'valuation',
    },
    {
      id: 'create-website-tag',
      label: 'Make Your Website',
      subtext: 'Instant Calculator',
      icon: Sparkles,
      iconColor: 'text-cyan-400',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      action: 'create_website',
    },
    {
      id: 'work-tag',
      label: 'Join Us / Work With Us',
      subtext: 'Careers & 25% Share',
      icon: Briefcase,
      iconColor: 'text-amber-400',
      badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      action: 'work_hub',
    },
  ];

  return (
    <div className="sticky top-[64px] z-30 w-full bg-[#070b14]/95 backdrop-blur-md border-b border-[#1d2a3e]/80 py-2 select-none">
      <div className="w-full px-2 sm:px-4 relative flex items-center">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll options left"
            className="absolute left-1 z-20 p-1.5 rounded-full bg-[#0e1726]/90 border border-[#1d2a3e] text-[#9db0c8] hover:text-white hover:bg-[#152338] shadow-lg transition duration-200 cursor-pointer hidden sm:flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Horizontal Swiping Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-[10px] overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 sm:px-6 w-full"
          style={{
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            gap: '10px',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTag === item.label;

            return (
              <button
                key={item.id}
                onClick={() => handleTagClick(item)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 border ${
                  isActive
                    ? 'bg-[#0e1726] border-[#3da9fc] text-white shadow-md shadow-[#3da9fc]/15 ring-1 ring-[#3da9fc]/30'
                    : 'bg-[#0b1220] border-[#1d2a3e] text-[#9db0c8] hover:text-white hover:border-slate-700 hover:bg-[#0e1726]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.iconColor} flex-shrink-0 group-hover:scale-110 transition-transform`} />
                <span className="font-bold text-slate-100">{item.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${item.badgeClass}`}>
                  {item.subtext}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll options right"
            className="absolute right-1 z-20 p-1.5 rounded-full bg-[#0e1726]/90 border border-[#1d2a3e] text-[#9db0c8] hover:text-white hover:bg-[#152338] shadow-lg transition duration-200 cursor-pointer hidden sm:flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
