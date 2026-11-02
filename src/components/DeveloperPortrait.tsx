import React from 'react';
import samarthOfficialPhoto from '../assets/images/samzen_founder_official.jpg';
import { Crown, MapPin, CheckCircle2, Sparkles } from 'lucide-react';

interface DeveloperPortraitProps {
  className?: string;
}

export const DeveloperPortrait: React.FC<DeveloperPortraitProps> = ({
  className = ''
}) => {
  return (
    <div className={`relative flex flex-col items-center w-full max-w-[360px] sm:max-w-[400px] md:max-w-[440px] mx-auto animate-float-slow ${className}`}>
      {/* Radiant Glowing Ambient Aura Behind Founder Card */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#00f2fe]/30 via-[#3da9fc]/30 to-[#59e3ff]/30 rounded-3xl blur-2xl opacity-75 animate-pulse-glow -z-10 pointer-events-none" />

      {/* Premium Digital Card Format with Glowing Border Animation */}
      <div className="w-full relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0e1726] via-[#070b14] to-[#0e1726] border-2 border-[#3da9fc]/60 p-3.5 sm:p-5 shadow-[0_0_35px_rgba(61,169,252,0.3)] group transition-all duration-300 hover:border-[#00f2fe] hover:shadow-[0_0_50px_rgba(0,242,254,0.5)] animate-border-glow">
        {/* Large Prominent Upper-Body Photo Container */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#070b14] aspect-[4/5] min-h-[340px] sm:min-h-[400px] border border-[#3da9fc]/40">
          <img
            src={samarthOfficialPhoto}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = '/samzen_founder_official.jpg';
            }}
            alt="Mr. Samarth Zende — 100% Owner, Founder & CEO — SAMZEN Web Development — Nashik, Maharashtra, India"
            className="w-full h-full object-cover object-top block transition-transform duration-700 group-hover:scale-105 filter brightness-105 contrast-105"
            loading="eager"
            referrerPolicy="no-referrer"
          />

          {/* Visual Badge 1: 100% Owner (Top Left) with Shimmer */}
          <div className="absolute top-3 left-3 z-10 px-3.5 py-1.5 rounded-xl bg-[#070b14]/95 backdrop-blur-md border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-1.5 text-xs font-black tracking-wide animate-pulse">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/80 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span>100% Owner</span>
          </div>

          {/* Visual Badge 2: Founder & CEO (Top Right) */}
          <div className="absolute top-3 right-3 z-10 px-3.5 py-1.5 rounded-xl bg-[#070b14]/95 backdrop-blur-md border border-[#00f2fe]/70 text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.3)] text-xs font-bold tracking-wide">
            Founder &amp; CEO
          </div>

          {/* Visual Badge 3: Age: 14 Years Old (Bottom Left) */}
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-[#070b14]/95 backdrop-blur-md border border-[#3da9fc]/70 text-white shadow-xl flex items-center gap-2 text-xs font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[#59e3ff]">Age: 14 Years Old</span>
          </div>

          {/* Location Badge: Nashik, Maharashtra, India (Bottom Right) */}
          <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-[#070b14]/95 backdrop-blur-md border border-cyan-400/60 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 shadow-xl">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>Nashik, MH, India</span>
          </div>
        </div>

        {/* Clear Name, Title, and Little Intro Below Image Card */}
        <div className="mt-4 pt-3.5 border-t border-[#3da9fc]/30 text-center px-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#00f2fe] animate-spin" />
            <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white tracking-tight leading-snug drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              Mr. Samarth Zende
            </h2>
            <CheckCircle2 className="w-4 h-4 text-[#00f2fe]" />
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#00f2fe] mb-2 tracking-wide">
            Founder &amp; CEO &mdash; SAMZEN Web Development
          </p>

          <p className="text-xs text-[#eef3fa] leading-relaxed max-w-sm mx-auto font-medium">
            14-year-old full-stack developer &amp; 100% sole owner based in Nashik, Maharashtra, India. Architecting ultra-fast business websites and direct WhatsApp lead systems for businesses worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};
