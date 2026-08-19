export type MarketStatus = 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'POST_MARKET';
export type DataStatus = 'LIVE' | 'DELAYED' | 'MARKET_CLOSED' | 'DATA_UNAVAILABLE';

export interface MarketTicker {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketStatus: MarketStatus;
  dataStatus: DataStatus;
  lastUpdated: string;
}

export interface StockQuote extends MarketTicker {
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
  marketCap: number; // in INR Crores or USD Billions
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  eps?: number;
  bookValue?: number;
  week52High: number;
  week52Low: number;
  sector: string;
  industry?: string;
  description?: string;
}

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  sma50?: number;
  sma200?: number;
  ema20?: number;
  rsi14?: number;
  macd?: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  vwap?: number;
  bollingerBands?: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export interface OptionStrike {
  strikePrice: number;
  calls: {
    ltp: number;
    change: number;
    changePercent: number;
    bid: number;
    ask: number;
    volume: number;
    oi: number;
    changeOI: number;
    iv: number;
    delta?: number;
    gamma?: number;
    theta?: number;
    vega?: number;
  };
  puts: {
    ltp: number;
    change: number;
    changePercent: number;
    bid: number;
    ask: number;
    volume: number;
    oi: number;
    changeOI: number;
    iv: number;
    delta?: number;
    gamma?: number;
    theta?: number;
    vega?: number;
  };
  isATM?: boolean;
}

export interface OptionChainMatrix {
  underlyingSymbol: string;
  underlyingPrice: number;
  expiryDate: string;
  strikes: OptionStrike[];
  pcr: number; // Put Call Ratio
  maxPain: number;
}

export interface IPOCard {
  id: string;
  slug: string;
  companyName: string;
  symbol?: string;
  logoUrl?: string;
  issueSize: string; // e.g. "₹2,500 Cr"
  priceBand: string; // e.g. "₹450 - ₹480"
  lotSize: number; // e.g. 30
  openDate: string;
  closeDate: string;
  listingDate?: string;
  status: 'UPCOMING' | 'OPEN' | 'CLOSED' | 'LISTED';
  gmp?: string; // Grey Market Premium
  subscriptionTimes?: number;
  summary?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | string[];
  featured_image: string;
  category_id: string;
  category_name?: string;
  author_id: string;
  author_name?: string;
  source_name: string;
  source_url: string;
  published_at: string;
  updated_at: string;
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'unpublished' | 'archived';
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  tags: string[];
  tickers: string[];
  reading_time: number;
  key_takeaways: string[];
  isResearch?: boolean;
  provenance?: {
    sourceProvider: string;
    originalPublishedAt: string;
    aiProcessed: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'EDITOR' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  symbols: string[];
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW';
  targetPrice: number;
  active: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  buyDate: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  flagEmoji: string;
  date: string;
  time: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface SystemHealthStatus {
  api: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  database: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  redis: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  webSocket: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  upstoxFeed: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  newsWorkers: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  lastChecked: string;
}
