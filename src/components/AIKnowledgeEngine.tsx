import React, { useState } from 'react';
import { 
  queryKnowledgeEngine, 
  KNOWLEDGE_CATEGORIES, 
  KnowledgeMatchResult 
} from '../services/knowledgeEngine';
import { 
  Bot, 
  Search, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  Crown, 
  TrendingUp, 
  Briefcase, 
  Megaphone, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AIKnowledgeEngine: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentResult, setCurrentResult] = useState<KnowledgeMatchResult | null>(() => 
    queryKnowledgeEngine('Who is the Founder and what is SAMZEN network valuation?')
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    const result = queryKnowledgeEngine(searchQuery);
    setCurrentResult(result);
  };

  const handleSelectSample = (question: string) => {
    setSearchQuery(question);
    const result = queryKnowledgeEngine(question);
    setCurrentResult(result);
  };

  const handleExecuteAction = (action?: KnowledgeMatchResult['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'whatsapp' || action.actionType === 'link') {
      if (action.url) window.open(action.url, '_blank', 'noopener,noreferrer');
    } else if (action.actionType === 'scroll' && action.target) {
      const el = document.getElementById(action.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'founder': return Crown;
      case 'valuation': return TrendingUp;
      case 'pricing': return Layers;
      case 'careers': return Briefcase;
      case 'sponsorship': return Megaphone;
      case 'partner': return Sparkles;
      default: return HelpCircle;
    }
  };

  return (
    <section id="ai-engine" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative overflow-hidden scroll-mt-20">
      <span id="ai-knowledge" className="absolute -top-24 pointer-events-none" />
      {/* Ambient background light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#3da9fc]/10 via-[#59e3ff]/5 to-transparent blur-3xl pointer-events-none -z-10 gpu-layer" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow Label & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <Bot className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Intelligent Query Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            SAMZEN AI Knowledge Engine
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#9db0c8]">
            {language === 'mr'
              ? 'सॅमझेनच्या संस्थापक, व्हॅल्यूएशन (₹१,१५,२३७), प्लॅन्स, रोल्स आणि पार्टनरशिप्सविषयी हजारो प्रश्नांची उत्तरे त्वरित मिळवा.'
              : language === 'hi'
              ? 'सैमज़ेन के संस्थापक, नेटवर्क वैल्यूएशन (₹1,15,237), प्लान्स, रोल्स और पार्टनरशिप्स पर आधारित स्मार्ट ज्ञान केंद्र।'
              : 'Ask any question about Founder Samarth Zende, our ₹1,15,237 network worth, plans, hiring commissions, and sponsorships.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#3da9fc] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything (e.g., 'What is SAMZEN valuation?', 'Pro Trading Course', 'Co-Founder payout', 'Plan 1 domain rule')..."
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-[#0e1726] border border-[#1d2a3e] focus:border-[#3da9fc] text-white text-xs sm:text-sm shadow-xl placeholder-[#9db0c8]/50 transition"
            />
            <button
              type="submit"
              className="btn-shimmer-visible btn-interactive absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query AI</span>
            </button>
          </div>
        </form>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#3da9fc] text-[#070b14]'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            All Topics
          </button>
          {KNOWLEDGE_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  handleSelectSample(cat.sampleQuestions[0]);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#3da9fc] text-[#070b14]'
                    : 'bg-[#0e1726] text-[#9db0c8] hover:text-[#59e3ff] border border-[#1d2a3e]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Response Display Card (.panel) */}
        {currentResult && (
          <div className="panel bg-[#0e1726] border-2 border-[#3da9fc]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Top metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1d2a3e]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-[#59e3ff] uppercase font-mono">
                  {currentResult.category}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#9db0c8] bg-[#070b14] px-2.5 py-0.5 rounded border border-[#1d2a3e]">
                Confidence: {Math.round(currentResult.confidence * 100)}% Match
              </span>
            </div>

            {/* Answer body */}
            <div className="text-xs sm:text-sm text-[#eef3fa] leading-relaxed whitespace-pre-line mb-6 font-sans">
              {currentResult.answer}
            </div>

            {/* Matched Keywords Tags */}
            {currentResult.matchedKeywords && currentResult.matchedKeywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-6 pt-3 border-t border-[#1d2a3e]/80">
                <span className="text-[10px] uppercase font-bold text-[#9db0c8] mr-1">
                  Matched Intents:
                </span>
                {currentResult.matchedKeywords.map((kw, kwIdx) => (
                  <span
                    key={kwIdx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#070b14] text-[#59e3ff] border border-[#3da9fc]/25"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            {/* Action Button */}
            {currentResult.suggestedAction && (
              <div className="pt-2">
                <button
                  onClick={() => handleExecuteAction(currentResult.suggestedAction)}
                  className="btn-interactive btn-shimmer-visible px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-[#3da9fc]/20 cursor-pointer"
                >
                  <span>{currentResult.suggestedAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Sample Questions Grid */}
        <div className="mt-8 pt-6 border-t border-[#1d2a3e]">
          <div className="text-xs font-semibold text-[#9db0c8] uppercase tracking-wider mb-3 text-center sm:text-left">
            Frequently Asked Dynamic Inquiries (Click to Test):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              'What is the total valuation of the SAMZEN network?',
              'Who is the Founder & CEO of SAMZEN?',
              'What is the Pro Trading Course featured partner?',
              'What are the Plan 1, 2, and 3 branding & domain rules?',
              'How much can I earn as a Co-Founder or Contractor?',
              'How to book a Lifetime sponsorship slot for ₹799?'
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(q)}
                className="text-left p-3 rounded-xl bg-[#0b1220] hover:bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc]/60 text-xs text-[#c9d3dc] hover:text-[#59e3ff] transition flex items-center justify-between group cursor-pointer"
              >
                <span className="line-clamp-1">{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3da9fc] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
