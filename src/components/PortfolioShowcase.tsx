import React, { useState } from 'react';
import garageImg from '../assets/images/portfolio_garage_web_1793613157329.jpg';
import coachingImg from '../assets/images/portfolio_coaching_web_1793613169532.jpg';
import restaurantImg from '../assets/images/portfolio_restaurant_web_1793613180575.jpg';
import salonImg from '../assets/images/portfolio_salon_web_1793613191454.jpg';
import { 
  Laptop, 
  Smartphone, 
  Eye, 
  X, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  domainUrl: string;
  image: string;
  planId: string;
  planName: string;
  price: string;
  deliveryTime: string;
  description: string;
  highlights: string[];
  simulatedStats: { label: string; value: string }[];
  previewHeroTitle: string;
  previewHeroDesc: string;
  previewCta: string;
}

const SHOWCASE_ITEMS: PortfolioItem[] = [
  {
    id: 'garage',
    title: 'Apex Auto Garage & Detailing Hub',
    category: 'Garages & Auto Workshops',
    domainUrl: 'https://apex-motors.samzen.in',
    image: garageImg,
    planId: 'plan-1',
    planName: 'Plan 1 — Basic Business',
    price: '₹3,999',
    deliveryTime: '48 Hours',
    description: 'High-speed local workshop site with emergency towing click-to-call and Google Maps routing.',
    highlights: [
      '1-Tap Call & WhatsApp Emergency Towing',
      'Live Google Maps Directions & Landmark pin',
      'Service Rate Card (Brakes, Engine Oil, Denting)',
      'Customer Reviews & Photo Bay Gallery'
    ],
    simulatedStats: [
      { label: 'Speed Score', value: '99/100' },
      { label: 'Mobile Test', value: '100%' },
      { label: 'AMC Coverage', value: 'Included' }
    ],
    previewHeroTitle: 'Apex Motors — Certified Multi-Brand Car Service & Diagnostics',
    previewHeroDesc: 'Same-day periodic car maintenance, computer scanning, and AC repairs in Nashik. Trusted by 1,200+ vehicle owners.',
    previewCta: 'Book Bay On WhatsApp'
  },
  {
    id: 'coaching',
    title: 'Shree Samarth Coaching Academy',
    category: 'Coaching Classes & Tuitions',
    domainUrl: 'https://shreesamarth-academy.samzen.in',
    image: coachingImg,
    planId: 'plan-2',
    planName: 'Plan 2 — Professional Growth',
    price: '₹7,499',
    deliveryTime: '4 Days',
    description: 'Educational authority portal featuring batch schedules, syllabus PDFs, and parent WhatsApp counseling desk.',
    highlights: [
      'Batch Timings & Upcoming Admission Alerts',
      'Downloadable Sample Papers & Formula Sheets',
      'Rankers Hall of Fame & Toppers Gallery',
      'Direct WhatsApp Parent Counseling Desk'
    ],
    simulatedStats: [
      { label: 'Inbound Leads', value: '+140%' },
      { label: 'Page Load', value: '0.7s' },
      { label: 'AMC Coverage', value: 'Included' }
    ],
    previewHeroTitle: 'Proven Excellence in 10th & 12th Board, JEE & NEET Coaching',
    previewHeroDesc: 'Small personalized batches, dedicated concept clearing, and veteran faculty helping students crack competitive milestones.',
    previewCta: 'Inquire for Admission'
  },
  {
    id: 'restaurant',
    title: 'Spice Route Bistro & Rooftop Dining',
    category: 'Restaurants & Hotels',
    domainUrl: 'https://spiceroute-bistro.samzen.in',
    image: restaurantImg,
    planId: 'plan-3',
    planName: 'Plan 3 — Advanced Business',
    price: '₹14,999',
    deliveryTime: '5 Days',
    description: 'Culinary dining destination with interactive digital menu, rooftop table reservation, and direct WhatsApp takeout ordering.',
    highlights: [
      'Mobile-Optimized Categorized Food Menu',
      'Rooftop Table Reservation & Event Booking',
      'Zero-Commission WhatsApp Takeout Ordering',
      'Integrated UPI Payment QR Code'
    ],
    simulatedStats: [
      { label: 'Direct Bookings', value: '+68%' },
      { label: 'Commission Saved', value: '100%' },
      { label: 'AMC Coverage', value: 'Included' }
    ],
    previewHeroTitle: 'Authentic Maharashtrian, Tandoor & Mughlai Delicacies',
    previewHeroDesc: 'Experience scenic skyline dining under starlit skies with live sizzlers, chef specials, and warm Maharashtrian hospitality.',
    previewCta: 'Reserve Rooftop Table'
  },
  {
    id: 'salon',
    title: 'Aura Luxury Unisex Salon & Spa',
    category: 'Salons & Beauty Parlours',
    domainUrl: 'https://aura-salon.samzen.in',
    image: salonImg,
    planId: 'plan-2',
    planName: 'Plan 2 — Professional Growth',
    price: '₹7,499',
    deliveryTime: '3 Days',
    description: 'Bespoke beauty aesthetics site with bridal packages, hair treatment menu, and direct stylist appointment bookings.',
    highlights: [
      'Bridal Makeup Showcase & Before/After Gallery',
      'Transparent Price Menu (Hair, Spa, Skin)',
      '1-Click WhatsApp Stylist Slot Booking',
      'Client Testimonials & Google Maps Location'
    ],
    simulatedStats: [
      { label: 'Slot Conversions', value: '3x Faster' },
      { label: 'Design Tier', value: 'Bespoke' },
      { label: 'AMC Coverage', value: 'Included' }
    ],
    previewHeroTitle: 'Aura Luxury Salon — Premium Hair, Skin & Bridal Glamour',
    previewHeroDesc: 'Discover tranquil rejuvenation, expert organic hair color, and radiant bridal transformations customized for your big day.',
    previewCta: 'Book Stylist Appointment'
  }
];

interface PortfolioShowcaseProps {
  onSelectPlan?: (planId: string, planName: string) => void;
  onOpenCreateWebsite?: (planId?: string, category?: string) => void;
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  onSelectPlan,
  onOpenCreateWebsite
}) => {
  const [selectedPreview, setSelectedPreview] = useState<PortfolioItem | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleOrderSimilar = (item: PortfolioItem) => {
    if (onOpenCreateWebsite) {
      onOpenCreateWebsite(item.planId, item.category);
    } else if (onSelectPlan) {
      onSelectPlan(item.planId, item.planName);
    }
  };

  const getWhatsAppOrderUrl = (item: PortfolioItem) => {
    const text = encodeURIComponent(
      `Hello Samarth! I saw the showcase website for "${item.title}" (${item.category}). I want a website like this for my business. Can we discuss?`
    );
    return `https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=${text}`;
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative scroll-mt-20 overflow-hidden w-full max-w-full">
      {/* Background Subtle Ambience (Strictly Clipped) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 max-w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[400px] bg-[#3da9fc]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] text-xs font-semibold uppercase tracking-wider text-[#59e3ff] mb-3">
            <Globe className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Proven Client Deliverables</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
            Client Website Showcase
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] leading-relaxed">
            Every website is custom engineered for maximum mobile speed, Google local ranking, and direct customer conversion. Click any project to open an interactive live preview.
          </p>
        </div>

        {/* 4 Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
          {SHOWCASE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group bg-[#0b1220] rounded-2xl border border-[#1d2a3e] hover:border-[#3da9fc]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#3da9fc]/10"
            >
              {/* Browser Header Bar */}
              <div className="bg-[#070b14] px-4 py-2.5 border-b border-[#1d2a3e] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] text-[#9db0c8] font-mono truncate max-w-[200px]">
                    {item.domainUrl}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                    Live Status: 100%
                  </span>
                </div>
              </div>

              {/* Screenshot Media Container */}
              <div 
                className="relative overflow-hidden cursor-pointer aspect-[16/9] bg-[#070b14]"
                onClick={() => setSelectedPreview(item)}
              >
                <img
                  src={item.image}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = `/assets/images/${item.id}.jpg`;
                  }}
                  alt={`${item.title} preview screenshot`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Hover Scrim with Live Preview Prompt */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#59e3ff] block mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPreview(item);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs shadow-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Meta & Features */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d2a3e] text-xs">
                    <span className="text-[#9db0c8]">
                      Tier: <strong className="text-white">{item.planName}</strong>
                    </span>
                    <span className="text-[#9db0c8] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#59e3ff]" />
                      <span>Delivered in <strong className="text-emerald-400">{item.deliveryTime}</strong></span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#9db0c8] mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {item.highlights.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#eef3fa]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="pt-4 border-t border-[#1d2a3e] flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => handleOrderSimilar(item)}
                    className="btn-interactive w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/15 flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get Website Like This ({item.price})</span>
                  </button>

                  <button
                    onClick={() => setSelectedPreview(item)}
                    className="btn-interactive w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#0e1726] hover:bg-[#152338] border border-[#1d2a3e] hover:border-[#3da9fc]/50 text-[#59e3ff] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Interactive View</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Full Preview Modal with Desktop/Mobile Switcher */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Bar */}
            <div className="bg-[#070b14] border-b border-[#1d2a3e] px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-bold text-white hidden sm:inline">
                  {selectedPreview.title}
                </span>
                <span className="text-[11px] text-[#59e3ff] font-mono hidden md:inline">
                  &bull; {selectedPreview.domainUrl}
                </span>
              </div>

              {/* Responsive Device Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#0e1726] p-1 rounded-lg border border-[#1d2a3e]">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`px-3 py-1 rounded text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    deviceMode === 'desktop'
                      ? 'bg-[#3da9fc] text-[#070b14] font-bold'
                      : 'text-[#9db0c8] hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`px-3 py-1 rounded text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    deviceMode === 'mobile'
                      ? 'bg-[#3da9fc] text-[#070b14] font-bold'
                      : 'text-[#9db0c8] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile (375px)</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1.5 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] text-[#9db0c8] hover:text-white transition cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Viewport Frame */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#030712] flex justify-center">
              <div
                className={`transition-all duration-300 rounded-xl border border-[#1d2a3e] bg-[#070b14] overflow-hidden flex flex-col ${
                  deviceMode === 'mobile' ? 'w-full max-w-[375px] shadow-2xl' : 'w-full'
                }`}
              >
                {/* Simulated Header */}
                <div className="px-4 py-3 bg-[#0a0f1d] border-b border-[#1d2a3e] flex items-center justify-between">
                  <div className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#59e3ff]" />
                    <span className="truncate max-w-[180px] sm:max-w-none">{selectedPreview.title}</span>
                  </div>
                  <a
                    href={getWhatsAppOrderUrl(selectedPreview)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold px-2.5 py-1 rounded bg-[#25D366] text-black hover:bg-[#20ba59] transition flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* High-Resolution Screenshot Banner */}
                <div className="relative aspect-[16/9] w-full bg-black overflow-hidden border-b border-[#1d2a3e]">
                  <img
                    src={selectedPreview.image}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = `/assets/images/${selectedPreview.id}.jpg`;
                    }}
                    alt={`${selectedPreview.title} live screenshot`}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Simulated Content Area */}
                <div className="p-5 sm:p-8 bg-[#070b14] text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#3da9fc]/15 border border-[#3da9fc]/30 text-[#59e3ff] text-[11px] font-bold">
                      {selectedPreview.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1d2a3e] text-white text-[11px] font-semibold">
                      Turnaround: {selectedPreview.deliveryTime}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                      Price: {selectedPreview.price}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2">
                    {selectedPreview.previewHeroTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#9db0c8] leading-relaxed mb-6">
                    {selectedPreview.previewHeroDesc}
                  </p>

                  {/* Included Features */}
                  <div className="mb-6 p-4 rounded-xl bg-[#0e1726] border border-[#1d2a3e]">
                    <div className="text-xs font-bold text-[#59e3ff] uppercase tracking-wider mb-3">
                      Core Features Built Into This Website:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedPreview.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-[#eef3fa]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Support Guarantee Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-[#3da9fc]/15 border border-emerald-500/30 text-xs text-white flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>
                      Guaranteed Annual Maintenance Contract (AMC) available for continuous domain renewal, backups, and live technical support.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="bg-[#070b14] border-t border-[#1d2a3e] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#9db0c8] text-center sm:text-left">
                Want a custom website tailored specifically to your business? Handcrafted by <strong className="text-white">Samarth Zende (Founder &amp; CEO)</strong>.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const item = selectedPreview;
                    setSelectedPreview(null);
                    handleOrderSimilar(item);
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-bold text-xs shadow-lg shadow-[#3da9fc]/20 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Similar Website ({selectedPreview.price})</span>
                </button>

                <a
                  href={getWhatsAppOrderUrl(selectedPreview)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
