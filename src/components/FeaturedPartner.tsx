import React from 'react';
import { Sparkles, TrendingUp, ArrowUpRight, ShieldCheck, CheckCircle2, BarChart2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FeaturedPartner: React.FC = () => {
  const { language } = useLanguage();

  const partnerTags = [
    'Indian Stock Market',
    'Forex Trading',
    'Crypto Markets',
    'Price Action & Risk Management'
  ];

  return (
    <section id="partner" className="py-16 md:py-20 border-b border-[#1d2a3e] bg-[#070b14] relative overflow-hidden scroll-mt-20">
      {/* Ambient background cyan glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[300px] bg-gradient-to-l from-[#59e3ff]/10 via-[#3da9fc]/5 to-transparent blur-3xl pointer-events-none -z-10 gpu-layer" />

      <div className="wrap max-w-[860px] mx-auto px-4 sm:px-6">
        
        {/* Eyebrow Label & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <Sparkles className="w-3.5 h-3.5 text-[#59e3ff]" />
            <span>Sponsored Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Featured Sponsored Partner
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#9db0c8]">
            {language === 'mr'
              ? 'सॅमझेनच्या अधिकृत प्लॅटफॉर्मवर वैशिष्ट्यीकृत पार्टनर — व्यावसायिक ट्रेडिंगचे दर्जेदार शिक्षण.'
              : language === 'hi'
              ? 'सैमज़ेन के आधिकारिक प्लेटफॉर्म पर विशेष प्रायोजित भागीदार — प्रोफेशनल ट्रेडिंग शिक्षा।'
              : 'Official verified spotlight partner featured on SAMZEN Web Development platform.'}
          </p>
        </div>

        {/* High-Converting Sponsored Partner Card (.panel with glowing --cyan border highlight) */}
        <div className="panel bg-[#0e1726] border-2 border-[#59e3ff] rounded-2xl p-6 sm:p-9 shadow-2xl shadow-[#59e3ff]/15 relative overflow-hidden group transition-all duration-300 hover:shadow-[#59e3ff]/25">
          {/* Top Subtle Cyan Glow Light */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#59e3ff]/10 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Header / Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#59e3ff]/20 to-[#3da9fc]/20 text-[#59e3ff] text-xs font-bold border border-[#59e3ff]/50 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#59e3ff]" />
              <span>Official Featured Partner on SAMZEN</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#9db0c8] bg-[#070b14] px-2.5 py-1 rounded-md border border-[#1d2a3e]">
              <TrendingUp className="w-3 h-3 text-[#59e3ff]" />
              <span>Verified Educational Platform</span>
            </div>
          </div>

          {/* Course Title & Intro */}
          <div className="relative z-10 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#59e3ff]/20 to-[#3da9fc]/20 border border-[#59e3ff]/40 flex items-center justify-center text-[#59e3ff] flex-shrink-0 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight group-hover:text-[#59e3ff] transition-colors">
                  Pro Trading Course
                </h3>
                <span className="text-xs text-[#59e3ff] font-medium">
                  Complete Financial Markets Mastery Program
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#eef3fa] leading-relaxed mt-3">
              Learn professional trading from scratch across the <strong>Indian Stock Market</strong>, <strong>Forex</strong>, and <strong>Crypto markets</strong>. Master advanced price action, risk management, and winning strategies with the Pro Trading Course, featured here on <strong>https://samzen.ai.studio</strong>!
            </p>
          </div>

          {/* Key Highlights / Tags (.tags) */}
          <div className="relative z-10 mb-8 pt-4 border-t border-[#1d2a3e]">
            <div className="text-[11px] uppercase font-bold tracking-wider text-[#9db0c8] mb-2.5">
              Key Course Curriculums &amp; Highlights:
            </div>
            <div className="tags flex flex-wrap gap-2">
              {partnerTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-[#eef3fa] bg-[#070b14] border border-[#1d2a3e] hover:border-[#59e3ff]/60 transition"
                >
                  &bull; {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button: Glowing cyan button linking directly to https://protradingcourse.ai.studio */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1d2a3e]">
            <div className="text-xs text-[#9db0c8] text-center sm:text-left">
              Direct access to live masterclasses, mentorship, and trading strategies.
            </div>

            <a
              href="https://protradingcourse.ai.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer-visible btn-glow-pulse btn-interactive w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#59e3ff] to-[#3da9fc] hover:from-[#3da9fc] hover:to-[#59e3ff] text-[#070b14] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#59e3ff]/30 cursor-pointer"
            >
              <span>Explore Pro Trading Course</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
