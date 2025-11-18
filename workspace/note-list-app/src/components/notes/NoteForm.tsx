/**
 * NoteForm Component
 *
 * Form for creating and editing notes with:
 * - Title and content inputs
 * - Category selection
 * - Color picker
 * - Pin toggle
 * - Theme support
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { NoteCategory, CreateNoteDto, Note } from '@/types/note.types';
import { Pin } from 'lucide-react-native';

interface NoteFormProps {
  initialData?: Note;
  onSubmit: (data: CreateNoteDto) => void;
  onCancel: () => void;
}

export function NoteForm({ initialData, onSubmit, onCancel }: NoteFormProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<NoteCategory>(initialData?.category || 'personal');
  const [color, setColor] = useState(initialData?.color || '#3b82f6');
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);

  const categories: { value: NoteCategory; label: string }[] = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'ideas', label: 'Ideas' },
    { value: 'todo', label: 'To Do' },
    { value: 'other', label: 'Other' },
  ];

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#10b981', // green
    '#ec4899', // pink
  ];

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      color,
      isPinned,
    });
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-4">
        {/* Title Input */}
        <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Title
        </Text>
        <TextInput
          className={`rounded-lg p-3 mb-4 text-base ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          style={{ borderWidth: 1, borderColor: isDark ? '#374151' : '#e5e7eb' }}
          placeholder="Enter note title"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={title}
          onChangeText={setTitle}
        />

        {/* Content Input */}
        <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Content
        </Text>
        <TextInput
          className={`rounded-lg p-3 mb-4 text-base ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          style={{ borderWidth: 1, borderColor: isDark ? '#374151' : '#e5e7eb', minHeight: 150 }}
          placeholder="Enter note content"
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* Category Selection */}
        <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Category
        </Text>
        <View className="flex-row flex-wrap mb-4">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                category === cat.value
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-white'
              }`}
              style={category !== cat.value ? { borderWidth: 1, borderColor: isDark ? '#374151' : '#e5e7eb' } : {}}
              onPress={() => setCategory(cat.value)}
            >
              <Text
                className={`text-sm font-semibold ${
                  category === cat.value
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color Selection */}
        <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Color
        </Text>
        <View className="flex-row flex-wrap mb-4">
          {colors.map((c) => (
            <TouchableOpacity
              key={c}
              className="mr-3 mb-3"
              onPress={() => setColor(c)}
            >
              <View
                className="w-10 h-10 rounded-full"
                style={{
                  backgroundColor: c,
                  borderWidth: color === c ? 3 : 2,
                  borderColor: color === c ? (isDark ? '#fff' : '#000') : 'transparent',
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Pin Toggle */}
        <TouchableOpacity
          className={`flex-row items-center p-4 rounded-lg mb-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          style={{ borderWidth: 1, borderColor: isDark ? '#374151' : '#e5e7eb' }}
          onPress={() => setIsPinned(!isPinned)}
        >
          <Pin
            size={20}
            color={isPinned ? (isDark ? '#facc15' : '#f59e0b') : (isDark ? '#9ca3af' : '#6b7280')}
            fill={isPinned ? (isDark ? '#facc15' : '#f59e0b') : 'transparent'}
          />
          <Text className={`ml-3 flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Pin this note
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-gray-500 rounded-lg p-4"
            onPress={onCancel}
          >
            <Text className="text-white text-center font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 rounded-lg p-4 ${
              !title.trim() || !content.trim() ? 'bg-gray-400' : 'bg-blue-500'
            }`}
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            <Text className="text-white text-center font-semibold">
              {initialData ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
