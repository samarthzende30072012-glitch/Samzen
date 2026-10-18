import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import samarthOfficialPhoto from '../assets/images/samzen_founder_official.jpg';
import { 
  ShieldCheck, 
  Crown, 
  Code2, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2, 
  Layers, 
  UserPlus 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutLeadership: React.FC = () => {
  const { language } = useLanguage();

  const scrollToCareers = () => {
    const el = document.getElementById('careers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="leadership" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[350px] bg-gradient-to-r from-[#3da9fc]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <Crown className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Leadership &amp; Organization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            About Me &amp; Executive Leadership
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            {language === 'mr'
              ? 'समर्थ झेंडे हे सॅमझेन वेब डेव्हलपमेंटचे एकमेव संस्थापक व मुख्य कार्यकारी अधिकारी (Founder & CEO) आहेत. आमचे नेतृत्व आणि वाढणाऱ्या टीमची ओळख येथे पहा.'
              : language === 'hi'
              ? 'समर्थ झेंडे सैमज़ेन वेब डेवलपमेंट के एकमात्र संस्थापक व मुख्य कार्यकारी अधिकारी (Founder & CEO) हैं। स्टूडियो के नेतृत्व और सह-संस्थापक पदों का विवरण।'
              : 'Samarth Zende is the sole Founder & CEO of SAMZEN Web Development. Learn about our leadership structure and open executive partnership positions.'}
          </p>
        </div>

        {/* Sole Founder Exclusivity Banner */}
        <div className="banner mb-12 bg-gradient-to-r from-[#0b1220] via-[#0e1726] to-[#0b1220] border border-[#3da9fc]/60 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#3da9fc]/20 border border-[#3da9fc]/40 flex items-center justify-center flex-shrink-0 text-[#59e3ff]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                  Sole Founder &amp; CEO Exclusivity Rule
                </h3>
                <span className="text-[10px] font-mono uppercase bg-[#3da9fc]/20 text-[#59e3ff] px-2 py-0.5 rounded border border-[#3da9fc]/30 font-bold">
                  Official Policy
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9db0c8] mt-1 max-w-2xl leading-relaxed">
                Samarth Zende exclusively holds the official title of <strong>Founder &amp; CEO</strong> of SAMZEN Web Development. No other partner or member can hold or share the Founder title. Top applicants can partner as Co-Founders, contractors, or team associates.
              </p>
            </div>
          </div>

          <button
            onClick={scrollToCareers}
            className="btn-interactive btn-shimmer-visible whitespace-nowrap px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#3da9fc]/25 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join Our Team</span>
          </button>
        </div>

        {/* Executive Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Samarth Zende - Sole Founder & CEO */}
          <div className="md:col-span-12 lg:col-span-5 panel bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-[#3da9fc]/15 relative overflow-hidden group">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#3da9fc]/15 rounded-full blur-2xl pointer-events-none -z-0" />

            <div className="relative z-10">
              {/* Badge Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#3da9fc]/25 to-[#59e3ff]/25 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/50 flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Sole Founder &amp; CEO</span>
                </span>
                <span className="text-[11px] font-mono text-[#9db0c8] bg-[#070b14] px-2.5 py-1 rounded-md border border-[#1d2a3e]">
                  Age 12 &bull; Youth Tech Leader
                </span>
              </div>

              {/* Founder Profile Layout */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start mb-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#59e3ff] shadow-xl flex-shrink-0 group-hover:scale-105 transition duration-300">
                  <img
                    src={samarthOfficialPhoto}
                    alt={SAMZEN_BRAND.developer}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/70 to-transparent pointer-events-none" />
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold font-heading text-white">
                    {SAMZEN_BRAND.developer}
                  </h3>
                  <div className="text-xs font-semibold text-[#59e3ff] mt-0.5 mb-2">
                    Founder &amp; CEO &bull; Full-Stack Web Developer &bull; Digital Creator
                  </div>
                  <p className="text-xs text-[#9db0c8] leading-relaxed">
                    Sole architect, creative director, and executive leader of SAMZEN Web Development. Leads all website architecture, modern frontend development, custom client designs, and digital media production.
                  </p>
                </div>
              </div>

              {/* Responsibilities & Authority */}
              <div className="space-y-2 pt-4 border-t border-[#1d2a3e] text-xs text-[#c9d3dc]">
                <div className="font-semibold text-white uppercase text-[11px] tracking-wider mb-1 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#3da9fc]" />
                  <span>Core Leadership Responsibilities:</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0" />
                  <span>Direct website architecture, coding, and production launch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0" />
                  <span>Client relationship management, pricing, and project approvals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0" />
                  <span>Audio tracks, AI media generation, and creative digital suite</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1d2a3e] flex items-center justify-between text-xs text-[#9db0c8]">
              <span>Direct WhatsApp: <strong>8605042855</strong></span>
              <span className="text-[#59e3ff] font-semibold">Active &bull; Available</span>
            </div>
          </div>

          {/* Right Column: Open Executive Leadership & Partnership Spots */}
          <div className="md:col-span-12 lg:col-span-7 flex flex-col justify-between gap-4">
            
            {/* Spot 2: Co-Founder (Website Builder) */}
            <div className="panel bg-[#0b1220] hover:bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] rounded-2xl p-5 sm:p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3da9fc]/10 text-[#3da9fc] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-heading">
                      Co-Founder &mdash; Website Builder
                    </h4>
                    <span className="text-[11px] text-[#59e3ff] font-medium">
                      Executive Tech Partner &bull; Project Payout: 20% &ndash; 25%
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Open Spot
                </span>
              </div>
              <p className="text-xs text-[#9db0c8] leading-relaxed mb-3">
                Builds and codes complete client websites alongside Founder &amp; CEO Samarth Zende. Top-level role for skilled developers, web creators, and UI/UX designers looking for high-percentage project earnings.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1d2a3e]/70 text-xs">
                <span className="text-[#c9d3dc]">Requirements: HTML/CSS, React, Tailwind, responsive design</span>
                <button
                  onClick={scrollToCareers}
                  className="text-[#59e3ff] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Spot 3: Contractor (Client Finder) */}
            <div className="panel bg-[#0b1220] hover:bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] rounded-2xl p-5 sm:p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3da9fc]/10 text-[#3da9fc] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-heading">
                      Contractor &mdash; Client Finder &amp; Partner
                    </h4>
                    <span className="text-[11px] text-[#59e3ff] font-medium">
                      Business Development &bull; Commission: 10% &ndash; 20%
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Open Spot
                </span>
              </div>
              <p className="text-xs text-[#9db0c8] leading-relaxed mb-3">
                Contacts local shops, coaching institutes, salons, restaurants, and businesses. Brings in client website orders and receives instant direct commissions upon project confirmation.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1d2a3e]/70 text-xs">
                <span className="text-[#c9d3dc]">Ideal for: Freelancers, sales enthusiasts, student connectors</span>
                <button
                  onClick={scrollToCareers}
                  className="text-[#59e3ff] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Spot 4: Remote Operations & Field Representatives */}
            <div className="panel bg-[#0b1220] hover:bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] rounded-2xl p-5 sm:p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3da9fc]/10 text-[#3da9fc] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-heading">
                      Remote Helpers &amp; Official Field Reps
                    </h4>
                    <span className="text-[11px] text-[#59e3ff] font-medium">
                      Customer Coordination &bull; 5% &ndash; 10% / Role-Based Pay
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Multiple Openings
                </span>
              </div>
              <p className="text-xs text-[#9db0c8] leading-relaxed mb-3">
                Home workers handle phone calls and website updates remotely (5%–10%). Official field reps visit clients face-to-face for consultations and photo/logo collection.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1d2a3e]/70 text-xs">
                <span className="text-[#c9d3dc]">Work remotely from home or in your local town</span>
                <button
                  onClick={scrollToCareers}
                  className="text-[#59e3ff] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
