/**
 * NoteCard Component
 *
 * Displays a single note card with:
 * - Title and content preview
 * - Color indicator
 * - Pin indicator
 * - Timestamp
 * - Touch feedback
 * - Theme support
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pin, Trash2, Edit } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Note } from '@/types/note.types';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onTogglePin?: () => void;
}

export function NoteCard({
  note,
  onPress,
  onDelete,
  onEdit,
  onTogglePin,
}: NoteCardProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getColorStyle = () => {
    if (!note.color || note.color === 'default') {
      return isDark ? 'bg-gray-800' : 'bg-white';
    }

    const colorMap: Record<string, string> = {
      yellow: isDark ? 'bg-yellow-900/30' : 'bg-yellow-100',
      green: isDark ? 'bg-green-900/30' : 'bg-green-100',
      blue: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
      pink: isDark ? 'bg-pink-900/30' : 'bg-pink-100',
      purple: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
      red: isDark ? 'bg-red-900/30' : 'bg-red-100',
    };

    return colorMap[note.color] || (isDark ? 'bg-gray-800' : 'bg-white');
  };

  return (
    <TouchableOpacity
      className={`rounded-xl p-4 mb-3 ${getColorStyle()} border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Note: ${note.title}`}
    >
      {/* Header with Pin and Delete */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center">
            {note.isPinned && (
              <Pin
                size={16}
                color={isDark ? '#FCD34D' : '#F59E0B'}
                fill={isDark ? '#FCD34D' : '#F59E0B'}
                className="mr-2"
              />
            )}
            <Text
              className={`text-lg font-bold flex-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              numberOfLines={2}
            >
              {note.title}
            </Text>
          </View>
        </View>

        <View className="flex-row">
          {onTogglePin && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              className="p-1 mr-1"
              accessible
              accessibilityRole="button"
              accessibilityLabel={note.isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin
                size={18}
                color={isDark ? '#9CA3AF' : '#6B7280'}
                fill={note.isPinned ? (isDark ? '#9CA3AF' : '#6B7280') : 'none'}
              />
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 mr-1"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Edit note"
            >
              <Edit size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Delete note"
            >
              <Trash2 size={18} color={isDark ? '#EF4444' : '#DC2626'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content Preview */}
      <Text
        className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        numberOfLines={4}
      >
        {note.content}
      </Text>

      {/* Footer with Category and Date */}
      <View className="flex-row justify-between items-center">
        {note.category && (
          <View
            className={`px-2 py-1 rounded-full ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {note.category}
            </Text>
          </View>
        )}
        <Text
          className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} ${
            !note.category ? 'ml-auto' : ''
          }`}
        >
          {formatDate(note.updatedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
