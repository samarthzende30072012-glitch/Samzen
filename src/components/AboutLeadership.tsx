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
  UserPlus,
  Wrench 
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
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-amber-400/40">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Company Ownership &amp; Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Company Owner &amp; Team Structure
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            {language === 'mr'
              ? 'मिस्टर समर्थ झेंडे हे १००% एकमेव मालक, संस्थापक व मुख्य कार्यकारी अधिकारी (CEO) आहेत. मिस्टर शर्विन शिंदे हे को-फाउंडर व साहाय्यक (Helper) आहेत.'
              : language === 'hi'
              ? 'मिस्टर समर्थ झेंडे १००% एकमात्र मालिक, संस्थापक व मुख्य कार्यकारी अधिकारी (CEO) हैं। मिस्टर शर्विन शिंदे को-फाउंडर व सहायक (Helper) हैं।'
              : 'Mr. Samarth Zende is 100% Sole Owner, Founder & CEO. Mr. Sharven Shinde is Co-Founder & Helper.'}
          </p>
        </div>

        {/* Sole Owner Exclusivity Banner */}
        <div className="banner mb-8 bg-gradient-to-r from-[#0b1220] via-[#0e1726] to-[#0b1220] border border-amber-400/60 p-4 sm:p-5 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center flex-shrink-0 text-amber-300">
              <Crown className="w-5 h-5 fill-amber-400/40" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-heading text-white">
                  100% Sole Company Ownership &amp; Authority
                </h3>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 font-bold">
                  Sole Owner
                </span>
              </div>
              <p className="text-xs text-[#c9d3dc] mt-0.5">
                <strong>Mr. Samarth Zende</strong> is 100% <strong>Sole Owner, Founder &amp; CEO</strong>. <strong>Mr. Sharven Shinde</strong> is <strong>Co-Founder &amp; Helper</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={scrollToCareers}
            className="btn-interactive btn-shimmer-visible whitespace-nowrap px-4 py-2 rounded-lg bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Our Team</span>
          </button>
        </div>

        {/* Executive Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Card 1: Samarth Zende - 100% Owner of Company, Founder & CEO (Short & Clean) */}
          <div className="md:col-span-12 lg:col-span-5 panel bg-[#0e1726] border-2 border-amber-400/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl shadow-amber-400/10 relative overflow-hidden group">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -z-0" />

            <div className="relative z-10">
              {/* Badge Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/25 to-[#3da9fc]/25 text-amber-300 text-xs font-bold border border-amber-400/60 flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                  <span>100% OWNER &bull; FOUNDER AND CEO</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-[#070b14] px-2 py-0.5 rounded border border-amber-400/40 font-bold">
                  Sole Owner
                </span>
              </div>

              {/* Founder Profile Layout */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 group-hover:scale-105 transition duration-300">
                  <img
                    src={samarthOfficialPhoto}
                    alt="Mr. Samarth Zende - Sole Owner of Company, Founder and CEO"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/70 to-transparent pointer-events-none" />
                  <div className="absolute top-1 right-1 p-0.5 rounded bg-[#070b14]/90 text-amber-400">
                    <Crown className="w-3.5 h-3.5 fill-amber-400/40" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <Crown className="w-5 h-5 text-amber-400 flex-shrink-0 fill-amber-400/30" />
                    <h3 className="text-xl font-bold font-heading text-white">
                      Mr. Samarth Zende
                    </h3>
                  </div>
                  <div className="text-xs font-bold text-[#59e3ff] mt-0.5 mb-1.5">
                    100% Owner of Company &bull; Founder and CEO
                  </div>
                  <p className="text-xs text-[#9db0c8]">
                    100% Owner &amp; CEO of SAMZEN. Architect of all website solutions.
                  </p>
                </div>
              </div>

              {/* Responsibilities & Authority */}
              <div className="space-y-1.5 pt-3 border-t border-[#1d2a3e] text-xs text-[#c9d3dc]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0" />
                  <span>100% Company ownership, equity, and strategic direction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0" />
                  <span>Direct website architecture, custom coding, and client delivery</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1d2a3e] flex items-center justify-between text-xs text-[#9db0c8]">
              <span>Direct WhatsApp: <strong>8605042855</strong></span>
              <span className="text-[#59e3ff] font-semibold">Active &bull; Available</span>
            </div>
          </div>

          {/* Right Column: Helper & Support Team Spots */}
          <div className="md:col-span-12 lg:col-span-7 flex flex-col justify-between gap-3">
            
            {/* Spot 1: Co-Founder & Routine Helper (Mr. Sharven Shinde) with Blue Border (Short & Clean) */}
            <div className="panel bg-[#070b14]/70 border-2 border-[#3da9fc] rounded-xl p-3.5 sm:p-4 text-left transition duration-200 shadow-sm shadow-[#3da9fc]/10">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0e1726] text-[#3da9fc] flex items-center justify-center font-bold text-xs border border-[#3da9fc]/50">
                    <Wrench className="w-3.5 h-3.5 text-[#3da9fc]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white font-heading flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md border-2 border-[#3da9fc] bg-[#3da9fc]/20 text-white font-bold text-xs shadow-md shadow-[#3da9fc]/40 ring-2 ring-[#3da9fc]/60">
                        Mr. Sharven Shinde
                      </span>
                    </h4>
                    <span className="text-[10px] text-[#9db0c8] font-normal mt-0.5 block">
                      Co-Founder &bull; Routine Helper &amp; Support Worker
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase bg-[#0e1726] text-[#59e3ff] border border-[#3da9fc]/50 px-2 py-0.5 rounded font-bold">
                  Co-Founder (Helper)
                </span>
              </div>
              <p className="text-xs text-[#9db0c8] mt-1">
                Co-Founder &amp; helper assisting Mr. Samarth Zende with routine support.
              </p>
              <div className="flex items-center justify-between pt-1.5 mt-2 border-t border-[#1d2a3e]/40 text-[10px] text-[#9db0c8]/70">
                <span>Operational Assistant to Owner</span>
                <span className="text-[#9db0c8] flex items-center gap-1">
                  <span>Non-Executive Helper</span>
                </span>
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
