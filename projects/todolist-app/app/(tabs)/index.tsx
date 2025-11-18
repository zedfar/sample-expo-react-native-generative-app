import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useTodoStore } from '@/store/todoStore';
import { TodoItem } from '@/components/todo/TodoItem';
import { TodoModal } from '@/components/todo/TodoModal';
import { LucideIcon } from '@/components/shared/LucideIcon';
import { Todo } from '@/types/todo.types';

export default function HomeScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const { todos, isLoading, filter, loadTodos, addTodo, updateTodo, deleteTodo, toggleTodo, setFilter, clearCompleted } = useTodoStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setModalVisible(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  const handleDeleteTodo = (id: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(id) },
      ]
    );
  };

  const handleSaveTodo = async (input: any) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, input);
    } else {
      await addTodo(input);
    }
  };

  const handleClearCompleted = () => {
    if (stats.completed === 0) return;

    Alert.alert(
      'Clear Completed',
      `Delete ${stats.completed} completed todo${stats.completed > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCompleted },
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header */}
      <View className="p-4 pb-2">
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            My Tasks
          </Text>
          <TouchableOpacity
            onPress={handleAddTodo}
            className="bg-blue-500 p-3 rounded-full"
            style={{
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <LucideIcon name="Plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2 mb-4">
          <View className={`flex-1 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total
            </Text>
          </View>
          <View className={`flex-1 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold text-blue-500`}>
              {stats.active}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Active
            </Text>
          </View>
          <View className={`flex-1 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold text-green-500`}>
              {stats.completed}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Done
            </Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View className="flex-row gap-2 mb-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`flex-1 p-3 rounded-lg ${
                filter === f
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-white'
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  filter === f
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={toggleTodo}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <LucideIcon
              name="CheckCircle2"
              size={64}
              color={isDark ? '#4B5563' : '#D1D5DB'}
            />
            <Text className={`text-lg mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {filter === 'completed'
                ? 'No completed todos yet'
                : filter === 'active'
                ? 'No active todos'
                : 'No todos yet. Create one!'}
            </Text>
          </View>
        }
      />

      {/* Clear Completed Button */}
      {stats.completed > 0 && filter !== 'active' && (
        <View className="p-4 pt-0">
          <TouchableOpacity
            onPress={handleClearCompleted}
            className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}
          >
            <Text className="text-center font-semibold text-red-500">
              Clear {stats.completed} Completed Todo{stats.completed > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add/Edit Modal */}
      <TodoModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editTodo={editingTodo}
      />
    </View>
  );
}
