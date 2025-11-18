import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { useSurveyStore } from '@/store/surveyStore';
import { useAuthStore } from '@/store/authStore';
import { FormInput } from '@/components/survey/FormInput';
import { FormPicker } from '@/components/survey/FormPicker';
import { Button } from '@/components/common/Button';
import {
  Survey,
  SOIL_TYPES,
  IRRIGATION_TYPES,
  CROP_TYPES,
  YIELD_UNITS,
} from '@/types/survey';
import { CheckCircle } from 'lucide-react-native';

export default function SurveyScreen() {
  const router = useRouter();
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const addSurvey = useSurveyStore((state) => state.addSurvey);
  const user = useAuthStore((state) => state.user);

  const isDark = colorScheme === 'dark';

  // Form state
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [fieldArea, setFieldArea] = useState('');
  const [soilType, setSoilType] = useState('');
  const [irrigationType, setIrrigationType] = useState('');
  const [cropName, setCropName] = useState('');
  const [cropVariety, setCropVariety] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [yieldUnit, setYieldUnit] = useState<'kg' | 'ton' | 'quintal'>('kg');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!farmerName.trim()) {
      Alert.alert('Error', 'Nama petani harus diisi');
      return false;
    }
    if (!fieldName.trim()) {
      Alert.alert('Error', 'Nama lahan harus diisi');
      return false;
    }
    if (!fieldArea.trim() || isNaN(parseFloat(fieldArea))) {
      Alert.alert('Error', 'Luas lahan harus berupa angka');
      return false;
    }
    if (!soilType) {
      Alert.alert('Error', 'Jenis tanah harus dipilih');
      return false;
    }
    if (!irrigationType) {
      Alert.alert('Error', 'Jenis irigasi harus dipilih');
      return false;
    }
    if (!cropName) {
      Alert.alert('Error', 'Jenis tanaman harus dipilih');
      return false;
    }
    if (!cropVariety.trim()) {
      Alert.alert('Error', 'Varietas tanaman harus diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const survey: Survey = {
        id: Date.now().toString(),
        userId: user?.id || '',
        farmerId: Date.now().toString(),
        farmerName: farmerName.trim(),
        farmerPhone: farmerPhone.trim(),
        field: {
          id: Date.now().toString(),
          name: fieldName.trim(),
          area: parseFloat(fieldArea),
          location: {
            latitude: 0,
            longitude: 0,
          },
          soilType,
          irrigationType,
        },
        crops: [
          {
            id: Date.now().toString(),
            name: cropName,
            variety: cropVariety.trim(),
            plantingDate: plantingDate || new Date().toISOString(),
            expectedYield: expectedYield ? parseFloat(expectedYield) : undefined,
            unit: yieldUnit,
          },
        ],
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'submitted',
      };

      await addSurvey(survey);

      Alert.alert(
        'Berhasil',
        'Survey pertanian berhasil disimpan',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFarmerName('');
              setFarmerPhone('');
              setFieldName('');
              setFieldArea('');
              setSoilType('');
              setIrrigationType('');
              setCropName('');
              setCropVariety('');
              setPlantingDate('');
              setExpectedYield('');
              setYieldUnit('kg');
              setNotes('');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting survey:', error);
      Alert.alert('Error', 'Gagal menyimpan survey. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <CheckCircle size={32} color="#10B981" />
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Survey Pertanian
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Isi data lahan dan hasil panen petani
          </Text>
        </View>

        <View style={[styles.form, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F3F4F6' : '#111827' }]}>
            Data Petani
          </Text>

          <FormInput
            label="Nama Petani"
            value={farmerName}
            onChangeText={setFarmerName}
            placeholder="Masukkan nama petani"
            required
          />

          <FormInput
            label="Nomor Telepon"
            value={farmerPhone}
            onChangeText={setFarmerPhone}
            placeholder="08xxxxxxxxxx"
            keyboardType="phone-pad"
          />

          <Text style={[styles.sectionTitle, { color: isDark ? '#F3F4F6' : '#111827' }]}>
            Data Lahan
          </Text>

          <FormInput
            label="Nama Lahan"
            value={fieldName}
            onChangeText={setFieldName}
            placeholder="Contoh: Sawah Utara"
            required
          />

          <FormInput
            label="Luas Lahan (hektar)"
            value={fieldArea}
            onChangeText={setFieldArea}
            placeholder="Contoh: 2.5"
            keyboardType="numeric"
            required
          />

          <FormPicker
            label="Jenis Tanah"
            value={soilType}
            onValueChange={setSoilType}
            options={SOIL_TYPES}
            required
          />

          <FormPicker
            label="Jenis Irigasi"
            value={irrigationType}
            onValueChange={setIrrigationType}
            options={IRRIGATION_TYPES}
            required
          />

          <Text style={[styles.sectionTitle, { color: isDark ? '#F3F4F6' : '#111827' }]}>
            Data Tanaman
          </Text>

          <FormPicker
            label="Jenis Tanaman"
            value={cropName}
            onValueChange={setCropName}
            options={CROP_TYPES}
            required
          />

          <FormInput
            label="Varietas"
            value={cropVariety}
            onChangeText={setCropVariety}
            placeholder="Contoh: IR64, Hibrida"
            required
          />

          <FormInput
            label="Tanggal Tanam (opsional)"
            value={plantingDate}
            onChangeText={setPlantingDate}
            placeholder="DD/MM/YYYY"
          />

          <FormInput
            label="Perkiraan Hasil Panen (opsional)"
            value={expectedYield}
            onChangeText={setExpectedYield}
            placeholder="Contoh: 5000"
            keyboardType="numeric"
          />

          <FormPicker
            label="Satuan Hasil Panen"
            value={yieldUnit}
            onValueChange={(value) => setYieldUnit(value as 'kg' | 'ton' | 'quintal')}
            options={YIELD_UNITS.map((u) => u.label)}
          />

          <FormInput
            label="Catatan Tambahan (opsional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Tambahkan catatan jika diperlukan"
            multiline
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Simpan Survey"
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
