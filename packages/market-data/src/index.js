"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_MARKET_TICKERS = void 0;
exports.calculateOptionGreeks = calculateOptionGreeks;
exports.generateOptionChain = generateOptionChain;
exports.generateCandleData = generateCandleData;
// Initial baseline market indexes and stock prices
exports.INITIAL_MARKET_TICKERS = {
    'NIFTY 50': {
        symbol: 'NIFTY 50',
        name: 'NIFTY 50 Index',
        exchange: 'NSE',
        ltp: 25102.40,
        change: 204.15,
        changePercent: 0.82,
        open: 24920.00,
        high: 25145.80,
        low: 24890.10,
        previousClose: 24898.25,
        volume: 384500000,
        marketCap: 0,
        week52High: 26277.35,
        week52Low: 21281.45,
        sector: 'Indices',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'SENSEX': {
        symbol: 'SENSEX',
        name: 'BSE SENSEX Index',
        exchange: 'BSE',
        ltp: 82430.50,
        change: 581.20,
        changePercent: 0.71,
        open: 81900.00,
        high: 82510.00,
        low: 81820.00,
        previousClose: 81849.30,
        volume: 245000000,
        marketCap: 0,
        week52High: 85978.25,
        week52Low: 70302.40,
        sector: 'Indices',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'BANK NIFTY': {
        symbol: 'BANK NIFTY',
        name: 'NIFTY Bank Index',
        exchange: 'NSE',
        ltp: 51840.20,
        change: 340.80,
        changePercent: 0.66,
        open: 51550.00,
        high: 51920.00,
        low: 51480.00,
        previousClose: 51499.40,
        volume: 195000000,
        marketCap: 0,
        week52High: 54467.35,
        week52Low: 43578.10,
        sector: 'Indices',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'NIFTY IT': {
        symbol: 'NIFTY IT',
        name: 'NIFTY IT Index',
        exchange: 'NSE',
        ltp: 42150.80,
        change: 512.40,
        changePercent: 1.23,
        open: 41680.00,
        high: 42200.00,
        low: 41650.00,
        previousClose: 41638.40,
        volume: 85000000,
        marketCap: 0,
        week52High: 44250.00,
        week52Low: 32500.00,
        sector: 'Indices',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'NIFTY FIN SERVICE': {
        symbol: 'NIFTY FIN SERVICE',
        name: 'NIFTY Financial Services',
        exchange: 'NSE',
        ltp: 23680.10,
        change: 145.30,
        changePercent: 0.62,
        open: 23550.00,
        high: 23720.00,
        low: 23510.00,
        previousClose: 23534.80,
        volume: 110000000,
        marketCap: 0,
        week52High: 24890.00,
        week52Low: 19800.00,
        sector: 'Indices',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'INDIA VIX': {
        symbol: 'INDIA VIX',
        name: 'India Volatility Index',
        exchange: 'NSE',
        ltp: 13.42,
        change: -0.48,
        changePercent: -3.45,
        open: 13.90,
        high: 14.10,
        low: 13.20,
        previousClose: 13.90,
        volume: 0,
        marketCap: 0,
        week52High: 24.50,
        week52Low: 9.85,
        sector: 'Indices',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'RELIANCE': {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd.',
        exchange: 'NSE',
        ltp: 1482.30,
        change: 18.40,
        changePercent: 1.26,
        open: 1466.00,
        high: 1488.50,
        low: 1464.00,
        previousClose: 1463.90,
        volume: 12450000,
        marketCap: 2005840,
        peRatio: 25.4,
        pbRatio: 2.3,
        dividendYield: 0.68,
        eps: 58.3,
        bookValue: 644.4,
        week52High: 1608.80,
        week52Low: 1180.20,
        sector: 'Energy',
        industry: 'Oil & Gas Refining',
        description: 'Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai, India, with businesses spanning energy, petrochemicals, natural gas, retail, telecommunications, mass media, and entertainment.',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'TCS': {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd.',
        exchange: 'NSE',
        ltp: 3921.10,
        change: 22.10,
        changePercent: 0.57,
        open: 3905.00,
        high: 3935.00,
        low: 3895.00,
        previousClose: 3899.00,
        volume: 4120000,
        marketCap: 1418500,
        peRatio: 30.8,
        pbRatio: 12.5,
        dividendYield: 1.35,
        eps: 127.3,
        bookValue: 313.6,
        week52High: 4585.90,
        week52Low: 3310.00,
        sector: 'IT',
        industry: 'IT Services & Consulting',
        description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai.',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'INFY': {
        symbol: 'INFY',
        name: 'Infosys Limited',
        exchange: 'NSE',
        ltp: 1534.80,
        change: -8.20,
        changePercent: -0.53,
        open: 1545.00,
        high: 1552.00,
        low: 1530.00,
        previousClose: 1543.00,
        volume: 6850000,
        marketCap: 637200,
        peRatio: 24.1,
        pbRatio: 7.8,
        dividendYield: 2.21,
        eps: 63.6,
        bookValue: 196.7,
        week52High: 1991.45,
        week52Low: 1351.65,
        sector: 'IT',
        industry: 'Software Services',
        description: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'HDFCBANK': {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Limited',
        exchange: 'NSE',
        ltp: 1642.50,
        change: 14.80,
        changePercent: 0.91,
        open: 1630.00,
        high: 1648.00,
        low: 1628.00,
        previousClose: 1627.70,
        volume: 15800000,
        marketCap: 1251000,
        peRatio: 19.2,
        pbRatio: 2.7,
        dividendYield: 1.18,
        eps: 85.5,
        bookValue: 608.3,
        week52High: 1794.00,
        week52Low: 1363.55,
        sector: 'Banking',
        industry: 'Private Sector Banking',
        description: 'HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai.',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'ICICIBANK': {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Limited',
        exchange: 'NSE',
        ltp: 1218.40,
        change: 11.20,
        changePercent: 0.93,
        open: 1210.00,
        high: 1222.00,
        low: 1206.00,
        previousClose: 1207.20,
        volume: 9800000,
        marketCap: 857400,
        peRatio: 18.5,
        pbRatio: 3.1,
        dividendYield: 0.82,
        eps: 65.8,
        bookValue: 393.0,
        week52High: 1362.40,
        week52Low: 980.10,
        sector: 'Banking',
        industry: 'Private Sector Banking',
        description: 'ICICI Bank Limited is an Indian multinational bank and financial services company headquartered in Mumbai.',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    },
    'TATAMOTORS': {
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Limited',
        exchange: 'NSE',
        ltp: 985.60,
        change: 28.40,
        changePercent: 2.97,
        open: 960.00,
        high: 991.00,
        low: 958.00,
        previousClose: 957.20,
        volume: 18400000,
        marketCap: 362400,
        peRatio: 11.4,
        pbRatio: 3.8,
        dividendYield: 0.61,
        eps: 86.4,
        bookValue: 259.3,
        week52High: 1179.05,
        week52Low: 642.00,
        sector: 'Auto',
        industry: 'Automobiles & EV',
        description: 'Tata Motors Group is a leading global automobile manufacturer of cars, utility vehicles, buses, trucks, and defense vehicles.',
        marketStatus: 'OPEN',
        dataStatus: 'LIVE',
        lastUpdated: new Date().toISOString(),
    }
};
// Calculate Option Greeks using Black-Scholes approximations
function calculateOptionGreeks(spotPrice, strikePrice, timeToExpirationYears = 0.0833, // ~1 month
riskFreeRate = 0.065, // 6.5% Indian Repo Rate benchmark
volatility = 0.16 // 16% IV
) {
    const d1 = (Math.log(spotPrice / strikePrice) + (riskFreeRate + 0.5 * Math.pow(volatility, 2)) * timeToExpirationYears) / (volatility * Math.sqrt(timeToExpirationYears));
    const d2 = d1 - volatility * Math.sqrt(timeToExpirationYears);
    // Standard Normal CDF approximation
    const normalCDF = (x) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x >= 0 ? 1 - prob : prob;
    };
    const normalPDF = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    const callDelta = normalCDF(d1);
    const putDelta = callDelta - 1;
    const gamma = normalPDF(d1) / (spotPrice * volatility * Math.sqrt(timeToExpirationYears));
    const vega = spotPrice * normalPDF(d1) * Math.sqrt(timeToExpirationYears) / 100;
    const callTheta = (-(spotPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpirationYears)) - riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpirationYears) * normalCDF(d2)) / 365;
    const putTheta = (-(spotPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpirationYears)) + riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpirationYears) * normalCDF(-d2)) / 365;
    return {
        calls: { delta: Math.round(callDelta * 100) / 100, gamma: Math.round(gamma * 10000) / 10000, theta: Math.round(callTheta * 100) / 100, vega: Math.round(vega * 100) / 100 },
        puts: { delta: Math.round(putDelta * 100) / 100, gamma: Math.round(gamma * 10000) / 10000, theta: Math.round(putTheta * 100) / 100, vega: Math.round(vega * 100) / 100 },
    };
}
// Generate Option Chain Matrix for index/symbol
function generateOptionChain(symbol = 'NIFTY 50', underlyingPrice = 25102.40) {
    const step = symbol.includes('NIFTY') ? 50 : 100;
    const atmStrike = Math.round(underlyingPrice / step) * step;
    const strikes = [];
    for (let i = -10; i <= 10; i++) {
        const strikePrice = atmStrike + (i * step);
        const isATM = strikePrice === atmStrike;
        const isCallITM = underlyingPrice > strikePrice;
        const isPutITM = underlyingPrice < strikePrice;
        const intrinsicCall = Math.max(0, underlyingPrice - strikePrice);
        const intrinsicPut = Math.max(0, strikePrice - underlyingPrice);
        const timeValueCall = Math.max(15, 200 - Math.abs(strikePrice - atmStrike) * 0.4);
        const timeValuePut = Math.max(15, 200 - Math.abs(strikePrice - atmStrike) * 0.4);
        const callLtp = Math.round((intrinsicCall + timeValueCall) * 10) / 10;
        const putLtp = Math.round((intrinsicPut + timeValuePut) * 10) / 10;
        const greeks = calculateOptionGreeks(underlyingPrice, strikePrice);
        strikes.push({
            strikePrice,
            isATM,
            calls: {
                ltp: callLtp,
                change: Math.round((Math.random() * 10 - 4) * 10) / 10,
                changePercent: Math.round((Math.random() * 8 - 3) * 100) / 100,
                bid: Math.round((callLtp - 0.5) * 10) / 10,
                ask: Math.round((callLtp + 0.5) * 10) / 10,
                volume: Math.floor(Math.random() * 500000) + 50000,
                oi: Math.floor(Math.random() * 2500000) + 200000,
                changeOI: Math.floor(Math.random() * 150000) - 50000,
                iv: Math.round((14 + Math.random() * 5) * 10) / 10,
                ...greeks.calls
            },
            puts: {
                ltp: putLtp,
                change: Math.round((Math.random() * 10 - 4) * 10) / 10,
                changePercent: Math.round((Math.random() * 8 - 3) * 100) / 100,
                bid: Math.round((putLtp - 0.5) * 10) / 10,
                ask: Math.round((putLtp + 0.5) * 10) / 10,
                volume: Math.floor(Math.random() * 450000) + 40000,
                oi: Math.floor(Math.random() * 2200000) + 180000,
                changeOI: Math.floor(Math.random() * 140000) - 40000,
                iv: Math.round((14.5 + Math.random() * 5) * 10) / 10,
                ...greeks.puts
            }
        });
    }
    return {
        underlyingSymbol: symbol,
        underlyingPrice,
        expiryDate: '28-AUG-2026',
        strikes,
        pcr: 1.12,
        maxPain: atmStrike
    };
}
// Generate realistic simulated OHLCV candles
function generateCandleData(symbol, days = 90) {
    const basePrice = exports.INITIAL_MARKET_TICKERS[symbol]?.ltp || 1500;
    const candles = [];
    let currentPrice = basePrice * 0.85; // Start 15% lower 90 days ago
    const now = Date.now();
    const dayMs = 86400000;
    for (let i = days; i >= 0; i--) {
        const timestamp = now - i * dayMs;
        const variation = (Math.random() - 0.48) * 0.025; // Slight bullish bias
        const open = currentPrice;
        const close = open * (1 + variation);
        const high = Math.max(open, close) * (1 + Math.random() * 0.012);
        const low = Math.min(open, close) * (1 - Math.random() * 0.012);
        const volume = Math.floor(Math.random() * 5000000) + 1000000;
        candles.push({
            timestamp,
            open: Math.round(open * 100) / 100,
            high: Math.round(high * 100) / 100,
            low: Math.round(low * 100) / 100,
            close: Math.round(close * 100) / 100,
            volume
        });
        currentPrice = close;
    }
    return candles;
}
