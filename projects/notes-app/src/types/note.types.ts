/**
 * Note Types
 *
 * Defines TypeScript interfaces for Note entities
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  color?: string;
  category?: string;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  color?: string;
  category?: string;
  isPinned?: boolean;
}

export type NoteCategory = 'personal' | 'work' | 'ideas' | 'todo' | 'other';

export const NOTE_COLORS = {
  default: '#F9FAFB',
  yellow: '#FEF3C7',
  green: '#D1FAE5',
  blue: '#DBEAFE',
  pink: '#FCE7F3',
  purple: '#EDE9FE',
  red: '#FEE2E2',
} as const;

export type NoteColor = keyof typeof NOTE_COLORS;
