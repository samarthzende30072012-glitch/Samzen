export interface KnowledgeCategory {
  id: string;
  name: string;
  iconName: string;
  sampleQuestions: string[];
}

export interface KnowledgeMatchResult {
  category: string;
  confidence: number;
  answer: string;
  matchedKeywords: string[];
  suggestedAction?: {
    label: string;
    url?: string;
    actionType?: 'whatsapp' | 'email' | 'scroll' | 'link';
    target?: string;
  };
}

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'founder',
    name: 'Founder & Authority',
    iconName: 'Crown',
    sampleQuestions: [
      'Who is the Founder & CEO of SAMZEN?',
      'Can someone else be a Co-Founder or Founder?',
      'What is Samarth Zende\'s background and age?',
      'What is the leadership structure of SAMZEN?'
    ]
  },
  {
    id: 'valuation',
    name: 'Network Valuation',
    iconName: 'TrendingUp',
    sampleQuestions: [
      'What is the total valuation of the SAMZEN network?',
      'How is the ₹1,15,237 valuation calculated?',
      'What digital assets back SAMZEN\'s empire worth?',
      'What is the future expansion projection?'
    ]
  },
  {
    id: 'pricing',
    name: 'Services & Pricing',
    iconName: 'Layers',
    sampleQuestions: [
      'What are the 3 main website plans and pricing rules?',
      'Which plan includes the .samzen domain rule?',
      'Can I remove Samarth Zende\'s photo from my website?',
      'How does Plan 3 sponsorship eligibility work?'
    ]
  },
  {
    id: 'careers',
    name: 'Hiring & Commissions',
    iconName: 'Briefcase',
    sampleQuestions: [
      'How can I work with SAMZEN and what are the payouts?',
      'What is the Co-Founder payout percentage?',
      'How much do Contractors earn per client order?',
      'How do I submit my job application?'
    ]
  },
  {
    id: 'sponsorship',
    name: 'Ads & Sponsorships',
    iconName: 'Megaphone',
    sampleQuestions: [
      'How much does it cost to sponsor a website on SAMZEN?',
      'What is the Lifetime sponsorship deal for ₹799?',
      'What ad formats and placements are provided?',
      'How do I book an active ad slot?'
    ]
  },
  {
    id: 'partner',
    name: 'Featured Partner',
    iconName: 'Sparkles',
    sampleQuestions: [
      'Who is SAMZEN\'s official featured partner?',
      'What is the Pro Trading Course?',
      'What markets does Pro Trading Course teach?',
      'Where can I access the Pro Trading Course?'
    ]
  },
  {
    id: 'general',
    name: 'General & Technical',
    iconName: 'HelpCircle',
    sampleQuestions: [
      'How fast are websites delivered?',
      'What payment methods are accepted?',
      'Is my client portal secured with OTP?',
      'How to reach Samarth on WhatsApp?'
    ]
  }
];

// Comprehensive Intent & Keyword Engine
export function queryKnowledgeEngine(userInput: string): KnowledgeMatchResult {
  const query = userInput.toLowerCase().trim();

  // 1. FEATURED PARTNER INTENT (Pro Trading Course)
  if (
    query.includes('pro trading') ||
    query.includes('trading course') ||
    query.includes('stock market') ||
    query.includes('forex') ||
    query.includes('crypto market') ||
    query.includes('featured partner') ||
    query.includes('protradingcourse')
  ) {
    return {
      category: 'Featured Partner',
      confidence: 0.98,
      matchedKeywords: ['pro trading course', 'stock market', 'forex', 'crypto'],
      answer: `**Official Featured Partner: Pro Trading Course**\n\n• **Partner Website**: https://protradingcourse.ai.studio\n• **Core Curriculum**: Complete professional trading education from scratch across the **Indian Stock Market, Forex, and Crypto** markets.\n• **Key Modules**: Advanced price action analysis, institutional volume reading, risk management frameworks, and psychological discipline for consistent profitability.\n• **Official Showcase**: Prominently featured on SAMZEN Web Development (https://samzen.ai.studio).`,
      suggestedAction: {
        label: 'Explore Pro Trading Course →',
        url: 'https://protradingcourse.ai.studio',
        actionType: 'link'
      }
    };
  }

  // 2. NETWORK VALUATION & EMPIRE WORTH INTENT
  if (
    query.includes('valuation') ||
    query.includes('worth') ||
    query.includes('1,15,237') ||
    query.includes('115237') ||
    query.includes('empire') ||
    query.includes('financial') ||
    query.includes('asset') ||
    query.includes('equity') ||
    query.includes('market value')
  ) {
    return {
      category: 'Company Network & Valuation',
      confidence: 0.96,
      matchedKeywords: ['valuation', 'empire worth', '₹1,15,237', 'assets'],
      answer: `**SAMZEN Network Valuation & Ecosystem Worth: ₹1,15,237**\n\nThe total estimated valuation of the expanding SAMZEN network stands at **₹1,15,237**.\n\n• **Brand Equity & Digital Assets**: High-performing brand identity, domain portfolio, and proprietary code architecture.\n• **Active Client Projects**: 45+ completed digital deliveries with continuous maintenance pipelines.\n• **Proprietary Creative Assets**: Custom agency components, reusable e-commerce & showcase templates, and curated digital media.\n• **Expanding Ecosystem**: Commercial partnerships including the Pro Trading Course spotlight, sponsorship slots, and multi-tier commission hiring networks.`,
      suggestedAction: {
        label: 'View Network Valuation Breakdown ↓',
        actionType: 'scroll',
        target: 'valuation'
      }
    };
  }

  // 3. FOUNDER & LEADERSHIP INTENT
  if (
    query.includes('founder') ||
    query.includes('ceo') ||
    query.includes('samarth') ||
    query.includes('zende') ||
    query.includes('owner') ||
    query.includes('who runs') ||
    query.includes('sole founder') ||
    query.includes('leadership') ||
    query.includes('age') ||
    query.includes('background')
  ) {
    return {
      category: 'Founder & Authority',
      confidence: 0.95,
      matchedKeywords: ['samarth zende', 'sole founder', 'ceo'],
      answer: `**Founder & Executive Leadership Policy**\n\n• **Samarth Zende** is the **sole Founder & CEO** of SAMZEN Web Development. No other individual holds or can share the Founder title.\n• **Profile**: A youth tech leader and full-stack web developer leading web architecture, custom UI/UX design, client systems, and media production.\n• **Executive Structure**: Top-level applicants can partner as **Co-Founders (Website Builders with 20%–25% project share)**, Contractors (10%–20%), or remote operations helpers, but the Founder title remains strictly exclusive to Samarth Zende.\n• **Direct Contact**: Available on WhatsApp at **+91 8605042855** and Gmail at **samarthzende30072012@gmail.com**.`,
      suggestedAction: {
        label: 'Connect with Samarth on WhatsApp',
        url: 'https://wa.me/918605042855',
        actionType: 'whatsapp'
      }
    };
  }

  // 4. PRICING PLANS & MANDATORY BRANDING / DOMAIN RULES
  if (
    query.includes('price') ||
    query.includes('pricing') ||
    query.includes('plan') ||
    query.includes('cost') ||
    query.includes('rate') ||
    query.includes('package') ||
    query.includes('.samzen') ||
    query.includes('branding rule') ||
    query.includes('domain rule') ||
    query.includes('remove photo')
  ) {
    return {
      category: 'Services & Pricing Tiers',
      confidence: 0.94,
      matchedKeywords: ['pricing plans', 'branding rules', 'domain rules'],
      answer: `**SAMZEN Official Website Plans & Branding Rules:**\n\n1. **Plan 1 (₹1,000 – ₹3,000 | Basic Business Website)**:\n   • *Domain*: Includes **".samzen"** in the domain name (e.g., yourbusiness.samzen).\n   • *Branding*: Compulsory **"Proudly Created by Samarth Zende (SAMZEN)"** section with Founder's photo & name.\n   • *Sponsorship*: No free sponsorship included.\n   • *Support*: 7 days free maintenance.\n\n2. **Plan 2 (₹3,000 – ₹5,000 | Professional Business Website)**:\n   • *Domain*: Custom domain name **WITHOUT ".samzen"**.\n   • *Branding*: Compulsory **"Proudly Created by Samarth Zende"** credit with Founder's photo.\n   • *Sponsorship*: No free sponsorship included.\n   • *Support*: 14 days free maintenance.\n\n3. **Plan 3 (₹5,000 – ₹8,000 | Advanced Business Website)**:\n   • *Domain*: Clean custom domain without ".samzen".\n   • *Branding*: **Full Client Control (Optional)** — choose to keep or completely remove the Founder's photo/credit, or display your own branding.\n   • *Sponsorship Benefit*: **Eligible to sponsor and feature your website** on the official SAMZEN website!\n   • *Support*: 21 days free priority support.`,
      suggestedAction: {
        label: 'Explore Pricing Plans ↓',
        actionType: 'scroll',
        target: 'pricing'
      }
    };
  }

  // 5. HIRING & CAREERS / COMMISSIONS INTENT
  if (
    query.includes('hire') ||
    query.includes('job') ||
    query.includes('career') ||
    query.includes('work with') ||
    query.includes('commission') ||
    query.includes('co-founder') ||
    query.includes('contractor') ||
    query.includes('home worker') ||
    query.includes('helper') ||
    query.includes('payout') ||
    query.includes('earn')
  ) {
    return {
      category: 'Hiring & Career Commissions',
      confidence: 0.95,
      matchedKeywords: ['careers', 'roles', 'commission', 'payouts'],
      answer: `**Work With SAMZEN — Roles & Commission Payouts:**\n\n• **Co-Founder (Website Builder)**: Builds complete client websites alongside Samarth Zende. **Payout: 20% – 25% per project**.\n• **Contractor (Client Finder)**: Contacts businesses and brings in confirmed website orders. **Payout: 10% – 20% cash commission per project**.\n• **Home Worker / Helper (Remote)**: Handles phone calls, publishes websites, and updates client content. **Payout: 5% – 10% per project**.\n• **Official Field Representative**: Meets clients officially in person for consultations and content onboarding. **Payout: Official role-based compensation**.\n\n**Application Requirements**: Full Name, Mobile/WhatsApp Number, Current Occupation, Role Choice, and Referral Source. Submit via our online form or WhatsApp (+91 8605042855).`,
      suggestedAction: {
        label: 'Open Careers Application Form ↓',
        actionType: 'scroll',
        target: 'careers'
      }
    };
  }

  // 6. ADVERTISING & SPONSORSHIPS INTENT
  if (
    query.includes('sponsor') ||
    query.includes('advertis') ||
    query.includes('ad spot') ||
    query.includes('promote') ||
    query.includes('banner') ||
    query.includes('49') ||
    query.includes('149') ||
    query.includes('499') ||
    query.includes('799') ||
    query.includes('weekly') ||
    query.includes('monthly') ||
    query.includes('yearly') ||
    query.includes('lifetime')
  ) {
    return {
      category: 'Advertising & Sponsorships',
      confidence: 0.94,
      matchedKeywords: ['sponsorship plans', 'ad booking', 'slots'],
      answer: `**Sponsor Your Website on SAMZEN:**\n\nFeature your business, website link, and promotional banner on the official SAMZEN platform:\n\n• **Weekly Plan (7 Days)**: **₹49** — Featured ad image, project name, and direct clickable link for 7 days.\n• **Monthly Plan (30 Days)**: **₹149** — Featured ad image, business tagline, and clickable link for 1 month.\n• **Yearly Plan (1 Year)**: **₹499** — High-resolution ad banner showcase for 365 days.\n• **Lifetime Plan (Forever)**: **₹799** (Highlighted with cyan/blue glow border) — Permanent lifetime sponsorship slot with prime spotlight placement.\n\nTo book an ad spot, tap "Book Sponsorship Slot" or text Samarth on WhatsApp (+91 8605042855).`,
      suggestedAction: {
        label: 'View Sponsorship Slots ↓',
        actionType: 'scroll',
        target: 'sponsorship'
      }
    };
  }

  // 7. GENERAL / TECHNICAL / CONTACT / EDGE CASES
  if (
    query.includes('contact') ||
    query.includes('whatsapp') ||
    query.includes('email') ||
    query.includes('gmail') ||
    query.includes('phone') ||
    query.includes('number') ||
    query.includes('call')
  ) {
    return {
      category: 'Contact & Support',
      confidence: 0.92,
      matchedKeywords: ['contact', 'whatsapp', 'phone'],
      answer: `**Official SAMZEN Direct Contact Details:**\n\n• **Founder & CEO**: Samarth Zende\n• **WhatsApp & Call**: **+91 8605042855** (Available for project discussions & consultations)\n• **Official Email**: **samarthzende30072012@gmail.com**\n• **Direct WhatsApp Link**: https://wa.me/918605042855\n• **Location**: Nashik, Maharashtra, India (Serving clients worldwide)`,
      suggestedAction: {
        label: 'Chat on WhatsApp',
        url: 'https://wa.me/918605042855',
        actionType: 'whatsapp'
      }
    };
  }

  if (
    query.includes('how long') ||
    query.includes('timeline') ||
    query.includes('delivery') ||
    query.includes('days') ||
    query.includes('time')
  ) {
    return {
      category: 'Project Delivery & Process',
      confidence: 0.88,
      matchedKeywords: ['delivery timeline', 'process'],
      answer: `**Website Delivery Timelines:**\n\n• **Plan 1 (Basic Business Website)**: Typically delivered in **3 to 5 working days** once all photos, text, and details are received.\n• **Plan 2 (Professional Business Website)**: Delivered in **5 to 7 working days** with interactive sections and WhatsApp integration.\n• **Plan 3 (Advanced Business Website)**: Delivered in **7 to 14 working days** with online payments and custom modules.\n\nAll deliveries include live previews where you can test and request refinements before launch!`,
      suggestedAction: {
        label: 'View 7-Step Work Process ↓',
        actionType: 'scroll',
        target: 'process'
      }
    };
  }

  // 8. MULTI-ANGLE FALLBACK LOGIC
  return {
    category: 'SAMZEN Knowledge Engine',
    confidence: 0.75,
    matchedKeywords: ['general query'],
    answer: `Thank you for asking about **SAMZEN Web Development**. \n\nSAMZEN is an elite digital web agency founded and operated by **Samarth Zende (Founder & CEO)**, valued at **₹1,15,237 network ecosystem worth**. We provide:\n\n1. **Tailored Website Development**: Plan 1 (₹1,000–₹3,000), Plan 2 (₹3,000–₹5,000), and Plan 3 (₹5,000–₹8,000) with 7–21 days free post-delivery support.\n2. **Careers & Commissions**: Partner as a Co-Founder (20%–25%), Contractor (10%–20%), or Remote Helper (5%–10%).\n3. **Platform Sponsorships**: Advertise your business from ₹49/week to ₹799/lifetime.\n4. **Featured Partner**: Discover the **Pro Trading Course** at https://protradingcourse.ai.studio.\n\nFor custom quotes or questions, contact Samarth Zende directly on WhatsApp at **+91 8605042855**!`,
    suggestedAction: {
      label: 'Direct Inquiry via WhatsApp',
      url: 'https://wa.me/918605042855',
      actionType: 'whatsapp'
    }
  };
}
