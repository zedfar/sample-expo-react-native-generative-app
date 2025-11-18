/**
 * Notes Screen
 *
 * Main screen for displaying and managing notes with:
 * - List of all notes
 * - Search functionality
 * - Category filtering
 * - Add, edit, delete operations
 * - Pin/unpin notes
 * - Theme support
 * - Loading and error states
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Plus, Search, X } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useNoteStore } from '@/store/noteStore';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteForm } from '@/components/notes/NoteForm';
import { Note } from '@/types/note.types';

export default function NotesScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  // Store state
  const {
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    setSearchQuery,
    getFilteredNotes,
    loading,
    error,
    searchQuery,
  } = useNoteStore();

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [searchVisible, setSearchVisible] = useState(false);

  // Load notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Get filtered notes
  const filteredNotes = getFilteredNotes();

  // Handle add note
  const handleAddNote = async (data: {
    title: string;
    content: string;
    color?: string;
    category?: string;
  }) => {
    try {
      await addNote(data);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add note');
    }
  };

  // Handle edit note
  const handleEditNote = async (data: {
    title: string;
    content: string;
    color?: string;
    category?: string;
  }) => {
    if (!editingNote) return;

    try {
      await updateNote({
        id: editingNote.id,
        ...data,
      });
      setEditingNote(undefined);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update note');
    }
  };

  // Handle delete note
  const handleDeleteNote = (note: Note) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(note.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  // Handle toggle pin
  const handleTogglePin = async (note: Note) => {
    try {
      await togglePin(note.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle pin');
    }
  };

  // Open edit modal
  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  // Open add modal
  const openAddModal = () => {
    setEditingNote(undefined);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingNote(undefined);
  };

  // Render note item
  const renderItem = ({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={() => openEditModal(item)}
      onDelete={() => handleDeleteNote(item)}
      onEdit={() => openEditModal(item)}
      onTogglePin={() => handleTogglePin(item)}
    />
  );

  // Loading state
  if (loading && filteredNotes.length === 0) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading notes...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && filteredNotes.length === 0) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      >
        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Oops! Something went wrong
        </Text>
        <Text className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchNotes}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (filteredNotes.length === 0 && !searchQuery) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      >
        <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No notes yet
        </Text>
        <Text className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Start creating your first note by tapping the + button
        </Text>
        <TouchableOpacity
          onPress={openAddModal}
          className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
        >
          <Plus size={20} color="#FFF" />
          <Text className="text-white font-semibold ml-2">Create Note</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main content
  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header with Search */}
      <View
        className={`px-4 py-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
      >
        {searchVisible ? (
          <View className="flex-row items-center">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search notes..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className={`flex-1 p-3 rounded-lg mr-2 ${
                isDark
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
              autoFocus
              accessible
              accessibilityLabel="Search notes"
            />
            <TouchableOpacity
              onPress={() => {
                setSearchVisible(false);
                setSearchQuery('');
              }}
              className="p-2"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Close search"
            >
              <X size={24} color={isDark ? '#FFF' : '#000'} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-between items-center">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Notes
            </Text>
            <TouchableOpacity
              onPress={() => setSearchVisible(true)}
              className="p-2"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Search"
            >
              <Search size={24} color={isDark ? '#FFF' : '#000'} />
            </TouchableOpacity>
          </View>
        )}

        {filteredNotes.length > 0 && (
          <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          </Text>
        )}
      </View>

      {/* Notes List */}
      {filteredNotes.length === 0 && searchQuery ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No notes found
          </Text>
          <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={openAddModal}
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Add note"
      >
        <Plus size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Note Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
        presentationStyle="pageSheet"
      >
        <NoteForm
          note={editingNote}
          onSave={editingNote ? handleEditNote : handleAddNote}
          onCancel={closeModal}
        />
      </Modal>
    </View>
  );
}
