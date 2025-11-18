/**
 * News Service
 * Service untuk mengambil data berita lokal
 */

import { api } from '@/services/api';
import {
  NewsArticle,
  NewsListParams,
  NewsListResponse,
  NewsCategory,
} from '@/types/news.types';

// Mock data untuk development
const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Pemkot Luncurkan Program Smart City 2024',
    description: 'Pemerintah kota meluncurkan program smart city untuk meningkatkan pelayanan publik berbasis teknologi digital.',
    content: 'Pemerintah kota resmi meluncurkan program Smart City 2024 yang bertujuan untuk meningkatkan kualitas pelayanan publik melalui integrasi teknologi digital. Program ini mencakup berbagai aspek seperti transportasi, pendidikan, kesehatan, dan administrasi kependudukan.',
    imageUrl: 'https://picsum.photos/seed/news1/800/600',
    category: 'teknologi',
    source: 'BeritaLokal.id',
    author: 'Ahmad Fauzi',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: 'Jakarta',
    tags: ['smart city', 'teknologi', 'pemerintah'],
    viewCount: 1234,
    isBreakingNews: true,
  },
  {
    id: '2',
    title: 'Tim Sepak Bola Lokal Juara Liga Regional',
    description: 'Tim sepak bola dari kota berhasil menjuarai liga regional setelah mengalahkan tim lawan dengan skor 3-1.',
    content: 'Dalam pertandingan final yang berlangsung sengit, tim sepak bola lokal berhasil mengalahkan lawannya dengan skor 3-1. Kemenangan ini merupakan yang pertama kali dalam sejarah klub.',
    imageUrl: 'https://picsum.photos/seed/news2/800/600',
    category: 'olahraga',
    source: 'SportNews.id',
    author: 'Budi Santoso',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    location: 'Bandung',
    tags: ['sepak bola', 'juara', 'olahraga'],
    viewCount: 2345,
    isBreakingNews: false,
  },
  {
    id: '3',
    title: 'Harga Sembako Stabil Jelang Ramadan',
    description: 'Pemerintah daerah memastikan harga sembako tetap stabil menjelang bulan Ramadan dengan menggelar operasi pasar.',
    content: 'Untuk menjaga stabilitas harga sembako menjelang Ramadan, pemerintah daerah menggelar operasi pasar di berbagai titik strategis. Berbagai kebutuhan pokok dijual dengan harga terjangkau.',
    imageUrl: 'https://picsum.photos/seed/news3/800/600',
    category: 'ekonomi',
    source: 'EkonomiLokal.id',
    author: 'Siti Nurhaliza',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    location: 'Surabaya',
    tags: ['ekonomi', 'sembako', 'ramadan'],
    viewCount: 3456,
    isBreakingNews: false,
  },
  {
    id: '4',
    title: 'Bupati Resmikan Rumah Sakit Baru',
    description: 'Rumah sakit baru dengan fasilitas lengkap diresmikan untuk meningkatkan layanan kesehatan masyarakat.',
    content: 'Bupati meresmikan rumah sakit baru yang dilengkapi dengan peralatan medis modern dan tenaga kesehatan profesional. Rumah sakit ini diharapkan dapat melayani kebutuhan kesehatan masyarakat dengan lebih baik.',
    imageUrl: 'https://picsum.photos/seed/news4/800/600',
    category: 'kesehatan',
    source: 'KesehatanNews.id',
    author: 'Dr. Andi Wijaya',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    location: 'Semarang',
    tags: ['kesehatan', 'rumah sakit', 'fasilitas'],
    viewCount: 4567,
    isBreakingNews: false,
  },
  {
    id: '5',
    title: 'Konser Musik Lokal Dihadiri Ribuan Penonton',
    description: 'Festival musik lokal sukses digelar dengan menghadirkan berbagai musisi dan band terkenal.',
    content: 'Festival musik lokal yang digelar di alun-alun kota berhasil menarik ribuan penonton. Acara ini menampilkan berbagai genre musik dari pop, rock, hingga dangdut.',
    imageUrl: 'https://picsum.photos/seed/news5/800/600',
    category: 'hiburan',
    source: 'HiburanKita.id',
    author: 'Rina Melati',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    location: 'Yogyakarta',
    tags: ['musik', 'konser', 'hiburan'],
    viewCount: 5678,
    isBreakingNews: false,
  },
  {
    id: '6',
    title: 'Polisi Ringkus Pelaku Pencurian Motor',
    description: 'Kepolisian berhasil menangkap pelaku pencurian sepeda motor yang beraksi di beberapa wilayah.',
    content: 'Setelah melakukan penyelidikan selama seminggu, kepolisian berhasil menangkap pelaku pencurian motor yang telah beraksi di beberapa wilayah. Barang bukti berupa 5 unit motor berhasil diamankan.',
    imageUrl: 'https://picsum.photos/seed/news6/800/600',
    category: 'kriminal',
    source: 'KriminalUpdate.id',
    author: 'Joko Susilo',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    location: 'Malang',
    tags: ['kriminal', 'pencurian', 'polisi'],
    viewCount: 6789,
    isBreakingNews: false,
  },
  {
    id: '7',
    title: 'Sekolah Raih Penghargaan Adiwiyata Nasional',
    description: 'SMA Negeri 1 berhasil meraih penghargaan Adiwiyata tingkat nasional berkat program lingkungan hidup.',
    content: 'Berkat konsistensi dalam menjalankan program peduli lingkungan, SMA Negeri 1 berhasil meraih penghargaan Adiwiyata tingkat nasional. Sekolah ini menjadi percontohan sekolah hijau di daerah.',
    imageUrl: 'https://picsum.photos/seed/news7/800/600',
    category: 'pendidikan',
    source: 'PendidikanNews.id',
    author: 'Dewi Lestari',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    location: 'Medan',
    tags: ['pendidikan', 'adiwiyata', 'lingkungan'],
    viewCount: 7890,
    isBreakingNews: false,
  },
  {
    id: '8',
    title: 'DPRD Gelar Rapat Paripurna APBD 2024',
    description: 'DPRD menggelar rapat paripurna untuk membahas Anggaran Pendapatan dan Belanja Daerah tahun 2024.',
    content: 'Dalam rapat paripurna yang dihadiri seluruh anggota dewan, DPRD membahas dan menyetujui APBD 2024 yang fokus pada pembangunan infrastruktur dan peningkatan kesejahteraan masyarakat.',
    imageUrl: 'https://picsum.photos/seed/news8/800/600',
    category: 'politik',
    source: 'PolitikLokal.id',
    author: 'Hendra Gunawan',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    location: 'Makassar',
    tags: ['politik', 'APBD', 'DPRD'],
    viewCount: 8901,
    isBreakingNews: false,
  },
];

export const newsService = {
  /**
   * Get all news articles with optional filters
   */
  getNews: async (params?: NewsListParams): Promise<NewsListResponse> => {
    // Simulasi API call dengan mock data
    // Dalam production, gunakan: const response = await api.get<NewsListResponse>('/news', params);

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi delay network

    let filteredNews = [...MOCK_NEWS];

    // Filter by category
    if (params?.category) {
      filteredNews = filteredNews.filter((news) => news.category === params.category);
    }

    // Filter by location
    if (params?.location) {
      filteredNews = filteredNews.filter((news) =>
        news.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    // Search by title or description
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredNews = filteredNews.filter(
        (news) =>
          news.title.toLowerCase().includes(searchLower) ||
          news.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const offset = params?.offset || 0;
    const limit = params?.limit || 10;
    const paginatedNews = filteredNews.slice(offset, offset + limit);

    return {
      data: paginatedNews,
      total: filteredNews.length,
      hasMore: offset + limit < filteredNews.length,
    };
  },

  /**
   * Get single news article by ID
   */
  getNewsById: async (id: string): Promise<NewsArticle | null> => {
    // Dalam production: const response = await api.get<NewsArticle>(`/news/${id}`);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const news = MOCK_NEWS.find((item) => item.id === id);
    return news || null;
  },

  /**
   * Get breaking news
   */
  getBreakingNews: async (): Promise<NewsArticle[]> => {
    // Dalam production: const response = await api.get<NewsArticle[]>('/news/breaking');

    await new Promise((resolve) => setTimeout(resolve, 300));

    return MOCK_NEWS.filter((news) => news.isBreakingNews);
  },

  /**
   * Get news by category
   */
  getNewsByCategory: async (category: NewsCategory): Promise<NewsArticle[]> => {
    // Dalam production: const response = await api.get<NewsArticle[]>(`/news/category/${category}`);

    await new Promise((resolve) => setTimeout(resolve, 400));

    return MOCK_NEWS.filter((news) => news.category === category);
  },

  /**
   * Search news
   */
  searchNews: async (query: string): Promise<NewsArticle[]> => {
    // Dalam production: const response = await api.get<NewsArticle[]>('/news/search', { params: { q: query } });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const searchLower = query.toLowerCase();
    return MOCK_NEWS.filter(
      (news) =>
        news.title.toLowerCase().includes(searchLower) ||
        news.description.toLowerCase().includes(searchLower) ||
        news.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  },

  /**
   * Increment view count (untuk tracking views)
   */
  incrementViewCount: async (id: string): Promise<void> => {
    // Dalam production: await api.post(`/news/${id}/view`);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const newsIndex = MOCK_NEWS.findIndex((item) => item.id === id);
    if (newsIndex !== -1) {
      MOCK_NEWS[newsIndex].viewCount += 1;
    }
  },
};
