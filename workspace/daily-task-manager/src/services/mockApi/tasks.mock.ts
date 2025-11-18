// tasks.mock.ts
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '@/types/task.types';
import * as db from 'server/db.json';

let tasks: Task[] = [...(db.tasks as Task[])];

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

export async function get<T = any>(url: string, config?: { params?: TaskFilters }): Promise<T> {
  if (url === '/tasks') {
    const { params } = config || {};
    let filtered = [...tasks];

    if (params) {
      const { userId, status, search, priority, overdue, sortBy, limit = 10, page = 1 } = params;

      // Filter by userId
      if (userId) {
        filtered = filtered.filter(t => t.userId === userId);
      }

      // Filter by status
      if (status) {
        filtered = filtered.filter(t => t.status === status);
      }

      // Filter by search
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          t => t.title.toLowerCase().includes(q) ||
               t.description.toLowerCase().includes(q)
        );
      }

      // Filter by priority
      if (priority) {
        filtered = filtered.filter(t => t.priority === priority);
      }

      // Filter by overdue
      if (overdue) {
        const now = new Date();
        filtered = filtered.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate < now && t.status !== 'completed';
        });
      }

      // Sort
      if (sortBy === 'latest') {
        filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      } else if (sortBy === 'oldest') {
        filtered.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      } else if (sortBy === 'dueDate') {
        filtered.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      }

      // Pagination
      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit) as unknown as T;
    }

    return tasks as unknown as T;
  }

  // Get single task
  const match = url.match(/\/tasks\/(\w+)/);
  if (match) {
    const task = tasks.find(t => t.id === match[1]);
    if (!task) throw new Error('Task not found');
    return task as unknown as T;
  }

  // Get task stats
  if (url === '/tasks/stats') {
    const userId = config?.params?.userId;
    let userTasks = userId ? tasks.filter(t => t.userId === userId) : tasks;

    const now = new Date();
    const stats = {
      total: userTasks.length,
      pending: userTasks.filter(t => t.status === 'pending').length,
      inProgress: userTasks.filter(t => t.status === 'in_progress').length,
      completed: userTasks.filter(t => t.status === 'completed').length,
      overdue: userTasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate < now && t.status !== 'completed';
      }).length,
    };

    return stats as unknown as T;
  }

  throw new Error(`Unknown GET /tasks endpoint: ${url}`);
}

export async function post<T = any>(url: string, body?: CreateTaskDto & { userId: string }): Promise<T> {
  if (url === '/tasks') {
    if (!body) throw new Error('Task data is required');
    if (!body.userId) throw new Error('User ID is required');

    const newTask: Task = {
      id: String(Date.now()),
      title: body.title,
      description: body.description,
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      dueDate: body.dueDate,
      userId: body.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    return newTask as unknown as T;
  }

  throw new Error(`Unknown POST /tasks endpoint: ${url}`);
}

export async function put<T = any>(url: string, body: UpdateTaskDto): Promise<T> {
  const match = url.match(/\/tasks\/(\w+)/);
  if (match) {
    const id = match[1];
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');

    tasks[index] = {
      ...tasks[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return tasks[index] as unknown as T;
  }

  throw new Error(`Unknown PUT /tasks endpoint: ${url}`);
}

export async function del<T = any>(url: string): Promise<T> {
  const match = url.match(/\/tasks\/(\w+)/);
  if (match) {
    const id = match[1];
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');

    tasks.splice(index, 1);
    return { message: 'Task deleted successfully' } as unknown as T;
  }

  throw new Error(`Unknown DELETE /tasks endpoint: ${url}`);
}
