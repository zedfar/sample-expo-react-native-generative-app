import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Survey } from '@/types/survey.types';
import { useThemeStore } from '@/store/themeStore';
import { LucideIcon } from '@/components/shared/LucideIcon';

interface SurveyCardProps {
  survey: Survey;
  onEdit: (survey: Survey) => void;
  onDelete: (id: string) => void;
  onPress: (survey: Survey) => void;
}

export function SurveyCard({ survey, onEdit, onDelete, onPress }: SurveyCardProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const getLivestockIcon = (type: string): any => {
    const icons: Record<string, any> = {
      sapi: 'Beef',
      kambing: 'Rabbit',
      domba: 'Rabbit',
      ayam: 'Bird',
      bebek: 'Bird',
      kerbau: 'Beef',
      lainnya: 'Sparkles',
    };
    return icons[type] || 'Sparkles';
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'sehat':
        return 'text-green-500';
      case 'sakit':
        return 'text-red-500';
      case 'karantina':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(survey)}
      className={`p-4 rounded-lg mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-blue-500 p-3 rounded-full mr-3">
            <LucideIcon name={getLivestockIcon(survey.livestockType)} size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {survey.farmName}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {survey.farmerName}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => onEdit(survey)} className="p-2">
            <LucideIcon name="Edit" size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(survey.id)} className="p-2">
            <LucideIcon name="Trash2" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-2">
        <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
            {survey.livestockType}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {survey.quantity} ekor
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-semibold capitalize ${getHealthStatusColor(survey.healthStatus)}`}>
            {survey.healthStatus}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <LucideIcon name="MapPin" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {survey.location.village}, {survey.location.district}
          </Text>
        </View>
        <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {new Date(survey.surveyDate).toLocaleDateString('id-ID')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
