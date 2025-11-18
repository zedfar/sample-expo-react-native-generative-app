import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function Loading({ text, size = 'large', fullScreen = false }: LoadingProps) {
  const { isDark } = useTheme();

  const primaryColor = '#10B981';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const backgroundColor = isDark ? '#000' : '#F9FAFB';

  const content = (
    <>
      <ActivityIndicator size={size} color={primaryColor} />
      {text && (
        <Text className="mt-4 text-base" style={{ color: textSecondary }}>
          {text}
        </Text>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor }}
      >
        {content}
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-8">
      {content}
    </View>
  );
}