import React, { useState } from 'react';
import { BUSINESS_TYPES, OTHER_SERVICES, TEMPLATE_CATEGORIES } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { Sparkles, Layout, Globe, Search, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ServicesProps {
  onSelectCategory?: (category: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t, language } = useLanguage();

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
              {t('services.tag')}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
              {t('services.title')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
              {t('services.subtitle')}
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={language === 'mr' ? 'आपला व्यवसाय शोधा...' : language === 'hi' ? 'व्यवसाय खोजें...' : 'Find your business type...'}
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
              className="group p-4 rounded-xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3da9fc]/10 transition-all duration-300 flex flex-col justify-between cursor-default"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#59e3ff]">{(idx + 1).toString().padStart(2, '0')}</span>
                <Globe className="w-3.5 h-3.5 text-[#9db0c8] group-hover:text-[#59e3ff] group-hover:scale-115 transition-all duration-300" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-[#59e3ff] transition">
                {bType}
              </h4>
              <p className="text-[11px] text-[#9db0c8] mt-1">
                {language === 'mr' ? 'कस्टम मांडणी व थेट संपर्क' : language === 'hi' ? 'कस्टम लेआउट व डायरेक्ट संपर्क' : 'Custom layout & contact features'}
              </p>
            </div>
          ))}
          {filteredBusinesses.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-[#9db0c8] bg-[#0e1726] rounded-xl border border-[#1d2a3e]">
              {language === 'mr' 
                ? 'नक्की जुळणारा पर्याय सापडला नाही, तरी सॅमझेन कोणत्याही व्यवसायासाठी खास कस्टम वेबसाइट तयार करते!'
                : language === 'hi'
                ? 'सटीक परिणाम नहीं मिला, लेकिन सॅमझेन हर व्यवसाय के लिए कस्टम वेबसाइट तैयार करता है!'
                : 'No exact match found, but SAMZEN builds custom websites for any custom business requirement!'}
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
                <h3 className="text-xl font-bold font-heading text-white">
                  {language === 'mr' ? 'सॅमझेनच्या इतर डिजिटल सेवा' : language === 'hi' ? 'सॅमझेन की अन्य डिजिटल सेवाएं' : 'Other Services by SAMZEN'}
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#9db0c8] mb-6 leading-relaxed">
              {language === 'mr'
                ? 'वेबसाइट व्यतिरिक्त आपल्या ब्रँडला आधुनिक रूप देण्यासाठी खास डिजिटल व कलात्मक सेवा:'
                : language === 'hi'
                ? 'वेबसाइट के अलावा आपके ब्रांड प्रचार के लिए विशेष डिजिटल व रचनात्मक मीडिया सेवाएं:'
                : 'Beyond websites, SAMZEN creates cutting-edge digital media assets and creative AI media to supercharge your brand presence:'}
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
                  <h3 className="text-xl font-bold font-heading text-white">
                    {language === 'mr' ? 'विविध व्यवसायांसाठी सज्ज टेम्प्लेट्स' : language === 'hi' ? 'तैयार व्यावसायिक टेम्प्लेट्स' : 'Custom Business Templates'}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#9db0c8] mb-6 leading-relaxed">
                {language === 'mr'
                  ? 'स्थानिक दुकाने, क्लासेस आणि संस्थांसाठी वेगाने काम सुरू करण्यासाठी तयार केलेली रचना:'
                  : language === 'hi'
                  ? 'विभिन्न उद्योगों के लिए विशेष रूप से डिज़ाइन किए गए उच्च गुणवत्ता वाले लेआउट्स:'
                  : 'Pre-engineered, tested website layouts tailored specifically for high conversion across industries:'}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {TEMPLATE_CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectCategory && onSelectCategory(cat)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] hover:bg-[#3da9fc]/10 text-[#c9d3dc] hover:text-[#59e3ff] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#3da9fc]/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group"
                    title={`Click to start website enquiry for ${cat}`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] text-[#3da9fc] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">&rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070b14]/90 border border-[#3da9fc]/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">
                  {language === 'mr' ? 'कोणत्याही डिझाइनविषयी बोलायचे आहे का?' : language === 'hi' ? 'विशेष लेआउट पर चर्चा करना चाहते हैं?' : 'Have a specific template in mind?'}
                </div>
                <div className="text-[11px] text-[#9db0c8]">
                  {language === 'mr' ? 'प्रत्येक वेबसाइट आपल्या ब्रँडच्या रंग व गरजेनुसार तयार होते.' : language === 'hi' ? 'हर वेबसाइट आपकी पसंद और ब्रांड के अनुसार तैयार की जाती है।' : 'Every template is fully customized to your colors and branding.'}
                </div>
              </div>
              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#59e3ff] hover:underline whitespace-nowrap ml-3"
              >
                <span>{t('pricing.discussOnWhatsapp')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
