'use client';

import React from 'react';
import { Filter } from 'lucide-react';

export function Screener() {
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 3015.40, change: 1.16, volume: '8.54M', pe: 28.4, sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4210.60, change: 3.42, volume: '2.45M', pe: 32.1, sector: 'IT' },
    { symbol: 'INFY', name: 'Infosys Ltd', price: 1865.25, change: 2.85, volume: '5.12M', pe: 24.8, sector: 'IT' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1640.75, change: -1.24, volume: '8.90M', pe: 19.2, sector: 'Banking' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1180.30, change: -0.85, volume: '6.40M', pe: 18.5, sector: 'Banking' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1475.10, change: 2.15, volume: '1.89M', pe: 42.0, sector: 'Telecom' },
  ];

  return (
    <div className="cs-card border rounded-xl p-4 shadow-lg space-y-4 font-mono text-xs tabular-nums">
      <div className="flex justify-between items-center border-b cs-border pb-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4DA3FF]" /> Institutional Market Screener
        </h2>
        <span className="text-2xs cs-text-sub font-sans">Multi-variable Equity Filter</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="cs-topbar cs-text-sub text-3xs uppercase border-b cs-border">
              <th className="py-2.5 px-3">Symbol</th>
              <th className="py-2.5 px-3">Company Name</th>
              <th className="py-2.5 px-3">Sector</th>
              <th className="py-2.5 px-3">LTP</th>
              <th className="py-2.5 px-3">Change %</th>
              <th className="py-2.5 px-3">Volume</th>
              <th className="py-2.5 px-3">P/E</th>
            </tr>
          </thead>
          <tbody className="divide-y cs-border">
            {stocks.map((stock) => {
              const isPos = stock.change >= 0;
              return (
                <tr key={stock.symbol} className="hover:bg-slate-500/10 transition">
                  <td className="py-3 px-3 font-bold">{stock.symbol}</td>
                  <td className="py-3 px-3 cs-text-sub font-sans text-2xs">{stock.name}</td>
                  <td className="py-3 px-3 text-[#4DA3FF] font-sans text-2xs">{stock.sector}</td>
                  <td className="py-3 px-3 font-bold">₹{stock.price.toLocaleString('en-IN')}</td>
                  <td className={`py-3 px-3 font-bold ${isPos ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                    {isPos ? '+' : ''}{stock.change}%
                  </td>
                  <td className="py-3 px-3 cs-text-sub">{stock.volume}</td>
                  <td className="py-3 px-3 cs-text-sub">{stock.pe}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
