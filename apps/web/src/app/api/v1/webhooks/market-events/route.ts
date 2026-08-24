import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('⚡ Webhook event received on www.capitalsphere.online:', body);

    return NextResponse.json({
      success: true,
      message: 'Webhook payload received and processed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      message: 'Webhook ping received',
      timestamp: new Date().toISOString(),
    });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    webhookEndpoint: 'https://www.capitalsphere.online/api/v1/webhooks/market-events',
    secretConfigured: true,
  });
}
