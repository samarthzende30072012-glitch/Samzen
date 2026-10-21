import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { Award, Sparkles, CheckCircle2, Crown } from 'lucide-react';
import samarthOfficialPhoto from '../assets/images/samzen_founder_official.jpg';

interface DeveloperPortraitProps {
  className?: string;
}

export const DeveloperPortrait: React.FC<DeveloperPortraitProps> = ({
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Outer Cyan/Blue glow backdrop with breathing pulse */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] opacity-25 blur-xl group-hover:opacity-45 transition duration-500 animate-pulse-glow -z-10" />

      {/* Main Card Frame with smooth hover lift */}
      <div className="relative rounded-xl bg-[#0e1726] border border-[#1d2a3e] p-3 md:p-4 shadow-2xl shadow-black/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-[#3da9fc]/50">
        {/* Top bar with terminal/studio dots & Executive Badge */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d2a3e]/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-[#59e3ff] font-semibold text-[11px]">
            <Award className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span className="bg-[#3da9fc]/10 px-2 py-0.5 rounded border border-[#3da9fc]/30">Official Profile</span>
          </div>
        </div>

        {/* Photo Container - Clean rendering with fixed aspect ratio to eliminate layout shift */}
        <div className="relative rounded-lg overflow-hidden bg-[#070b14] border border-[#1d2a3e]/70 aspect-[4/5] min-h-[260px]">
          <img
            src={samarthOfficialPhoto}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = '/samzen_founder_official.jpg';
            }}
            alt="Samarth Zende - Founder & CEO — SAMZEN Web Development"
            className="w-full h-full object-cover object-top block rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* 100% Owner Golden King Badge directly over the photo */}
          <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg bg-[#070b14]/95 backdrop-blur-md border border-amber-400/80 text-amber-300 shadow-xl flex items-center gap-1.5 text-xs font-black tracking-wide">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/50 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            <span>100% Owner</span>
          </div>

          {/* Founder & CEO Pill on Photo */}
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-[#070b14]/90 backdrop-blur-md border border-[#3da9fc]/60 text-[#59e3ff] shadow text-[10px] font-bold">
            Founder &amp; CEO
          </div>

          <div className="absolute bottom-2 left-2 z-10 px-2.5 py-1 rounded-lg bg-[#070b14]/90 backdrop-blur-md border border-[#3da9fc]/60 text-white shadow-lg flex items-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#59e3ff]">Age: 14 Years Old</span>
          </div>
        </div>

        {/* Caption below photo */}
        <div className="mt-3 pt-2 border-t border-[#1d2a3e]/80 text-left">
          <div className="flex items-center justify-between mb-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400/40" />
              <span>100% Owner of Company</span>
            </div>
            <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Founder</span>
            </span>
          </div>
          <h3 className="text-lg font-bold font-heading text-white leading-snug flex items-center gap-1.5">
            <span>Mr. Samarth Zende</span>
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40 inline-block drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
          </h3>
          <p className="text-xs font-semibold text-[#59e3ff]">
            Founder and CEO &mdash; SAMZEN Web Development
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-[#3da9fc]/20 border border-[#3da9fc]/40 text-[#59e3ff] text-[11px] font-extrabold">
              Age: 14 Years Old
            </span>
            <span className="text-[#9db0c8] text-[11px] font-medium">&bull; Nashik, India</span>
          </div>
        </div>

        {/* Stats footer bar */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 pt-2 border-t border-[#1d2a3e]/60 text-center">
          <div className="bg-[#070b14]/70 rounded py-1.5 px-2 border border-[#1d2a3e]/50">
            <div className="text-[10px] text-[#9db0c8]">Founder Age</div>
            <div className="text-[11px] font-bold text-[#59e3ff]">14 Years Old</div>
          </div>
          <div className="bg-[#070b14]/70 rounded py-1.5 px-2 border border-[#1d2a3e]/50">
            <div className="text-[10px] text-[#9db0c8]">Location</div>
            <div className="text-[11px] font-semibold text-emerald-400">Nashik, India</div>
          </div>
        </div>
      </div>
    </div>
  );
};
