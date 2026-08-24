import { NextResponse } from 'next/server';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || '5C4HZX06WFJ6GSRK';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'top_movers';
  const symbol = searchParams.get('symbol') || 'IBM';

  try {
    if (action === 'quote') {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_KEY}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      const data = await res.json();
      const quote = data['Global Quote'] || {};

      return NextResponse.json({
        success: true,
        quote: {
          symbol: quote['01. symbol'] || symbol,
          open: quote['02. open'] || '0.00',
          high: quote['03. high'] || '0.00',
          low: quote['04. low'] || '0.00',
          price: quote['05. price'] || '0.00',
          volume: quote['06. volume'] || '0',
          latestTradingDay: quote['07. latest trading day'] || '',
          previousClose: quote['08. previous close'] || '0.00',
          change: quote['09. change'] || '0.00',
          changePercent: quote['10. change percent'] || '0.00%',
        },
        key: ALPHA_VANTAGE_KEY,
      });
    }

    if (action === 'search') {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_KEY}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      const data = await res.json();
      return NextResponse.json({
        success: true,
        bestMatches: data.bestMatches || [],
      });
    }

    // Default: TOP_GAINERS_LOSERS
    const url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();

    return NextResponse.json({
      success: true,
      lastUpdated: data.last_updated || new Date().toISOString(),
      topGainers: data.top_gainers || [],
      topLosers: data.top_losers || [],
      mostActive: data.most_actively_traded || [],
      key: ALPHA_VANTAGE_KEY,
    });
  } catch (error) {
    console.error('Error fetching from Alpha Vantage API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Alpha Vantage market data' },
      { status: 500 }
    );
  }
}
