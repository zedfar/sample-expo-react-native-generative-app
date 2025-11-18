import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      // Mock login - in production, this would call an API
      // For demo purposes, accept any email/password
      const mockUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: 'user'
      };
      const mockToken = `token_${Date.now()}`;

      // Store token and user data securely
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(mockUser));

      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      // Mock registration - in production, this would call an API
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user'
      };
      const mockToken = `token_${Date.now()}`;

      // Store token and user data securely
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(newUser));

      set({ user: newUser, isAuthenticated: true });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear stored auth data
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      // Check if user is authenticated by verifying stored token
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_DATA_KEY);

      if (token && userData) {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      set({ isLoading: false });
    }
  },
}));
