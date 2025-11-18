import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Survey, CreateSurveyInput, LivestockType } from '@/types/survey.types';
import { useThemeStore } from '@/store/themeStore';
import { LucideIcon } from '@/components/shared/LucideIcon';

interface SurveyFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (input: CreateSurveyInput) => void;
  editSurvey?: Survey | null;
}

const livestockOptions: { value: LivestockType; label: string }[] = [
  { value: 'sapi', label: 'Sapi' },
  { value: 'kambing', label: 'Kambing' },
  { value: 'domba', label: 'Domba' },
  { value: 'ayam', label: 'Ayam' },
  { value: 'bebek', label: 'Bebek' },
  { value: 'kerbau', label: 'Kerbau' },
  { value: 'lainnya', label: 'Lainnya' },
];

export function SurveyForm({ visible, onClose, onSave, editSurvey }: SurveyFormProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [farmerName, setFarmerName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [livestockType, setLivestockType] = useState<LivestockType>('sapi');
  const [quantity, setQuantity] = useState('');
  const [healthStatus, setHealthStatus] = useState<'sehat' | 'sakit' | 'karantina'>('sehat');
  const [feedingMethod, setFeedingMethod] = useState<'rumput' | 'pakan-pabrik' | 'campuran'>('rumput');
  const [notes, setNotes] = useState('');
  const [surveyDate, setSurveyDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editSurvey) {
      setFarmerName(editSurvey.farmerName);
      setFarmName(editSurvey.farmName);
      setProvince(editSurvey.location.province);
      setDistrict(editSurvey.location.district);
      setVillage(editSurvey.location.village);
      setLivestockType(editSurvey.livestockType);
      setQuantity(editSurvey.quantity.toString());
      setHealthStatus(editSurvey.healthStatus);
      setFeedingMethod(editSurvey.feedingMethod);
      setNotes(editSurvey.notes || '');
      setSurveyDate(editSurvey.surveyDate);
    } else {
      resetForm();
    }
  }, [editSurvey, visible]);

  const resetForm = () => {
    setFarmerName('');
    setFarmName('');
    setProvince('');
    setDistrict('');
    setVillage('');
    setLivestockType('sapi');
    setQuantity('');
    setHealthStatus('sehat');
    setFeedingMethod('rumput');
    setNotes('');
    setSurveyDate(new Date().toISOString().split('T')[0]);
  };

  const handleSave = () => {
    if (!farmerName.trim() || !farmName.trim() || !province.trim() || !district.trim() || !village.trim() || !quantity) {
      return;
    }

    onSave({
      farmerName: farmerName.trim(),
      farmName: farmName.trim(),
      location: {
        province: province.trim(),
        district: district.trim(),
        village: village.trim(),
      },
      livestockType,
      quantity: parseInt(quantity),
      healthStatus,
      feedingMethod,
      notes: notes.trim() || undefined,
      surveyDate,
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View
          className={`rounded-t-3xl p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          style={{ maxHeight: '90%' }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editSurvey ? 'Edit Survey' : 'Survey Baru'}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <LucideIcon name="X" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            {/* Farmer Info */}
            <Text className={`text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Informasi Peternak
            </Text>

            <View className="mb-3">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Nama Peternak *
              </Text>
              <TextInput
                value={farmerName}
                onChangeText={setFarmerName}
                placeholder="Masukkan nama peternak"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Nama Peternakan *
              </Text>
              <TextInput
                value={farmName}
                onChangeText={setFarmName}
                placeholder="Masukkan nama peternakan"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            {/* Location */}
            <Text className={`text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Lokasi
            </Text>

            <View className="mb-3">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Provinsi *
              </Text>
              <TextInput
                value={province}
                onChangeText={setProvince}
                placeholder="Contoh: Jawa Timur"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            <View className="mb-3">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Kabupaten/Kota *
              </Text>
              <TextInput
                value={district}
                onChangeText={setDistrict}
                placeholder="Contoh: Malang"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Desa/Kelurahan *
              </Text>
              <TextInput
                value={village}
                onChangeText={setVillage}
                placeholder="Contoh: Sumberagung"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            {/* Livestock Info */}
            <Text className={`text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Data Ternak
            </Text>

            <View className="mb-3">
              <Text className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Jenis Ternak *
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {livestockOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setLivestockType(option.value)}
                    className={`px-4 py-2 rounded-lg ${
                      livestockType === option.value
                        ? 'bg-blue-500'
                        : isDark
                        ? 'bg-gray-800'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        livestockType === option.value
                          ? 'text-white'
                          : isDark
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-3">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Jumlah (ekor) *
              </Text>
              <TextInput
                value={quantity}
                onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ''))}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            <View className="mb-3">
              <Text className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Status Kesehatan
              </Text>
              <View className="flex-row gap-2">
                {(['sehat', 'sakit', 'karantina'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setHealthStatus(status)}
                    className={`flex-1 p-3 rounded-lg ${
                      healthStatus === status
                        ? status === 'sehat'
                          ? 'bg-green-500'
                          : status === 'sakit'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                        : isDark
                        ? 'bg-gray-800'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold capitalize ${
                        healthStatus === status ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-3">
              <Text className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Metode Pakan
              </Text>
              <View className="flex-row gap-2">
                {(['rumput', 'pakan-pabrik', 'campuran'] as const).map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setFeedingMethod(method)}
                    className={`flex-1 p-3 rounded-lg ${
                      feedingMethod === method ? 'bg-blue-500' : isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-center text-xs font-semibold capitalize ${
                        feedingMethod === method ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {method.replace('-', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-3">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tanggal Survey *
              </Text>
              <TextInput
                value={surveyDate}
                onChangeText={setSurveyDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            <View className="mb-6">
              <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Catatan (Opsional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Tambahkan catatan..."
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleClose}
                className={`flex-1 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
              >
                <Text className={`text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!farmerName.trim() || !farmName.trim() || !quantity}
                className={`flex-1 p-4 rounded-lg ${
                  farmerName.trim() && farmName.trim() && quantity
                    ? 'bg-blue-500'
                    : isDark
                    ? 'bg-gray-800'
                    : 'bg-gray-300'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    farmerName.trim() && farmName.trim() && quantity
                      ? 'text-white'
                      : isDark
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  {editSurvey ? 'Update' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
