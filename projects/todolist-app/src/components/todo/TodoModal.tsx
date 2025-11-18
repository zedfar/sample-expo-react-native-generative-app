import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Todo, CreateTodoInput } from '@/types/todo.types';
import { useThemeStore } from '@/store/themeStore';
import { LucideIcon } from '@/components/shared/LucideIcon';

interface TodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (input: CreateTodoInput) => void;
  editTodo?: Todo | null;
}

export function TodoModal({ visible, onClose, onSave, editTodo }: TodoModalProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description || '');
      setPriority(editTodo.priority);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  }, [editTodo, visible]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View
          className={`rounded-t-3xl p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          style={{ maxHeight: '80%' }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editTodo ? 'Edit Todo' : 'New Todo'}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <LucideIcon name="X" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View className="mb-4">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Title *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter todo title"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                className={`p-4 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description (Optional)
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className={`p-4 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Priority Selection */}
            <View className="mb-6">
              <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Priority
              </Text>
              <View className="flex-row gap-3">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    className={`flex-1 p-3 rounded-lg border-2 ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-red-500 border-red-500'
                          : p === 'medium'
                          ? 'bg-yellow-500 border-yellow-500'
                          : 'bg-green-500 border-green-500'
                        : isDark
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold capitalize ${
                        priority === p ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleClose}
                className={`flex-1 p-4 rounded-lg ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                <Text className={`text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!title.trim()}
                className={`flex-1 p-4 rounded-lg ${
                  title.trim() ? 'bg-blue-500' : isDark ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              >
                <Text className={`text-center font-semibold ${title.trim() ? 'text-white' : isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {editTodo ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
