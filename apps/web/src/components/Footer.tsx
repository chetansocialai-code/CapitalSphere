import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info, FileText, Lock, Globe } from 'lucide-react';

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

        {/* Intelligence & AI */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">Intelligence</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/about" className="hover:text-blue-500 transition">Editorial Policy</Link></li>
            <li><Link href="/about" className="hover:text-blue-500 transition">Fact Checking Policy</Link></li>
            <li><Link href="/about" className="hover:text-blue-500 transition">AI Content Policy</Link></li>
            <li><Link href="/admin" className="hover:text-blue-500 transition">Admin CMS Portal</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[#4DA3FF]">Legal & Trust</div>
          <ul className="space-y-2 text-2xs">
            <li><Link href="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-500 transition">Terms of Service</Link></li>
            <li><Link href="/disclaimer" className="hover:text-blue-500 transition">SEBI & Market Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      {/* Trust & Financial Disclaimer Box */}
      <div className="max-w-master mx-auto px-4 pt-6 text-3xs cs-text-sub space-y-2 border-b cs-border pb-6">
        <div className="flex items-center gap-1.5 text-xs text-[#F2B84B] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#F2B84B]" /> SEBI & Financial Disclaimer:
        </div>
        <p className="leading-relaxed">
          CapitalSphere (www.capitalsphere.online) is a financial intelligence and news publisher platform. Market quotes are powered by authentic Upstox Developer V3 API endpoints. CapitalSphere does not provide personalized investment advice or SEBI-registered portfolio management recommendations. Investments in securities markets are subject to market risks; read all scheme-related documents carefully before investing.
        </p>
      </div>

      <div className="max-w-master mx-auto px-4 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-2xs">
        <div>
          © 2026 <span className="font-bold text-white">CAPITALSPHERE</span>. Markets • Money • Business • Intelligence.
        </div>
        <div className="cs-text-sub text-3xs flex flex-wrap items-center gap-4">
          <span className="text-white font-bold">Admin Desk: <a href="mailto:admin@capitalsphere.online" className="text-[#4DA3FF] hover:underline">admin@capitalsphere.online</a></span>
          <span>•</span>
          <span className="text-white font-bold">Investor Desk: <a href="mailto:investor@capitalsphere.online" className="text-[#22C58B] hover:underline">investor@capitalsphere.online</a></span>
          <span>•</span>
          <span>Google AdSense ID: ca-pub-2416474909531167</span>
        </div>
      </div>
    </footer>
  );
}
