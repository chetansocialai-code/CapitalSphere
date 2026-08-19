'use client';

import React from 'react';
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
    <div className="cs-card border rounded-xl p-4 shadow-lg space-y-4 font-mono text-xs tabular-nums">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b cs-border pb-3">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4DA3FF]" /> NIFTY 50 Option Chain (Spot: ₹25,102.40)
          </h2>
          <p className="text-2xs cs-text-sub font-sans">Expiry: 28 AUG 2026 • Real-time Call/Put Greeks Matrix</p>
        </div>
        <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2 py-0.5 rounded text-3xs font-bold">
          PCR: 1.12 (BULLISH)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="cs-topbar cs-text-sub text-3xs uppercase border-b cs-border">
              <th className="py-2 px-2 text-emerald-500">CALL OI</th>
              <th className="py-2 px-2 text-emerald-500">CALL IV</th>
              <th className="py-2 px-2 text-emerald-500">CALL Delta</th>
              <th className="py-2 px-2 text-emerald-500">CALL LTP</th>
              <th className="py-2 px-3 cs-topbar font-extrabold border-x cs-border">STRIKE</th>
              <th className="py-2 px-2 text-rose-500">PUT LTP</th>
              <th className="py-2 px-2 text-rose-500">PUT Delta</th>
              <th className="py-2 px-2 text-rose-500">PUT IV</th>
              <th className="py-2 px-2 text-rose-500">PUT OI</th>
            </tr>
          </thead>
          <tbody className="divide-y cs-border">
            {strikes.map((row) => (
              <tr key={row.strikePrice} className={`hover:bg-slate-500/10 transition ${row.isATM ? 'bg-[#4DA3FF]/15 border-y-2 border-[#4DA3FF]' : ''}`}>
                <td className="py-2 px-2 cs-text-sub">{row.call.oi}</td>
                <td className="py-2 px-2 cs-text-sub">{row.call.iv}</td>
                <td className="py-2 px-2 cs-text-sub">{row.call.delta}</td>
                <td className="py-2 px-2 text-[#22C58B] font-bold">₹{row.call.ltp}</td>
                <td className={`py-2 px-3 font-extrabold border-x cs-border ${row.isATM ? 'bg-[#4DA3FF] text-slate-950' : 'cs-topbar'}`}>
                  {row.strikePrice}
                </td>
                <td className="py-2 px-2 text-[#F05252] font-bold">₹{row.put.ltp}</td>
                <td className="py-2 px-2 cs-text-sub">{row.put.delta}</td>
                <td className="py-2 px-2 cs-text-sub">{row.put.iv}</td>
                <td className="py-2 px-2 cs-text-sub">{row.put.oi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
