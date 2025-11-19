import { api } from './api';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStats, TaskStatus } from '@/types/task.types';
import { API_CONFIG } from '@/utils/constants';
import { mockApi } from './mockApi';

interface TaskFilters {
  userId?: string;
  status?: TaskStatus;
  search?: string;
  priority?: string;
  overdue?: boolean;
  sortBy?: 'latest' | 'oldest' | 'dueDate' | 'priority';
  limit?: number;
  page?: number;
}

class TaskService {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Task[]>('/tasks', { params: filters });
    }
    return await api.get<Task[]>('/tasks', { params: filters });
  }

  async getTaskById(id: string): Promise<Task> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Task>(`/tasks/${id}`);
    }
    return await api.get<Task>(`/tasks/${id}`);
  }

  async getTaskStats(userId?: string): Promise<TaskStats> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<TaskStats>('/tasks/stats', { params: { userId } });
    }
    return await api.get<TaskStats>('/tasks/stats', { params: { userId } });
  }

  async createTask(data: CreateTaskDto, userId: string): Promise<Task> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.post<Task>('/tasks', { ...data, userId });
    }
    return await api.post<Task>('/tasks', data);
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.put<Task>(`/tasks/${id}`, data);
    }
    return await api.put<Task>(`/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.delete<{ message: string }>(`/tasks/${id}`);
    }
    return await api.delete<{ message: string }>(`/tasks/${id}`);
  }

  async getUserTasks(userId: string, filters?: Omit<TaskFilters, 'userId'>): Promise<Task[]> {
    return this.getTasks({ ...filters, userId });
  }

  async getOverdueTasks(userId: string): Promise<Task[]> {
    return this.getTasks({ userId, overdue: true });
  }

  async getTasksByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return this.getTasks({ userId, status });
  }
}

export const taskService = new TaskService();
