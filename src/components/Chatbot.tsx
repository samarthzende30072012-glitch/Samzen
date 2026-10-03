import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { ChatMessage } from '../types';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { 
  Bot, 
  X, 
  Send, 
  RefreshCw, 
  Sparkles, 
  Minimize2, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  ArrowUpRight,
  User,
  Trash2,
  ChevronDown
} from 'lucide-react';

interface ChatbotProps {
  onOpenPricing?: () => void;
  onOpenContact?: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  onOpenPricing,
  onOpenContact,
  onOpenAuth
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Hello! Welcome to **SAMZEN Web Development**. I am your official AI Support Assistant.\n\nI can help you with questions about our **Founder & CEO (Samarth Zende)**, our **3 Website Plans (from ₹1,000)**, **free 7–21 day post-delivery support**, **Service Policy**, **Real OTP verification**, or getting in touch via WhatsApp (+91 8605042855) and Gmail.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    'Who is the Founder & CEO?',
    'What are your website plans & prices?',
    'How does free post-delivery support work?',
    'How does real OTP verification work?',
    'How to contact on WhatsApp or Gmail?',
    'What do I need to provide to start?'
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to server-side Gemini endpoint
      const formattedForApi = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage(formattedForApi);

      if (res.success && res.reply) {
        const botMsg: ChatMessage = {
          id: 'bot_' + Date.now(),
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: 'bot_' + Date.now(),
          role: 'assistant',
          content: "I'm having trouble connecting right now, but you can always reach Founder & CEO Samarth Zende directly on WhatsApp (+91 8605042855) or Gmail (samarthzende30072012@gmail.com).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: `I am currently operating in offline mode. Here is official information for SAMZEN Web Development:\n\n• **Founder & CEO**: Samarth Zende\n• **WhatsApp**: +91 8605042855\n• **Gmail**: samarthzende30072012@gmail.com\n• **Website Plans**: Plan 1 (₹1,000–₹3,000), Plan 2 (₹3,000–₹5,000), Plan 3 (₹5,000–₹8,000)\n• **Support Policy**: 7, 14, or 21 days free support included, then ₹199 per service.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `Chat history cleared. I'm ready to answer any questions about SAMZEN Web Development, our Founder & CEO Samarth Zende, services, plans, and support policies. What would you like to know?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Helper to format assistant message with bolding and clickable quick action buttons
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Format bullet points
          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
          const cleanLine = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

          // Simple markdown bold parsing: **bold**
          const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

          return (
            <div key={idx} className={isBullet ? 'flex items-start gap-1.5 ml-1' : ''}>
              {isBullet && <span className="text-[#3da9fc] font-bold text-xs mt-0.5">•</span>}
              <div>
                {parts.map((part, pIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={pIdx} className="font-semibold text-white">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={pIdx}>{part}</span>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {/* Subtle tooltip invitation */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0e1726]/95 border border-[#3da9fc]/40 text-xs px-3 py-1.5 rounded-full text-[#eef3fa] shadow-xl backdrop-blur-md animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Need help? Ask SAMZEN AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Customer Support Chatbot"
            className="group relative p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] shadow-2xl shadow-[#3da9fc]/30 transition duration-300 hover:scale-105 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Bot className="w-6 h-6 text-[#070b14]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#070b14] rounded-full" />
          </button>
        </div>
      )}

      {/* Chatbot Open Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[580px] max-h-[calc(100vh-40px)] bg-[#0e1726] border border-[#1d2a3e] rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#070b14] border-b border-[#1d2a3e] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#3da9fc] to-[#59e3ff] flex items-center justify-center text-[#070b14]">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-[#070b14] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold font-heading text-white">SAMZEN AI Support</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3da9fc]/10 text-[#59e3ff] font-medium border border-[#3da9fc]/20">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-[#9db0c8]">
                  Trained on SAMZEN plans, policy &amp; founder info
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#1d2a3e] transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#1d2a3e] transition"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Contact Ribbon */}
          <div className="px-3 py-1.5 bg-[#0b1220] border-b border-[#1d2a3e] flex items-center justify-between text-[11px] text-[#9db0c8]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>CEO: Samarth Zende</span>
            </span>
            <div className="flex items-center gap-2">
              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
              <span>•</span>
              <a
                href={SAMZEN_BRAND.gmailDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#59e3ff] hover:underline flex items-center gap-0.5"
              >
                <Mail className="w-3 h-3" />
                <span>Gmail</span>
              </a>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-[#3da9fc] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-[#1d2a3e] text-white border border-[#3da9fc]/30 rounded-tr-none'
                      : 'bg-[#070b14] text-[#eef3fa] border border-[#1d2a3e] rounded-tl-none'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      msg.role === 'user' ? 'text-[#9db0c8] text-right' : 'text-[#51617a] text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#3da9fc]/20 border border-[#3da9fc]/40 text-[#59e3ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-[#3da9fc] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#070b14] border border-[#1d2a3e] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3da9fc] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#59e3ff] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-[#9db0c8] ml-2">SAMZEN AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 pt-2 pb-1 bg-[#070b14]/70 border-t border-[#1d2a3e] overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="flex gap-1.5 pb-1">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] text-[11px] text-[#9db0c8] hover:text-[#59e3ff] transition flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#070b14] border-t border-[#1d2a3e] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about plans, policy, Samarth Zende..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc] transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] disabled:opacity-40 text-[#070b14] font-bold transition flex items-center justify-center flex-shrink-0"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
