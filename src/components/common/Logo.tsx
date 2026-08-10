import React from 'react';
import logoKartar from '@/assetImages/logo/logo kartar.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image - Karang Taruna Nawasena Official Badge */}
      <div className={`relative flex-shrink-0 ${dimensions[size]} drop-shadow-md hover:scale-105 transition-transform duration-300`}>
        <img
          src={logoKartar}
          alt="Logo Karang Taruna Nawasena"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-emerald-950 dark:text-white leading-tight tracking-tight text-xs sm:text-sm">
            KARANG TARUNA <span className="text-emerald-700 dark:text-emerald-400">NAWASENA</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block"></span>
            Perum GSI Ngangkruk — Selokaton
          </span>
        </div>
      )}
    </div>
  );
};
