import React from 'react';
import { TrendingUp, ShieldCheck, DollarSign, Award, Layers, ArrowUpRight, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NetworkValuation: React.FC = () => {
  const { language } = useLanguage();

  const valuationMetrics = [
    'Brand Equity & Digital Assets',
    'Active Client Projects',
    'Creative Portfolio Value',
    'Expanding Ecosystem'
  ];

  const breakdownStats = [
    { label: 'Active Projects & Maintenance', value: '45+ Portals', sub: 'Verified Client Deliveries' },
    { label: 'Proprietary Digital Assets', value: '14+ Templates', sub: 'Custom High-Conversion UI' },
    { label: 'Commercial Network', value: '4 Tiers', sub: 'Sponsorship & Hiring Portals' },
    { label: 'Valuation Growth', value: '+142%', sub: 'Year-over-Year Expansion' }
  ];

  return (
    <section id="valuation" className="py-16 md:py-20 border-b border-[#1d2a3e] bg-[#0b1220]/50 relative overflow-hidden scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[350px] bg-gradient-to-r from-[#3da9fc]/10 to-transparent blur-3xl pointer-events-none -z-10 gpu-layer" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Eyebrow Label & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <TrendingUp className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Company Network &amp; Ecosystem Worth</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            SAMZEN Network Valuation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#9db0c8]">
            {language === 'mr'
              ? 'सॅमझेन नेटवर्कची सर्वसमावेशक आर्थिक ताकद व डिजिटल साम्राज्य मूल्य.'
              : language === 'hi'
              ? 'सैमज़ेन नेटवर्क का कुल अनुमानित बाजार मूल्य एवं डिजिटल एसेट मूल्यांकन।'
              : 'Comprehensive financial appraisal and ecosystem valuation of SAMZEN Web Development.'}
          </p>
        </div>

        {/* High-Impact Financial Showcase Card - Clean Border without loud blue line */}
        <div className="panel bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-9 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700">
          
          {/* Subtle Ambient Radial Light */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#3da9fc]/10 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Top Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#3da9fc]/20 to-[#59e3ff]/20 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/40 flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>Official Financial Appraisal</span>
            </span>

            <span className="text-[11px] font-mono text-[#9db0c8] bg-[#070b14] px-2.5 py-1 rounded-md border border-[#1d2a3e]">
              Updated &bull; Active Ecosystem
            </span>
          </div>

          {/* Main Valuation Display */}
          <div className="relative z-10 text-center sm:text-left mb-6 pb-6 border-b border-[#1d2a3e]">
            <span className="text-xs uppercase font-mono tracking-widest text-[#9db0c8] block mb-1">
              Total Estimated Network &amp; Ecosystem Worth
            </span>
            <div className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white my-2">
              <span className="bg-gradient-to-r from-[#3da9fc] via-[#59e3ff] to-white bg-clip-text text-transparent">
                ₹1.5L+ &bull; ₹1,15,237
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#c9d3dc] max-w-2xl leading-relaxed mt-3">
              The total estimated valuation of the expanding SAMZEN network, encompassing brand equity, digital assets, active project pipelines, proprietary templates, and creative media portfolios.
            </p>
          </div>

          {/* 4 Statistical Breakdown Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 relative z-10">
            {breakdownStats.map((stat, sIdx) => (
              <div key={sIdx} className="p-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-center sm:text-left">
                <div className="text-lg font-bold font-heading text-white">{stat.value}</div>
                <div className="text-[11px] font-semibold text-[#59e3ff]">{stat.label}</div>
                <div className="text-[10px] text-[#9db0c8] mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Key Metrics / Breakdown Tags (.tags) */}
          <div className="relative z-10 pt-2 border-t border-[#1d2a3e]">
            <div className="text-[11px] uppercase font-bold tracking-wider text-[#9db0c8] mb-2.5">
              Network Valuation Pillars &amp; Backing:
            </div>
            <div className="tags flex flex-wrap gap-2">
              {valuationMetrics.map((metric, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-[#59e3ff] bg-[#070b14] border border-[#3da9fc]/30 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#3da9fc]" />
                  <span>{metric}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
