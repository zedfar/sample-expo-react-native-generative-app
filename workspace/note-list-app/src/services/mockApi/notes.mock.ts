// notes.mock.ts
import { Note, CreateNoteDto, UpdateNoteDto, NoteCategory } from '@/types/note.types';
import * as db from 'server/db.json';

let notes: Note[] = [...(db.notes as Note[])];

interface NoteFilters {
  search?: string;
  category?: NoteCategory;
  isPinned?: boolean;
  sortBy?: 'latest' | 'oldest' | 'title';
  limit?: number;
  page?: number;
}

export async function get<T = any>(url: string, config?: { params?: NoteFilters }): Promise<T> {
  if (url === '/notes') {
    const { params } = config || {};
    let filtered = [...notes];

    if (params) {
      const { search, category, isPinned, sortBy, limit = 50, page = 1 } = params;

      // Filter by search
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          n => n.title.toLowerCase().includes(q) ||
               n.content.toLowerCase().includes(q)
        );
      }

      // Filter by category
      if (category) {
        filtered = filtered.filter(n => n.category === category);
      }

      // Filter by pinned status
      if (isPinned !== undefined) {
        filtered = filtered.filter(n => n.isPinned === isPinned);
      }

      // Sort - always show pinned notes first, then by selected sort
      filtered.sort((a, b) => {
        // Pinned notes first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Then apply selected sort
        if (sortBy === 'latest') {
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        } else if (sortBy === 'oldest') {
          return +new Date(a.createdAt) - +new Date(b.createdAt);
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }

        // Default: latest
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });

      // Pagination
      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit) as unknown as T;
    }

    // Default: sort by pinned first, then latest
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

    return filtered as unknown as T;
  }

  // Get single note
  const match = url.match(/\/notes\/(\w+)/);
  if (match) {
    const note = notes.find(n => n.id === match[1]);
    if (!note) throw new Error('Note not found');
    return note as unknown as T;
  }

  throw new Error(`Unknown GET /notes endpoint: ${url}`);
}

export async function post<T = any>(url: string, body?: CreateNoteDto): Promise<T> {
  if (url === '/notes') {
    if (!body) throw new Error('Note data is required');

    const newNote: Note = {
      id: String(Date.now()),
      title: body.title,
      content: body.content,
      category: body.category,
      color: body.color || '#3b82f6',
      isPinned: body.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    return newNote as unknown as T;
  }

  throw new Error(`Unknown POST /notes endpoint: ${url}`);
}

export async function put<T = any>(url: string, body: UpdateNoteDto): Promise<T> {
  const match = url.match(/\/notes\/(\w+)/);
  if (match) {
    const id = match[1];
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');

    notes[index] = {
      ...notes[index],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return notes[index] as unknown as T;
  }

  throw new Error(`Unknown PUT /notes endpoint: ${url}`);
}

export async function del<T = any>(url: string): Promise<T> {
  const match = url.match(/\/notes\/(\w+)/);
  if (match) {
    const id = match[1];
    const initialLength = notes.length;
    notes = notes.filter(n => n.id !== id);

    if (notes.length === initialLength) {
      throw new Error('Note not found');
    }

    return { message: 'Note deleted successfully' } as unknown as T;
  }

  throw new Error(`Unknown DELETE /notes endpoint: ${url}`);
}
