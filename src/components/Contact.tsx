import React, { useState } from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { MessageSquare, Mail, Copy, Check, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Contact: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const { t } = useLanguage();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
          {t('contact.tag')}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          {t('contact.title')}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#9db0c8] max-w-xl mx-auto">
          {t('contact.subtitle')}
        </p>

        {/* Developer Profile Lockup */}
        <div className="mt-8 mb-10 inline-flex flex-col items-center">
          <div className="text-xl sm:text-2xl font-bold font-heading text-white">
            {SAMZEN_BRAND.developer}
          </div>
          <div className="text-sm font-semibold text-[#59e3ff] tracking-wide mt-0.5">
            {SAMZEN_BRAND.title} &mdash; {SAMZEN_BRAND.name}
          </div>
          <div className="text-xs text-[#9db0c8] mt-0.5">
            {t('hero.founderBio')}
          </div>
        </div>

        {/* The Two Clear Options Requested by User */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          {/* OPTION 1: WhatsApp */}
          <div className="relative group bg-[#0e1726] border border-[#1d2a3e] hover:border-[#25D366] rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#25D366]/15 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Instant Response
                </span>
              </div>

              <h3 className="text-lg font-bold font-heading text-white mb-1">
                {t('contact.whatsappLabel')}
              </h3>
              <p className="text-xs text-[#9db0c8] mb-4">
                {t('contact.whatsappDesc')}
              </p>

              <div className="font-mono text-sm sm:text-base font-semibold text-[#eef3fa] bg-[#070b14] px-3 py-2 rounded-lg border border-[#1d2a3e] flex items-center justify-between mb-4 group-hover:border-[#25D366]/40 transition-colors">
                <span>{SAMZEN_BRAND.phoneDisplay}</span>
                <button
                  onClick={() => copyToClipboard(SAMZEN_BRAND.phoneDisplay, 'phone')}
                  className="text-xs text-[#9db0c8] hover:text-[#59e3ff] flex items-center gap-1 active:scale-90 transition-transform p-1"
                  title="Copy Phone Number"
                >
                  {copiedType === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-success-pop" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <a
              href={SAMZEN_BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#25D366]/20"
            >
              <span>{t('contact.whatsappLabel')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* OPTION 2: Gmail */}
          <div className="relative group bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#3da9fc]/15 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#3da9fc]/10 text-[#3da9fc] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-[#59e3ff] bg-[#3da9fc]/10 px-2 py-0.5 rounded-full border border-[#3da9fc]/20">
                  Direct Inbox
                </span>
              </div>

              <h3 className="text-lg font-bold font-heading text-white mb-1">
                {t('contact.emailLabel')}
              </h3>
              <p className="text-xs text-[#9db0c8] mb-4">
                {t('contact.emailDesc')}
              </p>

              <div className="font-mono text-xs sm:text-xs font-semibold text-[#eef3fa] bg-[#070b14] px-3 py-2 rounded-lg border border-[#1d2a3e] flex items-center justify-between mb-4 truncate group-hover:border-[#3da9fc]/40 transition-colors">
                <span className="truncate pr-2">{SAMZEN_BRAND.email}</span>
                <button
                  onClick={() => copyToClipboard(SAMZEN_BRAND.email, 'email')}
                  className="text-xs text-[#9db0c8] hover:text-[#59e3ff] flex items-center gap-1 flex-shrink-0 active:scale-90 transition-transform p-1"
                  title="Copy Email Address"
                >
                  {copiedType === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-success-pop" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={SAMZEN_BRAND.gmailDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#3da9fc]/20"
              >
                <span>Gmail Direct</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={SAMZEN_BRAND.mailtoUrl}
                className="py-3 px-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Mail App</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
