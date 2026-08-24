import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'da646s1r01qtngrecd5gda646s1r01qtngrecd60';

interface FinnhubArticle {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const minId = searchParams.get('minId') || '0';

  try {
    const url = `https://finnhub.io/api/v1/news?category=${category}&minId=${minId}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'CapitalSphere/1.0' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const articles: FinnhubArticle[] = await response.json();

    // Filter out articles without required fields
    const filtered = articles
      .filter((a) => a.headline && a.url && a.datetime)
      .slice(0, 50); // Limit to 50 articles

    return NextResponse.json({ articles: filtered, total: filtered.length }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Finnhub news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news', articles: [], total: 0 },
      { status: 500 }
    );
  }
}
