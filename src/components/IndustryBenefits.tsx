import React, { useState } from 'react';
import { ChevronDown, Hotel, Truck, Store, Sparkles } from 'lucide-react';

const INDUSTRIES = [
  {
    id: 'hospitality',
    icon: Hotel,
    title: 'Hotels & Restaurants',
    types: ['Hotels', 'Restaurants'],
    benefits: [
      'Showcase your menu with high-quality photos',
      'Enable online table reservations',
      'Direct WhatsApp order placement to reduce commissions',
      'Display location & highlight ambiance'
    ]
  },
  {
    id: 'logistics',
    icon: Truck,
    title: 'Trade & Logistics',
    types: ['Garages', 'Factories', 'Local Businesses', 'Small Businesses', 'Service Providers', 'Professionals'],
    benefits: [
      'Detailed service coverage maps',
      'Pickup/Delivery request forms',
      'Direct contact & tracking integration',
      'Build client trust with branch visibility'
    ]
  },
  {
    id: 'retail',
    icon: Store,
    title: 'Retail & Lifestyle',
    types: ['Beauty Parlours', 'Salons', 'Gyms', 'Shops', 'Portfolios'],
    benefits: [
      'Enable walk-in appointment booking',
      'Display service rate cards',
      'One-click Google Maps navigation',
      'Showcase customer reviews'
    ]
  },
  {
    id: 'education',
    icon: Sparkles,
    title: 'Education',
    types: ['Tuition Classes', 'Coaching Classes', 'Educational Institutes'],
    benefits: [
      'Showcase course modules & curriculum',
      'Online admission enquiry forms',
      'Downloadable study resources & PDFs',
      'Direct WhatsApp batch information'
    ]
  }
];

export const IndustryBenefits: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(INDUSTRIES[0].id);

  return (
    <section className="py-16 border-t border-[#1d2a3e] bg-[#0b1220]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white text-center mb-10">
          Why You Need A Website for Your Business
        </h2>
        <div className="space-y-4">
          {INDUSTRIES.map((industry) => (
            <div key={industry.id} className="bg-[#0e1726] rounded-xl border border-[#1d2a3e] overflow-hidden">
              <button
                onClick={() => setOpenId(openId === industry.id ? null : industry.id)}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-[#1d2a3e]"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-[#070b14] border border-[#3da9fc]/30 text-[#59e3ff]">
                    <industry.icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-semibold text-white">{industry.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#9db0c8] transition-transform ${openId === industry.id ? 'rotate-180' : ''}`} />
              </button>
              {openId === industry.id && (
                <div className="px-5 pb-5 pt-2 border-t border-[#1d2a3e]">
                  <ul className="grid sm:grid-cols-2 gap-3 mt-2">
                    {industry.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#9db0c8]">
                        <span className="text-[#3da9fc] mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
