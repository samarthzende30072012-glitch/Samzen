import React from 'react';
import { PLANS } from '../data/samzenData';
import { Check, ShieldCheck, MessageSquare, Sparkles, Crown, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SAMZEN_BRAND } from '../assets/samzenBranding';

interface PricingProps {
  onSelectPlan: (planId: string, planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const { t, language } = useLanguage();

  return (
    <section id="pricing" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-gradient-to-b from-[#070b14] via-[#0b1324] to-[#070b14] scroll-mt-20 relative overflow-hidden w-full max-w-full">
      {/* Dynamic Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 max-w-full">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] max-w-full h-[500px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 via-purple-500/10 to-amber-400/15 blur-[160px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full relative z-10">
        {/* Diwali Festive Announcement Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#181126]/90 to-amber-950/70 border-2 border-amber-400/40 shadow-[0_0_35px_rgba(251,191,36,0.25)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(251,191,36,0.6)] flex-shrink-0 animate-pulse">
              🪔
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  🪔 Special Diwali Dhamaka Offer &bull; For Everyone
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  ✨ No Promo Code Needed &bull; Direct Festive Discounts Active
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                Celebrate Diwali With High-Conversion Websites — Massive Festive Savings For All!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Unlocked for every Indian business &amp; individual: Shops, Salons, Clinics, Tuitions, Hotels, Factories &amp; VIP Enterprises. VIP Plan at flat 60% Off!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
            <a
              href={`https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=Hello%20Samarth%2C%20I%20want%20to%20claim%20the%20Diwali%20Dhamaka%20Festive%20Offer%20for%20my%20business%20website!`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:brightness-110 transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Claim Diwali Deal</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>🪔 Shubh Deepawali Festive Pricing &bull; Special Offer For Everyone</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Diwali Dhamaka Offer. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-300 via-emerald-300 via-sky-300 to-amber-400 bg-clip-text text-transparent">
              Save Huge On Every Plan.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#b2c2d4] leading-relaxed font-normal">
            Every plan price ends in 99 with real strike-through savings. Whether you need a Starter static site or a bespoke VIP Enterprise solution, take advantage of our festive discounts available to everyone!
          </p>
        </div>

        {/* 5 Progressive Glassmorphic Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch mb-14 w-full max-w-full">
          {PLANS.map((plan) => {
            const isPlan0 = plan.id === 'plan-0';
            const isPlan1 = plan.id === 'plan-1';
            const isPlan2 = plan.id === 'plan-2'; // Featured Emerald / Decoy Sweet Spot
            const isPlan3 = plan.id === 'plan-3'; // Amethyst Enterprise
            const isVip = plan.id === 'plan-vip';   // VIP Gold Flagship

            // Calculate dynamic percentage savings ensuring VIP is specifically '60% Off' and others show realistic odd-numbered percentages
            const numericOriginal = parseInt(plan.originalPrice.replace(/[^0-9]/g, ''), 10);
            const numericCurrent = parseInt(plan.priceRange.replace(/[^0-9]/g, ''), 10);
            let calculatedPercent = Math.round(((numericOriginal - numericCurrent) / numericOriginal) * 100);
            if (!isVip && calculatedPercent % 2 === 0) {
              calculatedPercent = calculatedPercent - 1;
            }
            const savingsPercent = isVip ? 60 : calculatedPercent;
            const savingsBadgeText = isVip ? '60% Off' : `Save ${savingsPercent}%`;
            const instantSavingsFormatted = `₹${(numericOriginal - numericCurrent).toLocaleString('en-IN')}`;

            const whatsappPlanUrl = `https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=Hello%20Samarth%2C%20I%20am%20interested%20in%20${encodeURIComponent(plan.num + ': ' + plan.name + ' (' + plan.priceRange + ')')}%20for%20my%20business.`;

            // Card Style variations per tier
            let containerStyle = 'bg-[#0d1527]/75 backdrop-blur-xl border border-white/10 hover:border-amber-400/40 shadow-xl';
            let badgeComponent = null;
            let priceGradientText = 'text-white';
            let checkIconColor = 'text-cyan-400';
            let buttonStyle = 'bg-[#121e36] hover:bg-[#1a2c4e] text-white border border-cyan-400/40 hover:border-cyan-400';

            if (isPlan0) {
              containerStyle = 'bg-gradient-to-b from-[#18121d]/85 via-[#0b1222]/85 to-[#070b14]/95 border border-amber-700/50 hover:border-amber-500/80 shadow-[0_0_20px_rgba(217,119,6,0.12)] hover:shadow-[0_0_30px_rgba(217,119,6,0.25)] backdrop-blur-xl';
              priceGradientText = 'bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent';
              checkIconColor = 'text-amber-400';
              buttonStyle = 'bg-[#221810] hover:bg-[#2d2015] text-amber-200 border border-amber-500/40 hover:border-amber-400';
            } else if (isPlan1) {
              containerStyle = 'bg-gradient-to-b from-[#0f2142]/90 via-[#0b1428]/90 to-[#070b14]/95 border-2 border-blue-500/60 hover:border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] backdrop-blur-xl';
              priceGradientText = 'bg-gradient-to-r from-blue-300 via-sky-200 to-cyan-300 bg-clip-text text-transparent';
              checkIconColor = 'text-sky-400';
              buttonStyle = 'bg-[#0e2a52] hover:bg-[#13386e] text-blue-100 border border-blue-400/50 hover:border-blue-300';
            } else if (isPlan2) {
              containerStyle = 'bg-gradient-to-b from-[#0b2d28]/95 via-[#081824]/95 to-[#070b14]/98 border-2 border-emerald-400/90 shadow-[0_0_45px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/50 hover:border-emerald-300 hover:shadow-[0_0_65px_rgba(16,185,129,0.55)] backdrop-blur-xl relative overflow-hidden';
              priceGradientText = 'bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]';
              checkIconColor = 'text-emerald-400';
              buttonStyle = 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-[#070b14] shadow-emerald-400/30 hover:brightness-110 font-extrabold';
              badgeComponent = (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-[#070b14] text-[10px] font-black uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.9)] border border-emerald-200 ring-2 ring-emerald-400/50 whitespace-nowrap flex items-center gap-1.5 animate-pulse z-20">
                  <Sparkles className="w-3.5 h-3.5 text-[#070b14] fill-[#070b14]" />
                  <span>RECOMMENDED &bull; MOST POPULAR</span>
                </div>
              );
            } else if (isPlan3) {
              containerStyle = 'bg-gradient-to-b from-[#23123d]/95 via-[#0e122a]/95 to-[#070b14]/98 border-2 border-purple-400/85 shadow-[0_0_45px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50 hover:border-purple-300 hover:shadow-[0_0_65px_rgba(168,85,247,0.5)] backdrop-blur-xl';
              priceGradientText = 'bg-gradient-to-r from-purple-200 via-fuchsia-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]';
              checkIconColor = 'text-purple-300';
              buttonStyle = 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-600 text-white shadow-purple-500/30 hover:brightness-110 font-extrabold';
              badgeComponent = (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.7)] whitespace-nowrap flex items-center gap-1.5 z-20">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>ENTERPRISE &bull; E-COMMERCE</span>
                </div>
              );
            } else if (isVip) {
              containerStyle = 'bg-gradient-to-b from-[#332004]/95 via-[#131b2e]/95 to-[#070b14]/98 border-2 border-amber-400/95 shadow-[0_0_60px_rgba(251,191,36,0.45)] ring-2 ring-amber-400/70 hover:border-amber-300 hover:shadow-[0_0_80px_rgba(251,191,36,0.7)] backdrop-blur-xl';
              priceGradientText = 'bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]';
              checkIconColor = 'text-amber-400';
              buttonStyle = 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-[#070b14] shadow-amber-400/40 hover:brightness-110 font-black';
              badgeComponent = (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-[#070b14] text-[10px] font-black uppercase tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.85)] whitespace-nowrap flex items-center gap-1.5 animate-pulse z-20">
                  <Crown className="w-3.5 h-3.5 text-[#070b14] fill-[#070b14]" />
                  <span>VIP FLAGSHIP &bull; 1 YEAR FREE AMC</span>
                </div>
              );
            }

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-2.5 w-full max-w-full group ${containerStyle}`}
              >
                {/* Badge Overlay if applicable */}
                {badgeComponent}

                <div>
                  {/* Card Header Metadata */}
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <span className={`text-[11px] font-mono font-bold tracking-widest uppercase ${
                      isVip ? 'text-amber-300' : isPlan2 ? 'text-emerald-300' : isPlan3 ? 'text-purple-300' : isPlan1 ? 'text-blue-300' : 'text-amber-400/80'
                    }`}>
                      {plan.num}
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${
                      isVip 
                        ? 'bg-amber-400/10 text-amber-300 border-amber-400/40' 
                        : isPlan2
                        ? 'bg-emerald-400/20 text-emerald-300 border-emerald-300/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : isPlan3
                        ? 'bg-purple-400/20 text-purple-300 border-purple-300/50'
                        : isPlan1
                        ? 'bg-blue-400/20 text-blue-300 border-blue-400/40'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {plan.supportDays === 365 ? '365 Days Support' : `${plan.supportDays} Days Support`}
                    </span>
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white leading-tight mb-3">
                    {plan.name}
                  </h3>

                  {/* CONSISTENT PRICE DISPLAY: STRIKETHROUGH ORIGINAL PRICE ALONGSIDE PERCENTAGE SAVINGS BADGE */}
                  <div className="my-4 py-3.5 px-3.5 rounded-2xl bg-[#070b14]/90 border border-white/10 group-hover:border-white/20 transition-colors relative overflow-hidden">
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                        <span className="text-xs">🪔</span>
                        <span>Diwali Dhamaka Rate</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold font-mono tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30 whitespace-nowrap">
                        For Everyone
                      </span>
                    </div>

                    {/* Strikethrough original price displayed ALONGSIDE percentage savings badge */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-xs sm:text-sm text-slate-400 line-through font-mono font-bold decoration-rose-500/80 decoration-2">
                        {plan.originalPrice}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
                        isVip 
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse'
                          : isPlan2
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                          : isPlan3
                          ? 'bg-purple-500/25 text-purple-300 border border-purple-400/50'
                          : isPlan1
                          ? 'bg-blue-500/25 text-blue-300 border border-blue-400/50'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      }`}>
                        {savingsBadgeText}
                      </span>
                    </div>

                    {/* Prominent Current Discounted Price (Ending in 99) */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className={`text-2xl sm:text-3xl font-black font-mono tabular-nums tracking-tight ${priceGradientText}`}>
                        {plan.priceRange}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">/ fixed price</span>
                    </div>

                    {/* Immediate Savings Callout */}
                    <div className="text-[10px] font-bold mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-amber-300/90 flex items-center gap-1">
                        <span>✨ Diwali Savings:</span>
                      </span>
                      <span className="font-mono text-emerald-300">
                        Save {instantSavingsFormatted} ({savingsBadgeText})
                      </span>
                    </div>
                  </div>

                  {/* Decoy / Value callout for Plan 2 */}
                  {isPlan2 && (
                    <div className="mb-3 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 text-center">
                      ⚡ Best ROI: Custom site + forms + domain for only +₹4,000
                    </div>
                  )}

                  {/* Plan Description */}
                  <p className="text-xs text-[#9db0c8] mb-4 min-h-[40px] leading-relaxed font-normal">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-300">
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-[#eef3fa]">
                        <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${checkIconColor}`} />
                        <span className="leading-snug text-slate-200">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* AMC Guarantee Callout Box */}
                  <div className={`mt-5 p-3 rounded-2xl text-left border ${
                    isVip 
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-200' 
                      : isPlan2
                      ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                      : 'bg-[#060a14]/90 border-white/10'
                  }`}>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isVip ? 'text-amber-400' : isPlan2 ? 'text-emerald-400' : 'text-cyan-400'}`} />
                      <div>
                        <span className="text-[11px] font-bold text-white block">
                          {isVip ? '1 Year Free VIP Maintenance:' : 'Ongoing AMC Support:'}
                        </span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                          {isVip 
                            ? 'Full 365 days of zero-cost edits, backups, and VIP server management included.'
                            : 'Post-warranty updates and edits backed by low-cost AMC.'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-[10px] text-slate-400 mb-3">
                    <span className="text-slate-300 font-bold block mb-0.5">Ideal For:</span>
                    <span className="leading-tight block text-slate-300">{plan.suitableFor}</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => onSelectPlan(plan.id, plan.name)}
                      className={`btn-interactive btn-shimmer-visible w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition shadow-lg ${buttonStyle}`}
                    >
                      {isVip ? <Crown className="w-3.5 h-3.5 text-[#070b14] fill-[#070b14]" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
                      <span className="whitespace-nowrap">Select This Plan</span>
                    </button>

                    <a
                      href={whatsappPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-interactive w-full py-2 px-3 rounded-xl text-[11px] font-bold text-[#25D366] hover:text-white bg-[#070b14]/80 border border-[#25D366]/40 hover:bg-[#25D366]/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span className="whitespace-nowrap">Discuss on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AMC Explainer Banner */}
        <div className="rounded-3xl bg-[#0c1426]/90 backdrop-blur-xl border border-cyan-400/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Annual Maintenance Contract (AMC) Guarantee</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Zero Hidden Fees. 99.9% Uptime &amp; High-Speed Security.
              </h3>
              <p className="text-sm text-[#b2c2d4] mt-2 leading-relaxed">
                Rather than charging per minor request, our predictable AMC packages ensure your domain renewal, SSL security certificates, mobile speed optimizations, and regular content adjustments are handled seamlessly all year round.
              </p>
            </div>

            <div className="bg-[#060a14]/90 border border-cyan-400/40 rounded-2xl p-5 text-center lg:min-w-[280px] shadow-xl">
              <div className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-400">
                Standard Annual AMC
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-cyan-400 my-1 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                ₹1,499
              </div>
              <div className="text-xs text-slate-300 mb-2 font-medium">per year &bull; All inclusive</div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Includes server monitoring, SSL renewal, automated cloud backups, and priority WhatsApp edit requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

