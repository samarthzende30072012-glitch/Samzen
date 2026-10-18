import React from 'react';
import { SERVICE_POLICIES } from '../data/samzenData';
import { ShieldAlert, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ServicePolicy: React.FC = () => {
  const { t, language } = useLanguage();

  const getLocalizedPolicyText = (num: number, defaultText: string) => {
    if (language === 'mr') {
      switch (num) {
        case 1: return 'वेबसाइटचे दर ग्राहकाने मागितलेल्या वैशिष्ट्ये (Features) आणि कामाच्या व्याप्तीवर अवलंबून असतात.';
        case 2: return 'दिलेले दर हे सर्वसाधारण पॅकेजेस आहेत — अंतिम किंमत प्रकल्पाच्या नेमक्या गरजेनुसार निश्चित केली जाते.';
        case 3: return 'ग्राहकांनी वेबसाइटसाठी लागणारी माहिती, फोटो, व्यवसायाचा लोगो आणि संपर्क तपशील पुरवणे आवश्यक आहे.';
        case 4: return 'वेबसाइटचे काम सुरू करण्यापूर्वी दोन्ही बाजूंच्या सहमतीने ठरलेल्या गरजांनुसारच डिझाइन व कोडिंग केली जाते.';
        case 5: return 'प्रत्येक प्लॅनमध्ये काम पूर्ण झाल्यावर विनामूल्य सपोर्ट मिळतो — ७ दिवस (प्लॅन १), १४ दिवस (प्लॅन २), किंवा २१ दिवस (प्लॅन ३). यात कोणत्याही त्रुटी किंवा किरकोळ बदल मोफत केले जातात.';
        case 6: return 'मोफत सपोर्ट कालावधी संपल्यानंतर किरकोळ सर्व्हिस किंवा देखभाल केवळ ₹१९९ प्रति काम या वाजवी दरात केली जाते.';
        case 7: return 'सुरुवातीला ठरवलेल्या कामाव्यतिरिक्त नवीन पेजेस किंवा मोठी वैशिष्ट्ये जोडायची असल्यास स्वतंत्र नाममात्र दर लागू होऊ शकतात.';
        case 8: return 'ऑनलाइन पेमेंट सुविधा ग्राहकाच्या गरजेनुसार आणि निवडलेल्या प्लॅननुसार वेबसाइटवर जोडली जाते.';
        case 9: return 'ग्राहकांनी आपल्या व्यवसायाची खरीखुरी आणि अधिकृत माहितीच वेबसाइटवर द्यावी.';
        case 10: return 'वेबसाइट पूर्ण होण्याचा कालावधी प्रकल्पाच्या व्याप्तीवर आणि ग्राहकांकडून माहिती वेळेवर मिळण्यावर अवलंबून असतो.';
        case 11: return 'प्रकल्प पूर्ण झाल्यावर मोठे पुनर्रचना (Major Redesign) किंवा अतिरिक्त पेजेस हवे असल्यास स्वतंत्र शुल्क आकारले जाऊ शकते.';
        case 12: return 'काम सुरू करण्यापूर्वी सर्व गरजांवर स्पष्ट चर्चा करावी, जेणेकरून योग्य प्लॅन आणि पारदर्शक किंमत ठरवता येईल.';
        case 13: return 'डोमेन, ब्रँडिंग व स्पॉन्सरशिप नियम: प्लॅन १ मधील वेबसाइट्सच्या डोमेनमध्ये ".samzen" असेल आणि "Proudly Created by Samarth Zende (SAMZEN)" हा संस्थापकाचा फोटो असलेला विभाग बंधनकारक असेल. प्लॅन २ मध्ये ".samzen" शिवाय स्वतंत्र कस्टम डोमेन व संस्थापकाचे नाव/फोटो असेल. प्लॅन ३ मध्ये संपूर्ण कस्टम डोमेन, स्वतःचे ब्रँडिंग ठेवण्याची/बदलण्याची पूर्ण मुभा आणि सॅमझेनच्या अधिकृत वेबसाइटवर स्वतःच्या वेबसाइटची जाहिरात (Sponsorship) करण्याची विशेष संधी मिळेल.';
      }
    }
    if (language === 'hi') {
      switch (num) {
        case 1: return 'वेबसाइट का मूल्य ग्राहक द्वारा मांगी गई सुविधाओं और आवश्यकताओं पर निर्भर करता है।';
        case 2: return 'दर्शाए गए पैकेज सामान्य अनुमान हैं — अंतिम मूल्य प्रोजेक्ट की वास्तविक आवश्यकताओं के अनुसार तय होता है।';
        case 3: return 'ग्राहकों को अपनी व्यावसायिक जानकारी, फोटो, लोगो और संपर्क विवरण समय पर उपलब्ध कराना होगा।';
        case 4: return 'वेबसाइट का निर्माण कार्य शुरू होने से पहले तय की गई शर्तों व आवश्यकताओं के अनुसार ही किया जाता है।';
        case 5: return 'हर प्लान में डिलीवरी के बाद मुफ्त सपोर्ट शामिल है — ७ दिन (प्लान १), १४ दिन (प्लान २), अथवा २१ दिन (प्लान ३)। इस दौरान सभी तकनीकी सुधार मुफ्त हैं।';
        case 6: return 'मुफ्त सपोर्ट पूरा होने के बाद सामान्य मेंटेनेंस व सर्विस कार्य केवल ₹१९९ प्रति सेवा पर उपलब्ध कराया जाता है।';
        case 7: return 'मूल समझौते से अलग नए फीचर्स या अतिरिक्त पेजों के लिए नाममात्र अतिरिक्त शुल्क लग सकता है।';
        case 8: return 'ऑनलाइन पेमेंट गेटवे या क्यूआर कोड की सुविधा आवश्यकतानुसार प्लान में जोड़ी जाती है।';
        case 9: return 'ग्राहकों से अनुरोध है कि वे अपनी प्रामाणिक और सही जानकारी ही वेबसाइट पर प्रदर्शित कराएं।';
        case 10: return 'वेबसाइट पूर्ण करने का समय कार्य की जटिलता और जानकारी मिलने की गति पर निर्भर करता है।';
        case 11: return 'प्रोजेक्ट डिलीवरी के बाद पूरी वेबसाइट को फिर से नया रूप देने या बड़े बदलावों के लिए अलग शुल्क देय होगा।';
        case 12: return 'काम शुरू होने से पूर्व अपनी सभी आवश्यकताओं पर विस्तार से चर्चा कर लें ताकि सही प्लान तय किया जा सके।';
        case 13: return 'डोमेन, ब्रांडिंग व स्पॉन्सरशिप नियम: प्लान १ में डोमेन में ".samzen" शामिल होगा और संस्थापक के फोटो वाला "Proudly Created by Samarth Zende (SAMZEN)" क्रेडिट अनिवार्य होगा। प्लान २ में बिना ".samzen" के कस्टम डोमेन और संस्थापक क्रेडिट रहेगा। प्लान ३ में पूरा कस्टम डोमेन, ब्रांडिंग पर ग्राहक का पूर्ण नियंत्रण और सैमज़ेन वेबसाइट पर अपनी वेबसाइट को स्पॉन्सर करने की सुविधा मिलेगी।';
      }
    }
    return defaultText;
  };

  return (
    <section id="policy" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#0b1220]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>{t('policy.tag')} &mdash; {t('policy.title')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            {t('policy.title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            {t('policy.subtitle')}
          </p>
        </div>

        {/* 12 Policy Points */}
        <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-9 shadow-lg">
          <ol className="space-y-4">
            {SERVICE_POLICIES.map((item) => (
              <li key={item.number} className="flex items-start gap-4 text-sm text-[#9db0c8] leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[#070b14] border border-[#1d2a3e] text-[#3da9fc] font-heading font-bold text-xs flex items-center justify-center mt-0.5">
                  {item.number}
                </span>
                <span className="text-[#c9d3dc]">
                  {getLocalizedPolicyText(item.number, item.text)}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 pt-6 border-t border-[#1d2a3e] flex items-center gap-3 text-xs text-[#9db0c8]">
            <ShieldAlert className="w-4 h-4 text-[#3da9fc] flex-shrink-0" />
            <span>
              {language === 'mr' 
                ? 'कोणत्याही शंकेसाठी किंवा विशेष सल्ल्यासाठी संस्थापक समर्थ झेंडे यांच्याशी थेट व्हॉट्सॲप (+९१ ८६०५०४२८५५) किंवा ईमेलवर संपर्क साधा.'
                : language === 'hi'
                ? 'किसी भी प्रश्न या विशेष प्रोजेक्ट परामर्श के लिए सीधे संस्थापक समर्थ झेंडे से व्हाट्सऐप (+९१ ८६०५०४२८५५) अथवा ईमेल पर संपर्क करें।'
                : 'For questions regarding scope, pricing adjustments, or custom enterprise requirements, contact Samarth Zende directly on WhatsApp or Gmail.'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
