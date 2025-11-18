import { create } from 'zustand';
import { ColorSchemeName } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorSchemeName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'auto',
  colorScheme: 'light',

  setThemeMode: (mode) => set({ mode }),

  setColorScheme: (scheme) => set({ colorScheme: scheme }),
}));
