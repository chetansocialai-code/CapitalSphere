import React from 'react';
import { MarketTicker } from '@capitalsphere/types';

export const MIDNIGHT_FINANCE_THEME = {
  dark: {
    bg: '#070A0F',
    primarySurface: '#0C1118',
    secondarySurface: '#111823',
    elevatedSurface: '#151D29',
    border: '#202B38',
    primaryText: '#F4F7FA',
    secondaryText: '#A5AFBD',
    mutedText: '#6F7A88',
    primaryAccent: '#4DA3FF',
    accentHover: '#69B2FF',
    positive: '#22C58B',
    negative: '#F05252',
    warning: '#F2B84B',
  },
  light: {
    bg: '#F6F8FB',
    surface: '#FFFFFF',
    primaryText: '#10151D',
    secondaryText: '#5E6875',
    border: '#DCE2EA',
  }
};

// Geometric CapitalSphere Logo representing Capital, Growth, Sphere & Global Markets
export const CapitalSphereLogo: React.FC<{ size?: number; className?: string; showTagline?: boolean }> = ({
  size = 32,
  className = '',
  showTagline = false
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Sphere Ring */}
          <circle cx="20" cy="20" r="18" stroke="url(#paint0_linear)" strokeWidth="2.5" opacity="0.9"/>
          {/* Latitude Orbit Grid */}
          <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#4DA3FF" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6"/>
          {/* Ascending Growth Triangle */}
          <path d="M12 28L20 10L28 28L20 23L12 28Z" fill="url(#paint1_linear)"/>
          {/* Core Growth Dot */}
          <circle cx="20" cy="10" r="2.5" fill="#22C58B"/>
          <defs>
            <linearGradient id="paint0_linear" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4DA3FF"/>
              <stop offset="0.5" stopColor="#69B2FF"/>
              <stop offset="1" stopColor="#22C58B"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="20" y1="10" x2="20" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4DA3FF"/>
              <stop offset="1" stopColor="#0C1118"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold tracking-wider text-white text-lg font-sans leading-none uppercase">
          CAPITAL<span className="text-[#4DA3FF]">SPHERE</span>
        </span>
        {showTagline && (
          <span className="text-[9px] uppercase tracking-widest text-[#A5AFBD] font-medium mt-1">
            Markets. Money. Business. Intelligence.
          </span>
        )}
      </div>
    </div>
  );
};

// Standard price display component enforcing COLOR + SYMBOL + NUMBER rule
export const PriceBadge: React.FC<{
  change: number;
  changePercent: number;
  showPercentOnly?: boolean;
  className?: string;
}> = ({ change, changePercent, showPercentOnly = false, className = '' }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const colorClass = isPositive
    ? 'text-[#22C58B] bg-[#22C58B]/10'
    : isNegative
    ? 'text-[#F05252] bg-[#F05252]/10'
    : 'text-[#A5AFBD] bg-[#202B38]/50';

  const symbol = isPositive ? '▲' : isNegative ? '▼' : '';
  const sign = isPositive ? '+' : '';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold ${colorClass} ${className}`}>
      <span>{symbol}</span>
      <span>
        {showPercentOnly
          ? `${sign}${changePercent.toFixed(2)}%`
          : `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`}
      </span>
    </span>
  );
};

// Data status badge: LIVE / DELAYED / MARKET CLOSED
export const StatusPill: React.FC<{ status: 'LIVE' | 'DELAYED' | 'MARKET CLOSED' | 'DATA UNAVAILABLE' }> = ({ status }) => {
  const statusColors = {
    'LIVE': 'bg-[#22C58B] text-black font-extrabold',
    'DELAYED': 'bg-[#F2B84B] text-black font-extrabold',
    'MARKET CLOSED': 'bg-[#6F7A88] text-white',
    'DATA UNAVAILABLE': 'bg-[#F05252] text-white',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${statusColors[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'animate-pulse bg-black' : 'bg-current'}`}></span>
      {status}
    </span>
  );
};
