/**
 * NewsCard Component
 * Card untuk menampilkan berita
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { NewsArticle } from '@/types/news.types';
import { Clock, Eye, MapPin } from 'lucide-react-native';

interface NewsCardProps {
  news: NewsArticle;
  onPress?: () => void;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function NewsCard({
  news,
  onPress,
  variant = 'default',
  className = '',
}: NewsCardProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - published.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
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

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        className={`flex-row p-3 mb-2 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } ${className}`}
        onPress={onPress}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={news.title}
      >
        <Image
          source={{ uri: news.imageUrl }}
          className="w-20 h-20 rounded-lg mr-3"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text
            className={`text-sm font-bold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            numberOfLines={2}
          >
            {news.title}
          </Text>
          <View className="flex-row items-center mt-1">
            <Clock
              size={12}
              color={isDark ? '#9CA3AF' : '#6B7280'}
              style={{ marginRight: 4 }}
            />
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTimeAgo(news.publishedAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        className={`rounded-xl overflow-hidden mb-4 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } ${className}`}
        onPress={onPress}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={news.title}
      >
        <View className="relative">
          <Image
            source={{ uri: news.imageUrl }}
            className="w-full h-56"
            resizeMode="cover"
          />
          {news.isBreakingNews && (
            <View className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">BREAKING NEWS</Text>
            </View>
          )}
          <View className={`absolute top-3 right-3 px-2 py-1 rounded-full ${getCategoryColor(news.category)}`}>
            <Text className="text-white text-xs font-semibold uppercase">
              {news.category}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text
            className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            numberOfLines={2}
          >
            {news.title}
          </Text>

          <Text
            className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            numberOfLines={2}
          >
            {news.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MapPin
                size={14}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ marginRight: 4 }}
              />
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {news.location}
              </Text>
            </View>

            <View className="flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <Clock
                  size={14}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                  style={{ marginRight: 4 }}
                />
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatTimeAgo(news.publishedAt)}
                </Text>
              </View>

              <View className="flex-row items-center ml-3">
                <Eye
                  size={14}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                  style={{ marginRight: 4 }}
                />
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatViewCount(news.viewCount)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default variant
  return (
    <TouchableOpacity
      className={`rounded-lg overflow-hidden mb-3 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } ${className}`}
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={news.title}
    >
      <Image
        source={{ uri: news.imageUrl }}
        className="w-full h-48"
        resizeMode="cover"
      />

      <View className="p-3">
        <View className="flex-row items-center mb-2">
          <View className={`px-2 py-1 rounded-full ${getCategoryColor(news.category)}`}>
            <Text className="text-white text-xs font-semibold uppercase">
              {news.category}
            </Text>
          </View>
          {news.isBreakingNews && (
            <View className="ml-2 bg-red-600 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">BREAKING</Text>
            </View>
          )}
        </View>

        <Text
          className={`text-base font-bold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          numberOfLines={2}
        >
          {news.title}
        </Text>

        <Text
          className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          numberOfLines={2}
        >
          {news.description}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MapPin
              size={12}
              color={isDark ? '#9CA3AF' : '#6B7280'}
              style={{ marginRight: 4 }}
            />
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {news.location}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Clock
              size={12}
              color={isDark ? '#9CA3AF' : '#6B7280'}
              style={{ marginRight: 4 }}
            />
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTimeAgo(news.publishedAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
