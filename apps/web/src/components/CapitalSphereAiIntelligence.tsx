'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Zap, ArrowRight, Activity, PieChart } from 'lucide-react';

export function CapitalSphereAiIntelligence() {
  const [selectedTab, setSelectedTab] = useState<'brief' | 'movers' | 'risks' | 'sectors'>('brief');

  const briefing = {
    title: "Market Morning Brief: Tech & Banking Lead Surge",
    summary: "Indian benchmark indices opened on a bullish momentum driven by robust institutional inflows, strong Q1 IT earnings, and steady RBI policy stance.",
    takeaways: [
      "Nifty 50 broke past 24,200 level with 0.63% intraday gain.",
      "Reliance Industries and TCS added over 45 points combined to Nifty upside.",
      "FII net cash buying crossed ₹3,450 Cr while DIIs absorbed profit taking.",
      "Crude oil prices stabilized at $76.40/bbl providing macroeconomic cushion."
    ],
    sentiment: "BULLISH",
    sentimentScore: 78,
  };

  const stockMovers = [
    { symbol: 'TCS', change: '+3.42%', reason: 'Strong US enterprise cloud contract wins & Q1 margin expansion.', signal: 'BULLISH' },
    { symbol: 'RELIANCE', change: '+1.26%', reason: 'Jio Telecom ARPU hike & retail arm valuation upgrade by global brokerages.', signal: 'BULLISH' },
    { symbol: 'INFY', change: '+1.25%', reason: 'Digital transformation guidance upgrade for H2 FY26.', signal: 'BULLISH' },
    { symbol: 'HDFCBANK', change: '-1.24%', reason: 'Short-term margin compression fears ahead of regulatory deposit ratio review.', signal: 'BEARISH' },
  ];

  return (
    <section className="py-6 max-w-master mx-auto px-4">
      <div className="cs-card border rounded-xl p-6 shadow-xl relative overflow-hidden">
        {/* Ambient AI Glow Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DA3FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b cs-border pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F2B84B] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#F2B84B] animate-pulse" /> CAPITALSPHERE AI INTELLIGENCE
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold font-sans">
              Real-Time Market Analytics & Synthesis
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 cs-topbar p-1 rounded-lg border cs-border text-xs font-mono">
            <button
              onClick={() => setSelectedTab('brief')}
              className={`px-3 py-1.5 rounded-md transition font-semibold ${selectedTab === 'brief' ? 'bg-[#4DA3FF] text-slate-950 font-bold' : 'cs-text-sub hover:text-white'}`}
            >
              Morning Brief
            </button>
            <button
              onClick={() => setSelectedTab('movers')}
              className={`px-3 py-1.5 rounded-md transition font-semibold ${selectedTab === 'movers' ? 'bg-[#4DA3FF] text-slate-950 font-bold' : 'cs-text-sub hover:text-white'}`}
            >
              Why Stock Moved?
            </button>
            <button
              onClick={() => setSelectedTab('risks')}
              className={`px-3 py-1.5 rounded-md transition font-semibold ${selectedTab === 'risks' ? 'bg-[#4DA3FF] text-slate-950 font-bold' : 'cs-text-sub hover:text-white'}`}
            >
              Risk Signals
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'brief' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-sans text-white">{briefing.title}</h3>
                <span className="bg-[#22C58B]/15 text-[#22C58B] border border-[#22C58B]/30 px-2.5 py-0.5 rounded font-mono text-2xs font-bold uppercase">
                  SENTIMENT: {briefing.sentiment} ({briefing.sentimentScore}/100)
                </span>
              </div>
              <p className="text-xs md:text-sm cs-text-sub font-sans leading-relaxed">
                {briefing.summary}
              </p>
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider cs-text-sub">AI Key Takeaways:</div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans">
                  {briefing.takeaways.map((item, idx) => (
                    <li key={idx} className="cs-topbar border cs-border p-2.5 rounded-lg flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#F2B84B] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 cs-topbar border cs-border p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#4DA3FF] uppercase mb-3">
                  <Activity className="w-4 h-4 text-[#4DA3FF]" /> Sector Momentum Matrix
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span>NIFTY IT</span>
                    <span className="text-[#22C58B] font-bold">+1.25% (Strong Momentum)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NIFTY ENERGY</span>
                    <span className="text-[#22C58B] font-bold">+0.92% (Bullish)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NIFTY BANK</span>
                    <span className="text-[#22C58B] font-bold">+0.45% (Consolidating)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NIFTY AUTO</span>
                    <span className="text-[#F05252] font-bold">-0.18% (Profit Booking)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t cs-border text-3xs font-mono cs-text-sub flex items-center justify-between">
                <span>AI Synthesis Engine v2.4</span>
                <span className="text-[#22C58B] font-bold">VERIFIED SOURCES</span>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'movers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stockMovers.map((item) => (
              <div key={item.symbol} className="cs-topbar border cs-border p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-white">{item.symbol}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${item.signal === 'BULLISH' ? 'bg-[#22C58B]/15 text-[#22C58B]' : 'bg-[#F05252]/15 text-[#F05252]'}`}>
                    {item.change} ({item.signal})
                  </span>
                </div>
                <p className="text-xs cs-text-sub font-sans leading-relaxed">
                  <strong className="text-slate-300">Why Moving:</strong> {item.reason}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'risks' && (
          <div className="space-y-3">
            <div className="cs-topbar border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#F2B84B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold text-[#F2B84B] uppercase">Global Macro Risk: Brent Crude Fluctuation</h4>
                <p className="text-xs cs-text-sub font-sans mt-1">
                  Crude oil volatility above $78/bbl poses short-term margin risks for paints, lubricants, and aviation sectors.
                </p>
              </div>
            </div>
            <div className="cs-topbar border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#4DA3FF] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold text-[#4DA3FF] uppercase">FII Inflow Safety Buffer</h4>
                <p className="text-xs cs-text-sub font-sans mt-1">
                  Strong net FII buying of ₹3,450 Cr cushions domestic equity benchmarks against global rate policy uncertainties.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
