import { useThemeStore } from '@/store/themeStore';

/**
 * Hook for accessing theme state and actions
 * Uses Zustand store for global state management
 */
export function useTheme() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);
  const toggleColorScheme = useThemeStore((state) => state.toggleColorScheme);

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isDark: colorScheme === 'dark',
  };
}