import React from 'react';
import { Laptop, PhoneCall, ShieldCheck, Crown, Wrench, Zap, Smartphone, Headphones, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { language } = useLanguage();

  const getLocalizedContent = () => {
    if (language === 'mr') {
      return {
        tag: 'स्टुडिओची ओळख',
        title: 'सॅमझेन वेब डेव्हलपमेंट विषयी',
        desc: 'स्थानिक व्यावसायिक, दुकाने, कोचिंग क्लासेस आणि हॉटेल्ससाठी आधुनिक, वेगवान आणि दर्जेदार वेबसाइट्सची निर्मिती. कोणतेही रेडीमेड बोगस टेम्प्लेट्स न वापरता अस्सल कोडिंग.',
        pillar1Title: 'अस्सल व स्वतंत्र डिझाइन',
        pillar1Desc: 'आपल्या ब्रँडच्या नेमक्या आवडीनुसार वेगळी व आकर्षक रचना.',
        pillar2Title: 'हमखास पोस्ट-डिलिव्हरी सपोर्ट',
        pillar2Desc: 'प्रत्येक प्लॅनमध्ये ७ ते २१ दिवसांचा मोफत सर्व्हिस मेंटेनन्स सपोर्ट.',
        pillar3Title: 'थेट संवाद (Direct Contact)',
        pillar3Desc: 'कंपनीचे १००% एकमेव मालक मिस्टर समर्थ झेंडे यांच्याशी थेट संवाद. (सहाय्यक: मिस्टर शर्विन शिंदे).',
      };
    }
    if (language === 'hi') {
      return {
        tag: 'कंपनी परिचय',
        title: 'सॅमझेन वेब डेवलपमेंट के बारे में',
        desc: 'दुकानों, कोचिंग, होटलों और व्यवसायों के लिए आधुनिक, तीव्र गति और मोबाइल-फ्रेंडली वेबसाइट्स। बिना किसी रेडीमेड क्लोन के सीधा और प्रामाणिक कोडिंग अनुभव।',
        pillar1Title: 'विशेष कस्टम डिज़ाइन',
        pillar1Desc: 'आपकी पसंद और व्यवसाय के अनुरूप अलग व आकर्षक मोबाइल-फ्रेंडली वेबसाइट।',
        pillar2Title: 'मुफ्त पोस्ट-डिलीवरी सपोर्ट',
        pillar2Desc: 'हर पैकेज में ७ से २१ दिनों का फ्री मेंटेनेंस सपोर्ट उपलब्ध।',
        pillar3Title: 'सीधा व पारदर्शी संपर्क',
        pillar3Desc: 'कंपनी के १००% एकमात्र मालिक मिस्टर समर्थ झेंडे से सीधा संपर्क। (सहायक: मिस्टर शर्विन शिंदे).',
      };
    }
    return {
      tag: 'About The Studio',
      title: 'About SAMZEN Web Development',
      desc: 'SAMZEN Web Development delivers customized, high-performance websites and digital solutions for local shops, coaching institutes, hotels, and businesses. Handcrafted modern code with zero generic templates.',
      pillar1Title: 'Bespoke Handcrafted Design',
      pillar1Desc: 'Custom-tailored to your business colors, identity, and customer conversion goals.',
      pillar2Title: 'Post-Delivery Guarantee',
      pillar2Desc: 'Every plan includes a free service support window (7 to 21 days) for smooth maintenance.',
      pillar3Title: 'Direct Owner Communication',
      pillar3Desc: 'Speak directly with 100% Sole Owner Mr. Samarth Zende without middlemen. (Assisted by helper Mr. Sharven Shinde).',
    };
  };

  const content = getLocalizedContent();

  const highlights = language === 'mr' ? [
    { title: 'जलद व सुरक्षित', desc: 'मोबाईल, टॅबलेट व कॉम्प्युटरवर तत्काळ लोड होणाऱ्या वेबसाइट्स' },
    { title: 'थेट व्हॉट्सॲप व कॉलिंग', desc: 'ग्राहकांशी १-टॅप संपर्क आणि गुगल मॅप लोकेशन' },
    { title: '१००% अस्सल कोडिंग', desc: 'कोणतेही स्लो किंवा बनावट रेडीमेड टेम्प्लेट्स नाहीत' },
    { title: 'मोफत पोस्ट-लाँच सपोर्ट', desc: 'वेबसाइट लाईव्ह झाल्यानंतरही पूर्ण तांत्रिक मदत' }
  ] : language === 'hi' ? [
    { title: 'तीव्र गति व सुरक्षित', desc: 'मोबाइल, टैबलेट व कंप्यूटर पर तुरंत खुलने वाली वेबसाइट्स' },
    { title: 'सीधा व्हाट्सऐप व कॉलिंग', desc: 'ग्राहकों से १-टैप बातचीत और गूगल मैप लोकेशन' },
    { title: '१००% शुद्ध कोडिंग', desc: 'धीमे या कॉपी-पेस्ट रेडीमेड टेम्पलेट्स से मुक्त' },
    { title: 'मुफ्त पोस्ट-लॉन्च सपोर्ट', desc: 'वेबसाइट लाइव होने के बाद भी पूरी तकनीकी सहायता' }
  ] : [
    { title: 'Lightning Fast & Secure', desc: 'Optimized for instant mobile, tablet, and desktop loading' },
    { title: '1-Tap Direct WhatsApp', desc: 'Instant calling, WhatsApp leads, and live Google Maps' },
    { title: 'Handcrafted Code', desc: 'Zero bloated, slow, or generic cloned templates' },
    { title: 'Guaranteed Free Support', desc: 'Continuous maintenance assistance after project delivery' }
  ];

  return (
    <section id="about" className="py-12 md:py-16 border-b border-[#1d2a3e] bg-[#070b14]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header - Clean & Compact */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-1.5">
            {content.tag}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            {content.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#9db0c8] leading-relaxed">
            {content.desc}
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-5 hover:border-[#3da9fc]/60 transition">
            <div className="w-9 h-9 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#3da9fc] mb-3">
              <Laptop className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading text-white mb-1.5">{content.pillar1Title}</h3>
            <p className="text-xs text-[#9db0c8] leading-relaxed">
              {content.pillar1Desc}
            </p>
          </div>

          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-5 hover:border-[#3da9fc]/60 transition">
            <div className="w-9 h-9 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#59e3ff] mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading text-white mb-1.5">{content.pillar2Title}</h3>
            <p className="text-xs text-[#9db0c8] leading-relaxed">
              {content.pillar2Desc}
            </p>
          </div>

          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-5 hover:border-[#3da9fc]/60 transition">
            <div className="w-9 h-9 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#3da9fc] mb-3">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading text-white mb-1.5">{content.pillar3Title}</h3>
            <p className="text-xs text-[#9db0c8] leading-relaxed">
              {content.pillar3Desc}
            </p>
          </div>
        </div>

        {/* Company Ownership & Leadership Card */}
        <div className="panel bg-[#0b1220] border-2 border-[#3da9fc]/60 rounded-2xl p-5 mb-10 shadow-xl shadow-[#3da9fc]/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1d2a3e]">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40" />
              <span>Company Ownership &amp; Leadership</span>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-[#070b14] px-2.5 py-0.5 rounded-md border border-amber-400/40 flex items-center gap-1.5 font-bold">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
              <span>100% Sole Owner</span>
            </span>
          </div>

          <div className="space-y-3">
            {/* Mr. Samarth Zende - 100% Owner of Company (Short & Compact) */}
            <div className="p-4 sm:p-4.5 rounded-xl bg-gradient-to-br from-[#0e1726] to-[#070b14] border border-amber-400/70 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Crown className="w-4 h-4 fill-amber-400/40" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold font-heading text-white flex items-center gap-1.5">
                      <span>Mr. Samarth Zende</span>
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40 inline-block" />
                    </h4>
                    <p className="text-[11px] font-bold text-[#59e3ff]">
                      100% Owner of Company &bull; Founder and CEO
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-[#070b14] px-2 py-0.5 rounded border border-amber-400/40 font-bold">
                  Owner
                </span>
              </div>
              <p className="text-xs text-[#c9d3dc]">
                100% Owner &amp; CEO of SAMZEN. Architect of all websites.
              </p>
            </div>

            {/* Mr. Sharven Shinde - Co-Founder with Bright Blue Border (Short & Compact) */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#070b14]/70 border-2 border-[#3da9fc] text-left">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0e1726] border border-[#3da9fc] flex items-center justify-center text-[#3da9fc]">
                    <Wrench className="w-3 h-3 text-[#3da9fc]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md border-2 border-[#3da9fc] bg-[#3da9fc]/20 text-white font-bold text-xs shadow-md shadow-[#3da9fc]/40 ring-2 ring-[#3da9fc]/60">
                    Mr. Sharven Shinde
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0e1726] border border-[#3da9fc]/50 text-[#59e3ff] font-semibold">
                    Co-Founder
                  </span>
                </div>
                <span className="text-[10px] text-[#9db0c8] font-mono">Helper</span>
              </div>
              <p className="text-xs text-[#9db0c8]">
                Co-Founder &amp; helper assisting Mr. Samarth Zende with routine support.
              </p>
            </div>
          </div>
        </div>

        {/* Compact Key Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {highlights.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#0e1726]/60 border border-[#1d2a3e] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#59e3ff] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">{item.title}</div>
                <div className="text-[11px] text-[#9db0c8] mt-0.5 leading-snug">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
