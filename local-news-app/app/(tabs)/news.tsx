/**
 * News List Screen
 * Layar untuk menampilkan daftar berita lokal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { useNews, useBreakingNews } from '@/hooks/useNews';
import { NewsCard } from '@/components/news/NewsCard';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import { Button } from '@/components/common/Button';
import { NewsCategory, NewsArticle } from '@/types/news.types';
import { Search } from 'lucide-react-native';

export default function NewsScreen() {
  const router = useRouter();
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);

  const { news, loading, error, refresh, loadMore, hasMore } = useNews({
    category: selectedCategory || undefined,
  });

  const { breakingNews } = useBreakingNews();

  const handleNewsPress = (newsItem: NewsArticle) => {
    router.push(`/news/${newsItem.id}`);
  };

  const handleCategoryChange = (category: NewsCategory | null) => {
    setSelectedCategory(category);
  };

  const renderBreakingNews = () => {
    if (breakingNews.length === 0) return null;

    return (
      <View className="mb-4">
        <Text
          className={`text-lg font-bold mb-3 px-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Berita Terkini
        </Text>
        {breakingNews.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            variant="featured"
            onPress={() => handleNewsPress(item)}
            className="mx-4"
          />
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <Text
            className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Berita Lokal
          </Text>

          <TouchableOpacity
            className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
            onPress={() => {
              // Navigate to search screen or show search modal
              // router.push('/news/search');
            }}
          >
            <Search size={20} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
        </View>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </View>

      {!selectedCategory && renderBreakingNews()}

      {news.length > 0 && (
        <Text
          className={`text-lg font-bold mb-3 px-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {selectedCategory ? `Berita ${selectedCategory}` : 'Semua Berita'}
        </Text>
      )}
    </>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <NewsCard
      news={item}
      variant="default"
      onPress={() => handleNewsPress(item)}
      className="mx-4"
    />
  );

  // Loading state
  if (loading && news.length === 0) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Memuat berita...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && news.length === 0) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      >
        <Text
          className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Oops! Terjadi kesalahan
        </Text>
        <Text
          className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {error}
        </Text>
        <Button title="Coba Lagi" onPress={refresh} />
      </View>
    );
  }

  // Empty state
  if (news.length === 0 && !loading) {
    return (
      <View
        className="flex-1"
        style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      >
        {renderHeader()}
        <View className="flex-1 justify-center items-center px-6">
          <Text
            className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Tidak ada berita
          </Text>
          <Text
            className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Belum ada berita yang tersedia untuk kategori ini
          </Text>
          <Button title="Refresh" onPress={refresh} />
        </View>
      </View>
    );
  }

  // Main content
  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading && news.length > 0}
            onRefresh={refresh}
            tintColor="#3b82f6"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
