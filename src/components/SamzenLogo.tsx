import React from 'react';

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
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Modern Hex/Shield Brand Icon with Blue/Cyan Gradient */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#0e1726] to-[#070b14] border border-[#1d2a3e] p-1.5 shadow-lg shadow-[#3da9fc]/10`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="samzenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3da9fc" />
              <stop offset="100%" stopColor="#59e3ff" />
            </linearGradient>
            <linearGradient id="samzenGlow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d2a3e" />
              <stop offset="100%" stopColor="#3da9fc" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Stylized S / Z Interlocking Geometry */}
          <path
            d="M8 12C8 9.79086 9.79086 8 12 8H28C30.2091 8 32 9.79086 32 12V14H16L32 26V28C32 30.2091 30.2091 32 28 32H12C9.79086 32 8 30.2091 8 28V26H24L8 14V12Z"
            fill="url(#samzenGrad)"
          />
          <circle cx="20" cy="20" r="2.5" fill="#eef3fa" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-bold font-heading tracking-tight leading-none ${sizeClasses[size]}`}>
          <span className="text-white">SAM</span>
          <span className="text-[#59e3ff] ml-0.5">ZEN</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] md:text-xs tracking-wider uppercase font-semibold text-[#9db0c8] mt-1">
            Web Development
          </span>
        )}
      </div>
    </div>
  );
};
