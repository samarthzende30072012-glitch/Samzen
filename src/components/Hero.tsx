import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { DeveloperPortrait } from './DeveloperPortrait';
import { MessageSquare, Mail, ShieldCheck, Zap, Layers, Check } from 'lucide-react';

interface HeroProps {
  onExplorePlans: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePlans, onOpenAuth }) => {
  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#1d2a3e] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#3da9fc]/10 via-[#59e3ff]/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Brand Kicker */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3da9fc] animate-ping" />
            <span>SAMZEN Web Development</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Custom Websites &amp; Digital Solutions <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-white bg-clip-text text-transparent">
              Engineered For Your Business
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] max-w-2xl mx-auto leading-relaxed">
            {SAMZEN_BRAND.tagline} Built around your exact requirements, business type, and brand identity.
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
                  {SAMZEN_BRAND.developer}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#3da9fc]/20 to-[#59e3ff]/20 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/40">
                  Founder &amp; CEO
                </span>
              </div>
              <div className="text-sm font-semibold text-[#59e3ff] mb-0.5">
                Founder &amp; CEO &mdash; SAMZEN Web Development
              </div>
              <div className="text-xs text-[#9db0c8] mb-3">
                19-Year-Old Lead Web Developer &amp; Founder
              </div>
              <p className="text-sm sm:text-base text-[#eef3fa] leading-relaxed italic">
                &ldquo;Every business deserves an online presence that looks genuine, converts visitors, and runs smoothly on both mobile phones and desktops. No clunky templates &mdash; only tailored web craftsmanship.&rdquo;
              </p>
            </div>

            {/* Core guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 text-sm text-[#9db0c8]">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-[#3da9fc]/10 text-[#59e3ff]">
                  <Check className="w-4 h-4" />
                </div>
                <span>7 to 21 Days Free Post-Delivery Support</span>
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

            {/* Action Buttons: WhatsApp and Gmail (Clear and Direct) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-sm transition shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 8605042855)</span>
              </a>

              <a
                href={SAMZEN_BRAND.gmailDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#1d2a3e] hover:border-[#3da9fc] text-white font-medium text-sm transition"
              >
                <Mail className="w-4 h-4 text-[#59e3ff]" />
                <span>Email via Gmail</span>
              </a>

              <button
                onClick={onExplorePlans}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-transparent hover:bg-[#0e1726] text-[#9db0c8] hover:text-[#59e3ff] font-medium text-sm transition"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Plans (From ₹1,000)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
