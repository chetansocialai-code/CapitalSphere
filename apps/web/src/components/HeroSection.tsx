'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export function HeroSection() {
  const topMovers = [
    { symbol: 'TCS', price: '₹4,210.60', change: '+3.42%', isUp: true, vol: '2.45M' },
    { symbol: 'INFY', price: '₹1,865.25', change: '+2.85%', isUp: true, vol: '5.12M' },
    { symbol: 'BHARTIARTL', price: '₹1,475.10', change: '+2.15%', isUp: true, vol: '1.89M' },
    { symbol: 'HDFCBANK', price: '₹1,640.75', change: '-1.24%', isUp: false, vol: '8.90M' },
    { symbol: 'ICICIBANK', price: '₹1,180.30', change: '-0.85%', isUp: false, vol: '6.40M' },
  ];

  return (
    <section className="py-6 max-w-master mx-auto px-4">
      {/* Breaking News Ticker Strip */}
      <div className="bg-gradient-to-r from-blue-950/80 via-[#0C1118] to-[#0C1118] border border-[#202B38] rounded-xl p-2.5 mb-6 flex items-center gap-3">
        <span className="bg-[#4DA3FF] text-slate-950 text-2xs font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3" /> BREAKING
        </span>
        <div className="text-xs text-slate-200 overflow-hidden text-ellipsis whitespace-nowrap font-medium flex-1">
          Sensex rallies 480 points to cross 80,600 as TCS & IT stocks lead broad-based market surge | RBI holds Repo rate at 6.50%
        </div>
        <Link href="/news" className="text-xs text-[#4DA3FF] font-semibold hover:text-[#69B2FF] shrink-0 flex items-center font-mono">
          Read Story <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      {/* Hero Hybrid Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lead Editorial Story (8 cols) */}
        <div className="lg:col-span-8 bg-[#0C1118] border border-[#202B38] rounded-xl overflow-hidden group shadow-lg flex flex-col justify-between">
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200"
              alt="Sensex Rally"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-[#070A0F]/60 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-[#4DA3FF] text-slate-950 text-2xs font-bold font-mono px-2.5 py-1 rounded uppercase">MARKETS DESK</span>
              <span className="bg-[#22C58B] text-white text-2xs font-bold font-mono px-2.5 py-1 rounded">NIFTY +0.58%</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight group-hover:text-[#4DA3FF] transition font-sans">
                Sensex Hits Record High of 81,000 as Tech and Banking Stocks Surge
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-2 line-clamp-2 font-sans">
                Indian benchmark indices rallied to fresh historic peaks driven by robust Q1 earnings from top tech heavyweights and strong FII inflows.
              </p>
            </div>
          </div>

          {/* AI Intelligence Insights Box */}
          <div className="p-4 bg-[#070A0F] border-t border-[#202B38]">
            <div className="flex items-center gap-1.5 text-xs text-[#F2B84B] font-bold font-mono uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B84B]" /> CapitalSphere AI Key Takeaways
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc marker:text-[#F2B84B] font-sans">
              <li>Sensex crossed 81,000 while Nifty 50 surged past 24,600.</li>
              <li>IT index gained 2.8% led by strong institutional buying in TCS and Infosys.</li>
              <li>Foreign Institutional Investors (FIIs) net bought ₹3,450 Cr in equity segment.</li>
            </ul>
          </div>
        </div>

        {/* Live Market Movers Sidebar (4 cols - High Density Terminal Feel) */}
        <div className="lg:col-span-4 bg-[#0C1118] border border-[#202B38] rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-[#202B38] pb-3 mb-3">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#22C58B]" /> Market Movers (NSE)
              </h2>
              <span className="text-3xs text-[#F2B84B] font-mono font-bold bg-[#F2B84B]/10 px-1.5 py-0.5 rounded border border-[#F2B84B]/30">UPSTOX V3</span>
            </div>

            <div className="space-y-2">
              {topMovers.map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/stocks/${stock.symbol.toLowerCase()}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#070A0F] hover:bg-[#151D29] border border-[#202B38] transition"
                >
                  <div>
                    <div className="text-xs font-bold text-white font-mono">{stock.symbol}</div>
                    <div className="text-3xs text-slate-400 font-mono">Vol: {stock.vol}</div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <div className="text-xs font-bold text-white">{stock.price}</div>
                    <div className={`text-2xs font-bold flex items-center justify-end ${stock.isUp ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                      {stock.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {stock.change}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#202B38]">
            <Link
              href="/tools/screener"
              className="w-full bg-[#4DA3FF]/10 hover:bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/30 text-xs font-mono font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition"
            >
              Open Market Screener Terminal →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
