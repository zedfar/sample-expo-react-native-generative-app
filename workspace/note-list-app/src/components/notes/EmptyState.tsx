/**
 * EmptyState Component
 *
 * Displays an empty state message when there are no notes
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { FileText } from 'lucide-react-native';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({ message, description }: EmptyStateProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 justify-center items-center px-6">
      <FileText
        size={64}
        color={isDark ? '#4b5563' : '#d1d5db'}
        strokeWidth={1.5}
      />
      <Text className={`text-lg font-semibold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {message || 'No notes yet'}
      </Text>
      <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {description || 'Tap the + button to create your first note'}
      </Text>
    </View>
  );
}
