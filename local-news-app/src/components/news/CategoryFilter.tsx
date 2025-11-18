/**
 * CategoryFilter Component
 * Component untuk filter berita berdasarkan kategori
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { NewsCategory } from '@/types/news.types';

interface CategoryFilterProps {
  selectedCategory: NewsCategory | null;
  onSelectCategory: (category: NewsCategory | null) => void;
  className?: string;
}

const categories: Array<{ value: NewsCategory | null; label: string }> = [
  { value: null, label: 'Semua' },
  { value: 'politik', label: 'Politik' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'hiburan', label: 'Hiburan' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'kriminal', label: 'Kriminal' },
];

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  className = '',
}: CategoryFilterProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <View className={className}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.value;

          return (
            <TouchableOpacity
              key={category.label}
              className={`px-4 py-2 rounded-full mr-2 ${
                isSelected
                  ? 'bg-blue-600'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-gray-200'
              }`}
              onPress={() => onSelectCategory(category.value)}
              activeOpacity={0.7}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Filter ${category.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                className={`text-sm font-semibold ${
                  isSelected
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
