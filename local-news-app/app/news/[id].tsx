/**
 * News Detail Screen
 * Layar untuk menampilkan detail berita
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { useNewsDetail } from '@/hooks/useNews';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Clock, Eye, MapPin, Share2, User } from 'lucide-react-native';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const { news, loading, error, refresh } = useNewsDetail(id);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      politik: 'bg-red-500',
      ekonomi: 'bg-green-500',
      olahraga: 'bg-blue-500',
      teknologi: 'bg-purple-500',
      kesehatan: 'bg-teal-500',
      hiburan: 'bg-pink-500',
      pendidikan: 'bg-yellow-500',
      kriminal: 'bg-orange-500',
      lainnya: 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleShare = async () => {
    if (!news) return;

    try {
      await Share.share({
        message: `${news.title}\n\n${news.description}\n\nBaca selengkapnya di aplikasi Berita Lokal`,
        title: news.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Loading state
  if (loading) {
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
  if (error || !news) {
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
          {error || 'Berita tidak ditemukan'}
        </Text>
        <Button title="Kembali" onPress={() => router.back()} />
      </View>
    );
  }

  // Main content
  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header */}
      <View
        className={`flex-row items-center justify-between px-4 py-3 ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <ArrowLeft size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <Share2 size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image
          source={{ uri: news.imageUrl }}
          className="w-full h-64"
          resizeMode="cover"
        />

        {/* Content */}
        <View className="p-4">
          {/* Category and Breaking News Badge */}
          <View className="flex-row items-center mb-3">
            <View className={`px-3 py-1 rounded-full ${getCategoryColor(news.category)}`}>
              <Text className="text-white text-xs font-semibold uppercase">
                {news.category}
              </Text>
            </View>
            {news.isBreakingNews && (
              <View className="ml-2 bg-red-600 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">BREAKING NEWS</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text
            className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {news.title}
          </Text>

          {/* Meta information */}
          <View className="flex-row flex-wrap items-center mb-4">
            <View className="flex-row items-center mr-4 mb-2">
              <User
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ marginRight: 6 }}
              />
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {news.author}
              </Text>
            </View>

            <View className="flex-row items-center mr-4 mb-2">
              <MapPin
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ marginRight: 6 }}
              />
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {news.location}
              </Text>
            </View>

            <View className="flex-row items-center mr-4 mb-2">
              <Eye
                size={16}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ marginRight: 6 }}
              />
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatViewCount(news.viewCount)} views
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <Clock
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
              style={{ marginRight: 6 }}
            />
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatDate(news.publishedAt)}
            </Text>
          </View>

          {/* Description */}
          <Text
            className={`text-lg font-semibold mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {news.description}
          </Text>

          {/* Content */}
          <Text
            className={`text-base leading-7 mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            {news.content}
          </Text>

          {/* Tags */}
          {news.tags.length > 0 && (
            <View className="mt-4">
              <Text
                className={`text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Tags:
              </Text>
              <View className="flex-row flex-wrap">
                {news.tags.map((tag, index) => (
                  <View
                    key={index}
                    className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                      isDark ? 'bg-gray-800' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Source */}
          <View
            className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            <Text
              className={`text-sm font-semibold mb-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Sumber:
            </Text>
            <Text className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {news.source}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
