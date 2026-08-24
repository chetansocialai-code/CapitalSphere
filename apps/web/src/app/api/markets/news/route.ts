import { NextResponse } from 'next/server';

const VALID_SECRETS = [
  process.env.WEBHOOK_SECRET,
  'da65pipr01qtngrehja0',
  'da646s1r01qtngrecd70',
].filter(Boolean);

export async function POST(request: Request) {
  // Extract X-Finnhub-Secret header (case-insensitive)
  const secretHeader =
    request.headers.get('x-finnhub-secret') ||
    request.headers.get('X-Finnhub-Secret') ||
    request.headers.get('X-FINNHUB-SECRET');

  // Verify secret if header is present
  if (secretHeader && !VALID_SECRETS.includes(secretHeader)) {
    return NextResponse.json({ error: 'Unauthorized Webhook Secret' }, { status: 401 });
  }

  // Fire-and-forget async body parsing to prevent any execution delay or timeout
  request.json().then((body) => {
    console.log('⚡ Finnhub News Webhook Event Processed:', body);
  }).catch(() => {
    console.log('⚡ Finnhub News Webhook Ping Acknowledged');
  });

  // Return immediate 200 OK HTTP acknowledgment response
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
  return NextResponse.json(
    {
      status: 'ACTIVE',
      webhookEndpoint: 'https://www.capitalsphere.online/api/markets/news',
      secretHeader: 'X-Finnhub-Secret',
      secretConfigured: true,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
