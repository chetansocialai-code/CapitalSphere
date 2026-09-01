import { NextResponse } from 'next/server';
import { getLiveCryptoMarkets } from '../../../../../../api/src/cryptoService';

export async function GET() {
  try {
    const { coins } = await getLiveCryptoMarkets();
    const trending = [...coins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 6);
    return NextResponse.json({ success: true, data: trending });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Crypto market data temporarily unavailable.' },
      { status: 500 }
    );
  }
}
