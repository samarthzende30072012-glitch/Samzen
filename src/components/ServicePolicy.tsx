import React from 'react';
import { SERVICE_POLICIES } from '../data/samzenData';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const ServicePolicy: React.FC = () => {
  return (
    <section id="policy" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#0b1220]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Service Terms &amp; Conditions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Service Policy
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            Clear, honest terms that apply to every SAMZEN Web Development project, including scope, payment, and post-delivery maintenance:
          </p>
        </div>

        {/* 12 Policy Points */}
        <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-9 shadow-lg">
          <ol className="space-y-4">
            {SERVICE_POLICIES.map((item) => (
              <li key={item.number} className="flex items-start gap-4 text-sm text-[#9db0c8] leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[#070b14] border border-[#1d2a3e] text-[#3da9fc] font-heading font-bold text-xs flex items-center justify-center mt-0.5">
                  {item.number}
                </span>
                <span className="text-[#c9d3dc]">{item.text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 pt-6 border-t border-[#1d2a3e] flex items-center gap-3 text-xs text-[#9db0c8]">
            <ShieldAlert className="w-4 h-4 text-[#3da9fc] flex-shrink-0" />
            <span>
              For questions regarding scope, pricing adjustments, or custom enterprise requirements, contact Samarth Zende directly on WhatsApp or Gmail.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
