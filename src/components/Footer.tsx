import React from 'react';
import { SamzenLogo } from './SamzenLogo';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { MessageSquare, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#070b14] border-t border-[#1d2a3e] pt-12 pb-8 text-[#9db0c8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#1d2a3e]">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <SamzenLogo size="md" showSubtitle={true} className="mb-3" />
            <p className="text-xs text-[#9db0c8] max-w-sm mt-2 leading-relaxed">
              {t('hero.subtext')}
            </p>
            <div className="mt-4 text-xs text-[#c9d3dc]">
              {t('founder.badge', 'Founder & CEO')}: <strong className="text-white">{SAMZEN_BRAND.developer}</strong>
            </div>

            {/* Language Selector in Footer */}
            <div className="mt-6 pt-4 border-t border-[#1d2a3e]/60 w-full">
              <LanguageSelector variant="footer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 text-xs space-y-2">
            <div className="font-bold uppercase tracking-wider text-white mb-3">Navigation</div>
            <div><a href="#home" className="hover:text-[#59e3ff] transition">{t('nav.home')}</a></div>
            <div><a href="#founder" className="hover:text-[#59e3ff] transition">{t('nav.founder')}</a></div>
            <div><a href="#about" className="hover:text-[#59e3ff] transition">{t('nav.about')}</a></div>
            <div><a href="#services" className="hover:text-[#59e3ff] transition">{t('nav.services')}</a></div>
            <div><a href="#pricing" className="hover:text-[#59e3ff] transition">{t('nav.pricing')}</a></div>
            <div><a href="#process" className="hover:text-[#59e3ff] transition">{t('nav.process')}</a></div>
            <div><a href="#policy" className="hover:text-[#59e3ff] transition">{t('nav.policy')}</a></div>
            <div><a href="#contact" className="hover:text-[#59e3ff] transition">{t('nav.contact')}</a></div>
          </div>

          {/* Contact Direct */}
          <div className="md:col-span-4 text-xs space-y-3">
            <div className="font-bold uppercase tracking-wider text-white mb-3">{t('contact.tag')}</div>
            
            <a
              href={SAMZEN_BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e] hover:border-[#25D366] text-[#eef3fa] transition"
            >
              <div className="w-7 h-7 rounded bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">{t('contact.whatsappLabel')}</div>
                <div className="text-[11px] text-[#9db0c8]">{SAMZEN_BRAND.phoneDisplay}</div>
              </div>
            </a>

            <a
              href={SAMZEN_BRAND.gmailDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] transition"
            >
              <div className="w-7 h-7 rounded bg-[#3da9fc]/20 text-[#3da9fc] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-semibold text-white">{t('contact.emailLabel')}</div>
                <div className="text-[11px] text-[#9db0c8] truncate">{SAMZEN_BRAND.email}</div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#51617a]">
          <div>
            &copy; {new Date().getFullYear()} SAMZEN Web Development &middot; {t('footer.founderCredit')}. {t('footer.rights')}
          </div>
          <div className="flex items-center gap-4">
            <span>Dark Navy &amp; Cyan</span>
            <span>&bull;</span>
            <span>OTP Verification</span>
            <span>&bull;</span>
            <a href="#policy" className="hover:text-[#9db0c8]">{t('nav.policy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
