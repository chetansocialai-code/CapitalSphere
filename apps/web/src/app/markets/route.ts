import { NextResponse } from 'next/server';

const FINNHUB_SECRET = process.env.WEBHOOK_SECRET || 'da646s1r01qtngrecd70';

export async function POST(request: Request) {
  const secretHeader =
    request.headers.get('x-finnhub-secret') ||
    request.headers.get('X-Finnhub-Secret') ||
    request.headers.get('X-FINNHUB-SECRET');

  if (secretHeader && secretHeader !== FINNHUB_SECRET) {
    return NextResponse.json({ error: 'Unauthorized Webhook Secret' }, { status: 401 });
  }

  request.json().then((body) => {
    console.log('⚡ Finnhub Webhook Event on /markets:', body);
  }).catch(() => {});

  return NextResponse.json(
    {
      success: true,
      message: 'Finnhub webhook event acknowledged on /markets',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
