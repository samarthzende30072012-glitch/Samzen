import React from 'react';
import { TESTIMONIALS } from '../data/samzenData';
import { Star, MessageSquareQuote, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] text-xs font-semibold uppercase tracking-wider text-[#59e3ff] mb-3">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Trusted by Businesses &amp; Local Owners
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] leading-relaxed">
            See what business owners, tuition academies, salons, and factories in Maharashtra say about working directly with 14-year-old Founder Samarth Zende.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc]/60 transition flex flex-col justify-between shadow-xl relative group"
            >
              <div>
                {/* Top bar: Stars & Plan badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#59e3ff] bg-[#3da9fc]/10 px-2.5 py-0.5 rounded-full border border-[#3da9fc]/30">
                    {t.plan}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-[#eef3fa] leading-relaxed italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#1d2a3e] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm font-heading flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-[#59e3ff] font-medium">{t.businessName} &bull; {t.businessType}</p>
                  <p className="text-[11px] text-[#9db0c8]">{t.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                    Verified Client
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
