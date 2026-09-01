import { NextResponse } from 'next/server';
import { getCryptoCoinBySymbol } from '../../../../../../api/src/cryptoService';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    const coin = await getCryptoCoinBySymbol(symbol);
    if (!coin) {
      return NextResponse.json(
        { success: false, error: `Cryptocurrency '${symbol}' not found.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: coin });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Crypto market data temporarily unavailable.' },
      { status: 500 }
    );
  }
}
