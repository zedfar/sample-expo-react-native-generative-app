import { useThemeStore } from '@/store/themeStore';
import { colors } from '@/theme/colors';

/**
 * Hook for accessing theme state and actions
 * Uses Zustand store for global state management
 */
export function useTheme() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);
  const toggleColorScheme = useThemeStore((state) => state.toggleColorScheme);

  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isDark,
    colors: themeColors,
  };
}