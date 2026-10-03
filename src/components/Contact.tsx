import React, { useState } from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { MessageSquare, Mail, Phone, Copy, Check, Send, ArrowUpRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
          Get In Touch
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          Ready to build your website?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#9db0c8] max-w-xl mx-auto">
          Let&rsquo;s create your professional online presence. Connect directly with Samarth Zende via WhatsApp or Gmail.
        </p>

        {/* Developer Profile Lockup */}
        <div className="mt-8 mb-10 inline-flex flex-col items-center">
          <div className="text-xl sm:text-2xl font-bold font-heading text-white">
            {SAMZEN_BRAND.developer}
          </div>
          <div className="text-sm font-semibold text-[#59e3ff] tracking-wide mt-0.5">
            Founder &amp; CEO &mdash; {SAMZEN_BRAND.name}
          </div>
          <div className="text-xs text-[#9db0c8] mt-0.5">
            Lead Web Developer &amp; Digital Creator
          </div>
        </div>

        {/* The Two Clear Options Requested by User */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          {/* OPTION 1: WhatsApp */}
          <div className="relative group bg-[#0e1726] border border-[#1d2a3e] hover:border-[#25D366] rounded-2xl p-6 sm:p-7 transition duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Instant Response
                </span>
              </div>

              <h3 className="text-lg font-bold font-heading text-white mb-1">
                WhatsApp Chat
              </h3>
              <p className="text-xs text-[#9db0c8] mb-4">
                Start a direct conversation to discuss requirements, templates, or pricing.
              </p>

              <div className="font-mono text-sm sm:text-base font-semibold text-[#eef3fa] bg-[#070b14] px-3 py-2 rounded-lg border border-[#1d2a3e] flex items-center justify-between mb-4">
                <span>{SAMZEN_BRAND.phoneDisplay}</span>
                <button
                  onClick={() => copyToClipboard(SAMZEN_BRAND.phoneDisplay, 'phone')}
                  className="text-xs text-[#9db0c8] hover:text-[#59e3ff] flex items-center gap-1"
                  title="Copy Phone Number"
                >
                  {copiedType === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-[#25D366]/20"
            >
              <span>Open WhatsApp Chat</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* OPTION 2: Gmail */}
          <div className="relative group bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] rounded-2xl p-6 sm:p-7 transition duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#3da9fc]/10 text-[#3da9fc] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-[#59e3ff] bg-[#3da9fc]/10 px-2 py-0.5 rounded-full border border-[#3da9fc]/20">
                  Direct Inbox
                </span>
              </div>

              <h3 className="text-lg font-bold font-heading text-white mb-1">
                Gmail / Email
              </h3>
              <p className="text-xs text-[#9db0c8] mb-4">
                Send your business details, logo, requirements, and reference links directly.
              </p>

              <div className="font-mono text-xs sm:text-xs font-semibold text-[#eef3fa] bg-[#070b14] px-3 py-2 rounded-lg border border-[#1d2a3e] flex items-center justify-between mb-4 truncate">
                <span className="truncate pr-2">{SAMZEN_BRAND.email}</span>
                <button
                  onClick={() => copyToClipboard(SAMZEN_BRAND.email, 'email')}
                  className="text-xs text-[#9db0c8] hover:text-[#59e3ff] flex items-center gap-1 flex-shrink-0"
                  title="Copy Email Address"
                >
                  {copiedType === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                className="py-3 px-3 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-[#3da9fc]/20"
              >
                <span>Open Gmail</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={SAMZEN_BRAND.mailtoUrl}
                className="py-3 px-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] font-medium text-xs flex items-center justify-center gap-1.5 transition"
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
