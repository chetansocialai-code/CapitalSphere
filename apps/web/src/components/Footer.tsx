import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#050811] border-t border-[#202B38] text-slate-400 font-mono text-xs pt-12 pb-8 mt-12">
      <div className="max-w-master mx-auto px-4 grid grid-cols-2 md:grid-cols-6 gap-8 pb-8 border-b border-[#202B38]">
        {/* Markets Column */}
        <div className="space-y-3">
          <div className="text-white font-bold text-xs uppercase tracking-wider">Markets</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/markets" className="hover:text-[#4DA3FF] transition">Indian Indices</Link></li>
            <li><Link href="/markets" className="hover:text-[#4DA3FF] transition">Global Markets</Link></li>
            <li><Link href="/options" className="hover:text-[#4DA3FF] transition">Option Chains</Link></li>
            <li><Link href="/ipo" className="hover:text-[#4DA3FF] transition">IPO Center</Link></li>
            <li><Link href="/tools/screener" className="hover:text-[#4DA3FF] transition">Market Screener</Link></li>
          </ul>
        </div>

        {/* News Column */}
        <div className="space-y-3">
          <div className="text-white font-bold text-xs uppercase tracking-wider">News</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/news" className="hover:text-[#4DA3FF] transition">Markets Desk</Link></li>
            <li><Link href="/news" className="hover:text-[#4DA3FF] transition">Corporate Earnings</Link></li>
            <li><Link href="/news" className="hover:text-[#4DA3FF] transition">Economy & Policy</Link></li>
            <li><Link href="/news" className="hover:text-[#4DA3FF] transition">Tech & Startups</Link></li>
          </ul>
        </div>

        {/* Research Column */}
        <div className="space-y-3">
          <div className="text-white font-bold text-xs uppercase tracking-wider">Research</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/research" className="hover:text-[#4DA3FF] transition">Company Deep-Dives</Link></li>
            <li><Link href="/research" className="hover:text-[#4DA3FF] transition">Sector Outlooks</Link></li>
            <li><Link href="/research" className="hover:text-[#4DA3FF] transition">Macro Trends</Link></li>
          </ul>
        </div>

        {/* Tools Column */}
        <div className="space-y-3">
          <div className="text-white font-bold text-xs uppercase tracking-wider">Tools</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/tools" className="hover:text-[#4DA3FF] transition">SIP Calculator</Link></li>
            <li><Link href="/tools" className="hover:text-[#4DA3FF] transition">EMI Calculator</Link></li>
            <li><Link href="/tools" className="hover:text-[#4DA3FF] transition">CAGR Calculator</Link></li>
            <li><Link href="/economy/calendar" className="hover:text-[#4DA3FF] transition">Economic Calendar</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="space-y-3">
          <div className="text-white font-bold text-xs uppercase tracking-wider">Company</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/about" className="hover:text-[#4DA3FF] transition">About CapitalSphere</Link></li>
            <li><Link href="/admin" className="hover:text-[#4DA3FF] transition">Admin CMS Portal</Link></li>
            <li><Link href="/contact" className="hover:text-[#4DA3FF] transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-3">
          <div className="text-white font-bold text-xs uppercase tracking-wider">Legal</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/privacy" className="hover:text-[#4DA3FF] transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#4DA3FF] transition">Terms of Service</Link></li>
            <li><Link href="/disclaimer" className="hover:text-[#4DA3FF] transition">SEBI & Market Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-master mx-auto px-4 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-2xs">
        <div>
          © 2026 <span className="text-white font-bold">CAPITALSPHERE</span>. Markets. Money. Business. Intelligence.
        </div>
        <div className="text-slate-500 text-3xs">
          Market data provided by Upstox Developer V3 API. Investment in securities is subject to market risks.
        </div>
      </div>
    </footer>
  );
}
