export type NewsCategory =
  | 'teknologi'
  | 'bisnis'
  | 'olahraga'
  | 'hiburan'
  | 'kesehatan'
  | 'politik'
  | 'pendidikan';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  author: string;
  imageUrl?: string;
  publishedAt: string;
  readTime: number; // in minutes
  views: number;
  isBookmarked: boolean;
  tags: string[];
}

export interface CreateArticleInput {
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  imageUrl?: string;
  tags: string[];
}
