'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, ShieldCheck, LogOut, BarChart3, Bell, Bookmark, Settings, ArrowUpRight, TrendingUp, TrendingDown, Layers, Clock } from 'lucide-react';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cs_token');
    const userJson = localStorage.getItem('cs_user');

    if (!token || !userJson) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    try {
      setUser(JSON.parse(userJson));
    } catch (e) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/watchlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setWatchlist(json.data);
        }
      } catch (err) {
        // Retain fallback watchlist
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiUrl}/api/v1/auth/logout`, { method: 'POST' });
    } catch (e) {
      // Ignore network logout errors
    } finally {
      localStorage.removeItem('cs_token');
      localStorage.removeItem('cs_user');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs cs-text-sub">
        Loading CapitalSphere Investor Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-master mx-auto px-4 py-8 space-y-8">
      {/* User Header Profile Banner */}
      <div className="cs-card border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-[#4DA3FF]/15 text-[#4DA3FF] border border-[#4DA3FF]/30 font-extrabold text-xl font-mono">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'CS'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-sans text-white">Welcome back, {user?.name || 'Investor'}</h1>
              <span className="bg-[#22C58B]/15 text-[#22C58B] border border-[#22C58B]/30 px-2 py-0.5 rounded text-3xs font-mono font-bold uppercase">
                VERIFIED {user?.role || 'USER'}
              </span>
            </div>
            <p className="text-xs cs-text-sub font-mono">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="cs-topbar border cs-border hover:border-[#4DA3FF] px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
          >
            <Settings className="w-4 h-4 text-[#4DA3FF]" /> Account Settings
          </Link>
          <button
            onClick={handleLogout}
            className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personalized Watchlist & Portfolio */}
        <div className="lg:col-span-8 space-y-6">
          <div className="cs-card border rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b cs-border pb-3">
              <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#4DA3FF]" /> My Personalized Watchlist
              </h2>
              <Link href="/watchlist" className="text-xs text-[#4DA3FF] font-mono font-bold hover:underline flex items-center gap-1">
                Manage Watchlist <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y cs-border font-mono text-xs">
              {watchlist.map((stock) => {
                const isUp = (stock.change || 0) >= 0;
                return (
                  <div key={stock.symbol} className="py-3 flex items-center justify-between hover:bg-slate-500/5 px-2 rounded transition">
                    <div>
                      <div className="font-bold text-white text-sm">{stock.symbol}</div>
                      <div className="text-3xs cs-text-sub">{stock.name || 'NSE Equity'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold tabular-nums">₹{typeof stock.ltp === 'number' ? stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : stock.ltp}</div>
                      <div className={`text-2xs font-bold flex items-center justify-end gap-0.5 ${isUp ? 'text-[#22C58B]' : 'text-rose-400'}`}>
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isUp ? '+' : ''}{stock.changePercent}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Portfolio & Saved Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cs-card border rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b cs-border pb-2">
                <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#F2B84B]" /> Saved Articles & Research
                </span>
                <span className="text-3xs cs-text-sub font-mono">3 Saved</span>
              </div>
              <ul className="space-y-2 text-xs font-sans">
                <li className="cs-topbar p-2 rounded-lg border cs-border hover:border-[#4DA3FF] transition">
                  <Link href="/news/sensex-hits-record-high-tech-banking-surge" className="font-semibold text-slate-200 hover:text-[#4DA3FF] line-clamp-1">
                    Sensex Hits Record High of 81,000 as Tech and Banking Stocks Surge
                  </Link>
                  <span className="text-3xs cs-text-sub font-mono">Markets Desk • Saved 2 days ago</span>
                </li>
                <li className="cs-topbar p-2 rounded-lg border cs-border hover:border-[#4DA3FF] transition">
                  <Link href="/news/reliance-industries-announces-green-energy-expansion" className="font-semibold text-slate-200 hover:text-[#4DA3FF] line-clamp-1">
                    Reliance Industries Announces ₹75,000 Crore Green Energy Expansion
                  </Link>
                  <span className="text-3xs cs-text-sub font-mono">Corporate • Saved 5 days ago</span>
                </li>
              </ul>
            </div>

            <div className="cs-card border rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b cs-border pb-2">
                <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#22C58B]" /> Active Price Alerts
                </span>
                <span className="text-3xs cs-text-sub font-mono">2 Active</span>
              </div>
              <ul className="space-y-2 text-xs font-mono">
                <li className="cs-topbar p-2 rounded-lg border cs-border flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">RELIANCE &gt; ₹3,000</div>
                    <div className="text-3xs cs-text-sub">Target Price Trigger</div>
                  </div>
                  <span className="bg-[#22C58B]/15 text-[#22C58B] text-3xs px-2 py-0.5 rounded font-bold">ACTIVE</span>
                </li>
                <li className="cs-topbar p-2 rounded-lg border cs-border flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">NIFTY 50 &gt; 24,500</div>
                    <div className="text-3xs cs-text-sub">Index Target</div>
                  </div>
                  <span className="bg-[#22C58B]/15 text-[#22C58B] text-3xs px-2 py-0.5 rounded font-bold">ACTIVE</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: User Quick Controls & Security */}
        <div className="lg:col-span-4 space-y-6">
          <div className="cs-card border rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider border-b cs-border pb-3">
              Account Security Status
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg cs-topbar border cs-border">
                <span>Email Status:</span>
                <span className="text-[#22C58B] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg cs-topbar border cs-border">
                <span>Two-Factor Auth:</span>
                <span className="cs-text-sub font-bold">OPTIONAL</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg cs-topbar border cs-border">
                <span>Session Expiration:</span>
                <span className="text-white font-bold">7 Days</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/settings"
                className="w-full cs-topbar hover:bg-slate-700/40 border cs-border py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
              >
                <Settings className="w-4 h-4 text-[#4DA3FF]" /> Manage Security Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
