import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/samzenData';
import { PortfolioProject } from '../types';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { 
  Laptop, 
  Smartphone, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Eye, 
  X, 
  Clock, 
  Tag, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface PortfolioProps {
  onSelectPlan?: (planId: string, planName: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectPlan }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const categories = ['All', 'Garage & Auto', 'Coaching & Education', 'Salon & Parlour', 'Hotel & Restaurant', 'Gym & Fitness', 'Factory & Small Business'];

  const filteredProjects = activeCategory === 'All' 
    ? PORTFOLIO_PROJECTS 
    : PORTFOLIO_PROJECTS.filter(p => p.category === activeCategory);

  const getWhatsAppOrderUrl = (project: PortfolioProject) => {
    const text = encodeURIComponent(
      `Hello Samarth! I am interested in getting a website like "${project.title}" (${project.category}). My estimated budget is around ${project.price}. Can we discuss my requirements?`
    );
    return `https://wa.me/${SAMZEN_BRAND.whatsappClean}?text=${text}`;
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3da9fc]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] text-xs font-semibold uppercase tracking-wider text-[#59e3ff] mb-3">
            <Globe className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Real Website Demonstrations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Websites Built for Real Businesses
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9db0c8] leading-relaxed">
            Explore live sample websites designed by Samarth Zende for garages, tuition classes, salons, hotels, gyms, and small factories. Built to convert visitors and load in less than 1 second.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#3da9fc] text-black shadow-lg shadow-[#3da9fc]/20 font-bold scale-105'
                    : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e] hover:border-[#3da9fc]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-[#0e1726] rounded-2xl border border-[#1d2a3e] hover:border-[#3da9fc]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#3da9fc]/10 hover:-translate-y-1"
            >
              {/* Interactive Mock Browser Frame */}
              <div className="bg-[#070b14] border-b border-[#1d2a3e] p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[10px] text-[#9db0c8] font-mono truncate max-w-[130px]">
                    https://{project.id}.samzen.in
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Live
                  </span>
                </div>
              </div>

              {/* Website Visual Card */}
              <div 
                className={`relative p-6 bg-gradient-to-br ${project.gradient} border-b border-[#1d2a3e] cursor-pointer min-h-[170px] flex flex-col justify-between`}
                onClick={() => setPreviewProject(project)}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#59e3ff] uppercase tracking-wide flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#3da9fc]" />
                      {project.category}
                    </span>
                    <span className="text-xs font-semibold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                      {project.price}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-[#59e3ff] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#9db0c8] line-clamp-2">
                    {project.tagline}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[#eef3fa] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#59e3ff]" />
                    <span>Delivered in {project.deliveryDays}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#3da9fc] font-bold group-hover:underline">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Demo</span>
                  </span>
                </div>
              </div>

              {/* Card Body & Features */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Micro stats */}
                  <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-[#070b14]/70 rounded-lg border border-[#1d2a3e]/60 text-center">
                    {project.mockStats.map((st, i) => (
                      <div key={i} className="px-1">
                        <div className="text-[10px] text-[#9db0c8]">{st.label}</div>
                        <div className="text-xs font-bold text-[#59e3ff]">{st.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Key Features Included */}
                  <div className="space-y-1.5 mb-5">
                    {project.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#9db0c8]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-3 border-t border-[#1d2a3e]">
                  <a
                    href={getWhatsAppOrderUrl(project)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#3da9fc] hover:bg-[#59e3ff] text-black font-bold text-xs transition duration-200 shadow-md shadow-[#3da9fc]/10"
                  >
                    <span>Order Website Like This</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setPreviewProject(project)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#070b14] hover:bg-[#1d2a3e] text-[#9db0c8] hover:text-white border border-[#1d2a3e] text-xs font-medium transition"
                  >
                    <Eye className="w-3 h-3 text-[#3da9fc]" />
                    <span>View Interactive Mockup</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Website Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header & Device Switcher */}
            <div className="bg-[#070b14] border-b border-[#1d2a3e] px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="hidden sm:block text-xs font-semibold text-white">
                  {previewProject.title} &bull; <span className="text-[#59e3ff]">{previewProject.planUsed}</span>
                </div>
              </div>

              {/* Desktop vs Mobile Toggle */}
              <div className="flex items-center gap-1 bg-[#0e1726] p-1 rounded-lg border border-[#1d2a3e]">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
                    deviceMode === 'desktop' ? 'bg-[#3da9fc] text-black font-bold' : 'text-[#9db0c8] hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
                    deviceMode === 'mobile' ? 'bg-[#3da9fc] text-black font-bold' : 'text-[#9db0c8] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              <button
                onClick={() => setPreviewProject(null)}
                className="p-1.5 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] text-[#9db0c8] hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Live Simulated Website */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#030712] flex justify-center">
              <div 
                className={`transition-all duration-300 rounded-xl border border-[#1d2a3e] bg-[#070b14] overflow-hidden ${
                  deviceMode === 'mobile' ? 'w-full max-w-[375px] shadow-2xl' : 'w-full'
                }`}
              >
                {/* Simulated Header */}
                <div className="px-4 py-3 bg-[#0a0f1d] border-b border-[#1d2a3e] flex items-center justify-between">
                  <div className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#59e3ff]" />
                    <span>{previewProject.title}</span>
                  </div>
                  <a
                    href={getWhatsAppOrderUrl(previewProject)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold px-2.5 py-1 rounded bg-[#25D366] text-black"
                  >
                    WhatsApp Call
                  </a>
                </div>

                {/* Simulated Hero */}
                <div className={`p-6 sm:p-8 bg-gradient-to-br ${previewProject.gradient} text-left`}>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 text-[#59e3ff] text-[10px] font-bold mb-2">
                    {previewProject.category} &bull; Delivered in {previewProject.deliveryDays}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {previewProject.previewHeroTitle}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#eef3fa] leading-relaxed max-w-xl">
                    {previewProject.previewDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={getWhatsAppOrderUrl(previewProject)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#3da9fc] text-black font-bold text-xs"
                    >
                      {previewProject.previewCta}
                    </a>
                    <span className="px-3.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-semibold">
                      Package: {previewProject.price}
                    </span>
                  </div>
                </div>

                {/* Simulated Sections */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="text-xs font-bold text-[#59e3ff] uppercase tracking-wider">
                    Included Features in this Website
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {previewProject.features.map((f, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-[#0e1726] border border-[#1d2a3e] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-[#eef3fa]">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Guaranteed Support Notice */}
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>Free Post-Delivery Support included: <strong>{previewProject.mockStats[2]?.value}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="bg-[#070b14] border-t border-[#1d2a3e] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#9db0c8] text-center sm:text-left">
                Ready to launch your business online? Handcrafted by <strong className="text-white">Samarth Zende (Founder &amp; CEO)</strong>.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={getWhatsAppOrderUrl(previewProject)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setPreviewProject(null)}
                  className="px-4 py-2 rounded-lg bg-[#0e1726] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-white text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
