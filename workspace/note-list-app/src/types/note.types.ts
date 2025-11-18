/**
 * Note Types
 *
 * TypeScript interfaces for Note List application
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory = 'personal' | 'work' | 'ideas' | 'todo' | 'other';

export interface CreateNoteDto {
  title: string;
  content: string;
  category: NoteCategory;
  color?: string;
  isPinned?: boolean;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  category?: NoteCategory;
  color?: string;
  isPinned?: boolean;
}
