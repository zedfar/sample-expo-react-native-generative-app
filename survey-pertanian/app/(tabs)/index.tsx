import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useSurveyStore } from '@/store/surveyStore';
import { Card } from '@/components/common/Card';
import { Sprout, TrendingUp, MapPin, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const user = useAuthStore((state) => state.user);
  const { surveys, loadSurveys } = useSurveyStore();

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSurveys();
  }, []);

  const totalSurveys = surveys.length;
  const totalArea = surveys.reduce((sum, s) => sum + s.field.area, 0);
  const uniqueFarmers = new Set(surveys.map((s) => s.farmerId)).size;

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <View
      style={[
        styles.statCard,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#111827' }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
    >
      <SafeAreaView className="p-4">
        <View style={styles.header}>
          <Sprout size={40} color="#10B981" />
          <Text className={`text-2xl font-bold mt-2 mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Selamat Datang, {user?.name || 'User'}!
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Aplikasi Survey Pertanian
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon={TrendingUp}
            label="Total Survey"
            value={totalSurveys}
            color="#10B981"
          />
          <StatCard
            icon={MapPin}
            label="Total Lahan"
            value={`${totalArea.toFixed(1)} ha`}
            color="#3B82F6"
          />
          <StatCard
            icon={Users}
            label="Petani"
            value={uniqueFarmers}
            color="#F59E0B"
          />
        </View>

        <Card className="mb-4">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tentang Aplikasi
          </Text>
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Aplikasi ini membantu petugas survey untuk mengumpulkan data pertanian dari petani, termasuk informasi lahan, jenis tanaman, dan hasil panen.
          </Text>
        </Card>

        <Card>
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Fitur Utama
          </Text>
          <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            • Buat survey lahan pertanian{'\n'}
            • Catat data petani dan hasil panen{'\n'}
            • Lihat riwayat survey{'\n'}
            • Data tersimpan secara lokal{'\n'}
            • Mendukung mode gelap/terang
          </Text>
        </Card>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
