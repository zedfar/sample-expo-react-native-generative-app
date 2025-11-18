import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Moon, Sun, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { colorScheme, setColorScheme } = useThemeStore();

  const isDark = colorScheme === 'dark';

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const toggleTheme = () => {
    setColorScheme(isDark ? 'light' : 'dark');
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
    >
      <View className="p-4">
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Appearance
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            className={`flex-row items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <View className="flex-row items-center">
              {isDark ? (
                <Moon size={20} color="#9CA3AF" />
              ) : (
                <Sun size={20} color="#F59E0B" />
              )}
              <Text className={`ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {isDark ? 'On' : 'Off'}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
          />
        </Card>
      </View>
    </ScrollView>
  );
}
