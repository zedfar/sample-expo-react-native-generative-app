# Note List App

A clean, modern note-taking application built with React Native and Expo. Organize your thoughts, ideas, and tasks with categories, colors, and pinning functionality.

## 🤖 Built for AI Code Generation

This template is designed to work seamlessly with AI agents for rapid development:

- **Simple Structure** - Clear, predictable folder organization
- **Code Examples** - Actual working code patterns in `examples/`
- **AI Context** - Path configuration in `ai-context.json`
- **General Purpose** - Not tied to any specific app type
- **Type Safe** - Full TypeScript support
- **Theme Ready** - Dark/Light mode out of the box

### 📖 For AI Agents - Start Here!

**First time in this project?** Read these files in order:

1. **[AI_GUIDE.md](AI_GUIDE.md)** ⭐ **START HERE** - Complete AI onboarding guide
2. **[ai-context.json](ai-context.json)** - Path mappings
3. **[GENERATE_RULES.md](GENERATE_RULES.md)** - Code generation patterns
4. **[CONVENTIONS.md](CONVENTIONS.md)** - Coding standards
5. **[SERVER_GUIDE.md](SERVER_GUIDE.md)** - Mock API & dummy data guide
6. **[examples/](examples/)** - Actual working code to copy

## Quick Start

```bash
npx create-ern-boilerplate my-app --template agent-generator
cd my-app
npm install
npm start
```

## Project Structure

```
.
├── app
│   ├── (auth)              # Auth pages (login, register)
│   ├── (tabs)              # Main app tabs (home, settings)
│   └── _layout.tsx         # Root layout
│
├── examples                # Code examples for AI
│   ├── component.example.tsx  # Component pattern
│   ├── hook.example.ts        # Custom hook pattern
│   ├── screen.example.tsx     # Screen pattern
│   └── service.example.ts     # API service pattern
│
├── src
│   ├── components          # Reusable UI components
│   │   ├── common          # Button, Card, Input, Loading
│   │   ├── shared          # Shared business components
│   │   └── auth            # Auth-specific components
│   ├── hooks               # Custom React hooks
│   ├── screens             # Screen components
│   ├── services            # API services
│   │   └── api.ts          # Axios instance
│   ├── store               # Zustand stores
│   │   ├── authStore.ts    # Authentication state
│   │   └── themeStore.ts   # Theme state
│   ├── theme               # Theme configuration
│   ├── types               # TypeScript types
│   └── utils               # Utility functions
│
├── ai-context.json         # AI path configuration
├── CONVENTIONS.md          # Coding standards
├── GENERATE_RULES.md       # Code generation rules
└── package.json
```

## Features

- ✅ **Expo SDK 54** - Latest Expo features
- ✅ **Expo Router** - File-based routing with tabs
- ✅ **TypeScript** - Full type safety
- ✅ **NativeWind (Tailwind)** - Utility-first styling
- ✅ **Zustand** - Simple state management
- ✅ **Auth Ready** - Login/register flow included
- ✅ **Theme Support** - Light/Dark mode
- ✅ **Path Aliases** - Clean imports with `@`
- ✅ **API Client** - Axios with interceptors
- ✅ **Mock Server** - JSON Server ready

## AI Code Generation

### Context Configuration

The `ai-context.json` tells AI where to generate code:

```json
{
  "screensPath": "app",
  "componentsPath": "src/components",
  "hooksPath": "src/hooks",
  "servicesPath": "src/services",
  "mockApiPath": "src/services/mockApi",
  "storePath": "src/store",
  "typesPath": "src/types",
  "mockDataPath": "server/db.json",
  "examples": "examples",
  "aiGuide": "AI_GUIDE.md",
  "serverGuide": "SERVER_GUIDE.md",
  "rules": "GENERATE_RULES.md",
  "conventions": "CONVENTIONS.md"
}
```

### Code Examples

Check `examples/` folder for patterns:

- **`screen.example.tsx`** - List screen with loading/error states
- **`component.example.tsx`** - Reusable component with variants
- **`hook.example.ts`** - Data fetching hook
- **`service.example.ts`** - CRUD API service

### Generating Code

Example prompts for AI:

```
Create a news list screen following examples/screen.example.tsx

Generate a ProductCard component like examples/component.example.tsx

Build a useProducts hook similar to examples/hook.example.ts

Create a product service following examples/service.example.ts
```

## State Management

Using Zustand for simple, scalable state:

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, login, logout } = useAuthStore();
  // Use store state and actions
}
```

## Theming

Theme automatically follows system preference:

```typescript
import { useThemeStore } from '@/store/themeStore';

function MyComponent() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
      <Text className={isDark ? 'text-white' : 'text-gray-900'}>
        Hello World
      </Text>
    </View>
  );
}
```

## Routing

### Tabs

Main app tabs in `app/(tabs)/`:

- `index.tsx` - Home screen
- `settings.tsx` - Settings screen

Add more tabs by creating new files.

### Auth

Auth flow in `app/(auth)/`:

- `login.tsx` - Login screen
- `register.tsx` - Register screen

## API Services

```typescript
import { apiClient } from '@/services/api';

// Create a service
export const newsService = {
  getNews: async () => {
    const response = await apiClient.get('/news');
    return response.data;
  },
};
```

## Components

### Button

```typescript
import { Button } from '@/components/common/Button';

<Button
  title="Press Me"
  onPress={() => console.log('Pressed')}
  loading={false}
  disabled={false}
/>
```

### Card

```typescript
import { Card } from '@/components/common/Card';

<Card className="mb-4">
  <Text>Card content</Text>
</Card>
```

### Input

```typescript
import { Input } from '@/components/common/Input';

<Input
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
/>
```

## Available Scripts

```bash
# Development
npm start                 # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web

# Build
npm run build            # Build for production
npm run type-check       # TypeScript check
npm run lint             # ESLint check
```

## Environment Configuration

Configure API URLs in `src/utils/constants.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3001'
    : 'https://api.yourapp.com',
  TIMEOUT: 10000,
};
```

## Building Your App

This boilerplate is intentionally minimal and general. Customize it for your specific needs:

### For a News App:
- Create `newsService.ts` in `src/services/`
- Add `useNews.ts` hook in `src/hooks/`
- Build news screens in `app/(tabs)/`

### For a Todo App:
- Create `todoStore.ts` in `src/store/`
- Build todo screens and components
- Add CRUD operations

### For an Ecommerce App:
- Create product/cart services
- Add product listing screens
- Build checkout flow

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/)

## License

MIT - Use freely for your projects

---

**Made for Humans + AI Developers**
