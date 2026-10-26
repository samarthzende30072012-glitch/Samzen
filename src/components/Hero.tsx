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

      {/* Background ambient lighting - static hardware-accelerated for smooth 60fps scrolling */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#3da9fc]/15 via-[#59e3ff]/10 to-transparent blur-3xl -z-10 pointer-events-none gpu-layer" />
      <div className="absolute top-24 right-12 w-[320px] h-[320px] bg-[#3da9fc]/10 rounded-full blur-2xl -z-10 pointer-events-none gpu-layer" />
      <div className="absolute top-36 left-12 w-[280px] h-[280px] bg-[#59e3ff]/10 rounded-full blur-2xl -z-10 pointer-events-none gpu-layer" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* 1. TOP APEX SHOWCASE: PROFILE IMAGE + NETWORK/ECONOMY CREDENTIALS + PROMINENT "CREATE YOUR WEBSITE" CTA */}
        <div className="mb-10 w-full">
          <div className="bg-[#0b1220]/90 border border-[#1d2a3e] rounded-2xl p-5 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-7 items-center">
              
              {/* Left Column: Professional Profile Image */}
              <div className="md:col-span-5 lg:col-span-4 max-w-xs mx-auto w-full flex flex-col items-center">
                <DeveloperPortrait />
                {/* 100% Owner & Founder Badge directly under portrait */}
                <div className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-[#3da9fc]/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                  <span>100% Owner &bull; {t('hero.founderBadge')}</span>
                </div>
              </div>

              {/* Right Column: Network/Economy Credentials & Super Prominent CTA */}
              <div className="md:col-span-7 lg:col-span-8 flex flex-col text-left">
                
                {/* Status Eyebrow */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3da9fc]/20 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/40">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Official Financial Appraisal</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#9db0c8] bg-[#070b14] px-2 py-0.5 rounded border border-[#1d2a3e]">
                    Verified Net Worth
                  </span>
                </div>

                {/* Founder Title & Quote */}
                <div className="mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400 fill-amber-400/30" />
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                      {t('founder.name')}
                    </h2>
                    <span className="text-sm font-semibold text-[#59e3ff]">
                      &bull; {t('hero.founderRole')}
                    </span>
                  </div>
                  <p className="text-xs text-[#9db0c8] mt-1 line-clamp-2">
                    {t('founder.quote')}
                  </p>
                </div>

                {/* Highlighted Network & Economy Credentials Box */}
                <div className="p-4 rounded-xl bg-[#070b14]/90 border border-[#1d2a3e] shadow-inner mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#9db0c8]">
                      Company Net Worth &amp; Ecosystem Valuation
                    </span>
                    <a
                      href="#valuation"
                      className="text-[11px] font-semibold text-[#59e3ff] hover:text-white flex items-center gap-0.5"
                    >
                      <span>Full Financial Breakdown</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3 mb-3">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white">
                      <span className="bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-white bg-clip-text text-transparent">
                        ₹1,15,237
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                      +142% Annual Growth
                    </span>
                  </div>

                  {/* 4 Economy Credentials */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-[#1d2a3e] text-xs">
                    <div>
                      <div className="font-bold text-white">45+ Portals</div>
                      <div className="text-[10px] text-[#9db0c8]">Active Deliveries</div>
                    </div>
                    <div>
                      <div className="font-bold text-white">14+ Assets</div>
                      <div className="text-[10px] text-[#9db0c8]">Proprietary Code</div>
                    </div>
                    <div>
                      <div className="font-bold text-[#59e3ff]">₹799 Base</div>
                      <div className="text-[10px] text-[#9db0c8]">Plans Starting</div>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-400">100% Owned</div>
                      <div className="text-[10px] text-[#9db0c8]">By Samarth Zende</div>
                    </div>
                  </div>
                </div>

                {/* SUPER PROMINENT PRIMARY CALL-TO-ACTION BUTTON */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
                  {onOpenCreateWebsite && (
                    <button
                      onClick={onOpenCreateWebsite}
                      className="btn-shimmer-visible btn-glow-pulse btn-interactive flex-1 group inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-[#3da9fc] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-black text-sm sm:text-base shadow-2xl shadow-[#3da9fc]/40 cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 text-[#070b14] group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-extrabold text-sm sm:text-base leading-tight uppercase tracking-wider text-[#070b14]">
                          Create Your Website
                        </div>
                        <div className="text-[11px] font-semibold text-[#070b14]/85 -mt-0.5">
                          Instant Estimate &bull; Plans from ₹799
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-[#070b14] ml-auto group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                    </button>
                  )}

                  {/* WhatsApp Quick Action */}
                  <a
                    href={SAMZEN_BRAND.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive btn-ripple-ring inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs sm:text-sm shadow-xl shadow-[#25D366]/25 whitespace-nowrap"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                </div>

                {/* Secondary Actions Row */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1d2a3e]">
                  <a
                    href={SAMZEN_BRAND.gmailDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] text-xs font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#59e3ff]" />
                    <span>Email Direct</span>
                  </a>
                  <button
                    onClick={onExplorePlans}
                    className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] text-xs font-semibold"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#3da9fc]" />
                    <span>Explore All Plans</span>
                  </button>
                  <a
                    href="#sponsorship"
                    className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#59e3ff]/10 hover:bg-[#59e3ff]/20 border border-[#59e3ff]/30 text-[#59e3ff] text-xs font-semibold"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Sponsor Ads (₹49+)</span>
                  </a>
                </div>

                {/* Core Guarantees Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 text-[11px] text-[#9db0c8]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#59e3ff] flex-shrink-0" />
                    <span>7-21 Days Support</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#59e3ff] flex-shrink-0" />
                    <span>Mobile Responsive</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#59e3ff] flex-shrink-0" />
                    <span>1-Tap Calling</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#59e3ff] flex-shrink-0" />
                    <span>Client Portal &amp; OTP</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* 2. VERTICALLY STACKED: BRAND HEADLINE & MISSION */}
        <div className="text-center mb-8 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3da9fc] animate-ping" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-[1.2] [text-wrap:balance]">
            {t('hero.headlineLine1')} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-white bg-clip-text text-transparent">
              {t('hero.headlineLine2')}
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#9db0c8] max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtext')}
          </p>
        </div>

        {/* 3. VERTICALLY STACKED: SPONSORSHIP & AD BOOKING SECTION (CLEAN FULL-WIDTH VERTICAL CARD) */}
        <div className="max-w-5xl mx-auto">
          <div className="panel bg-[#0e1726]/90 border-2 border-[#59e3ff] rounded-2xl p-5 sm:p-7 shadow-xl shadow-[#59e3ff]/15 relative overflow-hidden group hover:border-[#3da9fc] transition-all">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#59e3ff]/10 rounded-full blur-2xl pointer-events-none -z-0" />
            
            <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#59e3ff]/20 text-[#59e3ff] text-xs font-bold border border-[#59e3ff]/50">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Sponsorship &amp; Ad Booking</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Slots Available
              </span>
            </div>

            {/* Pricing Tiers Clean Responsive Grid */}
            <div className="relative z-10 my-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-center">
                  <div className="text-[11px] text-[#9db0c8]">Weekly Slot</div>
                  <div className="text-base font-bold text-[#59e3ff]">₹49</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-center">
                  <div className="text-[11px] text-[#9db0c8]">Monthly Slot</div>
                  <div className="text-base font-bold text-[#59e3ff]">₹149</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-center">
                  <div className="text-[11px] text-[#9db0c8]">Yearly Slot</div>
                  <div className="text-base font-bold text-[#59e3ff]">₹499</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#3da9fc]/10 border border-[#3da9fc]/40 text-center">
                  <div className="text-[11px] text-amber-300">Lifetime Slot</div>
                  <div className="text-base font-bold text-emerald-400">₹799</div>
                </div>
              </div>
              <p className="text-xs text-[#9db0c8] leading-relaxed">
                Feature your brand or business directly on SAMZEN. Includes verified backlink, prime homepage display, and guaranteed reach.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-[#1d2a3e] flex flex-wrap items-center justify-between gap-3">
              <a
                href="https://wa.me/918605042855?text=Hello%20Samarth%2C%20I%20want%20to%20book%20a%20Sponsorship%2FAd%20Slot%20on%20SAMZEN!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive btn-shimmer-visible px-4 py-2 rounded-lg bg-gradient-to-r from-[#59e3ff] to-[#3da9fc] text-[#070b14] text-xs font-bold shadow-md shadow-[#59e3ff]/20 flex items-center gap-1.5"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Book Ad Slot (From ₹49)</span>
              </a>

              <div className="flex items-center gap-3">
                <a
                  href="#sponsorship"
                  className="text-xs text-[#9db0c8] hover:text-[#59e3ff] transition font-medium"
                >
                  All 4 Tiers &darr;
                </a>
                <a
                  href="https://protradingcourse.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#59e3ff] hover:text-white flex items-center gap-1"
                >
                  <span>Partner: Pro Trading Course</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
