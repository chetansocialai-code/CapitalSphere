import { NextResponse } from 'next/server';
import { getCryptoNews } from '../../../../../../api/src/cryptoService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const news = await getCryptoNews(category);
    return NextResponse.json({ success: true, category: category || 'All', count: news.length, data: news });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Crypto news temporarily unavailable.' },
      { status: 500 }
    );
  }
}
