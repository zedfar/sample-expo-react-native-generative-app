/**
 * Notes Screen
 *
 * Main screen for displaying and managing notes with:
 * - Note list with filtering and sorting
 * - Create, edit, delete operations
 * - Pin/unpin functionality
 * - Theme support
 * - Pull to refresh
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/themeStore';
import { noteService } from '@/services/noteService';
import { Note, CreateNoteDto, NoteCategory } from '@/types/note.types';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteForm } from '@/components/notes/NoteForm';
import { EmptyState } from '@/components/notes/EmptyState';
import { Plus, Filter } from 'lucide-react-native';

export default function NotesScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  // State management
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | undefined>(undefined);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setError(null);
      const data = await noteService.getNotes({
        category: selectedCategory,
        sortBy: 'latest',
      });
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  // Create or update note
  const handleSubmit = async (data: CreateNoteDto) => {
    try {
      if (editingNote) {
        await noteService.updateNote(editingNote.id, data);
      } else {
        await noteService.createNote(data);
      }
      setShowForm(false);
      setEditingNote(undefined);
      fetchNotes();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save note');
    }
  };

  // Delete note
  const handleDelete = (note: Note) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${note.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await noteService.deleteNote(note.id);
              fetchNotes();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  // Toggle pin
  const handleTogglePin = async (note: Note) => {
    try {
      await noteService.togglePin(note.id, !note.isPinned);
      fetchNotes();
    } catch (err) {
      Alert.alert('Error', 'Failed to update note');
    }
  };

  // Edit note
  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  // Handle long press
  const handleLongPress = (note: Note) => {
    Alert.alert(
      note.title,
      'Choose an action',
      [
        {
          text: note.isPinned ? 'Unpin' : 'Pin',
          onPress: () => handleTogglePin(note),
        },
        {
          text: 'Edit',
          onPress: () => handleEdit(note),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(note),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Render item
  const renderItem = ({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={() => handleEdit(item)}
      onLongPress={() => handleLongPress(item)}
    />
  );

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading notes...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && notes.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Oops! Something went wrong
        </Text>
        <Text className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={fetchNotes}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center">
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Notes
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            onPress={() => {
              // Toggle category filter (simplified - cycles through all categories)
              const categories: (NoteCategory | undefined)[] = [undefined, 'personal', 'work', 'ideas', 'todo', 'other'];
              const currentIndex = categories.indexOf(selectedCategory);
              const nextIndex = (currentIndex + 1) % categories.length;
              setSelectedCategory(categories[nextIndex]);
            }}
          >
            <Filter size={20} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category filter indicator */}
      {selectedCategory && (
        <View className="px-4 pb-2">
          <View className="flex-row items-center">
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Filtering by: {selectedCategory}
            </Text>
            <TouchableOpacity
              className="ml-2"
              onPress={() => setSelectedCategory(undefined)}
            >
              <Text className="text-blue-500 text-sm">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notes list */}
      {notes.length === 0 ? (
        <EmptyState
          message={selectedCategory ? `No ${selectedCategory} notes` : 'No notes yet'}
          description={selectedCategory ? 'Try creating a note in this category' : 'Tap the + button to create your first note'}
        />
      ) : (
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          setEditingNote(undefined);
          setShowForm(true);
        }}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      {/* Note Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowForm(false);
          setEditingNote(undefined);
        }}
      >
        <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
          <View className="px-4 py-3 border-b" style={{ borderBottomColor: isDark ? '#374151' : '#e5e7eb' }}>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {editingNote ? 'Edit Note' : 'New Note'}
            </Text>
          </View>
          <NoteForm
            initialData={editingNote}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingNote(undefined);
            }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
