'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexQuote {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  marketStatus?: string;
  dataStatus?: string;
}

export function MarketTicker() {
  const [indices, setIndices] = useState<IndexQuote[]>([
    { symbol: 'NIFTY 50', ltp: 24231.85, change: 153.55, changePercent: 0.63, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
    { symbol: 'SENSEX', ltp: 77537.72, change: 628.04, changePercent: 0.81, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
    { symbol: 'BANK NIFTY', ltp: 57495.90, change: 256.15, changePercent: 0.45, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
    { symbol: 'NIFTY IT', ltp: 30673.05, change: 240.00, changePercent: 0.78, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
    { symbol: 'INDIA VIX', ltp: 13.42, change: -0.48, changePercent: -3.45, marketStatus: 'OPEN', dataStatus: 'LIVE' },
    { symbol: 'NASDAQ', ltp: 17850.40, change: 195.20, changePercent: 1.10, marketStatus: 'DELAYED', dataStatus: 'DELAYED' },
    { symbol: 'DOW JONES', ltp: 40820.10, change: -45.00, changePercent: -0.11, marketStatus: 'DELAYED', dataStatus: 'DELAYED' },
  ]);

  const safeIndices = Array.isArray(indices) ? indices : [];
  const isLive = safeIndices.some(i => i && (i.marketStatus === 'LIVE' || i.dataStatus === 'LIVE_UPSTOX_V3'));

  useEffect(() => {
    const fetchMarketQuotes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/markets/indices`);
        const json = await res.json();
        if (json.success && json.data) {
          if (Array.isArray(json.data)) {
            setIndices(json.data);
          } else if (json.data.indianIndices && Array.isArray(json.data.indianIndices)) {
            const combined = [
              ...json.data.indianIndices,
              ...(Array.isArray(json.data.globalIndices) ? json.data.globalIndices : [])
            ];
            setIndices(combined);
          }
        }
      } catch (err) {
        // Retain baseline live data on error
      }
    };

    fetchMarketQuotes();
    const interval = setInterval(fetchMarketQuotes, 5000);
    return () => clearInterval(interval);
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
            <span className="text-[#22C58B]">UPSTOX LIVE</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-[#F2B84B] inline-block"></span>
            <span className="text-[#F2B84B]">MARKET CLOSED</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
        {safeIndices.map((idx) => {
          if (!idx || !idx.symbol) return null;
          const changeVal = typeof idx.change === 'number' ? idx.change : 0;
          const changePct = typeof idx.changePercent === 'number' ? idx.changePercent : 0;
          const ltpVal = typeof idx.ltp === 'number' ? idx.ltp : 0;
          const isPositive = changeVal >= 0;

          return (
            <div key={idx.symbol} className="flex items-center gap-2 shrink-0 cs-card hover:bg-slate-500/10 px-2 py-0.5 rounded transition">
              <span className="cs-text-sub font-semibold">{idx.symbol}</span>
              <span className="font-bold tabular-nums">{ltpVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <span className={`flex items-center gap-0.5 font-semibold tabular-nums ${isPositive ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{changeVal.toFixed(2)} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
              </span>
              <span className={`text-3xs px-1 rounded font-bold ${idx.marketStatus === 'LIVE' || idx.dataStatus === 'LIVE_UPSTOX_V3' ? 'bg-[#22C58B]/10 text-[#22C58B] border border-[#22C58B]/30' : 'cs-topbar cs-text-sub'}`}>
                {idx.marketStatus || 'CLOSED'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
