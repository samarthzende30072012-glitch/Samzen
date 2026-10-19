import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🚩' },
];

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  'nav.founder': { en: 'Founder & CEO', hi: 'संस्थापक और सीईओ', mr: 'संस्थापक व सीईओ' },
  'nav.about': { en: 'About', hi: 'परिचय', mr: 'माहिती' },
  'nav.workspace': { en: 'Google Workspace', hi: 'गूगल वर्कस्पेस', mr: 'गुगल वर्कस्पेस' },
  'nav.services': { en: 'Services', hi: 'सेवाएं', mr: 'सेवा' },
  'nav.pricing': { en: 'Pricing', hi: 'योजनाएं व दरें', mr: 'योजना व दर' },
  'nav.process': { en: 'Work Process', hi: 'कार्य प्रक्रिया', mr: 'कार्यपद्धती' },
  'nav.policy': { en: 'Service Policy', hi: 'सेवा नीति', mr: 'सेवा धोरण' },
  'nav.contact': { en: 'Contact', hi: 'संपर्क', mr: 'संपर्क' },
  'nav.login': { en: 'Log In', hi: 'लॉग इन', mr: 'लॉग इन' },
  'nav.signup': { en: 'Sign Up', hi: 'साइन अप', mr: 'नोंदणी करा' },
  'nav.portal': { en: 'Portal', hi: 'पोर्टल', mr: 'पोर्टल' },
  'nav.myAccount': { en: 'My Account & Support', hi: 'मेरा खाता व सहायता', mr: 'माझे खाते व सहाय्यता' },
  'nav.logout': { en: 'Log Out', hi: 'लॉग आउट', mr: 'लॉग आउट' },
  'nav.whatsapp': { en: 'WhatsApp', hi: 'व्हाट्सऐप', mr: 'व्हॉट्सॲप' },
  'nav.language': { en: 'Language', hi: 'भाषा', mr: 'भाषा' },

  // Hero Section
  'hero.badge': { en: 'SAMZEN Web Development', hi: 'सॅमझेन वेब डेव्हलपमेंट', mr: 'सॅमझेन वेब डेव्हलपमेंट' },
  'hero.headlineLine1': { en: 'Custom Websites & Digital Solutions', hi: 'कस्टम वेबसाइट्स व डिजिटल सोल्यूशन्स', mr: 'कस्टम वेबसाइट्स आणि डिजिटल सोल्यूशन्स' },
  'hero.headlineLine2': { en: 'Engineered For Your Business', hi: 'आपके व्यवसाय के लिए विशेष निर्मित', mr: 'आपल्या व्यवसायासाठी विशेष निर्मित' },
  'hero.subtext': { 
    en: 'Professional websites and digital solutions designed for businesses, organizations, and individuals. Built around your exact requirements, business type, and brand identity.', 
    hi: 'दुकानें, कोचिंग, सैलून, होटल और छोटे-बड़े व्यवसायों के लिए पेशेवर, आधुनिक और मोबाइल-फ्रेंडली वेबसाइट्स। सच्चा सपोर्ट और पारदर्शी दरें।', 
    mr: 'दुकाने, कोचिंग क्लासेस, सलून, हॉटेल्स आणि सर्व प्रकारच्या व्यवसायांसाठी वेगवान, दर्जेदार आणि मोबाईल-फ्रेंडली वेबसाइट्स. खात्रीशीर सपोर्ट आणि पारदर्शक दर.' 
  },
  'hero.founderBadge': { en: 'Founder and CEO', hi: 'संस्थापक और सीईओ', mr: 'संस्थापक आणि सीईओ' },
  'hero.founderRole': { en: '100% Sole Owner &bull; Founder and CEO — SAMZEN Web Development', hi: '१००% एकमेव मालक &bull; संस्थापक व सीईओ — सॅमझेन वेब डेव्हलपमेंट', mr: '१००% एकमेव मालक &bull; संस्थापक व सीईओ — सॅमझेन वेब डेव्हलपमेंट' },
  'hero.founderBio': { en: '14-Year-Old Web Developer, Sole Owner & Founder • Nashik, Maharashtra', hi: '१४ वर्षीय वेब डेव्हलपर, एकमात्र मालक व संस्थापक • नाशिक, महाराष्ट्र', mr: '१४ वर्षीय वेब डेव्हलपर, एकमेव मालक व संस्थापक • नाशिक, महाराष्ट्र' },
  'hero.ctaPlans': { en: 'Explore Website Plans', hi: 'वेबसाइट योजनाएं देखें', mr: 'वेबसाइट प्लॅन्स पहा' },
  'hero.ctaWhatsapp': { en: 'Chat on WhatsApp', hi: 'व्हाट्सऐप पर बात करें', mr: 'व्हॉट्सॲपवर बोला' },
  'hero.ctaEmail': { en: 'Email Samarth', hi: 'ईमेल पाठवा', mr: 'समर्थला ईमेल करा' },
  'hero.metricExperience': { en: '3+ Years Experience', hi: '३+ वर्ष अनुभव', mr: '३+ वर्षे अनुभव' },
  'hero.metricProjects': { en: '45+ Completed Projects', hi: '४५+ पूर्ण झालेले प्रकल्प', mr: '४५+ पूर्ण झालेले प्रोजेक्ट्स' },
  'hero.metricSatisfaction': { en: '100% Client Satisfaction', hi: '१००% ग्राहक समाधान', mr: '१००% ग्राहक समाधान' },
  'hero.freeSupportBadge': { en: 'Free Post-Delivery Support on All Plans', hi: 'सभी प्लान पर डिलीवरी के बाद फ्री सपोर्ट', mr: 'सर्व प्लॅन्सवर काम पूर्ण झाल्यावर मोफत सपोर्ट' },

  // Founder Section
  'founder.tag': { en: 'Leadership & Vision', hi: 'नेतृत्व और विज़न', mr: 'नेतृत्व आणि दृष्टी' },
  'founder.title': { en: 'Meet The Founder and CEO', hi: 'संस्थापक और सीईओ से मिलें', mr: 'भेटा संस्थापक आणि सीईओ यांना' },
  'founder.subtitle': { 
    en: 'Young visionary leading digital transformation with passion, precision, and authentic technical craftsmanship.',
    hi: 'आधुनिक तंत्रज्ञान आणि निष्ठेने व्यवसायांना डिजिटल बनवणारे युवा संस्थापक मि. समर्थ झेंडे.',
    mr: 'आधुनिक तंत्रज्ञान आणि प्रामाणिक निष्ठेने व्यवसायांना डिजिटल रूप देणारे युवा संस्थापक मि. समर्थ झेंडे.'
  },
  'founder.name': { en: 'Mr. Samarth Zende', hi: 'मि. समर्थ झेंडे', mr: 'मि. समर्थ झेंडे' },
  'founder.quote': {
    en: '"Every business deserves a modern, fast, and high-converting website without paying exorbitant agency fees. I build websites that solve real business problems with complete post-delivery support."',
    hi: '"हर व्यवसाय एक आधुनिक, तेज़ और सुंदर वेबसाइट का हकदार है। मैं उचित दामों पर सच्चा काम और डिलीवरी के बाद निःशुल्क सहायता प्रदान करता हूँ।"',
    mr: '"प्रत्येक व्यवसायाला योग्य दरात आधुनिक, वेगवान आणि दर्जेदार वेबसाइट मिळायला हवी. मी प्रत्यक्ष व्यवसाय वाढवणारी वेबसाइट बनवून देतो आणि नंतरही पूर्ण सपोर्ट देतो."'
  },
  'founder.skillsTitle': { en: 'Digital Capabilities & Creation Skills', hi: 'डिजिटल कौशल्य व सेवा क्षमता', mr: 'डिजिटल कौशल्ये व निर्मिती क्षमता' },

  // Pricing & Plans
  'pricing.tag': { en: 'Transparent Investment', hi: 'पारदर्शी दर', mr: 'पारदर्शक दर' },
  'pricing.title': { en: 'Website Plans & Transparent Pricing', hi: 'वेबसाइट प्लान और पारदर्शी दरें', mr: 'वेबसाइट प्लॅन्स आणि पारदर्शक दर' },
  'pricing.subtitle': { 
    en: 'Genuine packages designed for local businesses, shops, coaching academies, and organizations. Every plan includes an authentic free post-delivery support window.',
    hi: 'दुकानों, ट्यूशन, सैलून, होटल और व्यवसायों के लिए स्पष्ट पैकेज। हर प्लान में डिलीवरी के बाद फ्री सपोर्ट शामिल है।',
    mr: 'दुकाने, कोचिंग, सलून, हॉटेल्स आणि व्यवसायांसाठी स्पष्ट पॅकेजेस. प्रत्येक प्लॅनमध्ये काम पूर्ण झाल्यानंतर मोफत सपोर्ट समाविष्ट.'
  },
  'pricing.popular': { en: 'Most Popular', hi: 'सबसे लोकप्रिय', mr: 'सर्वाधिक लोकप्रिय' },
  'pricing.daysFreeSupport': { en: 'Days Free Support', hi: 'दिन फ्री सपोर्ट', mr: 'दिवस मोफत सपोर्ट' },
  'pricing.suitableFor': { en: 'Suitable for', hi: 'उपयुक्त', mr: 'यासाठी उपयुक्त' },
  'pricing.selectPlan': { en: 'Choose This Plan', hi: 'यह प्लान चुनें', mr: 'हा प्लॅन निवडा' },
  'pricing.discussOnWhatsapp': { en: 'Discuss on WhatsApp', hi: 'व्हाट्सऐप पर चर्चा करें', mr: 'व्हॉट्सॲपवर चर्चा करा' },
  'pricing.policyNote': { 
    en: 'Post-support guarantee: After the free window, routine service or maintenance requests cost just ₹199 per service.',
    hi: 'सपोर्ट गारंटी: फ्री सपोर्ट पूरा होने के बाद मेंटेनेंस व सर्विस सिर्फ ₹१९९ प्रति सेवा है।',
    mr: 'सपोर्ट हमी: मोफत सपोर्ट कालावधी संपल्यानंतर किरकोळ सर्व्हिस किंवा दुरुस्ती केवळ ₹१९९ प्रति काम.'
  },

  // Plan 0 - Basic Static Website (₹799)
  'plan.0.name': { en: 'Basic Static Website', hi: 'बेसिक स्टेटिक वेबसाइट', mr: 'बेसिक स्टॅटिक वेबसाईट' },
  'plan.0.desc': { 
    en: 'For customers who want a simple digital pamphlet-style website to display their business information online.',
    hi: 'उन ग्राहकों के लिए जो अपनी व्यावसायिक जानकारी ऑनलाइन प्रदर्शित करने हेतु एक सरल डिजिटल पैम्फलेट वेबसाइट चाहते हैं।',
    mr: 'ज्या ग्राहकांना व्यवसायाची माहिती ऑनलाईन दाखवण्यासाठी सोपी डिजिटल पॅम्प्लेट स्वरूपातील वेबसाईट हवी आहे.'
  },
  'pricing.limitations': { en: 'Plan Limitations & Terms:', hi: 'प्लान सीमाएं व शर्तें:', mr: 'प्लॅन मर्यादा व अटी:' },
  'pricing.noFreeSupport': { en: 'No Free Maintenance', hi: 'फ्री मेंटेनेंस शामिल नहीं', mr: 'मोफत मेंटेनन्स नाही' },

  // Plan 1
  'plan.1.name': { en: 'Basic Business Website', hi: 'बेसिक बिज़नेस वेबसाइट', mr: 'बेसिक बिझनेस वेबसाइट' },
  'plan.1.desc': { 
    en: 'For businesses that mainly want to display information, photographs, services, and contact details.',
    hi: 'उन व्यवसायों के लिए जो मुख्य रूप से अपनी जानकारी, फोटो, सेवाएं और संपर्क विवरण दिखाना चाहते हैं।',
    mr: 'ज्यांना प्रामुख्याने व्यवसायाची माहिती, फोटो, सेवा आणि संपर्काचे तपशील दाखवायचे आहेत.'
  },

  // Plan 2
  'plan.2.name': { en: 'Professional Business Website', hi: 'प्रोफेशनल बिज़नेस वेबसाइट', mr: 'प्रोफेशनल बिझनेस वेबसाइट' },
  'plan.2.desc': { 
    en: 'A complete professional online presence with WhatsApp, rich sections, announcements, and customized modules.',
    hi: 'व्हाट्सऐप, विस्तृत सेक्शन, सूचनाएं और कोचिंग/ट्यूशन नोट्स के साथ संपूर्ण व्यावसायिक वेबसाइट।',
    mr: 'व्हॉट्सॲप, सविस्तर सेक्शन्स, सूचना फलक आणि कोचिंग नोट्ससह परिपूर्ण व्यावसायिक वेबसाइट.'
  },

  // Plan 3
  'plan.3.name': { en: 'Advanced Business Website', hi: 'एडवांस्ड बिज़नेस वेबसाइट', mr: 'ॲडव्हान्स्ड बिझनेस वेबसाइट' },
  'plan.3.desc': { 
    en: 'For organizations needing advanced functionality, online payments, customized booking, and priority delivery.',
    hi: 'ऑनलाइन पेमेंट, अडवांस्ड बुकिंग और विशेष कार्यक्षमता चाहने वाले होटल्स, कारखानों और संस्थानों के लिए।',
    mr: 'ऑनलाइन पेमेंट, ॲडव्हान्स्ड बुकिंग व विशेष गरजा असणाऱ्या हॉटेल्स, कारखाने आणि संस्थांसाठी.'
  },

  // Work Process
  'process.tag': { en: 'How We Work', hi: 'कार्यप्रणाली', mr: 'कार्यपद्धती' },
  'process.title': { en: 'Simple 7-Step Delivery Process', hi: 'सरल ७-चरणीय कार्य प्रक्रिया', mr: 'सोपी ७-टप्प्यांची कार्यपद्धती' },
  'process.subtitle': { 
    en: 'From initial idea to a live launched website with dedicated free support.',
    hi: 'विचार-विमर्श से लेकर लाइव वेबसाइट और डिलीवरी के बाद फ्री सपोर्ट तक का सफर।',
    mr: 'पहिल्या चर्चेपासून ते थेट वेबसाइट सुरू होईपर्यंत आणि त्यानंतर मोफत सपोर्टपर्यंत.'
  },

  // Service Policy
  'policy.tag': { en: 'Transparency First', hi: 'पारदर्शकता', mr: 'पारदर्शकता' },
  'policy.title': { en: 'Service Policy & Support Terms', hi: 'सेवा नीति व सपोर्ट नियम', mr: 'सेवा धोरण व सपोर्ट अटी' },
  'policy.subtitle': { 
    en: 'Clear, transparent rules ensuring honesty, trust, and lasting value for every client.',
    hi: 'स्पष्ट, प्रामाणिक और भरोसेमंद नियम जो आपके हर काम को सुरक्षित रखते हैं।',
    mr: 'स्पष्ट आणि प्रामाणिक नियम जे प्रत्येक ग्राहकाला सुरक्षित व दर्जेदार सेवा देतात.'
  },
  'policy.rule5': {
    en: 'Each plan includes free service support after completion — 7 days (Plan 1), 14 days (Plan 2), or 21 days (Plan 3).',
    hi: 'हर प्लान में डिलीवरी के बाद फ्री सपोर्ट शामिल है — ७ दिन (प्लान १), १४ दिन (प्लान २), अथवा २१ दिन (प्लान ३)।',
    mr: 'प्रत्येक प्लॅनमध्ये काम पूर्ण झाल्यावर मोफत सपोर्ट समाविष्ट आहे — ७ दिवस (प्लॅन १), १४ दिवस (प्लॅन २), किंवा २१ दिवस (प्लॅन ३).'
  },
  'policy.rule6': {
    en: 'Once the free window ends, service or maintenance requests cost ₹199 per service, depending on the work required.',
    hi: 'फ्री सपोर्ट अवधि समाप्त होने के बाद, मेंटेनेंस व सर्विस कार्य केवल ₹१९९ प्रति सेवा पर उपलब्ध है।',
    mr: 'मोफत सपोर्ट कालावधी संपल्यावर, किरकोळ देखभाल व दुरुस्ती केवळ ₹१९९ प्रति काम या वाजवी दरात केली जाते.'
  },

  // Services
  'services.tag': { en: 'Our Capabilities', hi: 'हमारी क्षमताएं', mr: 'आमची कौशल्ये' },
  'services.title': { en: 'Services Designed For Your Business', hi: 'आपके व्यवसाय के लिए विशेष सेवाएं', mr: 'आपल्या व्यवसायासाठी खास सेवा' },
  'services.subtitle': {
    en: 'Custom digital creation tailored for retail shops, salons, coaching institutes, hospitality, and growing enterprises.',
    hi: 'दुकानदार, कोचिंग, ब्यूटी पार्लर, होटल और छोटे-बड़े उद्योगों के लिए विशेष निर्मित डिजिटल समाधान।',
    mr: 'दुकानदार, कोचिंग क्लासेस, ब्युटी पार्लर, हॉटेल्स आणि वाढत्या उद्योगांसाठी खास तयार केलेली डिजिटल सोल्यूशन्स.'
  },

  // Contact
  'contact.tag': { en: 'Get In Touch', hi: 'संपर्क करें', mr: 'संपर्क साधा' },
  'contact.title': { en: 'Start Your Website Today', hi: 'आज ही अपनी वेबसाइट शुरू करें', mr: 'आजच आपली वेबसाइट सुरू करा' },
  'contact.subtitle': { 
    en: 'Connect directly with Samarth Zende via WhatsApp or Gmail for instant answers and project quotes.',
    hi: 'तत्काल परामर्श और प्रोजेक्ट कोटेशन के लिए समर्थ झेंडे से सीधे व्हाट्सऐप या ईमेल पर जुड़ें।',
    mr: 'त्वरित मार्गदर्शन आणि प्रोजेक्ट दरांसाठी समर्थ झेंडे यांच्याशी थेट व्हॉट्सॲप किंवा ईमेलवर संपर्क करा.'
  },
  'contact.whatsappLabel': { en: 'Chat on WhatsApp', hi: 'व्हाट्सऐप पर चैट करें', mr: 'व्हॉट्सॲपवर चॅट करा' },
  'contact.whatsappDesc': { en: 'Fastest response — tap to chat immediately with Samarth', hi: 'सबसे तेज़ जवाब — समर्थ से तुरंत बात करने के लिए टैप करें', mr: 'सर्वात जलद प्रतिसाद — समर्थशी थेट बोलण्यासाठी टॅप करा' },
  'contact.emailLabel': { en: 'Official Gmail', hi: 'ऑफिशियल जीमेल', mr: 'अधिकृत जीमेल' },
  'contact.emailDesc': { en: 'Send detailed requirements, photos, and project briefs', hi: 'अपनी आवश्यकताएं, फोटो व विवरण ईमेल करें', mr: 'आपल्या व्यवसायाची माहिती, फोटो व तपशील ईमेल करा' },
  'contact.formTitle': { en: 'Send Direct Project Inquiry', hi: 'प्रोजेक्ट इन्क्वायरी भेजें', mr: 'थेट प्रोजेक्ट चौकशी पाठवा' },
  'contact.formName': { en: 'Your Name', hi: 'आपका नाम', mr: 'आपले नाव' },
  'contact.formEmail': { en: 'Email Address', hi: 'ईमेल पता', mr: 'ईमेल पत्ता' },
  'contact.formPhone': { en: 'WhatsApp / Phone Number', hi: 'व्हाट्सऐप / फोन नंबर', mr: 'व्हॉट्सॲप / फोन नंबर' },
  'contact.formCategory': { en: 'Business Type', hi: 'व्यवसाय का प्रकार', mr: 'व्यवसायाचा प्रकार' },
  'contact.formPlan': { en: 'Interested Plan', hi: 'इच्छुक प्लान', mr: 'इच्छित प्लॅन' },
  'contact.formMsg': { en: 'Tell us about your website requirements', hi: 'अपनी वेबसाइट की आवश्यकताओं के बारे में बताएं', mr: 'आपल्या वेबसाइटच्या गरजांबद्दल सांगा' },
  'contact.submitBtn': { en: 'Send Inquiry to Samarth', hi: 'समर्थ को इन्क्वायरी भेजें', mr: 'समर्थ यांना चौकशी पाठवा' },

  // Footer
  'footer.rights': { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।', mr: 'सर्व हक्क राखीव.' },
  'footer.founderCredit': { en: 'Founded & Developed by Samarth Zende', hi: 'संस्थापक एवं डेवलपर: समर्थ झेंडे', mr: 'संस्थापक आणि डेव्हलपर: समर्थ झेंडे' },
  'footer.tagline': { en: 'Handcrafted web development and digital solutions.', hi: 'हस्तनिर्मित वेब डेव्हलपमेंट आणि डिजिटल सोल्यूशन्स.', mr: 'अस्सल वेब डेव्हलपमेंट आणि डिजिटल सोल्यूशन्स.' },
  'footer.language': { en: 'Select Language / भाषा निवडा / भाषा चुनें:', hi: 'भाषा चुनें / Select Language / भाषा निवडा:', mr: 'भाषा निवडा / Select Language / भाषा चुनें:' },

  // Language selector labels
  'lang.selectLanguage': { en: 'Select Language', hi: 'भाषा चुनें', mr: 'भाषा निवडा' },
  'lang.defaultNotice': { en: 'Default language is English', hi: 'डिफ़ॉल्ट भाषा अंग्रेज़ी है', mr: 'डिफॉल्ट भाषा इंग्रजी आहे' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultVal?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, defaultVal?: string) => defaultVal || key,
});

const STORAGE_KEY = 'samzen_preferred_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage, default to 'en' (English) if not set or invalid
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi' || saved === 'mr') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en'; // English is the reliable default
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.warn('Could not persist language preference:', e);
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // noop
    }
  }, [language]);

  const t = (key: string, defaultVal?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    if (entry && entry.en) {
      return entry.en;
    }
    return defaultVal || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
