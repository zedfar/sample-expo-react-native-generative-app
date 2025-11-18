/**
 * News Types
 * Tipe data untuk aplikasi berita lokal
 */

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: NewsCategory;
  source: string;
  author: string;
  publishedAt: string;
  location: string;
  tags: string[];
  viewCount: number;
  isBreakingNews: boolean;
}

export type NewsCategory =
  | 'politik'
  | 'ekonomi'
  | 'olahraga'
  | 'teknologi'
  | 'kesehatan'
  | 'hiburan'
  | 'pendidikan'
  | 'kriminal'
  | 'lainnya';

export interface NewsListParams {
  category?: NewsCategory;
  limit?: number;
  offset?: number;
  search?: string;
  location?: string;
}

export interface NewsListResponse {
  data: NewsArticle[];
  total: number;
  hasMore: boolean;
}

export interface NewsState {
  articles: NewsArticle[];
  breakingNews: NewsArticle[];
  selectedCategory: NewsCategory | null;
  loading: boolean;
  error: string | null;
}
