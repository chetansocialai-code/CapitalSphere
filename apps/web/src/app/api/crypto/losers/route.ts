import { NextResponse } from 'next/server';
import { getLiveCryptoMarkets } from '../../../../../../api/src/cryptoService';

export async function GET() {
  try {
    const { coins } = await getLiveCryptoMarkets();
    const losers = [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, 6);
    return NextResponse.json({ success: true, data: losers });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Crypto market data temporarily unavailable.' },
      { status: 500 }
    );
  }
}
