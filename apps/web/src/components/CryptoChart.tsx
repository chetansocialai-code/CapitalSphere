'use client';

import React, { useState } from 'react';

interface CryptoHistoryPoint {
  timestamp: string;
  price: number;
  volume: number;
}

interface CryptoChartProps {
  symbol: string;
  history: CryptoHistoryPoint[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  currencySymbol?: string;
  change24h?: number;
}

export function CryptoChart({
  symbol,
  history,
  timeframe,
  onTimeframeChange,
  currencySymbol = '$',
  change24h = 0
}: CryptoChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const timeframes = ['1H', '24H', '7D', '30D', '90D', '1Y', 'ALL'];

  if (!history || history.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center cs-card rounded-xl border font-mono text-xs cs-text-sub">
        Loading interactive crypto price chart data...
      </div>
    );
  }

  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const isPositive = change24h >= 0;
  const strokeColor = isPositive ? '#22C58B' : '#F05252';
  const gradientId = `cryptoGrad-${symbol.replace(/[^a-zA-Z0-9]/g, '')}`;

  const width = 800;
  const height = 300;
  const padding = 20;

  const points = history.map((pt, idx) => {
    const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((pt.price - minPrice) / priceRange) * (height - 2 * padding);
    return { x, y, pt };
  });

  const pathD = points.reduce((acc, point, idx) => {
    return idx === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const hoveredPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="cs-card rounded-xl border p-4 sm:p-6 space-y-4">
      {/* Header controls & live hover metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono border-b cs-border pb-4">
        <div>
          <div className="text-3xs font-bold cs-text-sub uppercase tracking-wider">
            {symbol} PRICE CHART ({timeframe})
          </div>
          <div className="text-2xl font-extrabold text-white flex items-baseline gap-2">
            <span>{currencySymbol}{hoveredPoint.pt.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
            <span className={`text-xs font-bold ${isPositive ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
              {isPositive ? '+' : ''}{change24h}%
            </span>
          </div>
          <div className="text-3xs cs-text-sub">
            {new Date(hoveredPoint.pt.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border cs-border self-start sm:self-auto">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 text-3xs font-bold rounded transition ${
                timeframe.toUpperCase() === tf
                  ? 'bg-[#4DA3FF] text-slate-950 shadow-sm'
                  : 'cs-text-sub hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const relativeX = mouseX / rect.width;
            const index = Math.min(
              history.length - 1,
              Math.max(0, Math.round(relativeX * (history.length - 1)))
            );
            setHoverIndex(index);
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={height / 4} x2={width - padding} y2={height / 4} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1={padding} y1={(3 * height) / 4} x2={width - padding} y2={(3 * height) / 4} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

          {/* Gradient Fill & Line */}
          <path d={areaD} fill={`url(#${gradientId})`} />
          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hover Crosshair & Point */}
          {hoverIndex !== null && points[hoverIndex] && (
            <g>
              <line
                x1={points[hoverIndex].x}
                y1={padding}
                x2={points[hoverIndex].x}
                y2={height - padding}
                stroke="#4DA3FF"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={points[hoverIndex].x}
                cy={points[hoverIndex].y}
                r="5"
                fill="#4DA3FF"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Min / Max Footer Info */}
      <div className="flex justify-between items-center text-3xs font-mono cs-text-sub border-t cs-border pt-2">
        <span>Low: <strong className="text-white">{currencySymbol}{minPrice.toLocaleString()}</strong></span>
        <span>Timeframe: <strong className="text-[#4DA3FF]">{timeframe}</strong></span>
        <span>High: <strong className="text-white">{currencySymbol}{maxPrice.toLocaleString()}</strong></span>
      </div>
    </div>
  );
}
