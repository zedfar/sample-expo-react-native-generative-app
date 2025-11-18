import { create } from 'zustand';
import { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      // TODO: Implement actual login logic
      const mockUser: User = {
        id: '1',
        name: 'User',
        email,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      // TODO: Check if user is authenticated (e.g., check token)
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
