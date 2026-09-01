'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  TrendingUp,
  TrendingDown,
  Flame,
  BarChart3,
  Globe,
  DollarSign,
  ShieldCheck,
  Zap,
  Star,
  Newspaper,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Sparkles
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

export default function CryptoHomepage() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [news, setNews] = useState<CryptoNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [watchlistSet, setWatchlistSet] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Load local watchlist items
    const savedWatchlist = localStorage.getItem('cs_crypto_watchlist');
    if (savedWatchlist) {
      try {
        setWatchlistSet(new Set(JSON.parse(savedWatchlist)));
      } catch (e) {}
    }

    fetchCryptoData();
  }, [activeCategory]);

  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Market Coins
      const res = await fetch('/api/crypto/markets');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCoins(json.data);
        if (json.status && json.status.includes('temporarily unavailable')) {
          setStatusMessage(json.status);
          setIsLive(false);
        } else {
          setIsLive(true);
        }
      }

      // 2. Fetch Crypto News
      const categoryParam = activeCategory === 'All' ? '' : activeCategory;
      const newsRes = await fetch(`/api/crypto/news?category=${encodeURIComponent(categoryParam)}`);
      const newsJson = await newsRes.json();
      if (newsJson.success && Array.isArray(newsJson.data)) {
        setNews(newsJson.data);
      }
    } catch (err) {
      setStatusMessage('Crypto market data temporarily unavailable.');
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (symbol: string) => {
    const next = new Set(watchlistSet);
    if (next.has(symbol)) {
      next.delete(symbol);
    } else {
      next.add(symbol);
    }
    setWatchlistSet(next);
    localStorage.setItem('cs_crypto_watchlist', JSON.stringify(Array.from(next)));
  };

  const filteredCoins = coins.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topGainers = [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const topLosers = [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, 5);
  const trendingCoins = [...coins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);

  const btc = coins.find(c => c.symbol === 'BTC') || coins[0];
  const eth = coins.find(c => c.symbol === 'ETH') || coins[1];

  const totalMarketCap = coins.reduce((acc, c) => acc + c.marketCap, 0);
  const totalVolume = coins.reduce((acc, c) => acc + c.volume24h, 0);
  const btcDominance = btc && totalMarketCap ? ((btc.marketCap / totalMarketCap) * 100).toFixed(1) : '52.4';
  const ethDominance = eth && totalMarketCap ? ((eth.marketCap / totalMarketCap) * 100).toFixed(1) : '17.2';

  const categories = ['All', 'Bitcoin', 'Ethereum', 'Altcoins', 'Blockchain', 'Web3', 'Regulation', 'Markets'];

  return (
    <div className="space-y-8">
        
        {/* Status Notice Banner if Offline */}
        {!isLive && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              {statusMessage || 'Crypto market data temporarily unavailable.'}
            </span>
            <button onClick={fetchCryptoData} className="text-3xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded font-bold transition">
              RETRY CONNECTION
            </button>
          </div>
        )}

        {/* 1. Crypto Intelligence Hero & Global Statistics */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b cs-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-3xs font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  🪙 CRYPTO TERMINAL
                </span>
                <span className="text-3xs font-mono cs-text-sub flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C58B] animate-ping"></span>
                  LIVE STREAM ACTIVE
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
                Cryptocurrency Intelligence & Market Terminal
              </h1>
              <p className="text-xs cs-text-sub max-w-2xl">
                Real-time price quotes, market capitalization rankings, liquidity statistics, technical analysis, and curated institutional crypto news.
              </p>
            </div>

            {/* Currency Switcher USD / INR */}
            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border cs-border self-start md:self-auto font-mono text-xs">
              <span className="text-3xs cs-text-sub font-bold px-2">CURRENCY:</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  currency === 'USD' ? 'bg-[#4DA3FF] text-slate-950 shadow-md' : 'cs-text-sub hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  currency === 'INR' ? 'bg-[#22C58B] text-slate-950 shadow-md' : 'cs-text-sub hover:text-white'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          {/* 2. Global Crypto Market Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="cs-card p-3.5 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">Global Market Cap</span>
              <div className="text-base font-extrabold text-white">
                {currency === 'USD' ? `$${(totalMarketCap / 1e12).toFixed(2)}T` : `₹${((totalMarketCap * 83.92) / 1e12).toFixed(2)}T`}
              </div>
              <span className="text-3xs text-[#22C58B] font-semibold">+1.85% (24H)</span>
            </div>

            <div className="cs-card p-3.5 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">24H Trading Volume</span>
              <div className="text-base font-extrabold text-white">
                {currency === 'USD' ? `$${(totalVolume / 1e9).toFixed(2)}B` : `₹${((totalVolume * 83.92) / 1e9).toFixed(2)}B`}
              </div>
              <span className="text-3xs cs-text-sub">Across top exchanges</span>
            </div>

            <div className="cs-card p-3.5 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">Bitcoin Dominance</span>
              <div className="text-base font-extrabold text-amber-400">
                {btcDominance}%
              </div>
              <span className="text-3xs cs-text-sub">ETH Dominance: {ethDominance}%</span>
            </div>

            <div className="cs-card p-3.5 rounded-xl border space-y-1">
              <span className="text-3xs cs-text-sub font-bold uppercase tracking-wider block">Fear & Greed Index</span>
              <div className="text-base font-extrabold text-[#22C58B]">
                68 <span className="text-3xs font-normal text-[#22C58B]">(Greed)</span>
              </div>
              <span className="text-3xs cs-text-sub">Market Sentiment</span>
            </div>
          </div>
        </section>

        {/* 3. Highlight Feature Cards: Bitcoin Overview & Ethereum Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {/* Bitcoin Highlight Card */}
          {btc && (
            <div className="cs-card p-5 rounded-2xl border relative overflow-hidden bg-gradient-to-br from-amber-500/5 via-transparent to-transparent">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={btc.logoUrl} alt={btc.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      {btc.name} <span className="text-xs cs-text-sub">({btc.symbol})</span>
                      <span className="text-3xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">#1</span>
                    </div>
                    <div className="text-xs cs-text-sub">The Benchmark Crypto Asset</div>
                  </div>
                </div>
                <Link
                  href={`/crypto/${btc.slug}`}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-3xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  VIEW BITCOIN <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t cs-border text-xs">
                <div>
                  <span className="text-3xs cs-text-sub block">Price</span>
                  <div className="text-lg font-extrabold text-white">
                    {currency === 'USD' ? `$${btc.price.toLocaleString()}` : `₹${btc.priceInr.toLocaleString()}`}
                  </div>
                  <span className={`text-3xs font-bold ${btc.change24h >= 0 ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                    {btc.change24h >= 0 ? '+' : ''}{btc.change24h}% (24H)
                  </span>
                </div>
                <div>
                  <span className="text-3xs cs-text-sub block">Market Cap</span>
                  <div className="text-base font-bold text-white">
                    {currency === 'USD' ? `$${(btc.marketCap / 1e9).toFixed(1)}B` : `₹${((btc.marketCap * 83.92) / 1e9).toFixed(1)}B`}
                  </div>
                  <span className="text-3xs cs-text-sub">24H Vol: ${(btc.volume24h / 1e9).toFixed(1)}B</span>
                </div>
              </div>
            </div>
          )}

          {/* Ethereum Highlight Card */}
          {eth && (
            <div className="cs-card p-5 rounded-2xl border relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-transparent to-transparent">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={eth.logoUrl} alt={eth.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      {eth.name} <span className="text-xs cs-text-sub">({eth.symbol})</span>
                      <span className="text-3xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold">#2</span>
                    </div>
                    <div className="text-xs cs-text-sub">Smart Contract Ecosystem Standard</div>
                  </div>
                </div>
                <Link
                  href={`/crypto/${eth.slug}`}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-3xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  VIEW ETHEREUM <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t cs-border text-xs">
                <div>
                  <span className="text-3xs cs-text-sub block">Price</span>
                  <div className="text-lg font-extrabold text-white">
                    {currency === 'USD' ? `$${eth.price.toLocaleString()}` : `₹${eth.priceInr.toLocaleString()}`}
                  </div>
                  <span className={`text-3xs font-bold ${eth.change24h >= 0 ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                    {eth.change24h >= 0 ? '+' : ''}{eth.change24h}% (24H)
                  </span>
                </div>
                <div>
                  <span className="text-3xs cs-text-sub block">Market Cap</span>
                  <div className="text-base font-bold text-white">
                    {currency === 'USD' ? `$${(eth.marketCap / 1e9).toFixed(1)}B` : `₹${((eth.marketCap * 83.92) / 1e9).toFixed(1)}B`}
                  </div>
                  <span className="text-3xs cs-text-sub">24H Vol: ${(eth.volume24h / 1e9).toFixed(1)}B</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. Top Gainers, Top Losers, Trending Coins Quick Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
          {/* Top Gainers */}
          <div className="cs-card p-4 rounded-xl border space-y-3">
            <div className="flex items-center justify-between border-b cs-border pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#22C58B]" /> 📈 TOP GAINERS (24H)
              </span>
              <span className="text-3xs cs-text-sub">Highest % Gain</span>
            </div>
            <div className="space-y-2">
              {topGainers.map(coin => (
                <Link key={coin.id} href={`/crypto/${coin.slug}`} className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition text-xs">
                  <div className="flex items-center gap-2">
                    <img src={coin.logoUrl} alt={coin.symbol} className="w-5 h-5 rounded-full" />
                    <div>
                      <div className="font-bold text-white">{coin.name}</div>
                      <div className="text-3xs cs-text-sub">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{currency === 'USD' ? `$${coin.price}` : `₹${coin.priceInr}`}</div>
                    <div className="text-3xs font-bold text-[#22C58B]">+{coin.change24h}%</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="cs-card p-4 rounded-xl border space-y-3">
            <div className="flex items-center justify-between border-b cs-border pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-[#F05252]" /> 📉 TOP LOSERS (24H)
              </span>
              <span className="text-3xs cs-text-sub">Highest % Drop</span>
            </div>
            <div className="space-y-2">
              {topLosers.map(coin => (
                <Link key={coin.id} href={`/crypto/${coin.slug}`} className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition text-xs">
                  <div className="flex items-center gap-2">
                    <img src={coin.logoUrl} alt={coin.symbol} className="w-5 h-5 rounded-full" />
                    <div>
                      <div className="font-bold text-white">{coin.name}</div>
                      <div className="text-3xs cs-text-sub">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{currency === 'USD' ? `$${coin.price}` : `₹${coin.priceInr}`}</div>
                    <div className="text-3xs font-bold text-[#F05252]">{coin.change24h}%</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Coins */}
          <div className="cs-card p-4 rounded-xl border space-y-3">
            <div className="flex items-center justify-between border-b cs-border pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> 🔥 TRENDING COINS
              </span>
              <span className="text-3xs cs-text-sub">Highest Volume</span>
            </div>
            <div className="space-y-2">
              {trendingCoins.map(coin => (
                <Link key={coin.id} href={`/crypto/${coin.slug}`} className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition text-xs">
                  <div className="flex items-center gap-2">
                    <img src={coin.logoUrl} alt={coin.symbol} className="w-5 h-5 rounded-full" />
                    <div>
                      <div className="font-bold text-white">{coin.name}</div>
                      <div className="text-3xs cs-text-sub">Vol: ${(coin.volume24h / 1e9).toFixed(1)}B</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{currency === 'USD' ? `$${coin.price}` : `₹${coin.priceInr}`}</div>
                    <div className={`text-3xs font-bold ${coin.change24h >= 0 ? 'text-[#22C58B]' : 'text-[#F05252]'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Top Cryptocurrencies Market Rankings Table */}
        <section className="space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b cs-border pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4DA3FF]" />
              <h2 className="text-lg font-extrabold text-white">Top Cryptocurrency Market Rankings</h2>
            </div>

            {/* Table Search Bar */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 cs-text-sub absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter coin (e.g. BTC, Solana)..."
                className="w-full cs-card text-xs pl-9 pr-3 py-1.5 rounded-lg border focus:border-[#4DA3FF] focus:outline-none"
              />
            </div>
          </div>

          <div className="cs-card rounded-xl border overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-900/60 border-b cs-border text-3xs font-bold cs-text-sub uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">Watch</th>
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4 text-right">Price ({currency})</th>
                  <th className="py-3 px-4 text-right">24H Change</th>
                  <th className="py-3 px-4 text-right">24H High</th>
                  <th className="py-3 px-4 text-right">24H Low</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-right">24H Volume</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y cs-border font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center cs-text-sub">
                      Loading crypto market rankings...
                    </td>
                  </tr>
                ) : filteredCoins.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center cs-text-sub">
                      No cryptocurrencies match your query "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredCoins.map((coin) => {
                    const isStarred = watchlistSet.has(coin.symbol);
                    const isPositive = coin.change24h >= 0;

                    return (
                      <tr key={coin.id} className="hover:bg-slate-800/30 transition">
                        {/* Watchlist Star */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleWatchlist(coin.symbol)}
                            className="text-slate-500 hover:text-amber-400 transition"
                            title="Add to Watchlist"
                          >
                            <Star className={`w-4 h-4 ${isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                          </button>
                        </td>

                        {/* Rank */}
                        <td className="py-3 px-4 cs-text-sub font-bold">{coin.rank}</td>

                        {/* Name & Symbol */}
                        <td className="py-3 px-4">
                          <Link href={`/crypto/${coin.slug}`} className="flex items-center gap-2.5 group">
                            <img src={coin.logoUrl} alt={coin.name} className="w-6 h-6 rounded-full shrink-0" />
                            <div>
                              <div className="font-bold text-white group-hover:text-[#4DA3FF] transition flex items-center gap-1.5">
                                {coin.name}
                              </div>
                              <div className="text-3xs cs-text-sub">{coin.symbol}</div>
                            </div>
                          </Link>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 text-right font-extrabold text-white">
                          {currency === 'USD'
                            ? `$${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
                            : `₹${coin.priceInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </td>

                        {/* 24H Change */}
                        <td className="py-3 px-4 text-right font-bold">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-3xs border ${
                            isPositive
                              ? 'bg-[#22C58B]/10 text-[#22C58B] border-[#22C58B]/30'
                              : 'bg-[#F05252]/10 text-[#F05252] border-[#F05252]/30'
                          }`}>
                            {isPositive ? '+' : ''}{coin.change24h}%
                          </span>
                        </td>

                        {/* 24H High */}
                        <td className="py-3 px-4 text-right cs-text-sub">
                          {currency === 'USD' ? `$${coin.high24h.toLocaleString()}` : `₹${Math.round(coin.high24h * 83.92).toLocaleString()}`}
                        </td>

                        {/* 24H Low */}
                        <td className="py-3 px-4 text-right cs-text-sub">
                          {currency === 'USD' ? `$${coin.low24h.toLocaleString()}` : `₹${Math.round(coin.low24h * 83.92).toLocaleString()}`}
                        </td>

                        {/* Market Cap */}
                        <td className="py-3 px-4 text-right font-semibold text-white">
                          {currency === 'USD'
                            ? `$${(coin.marketCap / 1e9).toFixed(2)}B`
                            : `₹${((coin.marketCap * 83.92) / 1e9).toFixed(2)}B`}
                        </td>

                        {/* 24H Volume */}
                        <td className="py-3 px-4 text-right cs-text-sub">
                          {currency === 'USD'
                            ? `$${(coin.volume24h / 1e9).toFixed(2)}B`
                            : `₹${((coin.volume24h * 83.92) / 1e9).toFixed(2)}B`}
                        </td>

                        {/* Action Link */}
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/crypto/${coin.slug}`}
                            className="bg-[#4DA3FF]/10 hover:bg-[#4DA3FF]/20 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2.5 py-1 rounded text-3xs font-bold transition"
                          >
                            TRADE & CHART
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Crypto News Intelligence Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b cs-border pb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-extrabold text-white font-mono">🔥 Crypto News & Institutional Intelligence</h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold transition shrink-0 text-3xs uppercase ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'cs-card cs-text-sub hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map(article => (
              <div key={article.id} className="cs-card rounded-xl border overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition">
                {article.imageUrl && (
                  <div className="h-40 overflow-hidden relative">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-3xs font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {article.category}
                    </span>
                  </div>
                )}

                <div className="p-4 space-y-2 flex-grow">
                  <div className="flex justify-between items-center text-3xs font-mono cs-text-sub">
                    <span>Source: <strong className="text-slate-300">{article.source}</strong></span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs cs-text-sub line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="p-4 pt-0 border-t border-transparent">
                  <a
                    href={article.sourceUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-3xs font-mono font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    READ FULL ARTICLE <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
}
