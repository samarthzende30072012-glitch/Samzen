import React from 'react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Globe, 
  Smartphone, 
  Music, 
  Image as ImageIcon, 
  Video, 
  MessageSquare, 
  Mail, 
  ArrowUpRight,
  Code2
} from 'lucide-react';
import samarthOfficialPhoto from '../assets/images/samzen_founder_official.jpg';
import { useLanguage } from '../context/LanguageContext';

export const FounderCEO: React.FC = () => {
  const { language, t } = useLanguage();

  const getSkills = () => {
    if (language === 'mr') {
      return [
        {
          icon: Globe,
          emoji: '🌐',
          name: 'वेब डेव्हलपमेंट',
          desc: 'स्थानिक व्यवसायांसाठी आधुनिक, वेगवान आणि मोबाईलवर सहज उघडणाऱ्या वेबसाइट्सची निर्मिती.',
          border: 'hover:border-[#3da9fc]/60'
        },
        {
          icon: Smartphone,
          emoji: '📱',
          name: 'ॲप व डिजिटल पोर्टल',
          desc: 'ग्राहकांसाठी सुलभ वेब ॲप्स, क्लायंट पोर्टल आणि इंटरॅक्टिव्ह बिझनेस डॅशबोर्ड्स.',
          border: 'hover:border-blue-400/60'
        },
        {
          icon: Music,
          emoji: '🎵',
          name: 'संगीत व गाणी निर्मिती',
          desc: 'व्हिडिओ, जाहिराती व ब्रँडिंगसाठी मूळ संगीत, पार्श्वसंगीत (BGM) आणि ऑडिओ ट्रॅक्स.',
          border: 'hover:border-purple-400/60'
        },
        {
          icon: ImageIcon,
          emoji: '🖼️',
          name: 'फोटो व ग्राफिक्स निर्मिती',
          desc: 'उत्पादने व सोशल मीडियासाठी उच्च प्रतीचे डिजिटल पोस्टर्स, लोगो आणि व्हिज्युअल आर्ट.',
          border: 'hover:border-emerald-400/60'
        },
        {
          icon: Video,
          emoji: '🎬',
          name: 'व्हिडिओ व रील्स निर्मिती',
          desc: 'व्यवसायाच्या जाहिरातीसाठी लक्षवेधी प्रमोशनल व्हिडिओज, मोशन ग्राफिक्स आणि रील्स.',
          border: 'hover:border-rose-400/60'
        }
      ];
    }
    if (language === 'hi') {
      return [
        {
          icon: Globe,
          emoji: '🌐',
          name: 'वेब डेवलपमेंट',
          desc: 'स्थानीय व्यवसायों के लिए आधुनिक, तीव्र गति और मोबाइल-फ्रेंडली वेबसाइट्स का निर्माण।',
          border: 'hover:border-[#3da9fc]/60'
        },
        {
          icon: Smartphone,
          emoji: '📱',
          name: 'ऐप व डिजिटल पोर्टल्स',
          desc: 'ग्राहकों के लिए उपयोगी वेब ऐप्स, क्लाइंट पोर्टल और इंटरैक्टिव बिजनेस डैशबोर्ड।',
          border: 'hover:border-blue-400/60'
        },
        {
          icon: Music,
          emoji: '🎵',
          name: 'संगीत व गीत रचना',
          desc: 'प्रमोशनल वीडियो और विज्ञापनों के लिए ओरिजिनल बैकग्राउंड म्यूज़िक व ट्रैक्स।',
          border: 'hover:border-purple-400/60'
        },
        {
          icon: ImageIcon,
          emoji: '🖼️',
          name: 'फोटो व डिजिटल आर्ट',
          desc: 'ब्रांड प्रमोशन, बैनर और सोशल मीडिया के लिए उच्च गुणवत्ता वाले ग्राफिक्स।',
          border: 'hover:border-emerald-400/60'
        },
        {
          icon: Video,
          emoji: '🎬',
          name: 'वीडियो व रील्स निर्माण',
          desc: 'व्यवसाय के प्रचार के लिए आकर्षक वीडियो क्लिप्स, मोशन ग्राफिक्स और रील्स।',
          border: 'hover:border-rose-400/60'
        }
      ];
    }
    return [
      {
        icon: Globe,
        emoji: '🌐',
        name: 'Web Development',
        desc: 'Modern, fast-loading, mobile-first responsive websites and custom web applications.',
        border: 'hover:border-[#3da9fc]/60'
      },
      {
        icon: Smartphone,
        emoji: '📱',
        name: 'App Development',
        desc: 'Interactive, lightweight web apps, progressive digital portals, and client dashboards.',
        border: 'hover:border-blue-400/60'
      },
      {
        icon: Music,
        emoji: '🎵',
        name: 'Song Creation',
        desc: 'Original music tracks, background audio compositions, beats, and sound designs.',
        border: 'hover:border-purple-400/60'
      },
      {
        icon: ImageIcon,
        emoji: '🖼️',
        name: 'Photo Generation',
        desc: 'Creative visual graphics, high-impact branding assets, and photo digital art.',
        border: 'hover:border-emerald-400/60'
      },
      {
        icon: Video,
        emoji: '🎬',
        name: 'Video Generation',
        desc: 'Engaging promotional videos, motion visual edits, brand reels, and digital clips.',
        border: 'hover:border-rose-400/60'
      }
    ];
  };

  const skills = getSkills();

  const bioText = language === 'mr'
    ? 'समर्थ झेंडे हे एक तरुण वेब डेव्हलपर आणि सॅमझेन वेब डेव्हलपमेंटचे संस्थापक व मुख्य कार्यकारी अधिकारी (CEO) आहेत. त्यांना तंत्रज्ञान, सर्जनशीलता आणि डिजिटल सोल्यूशन्सची विशेष आवड आहे. ते वेबसाइट्स, ॲप्स, कलात्मक फोटो, व्हिडिओ आणि आधुनिक डिजिटल प्रकल्पांवर काम करतात.'
    : language === 'hi'
    ? 'समर्थ झेंडे एक युवा वेब डेवलपर और सॅमझेन वेब डेवलपमेंट के संस्थापक व मुख्य कार्यकारी अधिकारी (CEO) हैं। वे तकनीक, रचनात्मकता और डिजिटल निर्माण के प्रति समर्पित हैं। वे वेबसाइट्स, ऐप्स, आकर्षक ग्राफिक्स और वीडियो प्रोजेक्ट्स पर काम करते हैं।'
    : 'Samarth Zende is a young web developer and the Founder & CEO of SAMZEN Web Development. He is passionate about technology, creativity, and building digital experiences. He works on websites, apps, creative visuals, videos, and digital projects.';

  return (
    <section id="founder" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[650px] h-[650px] bg-[#3da9fc]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#59e3ff]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Kicker & Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <Award className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>{t('founder.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
            {t('founder.title')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#9db0c8]">
            {t('founder.subtitle')}
          </p>
        </div>

        {/* Main Founder & CEO Feature Card */}
        <div className="rounded-2xl bg-[#0b1220] border border-[#1d2a3e] p-6 sm:p-10 shadow-2xl relative transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Founder Profile & Photograph */}
            <div className="lg:col-span-5 max-w-md mx-auto w-full">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] opacity-25 blur-lg group-hover:opacity-35 transition duration-500" />

                {/* Photo frame */}
                <div className="relative rounded-xl bg-[#0e1726] border border-[#1d2a3e] p-3.5 shadow-2xl">
                  <div className="relative rounded-lg overflow-hidden bg-[#070b14] border border-[#1d2a3e]/60">
                    <img
                      src={samarthOfficialPhoto}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = '/samzen_founder_official.jpg';
                      }}
                      alt="Samarth Zende - Founder & CEO — SAMZEN Web Development"
                      className="w-full h-auto block rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                    {/* Floating Age Tag directly on the founder photograph */}
                    <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-[#070b14]/90 backdrop-blur-md border border-[#3da9fc]/60 text-white shadow-xl flex items-center gap-2 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[#59e3ff] font-extrabold text-sm">{language === 'mr' ? 'वय: १४ वर्षे' : language === 'hi' ? 'आयु: १४ वर्ष' : 'Age: 14 Years Old'}</span>
                      <span className="text-[#9db0c8]">&bull;</span>
                      <span className="text-white text-xs">{t('hero.founderBadge')}</span>
                    </div>
                  </div>

                  {/* Profile Identification */}
                  <div className="mt-4 px-1 pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3da9fc]/10 border border-[#3da9fc]/30 text-[#59e3ff] text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-[#3da9fc]" />
                        <span>Official Profile</span>
                      </div>
                      <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Founder</span>
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                      {t('founder.name')}
                    </h3>
                    <p className="text-sm font-semibold text-[#59e3ff] mt-0.5">
                      {t('hero.founderRole')}
                    </p>

                    {/* Meta Badges: Age & Location */}
                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#070b14] border border-[#3da9fc]/50 text-[#9db0c8]">
                        <Calendar className="w-4 h-4 text-[#3da9fc] flex-shrink-0" />
                        <span><strong className="text-white">{language === 'mr' ? 'वय:' : language === 'hi' ? 'आयु:' : 'Age:'}</strong> <span className="text-[#59e3ff] font-extrabold text-sm ml-1">{language === 'mr' ? '१४ वर्षे' : language === 'hi' ? '१४ वर्ष' : '14 years old'}</span></span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#070b14] border border-[#1d2a3e]/80 text-[#9db0c8]">
                        <MapPin className="w-4 h-4 text-[#59e3ff] flex-shrink-0" />
                        <span><strong className="text-white">{language === 'mr' ? 'स्थान:' : language === 'hi' ? 'स्थान:' : 'Location:'}</strong> {language === 'mr' || language === 'hi' ? 'नाशिक, महाराष्ट्र' : 'Nashik, MH, India'}</span>
                      </div>
                    </div>

                    {/* Quick Direct Connect Buttons */}
                    <div className="mt-4 pt-3 border-t border-[#1d2a3e]/80 flex flex-col sm:flex-row gap-2.5">
                      <a
                        href={SAMZEN_BRAND.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition shadow-md shadow-[#25D366]/20"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{t('contact.whatsappLabel')}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={SAMZEN_BRAND.gmailDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] text-xs font-medium transition"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#59e3ff]" />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: About Samarth & What I Can Do Skills Area */}
            <div className="lg:col-span-7 flex flex-col justify-start text-left">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#3da9fc]/10 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/30 uppercase tracking-wide">
                  {t('hero.founderBadge')}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#0e1726] text-[#9db0c8] text-xs border border-[#1d2a3e] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#59e3ff]" />
                  {language === 'mr' || language === 'hi' ? 'नाशिक, महाराष्ट्र, भारत' : 'Nashik, Maharashtra, India'}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#3da9fc]/20 text-[#59e3ff] text-xs font-extrabold border border-[#3da9fc]/50 flex items-center gap-1.5 shadow-sm shadow-[#3da9fc]/20">
                  <Calendar className="w-3.5 h-3.5 text-[#3da9fc]" />
                  {language === 'mr' ? 'वय: १४ वर्षे' : language === 'hi' ? 'आयु: १४ वर्ष' : 'Age: 14 Years Old'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                {language === 'mr' ? 'समर्थ झेंडे यांच्याविषयी' : language === 'hi' ? 'समर्थ झेंडे के बारे में' : 'About Samarth'}
              </h3>
              
              {/* About Text Requested by User */}
              <div className="mt-4 p-5 rounded-xl bg-[#0e1726]/70 border border-[#1d2a3e] text-left">
                <p className="text-base sm:text-lg text-[#eef3fa] leading-relaxed">
                  {bioText}
                </p>
                <div className="mt-3.5 pt-3 border-t border-[#1d2a3e]/80 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9db0c8]">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#59e3ff]">
                    <Code2 className="w-3.5 h-3.5 text-[#3da9fc]" />
                    Full-Stack Creator &amp; Digital Architect
                  </span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Available for New Projects
                  </span>
                </div>
              </div>

              {/* WHAT I CAN DO - Skills & Services Area */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3da9fc] animate-pulse" />
                    <h4 className="text-lg sm:text-xl font-bold font-heading text-white uppercase tracking-wider">
                      {language === 'mr' ? 'मी काय तयार करू शकतो' : language === 'hi' ? 'मैं क्या बना सकता हूँ' : 'What I Can Do'}
                    </h4>
                  </div>
                  <span className="text-xs text-[#9db0c8]">
                    {t('founder.skillsTitle')}
                  </span>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {skills.map((skill) => {
                    return (
                      <div
                        key={skill.name}
                        className={`group p-4 rounded-xl bg-[#0e1726]/80 border border-[#1d2a3e] ${skill.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#3da9fc]/10`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#070b14] border border-[#1d2a3e] flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-115 transition-transform duration-300">
                            <span>{skill.emoji}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-sm font-bold text-white group-hover:text-[#59e3ff] transition-colors">
                                {skill.name}
                              </h5>
                            </div>
                            <p className="text-xs text-[#9db0c8] mt-1 leading-relaxed">
                              {skill.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Founder Commitment Footer */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#3da9fc]/10 via-[#0e1726] to-[#0e1726] border border-[#3da9fc]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white text-sm">
                    {language === 'mr' ? 'आपल्या मनात एखादा नवीन प्रोजेक्ट किंवा कल्पना आहे का?' : language === 'hi' ? 'क्या आपके पास कोई नया प्रोजेक्ट या विचार है?' : 'Have a project or creative idea in mind?'}
                  </div>
                  <div className="text-[#9db0c8] mt-0.5">
                    {language === 'mr' ? 'कस्टम वेबसाइट्स आणि डिजिटल सोल्यूशन्ससाठी समर्थ झेंडे यांच्याशी थेट संपर्क साधा.' : language === 'hi' ? 'कस्टम वेबसाइट्स और डिजिटल समाधान के लिए सीधे समर्थ झेंडे से संपर्क करें।' : 'Connect directly with Samarth Zende for custom websites, apps, and digital media.'}
                  </div>
                </div>
                <a
                  href={SAMZEN_BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs transition flex-shrink-0 whitespace-nowrap"
                >
                  <span>{t('hero.ctaWhatsapp')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
