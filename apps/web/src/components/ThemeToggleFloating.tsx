'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggleFloating() {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('cs_theme') as 'dark' | 'light') || 'dark';
    setThemeMode(savedTheme);
    applyTheme(savedTheme);
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

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-50 bg-[#0C1118] text-white border border-[#202B38] p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 font-mono text-xs group"
      title={`Switch to ${themeMode === 'dark' ? 'Bright / Light' : 'Dark / Midnight'} Mode`}
    >
      {themeMode === 'dark' ? (
        <>
          <Sun className="w-5 h-5 text-amber-400" />
          <span className="hidden group-hover:inline-block font-bold text-amber-400 text-3xs uppercase tracking-wider pr-1">BRIGHT MODE</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-600" />
          <span className="hidden group-hover:inline-block font-bold text-blue-600 text-3xs uppercase tracking-wider pr-1">DARK MODE</span>
        </>
      )}
    </button>
  );
}
