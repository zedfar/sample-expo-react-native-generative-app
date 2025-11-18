import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Survey } from '@/types/survey';

interface SurveyState {
  surveys: Survey[];
  isLoading: boolean;
  addSurvey: (survey: Survey) => Promise<void>;
  updateSurvey: (id: string, survey: Partial<Survey>) => Promise<void>;
  deleteSurvey: (id: string) => Promise<void>;
  loadSurveys: () => Promise<void>;
  getSurveyById: (id: string) => Survey | undefined;
}

const SURVEYS_STORAGE_KEY = 'surveys_data';

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  isLoading: false,

  addSurvey: async (survey: Survey) => {
    try {
      const surveys = [...get().surveys, survey];
      await AsyncStorage.setItem(SURVEYS_STORAGE_KEY, JSON.stringify(surveys));
      set({ surveys });
    } catch (error) {
      console.error('Error adding survey:', error);
      throw error;
    }
  },

  updateSurvey: async (id: string, updatedData: Partial<Survey>) => {
    try {
      const surveys = get().surveys.map((survey) =>
        survey.id === id
          ? { ...survey, ...updatedData, updatedAt: new Date().toISOString() }
          : survey
      );
      await AsyncStorage.setItem(SURVEYS_STORAGE_KEY, JSON.stringify(surveys));
      set({ surveys });
    } catch (error) {
      console.error('Error updating survey:', error);
      throw error;
    }
  },

  deleteSurvey: async (id: string) => {
    try {
      const surveys = get().surveys.filter((survey) => survey.id !== id);
      await AsyncStorage.setItem(SURVEYS_STORAGE_KEY, JSON.stringify(surveys));
      set({ surveys });
    } catch (error) {
      console.error('Error deleting survey:', error);
      throw error;
    }
  },

  loadSurveys: async () => {
    try {
      set({ isLoading: true });
      const surveysData = await AsyncStorage.getItem(SURVEYS_STORAGE_KEY);
      if (surveysData) {
        const surveys = JSON.parse(surveysData);
        set({ surveys, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading surveys:', error);
      set({ isLoading: false });
    }
  },

  getSurveyById: (id: string) => {
    return get().surveys.find((survey) => survey.id === id);
  },
}));
