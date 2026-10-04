import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';
import samarthOfficialPhoto from '../assets/images/samzen_founder_official.jpg';

interface DeveloperPortraitProps {
  className?: string;
}

export const DeveloperPortrait: React.FC<DeveloperPortraitProps> = ({
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Outer Cyan/Blue glow backdrop */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] opacity-25 blur-xl group-hover:opacity-35 transition duration-500" />

      {/* Main Card Frame */}
      <div className="relative rounded-xl bg-[#0e1726] border border-[#1d2a3e] p-3 md:p-4 shadow-2xl shadow-black/70">
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

        {/* Photo Container - Clean rendering of the exact original uploaded image asset */}
        <div className="relative rounded-lg overflow-hidden bg-[#070b14] border border-[#1d2a3e]/70">
          <img
            src={samarthOfficialPhoto}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = '/public/samzen_founder_official.jpg';
            }}
            alt="Samarth Zende - Founder & CEO — SAMZEN Web Development"
            className="w-full h-auto block rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Prominent Age Badge on the Photo */}
          <div className="absolute bottom-2 left-2 z-10 px-2.5 py-1 rounded-lg bg-[#070b14]/90 backdrop-blur-md border border-[#3da9fc]/60 text-white shadow-lg flex items-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#59e3ff]">Age: 14 Years Old</span>
          </div>
        </div>

        {/* Caption below photo */}
        <div className="mt-3 pt-2 border-t border-[#1d2a3e]/80 text-left">
          <div className="flex items-center justify-between mb-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#3da9fc]/10 border border-[#3da9fc]/30 text-[#59e3ff] text-[10px] font-semibold">
              <Sparkles className="w-2.5 h-2.5 text-[#3da9fc]" />
              <span>Executive Lead</span>
            </div>
            <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Founder</span>
            </span>
          </div>
          <h3 className="text-lg font-bold font-heading text-white leading-snug">
            Samarth Zende
          </h3>
          <p className="text-xs font-semibold text-[#59e3ff]">
            Founder &amp; CEO &mdash; SAMZEN Web Development
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
