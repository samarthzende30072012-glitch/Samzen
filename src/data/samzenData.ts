import { PlanItem, WorkStep, ServicePolicyItem } from '../types';

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
