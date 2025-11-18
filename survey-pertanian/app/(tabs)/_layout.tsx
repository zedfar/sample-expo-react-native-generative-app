import { Tabs, Redirect } from 'expo-router';
import { Home, FileText, ClipboardList, Settings } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore();
  const colorScheme = useThemeStore((state) => state.colorScheme);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
        },
        headerStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="survey"
        options={{
          title: 'Survey',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
