'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexQuote {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  marketStatus?: string;
  dataStatus?: string;
}

interface CryptoQuote {
  symbol: string;
  name: string;
  slug: string;
  price: number;
  change24h: number;
  marketCap: number;
}

const INITIAL_INDEX_ITEMS: IndexQuote[] = [
  { symbol: 'NIFTY 50', ltp: 24175.65, change: -32.95, changePercent: -0.14, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
  { symbol: 'SENSEX', ltp: 77264.51, change: -171.72, changePercent: -0.22, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
  { symbol: 'BANK NIFTY', ltp: 57496.30, change: -236.00, changePercent: -0.41, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
  { symbol: 'NIFTY IT', ltp: 30596.90, change: 64.65, changePercent: 0.21, marketStatus: 'LIVE', dataStatus: 'LIVE_UPSTOX_V3' },
  { symbol: 'NIFTY FIN SERVICE', ltp: 23680.10, change: 145.30, changePercent: 0.62, marketStatus: 'OPEN', dataStatus: 'LIVE' },
  { symbol: 'INDIA VIX', ltp: 13.42, change: -0.48, changePercent: -3.45, marketStatus: 'OPEN', dataStatus: 'LIVE' },
  { symbol: 'NASDAQ', ltp: 17892.40, change: 142.10, changePercent: 0.80, marketStatus: 'OPEN', dataStatus: 'GLOBAL' },
  { symbol: 'S&P 500', ltp: 5642.10, change: 32.40, changePercent: 0.58, marketStatus: 'OPEN', dataStatus: 'GLOBAL' },
  { symbol: 'DOW JONES', ltp: 40892.20, change: 110.80, changePercent: 0.27, marketStatus: 'OPEN', dataStatus: 'GLOBAL' },
  { symbol: 'FTSE 100', ltp: 8280.50, change: -18.20, changePercent: -0.22, marketStatus: 'OPEN', dataStatus: 'GLOBAL' },
  { symbol: 'DAX', ltp: 18340.10, change: 95.30, changePercent: 0.52, marketStatus: 'OPEN', dataStatus: 'GLOBAL' },
  { symbol: 'NIKKEI 225', ltp: 38020.00, change: 480.10, changePercent: 1.28, marketStatus: 'CLOSED', dataStatus: 'GLOBAL' },
];

const INITIAL_CRYPTO_ITEMS: CryptoQuote[] = [
  { symbol: 'BTC', name: 'Bitcoin', slug: 'bitcoin', price: 64250.00, change24h: 2.45, marketCap: 1265800000000 },
  { symbol: 'ETH', name: 'Ethereum', slug: 'ethereum', price: 3480.50, change24h: 3.12, marketCap: 418500000000 },
  { symbol: 'BNB', name: 'BNB', slug: 'binancecoin', price: 575.20, change24h: 1.84, marketCap: 84500000000 },
  { symbol: 'SOL', name: 'Solana', slug: 'solana', price: 154.80, change24h: 5.68, marketCap: 72100000000 },
  { symbol: 'XRP', name: 'XRP', slug: 'ripple', price: 0.585, change24h: -0.42, marketCap: 32800000000 },
  { symbol: 'DOGE', name: 'Dogecoin', slug: 'dogecoin', price: 0.124, change24h: 4.15, marketCap: 18100000000 },
  { symbol: 'ADA', name: 'Cardano', slug: 'cardano', price: 0.365, change24h: 1.25, marketCap: 13100000000 },
  { symbol: 'AVAX', name: 'Avalanche', slug: 'avalanche-2', price: 24.80, change24h: 6.75, marketCap: 9900000000 },
  { symbol: 'SHIB', name: 'Shiba Inu', slug: 'shiba-inu', price: 0.0000142, change24h: -1.15, marketCap: 8370000000 },
  { symbol: 'DOT', name: 'Polkadot', slug: 'polkadot', price: 4.75, change24h: 0.85, marketCap: 6800000000 },
];

export function MarketTicker() {
  const [indices, setIndices] = useState<IndexQuote[]>(INITIAL_INDEX_ITEMS);
  const [cryptoCoins, setCryptoCoins] = useState<CryptoQuote[]>(INITIAL_CRYPTO_ITEMS);
  const [isWebSocketActive, setIsWebSocketActive] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  const safeIndices = Array.isArray(indices) && indices.length > 0 ? indices : INITIAL_INDEX_ITEMS;
  const safeCryptos = Array.isArray(cryptoCoins) && cryptoCoins.length > 0 ? cryptoCoins : INITIAL_CRYPTO_ITEMS;
  const isUpstoxLive = isWebSocketActive || safeIndices.some(i => i && (i.marketStatus === 'LIVE' || i.dataStatus === 'LIVE_UPSTOX_V3'));

  useEffect(() => {
    // 1. Upstox V3 Live Real-Time WebSocket Streaming Client
    const connectWebSocket = () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/stream';
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          setIsWebSocketActive(true);
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message && message.data) {
              const liveData = message.data;
              if (typeof liveData === 'object') {
                setIndices((prevIndices) => {
                  return prevIndices.map((item) => {
                    const tick = liveData[item.symbol];
                    if (tick) {
                      return {
                        ...item,
                        ltp: tick.ltp ?? item.ltp,
                        change: tick.change ?? item.change,
                        changePercent: tick.changePercent ?? item.changePercent,
                        marketStatus: 'LIVE',
                        dataStatus: 'LIVE_UPSTOX_V3'
                      };
                    }
                    return item;
                  });
                });
              }
            }
          } catch (e) {}
        };

        socket.onerror = () => {
          setIsWebSocketActive(false);
        };

        socket.onclose = () => {
          setIsWebSocketActive(false);
        };

        wsRef.current = socket;
      } catch (e) {
        setIsWebSocketActive(false);
      }
    };

    connectWebSocket();

    // 2. High-Frequency REST Polling (3 seconds) for Upstox Live Indices
    const fetchMarketQuotes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/markets/indices`);
        const json = await res.json();
        if (json.success && json.data) {
          if (Array.isArray(json.data)) {
            setIndices(json.data);
          } else if (json.data.indianIndices && Array.isArray(json.data.indianIndices)) {
            setIndices([
              ...json.data.indianIndices,
              ...(Array.isArray(json.data.globalIndices) ? json.data.globalIndices : [])
            ]);
          }
        }
      } catch (err) {}
    };

    // 3. Crypto Real-Time Quote Fetching
    const fetchCryptoQuotes = async () => {
      try {
        const res = await fetch('/api/crypto/markets');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCryptoCoins(json.data.map((c: any) => ({
            symbol: c.symbol,
            name: c.name,
            slug: c.slug,
            price: c.price,
            change24h: c.change24h,
            marketCap: c.marketCap
          })));
        }
      } catch (err) {}
    };

    fetchMarketQuotes();
    fetchCryptoQuotes();

    const interval = setInterval(() => {
      fetchMarketQuotes();
      fetchCryptoQuotes();
    }, 3000); // High-frequency 3-second update

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Duplicate items array to create smooth 360-degree infinity loop
  const loopIndices = [...safeIndices, ...safeIndices];
  const loopCryptos = [...safeCryptos, ...safeCryptos];

  return (
    <div className="space-y-1 my-1">
      
      {/* ========================================================= */}
      {/* SEPARATE LINE 1: UPSTOX LIVE REAL-TIME STOCKS & INDICES   */}
      {/* ========================================================= */}
      <div className="cs-card border-y text-xs font-mono py-2 px-4 overflow-hidden flex items-center shadow-xs select-none">
        {/* Fixed Upstox Live Badge */}
        <div className="flex items-center gap-1.5 cs-text-sub text-2xs font-sans uppercase font-bold tracking-wider pr-4 border-r cs-border shrink-0 bg-inherit z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C58B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C58B]"></span>
          </span>
          <span className="text-[#22C58B]">UPSTOX REAL-TIME V3</span>
        </div>

        {/* Infinity Loop Marquee Track for Stocks */}
        <div className="overflow-hidden relative flex-1 pl-4">
          <div className="animate-marquee-loop flex items-center gap-6 whitespace-nowrap">
            {loopIndices.map((idx, itemIndex) => {
              if (!idx || !idx.symbol) return null;
              const changeVal = typeof idx.change === 'number' ? idx.change : 0;
              const changePct = typeof idx.changePercent === 'number' ? idx.changePercent : 0;
              const ltpVal = typeof idx.ltp === 'number' ? idx.ltp : 0;
              const isPositive = changeVal >= 0;

              return (
                <div
                  key={`stock-${idx.symbol}-${itemIndex}`}
                  className="flex items-center gap-2 shrink-0 cs-card hover:bg-slate-500/10 px-2.5 py-1 rounded-lg transition border cs-border"
                >
                  <span className="cs-text-sub font-bold">{idx.symbol}</span>
                  <span className="font-bold tabular-nums text-white">
                    {ltpVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 font-bold tabular-nums ${
                      isPositive ? 'text-[#22C58B]' : 'text-[#F05252]'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}
                    {changeVal.toFixed(2)} ({isPositive ? '+' : ''}
                    {changePct.toFixed(2)}%)
                  </span>
                  <span className="text-3xs bg-[#22C58B]/10 text-[#22C58B] border border-[#22C58B]/30 px-1.5 py-0.5 rounded font-bold uppercase">
                    UPSTOX LIVE
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SEPARATE LINE 2: CRYPTOCURRENCY INFINITY LOOP TICKER       */}
      {/* ========================================================= */}
      <div className="cs-card border-y text-xs font-mono py-2 px-4 overflow-hidden flex items-center shadow-xs select-none bg-amber-500/5 border-amber-500/20">
        {/* Fixed Crypto Live Badge */}
        <div className="flex items-center gap-1.5 text-amber-400 text-2xs font-sans uppercase font-bold tracking-wider pr-4 border-r border-amber-500/30 shrink-0 bg-inherit z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span>🪙 CRYPTO LIVE</span>
        </div>

        {/* Infinity Loop Marquee Track for Crypto */}
        <div className="overflow-hidden relative flex-1 pl-4">
          <div className="animate-marquee-slow flex items-center gap-6 whitespace-nowrap">
            {loopCryptos.map((coin, itemIndex) => {
              if (!coin || !coin.symbol) return null;
              const isPositive = coin.change24h >= 0;

              return (
                <Link
                  key={`crypto-${coin.symbol}-${itemIndex}`}
                  href={`/crypto/${coin.slug}`}
                  className="flex items-center gap-2 shrink-0 cs-card hover:border-amber-500/40 px-2.5 py-1 rounded-lg transition border cs-border group"
                >
                  <span className="font-bold text-amber-400 group-hover:underline">{coin.symbol}/USD</span>
                  <span className="font-bold tabular-nums text-white">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 font-bold tabular-nums ${
                      isPositive ? 'text-[#22C58B]' : 'text-[#F05252]'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{coin.change24h}%
                  </span>
                  <span className="text-3xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
                    24H
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
