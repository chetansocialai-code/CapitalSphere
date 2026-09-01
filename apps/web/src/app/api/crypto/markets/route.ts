import { NextResponse } from 'next/server';
import { getLiveCryptoMarkets } from '../../../../../../api/src/cryptoService';

export async function GET() {
  try {
    const result = await getLiveCryptoMarkets();
    return NextResponse.json({
      success: true,
      status: result.status,
      isLive: result.isLive,
      count: result.coins.length,
      data: result.coins
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Crypto market data temporarily unavailable.', message: err.message },
      { status: 500 }
    );
  }
}
