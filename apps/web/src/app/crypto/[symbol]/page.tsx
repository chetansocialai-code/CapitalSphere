'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CryptoChart } from '@/components/CryptoChart';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Star,
  Globe,
  Share2,
  Newspaper,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Flame,
  Layers
} from 'lucide-react';

interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  slug: string;
  logoUrl: string;
  rank: number;
  price: number;
  priceInr: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number;
  atl: number;
  lastUpdated: string;
}

interface CryptoNewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  source: string;
  sourceUrl?: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
}

export default function CoinDetailPage({ params }: { params: { symbol: string } }) {
  const [coin, setCoin] = useState<CryptoCoin | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [news, setNews] = useState<CryptoNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('24H');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [isStarred, setIsStarred] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    fetchCoinDetails();
  }, [params.symbol, timeframe]);

  const fetchCoinDetails = async () => {
    setLoading(true);
    try {
      // Fetch Coin Info
      const res = await fetch(`/api/crypto/${params.symbol}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCoin(json.data);

        // Check local watchlist
        const savedWatchlist = localStorage.getItem('cs_crypto_watchlist');
        if (savedWatchlist) {
          try {
            const set: string[] = JSON.parse(savedWatchlist);
            setIsStarred(set.includes(json.data.symbol));
          } catch (e) {}
        }
      } else {
        setStatusMessage(json.error || 'Cryptocurrency not found.');
      }

      // Fetch History Chart Data
      const histRes = await fetch(`/api/crypto/${params.symbol}/history?timeframe=${timeframe}`);
      const histJson = await histRes.json();
      if (histJson.success && histJson.data && Array.isArray(histJson.data.history)) {
        setHistory(histJson.data.history);
      }

      // Fetch Related News
      const newsRes = await fetch('/api/crypto/news');
      const newsJson = await newsRes.json();
      if (newsJson.success && Array.isArray(newsJson.data)) {
        setNews(newsJson.data.slice(0, 3));
      }
    } catch (err: any) {
      setStatusMessage('Crypto market data temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = () => {
    if (!coin) return;
    const savedWatchlist = localStorage.getItem('cs_crypto_watchlist');
    let list: string[] = [];
    if (savedWatchlist) {
      try {
        list = JSON.parse(savedWatchlist);
      } catch (e) {}
    }

    if (list.includes(coin.symbol)) {
      list = list.filter(s => s !== coin.symbol);
      setIsStarred(false);
    } else {
      list.push(coin.symbol);
      setIsStarred(true);
    }

    localStorage.setItem('cs_crypto_watchlist', JSON.stringify(list));
  };

  if (loading && !coin) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
        <Header />
        <main className="flex-grow max-w-master mx-auto w-full px-4 py-12 text-center font-mono cs-text-sub">
          Loading cryptocurrency market data...
        </main>
        <Footer />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
        <Header />
        <main className="flex-grow max-w-master mx-auto w-full px-4 py-12 space-y-4 text-center font-mono">
          <div className="text-xl font-bold text-rose-400">Cryptocurrency Not Found</div>
          <p className="text-xs cs-text-sub max-w-md mx-auto">
            {statusMessage || `We could not locate market telemetry for '${params.symbol}'.`}
          </p>
          <Link href="/crypto" className="inline-flex items-center gap-2 bg-[#4DA3FF] text-slate-950 px-4 py-2 rounded-lg font-bold text-xs transition">
            <ArrowLeft className="w-4 h-4" /> RETURN TO CRYPTO MARKET DASHBOARD
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isPositive = coin.change24h >= 0;
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const displayPrice = currency === 'USD' ? coin.price : coin.priceInr;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-[#4DA3FF] selection:text-slate-950">
      <Header />

      <main className="flex-grow max-w-master mx-auto w-full px-4 py-6 space-y-6">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between font-mono text-xs border-b cs-border pb-3">
          <Link href="/crypto" className="cs-text-sub hover:text-white flex items-center gap-1.5 transition">
            <ArrowLeft className="w-4 h-4 text-[#4DA3FF]" /> BACK TO CRYPTO DASHBOARD
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-3xs cs-text-sub font-bold">CURRENCY:</span>
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
              className="bg-slate-900 border cs-border px-2.5 py-1 rounded text-3xs font-bold text-amber-400 hover:border-amber-400 transition"
            >
              TOGGLE TO {currency === 'USD' ? 'INR (₹)' : 'USD ($)'}
            </button>
          </div>
        </div>

        {/* 1. Header Banner: Coin Identity, Live Price, 24H Change */}
        <section className="cs-card p-6 rounded-2xl border space-y-6 font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Identity */}
            <div className="flex items-center gap-4">
              <img src={coin.logoUrl} alt={coin.name} className="w-14 h-14 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">{coin.name}</h1>
                  <span className="text-sm cs-text-sub font-bold">({coin.symbol})</span>
                  <span className="text-3xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase">
                    RANK #{coin.rank}
                  </span>
                </div>
                <div className="text-3xs cs-text-sub flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[#22C58B] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#22C58B] animate-ping"></span> LIVE MARKET TELEMETRY
                  </span>
                  <span>•</span>
                  <span>Updated: {new Date(coin.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="flex items-center gap-4 self-start md:self-auto">
              <div className="text-right">
                <div className="text-3xs cs-text-sub uppercase font-bold">LIVE PRICE ({currency})</div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  {currencySymbol}{displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </div>
                <div className={`text-xs font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isPositive ? '+' : ''}{coin.change24h}% (24H)
                </div>
              </div>

              {/* Watchlist Toggle Button */}
              <button
                onClick={toggleWatchlist}
                className={`p-3 rounded-xl border font-bold transition flex items-center gap-2 text-xs ${
                  isStarred
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'cs-card border-slate-700 text-slate-300 hover:border-amber-400'
                }`}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isStarred ? 'WATCHED' : 'ADD WATCHLIST'}</span>
              </button>
            </div>
          </div>

          {/* 2. Interactive Price Chart */}
          <div className="pt-4 border-t cs-border">
            <CryptoChart
              symbol={coin.symbol}
              history={history}
              timeframe={timeframe}
              onTimeframeChange={(tf) => setTimeframe(tf)}
              currencySymbol={currencySymbol}
              change24h={coin.change24h}
            />
          </div>
        </section>

        {/* 3. Comprehensive Market Statistics Grid */}
        <section className="space-y-4 font-mono">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b cs-border pb-2">
            <BarChart3 className="w-5 h-5 text-[#4DA3FF]" /> Market Statistics & Tokenomics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            
            {/* Market Cap */}
            <div className="cs-card p-4 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">Market Capitalization</span>
              <div className="text-base font-extrabold text-white">
                {currencySymbol}{currency === 'USD' ? (coin.marketCap / 1e9).toFixed(2) + 'B' : ((coin.marketCap * 83.92) / 1e9).toFixed(2) + 'B'}
              </div>
              <span className="text-3xs cs-text-sub">Global Market Rank #{coin.rank}</span>
            </div>

            {/* 24H Volume */}
            <div className="cs-card p-4 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">24H Trading Volume</span>
              <div className="text-base font-extrabold text-white">
                {currencySymbol}{currency === 'USD' ? (coin.volume24h / 1e9).toFixed(2) + 'B' : ((coin.volume24h * 83.92) / 1e9).toFixed(2) + 'B'}
              </div>
              <span className="text-3xs cs-text-sub">Volume/MCap: {(coin.volume24h / coin.marketCap).toFixed(3)}</span>
            </div>

            {/* Circulating Supply */}
            <div className="cs-card p-4 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">Circulating Supply</span>
              <div className="text-base font-extrabold text-amber-400">
                {coin.circulatingSupply.toLocaleString()} {coin.symbol}
              </div>
              <span className="text-3xs cs-text-sub">Active Coins in Market</span>
            </div>

            {/* Max Supply */}
            <div className="cs-card p-4 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">Max / Total Supply</span>
              <div className="text-base font-extrabold text-white">
                {coin.maxSupply ? `${coin.maxSupply.toLocaleString()} ${coin.symbol}` : 'Infinite / Uncapped'}
              </div>
              <span className="text-3xs cs-text-sub">Programmatic Supply Cap</span>
            </div>

            {/* 24H High / Low */}
            <div className="cs-card p-4 rounded-xl border space-y-1 col-span-2">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">24H High / Low Range</span>
              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <span className="text-[#F05252]">Low: {currencySymbol}{currency === 'USD' ? coin.low24h.toLocaleString() : Math.round(coin.low24h * 83.92).toLocaleString()}</span>
                <span className="text-[#22C58B]">High: {currencySymbol}{currency === 'USD' ? coin.high24h.toLocaleString() : Math.round(coin.high24h * 83.92).toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative mt-1">
                <div className="h-full bg-gradient-to-r from-[#F05252] via-amber-400 to-[#22C58B] w-full"></div>
              </div>
            </div>

            {/* All-Time High */}
            <div className="cs-card p-4 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">All-Time High (ATH)</span>
              <div className="text-base font-extrabold text-emerald-400">
                {currencySymbol}{currency === 'USD' ? coin.ath.toLocaleString() : Math.round(coin.ath * 83.92).toLocaleString()}
              </div>
              <span className="text-3xs text-[#F05252] font-semibold">
                {(((coin.price - coin.ath) / coin.ath) * 100).toFixed(1)}% from ATH
              </span>
            </div>

            {/* All-Time Low */}
            <div className="cs-card p-4 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">All-Time Low (ATL)</span>
              <div className="text-base font-extrabold text-rose-400">
                {currencySymbol}{currency === 'USD' ? coin.atl : (coin.atl * 83.92).toFixed(4)}
              </div>
              <span className="text-3xs text-[#22C58B] font-semibold">
                +{(coin.price / (coin.atl || 1) * 100).toFixed(0)}% from ATL
              </span>
            </div>
          </div>
        </section>

        {/* 4. Latest News Related to Asset */}
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b cs-border pb-2 font-mono">
            <Newspaper className="w-5 h-5 text-amber-400" /> Latest {coin.name} & Crypto Market News
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map(article => (
              <div key={article.id} className="cs-card p-4 rounded-xl border space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-3xs font-mono cs-text-sub mb-1">
                    <span className="text-amber-400 font-bold uppercase">{article.category}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2">{article.title}</h3>
                  <p className="text-3xs cs-text-sub line-clamp-3 mt-1">{article.summary}</p>
                </div>
                <a
                  href={article.sourceUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-3xs font-mono font-bold text-[#4DA3FF] hover:underline inline-flex items-center gap-1 pt-2 border-t cs-border"
                >
                  READ ON {article.source} <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
