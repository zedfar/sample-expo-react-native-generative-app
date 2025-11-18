# Template Variants Guide

How to customize this template for different app types and requirements.

## 📋 Overview

This template is **intentionally general** and includes both auth and mock API infrastructure. Depending on your app needs, you may want to:

1. **Remove authentication** - For apps with public content
2. **Remove mock API** - For apps connecting directly to real API
3. **Remove API entirely** - For offline-only apps
4. **Keep everything** - For full-featured apps with auth and API

## 🎯 Quick Decision Tree

```
Does your app need user accounts?
├─ YES → Keep authentication
│   ├─ Does it need API?
│   │   ├─ YES → Keep mock API for development
│   │   └─ NO → Remove API, use local storage
│   └─ Continue to final setup
└─ NO → Remove authentication
    ├─ Does it need API?
    │   ├─ YES → Remove auth, keep API
    │   └─ NO → Remove both auth and API
    └─ Continue to final setup
```

## 📁 Template Variants

### Variant 1: Offline-Only App (No Auth, No API)

**Use for:** Todo lists, calculators, notes, offline utilities

**Example:** See `examples/apps/todo-offline/`

#### What to Remove:

```bash
# 1. Remove auth folder
rm -rf app/(auth)/

# 2. Remove auth components
rm -rf src/components/auth/

# 3. Remove auth store
rm src/store/authStore.ts

# 4. Remove auth service
rm src/services/authService.ts

# 5. Remove API infrastructure
rm src/services/api.ts
rm -rf src/services/mockApi/

# 6. Remove server mock data
rm -rf server/
```

#### Files to Update:

**1. `app/_layout.tsx`** - Remove auth check:
```typescript
export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const setColorScheme = useThemeStore((state) => state.setColorScheme);

  useEffect(() => {
    setColorScheme(systemColorScheme);
  }, [systemColorScheme]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
```

**2. `src/utils/constants.ts`** - Remove API config:
```typescript
export const APP_CONFIG = {
  NAME: extra.APP_NAME || Constants.expoConfig?.name || 'Default App',
};

// Remove API_CONFIG entirely
```

#### What to Use Instead:

- **Storage:** AsyncStorage or Zustand with persistence
- **Example service:** `examples/services/offline-service.example.ts`
- **Example screens:** Use standard list/form screens

---

### Variant 2: Public Content App (No Auth, With API)

**Use for:** News apps, blogs, recipes, educational content

**Example:** See `examples/apps/news-no-auth/`

#### What to Remove:

```bash
# 1. Remove auth folder
rm -rf app/(auth)/

# 2. Remove auth components
rm -rf src/components/auth/

# 3. Remove auth store
rm src/store/authStore.ts

# 4. Remove auth service (but keep mockApi for auth if exists)
rm src/services/authService.ts
rm src/services/mockApi/auth.mock.ts
```

#### Files to Update:

**1. `app/_layout.tsx`** - Remove auth check:
```typescript
export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const setColorScheme = useThemeStore((state) => state.setColorScheme);

  useEffect(() => {
    setColorScheme(systemColorScheme);
  }, [systemColorScheme]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
```

**2. `src/services/api.ts`** - Remove auth token handling:
```typescript
// Remove this from interceptor:
private setupInterceptors() {
  this.api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // REMOVE: Token injection
      // const token = await storage.getToken();
      // if (token && config.headers) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );

  this.api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // REMOVE: 401 handling
      // if (error.response?.status === 401) {
      //   await storage.removeToken();
      // }
      return Promise.reject(this.handleError(error));
    }
  );
}
```

**3. `server/db.json`** - Remove users array:
```json
{
  "articles": [...],
  "categories": [...]
  // Remove "users" array
}
```

#### What to Keep:

- ✅ API infrastructure (`src/services/api.ts`)
- ✅ Mock API system (`src/services/mockApi/`)
- ✅ `API_CONFIG.MOCK_API` flag
- ✅ Server mock data (except users)

---

### Variant 3: Protected App (With Auth, With API)

**Use for:** Dashboards, business apps, SaaS, team tools

**Example:** See `examples/apps/dashboard-with-auth/`

#### What to Keep:

**Everything!** This variant uses the template as-is.

- ✅ Authentication system
- ✅ Protected routes
- ✅ Mock API for development
- ✅ Real API for production

#### What to Add:

1. **User-specific data models** in `src/types/`
2. **Protected screens** in `app/(tabs)/`
3. **User services** in `src/services/`
4. **Auth middleware** for protected routes

#### Example Protected Route:

```typescript
// app/(tabs)/dashboard.tsx
export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  // Dashboard content for logged-in user
  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
    </View>
  );
}
```

---

### Variant 4: Hybrid App (Optional Auth, With API)

**Use for:** Apps with both public and private content

**Example:** E-commerce (browse without login, checkout requires login)

#### What to Keep:

- ✅ Keep all auth infrastructure
- ✅ Keep all API infrastructure
- ✅ Mix of public and protected routes

#### App Structure:

```
app/
├── (auth)/              # Login/register
├── (public)/            # Public routes (no auth required)
│   ├── products.tsx     # Browse products
│   ├── [id].tsx         # Product detail
│   └── search.tsx       # Search
└── (protected)/         # Protected routes (auth required)
    ├── cart.tsx         # Shopping cart
    ├── checkout.tsx     # Checkout
    ├── orders.tsx       # Order history
    └── profile.tsx      # User profile
```

#### Route Guard Example:

```typescript
// app/(protected)/_layout.tsx
export default function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <Stack />;
}
```

---

## 🔧 Configuration Guide

### Disable Mock API

If you want to connect directly to real API (skip mock):

**Update `src/utils/constants.ts`:**
```typescript
export const API_CONFIG = {
  BASE_URL: APP_CONFIG.BASE_URL,
  TIMEOUT: 10000,
  MOCK_API: false, // Set to false to always use real API
};
```

Or use environment-based config:
```typescript
export const APP_CONFIG = {
  BASE_URL: extra.BASE_URL,
  MOCK_API: __DEV__ ? false : false, // Never use mock
};
```

### Remove Mock API Completely

If you don't need mock API at all:

```bash
# 1. Remove mock API folder
rm -rf src/services/mockApi/

# 2. Remove mock data
rm -rf server/
```

**Update all services:**
```typescript
// Before:
async getProducts() {
  if (API_CONFIG.MOCK_API) {
    return await mockApi.get('/products');
  }
  return await api.get('/products');
}

// After:
async getProducts() {
  return await api.get('/products');
}
```

---

## 📚 Examples Reference

### Screen Examples

Located in `examples/screens/`:

1. **`list-screen-no-auth.example.tsx`**
   - Public content list
   - No authentication required
   - Pull to refresh
   - Use for: News, products, recipes

2. **`list-screen-with-auth.example.tsx`**
   - User-specific content list
   - Authentication required
   - User greeting
   - Use for: Tasks, orders, notifications

3. **`form-screen.example.tsx`**
   - Create/edit data
   - Form validation
   - Works with or without auth
   - Use for: Create product, edit profile

4. **`detail-screen.example.tsx`**
   - Single item display
   - Detail with actions
   - Works with or without auth
   - Use for: Product detail, article detail

### Service Examples

Located in `examples/services/`:

1. **`service-with-mock.example.ts`**
   - Switches between mock and real API
   - Use for: Apps with backend

2. **`service-without-mock.example.ts`**
   - Direct API connection only
   - Use for: Third-party APIs

3. **`offline-service.example.ts`**
   - AsyncStorage-based service
   - Use for: Offline apps

### Mini App Examples

Located in `examples/apps/`:

1. **`todo-offline/`**
   - No auth, no API
   - Complete offline app
   - AsyncStorage for data

2. **`news-no-auth/`**
   - No auth, with API
   - Public content
   - Mock API support

3. **`dashboard-with-auth/`**
   - With auth, with API
   - Protected routes
   - User-specific data

---

## 🎯 Quick Start by App Type

### Todo/Notes App
```bash
1. Remove: app/(auth)/, src/store/authStore.ts, src/services/api.ts
2. Use: examples/services/offline-service.example.ts
3. Reference: examples/apps/todo-offline/
```

### News/Blog App
```bash
1. Remove: app/(auth)/, src/store/authStore.ts
2. Keep: API infrastructure
3. Reference: examples/apps/news-no-auth/
```

### Dashboard/SaaS App
```bash
1. Keep: Everything as-is
2. Add: User-specific data models
3. Reference: examples/apps/dashboard-with-auth/
```

### E-commerce App
```bash
1. Keep: Everything
2. Add: Public + protected route groups
3. Mix: Public browsing + protected checkout
```

---

## ✅ Checklist After Customization

- [ ] Removed unused folders (auth, mockApi, etc.)
- [ ] Updated `app/_layout.tsx` (removed auth check if needed)
- [ ] Updated `src/utils/constants.ts` (removed API config if needed)
- [ ] Updated services (removed mock API switching if needed)
- [ ] Updated `server/db.json` (removed unused collections)
- [ ] Tested app startup
- [ ] Tested navigation flow
- [ ] Updated `package.json` name and version
- [ ] Removed unused dependencies (if any)

---

## 💡 Pro Tips

1. **Start with the full template** - Easier to remove than to add
2. **Use examples as reference** - Don't reinvent patterns
3. **Test after each removal** - Make sure app still works
4. **Keep documentation** - Update README with your changes
5. **Commit before major changes** - Easy to revert if needed

---

## 🆘 Need Help?

Check these files:
- `AI_GUIDE.md` - AI agent instructions
- `README.md` - General project overview
- `SERVER_GUIDE.md` - Mock API documentation
- `CONVENTIONS.md` - Coding standards
- `examples/` - Working code examples
