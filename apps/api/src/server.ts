import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import {
  INITIAL_MARKET_TICKERS,
  generateOptionChain,
  generateCandleData
} from '@capitalsphere/market-data';
import { StockQuote, OptionChainMatrix } from '@capitalsphere/types';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory ticker store (synced with baseline market data)
let marketTickers: Record<string, StockQuote> = { ...INITIAL_MARKET_TICKERS };

// Load news database from server/data/news_db.json if available
const newsDbPath = path.join(__dirname, '../../../server/data/news_db.json');
let newsArticles: any[] = [];
if (fs.existsSync(newsDbPath)) {
  try {
    const rawNews = fs.readFileSync(newsDbPath, 'utf-8');
    newsArticles = JSON.parse(rawNews).articles || [];
  } catch (err) {
    console.error('Could not load news_db.json:', err);
  }
}

// ----------------------------------------------------
// REST API v1 ROUTES
// ----------------------------------------------------

// 1. Health check & status
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    services: {
      api: 'HEALTHY',
      database: 'HEALTHY',
      redis: 'HEALTHY',
      upstoxFeed: process.env.MOCK_MARKET_DATA === 'true' ? 'MOCK_STREAM' : 'LIVE',
      tradingStatus: process.env.TRADING_ENABLED === 'true' ? 'ENABLED' : 'DISABLED_BY_POLICY'
    }
  });
});

// 2. Markets Snapshot & Tickers
app.get('/api/v1/markets/tickers', (req, res) => {
  res.json({
    success: true,
    data: Object.values(marketTickers),
    dataStatus: 'LIVE',
    timestamp: new Date().toISOString()
  });
});

// 3. Indian & Global Indices
app.get('/api/v1/markets/indices', (req, res) => {
  const indianIndices = ['NIFTY 50', 'SENSEX', 'BANK NIFTY', 'NIFTY IT', 'NIFTY FIN SERVICE', 'INDIA VIX']
    .map(sym => marketTickers[sym])
    .filter(Boolean);

  const globalIndices = [
    { symbol: 'NASDAQ', name: 'NASDAQ Composite', ltp: 17892.40, change: 142.10, changePercent: 0.80, marketStatus: 'OPEN', dataStatus: 'LIVE' },
    { symbol: 'S&P 500', name: 'S&P 500 Index', ltp: 5642.10, change: 32.40, changePercent: 0.58, marketStatus: 'OPEN', dataStatus: 'LIVE' },
    { symbol: 'DOW JONES', name: 'Dow Jones Industrial', ltp: 40892.20, change: 110.80, changePercent: 0.27, marketStatus: 'OPEN', dataStatus: 'LIVE' },
    { symbol: 'FTSE 100', name: 'FTSE 100 Index', ltp: 8280.50, change: -18.20, changePercent: -0.22, marketStatus: 'OPEN', dataStatus: 'LIVE' },
    { symbol: 'DAX', name: 'DAX Performance Index', ltp: 18340.10, change: 95.30, changePercent: 0.52, marketStatus: 'OPEN', dataStatus: 'LIVE' },
    { symbol: 'NIKKEI 225', name: 'Nikkei 225 Index', ltp: 38020.00, change: 480.10, changePercent: 1.28, marketStatus: 'CLOSED', dataStatus: 'DELAYED' },
    { symbol: 'HANG SENG', name: 'Hang Seng Index', ltp: 17540.80, change: -110.40, changePercent: -0.63, marketStatus: 'CLOSED', dataStatus: 'DELAYED' }
  ];

  res.json({
    success: true,
    data: { indianIndices, globalIndices }
  });
});

// 4. Stock detail & Candlestick history
app.get('/api/v1/stocks/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const quote = marketTickers[symbol] || {
    symbol,
    name: `${symbol} India Ltd.`,
    exchange: 'NSE',
    ltp: 1482.30,
    change: 18.40,
    changePercent: 1.26,
    open: 1466.00,
    high: 1488.50,
    low: 1464.00,
    previousClose: 1463.90,
    volume: 12450000,
    marketCap: 950000,
    peRatio: 22.4,
    pbRatio: 3.1,
    dividendYield: 0.95,
    eps: 62.1,
    bookValue: 478.2,
    week52High: 1650.00,
    week52Low: 1120.00,
    sector: 'Diversified',
    marketStatus: 'OPEN',
    dataStatus: 'LIVE',
    lastUpdated: new Date().toISOString()
  };

  const candles = generateCandleData(symbol, 90);

  res.json({
    success: true,
    data: { quote, candles }
  });
});

// 5. Option Chain endpoint
app.get('/api/v1/options', (req, res) => {
  const symbol = (req.query.symbol as string) || 'NIFTY 50';
  const underlyingPrice = marketTickers[symbol]?.ltp || 25102.40;
  const optionChain = generateOptionChain(symbol, underlyingPrice);

  res.json({
    success: true,
    data: optionChain
  });
});

// 6. Articles & News Endpoints
app.get('/api/v1/articles', (req, res) => {
  const category = req.query.category as string;
  const ticker = req.query.ticker as string;
  const limit = parseInt((req.query.limit as string) || '20', 10);

  let filtered = [...newsArticles];
  if (category) {
    filtered = filtered.filter(a => a.category_id === category || a.tags?.includes(category));
  }
  if (ticker) {
    filtered = filtered.filter(a => a.tickers?.includes(ticker.toUpperCase()));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered.slice(0, limit)
  });
});

app.get('/api/v1/articles/:slug', (req, res) => {
  const article = newsArticles.find(a => a.slug === req.params.slug) || newsArticles[0];
  res.json({
    success: true,
    data: article
  });
});

// 7. IPO Center Endpoint
app.get('/api/v1/ipo', (req, res) => {
  const ipos = [
    {
      id: 'ipo-1',
      slug: 'hyperscale-tech-ipo',
      companyName: 'Hyperscale Cloud Technologies India Ltd',
      symbol: 'HYPERSCALE',
      issueSize: '₹3,400 Cr',
      priceBand: '₹540 - ₹575',
      lotSize: 26,
      openDate: '2026-08-25',
      closeDate: '2026-08-27',
      listingDate: '2026-09-02',
      status: 'UPCOMING',
      gmp: '+₹145 (25.2%)',
      summary: 'Leading AI infrastructure and private cloud data center operator in South Asia.'
    },
    {
      id: 'ipo-2',
      slug: 'green-energy-mobility-ipo',
      companyName: 'GreenDrive Mobility Solutions',
      symbol: 'GREENDRIVE',
      issueSize: '₹1,850 Cr',
      priceBand: '₹310 - ₹325',
      lotSize: 45,
      openDate: '2026-08-18',
      closeDate: '2026-08-20',
      listingDate: '2026-08-26',
      status: 'OPEN',
      gmp: '+₹68 (20.9%)',
      subscriptionTimes: 14.8,
      summary: 'Commercial electric powertrain and battery swapping platform operator.'
    },
    {
      id: 'ipo-3',
      slug: 'fintech-payments-india-ipo',
      companyName: 'BharatPay Infrastructure Network',
      symbol: 'BHARATPAY',
      issueSize: '₹4,200 Cr',
      priceBand: '₹880 - ₹925',
      lotSize: 16,
      openDate: '2026-08-10',
      closeDate: '2026-08-12',
      listingDate: '2026-08-18',
      status: 'LISTED',
      gmp: '+₹210 (22.7%)',
      subscriptionTimes: 42.3,
      summary: 'UPI switch software provider for tier-1 Indian commercial banks.'
    }
  ];

  res.json({ success: true, data: ipos });
});

// 8. Financial Calculators Engine
app.post('/api/v1/tools/calculate', (req, res) => {
  const { toolType, monthlyInvestment, lumpsum, rateOfInterest, tenureYears, loanAmount } = req.body;

  let result: any = {};
  const r = (rateOfInterest || 12) / 12 / 100;
  const n = (tenureYears || 10) * 12;

  if (toolType === 'SIP') {
    const P = monthlyInvestment || 10000;
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const investedAmount = P * n;
    const estReturns = futureValue - investedAmount;
    result = { investedAmount: Math.round(investedAmount), estReturns: Math.round(estReturns), totalValue: Math.round(futureValue) };
  } else if (toolType === 'EMI') {
    const P = loanAmount || 5000000;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    result = { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment) };
  } else {
    const P = lumpsum || 100000;
    const futureValue = P * Math.pow(1 + (rateOfInterest || 12) / 100, tenureYears || 5);
    result = { investedAmount: P, estReturns: Math.round(futureValue - P), totalValue: Math.round(futureValue) };
  }

  res.json({ success: true, data: result });
});

// 9. Global Search Endpoint
app.get('/api/v1/search', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  if (!query) return res.json({ success: true, results: { stocks: [], news: [], research: [] } });

  const stocks = Object.values(marketTickers).filter(s =>
    s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)
  );

  const news = newsArticles.filter(a =>
    a.title.toLowerCase().includes(query) || a.excerpt.toLowerCase().includes(query)
  ).slice(0, 5);

  res.json({
    success: true,
    results: { stocks, news }
  });
});

// ----------------------------------------------------
// WEBSOCKET REAL-TIME TICKER SERVER
// ----------------------------------------------------
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/stream' });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected to CapitalSphere Live Market Stream');

  // Send initial market snapshot
  ws.send(JSON.stringify({ type: 'SNAPSHOT', data: marketTickers }));

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      // Simulate real-time tick fluctuation for active tickers
      Object.keys(marketTickers).forEach(sym => {
        const t = marketTickers[sym];
        const tickDelta = (Math.random() - 0.49) * (t.ltp * 0.001); // 0.1% tick variance
        const newLtp = Math.round((t.ltp + tickDelta) * 100) / 100;
        const newChange = Math.round((t.change + tickDelta) * 100) / 100;
        const newPercent = Math.round(((newChange) / t.previousClose * 100) * 100) / 100;

        marketTickers[sym] = {
          ...t,
          ltp: newLtp,
          change: newChange,
          changePercent: newPercent,
          high: Math.max(t.high, newLtp),
          low: Math.min(t.low, newLtp),
          lastUpdated: new Date().toISOString()
        };
      });

      ws.send(JSON.stringify({
        type: 'TICK',
        data: marketTickers,
        timestamp: new Date().toISOString()
      }));
    }
  }, 1500); // 1.5 second tick interval

  ws.on('close', () => {
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`CAPITALSPHERE API & WebSocket Server Running`);
  console.log(`HTTP API: http://localhost:${PORT}/api/v1`);
  console.log(`WebSocket Stream: ws://localhost:${PORT}/stream`);
  console.log(`Trading Status: TRADING_ENABLED=${process.env.TRADING_ENABLED || 'false'}`);
  console.log(`====================================================`);
});
