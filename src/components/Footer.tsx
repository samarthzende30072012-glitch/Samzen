import React from 'react';
import { SamzenLogo } from './SamzenLogo';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { MessageSquare, Mail, ShieldCheck, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#070b14] border-t border-[#1d2a3e] pt-12 pb-8 text-[#9db0c8] overflow-hidden w-full max-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#1d2a3e]">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <SamzenLogo size="md" showSubtitle={true} className="mb-3" />
            <p className="text-xs text-[#9db0c8] max-w-sm mt-2 leading-relaxed">
              High-speed, conversion-focused websites crafted for local businesses, coaching academies, salons, garages, clinics, and shops.
            </p>
            <div className="mt-4 text-xs text-[#c9d3dc]">
              Lead Architect: <strong className="text-white">{SAMZEN_BRAND.developer}</strong> &bull; Nashik, Maharashtra
            </div>

            {/* Language Selector in Footer */}
            <div className="mt-6 pt-4 border-t border-[#1d2a3e]/60 w-full">
              <LanguageSelector variant="footer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 text-xs space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-white mb-3">Agency Funnel</div>
            <div><a href="#home" className="hover:text-[#59e3ff] transition">Home</a></div>
            <div><a href="#pricing" className="hover:text-[#59e3ff] transition">Pricing &amp; Plans (From ₹1,999)</a></div>
            <div><a href="#portfolio" className="hover:text-[#59e3ff] transition">Portfolio Showcase</a></div>
            <div><a href="#services" className="hover:text-[#59e3ff] transition">16 Business Categories</a></div>
            <div><a href="#contact" className="hover:text-[#59e3ff] transition">Contact &amp; Enquiry</a></div>
            <div className="pt-2 text-[11px] text-[#59e3ff] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3da9fc]" />
              <span>Annual Maintenance Contract (AMC) Backed</span>
            </div>
          </div>

          {/* Contact Direct */}
          <div className="md:col-span-4 text-xs space-y-3">
            <div className="font-bold uppercase tracking-wider text-white mb-3">Direct Connect</div>

            {/* Direct Calling */}
            <a
              href={SAMZEN_BRAND.callUrl}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] hover:border-cyan-400 text-[#eef3fa] transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Call Direct: 8605042855</div>
                <div className="text-[11px] text-[#9db0c8]">{SAMZEN_BRAND.phoneDisplay} &bull; Tap to Call</div>
              </div>
            </a>
            
            <a
              href={SAMZEN_BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#25D366] text-[#eef3fa] transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">WhatsApp Messaging</div>
                <div className="text-[11px] text-[#9db0c8]">{SAMZEN_BRAND.phoneDisplay} &bull; Instant Chat</div>
              </div>
            </a>

            <a
              href={SAMZEN_BRAND.gmailDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3da9fc]/20 text-[#3da9fc] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-semibold text-white">Email Enquiry</div>
                <div className="text-[11px] text-[#9db0c8] truncate">{SAMZEN_BRAND.email}</div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#51617a]">
          <div>
            &copy; {new Date().getFullYear()} SAMZEN Web Development. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Fast Static &amp; Dynamic Code</span>
            <span>&bull;</span>
            <span>48-Hour Turnaround</span>
            <span>&bull;</span>
            <a href="#pricing" className="hover:text-[#9db0c8]">Plans from ₹1,999</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
