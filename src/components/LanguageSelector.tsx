import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGE_OPTIONS, Language } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'compact' | 'segmented' | 'footer';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  // Segmented control (ideal for footer or modal settings)
  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 rounded-xl bg-[#0b1220] border border-[#1d2a3e] ${className}`}>
        {LANGUAGE_OPTIONS.map((opt) => {
          const isActive = language === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] shadow-sm font-bold'
                  : 'text-[#9db0c8] hover:text-white hover:bg-[#0e1726]'
              }`}
              title={`${opt.label} (${opt.nativeName})`}
            >
              <span>{opt.flag}</span>
              <span>{opt.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Footer layout
  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs text-[#9db0c8] font-medium mr-1">
          <Globe className="w-3.5 h-3.5 text-[#59e3ff]" />
          <span>{t('nav.language')}:</span>
        </div>
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#0b1220] border border-[#1d2a3e]">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isActive = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code)}
                className={`px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#3da9fc] text-[#070b14] font-bold shadow'
                    : 'text-[#9db0c8] hover:text-white hover:bg-[#0e1726]'
                }`}
              >
                <span>{opt.flag}</span>
                <span>{opt.nativeName}</span>
                {opt.code === 'en' && <span className="text-[10px] opacity-75">(Default)</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Navbar dropdown (Clean, modern, glassmorphic dropdown)
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1726]/80 hover:bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc]/50 text-xs font-medium text-[#eef3fa] transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3da9fc]"
        title={t('lang.selectLanguage')}
      >
        <Globe className="w-3.5 h-3.5 text-[#59e3ff] flex-shrink-0" />
        <span className="flex items-center gap-1 font-semibold">
          <span>{currentOption.flag}</span>
          <span className="hidden sm:inline">{currentOption.nativeName}</span>
          <span className="sm:hidden">{currentOption.code.toUpperCase()}</span>
        </span>
        <ChevronDown className={`w-3 h-3 text-[#9db0c8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0e1726] border border-[#1d2a3e] shadow-2xl shadow-black/60 z-50 py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#9db0c8] border-b border-[#1d2a3e]/80 flex items-center justify-between">
            <span>{t('lang.selectLanguage')}</span>
            <span className="text-[9px] text-[#59e3ff] bg-[#3da9fc]/10 px-1.5 py-0.5 rounded">
              3 Languages
            </span>
          </div>

          <div className="py-1">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isActive = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition-colors ${
                    isActive
                      ? 'bg-[#3da9fc]/15 text-[#59e3ff] font-semibold'
                      : 'text-[#eef3fa] hover:bg-[#162235] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{opt.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs leading-snug">{opt.nativeName}</span>
                      <span className="text-[10px] text-[#9db0c8]">
                        {opt.label} {opt.code === 'en' ? '• Default' : ''}
                      </span>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-[#59e3ff] flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-1.5 bg-[#0b1220]/60 border-t border-[#1d2a3e]/80 text-[10px] text-[#9db0c8]">
            {t('lang.defaultNotice')}
          </div>
        </div>
      )}
    </div>
  );
};
