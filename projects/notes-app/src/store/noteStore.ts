/**
 * Note Store
 *
 * Zustand store for managing notes state
 * Handles CRUD operations for notes
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/note.types';

interface NoteState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  fetchNotes: () => Promise<void>;
  addNote: (input: CreateNoteInput) => Promise<void>;
  updateNote: (input: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  clearError: () => void;

  // Computed
  getFilteredNotes: () => Note[];
  getNoteById: (id: string) => Note | undefined;
}

const STORAGE_KEY = '@notes-app:notes';

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,

  // Fetch notes from AsyncStorage
  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const notes = stored ? JSON.parse(stored) : [];
      set({ notes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notes',
        loading: false,
      });
    }
  },

  // Add new note
  addNote: async (input: CreateNoteInput) => {
    try {
      set({ loading: true, error: null });

      const newNote: Note = {
        id: Date.now().toString(),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
      };

      const updatedNotes = [newNote, ...get().notes];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      set({ notes: updatedNotes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add note',
        loading: false,
      });
      throw error;
    }
  },

  // Update existing note
  updateNote: async (input: UpdateNoteInput) => {
    try {
      set({ loading: true, error: null });

      const updatedNotes = get().notes.map((note) =>
        note.id === input.id
          ? {
              ...note,
              ...input,
              updatedAt: new Date().toISOString(),
            }
          : note
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      set({ notes: updatedNotes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update note',
        loading: false,
      });
      throw error;
    }
  },

  // Delete note
  deleteNote: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const updatedNotes = get().notes.filter((note) => note.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      set({ notes: updatedNotes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete note',
        loading: false,
      });
      throw error;
    }
  },

  // Toggle pin status
  togglePin: async (id: string) => {
    try {
      const note = get().notes.find((n) => n.id === id);
      if (!note) return;

      const updatedNotes = get().notes.map((n) =>
        n.id === id
          ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() }
          : n
      );

      // Sort: pinned notes first
      const sortedNotes = updatedNotes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortedNotes));
      set({ notes: sortedNotes });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle pin',
      });
    }
  },

  // Set search query
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Set selected category
  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Get filtered notes based on search and category
  getFilteredNotes: () => {
    const { notes, searchQuery, selectedCategory } = get();

    let filtered = [...notes];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((note) => note.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    // Sort: pinned first, then by updatedAt
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  },

  // Get note by ID
  getNoteById: (id: string) => {
    return get().notes.find((note) => note.id === id);
  },
}));
