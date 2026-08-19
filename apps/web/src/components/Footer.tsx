import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="cs-topbar border-t cs-text-sub font-mono text-xs pt-12 pb-8 mt-12">
      <div className="max-w-master mx-auto px-4 grid grid-cols-2 md:grid-cols-6 gap-8 pb-8 border-b cs-border">
        {/* Markets Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">Markets</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/markets" className="hover:text-blue-500 transition">Indian Indices</Link></li>
            <li><Link href="/markets" className="hover:text-blue-500 transition">Global Markets</Link></li>
            <li><Link href="/options" className="hover:text-blue-500 transition">Option Chains</Link></li>
            <li><Link href="/ipo" className="hover:text-blue-500 transition">IPO Center</Link></li>
            <li><Link href="/tools/screener" className="hover:text-blue-500 transition">Market Screener</Link></li>
          </ul>
        </div>

        {/* News Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">News</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/news" className="hover:text-blue-500 transition">Markets Desk</Link></li>
            <li><Link href="/news" className="hover:text-blue-500 transition">Corporate Earnings</Link></li>
            <li><Link href="/news" className="hover:text-blue-500 transition">Economy & Policy</Link></li>
            <li><Link href="/news" className="hover:text-blue-500 transition">Tech & Startups</Link></li>
          </ul>
        </div>

        {/* Research Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">Research</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/research" className="hover:text-blue-500 transition">Company Deep-Dives</Link></li>
            <li><Link href="/research" className="hover:text-blue-500 transition">Sector Outlooks</Link></li>
            <li><Link href="/research" className="hover:text-blue-500 transition">Macro Trends</Link></li>
          </ul>
        </div>

        {/* Tools Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">Tools</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/tools" className="hover:text-blue-500 transition">SIP Calculator</Link></li>
            <li><Link href="/tools" className="hover:text-blue-500 transition">EMI Calculator</Link></li>
            <li><Link href="/tools" className="hover:text-blue-500 transition">CAGR Calculator</Link></li>
            <li><Link href="/economy/calendar" className="hover:text-blue-500 transition">Economic Calendar</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">Company</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/about" className="hover:text-blue-500 transition">About CapitalSphere</Link></li>
            <li><Link href="/admin" className="hover:text-blue-500 transition">Admin CMS Portal</Link></li>
            <li><Link href="/contact" className="hover:text-blue-500 transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">Legal</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-500 transition">Terms of Service</Link></li>
            <li><Link href="/disclaimer" className="hover:text-blue-500 transition">SEBI & Market Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-master mx-auto px-4 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-2xs">
        <div>
          © 2026 <span className="font-bold">CAPITALSPHERE</span>. Markets. Money. Business. Intelligence.
        </div>
        <div className="cs-text-sub text-3xs">
          Market data provided by Upstox Developer V3 API. Investment in securities is subject to market risks.
        </div>
      </div>
    </footer>
  );
}
