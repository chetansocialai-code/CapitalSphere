import { NextResponse } from 'next/server';

const VALID_SECRETS = [
  process.env.WEBHOOK_SECRET,
  'da65pipr01qtngrehja0',
  'da646s1r01qtngrecd70',
].filter(Boolean);

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      status: 'ACTIVE',
      webhookEndpoint: 'https://www.capitalsphere.online/markets',
      secretHeader: 'X-Finnhub-Secret',
      secretConfigured: true,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const secretHeader =
    request.headers.get('x-finnhub-secret') ||
    request.headers.get('X-Finnhub-Secret') ||
    request.headers.get('X-FINNHUB-SECRET');

  if (secretHeader && !VALID_SECRETS.includes(secretHeader)) {
    return NextResponse.json({ error: 'Unauthorized Webhook Secret' }, { status: 401 });
  }

  request.json().then((body) => {
    console.log('⚡ Finnhub Webhook Event on /markets:', body);
  }).catch(() => {});

  return NextResponse.json(
    {
      success: true,
      message: 'Finnhub webhook event acknowledged',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: 'GET, POST, HEAD, OPTIONS',
    },
  });
}
