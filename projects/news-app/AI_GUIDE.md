# AI Agent Guide

Quick start guide for AI agents working with this boilerplate.

## 🚀 First Time Setup

When you first enter this project, read these files in order:

1. **`README.md`** - Understand project structure and features
2. **`ai-context.json`** - Know where to generate each type of code
3. **`GENERATE_RULES.md`** - ⚠️ **READ THIS FIRST** - Tech stack & dependency rules
4. **`CONVENTIONS.md`** - Understand coding standards
5. **`examples/`** - See actual working code patterns

## 🚨 CRITICAL RULES - Read First!

### Tech Stack Restrictions

**NEVER add new dependencies or change versions!**

```json
Fixed Versions:
{
  "react": "19.1.0",           // DO NOT change
  "react-native": "0.81.4",    // DO NOT change
  "expo": "^54.0.10",          // DO NOT change (SDK 54 only!)
  "expo-router": "~6.0.12"     // DO NOT change
}
```

### What You CAN Use (Already Installed)

✅ **State:** Zustand, TanStack Query, React Hook Form
✅ **UI:** NativeWind, Lucide Icons, React Native Paper
✅ **HTTP:** Axios
✅ **Expo Modules:** Camera, Location, Notifications, etc. (SDK 54 only!)

### What You CANNOT Do

❌ Install new packages
❌ Suggest upgrading Expo SDK
❌ Use React 18 APIs
❌ Add lodash, moment, or other utilities

### What to Do Instead

✅ Use existing packages from package.json
✅ Write vanilla JavaScript/TypeScript
✅ Create custom utilities in src/utils/

**See GENERATE_RULES.md for complete package management rules!**

## 📋 Quick Reference

### File Locations (from ai-context.json)

```json
{
  "screensPath": "app",              // Screens go in app/(tabs)/ or app/(auth)/
  "componentsPath": "src/components", // Components in src/components/common/ or /shared/
  "hooksPath": "src/hooks",          // Custom hooks
  "servicesPath": "src/services",    // API services
  "storePath": "src/store",          // Zustand stores
  "typesPath": "src/types",          // TypeScript types
  "utilsPath": "src/utils",          // Utility functions
  "themePath": "src/theme",          // Theme configuration
  "examples": "examples"             // Code examples - CHECK THIS FIRST!
}
```

### File Naming

```
Screens:     login.tsx, news-list.tsx (lowercase, kebab-case)
Components:  Button.tsx, NewsCard.tsx (PascalCase)
Hooks:       useNews.ts, useAuth.ts (camelCase + use prefix)
Services:    newsService.ts, authService.ts (camelCase + Service)
Stores:      newsStore.ts, authStore.ts (camelCase + Store)
Types:       news.types.ts, user.types.ts (kebab-case + .types)
```

## 🎯 Common Tasks

### Task 1: Build a News App

**Steps:**
1. Create types in `src/types/news.types.ts`
2. Create service in `src/services/newsService.ts` (follow `examples/service.example.ts`)
3. Create hook in `src/hooks/useNews.ts` (follow `examples/hook.example.ts`)
4. Create screen in `app/(tabs)/news.tsx` (follow `examples/screen.example.tsx`)
5. Add tab to `app/(tabs)/_layout.tsx`

**Example Prompt:**
```
Create a news app with:
1. News types (id, title, description, imageUrl, publishedAt)
2. News service (getNews, getNewsById)
3. useNews hook (fetch, loading, error states)
4. News list screen (with pull to refresh)
5. Add news tab to tabs layout
```

### Task 2: Build a Todo App

**Steps:**
1. Create `src/types/todo.types.ts`
2. Create `src/store/todoStore.ts` (for local state)
3. Create `app/(tabs)/todos.tsx`
4. Create components in `src/components/todos/`

**Example Prompt:**
```
Create a todo app with:
1. Todo types (id, title, completed, createdAt)
2. Todo store (add, toggle, delete)
3. Todo list screen
4. TodoItem component
5. Add todo tab
```

### Task 3: Build an Ecommerce App

**Steps:**
1. Create `src/types/product.types.ts`
2. Create `src/services/productService.ts`
3. Create `src/hooks/useProducts.ts`
4. Create `app/(tabs)/products.tsx`
5. Create `src/components/products/ProductCard.tsx`

**Example Prompt:**
```
Create an ecommerce app with:
1. Product types (id, name, price, image, category)
2. Product service (getProducts, getProductById, searchProducts)
3. useProducts hook with filters
4. Product list screen with search
5. ProductCard component
6. Add products tab
```

## 🔑 Key Patterns

### 1. Always Check Examples First!

Before generating ANY code, check `examples/` folder:

```bash
examples/
├── screen.example.tsx     # Full screen with list, loading, error
├── component.example.tsx  # Reusable component with variants
├── hook.example.ts        # Data fetching hook
└── service.example.ts     # API service with CRUD
```

**Copy the pattern, don't reinvent!**

### 2. State Management

**Local state** → `useState`
```typescript
const [data, setData] = useState([]);
```

**Global state** → Zustand store in `src/store/`
```typescript
// src/store/newsStore.ts
export const useNewsStore = create<NewsState>((set) => ({
  news: [],
  fetchNews: async () => { /* ... */ }
}));
```

### 3. Theme Support

**Always** support light/dark theme:
```typescript
const colorScheme = useThemeStore((state) => state.colorScheme);
const isDark = colorScheme === 'dark';

<View className={isDark ? 'bg-black' : 'bg-white'}>
  <Text className={isDark ? 'text-white' : 'text-gray-900'}>
    Hello
  </Text>
</View>
```

### 4. Error & Loading States

**Always** handle both:
```typescript
if (loading) return <ActivityIndicator />;
if (error) return <ErrorMessage error={error} />;
return <Content data={data} />;
```

### 5. Import with Path Aliases

**Always** use `@/` prefix:
```typescript
import { Button } from '@/components/common/Button';
import { useNewsStore } from '@/store/newsStore';
import { newsService } from '@/services/newsService';
```

## 📚 Code Generation Workflow

### Step-by-Step Process

1. **Read the user's request**
   - Understand what app they want to build
   - Identify the domain (News, Todo, Products, etc.)

2. **Check examples/**
   - Find similar pattern in examples folder
   - Use it as template

3. **Create types first** (`src/types/`)
   - Define data structures
   - Export all interfaces

4. **Create service** (`src/services/`)
   - API calls
   - Follow `examples/service.example.ts`

5. **Create hook if needed** (`src/hooks/`)
   - Data fetching logic
   - Follow `examples/hook.example.ts`

6. **Create components** (`src/components/`)
   - Reusable UI pieces
   - Follow `examples/component.example.tsx`

7. **Create screens** (`app/(tabs)/`)
   - Main screens
   - Follow `examples/screen.example.tsx`

8. **Update navigation**
   - Add tabs to `app/(tabs)/_layout.tsx`

## ⚠️ Common Mistakes to Avoid

1. ❌ **Don't use relative imports**
   ```typescript
   // Bad
   import { Button } from '../../../components/Button';

   // Good
   import { Button } from '@/components/common/Button';
   ```

2. ❌ **Don't forget theme support**
   ```typescript
   // Bad
   <View style={{ backgroundColor: '#fff' }}>

   // Good
   const isDark = colorScheme === 'dark';
   <View className={isDark ? 'bg-black' : 'bg-white'}>
   ```

3. ❌ **Don't skip loading/error states**
   ```typescript
   // Bad
   return <FlatList data={data} />;

   // Good
   if (loading) return <Loading />;
   if (error) return <Error />;
   return <FlatList data={data} />;
   ```

4. ❌ **Don't create new patterns**
   - Always follow examples/
   - Consistency > Creativity

5. ❌ **Don't hardcode colors**
   - Use theme store
   - Use NativeWind classes

## 🎓 Learning Path

### For News App:
1. Read `examples/service.example.ts` → Create `newsService.ts`
2. Read `examples/hook.example.ts` → Create `useNews.ts`
3. Read `examples/screen.example.tsx` → Create `news.tsx`
4. Read `examples/component.example.tsx` → Create `NewsCard.tsx`

### For Todo App:
1. Read Zustand store pattern → Create `todoStore.ts`
2. Read `examples/screen.example.tsx` → Create `todos.tsx`
3. Read `examples/component.example.tsx` → Create `TodoItem.tsx`

### For Ecommerce:
1. Follow News App pattern but with products
2. Add filters/search to hook
3. Add ProductCard component
4. Add cart store (Zustand)

## 🚦 Quick Checklist

Before generating code:
- [ ] ⚠️ **Check package.json** - Only use existing packages!
- [ ] ⚠️ **NO new dependencies** - Use what's already installed
- [ ] Read examples/ folder
- [ ] Check ai-context.json for paths
- [ ] Use TypeScript types
- [ ] Use path aliases (@/)
- [ ] Support theme (light/dark)
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Follow naming conventions
- [ ] Use NativeWind classes
- [ ] Use Expo SDK 54 compatible APIs only

## 💡 Pro Tips

1. **When in doubt, check examples/**
2. **Copy patterns, don't create new ones**
3. **Keep it simple**
4. **TypeScript is your friend**
5. **Theme support is mandatory**
6. **Loading/error states are mandatory**
7. **Path aliases (@/) are mandatory**

## 📞 Quick Commands

```bash
# Read important files
cat README.md
cat ai-context.json
cat GENERATE_RULES.md
cat CONVENTIONS.md

# Check examples
ls examples/
cat examples/screen.example.tsx
cat examples/service.example.ts

# Check existing structure
ls app/(tabs)/
ls src/components/
ls src/services/
ls src/store/
```

## 🎯 Success Criteria

Your generated code is good if:
✅ **Uses ONLY existing packages** from package.json
✅ **NO new dependencies** added
✅ **Expo SDK 54 compatible** only
✅ Follows examples/ patterns exactly
✅ Uses TypeScript properly
✅ Uses path aliases (@/)
✅ Supports light/dark theme
✅ Handles loading/error states
✅ Uses NativeWind classes
✅ Follows naming conventions
✅ Works out of the box

---

**Remember: This template is MINIMAL and GENERAL. You add the specific features for the app type!**
