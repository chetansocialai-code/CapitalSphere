import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.capitalsphere.online';

  const routes = [
    '',
    '/markets',
    '/news',
    '/stocks/reliance',
    '/stocks/tcs',
    '/stocks/hdfcbank',
    '/stocks/infy',
    '/options',
    '/ipo',
    '/companies/reliance-industries',
    '/crypto',
    '/crypto/bitcoin',
    '/crypto/ethereum',
    '/crypto/solana',
    '/crypto/ripple',
    '/crypto/binancecoin',
    '/crypto/dogecoin',
    '/crypto/cardano',
    '/research',
    '/tools',
    '/economy/calendar',
    '/watchlist',
    '/about',
    '/privacy',
    '/terms',
    '/disclaimer',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/markets' || route === '/news' ? 'always' : 'daily',
    priority: route === '' ? 1.0 : route.startsWith('/stocks') || route === '/news' ? 0.9 : 0.8,
  }));
}
