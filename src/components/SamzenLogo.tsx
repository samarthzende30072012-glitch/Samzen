import React, { useState, useRef } from 'react';

interface SamzenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const SamzenLogo: React.FC<SamzenLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  // Height configurations matching navbar and footer contexts
  const imgSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-16 sm:h-20',
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('samzen_uploaded_logo_data');
      if (saved) return saved;
    }
    return '/WhatsApp Image 2026-10-04 at 2.12.10 PM.jpeg';
  });

  const handleFileChange = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setLogoSrc(dataUrl);
        try {
          localStorage.setItem('samzen_uploaded_logo_data', dataUrl);
        } catch (err) {
          console.warn('Storage limit reached:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* 2nd Official Logo Image Container */}
      <div 
        className="relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-black p-1 border border-[#1d2a3e]/80 group-hover:border-[#3da9fc]/60 transition-colors shadow-lg shadow-[#3da9fc]/10 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileChange(file);
        }}
        title="Official SAMZEN Logo (Click or drag image to upload directly)"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
        />

        {/* 2nd Image element as requested */}
        <img
          src={logoSrc}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes('WhatsApp')) {
              target.src = '/samzen_logo.jpg';
            }
          }}
          alt="SAMZEN Web Development - Samarth Zende Official Logo"
          className={`${imgSizes[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]`}
          loading="eager"
        />
      </div>

      {/* Brand Text Identity Tag */}
      <div className="flex flex-col text-left">
        <div className="font-extrabold font-heading tracking-tight leading-none text-base sm:text-lg">
          <span className="text-white">SAM</span>
          <span className="text-[#59e3ff] ml-0.5">ZEN</span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-[#9db0c8] mt-1 group-hover:text-[#59e3ff] transition-colors">
            Web Development &bull; Samarth Zende
          </span>
        )}
      </div>
    </div>
  );
};
