import { create } from 'zustand';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  filter: 'all' | 'active' | 'completed';

  // Actions
  loadTodos: () => Promise<void>;
  addTodo: (input: CreateTodoInput) => Promise<void>;
  updateTodo: (id: string, input: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  clearCompleted: () => Promise<void>;
}

const STORAGE_KEY = '@todolist_todos';

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  filter: 'all',

  loadTodos: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const todos = JSON.parse(stored);
        set({ todos, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      set({ isLoading: false });
    }
  },

  addTodo: async (input: CreateTodoInput) => {
    try {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: input.title,
        description: input.description,
        completed: false,
        priority: input.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTodos = [newTodo, ...get().todos];
      set({ todos: updatedTodos });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  },

  updateTodo: async (id: string, input: UpdateTodoInput) => {
    try {
      const updatedTodos = get().todos.map((todo) =>
        todo.id === id
          ? { ...todo, ...input, updatedAt: new Date().toISOString() }
          : todo
      );
      set({ todos: updatedTodos });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const updatedTodos = get().todos.filter((todo) => todo.id !== id);
      set({ todos: updatedTodos });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  },

  toggleTodo: async (id: string) => {
    try {
      const updatedTodos = get().todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      );
      set({ todos: updatedTodos });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  },

  setFilter: (filter: 'all' | 'active' | 'completed') => {
    set({ filter });
  },

  clearCompleted: async () => {
    try {
      const updatedTodos = get().todos.filter((todo) => !todo.completed);
      set({ todos: updatedTodos });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error clearing completed todos:', error);
    }
  },
}));
