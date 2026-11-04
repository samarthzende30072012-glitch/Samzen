import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PLANS } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { submitWebsiteEnquiry } from '../services/api';
import { createProjectEnquiry } from '../services/firestoreService';
import { WebsiteEnquiryPayload, WebsiteEnquiryResponse } from '../types';
import { initiateRazorpayCheckout } from '../utils/razorpayCheckout';
import {
  X,
  Check,
  ShieldCheck,
  MessageSquare,
  Mail,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Laptop,
  Layers,
  Phone,
  PhoneCall,
  Send,
  Loader2,
  CreditCard,
  Crown,
  Zap,
  Hotel,
  Scissors,
  Dumbbell,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Building,
  Compass,
  Factory,
  Store,
  HelpCircle,
  Gift,
  Building2,
  Shield,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// 20 Business Sectors (16 Original + 4 New High-Value Sectors)
export interface BusinessSectorItem {
  id: string;
  name: string;
  icon: any;
  minPlanId: string;
  minPlanName: string;
  minLevel: number;
  minPrice: number;
  reason?: string;
  recommendedTag?: string;
}

export const BUSINESS_SECTORS: BusinessSectorItem[] = [
  {
    id: 'hotel-restaurant',
    name: 'Hotel / Restaurant / Cafe',
    icon: Hotel,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Hotel & restaurant websites require multi-room showcases, digital food menus, table reservation engines, and photo galleries.',
    recommendedTag: 'Requires Plan 2 or higher'
  },
  {
    id: 'salons',
    name: 'Salon / Barber Shop',
    icon: Scissors,
    minPlanId: 'plan-1',
    minPlanName: 'Plan 1 — Basic Business Website',
    minLevel: 1,
    minPrice: 4999,
    recommendedTag: 'Starter / Plan 1'
  },
  {
    id: 'beauty-parlour',
    name: 'Beauty Parlour & Spa',
    icon: Sparkles,
    minPlanId: 'plan-1',
    minPlanName: 'Plan 1 — Basic Business Website',
    minLevel: 1,
    minPrice: 4999,
    recommendedTag: 'Plan 1'
  },
  {
    id: 'tuition-classes',
    name: 'Tuition Classes & Coaching Academy',
    icon: BookOpen,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Coaching centers require student batch schedules, faculty highlights, downloadable notes, and parent admission hotlines.',
    recommendedTag: 'Requires Plan 2 or higher'
  },
  {
    id: 'school-college',
    name: 'School & College Campus',
    icon: GraduationCap,
    minPlanId: 'plan-3',
    minPlanName: 'Plan 3 — Advanced Business Website',
    minLevel: 3,
    minPrice: 16999,
    reason: 'Schools require multi-page architecture, official circulars, admission portals, and staff directories.',
    recommendedTag: 'Requires Plan 3 or higher'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Online Store',
    icon: ShoppingBag,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'E-commerce requires product catalogues, shopping carts, inventory listings, and payment gateways.',
    recommendedTag: 'Requires Plan 2 or higher'
  },
  {
    id: 'gym-fitness',
    name: 'Gym & Fitness Center',
    icon: Dumbbell,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Gyms require workout floor tours, trainer profiles, and membership tier pricing matrices.',
    recommendedTag: 'Requires Plan 2'
  },
  {
    id: 'hospital-clinic',
    name: 'Hospital, Clinic & Healthcare',
    icon: Stethoscope,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Clinics require doctor consultation hours, OPD appointment forms, and specialty treatment breakdowns.',
    recommendedTag: 'Requires Plan 2 or higher'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Builders',
    icon: Building2,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Real estate websites need project floor plans, 3D amenities, brochure downloads, and high-converting lead forms.',
    recommendedTag: 'Requires Plan 2 or higher'
  },
  {
    id: 'travel-agency',
    name: 'Travel Agency & Tourism',
    icon: Compass,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Travel agencies require tour itineraries, package inclusions, and holiday inquiry systems.',
    recommendedTag: 'Requires Plan 2'
  },
  {
    id: 'factory-industrial',
    name: 'Factory & Industrial Manufacturing',
    icon: Factory,
    minPlanId: 'plan-3',
    minPlanName: 'Plan 3 — Advanced Business Website',
    minLevel: 3,
    minPrice: 16999,
    reason: 'Industrial units require machinery capability specs, technical catalog downloads, and bulk RFQ lead forms.',
    recommendedTag: 'Requires Plan 3 or higher'
  },
  {
    id: 'doctor-dental',
    name: 'Doctor / Dental Practice',
    icon: Stethoscope,
    minPlanId: 'plan-1',
    minPlanName: 'Plan 1 — Basic Business Website',
    minLevel: 1,
    minPrice: 4999,
    recommendedTag: 'Plan 1 or Plan 2'
  },
  {
    id: 'event-wedding',
    name: 'Event Management & Wedding Planner',
    icon: Sparkles,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    recommendedTag: 'Plan 2'
  },
  {
    id: 'jewelry-store',
    name: 'Jewelry Showroom & Store',
    icon: Crown,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    recommendedTag: 'Plan 2'
  },
  {
    id: 'law-firm',
    name: 'Law Firm & Legal Practice',
    icon: Building,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    recommendedTag: 'Plan 2'
  },
  {
    id: 'auto-garage',
    name: 'Auto Garage & Car Care',
    icon: Store,
    minPlanId: 'plan-1',
    minPlanName: 'Plan 1 — Basic Business Website',
    minLevel: 1,
    minPrice: 4999,
    recommendedTag: 'Plan 1'
  },
  // 4 NEW HIGH-VALUE SECTORS
  {
    id: 'cloud-kitchen',
    name: 'Cloud Kitchen, Bakery & Sweets',
    icon: Hotel,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Cloud kitchens require digital menus, direct WhatsApp order routing, and takeaway menus.',
    recommendedTag: 'New Sector &bull; Plan 2'
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup & SaaS Portal',
    icon: Laptop,
    minPlanId: 'plan-3',
    minPlanName: 'Plan 3 — Advanced Business Website',
    minLevel: 3,
    minPrice: 16999,
    reason: 'Tech platforms require modern UI/UX, product demo showcases, investor pitch deck downloads, and API integrations.',
    recommendedTag: 'New Sector &bull; Plan 3 or VIP'
  },
  {
    id: 'freelancer-creator',
    name: 'Freelancer & Creator Portfolio',
    icon: Sparkles,
    minPlanId: 'plan-0',
    minPlanName: 'Starter / Basic Website',
    minLevel: 0,
    minPrice: 2499,
    recommendedTag: 'New Sector &bull; Starter / Plan 1'
  },
  {
    id: 'security-housekeeping',
    name: 'Security & Housekeeping Agency',
    icon: Shield,
    minPlanId: 'plan-2',
    minPlanName: 'Plan 2 — Professional Business Website',
    minLevel: 2,
    minPrice: 8999,
    reason: 'Agencies require staffing profiles, service contracts, B2B quotation calculators, and verification workflows.',
    recommendedTag: 'New Sector &bull; Plan 2'
  },
  {
    id: 'other',
    name: 'Other / Custom Business',
    icon: Store,
    minPlanId: 'plan-1',
    minPlanName: 'Plan 1 — Basic Business Website',
    minLevel: 1,
    minPrice: 4999,
    recommendedTag: 'Custom Consultation'
  }
];

export const getPlanLevel = (planId: string): number => {
  switch (planId) {
    case 'plan-0': return 0;
    case 'plan-1': return 1;
    case 'plan-2': return 2;
    case 'plan-3': return 3;
    case 'plan-vip': return 4;
    default: return 1;
  }
};

export const getSectorRequirement = (sectorName: string): BusinessSectorItem | undefined => {
  const norm = sectorName.toLowerCase();
  return BUSINESS_SECTORS.find(s => norm.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(norm));
};

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  initialCategory?: string;
}

export const CreateWebsiteModal: React.FC<CreateWebsiteModalProps> = ({
  isOpen,
  onClose,
  initialPlanId,
  initialCategory
}) => {
  const { t } = useLanguage();

  // Wizard Tab Navigation: 1 = Customize & Quote, 2 = Contact & Finalize
  const [activeTab, setActiveTab] = useState<'customize' | 'contact'>('customize');

  // Core Selections
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-2');
  const [selectedSector, setSelectedSector] = useState<string>('Hotel / Restaurant / Cafe');
  const [customSectorText, setCustomSectorText] = useState('');

  // Contact State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Feature Add-ons (strictly keeping final amounts ending in 99)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'WhatsApp Direct Order & Chat Routing',
    'Google Maps Location Integration',
    'Mobile & Tablet Speed Optimization'
  ]);

  // Submission & Payment States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<WebsiteEnquiryResponse | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
    if (initialCategory) {
      const match = BUSINESS_SECTORS.find(
        (s) => s.name.toLowerCase().includes(initialCategory.toLowerCase()) ||
               initialCategory.toLowerCase().includes(s.name.toLowerCase())
      );
      if (match) {
        setSelectedSector(match.name);
      } else {
        setSelectedSector('Other / Custom Business');
        setCustomSectorText(initialCategory);
      }
    }
  }, [initialPlanId, initialCategory, isOpen]);

  // Prevent scroll leaks
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Active Plan & Sector Metadata
  const currentPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[2];
  const sectorItem = getSectorRequirement(selectedSector) || BUSINESS_SECTORS[0];
  const planLevel = getPlanLevel(selectedPlanId);

  // CRITICAL REQUIREMENT: "If they will say hotel and they have chosen basic plan, it will not take that."
  const isHotelOrAdvanced = sectorItem.minLevel > planLevel;
  const isPlanIncompatible = isHotelOrAdvanced;

  // Calculate Single Exact Final Amount (Always ending strictly in 99)
  const calculateFinalAmount = (): number => {
    // Base prices for plans strictly ending in 99:
    let base = 8999;
    if (selectedPlanId === 'plan-0') base = 2499;
    else if (selectedPlanId === 'plan-1') base = 4999;
    else if (selectedPlanId === 'plan-2') base = 8999;
    else if (selectedPlanId === 'plan-3') base = 16999;
    else if (selectedPlanId === 'plan-vip') base = 29999;

    // If plan is incompatible (e.g. Hotel with Basic), the minimum base must be the sector minPrice
    if (isPlanIncompatible) {
      base = sectorItem.minPrice;
    }

    return base;
  };

  const finalCalculatedAmount = calculateFinalAmount();

  // Auto-upgrade handler
  const handleAutoUpgrade = () => {
    setSelectedPlanId(sectorItem.minPlanId);
    setErrors({});
  };

  // Build WhatsApp Pre-filled Deep Link
  const getWhatsAppLaunchUrl = () => {
    const text = encodeURIComponent(
      `Hello Samarth Zende! 🪔 I want to launch my website with the Diwali Dhamaka Offer.\n\n` +
      `• Business Sector: ${selectedSector}${customSectorText ? ` (${customSectorText})` : ''}\n` +
      `• Business Name: ${businessName.trim() || 'My Business'}\n` +
      `• Client Name: ${fullName.trim() || 'Valued Client'}\n` +
      `• Phone: ${mobileNumber.trim() || 'Not specified'}\n` +
      `• Selected Plan: ${currentPlan.num}: ${currentPlan.name}\n` +
      `• Final Single Amount: ₹${finalCalculatedAmount.toLocaleString()} (All Included)\n` +
      `• Included Features: ${selectedAddons.join(', ')}\n\n` +
      `Can we start my 48-hour website development?`
    );
    return `https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=${text}`;
  };

  const handleRazorpayPay = () => {
    if (isPlanIncompatible) {
      setErrors({ compatibility: `Please upgrade your plan to ${sectorItem.minPlanName} before making payment.` });
      return;
    }
    setPaymentError(null);
    initiateRazorpayCheckout({
      amountInRupees: finalCalculatedAmount,
      planName: `${currentPlan.name} (${selectedSector})`,
      customerName: fullName.trim() || 'Valued Client',
      customerEmail: email.trim() || 'client@samzen.in',
      customerPhone: mobileNumber.trim() || '8605042855',
      onSuccess: (id) => {
        setPaymentId(id);
      },
      onFailure: (err) => {
        setPaymentError(err);
      }
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!businessName.trim()) newErrors.businessName = 'Business Name is required';

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (cleanPhone.length < 10) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (isPlanIncompatible) {
      newErrors.compatibility = `${selectedSector} requires at least ${sectorItem.minPlanName}. Click 'Auto-Upgrade' to proceed.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setActiveTab('contact');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: WebsiteEnquiryPayload = {
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim() || 'contact@client.com',
        websiteType: selectedSector === 'Other / Custom Business' ? (customSectorText.trim() || 'Custom') : selectedSector,
        preferredPlan: `${currentPlan.num}: ${currentPlan.name}`,
        planPrice: `₹${finalCalculatedAmount.toLocaleString()}`,
        requiredFeatures: selectedAddons,
        additionalRequirements: `Sector: ${selectedSector} | Diwali Dhamaka Rate: ₹${finalCalculatedAmount} | Notes: ${additionalRequirements.trim() || 'None'}`,
        preferredContactMethod: 'Both'
      };

      const res = await submitWebsiteEnquiry(payload);

      try {
        await createProjectEnquiry({
          name: payload.fullName,
          email: payload.email,
          phone: payload.mobileNumber,
          businessCategory: payload.websiteType,
          selectedPlan: payload.preferredPlan,
          requirements: payload.additionalRequirements || ''
        });
      } catch (e) {
        console.warn('Database sync note:', e);
      }

      setSubmitResult(res);
    } catch (err: any) {
      console.error(err);
      setErrors({ form: err.message || 'Submission error. You can directly connect on WhatsApp below.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#080d1a] border border-[#00f2fe]/40 rounded-3xl shadow-[0_0_80px_rgba(0,242,254,0.25)] flex flex-col my-2 sm:my-6 overflow-hidden animate-scaleUp">

        {/* TOP STATUS BAR: DIWALI DHAMAKA & CLOSE BUTTON */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#0d1627] via-[#0b1b36] to-[#0d1627] border-b border-[#1d2a3e]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold font-heading text-white tracking-wide">
                SAMZEN Launchpad &bull; Founder Samarth Zende
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                🪔 Diwali Dhamaka Rate
              </span>
            </div>
          </div>

          {/* RETURN TO MAIN PAGE BUTTON */}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 hover:border-cyan-400 transition cursor-pointer shadow-sm"
            title="Return to Main Page"
          >
            <X className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Return to Main Page</span>
            <span className="sm:hidden">Close</span>
          </button>
        </div>

        {/* HERO HEADER FOR THE POST-CLICK PART */}
        <div className="px-4 sm:px-6 pt-5 pb-4 bg-[#0a1222] border-b border-[#1d2a3e]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  Instant Quote Engine
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  &bull; Fixed Single Amount Guarantee
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
                Design Your Website &amp; Lock-in Diwali Discount
              </h2>
            </div>

            {/* LIVE FINAL AMOUNT BADGE */}
            <div className="flex items-center gap-3 bg-[#060a14] px-4 py-2.5 rounded-2xl border border-cyan-500/40 shadow-inner">
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  Single Final Amount
                </div>
                <div className="text-2xl font-black font-mono text-cyan-300 tracking-tight">
                  ₹{finalCalculatedAmount.toLocaleString()}
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-left text-[10px] text-slate-400">
                <div className="text-emerald-400 font-bold">✓ 1-Yr AMC Free</div>
                <div>✓ Fixed &bull; No Surprises</div>
              </div>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'customize'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20 font-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <span>1. Choose Business &amp; Plan</span>
              {isPlanIncompatible && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
            <button
              onClick={() => {
                if (validateForm()) setActiveTab('contact');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20 font-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <span>2. Contact &amp; Finalize</span>
            </button>
          </div>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh] space-y-6">

          {/* SUCCESS SCREEN */}
          {submitResult ? (
            <div className="py-8 px-4 text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-2xl font-black font-heading text-white">
                  Website Project Registered!
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Founder Samarth Zende has received your details for <strong>{selectedSector}</strong> on <strong>{currentPlan.name}</strong> at the Diwali rate of <strong>₹{finalCalculatedAmount.toLocaleString()}</strong>.
                </p>
              </div>

              {/* WHATSAPP & PHONE CALL CONNECT */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#25D366]/20 via-[#0e1726] to-[#25D366]/10 border border-[#25D366]/50 text-left space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <MessageSquare className="w-5 h-5 text-[#25D366]" />
                    <span>Next Step: Instant WhatsApp &amp; Phone Confirmation</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    Hotline: {SAMZEN_BRAND.phoneDisplay}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect directly with Founder Samarth Zende. Your quote and requirements will be pre-filled so you can get started immediately without repeating yourself!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={getWhatsAppLaunchUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow-xl shadow-[#25D366]/30 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-black" />
                    <span>WhatsApp Samarth</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={SAMZEN_BRAND.callUrl}
                    className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Direct (8605042855)</span>
                  </a>
                </div>
              </div>

              {/* RAZORPAY PAYMENT DEPOSIT */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRazorpayPay}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-black font-black text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Deposit Online via Razorpay (₹{finalCalculatedAmount.toLocaleString()})</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white underline transition"
                >
                  Return to Main Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* INCOMPATIBILITY WARNING ALERT (E.G. HOTEL ON BASIC PLAN) */}
              {isPlanIncompatible && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-amber-500/20 border-2 border-amber-400/80 shadow-2xl text-left space-y-3 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-400 text-black font-black mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-black text-amber-300 uppercase tracking-wide">
                        ⚠️ Plan Incompatible: {selectedSector} Requires {sectorItem.minPlanName}
                      </div>
                      <p className="text-xs text-white mt-1 leading-relaxed">
                        {sectorItem.reason || `${selectedSector} businesses cannot run on the Basic plan because of missing advanced functionality.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-400/30">
                    <span className="text-xs text-amber-200 font-medium">
                      Basic Plan (₹2,499) does not accept this business. Please auto-upgrade to unlock.
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoUpgrade}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-yellow-400 hover:to-amber-400 text-black font-black text-xs transition shadow-lg shadow-amber-400/30 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Zap className="w-4 h-4 fill-black" />
                      <span>⚡ Auto-Upgrade to {sectorItem.minPlanName} (₹{sectorItem.minPrice.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 1: CUSTOMIZE BUSINESS & PLAN */}
              {activeTab === 'customize' && (
                <div className="space-y-6">

                  {/* 1. SELECT YOUR PLAN */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Step 1: Select Your Website Plan (Diwali Rates)</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-400">
                        Ending strictly in 99
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {PLANS.filter(p => p.id !== 'plan-0').map((plan) => {
                        const isSelected = selectedPlanId === plan.id;
                        const isVip = plan.id === 'plan-vip';
                        const isPlan2 = plan.id === 'plan-2';

                        // Specific discount rates requested by user
                        const discountBadge = isVip ? '60% OFF' : isPlan2 ? '33% OFF' : plan.id === 'plan-3' ? '31% OFF' : '41% OFF';

                        return (
                          <div
                            key={plan.id}
                            onClick={() => {
                              setSelectedPlanId(plan.id);
                              setErrors({});
                            }}
                            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                              isSelected
                                ? isVip
                                  ? 'bg-gradient-to-b from-amber-400/20 to-black border-amber-400 shadow-xl shadow-amber-400/20'
                                  : 'bg-gradient-to-b from-cyan-500/20 to-black border-cyan-400 shadow-xl shadow-cyan-400/20'
                                : 'bg-[#0b1324] border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-mono font-black uppercase text-slate-400">
                                  {plan.num}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  isVip ? 'bg-amber-400 text-black' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                                }`}>
                                  {discountBadge}
                                </span>
                              </div>

                              <div className="text-sm font-bold text-white mb-2 leading-tight">
                                {plan.name}
                              </div>

                              <div className="flex items-baseline gap-1.5 mb-1">
                                <span className="text-xs text-slate-500 line-through font-mono font-bold">
                                  {plan.originalPrice}
                                </span>
                                <span className={`text-xl font-black font-mono ${isVip ? 'text-amber-300' : 'text-cyan-300'}`}>
                                  {plan.priceRange}
                                </span>
                              </div>

                              <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                                {plan.description}
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold">
                              <span className={isSelected ? 'text-cyan-300' : 'text-slate-500'}>
                                {isSelected ? '✓ Plan Selected' : 'Tap to select'}
                              </span>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. SELECT YOUR BUSINESS SECTOR (20 SECTORS) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5" />
                        <span>Step 2: What is your Business Sector? (20 Categories)</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Select your exact sector
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {BUSINESS_SECTORS.map((sector) => {
                        const Icon = sector.icon;
                        const isSelected = selectedSector === sector.name;
                        const willBeIncompatible = sector.minLevel > planLevel;

                        return (
                          <button
                            key={sector.id}
                            type="button"
                            onClick={() => {
                              setSelectedSector(sector.name);
                              setErrors({});
                            }}
                            className={`p-2.5 rounded-xl text-left border text-xs transition flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-md shadow-cyan-500/20'
                                : willBeIncompatible
                                ? 'bg-[#0e1726]/60 border-amber-500/30 text-slate-400 hover:border-amber-400/50'
                                : 'bg-[#0e1726] border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                              <span className="truncate text-[11px]">{sector.name}</span>
                            </div>

                            {sector.recommendedTag && (
                              <span className={`text-[9px] font-mono font-medium truncate ${
                                willBeIncompatible ? 'text-amber-400 font-bold' : 'text-slate-400'
                              }`}>
                                {sector.recommendedTag}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedSector === 'Other / Custom Business' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={customSectorText}
                          onChange={(e) => setCustomSectorText(e.target.value)}
                          placeholder="Describe your business or venture..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1726] border border-cyan-500/40 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. INCLUDED FEATURES & AMC CONTINUITY */}
                  <div className="p-4 rounded-2xl bg-[#0b1324] border border-white/10 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Included Capabilities &bull; Guaranteed Delivery</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                        100% Mobile Optimized
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Instant 1-Tap WhatsApp Lead Generator</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Interactive Google Maps Landmark Pin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Custom Business Domain (.in / .com)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Free 1-Year AMC Support &amp; Bug Fixing</span>
                      </div>
                    </div>
                  </div>

                  {/* PROCEED TO CONTACT BUTTON */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      ← Back to Website
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (isPlanIncompatible) {
                          handleAutoUpgrade();
                        }
                        setActiveTab('contact');
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-black font-extrabold text-xs transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue with ₹{finalCalculatedAmount.toLocaleString()} Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT DETAILS & FINALIZE */}
              {activeTab === 'contact' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-3.5 rounded-xl bg-[#0b1324] border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Configured: </span>
                      <span className="font-bold text-white">{selectedSector}</span>
                      <span className="text-slate-400"> on </span>
                      <span className="font-bold text-cyan-300">{currentPlan.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('customize')}
                      className="text-cyan-400 hover:underline text-[11px] font-bold"
                    >
                      Change Plan
                    </button>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Your Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                        placeholder="e.g. Samarth Zende"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0e1726] border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition ${
                          errors.fullName ? 'border-rose-500' : 'border-white/10'
                        }`}
                      />
                      {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Business / Venture Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          if (errors.businessName) setErrors({ ...errors, businessName: '' });
                        }}
                        placeholder="e.g. Grand Palace Hotel &amp; Suites"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0e1726] border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition ${
                          errors.businessName ? 'border-rose-500' : 'border-white/10'
                        }`}
                      />
                      {errors.businessName && <p className="text-[11px] text-rose-400 mt-1">{errors.businessName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp Number <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value);
                          if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: '' });
                        }}
                        placeholder="e.g. 8605042855"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0e1726] border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition ${
                          errors.mobileNumber ? 'border-rose-500' : 'border-white/10'
                        }`}
                      />
                      {errors.mobileNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.mobileNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. contact@business.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1726] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Specific Notes or Features Desired (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      placeholder="e.g. We need online table booking for weekends, a food menu PDF download, and Hindi/English languages."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0e1726] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  {/* WHATSAPP & PHONE ACTION BANNER */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#25D366]/20 via-[#0e1726] to-[#25D366]/10 border border-[#25D366]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#25D366] text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#25D366]/30">
                        <MessageSquare className="w-5 h-5 fill-black" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-white">
                          Direct Connect with Samarth Zende
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {SAMZEN_BRAND.phoneDisplay} &bull; Call &amp; WhatsApp 24/7
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={SAMZEN_BRAND.callUrl}
                        className="px-3.5 py-2.5 rounded-xl bg-[#0e1726] hover:bg-white/10 text-cyan-400 border border-cyan-400/40 font-bold text-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call 8605042855</span>
                      </a>

                      <a
                        href={getWhatsAppLaunchUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/30 whitespace-nowrap"
                      >
                        <MessageSquare className="w-4 h-4 fill-black" />
                        <span>WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* SUBMISSION & ACTIONS */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setActiveTab('customize')}
                        className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition cursor-pointer"
                      >
                        ← Back to Plans
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleRazorpayPay}
                        className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-black text-xs transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Online (₹{finalCalculatedAmount.toLocaleString()})</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs transition shadow-lg shadow-emerald-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirming...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Confirm Order (Diwali Rate)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
