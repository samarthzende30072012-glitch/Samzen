import React from 'react';
import { WORK_STEPS } from '../data/samzenData';
import { useLanguage } from '../context/LanguageContext';

export const WorkProcess: React.FC = () => {
  const { t, language } = useLanguage();

  const getLocalizedStep = (number: string, defaultTitle: string, defaultDesc: string) => {
    if (language === 'mr') {
      switch (number) {
        case '01': return { title: 'चर्चा व गरजांची माहिती', desc: 'आपल्या व्यवसायाचा प्रकार, उद्दिष्टे आणि वेबसाइटमध्ये काय हवे आहे यावर सविस्तर चर्चा.' };
        case '02': return { title: 'योग्य प्लॅनची निवड', desc: 'आपल्या बजेट आणि गरजेनुसार बेसिक (₹१०००-३०००), प्रोफेशनल (₹३०००-५०००) किंवा ॲडव्हान्स्ड प्लॅन निवडा.' };
        case '03': return { title: 'माहिती व फोटो देणे', desc: 'व्यवसायाचे नाव, लोगो, फोटो, कामाचे तपशील, पत्ता आणि संपर्क क्रमांक व्हॉट्सॲप/ईमेलवर पाठवणे.' };
        case '04': return { title: 'डिझाइन व डेव्हलपमेंट', desc: 'मोबाईल-फ्रेंडली, जलद आणि आधुनिक तंत्रज्ञानावर आधारित आपल्या वेबसाइटची निर्मिती.' };
        case '05': return { title: 'थेट तपासणी (Review)', desc: 'तयार झालेली थेट वेबसाइट प्रत्यक्ष तपासून पहा आणि आवश्यक असल्यास किरकोळ बदल सांगा.' };
        case '06': return { title: 'वेबसाइट थेट सुरू (Delivery)', desc: 'अंतिम मंजुरीनंतर वेबसाइटचे काम पूर्ण करून ती जगभरात सुरू केली जाते.' };
        case '07': return { title: 'मोफत सेवा सपोर्ट (Support)', desc: 'काम पूर्ण झाल्यावर ७, १४ किंवा २१ दिवस मोफत सपोर्ट मिळतो. कोणतीही अडचण विनामूल्य सोडवली जाते.' };
      }
    }
    if (language === 'hi') {
      switch (number) {
        case '01': return { title: 'चर्चा और आवश्यकताएं', desc: 'बताएं कि आपको किस प्रकार की वेबसाइट चाहिए, आपका व्यवसाय और मुख्य उद्देश्य क्या हैं।' };
        case '02': return { title: 'प्लान का चयन', desc: 'अपनी आवश्यकताओं और बजट के अनुसार बेसिक, प्रोफेशनल या एडवांस्ड प्लान का चुनाव करें।' };
        case '03': return { title: 'सामग्री व फोटो उपलब्ध कराएं', desc: 'अपना लोगो, व्यवसाय के फोटो, सेवाओं की सूची, पता और संपर्क विवरण भेजें।' };
        case '04': return { title: 'डिजाइन व डेवलपमेंट', desc: 'आधुनिक और मोबाइल-फ्रेंडली तकनीक के साथ आपकी वेबसाइट का निर्माण।' };
        case '05': return { title: 'लाइव समीक्षा (Review)', desc: 'तैयार लाइव वेबसाइट देखें और आवश्यकतानुसार अपने सुझाव या सुधार बताएं।' };
        case '06': return { title: 'वेबसाइट लॉन्च (Delivery)', desc: 'पूरी तरह तैयार वेबसाइट की डिलीवरी और सफल लॉन्च।' };
        case '07': return { title: 'मुफ्त सेवा सपोर्ट (Support)', desc: 'डिलीवरी के बाद ७, १४ या २१ दिनों तक किसी भी तकनीकी समस्या के लिए फ्री सेवा सहायता।' };
      }
    }
    return { title: defaultTitle, desc: defaultDesc };
  };

  return (
    <section id="process" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            {t('process.tag')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            {t('process.title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            {t('process.subtitle')}
          </p>
        </div>

        {/* Process Steps */}
        <div className="divide-y divide-[#1d2a3e] border-y border-[#1d2a3e]">
          {WORK_STEPS.map((step) => {
            const localized = getLocalizedStep(step.number, step.title, step.description);
            return (
              <div
                key={step.number}
                className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 group hover:bg-[#0b1220]/40 transition px-2 sm:px-4 rounded-lg"
              >
                <div className="w-12 text-lg sm:text-xl font-bold font-heading text-[#3da9fc] flex-shrink-0">
                  {step.number}
                </div>
                <div className="sm:w-52 flex-shrink-0">
                  <h3 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-[#59e3ff] transition">
                    {localized.title}
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#9db0c8] leading-relaxed">
                    {localized.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
