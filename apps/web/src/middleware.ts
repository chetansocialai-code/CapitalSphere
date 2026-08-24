import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FINNHUB_SECRET = process.env.WEBHOOK_SECRET || 'da65pipr01qtngrehja0';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Intercept POST requests to /markets endpoint for Finnhub Webhook acknowledgment
  if (request.method === 'POST' && (pathname === '/markets' || pathname === '/markets/')) {
    const secretHeader =
      request.headers.get('x-finnhub-secret') ||
      request.headers.get('X-Finnhub-Secret') ||
      request.headers.get('X-FINNHUB-SECRET');

    if (secretHeader && secretHeader !== FINNHUB_SECRET) {
      return NextResponse.json({ error: 'Unauthorized Webhook Secret' }, { status: 401 });
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/markets', '/markets/'],
};
