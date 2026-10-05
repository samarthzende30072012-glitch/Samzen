import React, { useState } from 'react';
import { BUSINESS_TYPES, PLANS } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  HelpCircle,
  Sliders,
  Send
} from 'lucide-react';

interface CostCalculatorProps {
  onSelectPlan?: (planId: string, planName: string) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ onSelectPlan }) => {
  const [businessType, setBusinessType] = useState<string>('Shops');
  const [pageScope, setPageScope] = useState<'single' | 'medium' | 'large'>('medium');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'whatsapp_direct',
    'mobile_responsive',
    'photo_gallery',
    'google_maps'
  ]);
  const [timeline, setTimeline] = useState<'standard' | 'express'>('standard');

  const featureOptions = [
    { id: 'mobile_responsive', label: '100% Mobile & Tablet Optimization', planWeight: 1 },
    { id: 'whatsapp_direct', label: '1-Tap WhatsApp Direct Chat Integration', planWeight: 1 },
    { id: 'photo_gallery', label: 'Business Photos & Services Showcase', planWeight: 1 },
    { id: 'google_maps', label: 'Interactive Google Maps & Directions', planWeight: 1 },
    { id: 'custom_inquiry', label: 'Custom Customer Inquiry Form', planWeight: 2 },
    { id: 'announcement_board', label: 'Notice & Announcements Banner', planWeight: 2 },
    { id: 'payment_gateway', label: 'Online Payment Integration (UPI/QR)', planWeight: 3 },
    { id: 'downloadable_notes', label: 'Downloadable Resources & Files (Tuitions/B2B)', planWeight: 2 },
    { id: 'fast_seo', label: 'Local Google Search SEO Setup', planWeight: 2 },
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Determine matching plan
  const hasAdvancedFeatures = selectedFeatures.includes('payment_gateway') || pageScope === 'large';
  const hasMediumFeatures = selectedFeatures.includes('custom_inquiry') || selectedFeatures.includes('announcement_board') || selectedFeatures.includes('downloadable_notes') || pageScope === 'medium';

  let recommendedPlan = PLANS[0]; // Plan 1
  if (hasAdvancedFeatures) {
    recommendedPlan = PLANS[2]; // Plan 3
  } else if (hasMediumFeatures || selectedFeatures.length >= 5) {
    recommendedPlan = PLANS[1]; // Plan 2
  }

  const getWhatsAppQuoteUrl = () => {
    const featureLabels = featureOptions
      .filter(f => selectedFeatures.includes(f.id))
      .map(f => f.label)
      .join(', ');

    const text = encodeURIComponent(
      `Hello Samarth! I used the SAMZEN Website Cost Calculator.\n\n` +
      `• Business Type: ${businessType}\n` +
      `• Pages Scope: ${pageScope === 'single' ? 'Single Page Landing (1-3 sections)' : pageScope === 'medium' ? 'Standard Multi-Page (4-6 pages)' : 'Comprehensive Portal (7+ pages)'}\n` +
      `• Timeline: ${timeline === 'express' ? 'Express Delivery (3-5 days)' : 'Standard Delivery (7-10 days)'}\n` +
      `• Selected Features: ${featureLabels}\n` +
      `• Recommended Plan: ${recommendedPlan.name} (${recommendedPlan.priceRange})\n\n` +
      `Can we discuss initiating this website?`
    );
    return `https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=${text}`;
  };

  return (
    <section id="calculator" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#0b1220] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] text-xs font-semibold uppercase tracking-wider text-[#59e3ff] mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Interactive Cost Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Calculate Your Website Estimate in 30 Seconds
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] leading-relaxed">
            Select your business type and needed features to see the exact recommended plan, transparent pricing range, and free support window.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Business Type */}
            <div className="p-6 rounded-2xl bg-[#0e1726] border border-[#1d2a3e]">
              <label className="block text-sm font-bold text-white mb-2">
                Step 1: Choose Your Business Category
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] text-white text-sm focus:outline-none"
              >
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt} value={bt} className="bg-[#070b14] text-white">
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Page Scope */}
            <div className="p-6 rounded-2xl bg-[#0e1726] border border-[#1d2a3e]">
              <label className="block text-sm font-bold text-white mb-3">
                Step 2: Choose Page Scope
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPageScope('single')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    pageScope === 'single'
                      ? 'border-[#3da9fc] bg-[#3da9fc]/10 text-white'
                      : 'border-[#1d2a3e] bg-[#070b14] text-[#9db0c8] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs text-white">1–3 Sections</div>
                  <div className="text-[11px] text-[#9db0c8] mt-1">Single page overview</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPageScope('medium')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    pageScope === 'medium'
                      ? 'border-[#3da9fc] bg-[#3da9fc]/10 text-white'
                      : 'border-[#1d2a3e] bg-[#070b14] text-[#9db0c8] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs text-white">4–6 Sections</div>
                  <div className="text-[11px] text-[#9db0c8] mt-1">Standard business site</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPageScope('large')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    pageScope === 'large'
                      ? 'border-[#3da9fc] bg-[#3da9fc]/10 text-white'
                      : 'border-[#1d2a3e] bg-[#070b14] text-[#9db0c8] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs text-white">7+ Sections / Portal</div>
                  <div className="text-[11px] text-[#9db0c8] mt-1">Advanced business site</div>
                </button>
              </div>
            </div>

            {/* Step 3: Features Checklist */}
            <div className="p-6 rounded-2xl bg-[#0e1726] border border-[#1d2a3e]">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white">
                  Step 3: Select Required Features
                </label>
                <span className="text-xs text-[#59e3ff] font-semibold">
                  {selectedFeatures.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {featureOptions.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                        isChecked 
                          ? 'bg-[#3da9fc]/10 border-[#3da9fc] text-white font-medium'
                          : 'bg-[#070b14] border-[#1d2a3e] text-[#9db0c8] hover:text-white'
                      }`}
                    >
                      <span className="pr-2">{feat.label}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
                        isChecked ? 'bg-[#3da9fc] border-[#3da9fc] text-black' : 'border-[#9db0c8]/40'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Sticky Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0e1726] to-[#070b14] border-2 border-[#3da9fc] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#3da9fc] text-black text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                Instant Calculation
              </div>

              <div className="text-xs font-bold text-[#59e3ff] uppercase tracking-wider mb-1">
                Matched Official Plan
              </div>
              <h3 className="text-2xl font-black font-heading text-white">
                {recommendedPlan.name}
              </h3>
              <p className="text-xs text-[#9db0c8] mt-1">
                Tailored for {businessType} requirements
              </p>

              {/* Price Callout */}
              <div className="my-5 p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                <div className="text-xs text-[#9db0c8]">Estimated Project Cost</div>
                <div className="text-3xl font-extrabold text-[#59e3ff] font-heading mt-1">
                  {recommendedPlan.priceRange}
                </div>
                <div className="text-[11px] text-[#9db0c8] mt-1">
                  Includes full mobile-first development &amp; launch
                </div>
              </div>

              {/* Free Support Window Callout */}
              <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <div>
                  <strong>{recommendedPlan.supportDays} Days Free Support</strong> included after delivery for any bugs or tweaks!
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={getWhatsAppQuoteUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-sm transition shadow-lg shadow-[#25D366]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Quote to Samarth on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                {onSelectPlan && (
                  <button
                    onClick={() => onSelectPlan(recommendedPlan.id, recommendedPlan.name)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#3da9fc]/60 text-white font-bold text-xs transition"
                  >
                    <span>Lock In This Plan on Dashboard</span>
                  </button>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#1d2a3e] text-center text-[11px] text-[#9db0c8]">
                &bull; No hidden agency fees &bull; Transparent policy &bull; Speak directly with Founder
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
