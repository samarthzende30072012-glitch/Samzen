import { PlanItem, WorkStep, ServicePolicyItem, PortfolioProject, TestimonialItem, FaqItem } from '../types';

export const BUSINESS_TYPES: string[] = [
  'Beauty Parlours',
  'Salons',
  'Gyms',
  'Tuition Classes',
  'Coaching Classes',
  'Hotels',
  'Restaurants',
  'Shops',
  'Garages',
  'Factories',
  'Local Businesses',
  'Small Businesses',
  'Service Providers',
  'Educational Institutes',
  'Professionals',
  'Portfolios'
];

export const PLANS: PlanItem[] = [
  {
    id: 'plan-1',
    num: 'PLAN 1',
    name: 'Basic Business Website',
    priceRange: '₹1,000 – ₹3,000',
    minPrice: 1000,
    maxPrice: 3000,
    supportDays: 7,
    featured: false,
    description: 'For businesses that mainly want to display information, photographs, services, and contact details.',
    features: [
      'Business photographs & gallery',
      'Services & products showcase',
      'Contact number with 1-tap call',
      'Gmail / email direct contact',
      'Business address & map directions',
      'Basic professional custom design',
      'Mobile-friendly responsive layout',
      'Customized business content'
    ],
    suitableFor: 'Shops · Salons · Garages · Beauty Parlours · Small Businesses · Local Services'
  },
  {
    id: 'plan-2',
    num: 'PLAN 2',
    name: 'Professional Business Website',
    priceRange: '₹3,000 – ₹5,000',
    minPrice: 3000,
    maxPrice: 5000,
    supportDays: 14,
    featured: true,
    description: 'A complete professional online presence with WhatsApp, rich sections, and customized modules.',
    features: [
      'Everything in Basic Plan',
      'Premium dark UI & interactive branding',
      'Direct WhatsApp chat integration',
      'Gmail & address contact options',
      'Important information & announcement sections',
      'Additional customized business sections',
      'For tuitions/coaching: course info, class details, notes & downloadable resources',
      'Enhanced speed & mobile optimization'
    ],
    suitableFor: 'Tuitions · Coaching · Salons · Restaurants · Hotels · Shops · Gyms'
  },
  {
    id: 'plan-3',
    num: 'PLAN 3',
    name: 'Advanced Business Website',
    priceRange: '₹5,000 – ₹8,000',
    minPrice: 5000,
    maxPrice: 8000,
    supportDays: 21,
    featured: false,
    description: 'For organizations needing advanced functionality, online payments, and comprehensive features.',
    features: [
      'Everything from previous plans',
      'Advanced bespoke professional design',
      'WhatsApp & instant calling options',
      'Online payment functionality integration',
      'Useful customer resources & customized sections',
      'Complex business & booking requirements',
      'High-performance professional user experience',
      'Extended priority support window'
    ],
    suitableFor: 'Hotels · Restaurants · Gyms · Factories · Businesses · Organizations'
  }
];

export const OTHER_SERVICES: string[] = [
  'Website Development',
  'Custom Website Design',
  'Business Website Design',
  'Website & Digital Templates',
  'AI Image Generation',
  'AI Photo Generation',
  'AI Video Generation',
  'Song Generation',
  'Creative Digital Content',
  'Customized Digital Solutions'
];

export const TEMPLATE_CATEGORIES: string[] = [
  'Garage',
  'Tuition',
  'Shop',
  'Factory',
  'Salon',
  'Beauty Parlour',
  'Hotel',
  'Restaurant',
  'Gym',
  'Coaching Class',
  'Local Business',
  'Service Provider',
  'Portfolio'
];

export const REQUIREMENTS_CHECKLIST: string[] = [
  'Business / organization name',
  'Logo (high-resolution)',
  'Business photographs',
  'Services / products list & details',
  'Contact number (Calling & WhatsApp)',
  'Gmail / email address',
  'Business address & location',
  'About / business description',
  'Important announcements or notices',
  'Social media links (if required)',
  'Payment information (if applicable)',
  'Specific design or theme preferences'
];

export const WORK_STEPS: WorkStep[] = [
  {
    number: '01',
    title: 'Discuss',
    description: 'Tell me what type of website you need, your target audience, and business goals.'
  },
  {
    number: '02',
    title: 'Select',
    description: 'Choose the appropriate plan (Basic, Professional, or Advanced) according to your requirements.'
  },
  {
    number: '03',
    title: 'Provide content',
    description: 'Send your logo, photos, business information, address, and contact details.'
  },
  {
    number: '04',
    title: 'Development',
    description: 'The website is designed and developed according to the agreed specifications and mobile-first principles.'
  },
  {
    number: '05',
    title: 'Review',
    description: 'You review the live working preview and communicate any required refinements or tweaks.'
  },
  {
    number: '06',
    title: 'Delivery',
    description: 'The completed, polished website is delivered and launched for your business.'
  },
  {
    number: '07',
    title: 'Support',
    description: 'You receive free service support after completion — 7, 14, or 21 days depending on your plan.'
  }
];

export const SERVICE_POLICIES: ServicePolicyItem[] = [
  {
    number: 1,
    text: 'Website pricing depends on the features and requirements requested by the customer.'
  },
  {
    number: 2,
    text: 'The listed price ranges are general packages — final pricing may vary depending on project requirements.'
  },
  {
    number: 3,
    text: 'Customers must provide the required information, images, logo, and contact details.'
  },
  {
    number: 4,
    text: 'The website is developed according to requirements agreed upon before development begins.'
  },
  {
    number: 5,
    text: 'Each plan includes free service support after completion for bugs and minor required changes — 7 days (Plan 1), 14 days (Plan 2), or 21 days (Plan 3).'
  },
  {
    number: 6,
    text: 'Once the free window ends, service or maintenance requests cost ₹199 per service, depending on the work required.'
  },
  {
    number: 7,
    text: 'Additional features outside the originally agreed requirements may require additional charges.'
  },
  {
    number: 8,
    text: 'Online payment functionality is available where applicable, according to the selected plan and project requirements.'
  },
  {
    number: 9,
    text: 'Customers should provide accurate information and authentic content for their website.'
  },
  {
    number: 10,
    text: 'Development time may vary depending on project complexity and the availability of required content.'
  },
  {
    number: 11,
    text: 'Major redesigns, additional pages, or substantial changes requested after the agreed project scope may carry additional charges.'
  },
  {
    number: 12,
    text: 'Customers should discuss their complete requirements before development begins so the appropriate plan and pricing can be determined.'
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'apex-motors',
    title: 'Apex Auto Garage & Detailing',
    category: 'Garage & Auto',
    tagline: 'Multi-brand service station & car wash portal with 1-tap call & booking.',
    planUsed: 'Plan 1 — Basic Business',
    price: '₹2,500',
    deliveryDays: '4 Days',
    features: ['Service rate card', 'Live Google Maps route', 'Click-to-Call emergency towing', 'Photo gallery of repair bays'],
    mockStats: [
      { label: 'Speed Score', value: '99/100' },
      { label: 'Mobile Optimized', value: '100%' },
      { label: 'Free Support', value: '7 Days' }
    ],
    colorTheme: '#f59e0b',
    gradient: 'from-amber-500/20 to-orange-600/20',
    previewHeroTitle: 'Apex Motors Nashik — Complete Vehicle Care & Diagnostics',
    previewDescription: 'Certified mechanics, computerized engine scanning, and genuine spare parts. Serving Nashik motorists since 2018.',
    previewCta: 'Book Service On WhatsApp'
  },
  {
    id: 'shree-samarth-academy',
    title: 'Shree Samarth Coaching Academy',
    category: 'Coaching & Education',
    tagline: 'Comprehensive study portal with syllabus breakdown, batches & study notes.',
    planUsed: 'Plan 2 — Professional Business',
    price: '₹4,200',
    deliveryDays: '6 Days',
    features: ['Batch timing schedule', 'Downloadable sample papers', 'WhatsApp admission desk', 'Faculty profiles & rank list'],
    mockStats: [
      { label: 'Lead Inquiries', value: '+140%' },
      { label: 'Load Time', value: '0.8s' },
      { label: 'Free Support', value: '14 Days' }
    ],
    colorTheme: '#3da9fc',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    previewHeroTitle: 'Empowering Nashik Students for 10th & 12th Board Excellence',
    previewDescription: 'Small batch sizes, individual doubt-clearing, and expert physics, chemistry & math educators in Nashik.',
    previewCta: 'Inquire Admission'
  },
  {
    id: 'aura-luxury-salon',
    title: 'Aura Unisex Salon & Wellness',
    category: 'Salon & Parlour',
    tagline: 'Elegant dark aesthetic aesthetic with bridal packages & stylist portfolio.',
    planUsed: 'Plan 2 — Professional Business',
    price: '₹3,800',
    deliveryDays: '5 Days',
    features: ['Bridal makeup showcase', 'Treatment price menu', 'Direct WhatsApp appointment slot', 'Client transformation gallery'],
    mockStats: [
      { label: 'Client Booking', value: '3x faster' },
      { label: 'Visual Design', value: 'Bespoke' },
      { label: 'Free Support', value: '14 Days' }
    ],
    colorTheme: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-600/20',
    previewHeroTitle: 'Aura Salon — Premium Hair, Skin & Bridal Glamour',
    previewDescription: 'Experience tranquil self-care, expert organic hair color, and bespoke bridal packages tailored for your special day.',
    previewCta: 'Reserve Slot on WhatsApp'
  },
  {
    id: 'spice-route-bistro',
    title: 'Spice Route Bistro & Rooftop',
    category: 'Hotel & Restaurant',
    tagline: 'Visual menu, party hall reservations & online order direction.',
    planUsed: 'Plan 3 — Advanced Business',
    price: '₹6,500',
    deliveryDays: '8 Days',
    features: ['Categorized food menu', 'Rooftop table reservation', 'UPI payment QR integration', 'Events & banquet hall enquiry'],
    mockStats: [
      { label: 'Table Bookings', value: 'Instant' },
      { label: 'Payment Gateway', value: 'Integrated' },
      { label: 'Free Support', value: '21 Days' }
    ],
    colorTheme: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    previewHeroTitle: 'Authentic Maharashtrian & North Indian Culinary Flavors',
    previewDescription: 'Dine under open skies with scenic skyline views, live tandoor specialties, and warm Maharashtrian hospitality.',
    previewCta: 'Reserve Table'
  },
  {
    id: 'vanguard-fit',
    title: 'Vanguard Fitness & CrossFit',
    category: 'Gym & Fitness',
    tagline: 'High-energy fitness portal with trainer profiles & membership plans.',
    planUsed: 'Plan 2 — Professional Business',
    price: '₹4,500',
    deliveryDays: '6 Days',
    features: ['Membership fee matrix', 'Trainer qualifications', 'Diet consultation WhatsApp desk', 'Virtual tour of workout floor'],
    mockStats: [
      { label: 'Conversion Rate', value: '+85%' },
      { label: 'Mobile Friendly', value: '100%' },
      { label: 'Free Support', value: '14 Days' }
    ],
    colorTheme: '#6366f1',
    gradient: 'from-indigo-500/20 to-blue-600/20',
    previewHeroTitle: 'Transform Your Body — Strength, Conditioning & Cardio',
    previewDescription: 'State-of-the-art biomechanical gym equipment, personal certified coaches, and custom nutrition roadmaps.',
    previewCta: 'Get Free Trial Pass'
  },
  {
    id: 'precision-tech-works',
    title: 'Nashik Precision Tooling & Fabrication',
    category: 'Factory & Small Business',
    tagline: 'Industrial B2B showcase for CNC components, machinery & quotes.',
    planUsed: 'Plan 3 — Advanced Business',
    price: '₹7,000',
    deliveryDays: '9 Days',
    features: ['Technical specs download', 'Bulk RFQ inquiry engine', 'Client logos & ISO certifications', 'Factory unit video showcase'],
    mockStats: [
      { label: 'B2B Leads', value: 'Verified' },
      { label: 'Architecture', value: 'Ultra-fast' },
      { label: 'Free Support', value: '21 Days' }
    ],
    colorTheme: '#06b6d4',
    gradient: 'from-cyan-500/20 to-sky-600/20',
    previewHeroTitle: 'Precision Engineered Metal Components & CNC Machining',
    previewDescription: 'ISO-compliant manufacturing partner delivering high-tolerance engineering components across Maharashtra industrial zones.',
    previewCta: 'Request Technical Quote'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Rajesh Patil',
    businessName: 'Patil Automobile Services',
    businessType: 'Garage Owner',
    location: 'Nashik, Maharashtra',
    rating: 5,
    text: 'Samarth developed our garage website within 4 days. Customers can now directly click to call us or get Google Map directions. When we needed a small change in our pricing list after launch, he fixed it within 1 hour for free under our 7-day support guarantee!',
    plan: 'Plan 1 (Basic Business)'
  },
  {
    id: 't-2',
    name: 'Mrs. Sunita Deshmukh',
    businessName: 'Deshmukh Science & Math Classes',
    businessType: 'Tuition Academy Director',
    location: 'Gangapur Road, Nashik',
    rating: 5,
    text: 'At only 14 years old, Samarth Zende has remarkable coding talent and deep professionalism. He organized all our batch timings, downloadable syllabus PDFs, and created a direct WhatsApp inquiry button that brought us 30+ new student admissions this month.',
    plan: 'Plan 2 (Professional Business)'
  },
  {
    id: 't-3',
    name: 'Kunal Verma',
    businessName: 'Verma Spices & Exports',
    businessType: 'Factory Owner',
    location: 'Ambad MIDC, Nashik',
    rating: 5,
    text: 'We were quoted ₹25,000 by agencies in Pune for a simple website. Samarth built us an Advanced B2B website for ₹6,500 that looks ten times more modern and loads in under 1 second. Clean code, no fake promises, and 21 days of continuous support.',
    plan: 'Plan 3 (Advanced Business)'
  },
  {
    id: 't-4',
    name: 'Pooja Kulkarni',
    businessName: 'Glow Beauty & Bridal Studio',
    businessType: 'Salon Owner',
    location: 'College Road, Nashik',
    rating: 5,
    text: 'Our bridal booking gallery is so gorgeous. Clients tell us our website looks like a high-end luxury brand in Mumbai. The dark navy theme with glowing accents is stunning on mobile screens. Thank you Samarth and SAMZEN!',
    plan: 'Plan 2 (Professional Business)'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'f-1',
    question: 'How do I get started with a website for my business?',
    answer: 'Simply choose a plan or click "Chat on WhatsApp" (+91 8605042855). Tell Samarth about your business, what services you offer, and send your photos and logo. We will discuss your exact requirements and begin development right away.',
    category: 'Process'
  },
  {
    id: 'f-2',
    question: 'What is included in the free post-delivery support?',
    answer: 'Every project includes dedicated free support (7 days for Plan 1, 14 days for Plan 2, and 21 days for Plan 3). During this period, any bugs, text updates, contact number tweaks, or adjustments you request are resolved completely free of charge.',
    category: 'Policy'
  },
  {
    id: 'f-3',
    question: 'What happens after the free support window ends?',
    answer: 'Per our transparent policy, once your free support window ends, any future maintenance or minor update requests are handled at an affordable flat rate of ₹199 per service request. No monthly lock-in contracts or hidden retainers.',
    category: 'Policy'
  },
  {
    id: 'f-4',
    question: 'Do I need to buy domain and hosting myself?',
    answer: 'You can either provide your existing domain and hosting, or Samarth will assist and guide you step-by-step in securing your exact .com or .in domain at genuine registrar cost with zero markup.',
    category: 'Technical'
  },
  {
    id: 'f-5',
    question: 'Will my website work properly on mobile phones?',
    answer: 'Yes, 100%! Every website built by SAMZEN Web Development is crafted mobile-first. It is tested on Android, iPhone, iPad, laptops, and wide monitors to ensure lightning-fast load times and seamless responsiveness.',
    category: 'Technical'
  },
  {
    id: 'f-6',
    question: 'What payment methods are accepted?',
    answer: 'We accept all standard Indian and international payments including UPI (Google Pay, PhonePe, Paytm), IMPS/NEFT Bank Transfer, and QR code payments.',
    category: 'Billing'
  }
];

