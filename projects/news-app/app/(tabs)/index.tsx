import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useNewsStore } from '@/store/newsStore';
import { NewsCard } from '@/components/news/NewsCard';
import { LucideIcon } from '@/components/shared/LucideIcon';
import { Article, NewsCategory } from '@/types/news.types';

export default function HomeScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const user = useAuthStore((state) => state.user);
  const { articles, isLoading, selectedCategory, loadArticles, toggleBookmark, incrementViews, setSelectedCategory } = useNewsStore();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  const categories: Array<{ value: NewsCategory | null; label: string }> = [
    { value: null, label: 'Semua' },
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'olahraga', label: 'Olahraga' },
    { value: 'hiburan', label: 'Hiburan' },
    { value: 'kesehatan', label: 'Kesehatan' },
  ];

  const handleArticlePress = (article: Article) => {
    incrementViews(article.id);
    setSelectedArticle(article);
    setDetailVisible(true);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header */}
      <View className="p-4 pb-2">
        <View className="mb-4">
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Berita Terkini
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Halo, {user?.name || 'Reader'}!
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              onPress={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === cat.value
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-white'
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedCategory === cat.value
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* News List */}
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            onPress={handleArticlePress}
            onBookmark={toggleBookmark}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <LucideIcon
              name="Newspaper"
              size={64}
              color={isDark ? '#4B5563' : '#D1D5DB'}
            />
            <Text className={`text-lg mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Tidak ada berita tersedia
            </Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={loadArticles}
      />

      {/* Article Detail Modal */}
      <Modal visible={detailVisible} animationType="slide" onRequestClose={() => setDetailVisible(false)}>
        <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
          {selectedArticle && (
            <ScrollView className="flex-1">
              {/* Header */}
              <View className="p-4 pt-12">
                <TouchableOpacity
                  onPress={() => setDetailVisible(false)}
                  className="mb-4"
                >
                  <LucideIcon name="ArrowLeft" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>

                <View className="mb-4">
                  <Text className={`text-xs uppercase font-bold text-blue-500 mb-2`}>
                    {selectedArticle.category}
                  </Text>
                  <Text className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedArticle.title}
                  </Text>

                  <View className="flex-row items-center gap-4 mb-4">
                    <View className="flex-row items-center">
                      <LucideIcon name="User" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                      <Text className={`text-sm ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedArticle.author}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <LucideIcon name="Calendar" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                      <Text className={`text-sm ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Content */}
                <Text className={`text-base leading-7 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedArticle.content}
                </Text>

                {/* Tags */}
                {selectedArticle.tags.length > 0 && (
                  <View className="mt-6">
                    <Text className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tags:
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, index) => (
                        <View
                          key={index}
                          className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                        >
                          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            #{tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}
