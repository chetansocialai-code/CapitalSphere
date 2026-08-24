import { NextResponse } from 'next/server';

const NEWSAPI_KEY = process.env.NEWSAPI_ORG_KEY || '7edb67b7196e44798dae34ad2fe88152';

export interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';

  try {
    let url = '';
    if (query.trim()) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=24&page=${page}&apiKey=${NEWSAPI_KEY}`;
    } else {
      let qParam = 'finance OR stock market OR economy OR trading';
      if (category === 'stocks') qParam = 'stock market OR Wall Street OR Sensex OR Nifty OR shares';
      if (category === 'economy') qParam = 'economy OR inflation OR Federal Reserve OR interest rates OR RBI';
      if (category === 'tech') qParam = 'artificial intelligence OR tech stocks OR Nvidia OR Apple OR Microsoft';
      if (category === 'crypto') qParam = 'bitcoin OR ethereum OR cryptocurrency OR crypto';

      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(qParam)}&language=en&sortBy=publishedAt&pageSize=24&page=${page}&apiKey=${NEWSAPI_KEY}`;
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': 'CapitalSphere/1.0' },
      next: { revalidate: 300 }, // 5 minutes Next.js cache
    });

    if (!response.ok) {
      // Fallback to top headlines business category if everything fails
      const fallbackUrl = `https://newsapi.org/v2/top-headlines?category=business&country=us&pageSize=24&apiKey=${NEWSAPI_KEY}`;
      const fallbackRes = await fetch(fallbackUrl, { next: { revalidate: 300 } });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return NextResponse.json({
          status: 'ok',
          totalResults: fallbackData.totalResults || fallbackData.articles?.length || 0,
          articles: fallbackData.articles || [],
          source: 'newsapi.org (fallback)',
        });
      }
      throw new Error(`NewsAPI error status: ${response.status}`);
    }

    const data = await response.json();

    // Filter out removed or broken articles
    const validArticles = (data.articles || []).filter(
      (art: NewsApiArticle) =>
        art.title &&
        art.url &&
        !art.title.includes('[Removed]') &&
        art.url !== 'https://removed.com'
    );

    return NextResponse.json({
      status: 'ok',
      totalResults: data.totalResults || validArticles.length,
      articles: validArticles,
      source: 'newsapi.org',
    });
  } catch (error) {
    console.error('⚠️ NewsAPI Fetch Error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch from newsapi.org',
        articles: [],
      },
      { status: 500 }
    );
  }
}
