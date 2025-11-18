import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/common/Card';

export default function HomeScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const user = useAuthStore((state) => state.user);

  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
    >
      <View className="p-4">
        <Text className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome, {user?.name || 'User'}!
        </Text>

        <Card className="mb-4">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Getting Started
          </Text>
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            This is a general-purpose boilerplate. Customize it for your specific app (News, Todo, Ecommerce, etc.)
          </Text>
        </Card>

        <Card>
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Next Steps
          </Text>
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            • Create your screens in src/screens{'\n'}
            • Add your services in src/services{'\n'}
            • Define your types in src/types{'\n'}
            • Build your components in src/components
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}
