import { create } from 'zustand';
import { Article, NewsCategory } from '@/types/news.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NewsState {
  articles: Article[];
  bookmarkedArticles: Article[];
  isLoading: boolean;
  selectedCategory: NewsCategory | null;

  // Actions
  loadArticles: () => Promise<void>;
  getArticleById: (id: string) => Article | undefined;
  toggleBookmark: (id: string) => Promise<void>;
  incrementViews: (id: string) => void;
  setSelectedCategory: (category: NewsCategory | null) => void;
  loadBookmarks: () => Promise<void>;
}

const STORAGE_KEY_BOOKMARKS = '@news_bookmarks';

// Mock data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'AI Terbaru Merevolusi Industri Teknologi Indonesia',
    summary: 'Perkembangan kecerdasan buatan membawa perubahan besar dalam berbagai sektor industri di Indonesia.',
    content: 'Teknologi kecerdasan buatan (AI) terus berkembang pesat dan membawa perubahan signifikan dalam berbagai aspek kehidupan. Di Indonesia, adopsi AI mulai merambah berbagai sektor, dari kesehatan hingga pendidikan.\n\nPemanfaatan AI dalam industri healthcare membantu diagnosis penyakit lebih cepat dan akurat. Sementara di sektor pendidikan, AI digunakan untuk personalisasi pembelajaran sesuai kebutuhan siswa.\n\nPara ahli memprediksikan bahwa dalam 5 tahun ke depan, AI akan menjadi bagian integral dari kehidupan sehari-hari masyarakat Indonesia.',
    category: 'teknologi',
    author: 'Admin News',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    publishedAt: new Date().toISOString(),
    readTime: 5,
    views: 1234,
    isBookmarked: false,
    tags: ['AI', 'Teknologi', 'Indonesia'],
  },
  {
    id: '2',
    title: 'Startup Indonesia Raih Pendanaan Series A USD 50 Juta',
    summary: 'Sebuah startup teknologi Indonesia berhasil mendapatkan pendanaan besar dari investor global.',
    content: 'Dalam perkembangan menggembirakan bagi ekosistem startup Indonesia, sebuah perusahaan teknologi lokal berhasil meraih pendanaan Series A sebesar USD 50 juta.\n\nPendanaan ini akan digunakan untuk ekspansi pasar ke negara-negara Asia Tenggara lainnya dan pengembangan produk baru. CEO perusahaan menyatakan optimisme tinggi terhadap pertumbuhan bisnis di tahun mendatang.\n\nPara investor melihat potensi besar pasar Indonesia dan kawasan regional untuk solusi teknologi yang ditawarkan.',
    category: 'bisnis',
    author: 'Admin News',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    readTime: 4,
    views: 856,
    isBookmarked: false,
    tags: ['Startup', 'Investasi', 'Bisnis'],
  },
  {
    id: '3',
    title: 'Timnas Indonesia Lolos ke Piala Dunia 2026',
    summary: 'Prestasi membanggakan! Tim nasional Indonesia berhasil lolos ke putaran final Piala Dunia.',
    content: 'Dalam laga penentuan yang dramatis, Timnas Indonesia berhasil mengamankan tiket ke Piala Dunia 2026 yang akan digelar di Amerika Serikat, Meksiko, dan Kanada.\n\nKemenangan 2-1 atas tim peringkat atas Asia memastikan Indonesia menjadi salah satu wakil dari benua ini. Ini merupakan pencapaian bersejarah setelah puluhan tahun absen dari turnamen bergengsi tersebut.\n\nPara pemain dan pelatih menyampaikan rasa syukur dan berterima kasih kepada seluruh suporter yang telah memberikan dukungan luar biasa.',
    category: 'olahraga',
    author: 'Admin News',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    readTime: 6,
    views: 3421,
    isBookmarked: false,
    tags: ['Sepak Bola', 'Timnas', 'Piala Dunia'],
  },
  {
    id: '4',
    title: 'Film Indonesia Raih Penghargaan di Festival Cannes',
    summary: 'Industri perfilman Indonesia kembali berjaya di kancah internasional.',
    content: 'Sebuah film Indonesia berhasil meraih penghargaan bergengsi di Festival Film Cannes, Prancis. Film yang disutradarai oleh filmmaker muda Indonesia ini mendapat standing ovation dari para penonton internasional.\n\nPenghargaan ini menjadi bukti bahwa sinema Indonesia memiliki kualitas yang dapat bersaing di tingkat global. Sutradara menyatakan bangga dapat mengharumkan nama Indonesia di mata dunia.\n\nFilm tersebut rencananya akan tayang di bioskop Indonesia dalam waktu dekat dan sangat dinanti oleh para pecinta film tanah air.',
    category: 'hiburan',
    author: 'Admin News',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    readTime: 5,
    views: 2156,
    isBookmarked: false,
    tags: ['Film', 'Cannes', 'Penghargaan'],
  },
  {
    id: '5',
    title: 'Vaksin Baru untuk Penyakit Tropis Dikembangkan di Indonesia',
    summary: 'Para peneliti Indonesia berhasil mengembangkan vaksin inovatif untuk penyakit tropis.',
    content: 'Tim peneliti dari universitas terkemuka di Indonesia berhasil mengembangkan vaksin baru yang efektif untuk menanggulangi penyakit tropis yang selama ini menjadi masalah kesehatan di wilayah tropis.\n\nVaksin ini telah melalui uji klinis dan menunjukkan tingkat efektivitas yang tinggi. Kementerian Kesehatan menyambut baik inovasi ini dan akan segera memulai program vaksinasi massal.\n\nPencapaian ini diharapkan dapat mengurangi angka kejadian penyakit tropis dan meningkatkan kualitas kesehatan masyarakat Indonesia.',
    category: 'kesehatan',
    author: 'Admin News',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    readTime: 7,
    views: 1789,
    isBookmarked: false,
    tags: ['Vaksin', 'Kesehatan', 'Penelitian'],
  },
];

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  bookmarkedArticles: [],
  isLoading: false,
  selectedCategory: null,

  loadArticles: async () => {
    try {
      set({ isLoading: true });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Load bookmarked IDs
      const bookmarkedIds = await AsyncStorage.getItem(STORAGE_KEY_BOOKMARKS);
      const bookmarkedSet = new Set(bookmarkedIds ? JSON.parse(bookmarkedIds) : []);

      // Mark bookmarked articles
      const articlesWithBookmarks = mockArticles.map((article) => ({
        ...article,
        isBookmarked: bookmarkedSet.has(article.id),
      }));

      set({ articles: articlesWithBookmarks, isLoading: false });
    } catch (error) {
      console.error('Error loading articles:', error);
      set({ isLoading: false });
    }
  },

  getArticleById: (id: string) => {
    return get().articles.find((article) => article.id === id);
  },

  toggleBookmark: async (id: string) => {
    try {
      const articles = get().articles.map((article) =>
        article.id === id
          ? { ...article, isBookmarked: !article.isBookmarked }
          : article
      );

      set({ articles });

      // Save to storage
      const bookmarkedIds = articles
        .filter((a) => a.isBookmarked)
        .map((a) => a.id);
      await AsyncStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));

      // Update bookmarked articles list
      get().loadBookmarks();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  },

  incrementViews: (id: string) => {
    const articles = get().articles.map((article) =>
      article.id === id
        ? { ...article, views: article.views + 1 }
        : article
    );
    set({ articles });
  },

  setSelectedCategory: (category: NewsCategory | null) => {
    set({ selectedCategory: category });
  },

  loadBookmarks: async () => {
    const bookmarkedArticles = get().articles.filter((a) => a.isBookmarked);
    set({ bookmarkedArticles });
  },
}));
