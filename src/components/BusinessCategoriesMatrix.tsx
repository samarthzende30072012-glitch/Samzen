import React, { useState } from 'react';
import {
  Sparkles,
  Scissors,
  Dumbbell,
  BookOpen,
  GraduationCap,
  Hotel,
  UtensilsCrossed,
  ShoppingBag,
  Wrench,
  Factory,
  MapPin,
  Building2,
  Hammer,
  School,
  Briefcase,
  FolderKanban,
  Building,
  Compass,
  Stethoscope,
  Store,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { PLANS } from '../data/samzenData';

export interface BusinessNiche {
  id: string;
  name: string;
  icon: any;
  tagline: string;
  realityCheck: string;
  features: string[];
  recommendedPlanId: string;
  recommendedPlanName: string;
  recommendedPrice: string;
  suitablePlanRationale: string;
}

export const NICHE_CATEGORIES: BusinessNiche[] = [
  {
    id: 'beauty-parlours',
    name: 'Beauty Parlours',
    icon: Sparkles,
    tagline: 'Bridal packages, facials, skin treatments & HD transformation gallery.',
    realityCheck: '82% of women search Instagram or Google before booking bridal and skin treatments. Without an online menu and photo gallery, they choose competing parlours with visible pricing and reviews.',
    features: [
      'HD Bridal & Treatment Portfolio Gallery',
      'Instant 1-Tap WhatsApp Slot Booking',
      'Live Google Maps Directions & Landmark Pin'
    ],
    recommendedPlanId: 'plan-1',
    recommendedPlanName: 'Plan 1 — Basic Business',
    recommendedPrice: '₹4,999',
    suitablePlanRationale: 'Includes custom domain, mobile gallery, and direct WhatsApp appointment triggers.'
  },
  {
    id: 'salons',
    name: 'Salons',
    icon: Scissors,
    tagline: 'Haircuts, beard grooming, spa therapies & stylist appointments.',
    realityCheck: 'Clients hate waiting in line on weekends. When salons lack an online booking page, customers walk away or assume the salon is unorganized.',
    features: [
      'Transparent Hair & Spa Service Price Matrix',
      'Stylist Profile Highlights & Work Examples',
      'Direct WhatsApp Appointment & Queue Desk'
    ],
    recommendedPlanId: 'plan-1',
    recommendedPlanName: 'Plan 1 — Basic Business',
    recommendedPrice: '₹4,999',
    suitablePlanRationale: 'Ideal for neighborhood grooming hubs looking for professional online credibility.'
  },
  {
    id: 'gyms',
    name: 'Gyms & Fitness Centers',
    icon: Dumbbell,
    tagline: 'Workout floors, personal coaching, weight loss & membership tiers.',
    realityCheck: 'Prospects research gym equipment, trainer credentials, and membership pricing from home before ever visiting. An inactive social page loses high-value yearly memberships.',
    features: [
      'Virtual Gym Floor & Biomechanical Equipment Tour',
      'Transparent Monthly/Annual Membership Matrix',
      'Instant 1-Day Free Trial Workout Pass Lead Form'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Allows rich multimedia showcase of your equipment and trainer profiles to convert memberships.'
  },
  {
    id: 'tuition-classes',
    name: 'Tuition Classes',
    icon: BookOpen,
    tagline: 'School syllabus (8th-12th), concept building & subject coaching.',
    realityCheck: 'Parents no longer rely solely on word-of-mouth. They demand to see past board exam marks, syllabus structure, and qualified teacher bios before entrusting their children.',
    features: [
      'Subject-Wise Syllabus & Batch Timing Timetable',
      'Downloadable Sample Papers & Concept Notes',
      'Direct Parent Admission WhatsApp Hotline'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Comprehensive professional site to display your subjects, batch timetables, downloadable notes, and parent admission inquiries.'
  },
  {
    id: 'coaching-classes',
    name: 'Coaching Classes',
    icon: GraduationCap,
    tagline: 'JEE, NEET, MHT-CET, Foundation & competitive entrance programs.',
    realityCheck: 'Competitive coaching is an intense high-trust investment. Without a dedicated website displaying topper rankers and authentic testimonials, serious parents go to national franchises.',
    features: [
      'Rankers Hall of Fame & Verified Scorecards',
      'Batch Timings, Fee Breakdown & Admission Dates',
      'One-Click WhatsApp Parent Counseling Desk'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Full custom design with rich student galleries, PDF downloads, and lead capture forms.'
  },
  {
    id: 'hotels',
    name: 'Hotels & Lodges',
    icon: Hotel,
    tagline: 'Room suites, tariffs, banquet halls & direct tourist reservations.',
    realityCheck: 'Aggregators charge 18% to 25% commission on every room night booked. A fast website with direct WhatsApp bookings lets you keep 100% of your tariff profits.',
    features: [
      'Room Categories, Amenities & Tariff Matrix',
      'Direct 0%-Commission WhatsApp Room Booking',
      'Nearby Attractions & Driving Landmark Guide'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Bespoke layouts for room galleries, banquet inquiries, and direct reservation inquiries.'
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Cafes',
    icon: UtensilsCrossed,
    tagline: 'Visual menus, rooftop ambiance, table reservations & takeout.',
    realityCheck: 'Food delivery apps take up to 30% cut per order and hide client data. A branded website builds direct customer loyalty, table reservations, and party inquiries.',
    features: [
      'Mobile-First Visual Food & Beverage Menu',
      'Table Reservation & Private Party Booking Form',
      'Direct UPI QR Code & WhatsApp Takeaway Desk'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Includes responsive menus, gallery of ambiance, and instant booking coordination.'
  },
  {
    id: 'shops',
    name: 'Shops & Retailers',
    icon: ShoppingBag,
    tagline: 'Clothing, hardware, electronics, groceries & specialty retail.',
    realityCheck: 'Shoppers check online whether local stores carry their preferred brands before stepping outside. Without an online catalog, you surrender footfall to online e-commerce giants.',
    features: [
      'Product Category Showcase with Stock Highlights',
      'Store Location, Timings & Parking Details',
      'Quick WhatsApp Stock & Price Inquiry'
    ],
    recommendedPlanId: 'plan-1',
    recommendedPlanName: 'Plan 1 — Basic Business',
    recommendedPrice: '₹4,999',
    suitablePlanRationale: 'Showcases your product categories and turns online searches into store visits.'
  },
  {
    id: 'garages',
    name: 'Garages & Auto Workshops',
    icon: Wrench,
    tagline: 'Car & bike maintenance, accident repairs, denting & painting.',
    realityCheck: 'When a car engine stalls or an accident occurs, drivers search Google for the nearest mechanic. If your garage has no website, those lucrative repair jobs go to your competitor.',
    features: [
      'Emergency 1-Tap Call & Towing Assistance',
      'Transparent Periodic Service & Detailing Rate Card',
      'Google Maps Directions with Live Location Pin'
    ],
    recommendedPlanId: 'plan-1',
    recommendedPlanName: 'Plan 1 — Basic Business',
    recommendedPrice: '₹4,999',
    suitablePlanRationale: 'Fast 48-hour delivery with click-to-call buttons and instant emergency directions.'
  },
  {
    id: 'factories',
    name: 'Factories & Industrial Units',
    icon: Factory,
    tagline: 'Fabrication, CNC machining, component exports & bulk supply.',
    realityCheck: 'B2B corporate clients and procurement officers require ISO certifications, plant machinery capabilities, and technical specs before sending high-value tenders or RFQs.',
    features: [
      'Plant Machinery & Manufacturing Capacity Specs',
      'Downloadable PDF Technical Catalogs & Certifications',
      'Bulk RFQ (Request for Quote) Inquiry Engine'
    ],
    recommendedPlanId: 'plan-3',
    recommendedPlanName: 'Plan 3 — Advanced Business',
    recommendedPrice: '₹16,999',
    suitablePlanRationale: 'Enterprise-grade speed, multi-page technical catalog, and customized RFQ forms.'
  },
  {
    id: 'local-businesses',
    name: 'Local Businesses',
    icon: MapPin,
    tagline: 'Catering, tent house, event organizers, decorators & rentals.',
    realityCheck: 'Word of mouth expands 10x when happy clients can simply forward a sleek website link on WhatsApp. Without a website, people forget your business details.',
    features: [
      'Clear Business Intro & Trust Credentials',
      'Customer Testimonials & Past Event Photo Highlights',
      'Direct Calling & WhatsApp Quotation Request'
    ],
    recommendedPlanId: 'plan-1',
    recommendedPlanName: 'Plan 1 — Basic Business',
    recommendedPrice: '₹4,999',
    suitablePlanRationale: 'Gives your local brand genuine presence, credibility, and instant contact options.'
  },
  {
    id: 'small-businesses',
    name: 'Small Businesses & Startups',
    icon: Building2,
    tagline: 'Consultancies, distributors, agencies & regional brands.',
    realityCheck: 'Without an official website with a custom .com or .in domain, corporate clients perceive your venture as temporary or high-risk.',
    features: [
      'Core Product/Service Offerings Breakdown',
      'Company Vision, Founder Profile & Credibility Markers',
      'Lead Capture Form & Consultation Calendar'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Comprehensive profile with SSL security, custom domain, and custom branding.'
  },
  {
    id: 'service-providers',
    name: 'Service Providers',
    icon: Hammer,
    tagline: 'Electricians, plumbers, pest control, carpenters & AC repair.',
    realityCheck: 'People need urgent help during home emergencies. A sleek mobile website with visible transparent rates and click-to-call dispatch wins the job every single time.',
    features: [
      'Emergency On-Demand Service Request Button',
      'Transparent Hourly & Fixed Job Rate Estimates',
      'Verified Work Guarantee & Customer Testimonials'
    ],
    recommendedPlanId: 'plan-0',
    recommendedPlanName: 'Starter Plan',
    recommendedPrice: '₹2,499',
    suitablePlanRationale: 'Affordable, instantaneous single-page digital pamphlet with direct phone links.'
  },
  {
    id: 'educational-institutes',
    name: 'Educational Institutes',
    icon: School,
    tagline: 'Schools, colleges, vocational centers & technical academies.',
    realityCheck: 'Accreditation inspectors, parents, and alumni expect a formal digital campus with official circulars, admission portals, and faculty credentials.',
    features: [
      'Official Academic Calendar, Notices & Circulars Board',
      'Online Student Admission Inquiry & Application Desk',
      'Campus Infrastructure & Faculty Credentials Directory'
    ],
    recommendedPlanId: 'plan-3',
    recommendedPlanName: 'Plan 3 — Advanced Business',
    recommendedPrice: '₹16,999',
    suitablePlanRationale: 'Multi-page architecture with document management, notices, and priority support.'
  },
  {
    id: 'professionals',
    name: 'Professionals & Consultants',
    icon: Briefcase,
    tagline: 'Doctors, lawyers, chartered accountants, architects & planners.',
    realityCheck: 'High-net-worth clients always vet professional credentials online before booking consultation sessions. Social profiles fail to establish elite advisory authority.',
    features: [
      'Specialization Areas & Case Studies Showcase',
      'Consultation Booking & Fee Structure Overview',
      'Confidential WhatsApp & Email Inquiry Routing'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Polished, authoritative branding tailored to elevate consultative credibility.'
  },
  {
    id: 'portfolios',
    name: 'Portfolios & Creators',
    icon: FolderKanban,
    tagline: 'Photographers, videographers, graphic artists & freelancers.',
    realityCheck: 'Clients hire creatives solely based on presentation. A clunky drive link loses freelance gigs, whereas a bespoke visual portfolio commands 3x higher project rates.',
    features: [
      'Full-Resolution Filterable Creative Showcase Gallery',
      'Client List, Published Work & Creative Process',
      'Direct Project Commission & Availability Form'
    ],
    recommendedPlanId: 'plan-1',
    recommendedPlanName: 'Plan 1 — Basic Business',
    recommendedPrice: '₹4,999',
    suitablePlanRationale: 'Ultra-fast visual portfolio designed to make creative projects pop on mobile screens.'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Developers',
    icon: Building,
    tagline: 'Luxury flats, commercial plots, floor plans & high-intent buyer leads.',
    realityCheck: 'Home buyers inspect property listings, 3D layouts, and RERA approvals online before booking site visits. Without a proper website, premium property buyers bypass your projects.',
    features: [
      'Filterable Property Listings & Floor Plans Viewer',
      'RERA Compliance & Builder Credibility Highlights',
      'Direct Site Visit & WhatsApp Callback Form'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'High-end showcase for real estate projects with floor plans and site booking forms.'
  },
  {
    id: 'travel-tourism',
    name: 'Travel & Tourism Agencies',
    icon: Compass,
    tagline: 'Custom holiday tour packages, itinerary planner & visa assistance.',
    realityCheck: 'Travelers demand day-wise itineraries, hotel tier details, and transparent costs before paying booking advances. Social posts fail to capture complete booking confidence.',
    features: [
      'Day-Wise Tour Itinerary & Package Highlights',
      'Transparent Inclusions/Exclusions Rate Cards',
      'Direct WhatsApp Custom Package Planner Desk'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Interactive tour package presentation with high-resolution photo galleries and inquiry routing.'
  },
  {
    id: 'hospitals-clinics',
    name: 'Hospitals, Clinics & Doctors',
    icon: Stethoscope,
    tagline: 'Doctor profiles, OPD timetables, patient appointments & lab tests.',
    realityCheck: 'Patients check specialist credentials, OPD timings, and clinic emergency numbers online before visiting. A transparent clinic site builds immediate patient trust.',
    features: [
      'Doctor Qualifications & Specialities Directory',
      'OPD Timetable & Online Patient Appointment Desk',
      '1-Tap Emergency Hotline & Google Maps Landmark Pin'
    ],
    recommendedPlanId: 'plan-2',
    recommendedPlanName: 'Plan 2 — Professional Growth',
    recommendedPrice: '₹8,999',
    suitablePlanRationale: 'Complete medical practice website with appointment forms, OPD schedules, and emergency triggers.'
  },
  {
    id: 'e-commerce',
    name: 'E-Commerce & Online Stores',
    icon: Store,
    tagline: 'Online product catalogs, shopping cart, UPI checkout & order alerts.',
    realityCheck: 'Modern buyers prefer purchasing directly online without manual messaging. An online store operates 24/7, driving higher basket sizes and automated sales.',
    features: [
      'Interactive Product Catalog & Shopping Cart',
      'UPI, Card & Razorpay Payment Integration',
      'Instant WhatsApp Order Notification Engine'
    ],
    recommendedPlanId: 'plan-3',
    recommendedPlanName: 'Plan 3 — Advanced Business',
    recommendedPrice: '₹16,999',
    suitablePlanRationale: 'Full e-commerce setup with online cart, UPI checkout, and automated order alerts.'
  }
];

interface BusinessCategoriesMatrixProps {
  onStartWebsite: (categoryTitle: string, recommendedPlanId?: string) => void;
}

export const BusinessCategoriesMatrix: React.FC<BusinessCategoriesMatrixProps> = ({
  onStartWebsite
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNiche, setActiveNiche] = useState<BusinessNiche | null>(null);

  const modalContentRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll when activeNiche modal is open and reset modal scroll position
  React.useEffect(() => {
    if (activeNiche) {
      document.body.style.overflow = 'hidden';
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'instant' as any });
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveNiche(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeNiche]);

  const filteredNiches = NICHE_CATEGORIES.filter((niche) =>
    niche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    niche.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWhatsAppNicheUrl = (niche: BusinessNiche) => {
    const text = encodeURIComponent(
      `Hello Samarth! I run a "${niche.name}" business. I want to build a website with the ${niche.recommendedPlanName} (${niche.recommendedPrice}). Can we discuss the requirements?`
    );
    return `https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=${text}`;
  };

  // Cohesive Cyan & Electric Blue Theme with Subtle Gold Accents
  const NICHE_COLOR_PALETTES = [
    { iconColor: 'text-[#00f2fe]', iconBg: 'bg-[#00f2fe]/10 border-[#00f2fe]/30', border: 'hover:border-[#00f2fe]', glow: 'hover:shadow-[0_0_28px_rgba(0,242,254,0.3)]' },
    { iconColor: 'text-[#3da9fc]', iconBg: 'bg-[#3da9fc]/10 border-[#3da9fc]/30', border: 'hover:border-[#3da9fc]', glow: 'hover:shadow-[0_0_28px_rgba(61,169,252,0.3)]' },
    { iconColor: 'text-[#59e3ff]', iconBg: 'bg-[#59e3ff]/10 border-[#59e3ff]/30', border: 'hover:border-[#59e3ff]', glow: 'hover:shadow-[0_0_28px_rgba(89,227,255,0.3)]' },
    { iconColor: 'text-amber-300', iconBg: 'bg-amber-400/10 border-amber-400/30', border: 'hover:border-amber-400/60', glow: 'hover:shadow-[0_0_26px_rgba(251,191,36,0.25)]' }
  ];

  return (
    <section id="services" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-gradient-to-b from-[#070b14] via-[#091122] to-[#070b14] relative scroll-mt-20 overflow-hidden w-full max-w-full">
      {/* Background Ambient Glows (Strictly Clipped) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 max-w-full">
        <div className="absolute top-1/3 right-0 w-80 max-w-full h-80 bg-[#3da9fc]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-0 w-80 max-w-full h-80 bg-[#00f2fe]/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>Tailored Industry Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
              The 20 Business Categories
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#c9d3dc]">
              Click on your exact industry below to see why you are losing customers without a website, the 3 must-have features, and our recommended plan.
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#9db0c8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by business type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0e1726]/80 border border-white/15 text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition shadow-inner backdrop-blur-md"
            />
          </div>
        </div>

        {/* 16 Category Interactive Grid with High-Performance Hover Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {filteredNiches.map((niche, idx) => {
            const Icon = niche.icon;
            const colorPalette = NICHE_COLOR_PALETTES[idx % NICHE_COLOR_PALETTES.length];

            return (
              <button
                key={niche.id}
                onClick={() => setActiveNiche(niche)}
                className={`group p-5 rounded-2xl glass-card-shiny border border-white/10 ${colorPalette.border} ${colorPalette.glow} transition-all duration-300 ease-out flex flex-col justify-between text-left cursor-pointer hover:-translate-y-2 hover:scale-[1.03] hover:border-cyan-400 bg-gradient-to-b from-[#0e1726]/90 to-[#070b14]/90`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${colorPalette.iconBg} ${colorPalette.iconColor} group-hover:scale-110 group-hover:bg-[#3da9fc]/20 transition-all duration-300 shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-[#9db0c8] group-hover:text-cyan-300 transition-colors">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                    {niche.name}
                  </h3>
                  <p className="text-xs text-[#9db0c8] line-clamp-2 leading-relaxed group-hover:text-[#eef3fa] transition-colors">
                    {niche.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-bold">
                    {niche.recommendedPrice}
                  </span>
                  <span className="text-[#9db0c8] group-hover:text-white flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300 font-medium">
                    <span>View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filteredNiches.length === 0 && (
          <div className="py-12 text-center text-sm text-[#9db0c8] glass-card-shiny rounded-2xl border border-white/10">
            No matching category found, but SAMZEN builds custom websites for any custom business requirement!
          </div>
        )}
      </div>

      {/* Deep-Dive Category Detail Modal */}
      {activeNiche && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveNiche(null);
          }}
        >
          {(() => {
            const recPlan = PLANS.find((p) => p.id === activeNiche.recommendedPlanId);
            const recDiscount = recPlan ? recPlan.discountPercent : 40;
            const recOriginalPrice = recPlan ? recPlan.originalPrice : '₹9,999';

            return (
              <div className="bg-[#0e1726]/98 border border-cyan-500/40 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,242,254,0.25)] glass-card-shiny my-3 sm:my-6 animate-scaleUp">
                {/* Modal Header */}
                <div className="bg-[#070b14]/95 border-b border-white/10 px-5 sm:px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <activeNiche.icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold font-heading text-white">
                          {activeNiche.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                          Save {recDiscount}% OFF &bull; {activeNiche.recommendedPrice}
                        </span>
                      </div>
                      <p className="text-xs text-[#9db0c8]">
                        Conversion Blueprint &amp; Digital Features
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveNiche(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9db0c8] hover:text-white transition cursor-pointer border border-white/10"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div ref={modalContentRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* (a) The Reality Check: Why they are losing money without a website */}
                  <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                    <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span>The Reality Check &mdash; Why You Lose Revenue Without a Website:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#eef3fa] leading-relaxed">
                      {activeNiche.realityCheck}
                    </p>
                  </div>

                  {/* (b) 3 Must-Have Features */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>3 Must-Have Features For Your {activeNiche.name} Website:</span>
                    </h4>
                    <div className="space-y-2.5">
                      {activeNiche.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#070b14]/70 border border-white/10 flex items-start gap-3 shadow-inner"
                        >
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-white block">
                              Feature #{idx + 1}: {feat}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* (c) Recommended Plan */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-[#070b14]/90 to-cyan-500/15 border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#9db0c8]">
                        Recommended Solution
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {activeNiche.recommendedPlanName}
                      </div>
                      <div className="text-xs text-[#9db0c8] mt-1">
                        {activeNiche.suitablePlanRationale}
                      </div>
                    </div>

                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                        Special Offer &bull; Save {recDiscount}% OFF
                      </div>
                      <div className="flex items-baseline gap-1.5 justify-start sm:justify-end">
                        <span className="text-xs text-slate-400 line-through font-mono font-bold">
                          {recOriginalPrice}
                        </span>
                        <span className="text-2xl font-extrabold font-heading text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                          {activeNiche.recommendedPrice}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-bold">
                        🔥 Save {recDiscount}% by buying now! + Free AMC Support
                      </div>
                    </div>
                  </div>
                </div>

                {/* (d) Modal Action CTAs */}
                <div className="bg-[#070b14]/90 border-t border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href={getWhatsAppNicheUrl(activeNiche)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-bold text-xs transition shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discuss on WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setActiveNiche(null)}
                      className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => {
                        const niche = activeNiche;
                        setActiveNiche(null);
                        onStartWebsite(niche.name, niche.recommendedPlanId);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl btn-shiny-cta text-white font-extrabold text-xs shadow-lg transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#ffd166]" />
                      <span>Start My Website Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
};
