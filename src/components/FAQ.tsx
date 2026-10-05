import React, { useState } from 'react';
import { FAQS } from '../data/samzenData';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, ArrowUpRight } from 'lucide-react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#0b1220] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] text-xs font-semibold uppercase tracking-wider text-[#59e3ff] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-[#9db0c8]">
            Clear, honest answers about development timelines, pricing, support policies, and domains.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-[#0e1726] border-[#3da9fc]/60 shadow-lg shadow-[#3da9fc]/5' 
                    : 'bg-[#0e1726]/60 border-[#1d2a3e] hover:border-[#3da9fc]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-lg border flex-shrink-0 transition-transform ${
                    isOpen ? 'bg-[#3da9fc]/20 border-[#3da9fc] text-[#59e3ff] rotate-180' : 'bg-[#070b14] border-[#1d2a3e] text-[#9db0c8]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-[#9db0c8] leading-relaxed border-t border-[#1d2a3e]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp direct help callout */}
        <div className="mt-10 p-6 rounded-2xl bg-[#0e1726] border border-[#1d2a3e] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-white">Have a specific question not answered here?</h4>
            <p className="text-xs text-[#9db0c8] mt-0.5">Chat directly with Founder &amp; CEO Samarth Zende on WhatsApp.</p>
          </div>
          <a
            href={SAMZEN_BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition shadow-md shadow-[#25D366]/20 flex-shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Samarth on WhatsApp</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
