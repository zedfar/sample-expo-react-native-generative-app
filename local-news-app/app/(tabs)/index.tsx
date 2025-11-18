import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useNews, useBreakingNews } from '@/hooks/useNews';
import { Card } from '@/components/common/Card';
import { NewsCard } from '@/components/news/NewsCard';
import { ArrowRight } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const user = useAuthStore((state) => state.user);

  const isDark = colorScheme === 'dark';

  const { news } = useNews({ limit: 3 });
  const { breakingNews } = useBreakingNews();

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4">
        <Text className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Selamat Datang, {user?.name || 'User'}!
        </Text>

        <Card className="mb-4">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Aplikasi Berita Lokal
          </Text>
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Dapatkan informasi terkini seputar berita lokal dari berbagai kategori: Politik, Ekonomi, Olahraga, Teknologi, dan lainnya.
          </Text>
        </Card>

        {/* Breaking News Section */}
        {breakingNews.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Berita Terkini
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/news')}
                className="flex-row items-center"
              >
                <Text className="text-blue-500 font-semibold mr-1">Lihat Semua</Text>
                <ArrowRight size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            {breakingNews.slice(0, 1).map((item) => (
              <NewsCard
                key={item.id}
                news={item}
                variant="featured"
                onPress={() => router.push(`/news/${item.id}`)}
              />
            ))}
          </View>
        )}

        {/* Latest News Section */}
        {news.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Berita Terbaru
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/news')}
                className="flex-row items-center"
              >
                <Text className="text-blue-500 font-semibold mr-1">Lihat Semua</Text>
                <ArrowRight size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            {news.map((item) => (
              <NewsCard
                key={item.id}
                news={item}
                variant="compact"
                onPress={() => router.push(`/news/${item.id}`)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
