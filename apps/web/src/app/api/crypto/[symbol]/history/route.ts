import { NextResponse } from 'next/server';
import { getCryptoCoinBySymbol, generateCryptoPriceHistory } from '../../../../../../../api/src/cryptoService';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || searchParams.get('tf') || '24H';

    const coin = await getCryptoCoinBySymbol(symbol);
    if (!coin) {
      return NextResponse.json(
        { success: false, error: `Cryptocurrency '${symbol}' not found.` },
        { status: 404 }
      );
    }

    const historyData = generateCryptoPriceHistory(coin, timeframe);
    return NextResponse.json({ success: true, data: historyData });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Crypto history data temporarily unavailable.' },
      { status: 500 }
    );
  }
}
