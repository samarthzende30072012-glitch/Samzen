import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { DeveloperPortrait } from './DeveloperPortrait';
import { InteractiveCyberAnimation } from './InteractiveCyberAnimation';
import { MessageSquare, Mail, Layers, Check, Sparkles, TrendingUp, Megaphone, ArrowUpRight, Crown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onExplorePlans: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenCreateWebsite?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePlans, onOpenCreateWebsite }) => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#1d2a3e] overflow-hidden">
      {/* Interactive Cyber Particle Constellation (automatically paused/removed when touching screen) */}
      <InteractiveCyberAnimation />

      {/* Background ambient lighting with pulsing glow and drift */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#3da9fc]/15 via-[#59e3ff]/10 to-transparent blur-3xl -z-10 pointer-events-none animate-pulse-glow" />
      <div className="absolute top-24 right-12 w-[320px] h-[320px] bg-[#3da9fc]/10 rounded-full blur-3xl -z-10 pointer-events-none animate-float-slow" />
      <div className="absolute top-36 left-12 w-[280px] h-[280px] bg-[#59e3ff]/10 rounded-full blur-3xl -z-10 pointer-events-none animate-float-gentle" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Brand Kicker */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc]/50 transition duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3da9fc] animate-ping" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight max-w-4xl mx-auto leading-[1.18] [text-wrap:balance]">
            {t('hero.headlineLine1')} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-white bg-clip-text text-transparent">
              {t('hero.headlineLine2')}
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtext')}
          </p>
        </div>

        {/* Compact, Professional Profile Card Greeting Visitors (First Impression) */}
        <div className="mt-8 mb-6 bg-gradient-to-br from-[#0b1220] via-[#0e1726] to-[#070b14] p-5 sm:p-7 rounded-2xl border-2 border-[#3da9fc]/60 shadow-2xl shadow-[#3da9fc]/10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Column: Concise Introductory Portrait Card */}
            <div className="md:col-span-5 lg:col-span-4 max-w-xs mx-auto w-full">
              <DeveloperPortrait />
            </div>

            {/* Right Column: Punchy Welcome Statement & Actions */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center text-left">
              <div className="inline-block border-l-2 border-[#3da9fc] pl-4 sm:pl-5 my-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-amber-400 fill-amber-400/30" />
                  <span className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {t('founder.name')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-[#3da9fc]/20 text-amber-300 text-xs font-bold border border-amber-400/40 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                    <span>100% Owner &bull; {t('hero.founderBadge')}</span>
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#59e3ff] mb-0.5">
                  {t('hero.founderRole')}
                </div>
                <div className="text-xs text-[#9db0c8] mb-2">
                  {t('hero.founderBio')}
                </div>
                <p className="text-xs sm:text-sm text-[#eef3fa] leading-relaxed italic">
                  {t('founder.quote')}
                </p>
              </div>

              {/* Core guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4 text-xs text-[#9db0c8]">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>7 to 21 {t('pricing.daysFreeSupport')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Fast, Mobile-Friendly Responsive Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>WhatsApp &amp; 1-Tap Calling Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Secure Customer Account &amp; OTP Portal</span>
                </div>
              </div>

              {/* Action Buttons: Create Website, WhatsApp, Gmail, Explore Plans */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                {onOpenCreateWebsite && (
                  <button
                    onClick={onOpenCreateWebsite}
                    className="btn-shimmer-visible btn-glow-pulse btn-interactive relative group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-bold text-xs sm:text-sm shadow-xl shadow-[#3da9fc]/30 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#070b14] group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Create Your Website</span>
                  </button>
                )}

                <a
                  href={SAMZEN_BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive btn-ripple-ring inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs sm:text-sm shadow-lg shadow-[#25D366]/25"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('hero.ctaWhatsapp')}</span>
                </a>

                <a
                  href={SAMZEN_BRAND.gmailDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#1d2a3e] hover:border-[#3da9fc] text-white font-medium text-xs sm:text-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-[#59e3ff]" />
                  <span>{t('hero.ctaEmail')}</span>
                </a>

                <button
                  onClick={onExplorePlans}
                  className="btn-interactive inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-transparent hover:bg-[#0e1726] border border-transparent hover:border-[#3da9fc]/40 text-[#9db0c8] hover:text-[#59e3ff] font-medium text-xs sm:text-sm"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('hero.ctaPlans')} (From ₹799)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TOP-TIER VISIBILITY: Immediate Network Valuation & Sponsorship Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          
          {/* Card 1: SAMZEN Network Valuation (Front & Center) */}
          <div className="panel bg-[#0e1726]/90 border-2 border-[#3da9fc] rounded-2xl p-5 sm:p-6 shadow-xl shadow-[#3da9fc]/15 relative overflow-hidden group hover:border-[#59e3ff] transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#3da9fc]/10 rounded-full blur-2xl pointer-events-none -z-0" />
            
            <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3da9fc]/20 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/40">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Company Network Valuation</span>
              </span>
              <span className="text-[10px] font-mono text-[#9db0c8] bg-[#070b14] px-2 py-0.5 rounded border border-[#1d2a3e]">
                Verified Worth
              </span>
            </div>

            <div className="relative z-10 my-2">
              <div className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight">
                <span className="bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-white bg-clip-text text-transparent">
                  ₹1,15,237
                </span>
              </div>
              <div className="text-xs font-semibold text-[#c9d3dc] mt-0.5">
                Total Estimated Network &amp; Ecosystem Worth
              </div>
              <p className="text-[11px] text-[#9db0c8] mt-1.5 leading-relaxed">
                Appraisal covering brand equity, digital assets, active pipelines, proprietary templates, and creative portfolios.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-[#1d2a3e] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#59e3ff]">
                <Sparkles className="w-3 h-3 text-[#3da9fc]" />
                <span>45+ Portals &bull; 14+ Digital Assets</span>
              </div>
              <a
                href="#valuation"
                className="btn-interactive inline-flex items-center gap-1 text-xs font-semibold text-[#59e3ff] hover:text-white"
              >
                <span>Full Breakdown</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Sponsorship & Ad Booking Options (Front & Center) */}
          <div className="panel bg-[#0e1726]/90 border-2 border-[#59e3ff] rounded-2xl p-5 sm:p-6 shadow-xl shadow-[#59e3ff]/15 relative overflow-hidden group hover:border-[#3da9fc] transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#59e3ff]/10 rounded-full blur-2xl pointer-events-none -z-0" />
            
            <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#59e3ff]/20 text-[#59e3ff] text-xs font-bold border border-[#59e3ff]/50">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Sponsorship &amp; Ad Booking</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Slots Available
              </span>
            </div>

            {/* Pricing Tiers Pill List */}
            <div className="relative z-10 my-2">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="px-2 py-0.5 rounded bg-[#070b14] border border-[#1d2a3e] text-xs font-bold text-white">
                  Weekly <strong className="text-[#59e3ff]">₹49</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#070b14] border border-[#1d2a3e] text-xs font-bold text-white">
                  Monthly <strong className="text-[#59e3ff]">₹149</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#070b14] border border-[#1d2a3e] text-xs font-bold text-white">
                  Yearly <strong className="text-[#59e3ff]">₹499</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#3da9fc]/10 border border-[#3da9fc]/40 text-xs font-bold text-white">
                  Lifetime <strong className="text-emerald-400">₹799</strong>
                </span>
              </div>
              <p className="text-[11px] text-[#9db0c8] leading-relaxed">
                Feature your brand or business directly on SAMZEN. Includes verified backlink and guaranteed reach.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-[#1d2a3e] flex flex-wrap items-center justify-between gap-2">
              <a
                href="https://wa.me/918605042855?text=Hello%20Samarth%2C%20I%20want%20to%20book%20a%20Sponsorship%2FAd%20Slot%20on%20SAMZEN!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive btn-shimmer-visible px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#59e3ff] to-[#3da9fc] text-[#070b14] text-xs font-bold shadow-md shadow-[#59e3ff]/20 flex items-center gap-1"
              >
                <Megaphone className="w-3 h-3" />
                <span>Book Ad Slot (From ₹49)</span>
              </a>

              <div className="flex items-center gap-3">
                <a
                  href="#sponsorship"
                  className="text-[11px] text-[#9db0c8] hover:text-[#59e3ff] transition"
                >
                  All 4 Tiers &darr;
                </a>
                <a
                  href="https://protradingcourse.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#59e3ff] hover:text-white flex items-center gap-1"
                >
                  <span>Partner: Pro Trading</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
