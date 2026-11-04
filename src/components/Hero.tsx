import React from 'react';
import { DeveloperPortrait } from './DeveloperPortrait';
import { InteractiveCyberAnimation } from './InteractiveCyberAnimation';
import { MessageSquare, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';

interface HeroProps {
  onExplorePlans: () => void;
  onOpenCreateWebsite?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePlans, onOpenCreateWebsite }) => {
  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[#1d2a3e] bg-[#070b14] overflow-hidden">
      {/* 1. Dynamic "Video-Type" High-Tech Background Animation & HTML5 Video */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* HTML5 Background Video Element */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity filter contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-numbers-31950-large.mp4" type="video/mp4" />
        </video>

        {/* Animated Cyber Particles / Node Canvas */}
        <InteractiveCyberAnimation />

        {/* Precision Technical Grid Lines Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d2a3e20_1px,transparent_1px),linear-gradient(to_bottom,#1d2a3e20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70" />

        {/* Sophisticated Dark Gradient Overlays for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/90 via-[#070b14]/80 to-[#070b14]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-gradient-to-b from-[#3da9fc]/15 via-[#59e3ff]/5 to-transparent blur-3xl -z-10" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* 1. Large, Prominent Upper-Body Founder Digital Card with Badges & Title */}
        <div className="mb-8 flex justify-center">
          <DeveloperPortrait />
        </div>

        {/* 2. Massive, High-Converting Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.1] mb-6">
          Launch Your High-Speed <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-[#3da9fc] bg-clip-text text-transparent">
            Business Website in 48 Hours.
          </span>
        </h1>

        {/* 3. Client-Focused Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-[#9db0c8] mb-8 max-w-2xl mx-auto leading-relaxed">
          High-performance, mobile-optimized websites built for local businesses, coaching academies, salons, clinics, and shops. Handcrafted code, direct WhatsApp order routing, and peace of mind with continuous AMC support.
        </p>

        {/* 4. Trust Badges / Quick Proof Points */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[#9db0c8] mb-10">
          <span className="flex items-center gap-1.5 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#3da9fc]" /> 48-Hour Rapid Delivery
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#3da9fc]" /> Fixed Rates from ₹2,499 (Save up to 60% OFF)
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#3da9fc]" /> Free AMC Continuity
          </span>
        </div>

        {/* 5. Direct CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onExplorePlans}
            className="btn-interactive btn-shimmer-visible w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-bold text-sm shadow-xl shadow-[#3da9fc]/20 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Pricing &amp; Plans</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          {onOpenCreateWebsite && (
            <button
              onClick={onOpenCreateWebsite}
              className="btn-interactive w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0e1726]/95 hover:bg-[#152338] border border-[#1d2a3e] hover:border-[#3da9fc]/60 text-white font-semibold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-[#59e3ff]" />
              <span>Create Your Website</span>
            </button>
          )}

          <a
            href={SAMZEN_BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
