import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Todo } from '@/types/todo.types';
import { useThemeStore } from '@/store/themeStore';
import { LucideIcon } from '@/components/shared/LucideIcon';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <View
      className={`p-4 rounded-lg mb-3 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start">
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => onToggle(todo.id)}
          className="mr-3 mt-1"
        >
          <View
            className={`w-6 h-6 rounded border-2 items-center justify-center ${
              todo.completed
                ? 'bg-blue-500 border-blue-500'
                : isDark
                ? 'border-gray-600'
                : 'border-gray-300'
            }`}
          >
            {todo.completed && (
              <LucideIcon name="Check" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)} mr-2`} />
            <Text
              className={`flex-1 text-base font-semibold ${
                todo.completed
                  ? isDark
                    ? 'text-gray-500 line-through'
                    : 'text-gray-400 line-through'
                  : isDark
                  ? 'text-white'
                  : 'text-gray-900'
              }`}
            >
              {todo.title}
            </Text>
          </View>

          {todo.description && (
            <Text
              className={`text-sm mb-2 ${
                todo.completed
                  ? isDark
                    ? 'text-gray-600'
                    : 'text-gray-400'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              {todo.description}
            </Text>
          )}

          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {new Date(todo.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row ml-2">
          <TouchableOpacity
            onPress={() => onEdit(todo)}
            className="p-2"
          >
            <LucideIcon
              name="Edit"
              size={18}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(todo.id)}
            className="p-2"
          >
            <LucideIcon
              name="Trash2"
              size={18}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
