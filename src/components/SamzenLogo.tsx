import React from 'react';
import samzenLogoImg from '../assets/images/samzen_logo.jpg';

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

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Official 3D Metallic SAMZEN Logo Image */}
      <div className="relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-black/60 p-1 border border-[#1d2a3e]/80 group-hover:border-[#3da9fc]/60 transition-colors shadow-lg shadow-[#3da9fc]/10">
        <img
          src={samzenLogoImg}
          onError={(e) => {
            const target = e.currentTarget;
            target.src = '/public/samzen_logo.jpg';
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
