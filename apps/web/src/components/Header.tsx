'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Zap, Menu, X, BarChart3, User, Sun, Moon, Laptop } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Load persisted theme preference
    const savedTheme = localStorage.getItem('cs_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setThemeMode(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (mode: 'dark' | 'light') => {
    const root = document.documentElement;
    const body = document.body;
    if (mode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    localStorage.setItem('cs_theme', nextTheme);
    applyTheme(nextTheme);
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
    <header className="sticky top-0 z-50 cs-card border-b backdrop-blur-md">
      {/* Top Utility Header */}
      <div className="cs-topbar text-xs py-1.5 px-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-mono text-2xs font-bold tracking-wider uppercase text-[#F2B84B]">
            <ShieldCheck className="w-3.5 h-3.5" /> UPSTOX V3 FEED CONNECTED
          </span>
          <span className="hidden md:inline cs-text-sub opacity-50">|</span>
          <span className="hidden md:inline font-mono text-2xs cs-text-sub">NSE / BSE Real-Time Streaming</span>
        </div>
        <div className="flex items-center gap-4 text-2xs font-mono">
          <Link href="/admin" className="hover:text-blue-500 transition">Admin CMS Portal</Link>
          <Link href="/about" className="hover:text-blue-500 transition">About</Link>

          {/* Dark / Bright Mode Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 cs-card hover:border-[#4DA3FF] px-2.5 py-1 rounded-md border text-xs font-semibold font-mono transition shadow-sm"
            title={`Switch to ${themeMode === 'dark' ? 'Bright / Light' : 'Dark / Midnight'} Mode`}
          >
            {themeMode === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F2B84B]" />
                <span className="text-amber-400 font-bold uppercase tracking-wider text-3xs">BRIGHT MODE</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-600 font-bold uppercase tracking-wider text-3xs">DARK MODE</span>
              </>
            )}
          </button>

          <a
            href="http://localhost:4000/api/v1/upstox/login"
            className="bg-[#4DA3FF]/15 hover:bg-[#4DA3FF]/25 text-[#4DA3FF] border border-[#4DA3FF]/40 px-2.5 py-0.5 rounded font-mono font-semibold transition flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-[#F2B84B]" /> Connect Upstox
          </a>
        </div>
      </div>

      {/* Main Branding & Navigation Bar */}
      <div className="max-w-master mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="https://res.cloudinary.com/dtzyjynai/image/upload/v1787160480/c9014f75-543b-4908-aa38-94a839e8670c-removebg-preview_mj92p5.png"
            alt="CapitalSphere Logo"
            className="h-20 w-auto object-contain drop-shadow-[0_0_10px_rgba(77,163,255,0.5)] group-hover:drop-shadow-[0_0_18px_rgba(77,163,255,0.7)] transition-all duration-300"
          />
        </Link>

        {/* Global Search Box */}
        <div className="hidden lg:flex items-center relative max-w-md w-full">
          <Search className="absolute left-3 w-4 h-4 cs-text-sub" />
          <input
            type="text"
            placeholder="Search Stocks, Option Chains, News (e.g. RELIANCE, NIFTY)..."
            className="w-full cs-card text-xs placeholder:text-slate-500 pl-9 pr-4 py-2 rounded-lg border focus:border-[#4DA3FF] focus:outline-none transition shadow-sm"
          />
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/watchlist"
            className="text-xs cs-card px-3 py-2 rounded-lg border transition flex items-center gap-1.5 font-medium"
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
          className="md:hidden cs-text-sub p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:block cs-nav border-t px-4">
        <div className="max-w-master mx-auto flex items-center gap-1 text-xs font-semibold tracking-wider font-mono overflow-x-auto">
          {mainNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2.5 cs-text-sub hover:text-blue-500 rounded transition shrink-0"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden cs-card border-b px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 cs-text-sub" />
            <input
              type="text"
              placeholder="Search symbol or news..."
              className="w-full cs-card text-xs placeholder:text-slate-500 pl-9 pr-4 py-2 rounded-lg border"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold font-mono">
            {mainNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="cs-card px-3 py-2 rounded border text-center"
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
