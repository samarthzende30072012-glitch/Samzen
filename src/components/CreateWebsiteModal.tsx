import React, { useState, useEffect } from 'react';
import { PLANS } from '../data/samzenData';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { submitWebsiteEnquiry } from '../services/api';
import { createProjectEnquiry } from '../services/firestoreService';
import { WebsiteEnquiryPayload, WebsiteEnquiryResponse } from '../types';
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
  Send,
  Loader2,
  CheckSquare,
  Square
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WEBSITE_CATEGORIES = [
  'Barber Shop / Salon',
  'Hotel / Restaurant / Cafe',
  'Beauty Parlour',
  'Tuition Classes / Coaching Institute',
  'School / College',
  'E-commerce / Online Store',
  'Personal Portfolio',
  'Business / Company Website',
  'Real Estate',
  'Gym / Fitness Centre',
  'Hospital / Clinic',
  'Travel Agency',
  'YouTube Creator / Content Creator',
  'Blog / News Website',
  'Other'
];

export const AVAILABLE_FEATURES = [
  { id: 'auth', label: 'Login and signup' },
  { id: 'booking', label: 'Online booking or appointment system' },
  { id: 'catalogue', label: 'Product catalogue' },
  { id: 'payments', label: 'Online payments' },
  { id: 'cart', label: 'Shopping cart' },
  { id: 'admin', label: 'Admin dashboard' },
  { id: 'contact_form', label: 'Contact form' },
  { id: 'whatsapp', label: 'WhatsApp integration' },
  { id: 'maps', label: 'Google Maps integration' },
  { id: 'gallery', label: 'Image gallery' },
  { id: 'chatbot', label: 'AI chatbot' },
  { id: 'custom', label: 'Custom features' }
];

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
}

export const CreateWebsiteModal: React.FC<CreateWebsiteModalProps> = ({
  isOpen,
  onClose,
  initialPlanId
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [websiteType, setWebsiteType] = useState<string>('Business / Company Website');
  const [otherWebsiteType, setOtherWebsiteType] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-2');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Contact form',
    'WhatsApp integration',
    'Google Maps integration'
  ]);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'WhatsApp' | 'Email' | 'Both'>('Both');

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<WebsiteEnquiryResponse | null>(null);

  // Sync initial plan if passed from Pricing section
  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  const toggleFeature = (featureLabel: string) => {
    if (selectedFeatures.includes(featureLabel)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== featureLabel));
    } else {
      setSelectedFeatures([...selectedFeatures, featureLabel]);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!businessName.trim()) newErrors.businessName = 'Business Name is required';

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (cleanPhone.length < 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!websiteType) {
      newErrors.websiteType = 'Please select a website type';
    } else if (websiteType === 'Other' && !otherWebsiteType.trim()) {
      newErrors.otherWebsiteType = 'Please describe your business or website idea';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const effectiveWebsiteType = websiteType === 'Other' && otherWebsiteType.trim()
      ? `Other (${otherWebsiteType.trim()})`
      : websiteType;

    const payload: WebsiteEnquiryPayload = {
      fullName: fullName.trim(),
      businessName: businessName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      websiteType: effectiveWebsiteType,
      otherWebsiteType: otherWebsiteType.trim(),
      preferredPlan: `${currentPlan.num} — ${currentPlan.name}`,
      planPrice: currentPlan.priceRange,
      requiredFeatures: selectedFeatures,
      additionalRequirements: additionalRequirements.trim(),
      preferredContactMethod
    };

    try {
      // 1. Submit to Backend (Node/Express with nodemailer & server storage)
      const res = await submitWebsiteEnquiry(payload);

      // 2. Also persist to Firestore database for real-time tracking
      try {
        await createProjectEnquiry({
          name: payload.fullName,
          email: payload.email,
          phone: payload.mobileNumber,
          businessCategory: payload.websiteType,
          selectedPlan: payload.preferredPlan,
          requirements: `Features: ${selectedFeatures.join(', ')} | Notes: ${additionalRequirements.trim() || 'None'} | Business: ${payload.businessName}`
        });
      } catch (firestoreErr) {
        console.warn('Firestore backup note:', firestoreErr);
      }

      setSubmitResult(res);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrors({ form: err.message || 'Could not submit enquiry. Please try again or connect directly on WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-[#070b14] border border-[#1d2a3e] rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1d2a3e] bg-[#0b1220]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#3da9fc]/10 border border-[#3da9fc]/30 text-[#59e3ff]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                Create Your Website
              </h2>
              <p className="text-xs text-[#9db0c8]">
                SAMZEN Web Development &bull; Founder &amp; CEO Samarth Zende
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#0e1726] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Only visible if not on success screen) */}
        {!submitResult && (
          <div className="px-6 py-3 border-b border-[#1d2a3e] bg-[#070b14]/95 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-1.5 transition ${
                  currentStep === 1
                    ? 'text-[#59e3ff] font-bold'
                    : currentStep > 1
                    ? 'text-emerald-400'
                    : 'text-[#9db0c8]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 1
                    ? 'bg-[#3da9fc] text-[#070b14] font-bold'
                    : currentStep > 1
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#1d2a3e] text-[#9db0c8]'
                }`}>
                  1
                </span>
                <span>Business &amp; Category</span>
              </button>

              <span className="text-[#1d2a3e]">&mdash;</span>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                className={`flex items-center gap-1.5 transition ${
                  currentStep === 2
                    ? 'text-[#59e3ff] font-bold'
                    : currentStep > 2
                    ? 'text-emerald-400'
                    : 'text-[#9db0c8]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 2
                    ? 'bg-[#3da9fc] text-[#070b14] font-bold'
                    : currentStep > 2
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#1d2a3e] text-[#9db0c8]'
                }`}>
                  2
                </span>
                <span>Select Plan</span>
              </button>

              <span className="text-[#1d2a3e]">&mdash;</span>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(3);
                }}
                className={`flex items-center gap-1.5 transition ${
                  currentStep === 3
                    ? 'text-[#59e3ff] font-bold'
                    : 'text-[#9db0c8]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 3
                    ? 'bg-[#3da9fc] text-[#070b14] font-bold'
                    : 'bg-[#1d2a3e] text-[#9db0c8]'
                }`}>
                  3
                </span>
                <span>Features &amp; Send</span>
              </button>
            </div>

            <div className="hidden sm:block text-[11px] text-[#59e3ff] font-mono">
              Step {currentStep} of 3
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* SUCCESS SCREEN */}
          {submitResult ? (
            <div className="py-6 px-2 text-center max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-heading text-white">
                  Enquiry Registered Successfully!
                </h3>
                <p className="text-sm text-[#9db0c8] mt-2 leading-relaxed">
                  Thank you, <strong className="text-white">{fullName}</strong>! Your website inquiry for <strong className="text-[#59e3ff]">{businessName}</strong> under <strong className="text-white">{currentPlan.name}</strong> has been logged in SAMZEN's secure system.
                </p>
                <div className="inline-block mt-3 px-3 py-1 rounded bg-[#0e1726] border border-[#1d2a3e] text-xs font-mono text-[#59e3ff]">
                  Enquiry Ref ID: {submitResult.enquiry?.id || 'SAMZEN-REQ'}
                </div>
              </div>

              {/* Status Report on Dual Dispatch */}
              <div className="p-4 rounded-xl bg-[#0b1220] border border-[#1d2a3e] text-left space-y-3">
                <div className="text-xs uppercase font-bold tracking-wider text-[#9db0c8]">
                  Delivery Channels
                </div>

                {/* WhatsApp Status */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0e1726] border border-[#1d2a3e]">
                  <MessageSquare className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-white">WhatsApp Direct Chat</div>
                    <p className="text-[#9db0c8] mt-0.5">
                      Your complete inquiry details are pre-formatted for Samarth Zende at <strong>+91 8605042855</strong>. Click below to open and hit Send.
                    </p>
                  </div>
                </div>

                {/* Gmail Delivery Status */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0e1726] border border-[#1d2a3e]">
                  <Mail className="w-5 h-5 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Business Gmail Delivery</span>
                      {submitResult.emailSent && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                          Delivered to Inbox
                        </span>
                      )}
                    </div>
                    <p className="text-[#9db0c8] mt-0.5">
                      {submitResult.emailSent
                        ? "Successfully dispatched to samarthzende30072012@gmail.com via backend email server!"
                        : "Enquiry saved in database. You can also view or send the pre-filled Gmail draft directly below."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={submitResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-[#25D366]/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send on WhatsApp Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href={submitResult.directGmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-5 rounded-xl bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#3da9fc]/40 text-[#59e3ff] font-bold text-sm flex items-center justify-center gap-2 transition"
                >
                  <Mail className="w-4 h-4 text-[#3da9fc]" />
                  <span>Open Direct Gmail</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#9db0c8] hover:text-white underline transition"
                >
                  Close &amp; Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ERROR BANNER */}
              {errors.form && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Honeypot spam protection */}
              <input
                type="text"
                name="_hp"
                value=""
                onChange={() => {}}
                className="hidden"
                autoComplete="off"
                tabIndex={-1}
              />

              {/* STEP 1: BUSINESS & CATEGORY */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-[#1d2a3e] pb-3">
                    <h3 className="text-base font-bold font-heading text-white">
                      1. Business &amp; Contact Details
                    </h3>
                    <p className="text-xs text-[#9db0c8] mt-0.5">
                      Tell Samarth about yourself and the type of website you need.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#c9d3dc] mb-1">
                        Full Name <span className="text-[#3da9fc]">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                        placeholder="e.g. Samarth Zende"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0e1726] border text-sm text-white placeholder-[#9db0c8]/60 focus:outline-none focus:border-[#3da9fc] transition ${
                          errors.fullName ? 'border-red-500' : 'border-[#1d2a3e]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#c9d3dc] mb-1">
                        Business / Organization Name <span className="text-[#3da9fc]">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          if (errors.businessName) setErrors({ ...errors, businessName: '' });
                        }}
                        placeholder="e.g. Apex Auto Garage / Star Salon"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0e1726] border text-sm text-white placeholder-[#9db0c8]/60 focus:outline-none focus:border-[#3da9fc] transition ${
                          errors.businessName ? 'border-red-500' : 'border-[#1d2a3e]'
                        }`}
                      />
                      {errors.businessName && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.businessName}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#c9d3dc] mb-1">
                        Mobile Number (WhatsApp Preferred) <span className="text-[#3da9fc]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value);
                          if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: '' });
                        }}
                        placeholder="e.g. +91 8605042855"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0e1726] border text-sm text-white placeholder-[#9db0c8]/60 focus:outline-none focus:border-[#3da9fc] transition ${
                          errors.mobileNumber ? 'border-red-500' : 'border-[#1d2a3e]'
                        }`}
                      />
                      {errors.mobileNumber && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.mobileNumber}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-[#c9d3dc] mb-1">
                        Email Address <span className="text-[#3da9fc]">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder="e.g. name@gmail.com"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0e1726] border text-sm text-white placeholder-[#9db0c8]/60 focus:outline-none focus:border-[#3da9fc] transition ${
                          errors.email ? 'border-red-500' : 'border-[#1d2a3e]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Website Type (Selectable Cards & Dropdown) */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[#c9d3dc] mb-2">
                      What type of website do you need? <span className="text-[#3da9fc]">*</span>
                    </label>

                    {/* Quick Select Grid for Top Categories */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {WEBSITE_CATEGORIES.map((cat) => {
                        const isSelected = websiteType === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setWebsiteType(cat);
                              if (errors.websiteType) setErrors({ ...errors, websiteType: '' });
                            }}
                            className={`p-2.5 rounded-lg text-left text-xs transition border flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#3da9fc]/15 border-[#3da9fc] text-[#59e3ff] font-semibold'
                                : 'bg-[#0e1726] border-[#1d2a3e] text-[#c9d3dc] hover:border-[#3da9fc]/40 hover:text-white'
                            }`}
                          >
                            <span className="truncate pr-1">{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* If 'Other' is selected, show custom description field */}
                    {websiteType === 'Other' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#0b1220] border border-[#3da9fc]/40 animate-in fade-in duration-150">
                        <label className="block text-xs font-semibold text-[#59e3ff] mb-1">
                          Describe your business or website idea <span className="text-[#3da9fc]">*</span>
                        </label>
                        <textarea
                          rows={2}
                          value={otherWebsiteType}
                          onChange={(e) => {
                            setOtherWebsiteType(e.target.value);
                            if (errors.otherWebsiteType) setErrors({ ...errors, otherWebsiteType: '' });
                          }}
                          placeholder="Tell us what kind of website you have in mind..."
                          className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8]/60 focus:outline-none focus:border-[#3da9fc]"
                        />
                        {errors.otherWebsiteType && (
                          <p className="text-[11px] text-red-400 mt-1">{errors.otherWebsiteType}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT YOUR PLAN */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-[#1d2a3e] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-heading text-white">
                        2. Select Your Website Plan
                      </h3>
                      <p className="text-xs text-[#9db0c8] mt-0.5">
                        Choose from our transparent packages. All plans include free post-delivery support.
                      </p>
                    </div>
                    <span className="text-xs text-[#59e3ff] font-mono">
                      Selected: {currentPlan.num}
                    </span>
                  </div>

                  {/* 3 Plans Selection Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`cursor-pointer rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all border relative ${
                            isSelected
                              ? 'bg-[#0e1726] border-2 border-[#3da9fc] shadow-xl shadow-[#3da9fc]/10'
                              : 'bg-[#0b1220] border-[#1d2a3e] hover:border-[#3da9fc]/40'
                          }`}
                        >
                          {plan.featured && (
                            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-[9px] font-bold uppercase tracking-wider">
                              Most Popular
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-mono font-bold text-[#9db0c8]">
                                {plan.num}
                              </span>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                isSelected ? 'bg-[#3da9fc] border-[#3da9fc] text-black' : 'border-[#1d2a3e]'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>

                            <h4 className="text-sm font-bold font-heading text-white mb-1">
                              {plan.name}
                            </h4>

                            <div className="text-lg font-extrabold text-[#59e3ff] mb-2 font-mono">
                              {plan.priceRange}
                            </div>

                            <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mb-3">
                              <ShieldCheck className="w-3 h-3" />
                              <span>{plan.supportDays} Days Free Support</span>
                            </div>

                            <p className="text-[11px] text-[#9db0c8] mb-3 leading-relaxed">
                              {plan.description}
                            </p>

                            <div className="space-y-1.5 pt-2 border-t border-[#1d2a3e]">
                              <span className="text-[10px] font-bold uppercase text-[#c9d3dc] tracking-wider block">
                                Includes:
                              </span>
                              {plan.features.slice(0, 4).map((f, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#eef3fa]">
                                  <Check className="w-3 h-3 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                                  <span className="truncate">{f}</span>
                                </div>
                              ))}
                              {plan.features.length > 4 && (
                                <div className="text-[10px] text-[#59e3ff] pt-0.5">
                                  + {plan.features.length - 4} more features
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Plan Details Callout */}
                  <div className="p-4 rounded-xl bg-[#0e1726] border border-[#3da9fc]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>Active Selection: {currentPlan.name}</span>
                        <span className="text-[#59e3ff] font-mono">({currentPlan.priceRange})</span>
                      </div>
                      <p className="text-[#9db0c8] mt-0.5">
                        Guaranteed {currentPlan.supportDays} days free bug-fixing &amp; maintenance support after delivery.
                      </p>
                    </div>
                    <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap self-start sm:self-auto font-semibold">
                      ₹199 / service after free support
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: FEATURES & DISPATCH */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-[#1d2a3e] pb-3">
                    <h3 className="text-base font-bold font-heading text-white">
                      3. Required Features &amp; Delivery Channels
                    </h3>
                    <p className="text-xs text-[#9db0c8] mt-0.5">
                      Select specific modules needed for your website and how you prefer Samarth to connect with you.
                    </p>
                  </div>

                  {/* Features Selection Checklist */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d3dc] mb-2">
                      Select all features you require:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {AVAILABLE_FEATURES.map((feat) => {
                        const isChecked = selectedFeatures.includes(feat.label);
                        return (
                          <button
                            key={feat.id}
                            type="button"
                            onClick={() => toggleFeature(feat.label)}
                            className={`p-2.5 rounded-lg text-left text-xs transition border flex items-center gap-2.5 ${
                              isChecked
                                ? 'bg-[#3da9fc]/15 border-[#3da9fc] text-[#59e3ff] font-semibold'
                                : 'bg-[#0e1726] border-[#1d2a3e] text-[#c9d3dc] hover:border-[#3da9fc]/40 hover:text-white'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-[#59e3ff] flex-shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-[#9db0c8] flex-shrink-0" />
                            )}
                            <span className="leading-snug">{feat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Requirements / Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d3dc] mb-1">
                      Additional Requirements, Questions, or Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      placeholder="e.g. Need dark navy theme like SAMZEN, want online admission form for coaching, target launch within 10 days..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e1726] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8]/60 focus:outline-none focus:border-[#3da9fc] transition"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c9d3dc] mb-2">
                      Preferred Contact Method:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['WhatsApp', 'Email', 'Both'] as const).map((method) => {
                        const isSelected = preferredContactMethod === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPreferredContactMethod(method)}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition text-center ${
                              isSelected
                                ? 'bg-[#3da9fc]/20 border-[#3da9fc] text-[#59e3ff]'
                                : 'bg-[#0e1726] border-[#1d2a3e] text-[#9db0c8] hover:text-white'
                            }`}
                          >
                            {method === 'WhatsApp' ? '💬 WhatsApp' : method === 'Email' ? '📧 Email' : '🤝 Both'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Summary Recap */}
                  <div className="p-4 rounded-xl bg-[#0b1220] border border-[#1d2a3e] text-xs space-y-2">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>Order Summary Preview</span>
                      <span className="text-[#59e3ff] font-mono">{currentPlan.priceRange}</span>
                    </div>
                    <div className="text-[#9db0c8] grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                      <div><strong>Client:</strong> {fullName} ({businessName})</div>
                      <div><strong>Contact:</strong> {mobileNumber} &bull; {email}</div>
                      <div><strong>Category:</strong> {websiteType === 'Other' && otherWebsiteType ? otherWebsiteType : websiteType}</div>
                      <div><strong>Plan:</strong> {currentPlan.name}</div>
                    </div>
                    <div className="text-[11px] text-[#c9d3dc] pt-1 border-t border-[#1d2a3e]/80">
                      <strong>Features ({selectedFeatures.length}):</strong> {selectedFeatures.join(', ')}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Navigation & Submission Bar */}
              <div className="pt-4 border-t border-[#1d2a3e] flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0e1726] border border-[#1d2a3e] text-xs font-semibold text-[#c9d3dc] hover:text-white hover:border-[#3da9fc]/50 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#9db0c8] hover:text-white transition"
                  >
                    Cancel
                  </button>
                )}

                <div className="flex items-center gap-2">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] text-xs font-bold transition shadow-md shadow-[#3da9fc]/20"
                    >
                      <span>Next: {currentStep === 1 ? 'Choose Plan' : 'Features & Submit'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#25D366] via-[#3da9fc] to-[#59e3ff] hover:opacity-95 text-[#070b14] text-xs font-extrabold transition shadow-lg shadow-[#3da9fc]/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering &amp; Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit &amp; Open WhatsApp Chat</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
