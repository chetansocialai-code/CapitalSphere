'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexQuote {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  status: string;
}

export function MarketTicker() {
  const [indices, setIndices] = useState<IndexQuote[]>([
    { symbol: 'NIFTY 50', ltp: 25102.40, change: 204.10, changePercent: 0.82, status: 'MARKET CLOSED' },
    { symbol: 'SENSEX', ltp: 82430.50, change: 582.30, changePercent: 0.71, status: 'MARKET CLOSED' },
    { symbol: 'BANK NIFTY', ltp: 52410.80, change: -110.40, changePercent: -0.21, status: 'MARKET CLOSED' },
    { symbol: 'NIFTY IT', ltp: 41250.30, change: 620.80, changePercent: 1.53, status: 'MARKET CLOSED' },
    { symbol: 'INDIA VIX', ltp: 14.25, change: -0.45, changePercent: -3.06, status: 'MARKET CLOSED' },
    { symbol: 'NASDAQ', ltp: 17850.40, change: 195.20, changePercent: 1.10, status: 'DELAYED' },
    { symbol: 'DOW JONES', ltp: 40820.10, change: -45.00, changePercent: -0.11, status: 'DELAYED' },
  ]);

  const isLive = indices.some(i => i.status === 'LIVE');

  useEffect(() => {
    const fetchMarketQuotes = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/markets/indices');
        const json = await res.json();
        if (json.success && json.data) {
          setIndices(json.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchMarketQuotes();
  }, []);

  return (
    <div className="cs-card border-y text-xs font-mono py-2 px-4 overflow-x-auto whitespace-nowrap flex items-center gap-6 shadow-xs">
      <div className="flex items-center gap-1.5 cs-text-sub text-2xs font-sans uppercase font-bold tracking-wider pr-2 border-r cs-border shrink-0">
        {isLive ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C58B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C58B]"></span>
            </span>
            <span className="text-[#22C58B]">LIVE MARKET</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-[#F2B84B] inline-block"></span>
            <span className="text-[#F2B84B]">MARKET CLOSED</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
        {indices.map((idx) => {
          const isPositive = idx.change >= 0;
          return (
            <div key={idx.symbol} className="flex items-center gap-2 shrink-0 cs-card hover:bg-slate-500/10 px-2 py-0.5 rounded transition">
              <span className="cs-text-sub font-semibold">{idx.symbol}</span>
              <span className="font-bold tabular-nums">{idx.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <span className={`flex items-center gap-0.5 font-semibold tabular-nums ${isPositive ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{idx.change.toFixed(2)} ({isPositive ? '+' : ''}{idx.changePercent.toFixed(2)}%)
              </span>
              <span className={`text-3xs px-1 rounded font-bold ${idx.status === 'LIVE' ? 'bg-[#22C58B]/10 text-[#22C58B] border border-[#22C58B]/30' : 'cs-topbar cs-text-sub'}`}>
                {idx.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
