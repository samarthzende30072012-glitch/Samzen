import React from 'react';
import { PLANS } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { Check, Star, ShieldCheck, ArrowRight, Wrench, MessageSquare } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planId: string, planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            Transparent Investment
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Transparent Website Plans &amp; Pricing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            Genuine packages designed for local businesses, shops, educational coaching, and commercial organizations. Every plan includes an authentic free post-delivery support window.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
          {PLANS.map((plan) => {
            const isFeatured = plan.featured;
            const whatsappPlanUrl = `https://wa.me/918605042855?text=Hello%20Samarth%2C%20I%20am%20interested%20in%20${encodeURIComponent(plan.num + ': ' + plan.name + ' (' + plan.priceRange + ')')}%20for%20my%20business.`;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between p-6 sm:p-7 transition duration-300 ${
                  isFeatured
                    ? 'bg-[#0e1726] border-2 border-[#3da9fc] shadow-2xl shadow-[#3da9fc]/10'
                    : 'bg-[#0b1220] border border-[#1d2a3e] hover:border-[#1d2a3e]/80'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Plan Top */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-[#9db0c8]">
                      {plan.num}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#59e3ff] bg-[#3da9fc]/10 px-2.5 py-0.5 rounded-full border border-[#3da9fc]/20">
                      <ShieldCheck className="w-3 h-3 text-[#59e3ff]" />
                      <span>{plan.supportDays} Days Free Support</span>
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#59e3ff] my-2">
                    {plan.priceRange}
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-xs text-[#9db0c8] mb-6 min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Feature List */}
                  <div className="space-y-2.5 pt-4 border-t border-[#1d2a3e]">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-[#c9d3dc]">
                      Included Features:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-[#eef3fa]">
                        <Check className="w-4 h-4 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Suitability */}
                <div className="mt-8 pt-4 border-t border-[#1d2a3e]">
                  <div className="text-[11px] text-[#9db0c8] mb-4">
                    <b className="text-[#c9d3dc] block mb-1">Recommended for:</b>
                    <span>{plan.suitableFor}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={whatsappPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                        isFeatured
                          ? 'bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                          : 'bg-[#1d2a3e] hover:bg-[#3da9fc] text-white hover:text-[#070b14]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Book on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onSelectPlan(plan.id, plan.name)}
                      className="w-full py-2 px-3 rounded-lg text-[11px] font-medium text-[#9db0c8] hover:text-white bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc]/40 transition"
                    >
                      Select &amp; Submit Requirements
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Note */}
        <p className="text-center text-xs text-[#9db0c8] italic max-w-2xl mx-auto mb-14">
          * Final pricing may vary depending on the specific features, number of custom pages, functionality, and overall project scope agreed before development.
        </p>

        {/* Support Banner (From SAMZEN materials) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0e1726] to-[#0b1220] border border-[#3da9fc]/50 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#59e3ff] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#3da9fc]" />
                <span>Post-Delivery Service Support Policy</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Free service support window after delivery
              </h3>
              <p className="text-sm text-[#9db0c8] mt-2 leading-relaxed">
                After your website is delivered, every plan includes a free service support window. Reach out if a bug is found, a minor change is required, or any website issue needs troubleshooting.
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-xs">
                <span className="px-3 py-1 rounded bg-[#070b14] border border-[#1d2a3e] text-[#eef3fa]">
                  Plan 1: <strong className="text-[#59e3ff]">7 Days</strong> Free Support
                </span>
                <span className="px-3 py-1 rounded bg-[#070b14] border border-[#3da9fc]/40 text-[#eef3fa]">
                  Plan 2: <strong className="text-[#59e3ff]">14 Days</strong> Free Support
                </span>
                <span className="px-3 py-1 rounded bg-[#070b14] border border-[#1d2a3e] text-[#eef3fa]">
                  Plan 3: <strong className="text-[#59e3ff]">21 Days</strong> Free Support
                </span>
              </div>
            </div>

            <div className="bg-[#070b14] border border-[#1d2a3e] rounded-xl p-5 text-center lg:min-w-[280px]">
              <div className="text-[11px] font-semibold uppercase text-[#9db0c8]">After Free Support Ends</div>
              <div className="text-2xl font-bold font-heading text-[#59e3ff] my-1">₹199</div>
              <div className="text-xs text-[#c9d3dc] mb-3">per service / request</div>
              <p className="text-[11px] text-[#9db0c8] leading-tight">
                For routine fixes and updates. Major redesigns or new features outside the original scope may carry additional charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
