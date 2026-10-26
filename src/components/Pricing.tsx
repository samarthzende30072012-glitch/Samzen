import React from 'react';
import { PLANS } from '../data/samzenData';
import { Check, ShieldCheck, MessageSquare, AlertCircle, Globe, Sparkles, Megaphone, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PricingProps {
  onSelectPlan: (planId: string, planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const { t, language } = useLanguage();

  const getLocalizedPlanName = (planId: string, fallback: string) => {
    if (planId === 'plan-0') return t('plan.0.name', fallback);
    if (planId === 'plan-1') return t('plan.1.name', fallback);
    if (planId === 'plan-2') return t('plan.2.name', fallback);
    if (planId === 'plan-3') return t('plan.3.name', fallback);
    return fallback;
  };

  const getLocalizedPlanDesc = (planId: string, fallback: string) => {
    if (planId === 'plan-0') return t('plan.0.desc', fallback);
    if (planId === 'plan-1') return t('plan.1.desc', fallback);
    if (planId === 'plan-2') return t('plan.2.desc', fallback);
    if (planId === 'plan-3') return t('plan.3.desc', fallback);
    return fallback;
  };

  return (
    <section id="pricing" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            {t('pricing.tag')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            {t('pricing.title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {PLANS.map((plan) => {
            const isFeatured = plan.featured;
            const localizedName = getLocalizedPlanName(plan.id, plan.name);
            const localizedDesc = getLocalizedPlanDesc(plan.id, plan.description);
            const whatsappPlanUrl = `https://wa.me/918605042855?text=Hello%20Samarth%2C%20I%20am%20interested%20in%20${encodeURIComponent(plan.num + ': ' + localizedName + ' (' + plan.priceRange + ')')}%20for%20my%20business.`;

            return (
              <div
                key={plan.id}
                className={`plan ${isFeatured ? 'feat' : ''} relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  isFeatured
                    ? 'bg-[#0e1726] border border-[#3da9fc]/60 shadow-xl shadow-[#3da9fc]/10'
                    : 'bg-[#0b1220] border border-[#1d2a3e] hover:border-[#3da9fc]/50 hover:shadow-[#3da9fc]/5'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-[11px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap animate-pulse">
                    {t('pricing.popular')}
                  </div>
                )}

                <div>
                  {/* Plan Top */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-[#9db0c8]">
                      {plan.num}
                    </span>
                    {plan.supportDays > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#59e3ff] bg-[#3da9fc]/10 px-2.5 py-0.5 rounded-full border border-[#3da9fc]/20">
                        <ShieldCheck className="w-3 h-3 text-[#59e3ff]" />
                        <span>{plan.supportDays} {t('pricing.daysFreeSupport')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#9db0c8] bg-[#1d2a3e]/40 px-2 py-0.5 rounded-full border border-[#1d2a3e]">
                        <span>{t('pricing.noFreeSupport', 'No Free Maint.')}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-[#59e3ff] my-2">
                    {plan.priceRange}
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white mb-2">
                    {localizedName}
                  </h3>

                  <p className="text-xs text-[#9db0c8] mb-4 min-h-[44px] leading-relaxed">
                    {localizedDesc}
                  </p>

                  {/* Mandatory Branding, Domain & Sponsorship Rules */}
                  {(plan.domainRule || plan.brandingRule || plan.sponsorshipRule) && (
                    <div className="mb-4 p-3 rounded-xl bg-[#070b14]/80 border border-[#1d2a3e] space-y-2 text-left">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#59e3ff] flex items-center gap-1">
                        <Info className="w-3 h-3 text-[#3da9fc]" />
                        <span>Plan Rules &amp; Policy:</span>
                      </div>

                      {plan.domainRule && (
                        <div className="flex items-start gap-1.5 text-[11px] text-[#c9d3dc]">
                          <Globe className="w-3.5 h-3.5 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white">Domain: </span>
                            <span>{plan.domainRule}</span>
                          </div>
                        </div>
                      )}

                      {plan.brandingRule && (
                        <div className="flex items-start gap-1.5 text-[11px] text-[#c9d3dc]">
                          <Sparkles className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white">Creator Branding: </span>
                            <span>{plan.brandingRule}</span>
                          </div>
                        </div>
                      )}

                      {plan.sponsorshipRule && (
                        <div className="flex items-start gap-1.5 text-[11px] text-[#c9d3dc]">
                          <Megaphone className="w-3.5 h-3.5 text-[#9db0c8] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white">Sponsorship: </span>
                            <span className={plan.id === 'plan-3' ? 'text-emerald-400 font-semibold' : 'text-[#9db0c8]'}>
                              {plan.sponsorshipRule}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feature List */}
                  <div className="space-y-2 pt-4 border-t border-[#1d2a3e]">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-[#c9d3dc]">
                      {language === 'mr' ? 'समाविष्ट वैशिष्ट्ये:' : language === 'hi' ? 'शामिल विशेषताएं:' : 'Included Features:'}
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-[#eef3fa]">
                        <Check className="w-3.5 h-3.5 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations (if applicable, e.g. for Basic Static Plan) */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="space-y-1.5 pt-4 mt-4 border-t border-[#1d2a3e]/80">
                      <div className="text-[11px] uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>{t('pricing.limitations', 'Plan Limitations:')}</span>
                      </div>
                      {plan.limitations.map((lim, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-1.5 text-[11px] text-[#9db0c8]">
                          <span className="text-amber-400/70 font-bold leading-none mt-0.5">&minus;</span>
                          <span className="leading-tight">{lim}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Bottom / Suitability */}
                <div className="mt-6 pt-4 border-t border-[#1d2a3e]">
                  <div className="text-[11px] text-[#9db0c8] mb-4">
                    <b className="text-[#c9d3dc] block mb-1">{t('pricing.suitableFor')}:</b>
                    <span className="leading-tight block">{plan.suitableFor}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={whatsappPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-interactive w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                        isFeatured
                          ? 'btn-shimmer-visible btn-glow-pulse bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] shadow-lg shadow-[#3da9fc]/25'
                          : 'bg-[#1d2a3e] hover:bg-[#3da9fc] text-white hover:text-[#070b14] hover:shadow-md'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('pricing.discussOnWhatsapp')}</span>
                    </a>

                    <button
                      onClick={() => onSelectPlan(plan.id, localizedName)}
                      className="btn-interactive w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#59e3ff] hover:text-white bg-[#070b14] border border-[#3da9fc]/30 hover:border-[#3da9fc] hover:shadow-md hover:shadow-[#3da9fc]/15 cursor-pointer"
                    >
                      {t('pricing.selectPlan')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Note */}
        <p className="text-center text-xs text-[#9db0c8] italic max-w-2xl mx-auto mb-14">
          * {t('pricing.policyNote')}
        </p>

        {/* Support Banner (From SAMZEN materials) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0e1726] to-[#0b1220] border border-[#3da9fc]/50 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#59e3ff] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#3da9fc]" />
                <span>{t('policy.tag')} &mdash; {t('policy.title')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {t('policy.rule5')}
              </h3>
              <p className="text-sm text-[#9db0c8] mt-2 leading-relaxed">
                {t('policy.rule6')}
              </p>

              <div className="flex flex-wrap gap-3 mt-4 text-xs">
                <span className="px-3 py-1 rounded bg-[#070b14] border border-[#1d2a3e] text-[#9db0c8]">
                  Basic Static (₹799): <strong className="text-amber-400/90">0 Free Days (₹199/task)</strong>
                </span>
                <span className="px-3 py-1 rounded bg-[#070b14] border border-[#1d2a3e] text-[#eef3fa]">
                  Plan 1: <strong className="text-[#59e3ff]">7 {t('pricing.daysFreeSupport')}</strong>
                </span>
                <span className="px-3 py-1 rounded bg-[#070b14] border border-[#3da9fc]/40 text-[#eef3fa]">
                  Plan 2: <strong className="text-[#59e3ff]">14 {t('pricing.daysFreeSupport')}</strong>
                </span>
                <span className="px-3 py-1 rounded bg-[#070b14] border border-[#1d2a3e] text-[#eef3fa]">
                  Plan 3: <strong className="text-[#59e3ff]">21 {t('pricing.daysFreeSupport')}</strong>
                </span>
              </div>
            </div>

            <div className="bg-[#070b14] border border-[#1d2a3e] rounded-xl p-5 text-center lg:min-w-[280px]">
              <div className="text-[11px] font-semibold uppercase text-[#9db0c8]">
                {language === 'mr' ? 'मोफत सपोर्ट संपल्यानंतर' : language === 'hi' ? 'फ्री सपोर्ट के बाद' : 'After Free Support Ends'}
              </div>
              <div className="text-2xl font-bold font-heading text-[#59e3ff] my-1">₹199</div>
              <div className="text-xs text-[#c9d3dc] mb-3">
                {language === 'mr' ? 'प्रति काम / सर्व्हिस विनंती' : language === 'hi' ? 'प्रति सेवा / अनुरोध' : 'per service / request'}
              </div>
              <p className="text-[11px] text-[#9db0c8] leading-tight">
                {language === 'mr' 
                  ? 'किरकोळ बदल व दुरुस्तीसाठी. नवीन पेजेस किंवा मोठे बदल असल्यास स्वतंत्र वाजवी दर.'
                  : language === 'hi'
                  ? 'सामान्य अपडेट व सुधारणांसाठी। बड़े बदलाव या नए पेजों के लिए अलग से उचित दर।'
                  : 'For routine fixes and updates. Major redesigns or new features outside the original scope may carry additional charges.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
