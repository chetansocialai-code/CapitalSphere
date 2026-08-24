import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_SECRETS = [
  process.env.WEBHOOK_SECRET,
  'da65pipr01qtngrehja0',
  'da646s1r01qtngrecd70',
].filter(Boolean);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  if (pathname === '/markets' || pathname === '/markets/') {
    // Handle POST webhook requests directly in middleware to allow /markets to be a UI page for GET requests
    if (method === 'POST') {
      const secretHeader =
        request.headers.get('x-finnhub-secret') ||
        request.headers.get('X-Finnhub-Secret') ||
        request.headers.get('X-FINNHUB-SECRET');

      if (secretHeader && !VALID_SECRETS.includes(secretHeader)) {
        return NextResponse.json({ error: 'Unauthorized Webhook Secret' }, { status: 401 });
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Finnhub webhook event acknowledged on /markets',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Allow GET, HEAD, OPTIONS to pass through to app/markets/page.tsx
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/markets', '/markets/'],
};
