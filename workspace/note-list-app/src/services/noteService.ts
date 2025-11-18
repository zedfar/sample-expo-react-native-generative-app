/**
 * Note Service
 *
 * API service for Note CRUD operations
 */

import { api } from './api';
import { mockApi } from './mockApi';
import { API_CONFIG } from '@utils/constants';
import { Note, CreateNoteDto, UpdateNoteDto, NoteCategory } from '@/types/note.types';

export interface GetNotesParams {
  page?: number;
  limit?: number;
  category?: NoteCategory;
  search?: string;
  isPinned?: boolean;
  sortBy?: 'latest' | 'oldest' | 'title';
}

// Note Service
export const noteService = {
  /**
   * Get all notes with optional filters
   */
  getNotes: async (params?: GetNotesParams): Promise<Note[]> => {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Note[]>('/notes', { params });
    }
    return await api.get<Note[]>('/notes', params);
  },

  /**
   * Get single note by ID
   */
  getNoteById: async (id: string): Promise<Note> => {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Note>(`/notes/${id}`);
    }
    return await api.get<Note>(`/notes/${id}`);
  },

  /**
   * Create new note
   */
  createNote: async (data: CreateNoteDto): Promise<Note> => {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.post<Note>('/notes', data);
    }
    return await api.post<Note>('/notes', data);
  },

  /**
   * Update existing note
   */
  updateNote: async (id: string, data: UpdateNoteDto): Promise<Note> => {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.put<Note>(`/notes/${id}`, data);
    }
    return await api.put<Note>(`/notes/${id}`, data);
  },

  /**
   * Delete note
   */
  deleteNote: async (id: string): Promise<void> => {
    if (API_CONFIG.MOCK_API) {
      await mockApi.delete(`/notes/${id}`);
      return;
    }
    await api.delete(`/notes/${id}`);
  },

  /**
   * Toggle pin status
   */
  togglePin: async (id: string, isPinned: boolean): Promise<Note> => {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.put<Note>(`/notes/${id}`, { isPinned });
    }
    return await api.put<Note>(`/notes/${id}`, { isPinned });
  },
};
