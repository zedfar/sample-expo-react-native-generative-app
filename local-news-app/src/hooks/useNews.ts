/**
 * useNews Hook
 * Custom hook untuk fetch dan manage data berita
 */

import { useState, useEffect, useCallback } from 'react';
import { newsService } from '@/services/newsService';
import { NewsArticle, NewsCategory } from '@/types/news.types';

interface UseNewsOptions {
  autoFetch?: boolean;
  category?: NewsCategory;
  limit?: number;
}

interface UseNewsReturn {
  news: NewsArticle[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const { autoFetch = true, category, limit = 10 } = options;

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(
    async (currentOffset: number, reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await newsService.getNews({
          category,
          limit,
          offset: currentOffset,
        });

        if (reset) {
          setNews(response.data);
        } else {
          setNews((prev) => [...prev, ...response.data]);
        }

        setHasMore(response.hasMore);
        setOffset(currentOffset);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Gagal memuat berita';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [category, limit]
  );

  const refresh = useCallback(async () => {
    await fetchNews(0, true);
  }, [fetchNews]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchNews(offset + limit, false);
    }
  }, [loading, hasMore, offset, limit, fetchNews]);

  useEffect(() => {
    if (autoFetch) {
      fetchNews(0, true);
    }
  }, [autoFetch, fetchNews]);

  return {
    news,
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
  };
}

/**
 * Hook untuk get breaking news
 */
export function useBreakingNews() {
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBreakingNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await newsService.getBreakingNews();
      setBreakingNews(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat berita terkini';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBreakingNews();
  }, [fetchBreakingNews]);

  return {
    breakingNews,
    loading,
    error,
    refresh: fetchBreakingNews,
  };
}

/**
 * Hook untuk get single news by ID
 */
export function useNewsDetail(id: string) {
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await newsService.getNewsById(id);
      setNews(data);

      // Increment view count
      if (data) {
        await newsService.incrementViewCount(id);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat detail berita';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNewsDetail();
    }
  }, [id, fetchNewsDetail]);

  return {
    news,
    loading,
    error,
    refresh: fetchNewsDetail,
  };
}

/**
 * Hook untuk search news
 */
export function useSearchNews() {
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await newsService.searchNews(query);
      setResults(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal mencari berita';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clear,
  };
}
