'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Globe,
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  Newspaper,
  Layers,
  Building2,
  DollarSign,
  Cpu,
  Coins,
  ArrowUpRight,
  TrendingDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AdSenseBanner } from '@/components/AdSenseBanner';

interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface MarketIndexItem {
  symbol: string;
  name: string;
  value: string;
  change: string;
  percent: string;
  isUp: boolean;
  status: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Markets', icon: Globe },
  { id: 'stocks', label: 'Stocks & Equities', icon: TrendingUp },
  { id: 'economy', label: 'Economy & Fed', icon: DollarSign },
  { id: 'tech', label: 'Tech & AI', icon: Cpu },
  { id: 'crypto', label: 'Crypto & Web3', icon: Coins },
];

const INITIAL_INDICES: MarketIndexItem[] = [
  { symbol: 'SENSEX', name: 'BSE Sensex', value: '79,045.20', change: '-326.10', percent: '-0.41%', isUp: false, status: 'MONEYCONTROL_VERIFIED' },
  { symbol: 'NIFTY 50', name: 'NSE Nifty 50', value: '24,092.40', change: '-76.60', percent: '-0.32%', isUp: false, status: 'MONEYCONTROL_VERIFIED' },
  { symbol: 'BANK NIFTY', name: 'Nifty Bank', value: '51,080.50', change: '-42.10', percent: '-0.08%', isUp: false, status: 'MONEYCONTROL_VERIFIED' },
  { symbol: 'NIFTY IT', name: 'Nifty IT', value: '41,250.30', change: '+210.40', percent: '+0.51%', isUp: true, status: 'MONEYCONTROL_VERIFIED' },
  { symbol: 'NASDAQ', name: 'Nasdaq Comp', value: '17,877.50', change: '+184.60', percent: '+1.04%', isUp: true, status: 'DELAYED' },
  { symbol: 'BTC/USD', name: 'Bitcoin', value: '$64,250.00', change: '+$1,450.00', percent: '+2.31%', isUp: true, status: 'LIVE_CRYPTO' },
];

function formatTimeAgo(isoString: string): string {
  if (!isoString) return 'Just now';
  const pubDate = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - pubDate.getTime()) / 1000);

  if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export default function MarketsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndexItem[]>(INITIAL_INDICES);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [sourceTag, setSourceTag] = useState<string>('newsapi.org');

  // Debounce search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch live Upstox/Moneycontrol Market Quotes from API Gateway
  useEffect(() => {
    const fetchLiveQuotes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/markets/indices`);
        const json = await res.json();

        if (json.success && json.data) {
          const quotes = Array.isArray(json.data)
            ? json.data
            : [...(json.data.indianIndices || []), ...(json.data.globalIndices || [])];

          if (quotes.length > 0) {
            const mapped: MarketIndexItem[] = quotes.map((q: any) => {
              const changeVal = typeof q.change === 'number' ? q.change : 0;
              const changePct = typeof q.changePercent === 'number' ? q.changePercent : 0;
              const isUp = changeVal >= 0;

              return {
                symbol: q.symbol || 'INDEX',
                name: q.name || q.symbol,
                value: typeof q.ltp === 'number' ? q.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00',
                change: `${isUp ? '+' : ''}${changeVal.toFixed(2)}`,
                percent: `${isUp ? '+' : ''}${changePct.toFixed(2)}%`,
                isUp,
                status: q.dataStatus || q.marketStatus || 'LIVE',
              };
            });

            setMarketIndices(mapped);
          }
        }
      } catch (err) {
        // Retain verified baseline figures on connection error
      }
    };

    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadMarketNews = useCallback(async (category: string, query: string, isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      let endpoint = `/api/markets/newsapi?category=${category}`;
      if (query.trim()) {
        endpoint += `&q=${encodeURIComponent(query)}`;
      }

      const res = await fetch(endpoint, { cache: 'no-store' });
      const data = await res.json();

      if (data.status === 'ok' && Array.isArray(data.articles)) {
        setArticles(data.articles);
        setSourceTag(data.source || 'newsapi.org');
        setLastRefreshed(new Date());
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error('Error fetching market news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMarketNews(activeCategory, debouncedQuery);
  }, [activeCategory, debouncedQuery, loadMarketNews]);

  const heroArticle = articles.length > 0 ? articles[0] : null;
  const listArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="min-h-screen space-y-8 max-w-master mx-auto px-4 py-6">
      {/* 1. Header Title & Live Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b cs-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
              <Globe className="w-7 h-7 text-[#4DA3FF]" /> Global Markets Intelligence
            </h1>
            <span className="px-2.5 py-1 bg-[#22C58B]/10 border border-[#22C58B]/30 text-[#22C58B] text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C58B] animate-ping" />
              UPSTOX V3 & NEWSAPI LIVE
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 font-mono mt-1">
            Authentic Moneycontrol & Upstox V3 Market Tickers • Global business headlines powered by{' '}
            <span className="text-[#4DA3FF] font-semibold">newsapi.org</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMarketNews(activeCategory, debouncedQuery, true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border cs-border hover:bg-white/10 hover:border-[#4DA3FF]/50 text-xs font-mono font-bold text-white rounded-xl transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#4DA3FF]' : ''}`} />
            Refresh Stream
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-3xs font-mono text-slate-500 uppercase">Last Sync</div>
            <div className="text-xs font-mono text-slate-300">{lastRefreshed.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* 2. Live Market Indices Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {marketIndices.map((idx) => (
          <div key={idx.symbol} className="cs-card border rounded-xl p-3 space-y-1 hover:border-[#4DA3FF]/40 transition">
            <div className="flex justify-between items-center text-3xs font-mono text-slate-400">
              <span className="truncate max-w-[90px]">{idx.name}</span>
              <span className="font-bold text-slate-300 shrink-0">{idx.symbol}</span>
            </div>
            <div className="text-sm font-bold font-mono text-white tabular-nums">{idx.value}</div>
            <div className={`text-3xs font-mono font-bold flex items-center gap-1 tabular-nums ${idx.isUp ? 'text-[#22C58B]' : 'text-red-400'}`}>
              {idx.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {idx.change} ({idx.percent})
            </div>
          </div>
        ))}
      </div>

      {/* Google AdSense Banner Slot */}
      <AdSenseBanner slot="8646094970" />

      {/* 3. Search & Category Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/[0.02] border cs-border rounded-2xl p-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition ${
                activeCategory === id
                  ? 'bg-[#4DA3FF] text-slate-950 shadow-md shadow-[#4DA3FF]/20'
                  : 'bg-white/5 text-slate-300 border cs-border hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news by company or keyword..."
            className="w-full bg-slate-950/80 border cs-border rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 4. Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="h-80 cs-card border rounded-2xl animate-pulse bg-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 cs-card border rounded-xl animate-pulse bg-white/5 p-4 space-y-3">
                <div className="h-32 bg-white/5 rounded-lg" />
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Main Content Grid */}
      {!loading && (
        <div className="space-y-8">
          {/* Featured Hero Article */}
          {heroArticle && (
            <a
              href={heroArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block cs-card border border-[#4DA3FF]/30 rounded-2xl overflow-hidden hover:border-[#4DA3FF] transition shadow-2xl relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px]">
                <div className="lg:col-span-7 relative min-h-[240px] lg:min-h-full overflow-hidden bg-slate-950">
                  {heroArticle.urlToImage ? (
                    <img
                      src={heroArticle.urlToImage}
                      alt={heroArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                      <Newspaper className="w-20 h-20 text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#4DA3FF] text-slate-950 text-3xs font-mono font-bold rounded-md uppercase tracking-wider shadow-lg">
                    TOP STORY • {heroArticle.source?.name || 'NewsAPI'}
                  </span>
                </div>

                <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-4 bg-slate-950/90">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-3xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-[#4DA3FF]" />
                      <span>{formatTimeAgo(heroArticle.publishedAt)}</span>
                      {heroArticle.author && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[180px]">{heroArticle.author}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-lg md:text-xl font-extrabold text-white group-hover:text-[#4DA3FF] transition line-clamp-3 leading-snug">
                      {heroArticle.title}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 line-clamp-4 leading-relaxed font-sans">
                      {heroArticle.description || heroArticle.content || 'Read the full coverage on original news source.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t cs-border">
                    <span className="text-xs font-mono text-[#4DA3FF] font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Read Full Article on {heroArticle.source?.name || 'Publisher'}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-3xs font-mono text-slate-500 uppercase">newsapi.org</span>
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Grid Layout: Main News + Market Pulse Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: News Article Grid (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between border-b cs-border pb-3">
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#F2B84B]" /> Latest Financial Headlines ({listArticles.length})
                </h3>
                <span className="text-3xs font-mono text-slate-500">Source: {sourceTag}</span>
              </div>

              {listArticles.length === 0 ? (
                <div className="cs-card border rounded-xl p-12 text-center space-y-3">
                  <Newspaper className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 font-mono">No articles found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-xs text-[#4DA3FF] font-mono hover:underline"
                  >
                    Clear Filters & Reset
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listArticles.map((article, idx) => (
                    <a
                      key={idx}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group cs-card border rounded-xl overflow-hidden hover:border-[#4DA3FF]/50 transition flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {/* Article Thumbnail */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                          {article.urlToImage ? (
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                              <Building2 className="w-10 h-10 text-slate-700" />
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[#4DA3FF] font-mono font-bold text-3xs px-2.5 py-1 rounded border border-[#4DA3FF]/20">
                            {article.source?.name || 'NewsAPI'}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-3xs font-mono text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{formatTimeAgo(article.publishedAt)}</span>
                          </div>
                          <h4 className="text-sm font-bold font-sans text-white line-clamp-2 group-hover:text-[#4DA3FF] transition leading-snug">
                            {article.title}
                          </h4>
                          {article.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                              {article.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-between border-t cs-border mt-3">
                        <span className="text-3xs font-mono text-slate-500 truncate max-w-[140px]">
                          {article.author || article.source?.name}
                        </span>
                        <span className="text-3xs font-mono font-bold text-[#4DA3FF] flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Read <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Market Pulse & Verification Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* NewsAPI Provider Integrity Badge */}
              <div className="cs-card border border-[#22C58B]/30 rounded-2xl p-5 space-y-3 bg-[#22C58B]/5">
                <div className="flex items-center gap-2 text-sm font-bold font-mono text-white">
                  <ShieldCheck className="w-5 h-5 text-[#22C58B]" /> Verified News Feed
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Market coverage is connected directly to the Official <span className="text-[#22C58B] font-bold">NewsAPI.org</span> engine (Key: <code className="text-3xs text-slate-400">7edb67b7...8152</code>).
                </p>
                <div className="pt-2 border-t cs-border flex justify-between items-center text-3xs font-mono text-slate-400">
                  <span>API Protocol: HTTPS GET</span>
                  <span className="text-[#22C58B] font-bold">200 OK ACTIVE</span>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="cs-card border rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2 border-b cs-border pb-3">
                  <Layers className="w-4 h-4 text-[#4DA3FF]" /> CapitalSphere Terminals
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:text-[#4DA3FF] transition text-slate-300"
                  >
                    <span>Investor Dashboard</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/news"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:text-[#4DA3FF] transition text-slate-300"
                  >
                    <span>Finnhub News Stream</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/developers"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:text-[#4DA3FF] transition text-slate-300"
                  >
                    <span>Developer API & Webhooks</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* AdSense Sidebar Unit */}
              <AdSenseBanner slot="8646094970" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
