import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { DeveloperPortrait } from './DeveloperPortrait';
import { MessageSquare, Mail, Layers, Check, Sparkles } from 'lucide-react';
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

        {/* Hero Body Grid: Developer Portrait + Value Proposition */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0b1220]/60 p-5 sm:p-8 rounded-2xl border border-[#1d2a3e]">
          {/* Left Column: Portrait */}
          <div className="md:col-span-5 lg:col-span-4 max-w-sm mx-auto w-full">
            <DeveloperPortrait />
          </div>

          {/* Right Column: Statement & Value */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center text-left">
            <div className="inline-block border-l-2 border-[#3da9fc] pl-4 sm:pl-5 my-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-bold font-heading text-white">
                  {t('founder.name')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#3da9fc]/20 to-[#59e3ff]/20 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/40">
                  {t('hero.founderBadge')}
                </span>
              </div>
              <div className="text-sm font-semibold text-[#59e3ff] mb-0.5">
                {t('hero.founderRole')}
              </div>
              <div className="text-xs text-[#9db0c8] mb-3">
                {t('hero.founderBio')}
              </div>
              <p className="text-sm sm:text-base text-[#eef3fa] leading-relaxed italic">
                {t('founder.quote')}
              </p>
            </div>

            {/* Core guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 text-sm text-[#9db0c8]">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                  <Check className="w-4 h-4" />
                </div>
                <span>7 to 21 {t('pricing.daysFreeSupport')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                  <Check className="w-4 h-4" />
                </div>
                <span>Fast, Mobile-Friendly Responsive Code</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                  <Check className="w-4 h-4" />
                </div>
                <span>WhatsApp &amp; 1-Tap Calling Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                  <Check className="w-4 h-4" />
                </div>
                <span>Secure Customer Account &amp; OTP Portal</span>
              </div>
            </div>

            {/* Action Buttons: Create Website, WhatsApp, Gmail, Explore Plans */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {onOpenCreateWebsite && (
                <button
                  onClick={onOpenCreateWebsite}
                  className="relative group overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-bold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-[#3da9fc]/25 cursor-pointer"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />
                  <Sparkles className="w-4 h-4 text-[#070b14] group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Create Your Website</span>
                </button>
              )}

              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('hero.ctaWhatsapp')}</span>
              </a>

              <a
                href={SAMZEN_BRAND.gmailDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#1d2a3e] hover:border-[#3da9fc] text-white font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-[#59e3ff]" />
                <span>{t('hero.ctaEmail')}</span>
              </a>

              <button
                onClick={onExplorePlans}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-transparent hover:bg-[#0e1726] text-[#9db0c8] hover:text-[#59e3ff] font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Layers className="w-4 h-4" />
                <span>{t('hero.ctaPlans')} (From ₹799)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
