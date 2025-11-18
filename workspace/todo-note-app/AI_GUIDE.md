# AI Agent Guide

Quick start guide for AI agents working with this boilerplate.

## 🚀 First Time Setup

When you first enter this project, read these files in order:

1. **`README.md`** - Understand project structure and features
2. **`ai-context.json`** - Know where to generate each type of code
3. **`TEMPLATE_VARIANTS.md`** - ⚠️ **READ THIS FIRST** - Choose template variant for your app type
4. **`GENERATE_RULES.md`** - ⚠️ **Tech stack & dependency rules**
5. **`CONVENTIONS.md`** - Understand coding standards
6. **`SERVER_GUIDE.md`** - ⚠️ **Mock API & dummy data guide**
7. **`examples/`** - See actual working code patterns

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
  "mockApiPath": "src/services/mockApi", // Mock API implementations
  "storePath": "src/store",          // Zustand stores
  "typesPath": "src/types",          // TypeScript types
  "utilsPath": "src/utils",          // Utility functions
  "themePath": "src/theme",          // Theme configuration
  "mockDataPath": "server/db.json",  // Mock database (sample/starter data)
  "examples": "examples",            // Code examples - CHECK THIS FIRST!
  "examplesScreens": "examples/screens",     // Screen examples (list, form, detail)
  "examplesServices": "examples/services",   // Service examples (with/without mock/offline)
  "examplesApps": "examples/apps",           // Complete mini app examples
  "aiGuide": "AI_GUIDE.md",          // AI agent guide
  "serverGuide": "SERVER_GUIDE.md",  // Mock API & server guide
  "templateVariants": "TEMPLATE_VARIANTS.md", // Template customization guide
  "rules": "GENERATE_RULES.md",      // Code generation rules
  "conventions": "CONVENTIONS.md"    // Coding conventions
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

## 📁 Examples Folder Structure

The `examples/` folder contains comprehensive code patterns organized by category:

### Overview
```
examples/
├── screens/              # Screen examples for different scenarios
│   ├── list-screen-no-auth.example.tsx        # Public content list (no auth)
│   ├── list-screen-with-auth.example.tsx      # Protected content list (with auth)
│   ├── form-screen.example.tsx                # Create/edit form
│   └── detail-screen.example.tsx              # Detail page with actions
│
├── services/             # Service examples for different setups
│   ├── service-with-mock.example.ts           # API service with mock support
│   ├── service-without-mock.example.ts        # Direct API connection only
│   └── offline-service.example.ts             # Offline storage (AsyncStorage)
│
├── apps/                 # Complete mini app examples
│   ├── todo-offline/                          # Offline todo app (no auth, no API)
│   ├── news-no-auth/                          # News app (no auth, with API)
│   └── dashboard-with-auth/                   # Dashboard (with auth, with API)
│
├── component.example.tsx  # Reusable component pattern
├── hook.example.ts        # Custom hook pattern
├── screen.example.tsx     # Generic screen pattern (legacy)
└── service.example.ts     # Generic service pattern (legacy)
```

### When to Use Which Example

#### Screen Examples (`examples/screens/`)

**1. `list-screen-no-auth.example.tsx`**
- **Use for:** Public content apps (news, recipes, products)
- **Features:** List view, pull-to-refresh, navigation to detail
- **No auth required:** Anyone can access
- **Example apps:** News reader, recipe browser, product catalog

**2. `list-screen-with-auth.example.tsx`**
- **Use for:** User-specific content (tasks, orders, notifications)
- **Features:** Protected route, user greeting, personalized data
- **Auth required:** Must be logged in
- **Example apps:** Task manager, order history, dashboard

**3. `form-screen.example.tsx`**
- **Use for:** Create/edit data (products, posts, profiles)
- **Features:** Form validation, create/edit modes, error handling
- **Works with or without auth**
- **Example apps:** Create product, edit profile, submit form

**4. `detail-screen.example.tsx`**
- **Use for:** Single item display (product, article, user)
- **Features:** Detail view, action buttons (edit, delete), params handling
- **Works with or without auth**
- **Example apps:** Product detail, article reader, profile page

#### Service Examples (`examples/services/`)

**1. `service-with-mock.example.ts`**
- **Use for:** Apps with backend API
- **Features:** Auto-switch between mock (dev) and real (prod) API
- **Mock API support:** Yes
- **Example:** Article service, product service

**2. `service-without-mock.example.ts`**
- **Use for:** Third-party APIs, production-only features
- **Features:** Direct API connection, no mock switching
- **Mock API support:** No
- **Example:** Weather API, payment gateway

**3. `offline-service.example.ts`**
- **Use for:** Offline-first apps, local storage
- **Features:** AsyncStorage, no network required
- **Mock API support:** N/A (no API)
- **Example:** Todo app, notes app, settings

#### Complete App Examples (`examples/apps/`)

**1. `todo-offline/`** - Offline Todo App
- **Auth:** ❌ No
- **API:** ❌ No
- **Storage:** AsyncStorage
- **Best for:** Personal productivity apps, calculators, offline tools
- **Read:** `examples/apps/todo-offline/README.md`

**2. `news-no-auth/`** - Public News App
- **Auth:** ❌ No
- **API:** ✅ Yes (with mock support)
- **Storage:** API only
- **Best for:** Public content, news, blogs, recipes
- **Read:** `examples/apps/news-no-auth/README.md`

**3. `dashboard-with-auth/`** - Protected Dashboard
- **Auth:** ✅ Yes
- **API:** ✅ Yes (with mock support)
- **Storage:** API + local token
- **Best for:** Business apps, SaaS, team tools
- **Read:** `examples/apps/dashboard-with-auth/README.md`

### Quick Decision Guide

**Building a new app? Choose your template variant:**

```
Does your app need user accounts?
├─ NO
│   ├─ Does it need API?
│   │   ├─ NO  → Use: examples/apps/todo-offline/
│   │   └─ YES → Use: examples/apps/news-no-auth/
│   └─ Remove auth from template (see TEMPLATE_VARIANTS.md)
│
└─ YES
    ├─ Keep auth in template
    ├─ Use: examples/apps/dashboard-with-auth/
    └─ Follow patterns for protected routes
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

## 📦 Mock API & Dummy Data

### Understanding the Mock API System

This boilerplate includes a **mock API** that simulates a backend server:

- **Data source**: `server/db.json` (JSON file with dummy data)
- **Mock API files**: `src/services/mockApi/*.mock.ts` (simulates API endpoints)
- **Type safe**: All data must match TypeScript interfaces in `src/types/`

### When Adding New Data Model

**IMPORTANT**: Follow this sequence exactly:

1. **Create TypeScript interface** in `src/types/*.types.ts`
   ```typescript
   // src/types/news.types.ts
   export interface News {
     id: string;
     title: string;
     content: string;
     createdAt: string;
   }
   ```

2. **Add dummy data to `server/db.json`**
   ```json
   {
     "users": [...],
     "news": [
       {
         "id": "1",
         "title": "Breaking News",
         "content": "News content here",
         "createdAt": "2024-11-18T00:00:00.000Z"
       }
     ]
   }
   ```

3. **Create mock API file** in `src/services/mockApi/news.mock.ts`
   - Import data: `import * as db from 'server/db.json'`
   - Implement CRUD operations (get, post, put, del)
   - Follow pattern in `products.mock.ts` or `users.mock.ts`

4. **Create service** in `src/services/newsService.ts`
   - Use `apiClient` from `./api`
   - Service calls mock API in development

**See SERVER_GUIDE.md for complete mock API documentation!**

### Dummy Data Rules

✅ **DO:**
- Match TypeScript interfaces exactly
- Include ALL required fields
- Use realistic data (not "test", "example")
- Use ISO date format: `"2024-11-18T00:00:00.000Z"`
- Include edge cases (empty, low stock, inactive users, etc.)
- Maintain referential integrity (foreign keys must exist)

❌ **DON'T:**
- Leave required fields empty
- Use wrong data types (string instead of number)
- Use fake/generic data
- Forget to update db.json when changing types

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

4. **Add dummy data to `server/db.json`**
   - Create array matching your type
   - Add 5-10 realistic items
   - Include edge cases

5. **Create mock API** (`src/services/mockApi/`)
   - Import from db.json
   - Implement CRUD operations
   - Follow existing patterns

6. **Create service** (`src/services/`)
   - API calls
   - Follow `examples/service.example.ts`

7. **Create hook if needed** (`src/hooks/`)
   - Data fetching logic
   - Follow `examples/hook.example.ts`

8. **Create components** (`src/components/`)
   - Reusable UI pieces
   - Follow `examples/component.example.tsx`

9. **Create screens** (`app/(tabs)/`)
   - Main screens
   - Follow `examples/screen.example.tsx`

10. **Update navigation**
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
- [ ] ⚠️ **Check TEMPLATE_VARIANTS.md** - Understand which template variant to use
- [ ] ⚠️ **Check examples/apps/** - See complete app examples for your use case
- [ ] ⚠️ **Check examples/screens/** - Use appropriate screen pattern (auth/no-auth)
- [ ] ⚠️ **Check examples/services/** - Use appropriate service pattern (mock/no-mock/offline)
- [ ] ⚠️ **Check package.json** - Only use existing packages!
- [ ] ⚠️ **NO new dependencies** - Use what's already installed
- [ ] ⚠️ **Check server/db.json** - Ensure dummy data exists and matches types (if using API)
- [ ] Read examples/ folder for patterns
- [ ] Check ai-context.json for paths
- [ ] Use TypeScript types
- [ ] Add dummy data to server/db.json (if using mock API)
- [ ] Create mock API file if needed
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
# Read important files (in order!)
cat TEMPLATE_VARIANTS.md        # ⭐ Start here - choose template variant
cat README.md
cat ai-context.json
cat GENERATE_RULES.md
cat CONVENTIONS.md
cat SERVER_GUIDE.md
cat AI_GUIDE.md

# Check examples structure
ls examples/
ls examples/screens/            # Screen patterns
ls examples/services/           # Service patterns
ls examples/apps/               # Complete app examples

# Check screen examples
cat examples/screens/list-screen-no-auth.example.tsx
cat examples/screens/list-screen-with-auth.example.tsx
cat examples/screens/form-screen.example.tsx
cat examples/screens/detail-screen.example.tsx

# Check service examples
cat examples/services/service-with-mock.example.ts
cat examples/services/service-without-mock.example.ts
cat examples/services/offline-service.example.ts

# Check complete app examples
cat examples/apps/todo-offline/README.md
cat examples/apps/news-no-auth/README.md
cat examples/apps/dashboard-with-auth/README.md

# Check legacy examples
cat examples/screen.example.tsx
cat examples/component.example.tsx
cat examples/hook.example.ts
cat examples/service.example.ts

# Check mock data & API (if using API)
cat server/db.json
ls src/services/mockApi/
cat src/services/mockApi/products.mock.ts

# Check existing structure
ls app/(tabs)/
ls src/components/
ls src/services/
ls src/store/
ls src/types/
```

## 🎯 Success Criteria

Your generated code is good if:
✅ **Uses ONLY existing packages** from package.json
✅ **NO new dependencies** added
✅ **Expo SDK 54 compatible** only
✅ **Dummy data in server/db.json** matches TypeScript types
✅ **Mock API implemented** for new data models
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
