import React from 'react';
import { REQUIREMENTS_CHECKLIST } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { CheckCircle2, ShieldCheck, Laptop, PhoneCall, Sparkles, FolderCheck } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            About The Studio
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            About SAMZEN Web Development
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] leading-relaxed">
            SAMZEN Web Development provides customized website development and digital solutions for businesses, organizations, educational services, local shops, professionals, and individuals who want a trustworthy, modern online presence.
          </p>
          <p className="mt-3 text-base text-[#9db0c8] leading-relaxed">
            Every website is designed around your specific requirements, business category, available brand assets, and selected features &mdash; built to be fast, responsive, and effortlessly accessible from any phone or computer.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-6 relative group hover:border-[#3da9fc]/60 transition">
            <div className="w-10 h-10 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#3da9fc] mb-4 group-hover:scale-110 transition">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Bespoke Design</h3>
            <p className="text-sm text-[#9db0c8] leading-relaxed">
              Every website is handcrafted to match your business type and colors, avoiding generic copy-paste templates.
            </p>
          </div>

          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-6 relative group hover:border-[#3da9fc]/60 transition">
            <div className="w-10 h-10 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#59e3ff] mb-4 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Post-Delivery Guarantee</h3>
            <p className="text-sm text-[#9db0c8] leading-relaxed">
              Every plan includes a free service support window (7, 14, or 21 days) to resolve any minor issues or questions.
            </p>
          </div>

          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-6 relative group hover:border-[#3da9fc]/60 transition">
            <div className="w-10 h-10 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#3da9fc] mb-4 group-hover:scale-110 transition">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Direct Communication</h3>
            <p className="text-sm text-[#9db0c8] leading-relaxed">
              Speak directly with Founder &amp; CEO Samarth Zende on WhatsApp or Gmail without middlemen or confusing agency layers.
            </p>
          </div>
        </div>

        {/* Why Your Business Needs a Website */}
        <div className="bg-[#0b1220] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 mb-16">
          <div className="max-w-2xl mb-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-1">
              Why It Matters
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Why your business needs a website
            </h3>
            <p className="text-sm text-[#9db0c8] mt-1">
              Your website is your business&rsquo;s official online identity &mdash; working 24/7 to build credibility:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-[#eef3fa]">
            {[
              'Build an official online presence',
              'Display products & service catalog',
              'Showcase genuine business photographs',
              'Provide direct calling & location address',
              'Offer 1-tap WhatsApp chat options',
              'Share announcements & updates',
              'Publish educational & course info',
              'Display downloadable resources',
              'Present your business professionally',
              'Reach customers on smartphones',
              'Enable online payments where applicable',
              'Build a lasting digital brand identity'
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded bg-[#070b14]/50 border border-[#1d2a3e]/40">
                <div className="w-4 h-4 rounded-full bg-[#3da9fc]/20 text-[#3da9fc] flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  ✓
                </div>
                <span className="text-xs sm:text-sm text-[#c9d3dc]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What do I need from you? */}
        <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-1">
              <FolderCheck className="w-3.5 h-3.5" />
              <span>Getting Started</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              What do I need from you?
            </h3>
            <p className="text-sm text-[#9db0c8] mt-1">
              The better the information and content provided, the more accurately your website will represent your business:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {REQUIREMENTS_CHECKLIST.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-[#9db0c8]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#3da9fc] flex-shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
