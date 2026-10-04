import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { ShieldCheck, Award, MessageSquare, Mail, Code2, Sparkles, CheckCircle2, ArrowUpRight, Laptop, Clock } from 'lucide-react';
import samarthOfficialPhoto from '../assets/images/samzen_founder_official.jpg';

export const FounderCEO: React.FC = () => {
  return (
    <section id="founder" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-[#3da9fc]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Kicker & Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <Award className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Executive Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
            Founder &amp; CEO
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#9db0c8]">
            Direct leadership and engineering from the founder of SAMZEN Web Development.
          </p>
        </div>

        {/* Main Founder & CEO Feature Card */}
        <div className="rounded-2xl bg-[#0b1220] border border-[#1d2a3e] p-6 sm:p-10 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Original Uploaded Photograph */}
            <div className="lg:col-span-5 max-w-md mx-auto w-full">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] opacity-25 blur-lg group-hover:opacity-35 transition duration-500" />

                {/* Photo frame - Clean, unobscured container displaying original image asset */}
                <div className="relative rounded-xl bg-[#0e1726] border border-[#1d2a3e] p-3 shadow-2xl">
                  <div className="rounded-lg overflow-hidden bg-[#070b14] border border-[#1d2a3e]/60">
                    <img
                      src={samarthOfficialPhoto}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = '/public/samzen_founder_official.jpg';
                      }}
                      alt="Samarth Zende - Founder & CEO — SAMZEN Web Development"
                      className="w-full h-auto block rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Identification Caption directly beneath photo */}
                  <div className="mt-3 px-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#3da9fc]/10 border border-[#3da9fc]/30 text-[#59e3ff] text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-[#3da9fc]" />
                        <span>Official Leadership</span>
                      </div>
                      <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                      Samarth Zende
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#59e3ff]">
                      Founder &amp; CEO &mdash; SAMZEN Web Development
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Founder & CEO Presentation & Message */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#3da9fc]/10 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/30 uppercase tracking-wide">
                  Founder &amp; CEO
                </span>
                <span className="text-xs text-[#9db0c8]">
                  19-Year-Old Founder &amp; Web Developer
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Samarth Zende
              </h3>
              <p className="text-base sm:text-lg font-semibold text-[#59e3ff] mt-1 mb-4">
                Founder &amp; CEO &mdash; SAMZEN Web Development
              </p>

              {/* Founder Statement */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#070b14]/90 border-l-4 border-[#3da9fc] border-t border-r border-b border-[#1d2a3e] mb-6">
                <p className="text-sm sm:text-base text-[#eef3fa] leading-relaxed italic">
                  &ldquo;At SAMZEN Web Development, I personally oversee and build your digital presence from foundation to deployment. We build responsive, reliable, high-performance websites for businesses, shops, coaching centers, and professionals with zero bloated templates and direct personal support.&rdquo;
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#9db0c8]">
                  <span className="font-semibold text-white">&mdash; Samarth Zende</span>
                  <span className="text-[#59e3ff]">SAMZEN Web Development</span>
                </div>
              </div>

              {/* Core Pillars */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#3da9fc]/10 text-[#3da9fc] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#3da9fc]/20">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full-Stack Web Engineering</h4>
                    <p className="text-xs sm:text-sm text-[#9db0c8] mt-0.5">
                      Tailored web solutions crafted specifically for your industry, optimized for ultra-fast loading and smooth mobile responsiveness.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#3da9fc]/10 text-[#59e3ff] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#3da9fc]/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Guaranteed Post-Delivery Free Support</h4>
                    <p className="text-xs sm:text-sm text-[#9db0c8] mt-0.5">
                      Every project comes with 7 to 21 days of free post-delivery maintenance and bug-free operational guarantee.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#3da9fc]/10 text-[#3da9fc] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#3da9fc]/20">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Executive Communication</h4>
                    <p className="text-xs sm:text-sm text-[#9db0c8] mt-0.5">
                      Work directly with Samarth Zende via WhatsApp (+91 8605042855) or Gmail with no agency middlemen or communication delays.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={SAMZEN_BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs sm:text-sm transition shadow-lg shadow-[#25D366]/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Samarth on WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href={SAMZEN_BRAND.gmailDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-white font-medium text-xs sm:text-sm transition"
                >
                  <Mail className="w-4 h-4 text-[#59e3ff]" />
                  <span>Email: {SAMZEN_BRAND.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
