import React, { useState } from 'react';
import { SPONSORSHIP_PLANS } from '../data/samzenData';
import { 
  Megaphone, 
  Sparkles, 
  Check, 
  ExternalLink, 
  ArrowUpRight, 
  Clock, 
  Calendar, 
  Infinity as InfinityIcon, 
  Image as ImageIcon, 
  Globe, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import demoAdImage from '../assets/images/hero_web_development_1791002831261.jpg';
import { useLanguage } from '../context/LanguageContext';

export const SponsorPortal: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('sponsor-lifetime');

  const handleBookSponsorship = (planName: string, price: string, duration: string) => {
    const text = encodeURIComponent(
      `Hello Samarth, I would like to book the *${planName} (${price} - ${duration})* to sponsor my website on the SAMZEN platform. Please share the ad banner specs and booking details.`
    );
    window.open(`https://wa.me/918605042855?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="sponsorship" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#3da9fc]/10 via-[#59e3ff]/5 to-transparent blur-3xl pointer-events-none -z-10 gpu-layer" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <Megaphone className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Promotions &amp; Sponsorships</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Sponsor Your Website on SAMZEN
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            {language === 'mr'
              ? 'आपला व्यवसाय, प्रोजेक्ट किंवा वेबसाइट सॅमझेनच्या अधिकृत प्लॅटफॉर्मवर झळकवा. स्वतःची जाहिरात इमेज, प्रोजेक्टचे नाव आणि थेट वेबसाइट लिंक जोडून नवीन ग्राहक मिळवा.'
              : language === 'hi'
              ? 'अपने व्यवसाय, प्रोजेक्ट या वेबसाइट को सैमज़ेन के आधिकारिक प्लेटफॉर्म पर प्रदर्शित करें। अपना विज्ञापन बैनर, प्रोजेक्ट का नाम और सीधा लिंक जोड़कर नए ग्राहक पाएं।'
              : 'Promote your business, brand, or project directly on the official SAMZEN platform with custom ad banners, project names, and verified clickable website links.'}
          </p>
        </div>

        {/* 4 Sponsorship Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SPONSORSHIP_PLANS.map((plan) => {
            const isLifetime = plan.featured;
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`plan ${isLifetime ? 'feat' : ''} cursor-pointer relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isLifetime
                    ? 'bg-[#0e1726] border-2 border-[#3da9fc] shadow-2xl shadow-[#3da9fc]/20'
                    : isSelected
                    ? 'bg-[#0e1726] border border-[#59e3ff]'
                    : 'bg-[#0b1220] border border-[#1d2a3e] hover:border-[#3da9fc]/60'
                }`}
              >
                {/* Lifetime Recommended Badge */}
                {isLifetime && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-[10px] font-extrabold uppercase tracking-wider shadow-md whitespace-nowrap animate-pulse">
                    ★ Best Value &bull; Permanent
                  </div>
                )}

                <div>
                  {/* Duration Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#9db0c8] uppercase">
                      {plan.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#59e3ff] bg-[#3da9fc]/10 px-2 py-0.5 rounded-full border border-[#3da9fc]/20">
                      {isLifetime ? <InfinityIcon className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{plan.duration}</span>
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-3xl font-extrabold font-heading text-white my-2 flex items-baseline gap-1">
                    <span className="bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#9db0c8] font-normal">
                      / {plan.duration.toLowerCase()}
                    </span>
                  </div>

                  <p className="text-xs text-[#9db0c8] mb-4">
                    {plan.id === 'sponsor-weekly' && 'Ideal for fast event promotions, launching offers, or seasonal boosts.'}
                    {plan.id === 'sponsor-monthly' && 'Full month of prominent exposure for growing local shops & clinics.'}
                    {plan.id === 'sponsor-yearly' && 'Comprehensive 365-day branding package for established businesses.'}
                    {plan.id === 'sponsor-lifetime' && 'One-time investment for permanent advertising space on SAMZEN.'}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-2 pt-3 border-t border-[#1d2a3e]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#c9d3dc]">
                      Included Promotion:
                    </div>
                    {plan.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-1.5 text-xs text-[#eef3fa]">
                        <Check className="w-3.5 h-3.5 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-[#1d2a3e]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookSponsorship(plan.name, plan.price, plan.duration);
                    }}
                    className={`btn-interactive w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      isLifetime
                        ? 'btn-shimmer-visible btn-glow-pulse bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] shadow-md shadow-[#3da9fc]/25'
                        : 'bg-[#1d2a3e] hover:bg-[#3da9fc] text-white hover:text-[#070b14]'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Book {plan.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured & Sponsored Websites Showcase */}
        <div className="panel bg-[#0b1220]/80 border border-[#1d2a3e] rounded-2xl p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1d2a3e]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#59e3ff]" />
                <h3 className="text-xl font-bold font-heading text-white">
                  Featured &amp; Sponsored Websites Showcase
                </h3>
              </div>
              <p className="text-xs text-[#9db0c8]">
                Real-time active ad slots hosted on the SAMZEN portal. Click to explore client projects.
              </p>
            </div>

            <button
              onClick={() => handleBookSponsorship('Ad Spot', '₹49 - ₹799', 'Custom Duration')}
              className="btn-interactive btn-shimmer-visible whitespace-nowrap px-4 py-2 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#3da9fc]/20 cursor-pointer self-start sm:self-auto"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Book Sponsorship Slot</span>
            </button>
          </div>

          {/* 3 Sleek Ad Slot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Slot 1: Active Demo Sponsor */}
            <div className="group rounded-xl bg-[#0e1726] border border-[#3da9fc]/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3da9fc]/15">
              <div>
                <div className="relative h-44 overflow-hidden bg-[#070b14]">
                  <img
                    src={demoAdImage}
                    alt="Apex Auto Garage & Detailing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[#070b14] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Sponsor</span>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#070b14]/80 text-[#59e3ff] text-[10px] font-mono border border-[#3da9fc]/40">
                    Lifetime Spot
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-[11px] font-mono text-[#59e3ff] uppercase mb-1">
                    Automotive &bull; Auto Detailing
                  </div>
                  <h4 className="text-base font-bold text-white font-heading group-hover:text-[#59e3ff] transition-colors">
                    Apex Auto Garage &amp; Detailing Studio
                  </h4>
                  <p className="text-xs text-[#9db0c8] mt-1.5 line-clamp-2 leading-relaxed">
                    Multi-brand auto maintenance, foam wash, and ceramic coating portal built and powered by SAMZEN Web Development.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#1d2a3e]/60 flex items-center justify-between mt-2">
                <span className="text-[11px] text-[#9db0c8]">Built by SAMZEN</span>
                <a
                  href="https://wa.me/918605042855?text=Hello%20Samarth%2C%20I%20saw%20Apex%20Auto%20Detailing%20on%20SAMZEN%20Sponsors!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#59e3ff] hover:text-white"
                >
                  <span>Visit Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Slot 2: Placeholder Slot A */}
            <div className="group rounded-xl bg-[#0e1726]/60 border border-dashed border-[#1d2a3e] hover:border-[#3da9fc] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 p-5 text-center">
              <div>
                <div className="h-36 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex flex-col items-center justify-center p-4 mb-4 group-hover:border-[#3da9fc]/40 transition">
                  <div className="w-12 h-12 rounded-xl bg-[#3da9fc]/10 text-[#59e3ff] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white font-heading">
                    Your Ad Banner Here
                  </span>
                  <span className="text-[10px] text-[#9db0c8] mt-0.5">
                    Available for ₹49 &bull; ₹149 &bull; ₹499 &bull; ₹799
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-heading">
                  Sponsor Slot #02 &mdash; Available
                </h4>
                <p className="text-xs text-[#9db0c8] mt-1.5 leading-relaxed">
                  Feature your shop, coaching class, salon, or digital brand directly on SAMZEN with verified traffic &amp; backlink.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1d2a3e]">
                <button
                  onClick={() => handleBookSponsorship('Slot #02', '₹49 – ₹799', 'Weekly to Lifetime')}
                  className="btn-interactive w-full py-2 px-3 rounded-lg bg-[#1d2a3e] hover:bg-[#3da9fc] text-white hover:text-[#070b14] text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Claim This Spot (From ₹49)</span>
                </button>
              </div>
            </div>

            {/* Slot 3: Placeholder Slot B */}
            <div className="group rounded-xl bg-[#0e1726]/60 border border-dashed border-[#1d2a3e] hover:border-[#3da9fc] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 p-5 text-center">
              <div>
                <div className="h-36 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex flex-col items-center justify-center p-4 mb-4 group-hover:border-[#3da9fc]/40 transition">
                  <div className="w-12 h-12 rounded-xl bg-[#59e3ff]/10 text-[#59e3ff] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white font-heading">
                    Sponsor Website &amp; Link
                  </span>
                  <span className="text-[10px] text-[#9db0c8] mt-0.5">
                    Includes direct WhatsApp &amp; website clicks
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-heading">
                  Sponsor Slot #03 &mdash; Available
                </h4>
                <p className="text-xs text-[#9db0c8] mt-1.5 leading-relaxed">
                  Eligible for all Advanced Plan clients or direct sponsors looking to reach local business owners across Maharashtra.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1d2a3e]">
                <button
                  onClick={() => handleBookSponsorship('Slot #03', '₹49 – ₹799', 'Weekly to Lifetime')}
                  className="btn-interactive w-full py-2 px-3 rounded-lg bg-[#1d2a3e] hover:bg-[#3da9fc] text-white hover:text-[#070b14] text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Claim This Spot (From ₹49)</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
