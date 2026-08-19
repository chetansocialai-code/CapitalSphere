'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Activity, Database, Server, Radio, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [tradingDisabled, setTradingDisabled] = useState(true);

  const healthMetrics = [
    { name: 'API Gateway', status: 'HEALTHY', latency: '12ms', icon: Server, color: 'text-[#22C58B]' },
    { name: 'PostgreSQL DB', status: 'HEALTHY', latency: '3ms', icon: Database, color: 'text-[#22C58B]' },
    { name: 'Redis Cache & PubSub', status: 'HEALTHY', latency: '1ms', icon: Activity, color: 'text-[#22C58B]' },
    { name: 'WebSocket Stream', status: 'HEALTHY', latency: '4ms', icon: Radio, color: 'text-[#22C58B]' },
    { name: 'Upstox V3 Feed', status: 'AUTHENTICATED', latency: '45ms', icon: ShieldCheck, color: 'text-[#4DA3FF]' },
    { name: 'News Ingestion Worker', status: 'RUNNING', latency: '120ms', icon: FileText, color: 'text-[#F2B84B]' },
  ];

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#F4F7FA] font-mono text-xs p-6 max-w-master mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#202B38] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 font-bold px-2 py-0.5 rounded text-2xs uppercase">
              SUPER ADMIN PORTAL
            </span>
            <h1 className="text-xl font-extrabold text-white font-sans">CapitalSphere Operations & CMS Desk</h1>
          </div>
          <p className="text-2xs text-slate-400 mt-1">
            Real-time System Health Monitoring, Editorial CMS, News Ingestion Provenance & Emergency Trading Safety Switch.
          </p>
        </div>

        {/* Emergency Kill Switch Button */}
        <div className="bg-[#0C1118] border border-[#202B38] p-3 rounded-xl flex items-center gap-4">
          <div>
            <div className="text-2xs font-bold text-slate-300">TRADING SAFETY LOCK</div>
            <div className={`text-3xs font-bold ${tradingDisabled ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
              {tradingDisabled ? 'PROTECTED (TRADING_DISABLED=true)' : 'DANGER (TRADING_ENABLED=true)'}
            </div>
          </div>
          <button
            onClick={() => setTradingDisabled(!tradingDisabled)}
            className={`px-4 py-2 rounded-lg font-bold text-2xs transition flex items-center gap-1.5 shadow-md ${tradingDisabled ? 'bg-[#22C58B] text-slate-950 hover:bg-[#22C58B]/90' : 'bg-[#F05252] text-white hover:bg-[#F05252]/90'}`}
          >
            {tradingDisabled ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {tradingDisabled ? 'EMERGENCY LOCK ACTIVE' : 'DISABLE TRADING NOW'}
          </button>
        </div>
      </div>

      {/* System Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-[#0C1118] border border-[#202B38] p-4 rounded-xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#070A0F] border border-[#202B38]">
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-sans">{metric.name}</div>
                  <div className="text-3xs text-slate-400 mt-0.5">Latency: {metric.latency}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-3xs font-bold bg-[#070A0F] border border-[#202B38] ${metric.color}`}>
                {metric.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Editorial CMS Desk & Provider Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Article Ingestion & Provenance Desk */}
        <div className="lg:col-span-7 bg-[#0C1118] border border-[#202B38] p-5 rounded-xl space-y-4 shadow-lg">
          <div className="flex justify-between items-center border-b border-[#202B38] pb-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4DA3FF]" /> Editorial CMS & Provenance Desk
            </h2>
            <span className="text-3xs bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2 py-0.5 rounded font-bold">
              3 ARTICLES READY
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-[#070A0F] border border-[#202B38] p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-white font-sans">Sensex Hits Record High of 81,000 as Tech and Banking Stocks Surge</div>
                <div className="text-3xs text-slate-400 mt-1">Source: Finnhub / Official BSE Release • AI Key Takeaways Verified</div>
              </div>
              <span className="bg-[#22C58B]/10 text-[#22C58B] border border-[#22C58B]/30 px-2 py-1 rounded text-3xs font-bold shrink-0">
                PUBLISHED
              </span>
            </div>

            <div className="bg-[#070A0F] border border-[#202B38] p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-white font-sans">Reliance Industries Announces ₹75,000 Crore Green Energy Expansion Plan</div>
                <div className="text-3xs text-slate-400 mt-1">Source: Official Company Release • Original Reporting</div>
              </div>
              <span className="bg-[#22C58B]/10 text-[#22C58B] border border-[#22C58B]/30 px-2 py-1 rounded text-3xs font-bold shrink-0">
                PUBLISHED
              </span>
            </div>

            <div className="bg-[#070A0F] border border-[#202B38] p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-white font-sans">RBI Keeps Repo Rate Unchanged at 6.5%, Maintains Policy Stance</div>
                <div className="text-3xs text-slate-400 mt-1">Source: Reserve Bank of India MPC Minutes • Verified</div>
              </div>
              <span className="bg-[#F2B84B]/10 text-[#F2B84B] border border-[#F2B84B]/30 px-2 py-1 rounded text-3xs font-bold shrink-0">
                SCHEDULED
              </span>
            </div>
          </div>
        </div>

        {/* Live Audit Log Stream */}
        <div className="lg:col-span-5 bg-[#0C1118] border border-[#202B38] p-5 rounded-xl space-y-4 shadow-lg">
          <div className="flex justify-between items-center border-b border-[#202B38] pb-3">
            <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22C58B]" /> Security & Audit Trail Stream
            </h2>
            <span className="text-3xs text-slate-400 font-mono">LIVE AUDIT</span>
          </div>

          <div className="bg-[#070A0F] border border-[#202B38] p-3 rounded-lg space-y-2 text-3xs font-mono text-slate-300">
            <div className="text-[#22C58B]">[17:34:33] Upstox V3 Market Data Feed WebSocket connected (Client: 98423b93...)</div>
            <div className="text-slate-400">[17:34:00] API Gateway initialized on port 4000 (CORS: Enabled)</div>
            <div className="text-[#F2B84B]">[17:32:10] Trading Order Attempt BLOCKED by Safety Lock (DISABLE_TRADING=true)</div>
            <div className="text-slate-400">[17:28:05] PostgreSQL Database Connection Verified (Schema: public)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
