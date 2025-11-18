/**
 * NoteCard Component
 *
 * Displays a note in a card format with:
 * - Title and content preview
 * - Category badge
 * - Pin indicator
 * - Color accent
 * - Theme support
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Note } from '@/types/note.types';
import { Pin } from 'lucide-react-native';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      personal: 'Personal',
      work: 'Work',
      ideas: 'Ideas',
      todo: 'To Do',
      other: 'Other',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: '#3b82f6',
      work: '#ef4444',
      ideas: '#8b5cf6',
      todo: '#f59e0b',
      other: '#10b981',
    };
    return colors[category] || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      className={`rounded-lg p-4 mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      style={{
        borderLeftWidth: 4,
        borderLeftColor: note.color || getCategoryColor(note.category),
      }}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Note: ${note.title}`}
    >
      {/* Header with category and pin */}
      <View className="flex-row justify-between items-center mb-2">
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: `${getCategoryColor(note.category)}20` }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: getCategoryColor(note.category) }}
          >
            {getCategoryLabel(note.category)}
          </Text>
        </View>

        {note.isPinned && (
          <Pin size={16} color={isDark ? '#facc15' : '#f59e0b'} fill={isDark ? '#facc15' : '#f59e0b'} />
        )}
      </View>

      {/* Title */}
      <Text
        className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
        numberOfLines={2}
      >
        {note.title}
      </Text>

      {/* Content preview */}
      <Text
        className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        numberOfLines={3}
      >
        {note.content}
      </Text>

      {/* Footer with date */}
      <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        {formatDate(note.updatedAt)}
      </Text>
    </TouchableOpacity>
  );
}
