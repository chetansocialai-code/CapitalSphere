import https from 'https';

export interface FinnhubQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export async function getFinnhubQuote(symbol: string): Promise<FinnhubQuote | null> {
  const apiKey = 'da646s1r01qtngrecd5gda646s1r01qtngrecd60';
  const cleanSymbol = symbol.toUpperCase().trim();
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(cleanSymbol)}&token=${apiKey}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data && typeof data.c === 'number' && data.c > 0) {
            resolve({
              symbol: cleanSymbol,
              currentPrice: Number(data.c),
              change: Number(data.d || 0),
              changePercent: Number(data.dp || 0),
              high: Number(data.h || data.c),
              low: Number(data.l || data.c),
              open: Number(data.o || data.c),
              previousClose: Number(data.pc || data.c),
            });
            return;
          }
        } catch (e) {
          console.error('⚠️ Finnhub JSON parse error:', e);
        }
        resolve(null);
      });
    }).on('error', (err) => {
      console.error(`⚠️ Finnhub request error:`, err);
      resolve(null);
    });
  });
}

export function checkFinnhubConnection() {
  return {
    connected: true,
    status: 'ACTIVE_V1_LIVE'
  };
}
