import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Survey } from '@/types/survey.types';
import { useThemeStore } from '@/store/themeStore';
import { LucideIcon } from '@/components/shared/LucideIcon';

interface SurveyDetailProps {
  visible: boolean;
  survey: Survey | null;
  onClose: () => void;
}

export function SurveyDetail({ visible, survey, onClose }: SurveyDetailProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  if (!survey) return null;

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View className="mb-4">
      <Text className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {label}
      </Text>
      <Text className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View
          className={`rounded-t-3xl p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          style={{ maxHeight: '85%' }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Detail Survey
              </Text>
              <TouchableOpacity onPress={onClose}>
                <LucideIcon name="X" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            {/* Farm Info */}
            <View className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Informasi Peternakan
              </Text>
              <DetailRow label="Nama Peternakan" value={survey.farmName} />
              <DetailRow label="Nama Peternak" value={survey.farmerName} />
            </View>

            {/* Location */}
            <View className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Lokasi
              </Text>
              <DetailRow label="Provinsi" value={survey.location.province} />
              <DetailRow label="Kabupaten/Kota" value={survey.location.district} />
              <DetailRow label="Desa/Kelurahan" value={survey.location.village} />
            </View>

            {/* Livestock Data */}
            <View className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Data Ternak
              </Text>
              <DetailRow label="Jenis Ternak" value={survey.livestockType.toUpperCase()} />
              <DetailRow label="Jumlah" value={`${survey.quantity} ekor`} />
              <DetailRow label="Status Kesehatan" value={survey.healthStatus.toUpperCase()} />
              <DetailRow label="Metode Pakan" value={survey.feedingMethod.replace('-', ' ').toUpperCase()} />
            </View>

            {/* Survey Info */}
            <View className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Informasi Survey
              </Text>
              <DetailRow
                label="Tanggal Survey"
                value={new Date(survey.surveyDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              />
              <DetailRow label="Surveyor" value={survey.surveyorName} />
              {survey.notes && <DetailRow label="Catatan" value={survey.notes} />}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 p-4 rounded-lg"
            >
              <Text className="text-center font-semibold text-white">
                Tutup
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
