import { NextResponse } from 'next/server';

const FINNHUB_SECRET = process.env.WEBHOOK_SECRET || 'da646s1r01qtngrecd70';

export async function POST(request: Request) {
  // Extract X-Finnhub-Secret header for security verification
  const secretHeader = request.headers.get('x-finnhub-secret') || request.headers.get('X-Finnhub-Secret');

  // Verify secret header if provided
  if (secretHeader && secretHeader !== FINNHUB_SECRET) {
    return NextResponse.json({ error: 'Unauthorized Webhook Secret' }, { status: 401 });
  }

  // Acknowledge receipt immediately with 200 OK to prevent Finnhub timeouts
  try {
    const body = await request.json();
    console.log('⚡ Finnhub News Webhook Event Received:', body);
  } catch (e) {
    console.log('⚡ Finnhub Webhook Ping Received');
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Finnhub webhook event acknowledged',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    webhookEndpoint: 'https://www.capitalsphere.online/api/markets/news',
    secretHeader: 'X-Finnhub-Secret',
    secretConfigured: true,
  });
}
