'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export function OptionChainTable() {
  const underlyingLtp = 25102.40;
  const atmStrike = 25100;
  const strikes = [];

  for (let i = -4; i <= 4; i++) {
    const strike = atmStrike + i * 50;
    const isATM = strike === atmStrike;
    const callDiff = Math.max(0.1, underlyingLtp - strike);
    const putDiff = Math.max(0.1, strike - underlyingLtp);

    strikes.push({
      strikePrice: strike,
      isATM,
      call: {
        ltp: Number((callDiff + 45.50).toFixed(2)),
        change: 12.40,
        volume: '450K',
        oi: '2.45M',
        iv: '14.5%',
        delta: Number((0.5 + i * -0.08).toFixed(2)),
      },
      put: {
        ltp: Number((putDiff + 42.20).toFixed(2)),
        change: -8.10,
        volume: '380K',
        oi: '1.98M',
        iv: '15.1%',
        delta: Number((-0.5 + i * -0.08).toFixed(2)),
      },
    });
  }

  return (
    <div className="bg-[#0C1118] border border-[#202B38] rounded-xl p-4 shadow-lg space-y-4 font-mono text-xs tabular-nums">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#202B38] pb-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4DA3FF]" /> NIFTY 50 Option Chain (Spot: ₹25,102.40)
          </h2>
          <p className="text-2xs text-slate-400 font-sans">Expiry: 28 AUG 2026 • Real-time Call/Put Greeks Matrix</p>
        </div>
        <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2 py-0.5 rounded text-3xs font-bold">
          PCR: 1.12 (BULLISH)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#070A0F] text-slate-400 text-3xs uppercase border-b border-[#202B38]">
              <th className="py-2 px-2 text-emerald-400">CALL OI</th>
              <th className="py-2 px-2 text-emerald-400">CALL IV</th>
              <th className="py-2 px-2 text-emerald-400">CALL Delta</th>
              <th className="py-2 px-2 text-emerald-400">CALL LTP</th>
              <th className="py-2 px-3 bg-[#111823] text-white font-extrabold border-x border-[#202B38]">STRIKE</th>
              <th className="py-2 px-2 text-rose-400">PUT LTP</th>
              <th className="py-2 px-2 text-rose-400">PUT Delta</th>
              <th className="py-2 px-2 text-rose-400">PUT IV</th>
              <th className="py-2 px-2 text-rose-400">PUT OI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202B38]">
            {strikes.map((row) => (
              <tr key={row.strikePrice} className={`hover:bg-[#151D29] transition ${row.isATM ? 'bg-[#4DA3FF]/10 border-y-2 border-[#4DA3FF]' : ''}`}>
                <td className="py-2 px-2 text-slate-300">{row.call.oi}</td>
                <td className="py-2 px-2 text-slate-400">{row.call.iv}</td>
                <td className="py-2 px-2 text-slate-400">{row.call.delta}</td>
                <td className="py-2 px-2 text-[#22C58B] font-bold">₹{row.call.ltp}</td>
                <td className={`py-2 px-3 font-extrabold border-x border-[#202B38] ${row.isATM ? 'bg-[#4DA3FF] text-slate-950' : 'bg-[#111823] text-white'}`}>
                  {row.strikePrice}
                </td>
                <td className="py-2 px-2 text-[#F05252] font-bold">₹{row.put.ltp}</td>
                <td className="py-2 px-2 text-slate-400">{row.put.delta}</td>
                <td className="py-2 px-2 text-slate-400">{row.put.iv}</td>
                <td className="py-2 px-2 text-slate-300">{row.put.oi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
