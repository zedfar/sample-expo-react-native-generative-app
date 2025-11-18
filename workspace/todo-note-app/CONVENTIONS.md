# Coding Conventions

Standards and best practices for this project.

## ⚠️ Dependencies & Package Management

### CRITICAL RULE: NO New Dependencies!

**NEVER add, upgrade, or change package versions without explicit permission.**

```json
// ❌ FORBIDDEN
npm install lodash
npm install expo-image
yarn add react-query

// ✅ ALLOWED
Use packages already in package.json
```

### Tech Stack Versions (FIXED)

```
React: 19.1.0
React Native: 0.81.4
Expo SDK: 54.x (^54.0.10)
```

**DO NOT suggest upgrading these versions!**

### Available Packages

Check `package.json` for the complete list of allowed packages.

**Commonly Used:**
- **State:** `zustand`, `@tanstack/react-query`, `react-hook-form`
- **UI:** `nativewind`, `lucide-react-native`, `react-native-paper`
- **HTTP:** `axios`
- **Expo:** All `expo-*` packages (SDK 54 compatible)

### Instead of Installing New Packages

```typescript
// ❌ DON'T: Suggest new packages
"Let's install lodash for array utilities"

// ✅ DO: Use vanilla JavaScript
const unique = [...new Set(array)];
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// ✅ DO: Create utility functions
// src/utils/arrays.ts
export const groupBy = (arr, key) => { /* ... */ };
```

## File Naming

```
Components:  Button.tsx, UserCard.tsx (PascalCase)
Hooks:       useAuth.ts, useTheme.ts (camelCase + use prefix)
Services:    authService.ts, apiService.ts (camelCase + Service)
Stores:      authStore.ts, themeStore.ts (camelCase + Store)
Types:       user.types.ts, api.types.ts (camelCase + .types)
Screens:     login.tsx, settings.tsx (lowercase in app/)
```

## Code Structure

### Component File

```typescript
// 1. Imports
import React from 'react';
import { View, Text } from 'react-native';

// 2. Types
interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState();

  // 3b. Handlers
  const handlePress = () => {
    // ...
  };

  // 3c. Render
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
```

### Hook File

```typescript
import { useState, useEffect } from 'react';

interface UseDataReturn {
  data: any[];
  loading: boolean;
}

export function useData(): UseDataReturn {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logic
  }, []);

  return { data, loading };
}
```

## TypeScript

### Always Use Types

```typescript
// ✅ Good
const getName = (user: User): string => user.name;

// ❌ Bad
const getName = (user: any) => user.name;
```

### Interface vs Type

```typescript
// Use interface for objects
interface User {
  id: string;
  name: string;
}

// Use type for unions/primitives
type Status = 'active' | 'inactive';
```

## Imports

### Use Path Aliases

```typescript
// ✅ Good
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

// ❌ Bad
import { Button } from '../../../components/common/Button';
```

### Import Order

```typescript
// 1. React
import React, { useState } from 'react';

// 2. React Native
import { View, Text } from 'react-native';

// 3. Expo/Third-party
import { useRouter } from 'expo-router';
import axios from 'axios';

// 4. Local
import { Button } from '@/components/common/Button';
import { useThemeStore } from '@/store/themeStore';
```

## Styling

### Use NativeWind

```typescript
// ✅ Good
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold">Hello</Text>
</View>

// ⚠️ Use StyleSheet only when necessary
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  // Complex styles
});
```

### Theme Support

```typescript
// Always support theme
const isDark = colorScheme === 'dark';

<View className={isDark ? 'bg-black' : 'bg-white'}>
  <Text className={isDark ? 'text-white' : 'text-gray-900'}>
    Hello
  </Text>
</View>
```

## State Management

### Use Zustand for Global State

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, login } = useAuthStore();
  // Use store
}
```

### Use useState for Local State

```typescript
function MyComponent() {
  const [count, setCount] = useState(0);
  // Use local state
}
```

## API Calls

### Use Services

```typescript
// Create service
export const userService = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
};

// Use in component
const fetchUsers = async () => {
  try {
    const users = await userService.getUsers();
    setUsers(users);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Error Handling

```typescript
// Always handle errors
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  setError(error.message);
}
```

## Loading States

```typescript
// Show loading indicator
if (loading) {
  return <ActivityIndicator size="large" />;
}
```

## Comments

### Use Comments Sparingly

```typescript
// ✅ Good - explain WHY
// Debounce search to avoid excessive API calls
const debouncedSearch = useDebounce(search, 300);

// ❌ Bad - explain WHAT (code is self-explanatory)
// Set loading to true
setLoading(true);
```

### Use JSDoc for Complex Functions

```typescript
/**
 * Fetch paginated users with filters
 * @param page - Page number (starting from 1)
 * @param limit - Items per page
 * @returns Paginated user list
 */
export async function getUsers(page: number, limit: number) {
  // ...
}
```

## Best Practices

### Keep Functions Small

```typescript
// ✅ Good - single responsibility
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleSubmit = async () => {
  if (!validateEmail(email)) {
    setError('Invalid email');
    return;
  }
  await login(email);
};
```

### Use Descriptive Names

```typescript
// ✅ Good
const isUserAuthenticated = true;
const getUserProfile = () => { /* ... */ };

// ❌ Bad
const flag = true;
const getData = () => { /* ... */ };
```

### Avoid Magic Numbers

```typescript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const API_TIMEOUT = 10000;

// ❌ Bad
if (retryCount > 3) { /* ... */ }
setTimeout(() => {}, 10000);
```

## Performance

### Use useMemo for Expensive Calculations

```typescript
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);
```

### Use useCallback for Event Handlers

```typescript
const handlePress = useCallback(() => {
  console.log('Pressed');
}, []);
```

## Accessibility

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  onPress={handleSubmit}
>
  <Text>Submit</Text>
</TouchableOpacity>
```

## Summary

1. **NO New Dependencies** - Use only what's in package.json ⚠️
2. **Fixed Tech Stack** - React 19.1.0, RN 0.81.4, Expo SDK 54 ⚠️
3. **Template Variants** - Check `TEMPLATE_VARIANTS.md` for your app type ⚠️
4. **TypeScript** - Always use proper types
5. **Path Aliases** - Use `@/` for imports
6. **NativeWind** - Use Tailwind classes
7. **Theme Support** - Always support light/dark
8. **Error Handling** - Always handle errors
9. **Loading States** - Always show loading
10. **Clean Code** - Small functions, clear names
11. **Examples** - Check `examples/` folder (see Examples Guide below)

## 📚 Examples Guide

### Before You Start

1. **Read `TEMPLATE_VARIANTS.md`** - Choose the right template variant for your app
2. **Check `examples/apps/`** - See complete app examples
3. **Check `examples/screens/`** - Find the right screen pattern
4. **Check `examples/services/`** - Find the right service pattern

### Which Example to Use?

**Building a Todo/Notes App (Offline)?**
→ Use `examples/apps/todo-offline/` + `examples/services/offline-service.example.ts`

**Building a News/Blog App (Public Content)?**
→ Use `examples/apps/news-no-auth/` + `examples/screens/list-screen-no-auth.example.tsx`

**Building a Dashboard (Protected)?**
→ Use `examples/apps/dashboard-with-auth/` + `examples/screens/list-screen-with-auth.example.tsx`

**Need a Form?**
→ Use `examples/screens/form-screen.example.tsx`

**Need a Detail Page?**
→ Use `examples/screens/detail-screen.example.tsx`

### Complete Examples List

**App Examples:**
- `examples/apps/todo-offline/` - Offline app (no auth, no API)
- `examples/apps/news-no-auth/` - Public content (no auth, with API)
- `examples/apps/dashboard-with-auth/` - Protected app (with auth, with API)

**Screen Examples:**
- `examples/screens/list-screen-no-auth.example.tsx`
- `examples/screens/list-screen-with-auth.example.tsx`
- `examples/screens/form-screen.example.tsx`
- `examples/screens/detail-screen.example.tsx`

**Service Examples:**
- `examples/services/service-with-mock.example.ts`
- `examples/services/service-without-mock.example.ts`
- `examples/services/offline-service.example.ts`

**Legacy Examples:**
- `examples/screen.example.tsx`
- `examples/component.example.tsx`
- `examples/hook.example.ts`
- `examples/service.example.ts`

---

When in doubt, check the `examples/` folder and `TEMPLATE_VARIANTS.md`!
