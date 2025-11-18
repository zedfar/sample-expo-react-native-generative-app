import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Article } from '@/types/news.types';
import { useThemeStore } from '@/store/themeStore';
import { LucideIcon } from '@/components/shared/LucideIcon';

interface NewsCardProps {
  article: Article;
  onPress: (article: Article) => void;
  onBookmark: (id: string) => void;
}

export function NewsCard({ article, onPress, onBookmark }: NewsCardProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      teknologi: 'bg-blue-500',
      bisnis: 'bg-green-500',
      olahraga: 'bg-red-500',
      hiburan: 'bg-purple-500',
      kesehatan: 'bg-teal-500',
      politik: 'bg-orange-500',
      pendidikan: 'bg-yellow-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(article)}
      className={`rounded-lg mb-4 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Image */}
      {article.imageUrl && (
        <Image
          source={{ uri: article.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}

      <View className="p-4">
        {/* Category & Bookmark */}
        <View className="flex-row justify-between items-center mb-2">
          <View className={`${getCategoryColor(article.category)} px-3 py-1 rounded-full`}>
            <Text className="text-white text-xs font-bold uppercase">
              {article.category}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onBookmark(article.id);
            }}
            className="p-1"
          >
            <LucideIcon
              name={article.isBookmarked ? 'Bookmark' : 'BookmarkPlus'}
              size={20}
              color={article.isBookmarked ? '#EAB308' : isDark ? '#9CA3AF' : '#6B7280'}
              fill={article.isBookmarked ? '#EAB308' : 'none'}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text
          className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          numberOfLines={2}
        >
          {article.title}
        </Text>

        {/* Summary */}
        <Text
          className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          numberOfLines={2}
        >
          {article.summary}
        </Text>

        {/* Meta Info */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center">
              <LucideIcon name="Clock" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {article.readTime} min
              </Text>
            </View>
            <View className="flex-row items-center">
              <LucideIcon name="Eye" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {article.views}
              </Text>
            </View>
          </View>
          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {new Date(article.publishedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
