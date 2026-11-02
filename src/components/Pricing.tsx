import React from 'react';
import { PLANS } from '../data/samzenData';
import { Check, ShieldCheck, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SAMZEN_BRAND } from '../assets/samzenBranding';

interface PricingProps {
  onSelectPlan: (planId: string, planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const { t, language } = useLanguage();

  return (
    <section id="pricing" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-gradient-to-b from-[#070b14] via-[#0a1122] to-[#070b14] scroll-mt-20 relative overflow-hidden w-full max-w-full">
      {/* Dynamic Background Cyan & Electric Blue Glows (Strictly Clipped) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 max-w-full">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[350px] bg-gradient-to-r from-[#00f2fe]/10 via-[#3da9fc]/8 to-transparent blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transparent Fixed Investment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
            Clear, Fixed Pricing. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#00f2fe] via-[#59e3ff] to-[#3da9fc] bg-clip-text text-transparent">
              No Hidden Surprises.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#c9d3dc] leading-relaxed">
            Professional website packages tailored for local businesses, clinics, coaching institutes, and shops. All ongoing updates and support are backed by our dedicated Annual Maintenance Contract (AMC).
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12 w-full max-w-full">
          {PLANS.map((plan) => {
            const isFeatured = plan.featured;
            const whatsappPlanUrl = `https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=Hello%20Samarth%2C%20I%20am%20interested%20in%20${encodeURIComponent(plan.num + ': ' + plan.name + ' (' + plan.priceRange + ')')}%20for%20my%20business.`;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-2 glass-card-shiny w-full max-w-full animate-float-slow ${
                  isFeatured
                    ? 'border-2 border-[#00f2fe]/90 shadow-[0_0_35px_rgba(0,242,254,0.28)] ring-1 ring-[#00f2fe]/40 bg-gradient-to-b from-[#0b172a]/90 via-[#08101e]/95 to-[#070b14]/95'
                    : 'border border-white/10 hover:border-cyan-400/50 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,242,254,0.15)]'
                }`}
              >
                {/* Popular Pill for Plan 2 */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00f2fe] via-[#3da9fc] to-[#0072ff] text-[#070b14] text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,242,254,0.6)] whitespace-nowrap flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-[#070b14]" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-[#9db0c8]">
                      {plan.num}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-400/30">
                      {plan.supportDays} Days Free Initial Setup
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white my-3 flex items-baseline gap-1">
                    <span className="text-[#59e3ff] drop-shadow-[0_0_15px_rgba(89,227,255,0.3)]">
                      {plan.priceRange}
                    </span>
                    <span className="text-xs text-[#9db0c8] font-normal">one-time</span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold font-heading text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#9db0c8] mb-4 min-h-[40px] leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-[#c9d3dc]">
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-[#eef3fa]">
                        <Check className="w-4 h-4 text-[#00f2fe] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* AMC Support Guarantee Notice */}
                  <div className="mt-5 p-3 rounded-2xl bg-[#070b14]/80 border border-white/10 text-left shadow-inner">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Post-Launch Support:</span>
                        <span className="text-[11px] text-[#9db0c8] leading-tight block mt-0.5">
                          Ongoing maintenance, security updates, and edits are managed via our dedicated Annual Maintenance Contract (AMC).
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Area */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-[11px] text-[#9db0c8] mb-4">
                    <span className="text-[#c9d3dc] font-semibold block mb-0.5">Best For:</span>
                    <span className="leading-tight block">{plan.suitableFor}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onSelectPlan(plan.id, plan.name)}
                      className={`btn-interactive btn-shimmer-visible w-full py-3 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-lg ${
                        isFeatured
                          ? 'bg-gradient-to-r from-[#00f2fe] via-[#3da9fc] to-[#0072ff] text-[#070b14]'
                          : 'bg-[#121d33] hover:bg-[#1a2b4c] text-white border border-cyan-400/40 hover:border-cyan-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Select This Plan</span>
                    </button>

                    <a
                      href={whatsappPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-interactive w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#25D366] hover:text-white bg-[#070b14]/70 border border-[#25D366]/40 hover:bg-[#25D366]/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Discuss on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AMC Explainer Banner */}
        <div className="rounded-3xl glass-card-shiny border border-cyan-400/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Annual Maintenance Contract (AMC) Policy</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Zero Hidden Charges. Continuous Uptime &amp; Speed.
              </h3>
              <p className="text-sm text-[#c9d3dc] mt-2 leading-relaxed">
                Rather than charging per minor request, our predictable AMC packages ensure your domain, SSL security certificate, speed optimizations, and regular content adjustments are covered seamlessly all year round.
              </p>
            </div>

            <div className="bg-[#070b14]/90 border border-cyan-400/40 rounded-2xl p-5 text-center lg:min-w-[280px] shadow-xl">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9db0c8]">
                Standard Annual AMC
              </div>
              <div className="text-3xl font-extrabold font-heading text-cyan-400 my-1 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                ₹1,499
              </div>
              <div className="text-xs text-[#c9d3dc] mb-2">per year &bull; All inclusive</div>
              <p className="text-[11px] text-[#9db0c8] leading-tight">
                Includes server monitoring, SSL renewal, automated backups, and priority WhatsApp edits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

