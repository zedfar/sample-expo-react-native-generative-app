import * as authHandlers from './auth.mock';
import * as userHandlers from './users.mock';
import * as taskHandlers from './tasks.mock';

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));

export const mockApi = {
  async get<T = any>(url: string, config?: any): Promise<T> {
    await delay();

    if (url.startsWith('/auth/')) {
      return authHandlers.get(url, config);
    }
    if (url.startsWith('/users')) {
      return userHandlers.get(url, config);
    }
    if (url.startsWith('/tasks')) {
      return taskHandlers.get(url, config);
    }

    throw new Error(`Unknown GET endpoint: ${url}`);
  },

  async post<T = any>(url: string, body?: any): Promise<T> {
    await delay();

    if (url.startsWith('/auth/')) {
      return authHandlers.post(url, body);
    }
    if (url.startsWith('/users')) {
      return userHandlers.post(url, body);
    }
    if (url.startsWith('/tasks')) {
      return taskHandlers.post(url, body);
    }

    throw new Error(`Unknown POST endpoint: ${url}`);
  },

  async put<T = any>(url: string, body?: any): Promise<T> {
    await delay();

    if (url.startsWith('/users/')) {
      return userHandlers.put(url, body);
    }
    if (url.startsWith('/tasks/')) {
      return taskHandlers.put(url, body);
    }

    throw new Error(`Unknown PUT endpoint: ${url}`);
  },

  async delete<T = any>(url: string): Promise<T> {
    await delay();

    if (url.startsWith('/users/')) {
      return userHandlers.del(url);
    }
    if (url.startsWith('/tasks/')) {
      return taskHandlers.del(url);
    }

    throw new Error(`Unknown DELETE endpoint: ${url}`);
  },
};
