/**
 * NoteForm Component
 *
 * Form for creating and editing notes with:
 * - Title and content inputs
 * - Color picker
 * - Category selector
 * - Theme support
 * - Validation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Note, NoteColor, NOTE_COLORS } from '@/types/note.types';

interface NoteFormProps {
  note?: Note;
  onSave: (data: { title: string; content: string; color?: string; category?: string }) => void;
  onCancel: () => void;
}

const CATEGORIES = ['personal', 'work', 'ideas', 'todo', 'other'];

export function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedColor, setSelectedColor] = useState<NoteColor>(
    (note?.color as NoteColor) || 'default'
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    note?.category
  );

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
      category: selectedCategory,
    });
  };

  const ColorButton = ({ color, name }: { color: string; name: NoteColor }) => {
    const isSelected = selectedColor === name;
    return (
      <TouchableOpacity
        onPress={() => setSelectedColor(name)}
        className={`w-12 h-12 rounded-full mr-3 mb-3 items-center justify-center border-2 ${
          isSelected ? 'border-blue-500' : 'border-transparent'
        }`}
        style={{ backgroundColor: color }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Select ${name} color`}
        accessibilityState={{ selected: isSelected }}
      >
        {isSelected && (
          <View className="w-4 h-4 bg-blue-500 rounded-full" />
        )}
      </TouchableOpacity>
    );
  };

  const CategoryButton = ({ category }: { category: string }) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(isSelected ? undefined : category)}
        className={`px-4 py-2 rounded-full mr-2 mb-2 ${
          isSelected
            ? isDark
              ? 'bg-blue-900 border-blue-500'
              : 'bg-blue-100 border-blue-500'
            : isDark
            ? 'bg-gray-800 border-gray-600'
            : 'bg-gray-200 border-gray-300'
        } border`}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Select ${category} category`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text
          className={`${
            isSelected
              ? isDark
                ? 'text-blue-300'
                : 'text-blue-700'
              : isDark
              ? 'text-gray-300'
              : 'text-gray-700'
          }`}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View
        className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}
      >
        {/* Header */}
        <View
          className={`flex-row justify-between items-center px-4 py-4 border-b ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <TouchableOpacity
            onPress={onCancel}
            className="p-2"
            accessible
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <X size={24} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>

          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {note ? 'Edit Note' : 'New Note'}
          </Text>

          <TouchableOpacity
            onPress={handleSave}
            className={`flex-row items-center px-3 py-2 rounded-lg ${
              isDark ? 'bg-blue-900' : 'bg-blue-500'
            }`}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Save note"
          >
            <Save size={18} color="#FFF" />
            <Text className="text-white ml-2 font-semibold">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View className="mt-4">
            <Text
              className={`text-sm font-semibold mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter note title"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className={`text-lg font-semibold p-3 rounded-lg border ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              maxLength={100}
              accessible
              accessibilityLabel="Note title"
            />
          </View>

          {/* Content Input */}
          <View className="mt-4">
            <Text
              className={`text-sm font-semibold mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Content
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Enter note content"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              className={`p-3 rounded-lg border ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              style={{ minHeight: 150 }}
              accessible
              accessibilityLabel="Note content"
            />
          </View>

          {/* Color Picker */}
          <View className="mt-4">
            <Text
              className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Color
            </Text>
            <View className="flex-row flex-wrap">
              {Object.entries(NOTE_COLORS).map(([name, color]) => (
                <ColorButton key={name} color={color} name={name as NoteColor} />
              ))}
            </View>
          </View>

          {/* Category Selector */}
          <View className="mt-4 mb-6">
            <Text
              className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Category (Optional)
            </Text>
            <View className="flex-row flex-wrap">
              {CATEGORIES.map((category) => (
                <CategoryButton key={category} category={category} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
