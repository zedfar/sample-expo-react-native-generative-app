import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStats, TaskStatus, TaskPriority } from '@/types/task.types';
import { taskService } from '@/services/taskService';
import { useAuthStore } from '@/store/authStore';

interface UseTasksOptions {
  status?: TaskStatus;
  autoFetch?: boolean;
}

interface UseTasksReturn {
  tasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  refresh: () => Promise<void>;
  createTask: (data: { title: string; description: string; status?: TaskStatus; priority?: TaskPriority; dueDate: string }) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const { status, autoFetch = true } = options;
  const { user } = useAuthStore();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Fetch tasks and stats in parallel
      const [tasksData, statsData] = await Promise.all([
        status
          ? taskService.getTasksByStatus(user.id, status)
          : taskService.getUserTasks(user.id, { sortBy: 'dueDate' }),
        taskService.getTaskStats(user.id),
      ]);

      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, status]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (data: { title: string; description: string; status?: TaskStatus; priority?: TaskPriority; dueDate: string }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await taskService.createTask(data, user.id);
      await fetchTasks(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      throw new Error(errorMessage);
    }
  }, [user, fetchTasks]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    try {
      await taskService.updateTask(id, data);
      await fetchTasks(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      throw new Error(errorMessage);
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await fetchTasks(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      throw new Error(errorMessage);
    }
  }, [fetchTasks]);

  useEffect(() => {
    if (autoFetch && user) {
      fetchTasks();
    }
  }, [autoFetch, user, fetchTasks]);

  return {
    tasks,
    stats,
    loading,
    refreshing,
    error,
    fetchTasks,
    refresh,
    createTask,
    updateTask,
    deleteTask,
  };
}
