import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Moon, Sun, LogOut, Mail, MapPin, Phone, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Profile Header */}
          <Card className="mb-4 items-center">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="w-24 h-24 rounded-full mb-4"
              />
            ) : (
              <View className={`w-24 h-24 rounded-full mb-4 items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <User size={40} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
            )}
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {user?.name}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.email}
            </Text>
            {user?.role && (
              <View className={`mt-2 px-3 py-1 rounded-full ${
                user.role === 'admin' ? 'bg-blue-500' : 'bg-gray-500'
              }`}>
                <Text className="text-white text-xs font-semibold uppercase">
                  {user.role}
                </Text>
              </View>
            )}
          </Card>

          {/* Profile Information */}
          <Card className="mb-4">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Information
            </Text>

            {user?.about && (
              <View className="mb-4">
                <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  About
                </Text>
                <Text className={isDark ? 'text-white' : 'text-gray-900'}>
                  {user.about}
                </Text>
              </View>
            )}

            {user?.email && (
              <View className="flex-row items-center mb-3">
                <Mail size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className={`ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.email}
                </Text>
              </View>
            )}

            {user?.phone && (
              <View className="flex-row items-center mb-3">
                <Phone size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className={`ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.phone}
                </Text>
              </View>
            )}

            {user?.location && (
              <View className="flex-row items-center">
                <MapPin size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className={`ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.location}
                </Text>
              </View>
            )}
          </Card>

          {/* Appearance Settings */}
          <Card className="mb-4">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Appearance
            </Text>

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

          {/* Logout */}
          <Card>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="secondary"
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
