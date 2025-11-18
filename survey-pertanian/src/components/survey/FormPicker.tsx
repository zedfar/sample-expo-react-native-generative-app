import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { ChevronDown } from 'lucide-react-native';

interface FormPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

export function FormPicker({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Pilih...',
  required = false,
}: FormPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const handleSelect = (option: string) => {
    onValueChange(option);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { color: isDark ? '#F3F4F6' : '#374151' },
        ]}
      >
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[
          styles.picker,
          {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderColor: isDark ? '#374151' : '#D1D5DB',
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.pickerText,
            { color: value ? (isDark ? '#FFFFFF' : '#000000') : (isDark ? '#9CA3AF' : '#6B7280') },
          ]}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? '#F3F4F6' : '#111827' },
                ]}
              >
                {label}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item === value && styles.selectedOption,
                    {
                      backgroundColor:
                        item === value
                          ? isDark ? '#374151' : '#E5E7EB'
                          : 'transparent',
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isDark ? '#F3F4F6' : '#111827',
                        fontWeight: item === value ? '600' : '400',
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  selectedOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
  },
});
