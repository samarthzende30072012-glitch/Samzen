import React from 'react';
import { REQUIREMENTS_CHECKLIST } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { ShieldCheck, Laptop, PhoneCall, FolderCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { language } = useLanguage();

  const getLocalizedContent = () => {
    if (language === 'mr') {
      return {
        tag: 'स्टुडिओची ओळख',
        title: 'सॅमझेन वेब डेव्हलपमेंट विषयी',
        desc1: 'सॅमझेन वेब डेव्हलपमेंट हे स्थानिक व्यावसायिक, दुकानदार, कोचिंग क्लासेस, हॉटेल्स, सलून आणि व्यक्तींसाठी दर्जेदार, वेगवान आणि मोबाईल-फ्रेंडली वेबसाइट्स तयार करते.',
        desc2: 'प्रत्येक वेबसाइट आपल्या व्यवसायाच्या नेमक्या गरजा, ब्रँड कलर्स आणि ग्राहकांना आकर्षित करणाऱ्या रचनेनुसार प्रत्यक्ष तयार केली जाते. कोणतेही रेडीमेड बोगस टेम्प्लेट्स न वापरता अस्सल कोडिंग केली जाते.',
        pillar1Title: 'अस्सल व स्वतंत्र डिझाइन',
        pillar1Desc: 'आपल्या व्यवसायाचे स्वरूप आणि आवडीनुसार प्रत्येक वेबसाइट वेगळी आणि आकर्षक बनवली जाते.',
        pillar2Title: 'काम पूर्ण झाल्यावर हमखास सपोर्ट',
        pillar2Desc: 'प्रत्येक प्लॅनमध्ये ७, १४ किंवा २१ दिवसांचा मोफत सर्व्हिस सपोर्ट मिळतो, जेणेकरून कोणतीही अडचण त्वरित सुटते.',
        pillar3Title: 'थेट संवाद (Direct Contact)',
        pillar3Desc: 'कोणत्याही मध्यस्थाशिवाय थेट संस्थापक व सीईओ समर्थ झेंडे यांच्याशी व्हॉट्सॲप किंवा ईमेलवर बोला.',
        whyTag: 'वेबसाइट का आवश्यक आहे?',
        whyTitle: 'आपल्या व्यवसायाला स्वतःची वेबसाइट का हवी?',
        whyDesc: 'वेबसाइट ही आपल्या व्यवसायाची २४ तास सुरू असणारी अधिकृत ओळख आहे:',
        checklistTag: 'सुरुवात करण्यासाठी',
        checklistTitle: 'आपल्याकडून काय माहिती हवी आहे?',
        checklistDesc: 'व्यवसायाची माहिती जितकी स्पष्ट असेल, तितकीच आपली वेबसाइट दर्जेदार आणि प्रभावी बनेल:',
      };
    }
    if (language === 'hi') {
      return {
        tag: 'कंपनी परिचय',
        title: 'सॅमझेन वेब डेवलपमेंट के बारे में',
        desc1: 'सॅमझेन वेब डेवलपमेंट स्थानीय व्यवसायों, दुकानों, कोचिंग संस्थानों, होटलों और सैलून के लिए आधुनिक, तेज़ और मोबाइल-फ्रेंडली वेबसाइट्स का निर्माण करता है।',
        desc2: 'हर वेबसाइट आपके काम, फोटो और पहचान के अनुसार हस्तनिर्मित की जाती है। बिना किसी रेडीमेड क्लोन के सीधा और प्रामाणिक कोडिंग अनुभव।',
        pillar1Title: 'विशेष कस्टम डिज़ाइन',
        pillar1Desc: 'आपकी पसंद और व्यवसाय के अनुरूप अलग, आकर्षक और मोबाइल-फ्रेंडली वेबसाइट।',
        pillar2Title: 'डिलीवरी के बाद मुफ्त सपोर्ट',
        pillar2Desc: 'हर पैकेज में ७, १४ अथवा २१ दिनों का फ्री मेंटेनेंस सपोर्ट उपलब्ध है।',
        pillar3Title: 'सीधा व पारदर्शी संपर्क',
        pillar3Desc: 'बिना किसी एजेंट के सीधे संस्थापक व सीईओ समर्थ झेंडे से व्हाट्सऐप या ईमेल पर बात करें।',
        whyTag: 'महत्व',
        whyTitle: 'आपके व्यवसाय के लिए वेबसाइट क्यों जरूरी है?',
        whyDesc: 'वेबसाइट आपके व्यवसाय की आधिकारिक डिजिटल पहचान है जो २४ घंटे ग्राहकों तक पहुंचती है:',
        checklistTag: 'शुरुआत के लिए',
        checklistTitle: 'आपकी ओर से क्या जानकारी चाहिए?',
        checklistDesc: 'जितनी अच्छी जानकारी और फोटो उपलब्ध होंगे, उतनी ही सुंदर आपकी वेबसाइट बनेगी:',
      };
    }
    return {
      tag: 'About The Studio',
      title: 'About SAMZEN Web Development',
      desc1: 'SAMZEN Web Development provides customized website development and digital solutions for businesses, organizations, educational services, local shops, professionals, and individuals who want a trustworthy, modern online presence.',
      desc2: 'Every website is designed around your specific requirements, business category, available brand assets, and selected features — built to be fast, responsive, and effortlessly accessible from any phone or computer.',
      pillar1Title: 'Bespoke Design',
      pillar1Desc: 'Every website is handcrafted to match your business type and colors, avoiding generic copy-paste templates.',
      pillar2Title: 'Post-Delivery Guarantee',
      pillar2Desc: 'Every plan includes a free service support window (7, 14, or 21 days) to resolve any minor issues or questions.',
      pillar3Title: 'Direct Communication',
      pillar3Desc: 'Speak directly with Founder & CEO Samarth Zende on WhatsApp or Gmail without middlemen or confusing agency layers.',
      whyTag: 'Why It Matters',
      whyTitle: 'Why your business needs a website',
      whyDesc: 'Your website is your business’s official online identity — working 24/7 to build credibility:',
      checklistTag: 'Getting Started',
      checklistTitle: 'What do I need from you?',
      checklistDesc: 'The better the information and content provided, the more accurately your website will represent your business:',
    };
  };

  const content = getLocalizedContent();

  const benefits = language === 'mr' ? [
    'अधिकृत डिजिटल ओळख निर्माण होते',
    'उत्पादने व सेवांची यादी लोकांपर्यंत पोहोचते',
    'व्यवसायाचे खरेखुरे फोटो दाखवता येतात',
    'थेट १-टॅप कॉलिंग व गुगल मॅप पत्ता मिळतो',
    'व्हॉट्सॲपवर त्वरित ग्राहकांशी बोलता येते',
    'महत्त्वाच्या सूचना व नवीन ऑफर्स शेअर करता येतात',
    'कोचिंग/क्लासेससाठी नोट्स व अभ्यासक्रम ठेवता येतो',
    'व्यवसाय अधिक प्रतिष्ठित व विश्वासार्ह वाटतो',
    'स्मार्टफोनवर सहज उघडणारी जलद वेबसाइट',
    'आवश्यक असल्यास ऑनलाइन पेमेंट सुविधा',
    'गूगलवर स्वतःचे नाव व व्यवसाय शोधता येतो',
    'दीर्घकालीन स्वतःचा स्वतंत्र ब्रँड तयार होतो'
  ] : language === 'hi' ? [
    'आधिकारिक डिजिटल पहचान बनती है',
    'उत्पादों और सेवाओं की पूरी सूची दिखती है',
    'व्यवसाय के असली फोटो प्रदर्शित होते हैं',
    '१-टैप कॉल और गूगल मैप लोकेशन उपलब्ध होता है',
    'व्हाट्सऐप पर सीधे ग्राहकों से बातचीत होती है',
    'महत्वपूर्ण सूचनाएं और नए ऑफर्स साझा कर सकते हैं',
    'कोचिंग/ट्यूशन के लिए नोट्स व क्लास शेड्यूल',
    'व्यवसाय अधिक पेशेवर और भरोसेमंद लगता है',
    'मोबाइल फोन पर तेज़ और सुंदर डिस्प्ले',
    'आवश्यकतानुसार ऑनलाइन पेमेंट की सुविधा',
    'गूगल पर आपके ब्रांड का नाम स्थापित होता है',
    'हमेशा सक्रिय रहने वाला डिजिटल शोरूम'
  ] : [
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
  ];

  return (
    <section id="about" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            {content.tag}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            {content.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] leading-relaxed">
            {content.desc1}
          </p>
          <p className="mt-3 text-base text-[#9db0c8] leading-relaxed">
            {content.desc2}
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-6 relative group hover:border-[#3da9fc]/60 transition">
            <div className="w-10 h-10 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#3da9fc] mb-4 group-hover:scale-110 transition">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">{content.pillar1Title}</h3>
            <p className="text-sm text-[#9db0c8] leading-relaxed">
              {content.pillar1Desc}
            </p>
          </div>

          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-6 relative group hover:border-[#3da9fc]/60 transition">
            <div className="w-10 h-10 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#59e3ff] mb-4 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">{content.pillar2Title}</h3>
            <p className="text-sm text-[#9db0c8] leading-relaxed">
              {content.pillar2Desc}
            </p>
          </div>

          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-xl p-6 relative group hover:border-[#3da9fc]/60 transition">
            <div className="w-10 h-10 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-[#3da9fc] mb-4 group-hover:scale-110 transition">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">{content.pillar3Title}</h3>
            <p className="text-sm text-[#9db0c8] leading-relaxed">
              {content.pillar3Desc}
            </p>
          </div>
        </div>

        {/* Why Your Business Needs a Website */}
        <div className="bg-[#0b1220] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 mb-16">
          <div className="max-w-2xl mb-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-1">
              {content.whyTag}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {content.whyTitle}
            </h3>
            <p className="text-sm text-[#9db0c8] mt-1">
              {content.whyDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-[#eef3fa]">
            {benefits.map((benefit, idx) => (
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
              <span>{content.checklistTag}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {content.checklistTitle}
            </h3>
            <p className="text-sm text-[#9db0c8] mt-1">
              {content.checklistDesc}
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
