'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  ExternalLink,
  RefreshCw,
  Clock,
  TrendingUp,
  Building2,
  Globe,
  DollarSign,
  Filter,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

interface Article {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  category: string;
  related: string;
}

const CATEGORIES = [
  { key: 'general', label: 'All News', icon: Globe },
  { key: 'forex', label: 'Forex', icon: DollarSign },
  { key: 'crypto', label: 'Crypto', icon: TrendingUp },
  { key: 'merger', label: 'M&A', icon: Building2 },
];

function timeAgo(unixTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTimestamp;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getCategoryColor(category: string): string {
  switch (category?.toLowerCase()) {
    case 'forex': return '#F2B84B';
    case 'crypto': return '#22C58B';
    case 'merger': return '#A78BFA';
    case 'general':
    default: return '#4DA3FF';
  }
}

function ArticleSkeleton() {
  return (
    <div className="cs-card border rounded-xl overflow-hidden animate-pulse">
      <div className="h-44 bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-white/5 rounded w-1/4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-5/6" />
        <div className="h-3 bg-white/5 rounded w-2/3" />
        <div className="flex justify-between">
          <div className="h-3 bg-white/5 rounded w-1/3" />
          <div className="h-3 bg-white/5 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = useCallback(async (category: string, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/news?category=${category}&_t=${Date.now()}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      setArticles(data.articles || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Unable to load news. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory, fetchNews]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews(activeCategory, true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeCategory, fetchNews]);

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="min-h-screen max-w-master mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b cs-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#4DA3FF]" />
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Market News Feed
            </h1>
            <span className="px-2 py-0.5 bg-[#4DA3FF]/10 text-[#4DA3FF] text-3xs font-mono font-bold rounded uppercase border border-[#4DA3FF]/20">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Real-time financial news powered by Finnhub •{' '}
            {lastUpdated ? (
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            ) : (
              <span>Loading...</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => fetchNews(activeCategory, true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border cs-border text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 hover:border-[#4DA3FF]/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#4DA3FF]' : ''}`} />
            Refresh
          </button>

          {/* Article Count */}
          {articles.length > 0 && (
            <span className="text-xs font-mono text-slate-500">
              {articles.length} articles
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeCategory === key
                ? 'bg-[#4DA3FF] text-slate-950'
                : 'bg-white/5 text-slate-400 border cs-border hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button
            onClick={() => fetchNews(activeCategory)}
            className="ml-auto text-xs underline hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="space-y-8">
          {/* Featured Skeleton */}
          <div className="cs-card border rounded-xl overflow-hidden animate-pulse">
            <div className="h-72 bg-white/5" />
            <div className="p-6 space-y-3">
              <div className="h-3 bg-white/5 rounded w-1/4" />
              <div className="h-6 bg-white/5 rounded w-full" />
              <div className="h-6 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-5/6" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && articles.length > 0 && (
        <div className="space-y-8">
          {/* Featured Article */}
          {featuredArticle && (
            <a
              href={featuredArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block cs-card border rounded-xl overflow-hidden hover:border-[#4DA3FF]/40 transition shadow-xl"
            >
              <div className="relative h-72 w-full overflow-hidden bg-slate-900">
                {featuredArticle.image ? (
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <Newspaper className="w-16 h-16 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-slate-950 font-mono font-bold text-3xs rounded uppercase"
                      style={{ backgroundColor: getCategoryColor(featuredArticle.category) }}
                    >
                      {featuredArticle.category || 'General'}
                    </span>
                    <span className="text-slate-400 text-3xs font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(featuredArticle.datetime)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#4DA3FF] transition line-clamp-2 leading-snug">
                    {featuredArticle.headline}
                  </h2>
                  <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {featuredArticle.summary}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono text-slate-500">{featuredArticle.source}</span>
                    <span className="flex items-center gap-1 text-xs font-mono text-[#4DA3FF] group-hover:gap-2 transition-all">
                      Read Full Article <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group cs-card border rounded-xl overflow-hidden hover:border-[#4DA3FF]/40 transition flex flex-col shadow-lg"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900 shrink-0">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.classList.add('!h-0');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <Newspaper className="w-10 h-10 text-slate-700" />
                    </div>
                  )}
                  <span
                    className="absolute top-3 left-3 text-slate-950 font-mono font-bold text-3xs px-2 py-0.5 rounded uppercase"
                    style={{ backgroundColor: getCategoryColor(article.category) }}
                  >
                    {article.category || 'General'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex flex-col flex-1">
                  <h3 className="text-sm font-bold font-sans line-clamp-2 group-hover:text-[#4DA3FF] transition leading-snug">
                    {article.headline}
                  </h3>
                  {article.summary && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                      {article.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <div className="flex items-center gap-1.5 text-3xs font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      {timeAgo(article.datetime)}
                      <span className="mx-1">·</span>
                      {article.source}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#4DA3FF] opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Newspaper className="w-12 h-12 text-slate-700" />
          <p className="text-slate-400 font-mono text-sm">No articles found for this category.</p>
          <button
            onClick={() => setActiveCategory('general')}
            className="text-xs text-[#4DA3FF] hover:underline font-mono"
          >
            Switch to All News
          </button>
        </div>
      )}

      {/* Back to Home */}
      <div className="pt-4 border-t cs-border">
        <Link
          href="/"
          className="text-xs font-mono text-slate-500 hover:text-[#4DA3FF] transition flex items-center gap-1"
        >
          ← Back to CapitalSphere Home
        </Link>
      </div>
    </div>
  );
}
