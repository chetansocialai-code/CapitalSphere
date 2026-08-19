'use client';

import React, { useState } from 'react';
import { LineChart, BarChart2 } from 'lucide-react';

export function StockChart({ symbol = 'RELIANCE' }: { symbol?: string }) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'CANDLE' | 'LINE'>('CANDLE');

  return (
    <div className="bg-[#0C1118] border border-[#202B38] rounded-xl p-4 shadow-lg space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#202B38] pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2 py-0.5 rounded font-bold text-2xs uppercase">
            NSE: {symbol}
          </span>
          <h3 className="text-sm font-bold text-white">Interactive Candlestick & Technical Terminal</h3>
        </div>

        {/* Timeframe & Chart Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#070A0F] p-0.5 rounded border border-[#202B38] text-2xs">
            {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded transition ${timeframe === tf ? 'bg-[#4DA3FF] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex bg-[#070A0F] p-0.5 rounded border border-[#202B38] text-2xs">
            <button
              onClick={() => setChartType('CANDLE')}
              className={`p-1.5 rounded transition ${chartType === 'CANDLE' ? 'bg-[#4DA3FF] text-slate-950' : 'text-slate-400'}`}
              title="Candlestick View"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('LINE')}
              className={`p-1.5 rounded transition ${chartType === 'LINE' ? 'bg-[#4DA3FF] text-slate-950' : 'text-slate-400'}`}
              title="Line Chart View"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Financial Candlestick Simulation Box */}
      <div className="relative h-64 w-full bg-[#070A0F] border border-[#202B38] rounded-lg p-4 flex flex-col justify-between overflow-hidden">
        {/* Technical Overlays Header */}
        <div className="flex gap-4 text-3xs text-slate-400">
          <span className="text-[#4DA3FF]">SMA20: 3,005.10</span>
          <span className="text-[#F2B84B]">EMA50: 2,980.40</span>
          <span className="text-[#22C58B]">RSI(14): 64.2</span>
          <span className="text-slate-300">VWAP: 3,012.80</span>
        </div>

        {/* SVG Chart Graphic */}
        <svg className="w-full h-44" viewBox="0 0 500 150" preserveAspectRatio="none">
          {/* Gridlines */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="#202B38" strokeDasharray="3 3" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#202B38" strokeDasharray="3 3" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#202B38" strokeDasharray="3 3" />

          {/* SMA Line */}
          <path d="M 10 110 Q 120 90, 250 60 T 490 35" fill="none" stroke="#4DA3FF" strokeWidth="2" opacity="0.8" />

          {/* Candlesticks */}
          {/* Candle 1 (Bull) */}
          <line x1="30" y1="90" x2="30" y2="130" stroke="#22C58B" strokeWidth="1.5" />
          <rect x="25" y="100" width="10" height="20" fill="#22C58B" />

          {/* Candle 2 (Bear) */}
          <line x1="70" y1="80" x2="70" y2="120" stroke="#F05252" strokeWidth="1.5" />
          <rect x="65" y="90" width="10" height="20" fill="#F05252" />

          {/* Candle 3 (Bull) */}
          <line x1="110" y1="70" x2="110" y2="115" stroke="#22C58B" strokeWidth="1.5" />
          <rect x="105" y="75" width="10" height="30" fill="#22C58B" />

          {/* Candle 4 (Bull) */}
          <line x1="150" y1="50" x2="150" y2="95" stroke="#22C58B" strokeWidth="1.5" />
          <rect x="145" y="60" width="10" height="25" fill="#22C58B" />

          {/* Candle 5 (Bear) */}
          <line x1="190" y1="55" x2="190" y2="100" stroke="#F05252" strokeWidth="1.5" />
          <rect x="185" y="65" width="10" height="20" fill="#F05252" />

          {/* Candle 6 (Bull) */}
          <line x1="230" y1="40" x2="230" y2="85" stroke="#22C58B" strokeWidth="1.5" />
          <rect x="225" y="45" width="10" height="30" fill="#22C58B" />

          {/* Candle 7 (Bull) */}
          <line x1="270" y1="35" x2="270" y2="75" stroke="#22C58B" strokeWidth="1.5" />
          <rect x="265" y="40" width="10" height="25" fill="#22C58B" />

          {/* Candle 8 (Bear) */}
          <line x1="310" y1="30" x2="310" y2="70" stroke="#F05252" strokeWidth="1.5" />
          <rect x="305" y="40" width="10" height="15" fill="#F05252" />

          {/* Candle 9 (Bull Breakout) */}
          <line x1="350" y1="15" x2="350" y2="60" stroke="#22C58B" strokeWidth="1.5" />
          <rect x="345" y="20" width="10" height="30" fill="#22C58B" />
        </svg>

        <div className="flex justify-between text-3xs text-slate-500 pt-2 border-t border-[#202B38]">
          <span>09:15 AM</span>
          <span>11:30 AM</span>
          <span>01:45 PM</span>
          <span>03:30 PM</span>
        </div>
      </div>
    </div>
  );
}
