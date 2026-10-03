import React, { useState } from 'react';
import { BUSINESS_TYPES, OTHER_SERVICES, TEMPLATE_CATEGORIES } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { Sparkles, Layout, Globe, Search, Layers, ArrowUpRight } from 'lucide-react';

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBusinesses = BUSINESS_TYPES.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="services" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#0b1220]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
              Capabilities &amp; Scope
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
              Websites for every type of business
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
              Your business. Your requirements. Your website. We engineer customized digital solutions for commercial, educational, and service operations.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Find your business type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc] transition"
            />
          </div>
        </div>

        {/* Business Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-16">
          {filteredBusinesses.map((bType, idx) => (
            <div
              key={idx}
              className="group p-4 rounded-xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#59e3ff]">{(idx + 1).toString().padStart(2, '0')}</span>
                <Globe className="w-3.5 h-3.5 text-[#9db0c8] group-hover:text-[#59e3ff] transition" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-[#59e3ff] transition">
                {bType}
              </h4>
              <p className="text-[11px] text-[#9db0c8] mt-1">
                Custom layout &amp; contact features
              </p>
            </div>
          ))}
          {filteredBusinesses.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-[#9db0c8] bg-[#0e1726] rounded-xl border border-[#1d2a3e]">
              No exact match found, but SAMZEN builds custom websites for any custom business requirement!
            </div>
          )}
        </div>

        {/* Other Services by SAMZEN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-[#3da9fc]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-[#59e3ff]">Creative Suite</p>
                <h3 className="text-xl font-bold font-heading text-white">Other Services by SAMZEN</h3>
              </div>
            </div>

            <p className="text-sm text-[#9db0c8] mb-6 leading-relaxed">
              Beyond websites, SAMZEN creates cutting-edge digital media assets and creative AI media to supercharge your brand presence:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {OTHER_SERVICES.map((serv, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded bg-[#070b14]/70 border border-[#1d2a3e]/60 text-xs text-[#c9d3dc]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59e3ff]" />
                  <span>{serv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Templates Section */}
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-[#59e3ff]">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-[#3da9fc]">Ready Blueprints</p>
                  <h3 className="text-xl font-bold font-heading text-white">Custom Business Templates</h3>
                </div>
              </div>

              <p className="text-sm text-[#9db0c8] mb-6 leading-relaxed">
                Pre-engineered, tested website layouts tailored specifically for high conversion across industries:
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {TEMPLATE_CATEGORIES.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-md bg-[#070b14] border border-[#1d2a3e] text-[#c9d3dc]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070b14]/90 border border-[#3da9fc]/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Have a specific template in mind?</div>
                <div className="text-[11px] text-[#9db0c8]">Every template is fully customized to your colors and branding.</div>
              </div>
              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#59e3ff] hover:underline whitespace-nowrap ml-3"
              >
                <span>Discuss</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
