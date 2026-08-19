import React from 'react';

export function IPOCenter() {
  const ipos = [
    { name: 'Swiggy Limited', issueSize: '₹10,400 Cr', priceBand: '₹371 - ₹390', openDate: '25 AUG 2026', gmp: '+₹42 (10.7%)', status: 'UPCOMING' },
    { name: 'Ola Electric Mobility', issueSize: '₹6,145 Cr', priceBand: '₹72 - ₹76', openDate: '02 AUG 2026', gmp: '+₹15 (19.7%)', status: 'LISTED' },
  ];

  return (
    <div className="bg-[#0C1118] border border-[#202B38] rounded-xl p-4 shadow-lg space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-[#202B38] pb-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">IPO Intelligence Center</h2>
        <span className="text-3xs bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2 py-0.5 rounded font-bold">LIVE TRACKER</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ipos.map((ipo) => (
          <div key={ipo.name} className="bg-[#070A0F] border border-[#202B38] p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-sm font-sans">{ipo.name}</h3>
              <span className={`text-3xs font-bold px-2 py-0.5 rounded ${ipo.status === 'UPCOMING' ? 'bg-[#F2B84B]/10 text-[#F2B84B] border border-[#F2B84B]/30' : 'bg-[#22C58B]/10 text-[#22C58B] border border-[#22C58B]/30'}`}>
                {ipo.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-2xs text-slate-400 pt-2 border-t border-[#202B38]/80 tabular-nums">
              <div>Issue Size: <span className="text-white font-bold">{ipo.issueSize}</span></div>
              <div>Price Band: <span className="text-white font-bold">{ipo.priceBand}</span></div>
              <div>Open Date: <span className="text-white font-bold">{ipo.openDate}</span></div>
              <div>GMP Estimate: <span className="text-[#22C58B] font-bold">{ipo.gmp}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
