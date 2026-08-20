'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Zap, Menu, X, BarChart3, User, Sun, Moon, Globe, DollarSign, Flame, Code, LogOut, Key, ChevronDown } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    // Load persisted theme preference
    const savedTheme = localStorage.getItem('cs_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setThemeMode(initialTheme);
    applyTheme(initialTheme);

    // Load active user session
    const token = localStorage.getItem('cs_token');
    const userJson = localStorage.getItem('cs_user');
    if (token && userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {}
    }
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

  const handleLogout = () => {
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    setCurrentUser(null);
    setUserDropdownOpen(false);
    window.location.href = '/';
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
    { name: 'DEVELOPERS API', href: '/developers' },
  ];

  return (
    <header className="sticky top-0 z-50 cs-card border-b backdrop-blur-md">
      {/* Top Utility Status Bar */}
      <div className="cs-topbar text-xs py-1.5 px-4 flex justify-between items-center border-b overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4 text-3xs font-mono">
          <span className="flex items-center gap-1 font-bold uppercase text-[#22C58B] shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#22C58B] animate-ping inline-block"></span>
            NSE / BSE LIVE
          </span>
          <span className="cs-text-sub opacity-40">|</span>
          <span className="cs-text-sub font-semibold">USD/INR: <span className="text-white font-bold">₹83.92</span> <span className="text-[#22C58B]">+0.04%</span></span>
          <span className="hidden sm:inline cs-text-sub opacity-40">|</span>
          <span className="hidden sm:inline cs-text-sub font-semibold">BRENT CRUDE: <span className="text-white font-bold">$76.40</span> <span className="text-[#F05252]">-0.42%</span></span>
          <span className="hidden md:inline cs-text-sub opacity-40">|</span>
          <span className="hidden md:inline cs-text-sub font-semibold">GOLD (10g): <span className="text-white font-bold">₹72,450</span> <span className="text-[#22C58B]">+0.25%</span></span>
          <span className="hidden lg:inline cs-text-sub opacity-40">|</span>
          <span className="hidden lg:inline cs-text-sub font-semibold">BTC/USD: <span className="text-white font-bold">$64,250</span> <span className="text-[#22C58B]">+1.45%</span></span>
        </div>

        <div className="flex items-center gap-3 text-2xs font-mono shrink-0">
          <Link href="/developers" className="hidden sm:flex items-center gap-1.5 bg-[#4DA3FF]/10 hover:bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2.5 py-0.5 rounded text-3xs font-bold uppercase tracking-wider transition">
            <Code className="w-3 h-3 text-[#22C58B]" /> OPEN API PORTAL
          </Link>

          <Link href="/admin" className="cs-text-sub hover:text-[#4DA3FF] transition hidden md:inline">Admin CMS</Link>
          <Link href="/about" className="cs-text-sub hover:text-[#4DA3FF] transition hidden md:inline">About</Link>

          {/* Dark / Bright Mode Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 cs-card hover:border-[#4DA3FF] px-2.5 py-0.5 rounded-md border text-xs font-semibold font-mono transition shadow-xs"
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
        </div>
      </div>

      {/* Main Branding & Navigation Bar */}
      <div className="max-w-master mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="https://res.cloudinary.com/dtzyjynai/image/upload/v1787160480/c9014f75-543b-4908-aa38-94a839e8670c-removebg-preview_mj92p5.png"
            alt="CapitalSphere Logo"
            className="h-28 md:h-32 w-auto object-contain drop-shadow-[0_0_12px_rgba(77,163,255,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(77,163,255,0.85)] transition-all duration-300"
          />
        </Link>

        {/* Global Search Box */}
        <div className="hidden lg:flex items-center relative max-w-md w-full">
          <Search className="absolute left-3 w-4 h-4 cs-text-sub" />
          <input
            type="text"
            placeholder="Search Stocks, Option Chains, News (e.g. RELIANCE, NIFTY)..."
            className="w-full cs-card text-xs placeholder:text-slate-500 pl-9 pr-4 py-2 rounded-lg border focus:border-[#4DA3FF] focus:outline-none transition shadow-xs"
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

          {/* User Account Login / Profile State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-[#4DA3FF]/15 border border-[#4DA3FF]/40 text-[#4DA3FF] hover:bg-[#4DA3FF]/25 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition"
              >
                <div className="w-6 h-6 rounded-full bg-[#4DA3FF] text-slate-950 flex items-center justify-center font-extrabold text-3xs">
                  {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'CS'}
                </div>
                <span className="line-clamp-1">{currentUser.name || 'Account'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 cs-card border rounded-xl shadow-2xl p-2 z-50 space-y-1 font-mono text-xs">
                  <div className="p-2 border-b cs-border">
                    <div className="font-bold text-white text-xs">{currentUser.name}</div>
                    <div className="text-3xs cs-text-sub truncate">{currentUser.email}</div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 p-2 hover:bg-slate-500/10 rounded-lg transition"
                  >
                    <User className="w-4 h-4 text-[#4DA3FF]" /> My Dashboard
                  </Link>
                  <Link
                    href="/developers"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 p-2 hover:bg-slate-500/10 rounded-lg transition"
                  >
                    <Key className="w-4 h-4 text-[#22C58B]" /> My API Keys
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold px-4 py-2 rounded-lg shadow-md shadow-[#4DA3FF]/20 transition flex items-center gap-1.5 font-sans"
            >
              <User className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}
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
