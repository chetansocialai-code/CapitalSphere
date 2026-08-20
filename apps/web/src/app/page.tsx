import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { OptionChainTable } from '@/components/OptionChainTable';
import { StockChart } from '@/components/StockChart';
import { Screener } from '@/components/Screener';
import { IPOCenter } from '@/components/IPOCenter';
import { CapitalSphereAiIntelligence } from '@/components/CapitalSphereAiIntelligence';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, BookOpen, Layers } from 'lucide-react';

export default function HomePage() {
  const articles = [
    {
      id: 'sensex-hits-record-high',
      title: 'Sensex Hits Record High of 81,000 as Tech and Banking Stocks Surge',
      excerpt: 'Indian benchmark indices rallied to fresh historic peaks driven by robust Q1 earnings from top tech heavyweights.',
      category: 'Markets',
      time: '2 hours ago',
      slug: 'sensex-hits-record-high-tech-banking-surge',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'reliance-green-energy',
      title: 'Reliance Industries Announces ₹75,000 Crore Green Energy Expansion Plan',
      excerpt: 'India’s largest conglomerate outlines aggressive rollout of gigafactories and green hydrogen initiatives.',
      category: 'Companies',
      time: '4 hours ago',
      slug: 'reliance-industries-announces-green-energy-expansion',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'rbi-monetary-policy',
      title: 'RBI Keeps Repo Rate Unchanged at 6.5%, Maintains Policy Stance',
      excerpt: 'Reserve Bank of India Monetary Policy Committee votes to hold rates steady while monitoring inflation.',
      category: 'Economy',
      time: '6 hours ago',
      slug: 'rbi-keeps-repo-rate-unchanged-6-5-percent',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Hero Section (Breaking News + Featured Story + Market Movers) */}
      <HeroSection />

      {/* 2. CapitalSphere AI Intelligence Hub */}
      <CapitalSphereAiIntelligence />

      {/* 3. Stock Technical Terminal Spotlight */}
      <section className="space-y-4 max-w-master mx-auto px-4">
        <div className="flex justify-between items-center border-b cs-border pb-3">
          <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4DA3FF]" /> Stock Chart & Fundamentals Terminal
          </h2>
          <Link href="/stocks/reliance" className="text-xs text-[#4DA3FF] hover:text-[#69B2FF] font-mono font-bold flex items-center gap-1">
            Full Terminal <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <StockChart symbol="RELIANCE" />
      </section>

      {/* 4. Option Chain Matrix Section */}
      <section className="space-y-4 max-w-master mx-auto px-4">
        <div className="flex justify-between items-center border-b cs-border pb-3">
          <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#22C58B]" /> Derivatives & Option Chain Analysis
          </h2>
          <Link href="/options" className="text-xs text-[#4DA3FF] hover:text-[#69B2FF] font-mono font-bold flex items-center gap-1">
            Full Matrix <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <OptionChainTable />
      </section>

      {/* 5. Screener & IPO Side-by-Side */}
      <div className="max-w-master mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Screener />
        </div>
        <div className="lg:col-span-5">
          <IPOCenter />
        </div>
      </div>

      {/* 6. CapitalSphere Business Journalism Stream */}
      <section className="space-y-4 max-w-master mx-auto px-4">
        <div className="flex justify-between items-center border-b cs-border pb-3">
          <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#F2B84B]" /> CapitalSphere Business Journalism
          </h2>
          <Link href="/news" className="text-xs text-[#4DA3FF] hover:text-[#69B2FF] font-mono font-bold flex items-center gap-1">
            Browse All News <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="cs-card border rounded-xl overflow-hidden group hover:border-[#4DA3FF]/40 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#4DA3FF] text-slate-950 font-mono font-bold text-3xs px-2 py-0.5 rounded uppercase">
                    {article.category}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold font-sans line-clamp-2 group-hover:text-[#4DA3FF] transition">
                    {article.title}
                  </h3>
                  <p className="text-xs cs-text-sub font-sans line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-2 border-t cs-border text-3xs font-mono cs-text-sub flex justify-between items-center">
                <span>{article.time}</span>
                <span className="text-[#4DA3FF] font-bold">Read Full Article →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
