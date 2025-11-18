import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useTasks } from '@/hooks/useTasks';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Task } from '@/types/task.types';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { tasks, stats, loading, refreshing, error, refresh, updateTask, deleteTask } = useTasks();

  // Auth check - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  // Get status color
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '#10b981'; // green
      case 'in_progress':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  // Get priority color
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // orange
      default:
        return '#6b7280'; // gray
    }
  };

  // Check if task is overdue
  const isOverdue = (task: Task) => {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now && task.status !== 'completed';
  };

  // Handle task press
  const handleTaskPress = (task: Task) => {
    Alert.alert(
      task.title,
      task.description,
      [
        {
          text: task.status === 'completed' ? 'Mark Pending' : 'Mark Complete',
          onPress: async () => {
            try {
              await updateTask(task.id, {
                status: task.status === 'completed' ? 'pending' : 'completed',
              });
            } catch (err) {
              Alert.alert('Error', 'Failed to update task');
            }
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Task',
              'Are you sure you want to delete this task?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteTask(task.id);
                    } catch (err) {
                      Alert.alert('Error', 'Failed to delete task');
                    }
                  },
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading your tasks...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className="text-red-500 text-lg font-semibold mb-2">Error</Text>
        <Text className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={refresh}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header */}
      <View className={`px-4 py-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Hello, {user?.name}!
        </Text>
        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Here are your daily tasks
        </Text>
      </View>

      {/* Stats Cards */}
      {stats && (
        <View className="flex-row px-4 mt-4 gap-2">
          <View className={`flex-1 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total</Text>
          </View>
          <View className={`flex-1 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Text className="text-2xl font-bold text-green-500">{stats.completed}</Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Done</Text>
          </View>
          <View className={`flex-1 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Text className="text-2xl font-bold text-blue-500">{stats.inProgress}</Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active</Text>
          </View>
          <View className={`flex-1 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Text className="text-2xl font-bold text-red-500">{stats.overdue}</Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Overdue</Text>
          </View>
        </View>
      )}

      {/* Tasks List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className={`text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No tasks yet
            </Text>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Create your first task to get started
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleTaskPress(item)}
            className={`mx-4 mt-4 p-4 rounded-lg ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-row items-start mb-2">
              {item.status === 'completed' ? (
                <CheckCircle2 size={24} color={getStatusColor(item.status)} />
              ) : (
                <Circle size={24} color={getStatusColor(item.status)} />
              )}
              <View className="flex-1 ml-3">
                <Text
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-2 flex-wrap gap-2">
              <View
                className="px-2 py-1 rounded"
                style={{ backgroundColor: getPriorityColor(item.priority) + '20' }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: getPriorityColor(item.priority) }}
                >
                  {item.priority.toUpperCase()}
                </Text>
              </View>

              <View className="flex-row items-center">
                {isOverdue(item) ? (
                  <AlertCircle size={14} color="#ef4444" />
                ) : (
                  <Clock size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                )}
                <Text
                  className={`ml-1 text-xs ${
                    isOverdue(item)
                      ? 'text-red-500'
                      : isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {new Date(item.dueDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}
