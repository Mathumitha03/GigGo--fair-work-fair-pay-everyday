import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ size = 'md', center = false }) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
  };

  return (
    <div className={`flex items-center gap-3 ${center ? 'flex-row justify-center' : ''}`}>
      {/* Official GG Interlocking Brand Logo */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-xs bg-white/90 border border-[#a3c4bc]/40 p-0.5 transition-transform hover:scale-105 duration-200`}>
        <img
          src={logoImg}
          alt="GigGo Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <span className={`font-extrabold tracking-tight text-[#1e293b] ${titleSizes[size]}`}>
          GigGo
        </span>
        <span className={`font-bold tracking-[0.14em] text-[#4b7d73] uppercase ${subSizes[size]}`}>
          ADMIN PORTAL
        </span>
      </div>
    </div>
  );
}
