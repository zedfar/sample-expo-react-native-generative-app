import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import '../global.css';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const setColorScheme = useThemeStore((state) => state.setColorScheme);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setColorScheme(systemColorScheme);

    // Auto redirect to home (no auth required for Calculator app)
    if (segments.length === 0 || segments[0] === '(auth)') {
      router.replace('/(tabs)');
    }
  }, [systemColorScheme]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
