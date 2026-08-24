export interface NewsArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  image: string;
  timeAgo: string;
  canonicalUrl: string;
}

let cachedNews: NewsArticleItem[] = [];
let lastFetchTime = 0;

export async function fetchLiveNewsData(): Promise<NewsArticleItem[]> {
  const apiKey = process.env.NEWSDATA_API_KEY || 'pub_9c6c466379a746a7971cfdb5c2bd4621';
  const now = Date.now();

  // Cache news for 10 minutes to respect API rate limits
  if (cachedNews.length > 0 && now - lastFetchTime < 10 * 60 * 1000) {
    return cachedNews;
  }

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&category=business,top&language=en`;
    const res = await fetch(url);
    const data: any = await res.json();

    if (data.status === 'success' && Array.isArray(data.results)) {
      cachedNews = data.results.map((item: any, idx: number) => {
        const title = item.title || 'Market & Financial News Headline';
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();

        return {
          id: item.article_id || `art_nd_${idx}_${Date.now()}`,
          title,
          slug,
          excerpt: item.description || title,
          content: item.description || title,
          category: (item.category && item.category[0]) ? item.category[0].toUpperCase() : 'BUSINESS',
          sourceName: item.source_name || item.source_id || 'NewsData Live',
          sourceUrl: item.link || 'https://www.capitalsphere.online/news',
          publishedAt: publishedDate.toISOString(),
          image: item.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
          timeAgo: 'Just now',
          canonicalUrl: item.link || 'https://www.capitalsphere.online/news',
        };
      });

      lastFetchTime = now;
      console.log(`✅ Synced ${cachedNews.length} authentic news items from NewsData.io API`);
      return cachedNews;
    }
  } catch (err) {
    console.error('⚠️ NewsData.io API fetch error:', err);
  }

  return cachedNews;
}
