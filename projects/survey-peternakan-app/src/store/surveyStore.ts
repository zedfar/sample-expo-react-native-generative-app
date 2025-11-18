import { create } from 'zustand';
import { Survey, CreateSurveyInput, UpdateSurveyInput } from '@/types/survey.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SurveyState {
  surveys: Survey[];
  isLoading: boolean;
  filterLivestock: string | null;

  // Actions
  loadSurveys: () => Promise<void>;
  addSurvey: (input: CreateSurveyInput, surveyorId: string, surveyorName: string) => Promise<void>;
  updateSurvey: (id: string, input: UpdateSurveyInput) => Promise<void>;
  deleteSurvey: (id: string) => Promise<void>;
  setFilterLivestock: (type: string | null) => void;
  getSurveysByUser: (userId: string) => Survey[];
}

const STORAGE_KEY = '@survey_peternakan_data';

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  isLoading: false,
  filterLivestock: null,

  loadSurveys: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const surveys = JSON.parse(stored);
        set({ surveys, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading surveys:', error);
      set({ isLoading: false });
    }
  },

  addSurvey: async (input: CreateSurveyInput, surveyorId: string, surveyorName: string) => {
    try {
      const newSurvey: Survey = {
        id: Date.now().toString(),
        ...input,
        surveyorId,
        surveyorName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedSurveys = [newSurvey, ...get().surveys];
      set({ surveys: updatedSurveys });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSurveys));
    } catch (error) {
      console.error('Error adding survey:', error);
    }
  },

  updateSurvey: async (id: string, input: UpdateSurveyInput) => {
    try {
      const updatedSurveys = get().surveys.map((survey) =>
        survey.id === id
          ? { ...survey, ...input, updatedAt: new Date().toISOString() }
          : survey
      );
      set({ surveys: updatedSurveys });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSurveys));
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  },

  deleteSurvey: async (id: string) => {
    try {
      const updatedSurveys = get().surveys.filter((survey) => survey.id !== id);
      set({ surveys: updatedSurveys });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSurveys));
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  },

  setFilterLivestock: (type: string | null) => {
    set({ filterLivestock: type });
  },

  getSurveysByUser: (userId: string) => {
    return get().surveys.filter((survey) => survey.surveyorId === userId);
  },
}));
