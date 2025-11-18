import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useSurveyStore } from '@/store/surveyStore';
import { SurveyCard } from '@/components/survey/SurveyCard';
import { SurveyForm } from '@/components/survey/SurveyForm';
import { SurveyDetail } from '@/components/survey/SurveyDetail';
import { LucideIcon } from '@/components/shared/LucideIcon';
import { Survey, LivestockType } from '@/types/survey.types';

export default function HomeScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const user = useAuthStore((state) => state.user);
  const { surveys, loadSurveys, addSurvey, updateSurvey, deleteSurvey, filterLivestock, setFilterLivestock } = useSurveyStore();

  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSurveys();
  }, []);

  const filteredSurveys = useMemo(() => {
    if (!filterLivestock) return surveys;
    return surveys.filter((s) => s.livestockType === filterLivestock);
  }, [surveys, filterLivestock]);

  const stats = useMemo(() => {
    const total = surveys.length;
    const byType = surveys.reduce((acc, survey) => {
      acc[survey.livestockType] = (acc[survey.livestockType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const totalAnimals = surveys.reduce((sum, survey) => sum + survey.quantity, 0);

    return { total, byType, totalAnimals };
  }, [surveys]);

  const handleAddSurvey = () => {
    setEditingSurvey(null);
    setFormVisible(true);
  };

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setFormVisible(true);
  };

  const handleDeleteSurvey = (id: string) => {
    Alert.alert(
      'Hapus Survey',
      'Apakah Anda yakin ingin menghapus survey ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteSurvey(id) },
      ]
    );
  };

  const handleSaveSurvey = async (input: any) => {
    if (editingSurvey) {
      await updateSurvey(editingSurvey.id, input);
    } else {
      await addSurvey(input, user?.id || 'unknown', user?.name || 'Unknown User');
    }
  };

  const handlePressSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setDetailVisible(true);
  };

  const livestockFilters: Array<{ value: LivestockType | null; label: string }> = [
    { value: null, label: 'Semua' },
    { value: 'sapi', label: 'Sapi' },
    { value: 'kambing', label: 'Kambing' },
    { value: 'ayam', label: 'Ayam' },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header */}
      <View className="p-4 pb-2">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Survey Peternakan
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.name || 'Surveyor'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAddSurvey}
            className="bg-blue-500 p-3 rounded-full"
            style={{
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <LucideIcon name="Plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2 mb-4">
          <View className={`flex-1 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Survey
            </Text>
          </View>
          <View className={`flex-1 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold text-blue-500`}>
              {stats.totalAnimals}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Ternak
            </Text>
          </View>
          <View className={`flex-1 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold text-green-500`}>
              {Object.keys(stats.byType).length}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Jenis
            </Text>
          </View>
        </View>

        {/* Filter */}
        <View className="flex-row gap-2 mb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {livestockFilters.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                onPress={() => setFilterLivestock(filter.value)}
                className={`px-4 py-2 rounded-lg mr-2 ${
                  filterLivestock === filter.value
                    ? 'bg-blue-500'
                    : isDark
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    filterLivestock === filter.value
                      ? 'text-white'
                      : isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Survey List */}
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <SurveyCard
            survey={item}
            onEdit={handleEditSurvey}
            onDelete={handleDeleteSurvey}
            onPress={handlePressSurvey}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <LucideIcon
              name="ClipboardList"
              size={64}
              color={isDark ? '#4B5563' : '#D1D5DB'}
            />
            <Text className={`text-lg mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {filterLivestock
                ? 'Tidak ada survey untuk filter ini'
                : 'Belum ada survey. Mulai sekarang!'}
            </Text>
          </View>
        }
      />

      {/* Form Modal */}
      <SurveyForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingSurvey(null);
        }}
        onSave={handleSaveSurvey}
        editSurvey={editingSurvey}
      />

      {/* Detail Modal */}
      <SurveyDetail
        visible={detailVisible}
        survey={selectedSurvey}
        onClose={() => {
          setDetailVisible(false);
          setSelectedSurvey(null);
        }}
      />
    </View>
  );
}
