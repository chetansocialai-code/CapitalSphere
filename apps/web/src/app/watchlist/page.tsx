'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  BarChart3,
  Star,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface CryptoWatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
}

export default function WatchlistPage() {
  const [cryptoWatchlist, setCryptoWatchlist] = useState<CryptoWatchlistItem[]>([]);
  const [stockWatchlist, setStockWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRYPTO' | 'STOCKS'>('ALL');

  useEffect(() => {
    loadWatchlists();
  }, []);

  const loadWatchlists = async () => {
    setLoading(true);
    try {
      // 1. Load Crypto Watchlist from localStorage / API
      const savedCrypto = localStorage.getItem('cs_crypto_watchlist');
      const symbols: string[] = savedCrypto ? JSON.parse(savedCrypto) : ['BTC', 'ETH', 'SOL'];

      // Fetch live market info for saved symbols
      const res = await fetch('/api/crypto/markets');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const filtered = json.data
          .filter((c: any) => symbols.includes(c.symbol))
          .map((c: any) => ({
            symbol: c.symbol,
            name: c.name,
            price: c.price,
            change24h: c.change24h,
            marketCap: c.marketCap,
            slug: c.slug,
            logoUrl: c.logoUrl
          }));
        setCryptoWatchlist(filtered);
      }

      // 2. Load Stock Watchlist
      const token = localStorage.getItem('cs_token');
      if (token) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
          const stockRes = await fetch(`${apiUrl}/api/v1/watchlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const stockJson = await stockRes.json();
          if (stockJson.success && Array.isArray(stockJson.data)) {
            setStockWatchlist(stockJson.data);
          }
        } catch (e) {}
      } else {
        // Fallback default stock watchlist
        setStockWatchlist([
          { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', ltp: 3012.4, changePercent: 1.25 },
          { symbol: 'TCS', name: 'Tata Consultancy Services', ltp: 4250.0, changePercent: -0.45 },
          { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', ltp: 1640.8, changePercent: 0.85 }
        ]);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const removeCryptoItem = (symbol: string) => {
    const nextList = cryptoWatchlist.filter(item => item.symbol !== symbol);
    setCryptoWatchlist(nextList);
    const symbols = nextList.map(i => i.symbol);
    localStorage.setItem('cs_crypto_watchlist', JSON.stringify(symbols));
  };

  return (
    <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b cs-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 text-3xs font-mono font-bold px-2 py-0.5 rounded uppercase">
                ⭐ USER WATCHLIST
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-mono mt-1">
              CapitalSphere Watchlist Terminal
            </h1>
            <p className="text-xs cs-text-sub">
              Monitor real-time prices, percentage movements, and market telemetry for your tracked equities and cryptocurrencies.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border cs-border font-mono text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition ${activeTab === 'ALL' ? 'bg-[#4DA3FF] text-slate-950' : 'cs-text-sub hover:text-white'}`}
            >
              ALL ASSETS
            </button>
            <button
              onClick={() => setActiveTab('CRYPTO')}
              className={`px-3 py-1 rounded-lg font-bold transition ${activeTab === 'CRYPTO' ? 'bg-amber-400 text-slate-950' : 'cs-text-sub hover:text-white'}`}
            >
              CRYPTO 🪙
            </button>
            <button
              onClick={() => setActiveTab('STOCKS')}
              className={`px-3 py-1 rounded-lg font-bold transition ${activeTab === 'STOCKS' ? 'bg-[#22C58B] text-slate-950' : 'cs-text-sub hover:text-white'}`}
            >
              STOCKS 📈
            </button>
          </div>
        </div>

        {/* Watchlist Content */}
        {(activeTab === 'ALL' || activeTab === 'CRYPTO') && (
          <section className="space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase">
                🪙 Cryptocurrencies ({cryptoWatchlist.length})
              </h2>
              <Link href="/crypto" className="text-3xs text-[#4DA3FF] font-bold hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> BROWSE MORE CRYPTO
              </Link>
            </div>

            <div className="cs-card rounded-xl border overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-900/60 border-b cs-border text-3xs font-bold cs-text-sub uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Asset</th>
                    <th className="py-2.5 px-4 text-right">Price (USD)</th>
                    <th className="py-2.5 px-4 text-right">24H Change</th>
                    <th className="py-2.5 px-4 text-right">Market Cap</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y cs-border">
                  {cryptoWatchlist.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center cs-text-sub">
                        No crypto assets in watchlist. Add coins from the <Link href="/crypto" className="text-amber-400 underline">Crypto Terminal</Link>.
                      </td>
                    </tr>
                  ) : (
                    cryptoWatchlist.map(item => (
                      <tr key={item.symbol} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white">
                          <Link href={`/crypto/${item.symbol.toLowerCase()}`} className="flex items-center gap-2 hover:text-[#4DA3FF]">
                            <img src={(item as any).logoUrl || 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'} alt={item.name} className="w-5 h-5 rounded-full" />
                            <span>{item.name} <span className="cs-text-sub text-3xs">({item.symbol})</span></span>
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-right font-extrabold text-white">${item.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold">
                          <span className={item.change24h >= 0 ? 'text-[#22C58B]' : 'text-[#F05252]'}>
                            {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right cs-text-sub">${(item.marketCap / 1e9).toFixed(2)}B</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => removeCryptoItem(item.symbol)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(activeTab === 'ALL' || activeTab === 'STOCKS') && (
          <section className="space-y-3 font-mono pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#22C58B] flex items-center gap-2 uppercase">
                📈 Equities & Stocks ({stockWatchlist.length})
              </h2>
              <Link href="/stocks" className="text-3xs text-[#4DA3FF] font-bold hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> BROWSE STOCKS
              </Link>
            </div>

            <div className="cs-card rounded-xl border overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-900/60 border-b cs-border text-3xs font-bold cs-text-sub uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Symbol</th>
                    <th className="py-2.5 px-4">Company</th>
                    <th className="py-2.5 px-4 text-right">LTP (₹)</th>
                    <th className="py-2.5 px-4 text-right">Change (%)</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y cs-border">
                  {stockWatchlist.map(stock => (
                    <tr key={stock.symbol} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-bold text-white">{stock.symbol}</td>
                      <td className="py-3 px-4 cs-text-sub">{stock.name || stock.symbol}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-white">₹{stock.ltp || stock.price || '3,012.40'}</td>
                      <td className="py-3 px-4 text-right font-bold">
                        <span className={(stock.changePercent || 0) >= 0 ? 'text-[#22C58B]' : 'text-[#F05252]'}>
                          {(stock.changePercent || 0) >= 0 ? '+' : ''}{stock.changePercent || '1.25'}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link href="/stocks" className="text-3xs bg-[#4DA3FF]/10 text-[#4DA3FF] border border-[#4DA3FF]/30 px-2 py-1 rounded font-bold">
                          VIEW QUOTE
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
    </div>
  );
}
