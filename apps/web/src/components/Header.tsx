'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Zap, Menu, X, BarChart3, User, Sun, Moon } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const mainNav = [
    { name: 'MARKETS', href: '/markets' },
    { name: 'NEWS', href: '/news' },
    { name: 'STOCKS', href: '/stocks/reliance' },
    { name: 'OPTIONS', href: '/options' },
    { name: 'IPO', href: '/ipo' },
    { name: 'COMPANIES', href: '/companies/reliance-industries' },
    { name: 'RESEARCH', href: '/research' },
    { name: 'TOOLS', href: '/tools' },
    { name: 'CALENDAR', href: '/economy/calendar' },
    { name: 'WATCHLIST', href: '/watchlist' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070A0F]/95 border-b border-[#202B38]">
      {/* Top Utility Header */}
      <div className="bg-[#050811] text-xs py-1 px-4 text-slate-400 flex justify-between items-center border-b border-[#202B38]/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-mono text-2xs text-[#F2B84B] font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE UPSTOX V3 FEED
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline font-mono text-2xs">BSE / NSE Real-Time Streaming</span>
        </div>
        <div className="flex items-center gap-4 text-2xs font-mono">
          <Link href="/admin" className="hover:text-white transition">Admin Portal</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>

          {/* Dark / Light Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 bg-[#111823] hover:bg-[#151D29] text-slate-200 px-2 py-0.5 rounded border border-[#202B38] transition"
            title="Toggle Theme Mode"
          >
            {theme === 'dark' ? <Sun className="w-3 h-3 text-[#F2B84B]" /> : <Moon className="w-3 h-3 text-[#4DA3FF]" />}
            <span className="capitalize">{theme} Mode</span>
          </button>

          <a
            href="http://localhost:4000/api/v1/upstox/login"
            className="bg-[#4DA3FF]/20 hover:bg-[#4DA3FF]/30 text-[#4DA3FF] border border-[#4DA3FF]/40 px-2.5 py-0.5 rounded font-mono font-semibold transition flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-[#F2B84B]" /> Connect Upstox
          </a>
        </div>
      </div>

      {/* Main Branding & Navigation Bar */}
      <div className="max-w-master mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4DA3FF] to-blue-900 flex items-center justify-center text-white font-extrabold font-mono text-xl shadow-lg shadow-[#4DA3FF]/20 border border-blue-400/40">
            CS
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-sans flex items-center gap-1">
              CAPITAL<span className="text-[#4DA3FF]">SPHERE</span>
            </span>
            <span className="block text-[9px] uppercase font-mono text-slate-400 tracking-widest -mt-1 font-semibold">
              Markets • Money • Intelligence
            </span>
          </div>
        </Link>

        {/* Global Search Box */}
        <div className="hidden lg:flex items-center relative max-w-md w-full">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Stocks, Option Chains, News (e.g. RELIANCE, NIFTY)..."
            className="w-full bg-[#0C1118] text-xs text-white placeholder-slate-500 pl-9 pr-4 py-2 rounded-lg border border-[#202B38] focus:border-[#4DA3FF] focus:outline-none transition"
          />
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/watchlist"
            className="text-xs bg-[#0C1118] hover:bg-[#111823] text-slate-200 px-3 py-2 rounded-lg border border-[#202B38] transition flex items-center gap-1.5 font-medium"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#4DA3FF]" /> Watchlist
          </Link>
          <Link
            href="/login"
            className="text-xs bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold px-4 py-2 rounded-lg shadow-md shadow-[#4DA3FF]/20 transition flex items-center gap-1.5 font-sans"
          >
            <User className="w-3.5 h-3.5" /> Sign In
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Main Navigation Links */}
      <nav className="hidden md:block bg-[#0C1118] border-t border-[#202B38] px-4">
        <div className="max-w-master mx-auto flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-300 font-mono overflow-x-auto">
          {mainNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2.5 hover:text-white hover:bg-[#151D29] rounded transition shrink-0"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070A0F] border-b border-[#202B38] px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search symbol or news..."
              className="w-full bg-[#0C1118] text-xs text-white placeholder-slate-500 pl-9 pr-4 py-2 rounded-lg border border-[#202B38]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold font-mono">
            {mainNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#0C1118] hover:bg-[#151D29] text-slate-300 px-3 py-2 rounded border border-[#202B38] text-center"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
