# Mock API Server Guide

Complete guide for working with mock API and dummy data in this boilerplate.

## 📦 Overview

This boilerplate uses a **mock API system** that simulates a real backend server for development and testing purposes. The mock API reads data from `server/db.json` and provides full CRUD operations.

### Why Mock API?

✅ **No Backend Required** - Start developing immediately without setting up a server
✅ **Realistic Data** - Work with actual data structures matching your TypeScript interfaces
✅ **Full CRUD** - Complete Create, Read, Update, Delete operations
✅ **Type Safe** - All mock data matches your TypeScript types
✅ **Easy Testing** - Test your UI with controlled data

### 📌 Important Note

The `server/db.json` file contains **minimal sample/starter data** for demonstration purposes only. This data is meant to:
- Show the correct structure and format
- Demonstrate edge cases (active/inactive users, low stock products)
- Serve as a template for AI agents

**This data will be replaced** when AI agents generate new features specific to your app. Think of it as a starting point, not production data.

## 🗂️ File Structure

```
templates/agent-generator/
├── server/
│   └── db.json                          # Mock database (dummy data)
│
├── src/
│   ├── types/                           # TypeScript interfaces
│   │   ├── auth.types.ts                # User & Auth types
│   │   ├── user.types.ts                # User data types
│   │   └── product.types.ts             # Product & Category types
│   │
│   └── services/
│       ├── mockApi/                     # Mock API implementations
│       │   ├── auth.mock.ts             # Auth endpoints (login, register, etc)
│       │   ├── users.mock.ts            # User CRUD endpoints
│       │   ├── products.mock.ts         # Product CRUD endpoints
│       │   └── categories.mock.ts       # Category CRUD endpoints
│       │
│       └── api.ts                       # API client (switches between mock/real)
```

## 📋 Understanding server/db.json

### Structure

The `server/db.json` file is the **mock database** that contains sample/starter data. It must match your TypeScript interfaces exactly.

**Current Sample Data:**
- **3 users** (1 admin, 1 active user, 1 inactive user) - demonstrates different roles and statuses
- **3 categories** (Electronics, Food, Clothing) - shows category structure
- **4 products** (includes 1 low stock item) - demonstrates normal and edge cases

**Format:**
```json
{
  "users": [...],      // Array of User objects (sample: 3 items)
  "categories": [...], // Array of Category objects (sample: 3 items)
  "products": [...]    // Array of Product objects (sample: 4 items)
}
```

**⚠️ This is minimal starter data!** When you add new features (e.g., News app, Todo app), you'll add new arrays or replace existing ones with data specific to your app.

### Current Data Models

#### 1. Users

Based on `User` interface from `src/types/auth.types.ts`:

```typescript
interface User {
  id: string;                          // Required: Unique identifier
  email: string;                       // Required: User email
  password?: string;                   // Optional: For authentication (mock only)
  name: string;                        // Required: User full name
  role: 'admin' | 'user' | string;    // Required: User role
  status: 'active' | 'inactive' | string; // Required: Account status
  avatar?: string;                     // Optional: Avatar URL
  about?: string;                      // Optional: User bio
  location?: string;                   // Optional: User location
  phone?: string;                      // Optional: Phone number
  createdAt: string;                   // Required: ISO date string
  updatedAt: string;                   // Required: ISO date string
}
```

**Example:**
```json
{
  "id": "1",
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin",
  "status": "active",
  "avatar": "https://i.pravatar.cc/150?u=admin@example.com",
  "about": "System administrator with full access",
  "location": "Jakarta, Indonesia",
  "phone": "+62812345678",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Categories

Based on `Category` interface from `src/types/product.types.ts`:

```typescript
interface Category {
  id: string;          // Required: Unique identifier
  name: string;        // Required: Category name
  slug: string;        // Required: URL-friendly name
  description: string; // Required: Category description
  icon: string;        // Required: Emoji or icon
  color: string;       // Required: Hex color code
}
```

**Example:**
```json
{
  "id": "1",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories",
  "icon": "📱",
  "color": "#3b82f6"
}
```

#### 3. Products

Based on `Product` interface from `src/types/product.types.ts`:

```typescript
interface Product {
  id: string;          // Required: Unique identifier
  name: string;        // Required: Product name
  categoryId: string;  // Required: Foreign key to categories
  unit: string;        // Required: Unit of measurement (pcs, kg, liter, etc)
  stockSystem: number; // Required: Stock in system
  stockPhysical: number; // Required: Actual physical stock
  minStock: number;    // Required: Minimum stock threshold
  price: number;       // Required: Product price
  description: string; // Required: Product description
  createdAt: string;   // Required: ISO date string
  updatedAt: string;   // Required: ISO date string
}
```

**Example:**
```json
{
  "id": "1",
  "name": "iPhone 15 Pro",
  "categoryId": "1",
  "unit": "pcs",
  "stockSystem": 50,
  "stockPhysical": 48,
  "minStock": 10,
  "price": 15000000,
  "description": "Latest iPhone with A17 Pro chip",
  "createdAt": "2024-01-10T00:00:00.000Z",
  "updatedAt": "2024-01-10T00:00:00.000Z"
}
```

## 🎯 How Mock API Works

### 1. Data Import

Each mock file imports data from `server/db.json`:

```typescript
// src/services/mockApi/products.mock.ts
import * as db from 'server/db.json';

let products: Product[] = [...db.products]; // Clone the data
```

### 2. CRUD Operations

Mock files provide functions that simulate API endpoints:

```typescript
// GET /products
export async function get<T = any>(url: string): Promise<T> {
  if (url === '/products') {
    return products as unknown as T;
  }
  // ...
}

// POST /products
export async function post<T = any>(url: string, body: CreateProductData): Promise<T> {
  const newProduct = {
    id: String(Date.now()),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  return newProduct as unknown as T;
}

// PUT /products/:id
export async function put<T = any>(url: string, body: UpdateProductData): Promise<T> {
  const match = url.match(/\/products\/(\w+)/);
  if (match) {
    const id = match[1];
    const index = products.findIndex(p => p.id === id);
    products[index] = { ...products[index], ...body };
    return products[index] as unknown as T;
  }
}

// DELETE /products/:id
export async function del<T = any>(url: string): Promise<T> {
  const match = url.match(/\/products\/(\w+)/);
  if (match) {
    products = products.filter(p => p.id !== match[1]);
    return { message: 'Deleted' } as unknown as T;
  }
}
```

### 3. API Client Integration

The API client (`src/services/api.ts`) switches between mock and real API:

```typescript
// Development: Uses mock API
if (__DEV__) {
  // Route requests to mock API
}
// Production: Uses real API
else {
  // Route requests to actual backend
}
```

## 🔧 Adding New Data Models

When building a new feature (e.g., News app, Todo app), AI agents will:
1. Create new TypeScript interfaces
2. **Add or replace data** in `server/db.json` with data specific to your app
3. Create corresponding mock API files
4. Build the UI components and screens

### How Much Data to Add?

**Keep it minimal!** Add only **2-4 sample items** per collection:
- ✅ **2-3 items minimum** - enough to test lists and UI
- ✅ **Include 1 edge case** - low stock, inactive, etc.
- ❌ **Don't add 10+ items** - it's just sample data, not production

**Example:** For a News app, add 3 news articles (1 recent, 1 older, 1 with long title for edge case).

### Step 1: Create TypeScript Interface

Create a new type file in `src/types/`:

```typescript
// src/types/news.types.ts
export interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### Step 2: Add Data to db.json

Add a new array to `server/db.json` with **2-4 sample items**:

```json
{
  "users": [...],      // Keep existing if still relevant, or remove
  "categories": [...],  // Keep existing if still relevant, or remove
  "products": [...],   // Keep existing if still relevant, or remove
  "news": [            // New array for news feature
    {
      "id": "1",
      "title": "Breaking News: AI Revolution",
      "content": "This is the news content...",
      "author": "John Doe",
      "imageUrl": "https://picsum.photos/400/300?random=1",
      "publishedAt": "2024-11-18T10:00:00.000Z",
      "createdAt": "2024-11-18T09:00:00.000Z",
      "updatedAt": "2024-11-18T09:00:00.000Z"
    },
    {
      "id": "2",
      "title": "Technology Trends 2024",
      "content": "Another news article...",
      "author": "Jane Smith",
      "imageUrl": "https://picsum.photos/400/300?random=2",
      "publishedAt": "2024-11-17T14:00:00.000Z",
      "createdAt": "2024-11-17T14:00:00.000Z",
      "updatedAt": "2024-11-17T14:00:00.000Z"
    },
    {
      "id": "3",
      "title": "Edge Case: This is a Very Long Title That Might Break Your UI Layout If Not Handled Properly",
      "content": "Testing edge cases...",
      "author": "Test User",
      "imageUrl": "https://picsum.photos/400/300?random=3",
      "publishedAt": "2024-11-16T08:00:00.000Z",
      "createdAt": "2024-11-16T08:00:00.000Z",
      "updatedAt": "2024-11-16T08:00:00.000Z"
    }
  ]
}
```

**Note:** You can remove `users`, `categories`, and `products` arrays if they're not needed for your specific app.

### Step 3: Create Mock API File

Create `src/services/mockApi/news.mock.ts`:

```typescript
import { News } from '@/types/news.types';
import * as db from 'server/db.json';

let news: News[] = [...db.news];

export async function get<T = any>(url: string): Promise<T> {
  if (url === '/news') {
    return news as unknown as T;
  }

  // Get single news by ID
  const match = url.match(/\/news\/(\w+)/);
  if (match) {
    const item = news.find(n => n.id === match[1]);
    if (!item) throw new Error('News not found');
    return item as unknown as T;
  }

  throw new Error(`Unknown GET /news endpoint: ${url}`);
}

export async function post<T = any>(url: string, body: Partial<News>): Promise<T> {
  if (url === '/news') {
    const newNews: News = {
      id: String(Date.now()),
      title: body.title || '',
      content: body.content || '',
      author: body.author || '',
      imageUrl: body.imageUrl || '',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    news.push(newNews);
    return newNews as unknown as T;
  }
  throw new Error(`Unknown POST /news endpoint: ${url}`);
}

// Add PUT and DELETE similarly...
```

### Step 4: Create Service

Create `src/services/newsService.ts`:

```typescript
import { apiClient } from './api';
import { News } from '@/types/news.types';

export const newsService = {
  getNews: async (): Promise<News[]> => {
    const response = await apiClient.get('/news');
    return response.data;
  },

  getNewsById: async (id: string): Promise<News> => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  },

  createNews: async (data: Partial<News>): Promise<News> => {
    const response = await apiClient.post('/news', data);
    return response.data;
  },
};
```

## 💡 Best Practices

### 1. Always Match TypeScript Interfaces

**❌ Bad - Missing required fields:**
```json
{
  "id": "1",
  "name": "Product"
  // Missing: categoryId, unit, stockSystem, etc.
}
```

**✅ Good - All fields present:**
```json
{
  "id": "1",
  "name": "Product",
  "categoryId": "1",
  "unit": "pcs",
  "stockSystem": 100,
  "stockPhysical": 98,
  "minStock": 10,
  "price": 50000,
  "description": "Description here",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Keep Data Minimal but Realistic

**❌ Bad - Too many items or generic data:**
```json
{
  "products": [
    { "id": "1", "name": "Test Product 1" },
    { "id": "2", "name": "Test Product 2" },
    { "id": "3", "name": "Test Product 3" },
    // ... 20 more items (too much!)
  ]
}
```

**✅ Good - Minimal (2-4 items) with realistic data:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Smartphone",
      "description": "Latest smartphone with advanced features"
    },
    {
      "id": "2",
      "name": "Wireless Earbuds (Low Stock)",
      "description": "Bluetooth earbuds - edge case for testing"
    }
  ]
}
```

### 3. Include Edge Cases (But Keep It Minimal)

Add **1-2 edge cases** to test different scenarios:

```json
{
  "products": [
    {
      "id": "1",
      "stockSystem": 50,
      "minStock": 10
      // Normal stock
    },
    {
      "id": "2",
      "stockSystem": 8,
      "minStock": 15
      // Edge case: Low stock (stockSystem < minStock)
    }
  ],
  "users": [
    {
      "id": "1",
      "status": "active"
      // Normal active user
    },
    {
      "id": "2",
      "status": "inactive"
      // Edge case: Inactive user
    }
  ]
}
```

**Remember:** Don't add every possible edge case. Just 1-2 is enough for testing!

### 4. Use Proper Date Formats

Always use ISO 8601 format:

```json
{
  "createdAt": "2024-11-18T10:30:00.000Z",
  "updatedAt": "2024-11-18T10:30:00.000Z"
}
```

### 5. Maintain Referential Integrity

Ensure foreign keys reference existing data:

```json
{
  "categories": [
    { "id": "1", "name": "Electronics" }
  ],
  "products": [
    {
      "id": "1",
      "categoryId": "1"  // ✅ References existing category
    },
    {
      "id": "2",
      "categoryId": "999"  // ❌ Category doesn't exist
    }
  ]
}
```

## 🎓 For AI Agents

When generating code that needs data:

### 1. Check Existing Types First

```bash
# Read the type definition
cat src/types/product.types.ts
```

### 2. Check db.json Structure

```bash
# See what data is available
cat server/db.json
```

### 3. Follow the Pattern

Copy existing mock API patterns:
- Read `src/services/mockApi/products.mock.ts`
- Copy the CRUD structure
- Adapt for your new data model

### 4. Ensure Data Matches Types

**Steps:**
1. Read TypeScript interface from `src/types/*.types.ts`
2. Create **2-4 sample items** in `server/db.json` matching ALL required fields
3. Include 1 edge case if applicable
4. Create mock API file in `src/services/mockApi/`
5. Create service in `src/services/`

**Important:** Keep data minimal! This is sample data, not production data.

### Example Workflow

```typescript
// 1. Type (src/types/todo.types.ts)
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// 2. Data (server/db.json) - Add 2-3 minimal items
{
  "todos": [
    {
      "id": "1",
      "title": "Learn React Native",
      "completed": false,
      "createdAt": "2024-11-18T00:00:00.000Z"
    },
    {
      "id": "2",
      "title": "Build Todo App",
      "completed": true,
      "createdAt": "2024-11-17T00:00:00.000Z"
    },
    {
      "id": "3",
      "title": "Edge Case: Very Long Todo Title That Might Break UI Layout",
      "completed": false,
      "createdAt": "2024-11-16T00:00:00.000Z"
    }
  ]
}

// 3. Mock API (src/services/mockApi/todos.mock.ts)
import * as db from 'server/db.json';
let todos: Todo[] = [...db.todos];
export async function get<T = any>(url: string): Promise<T> {
  if (url === '/todos') return todos as unknown as T;
  // ...
}

// 4. Service (src/services/todoService.ts)
export const todoService = {
  getTodos: async () => {
    const response = await apiClient.get('/todos');
    return response.data;
  }
};
```

## ⚠️ Common Mistakes

### 1. Missing Fields

```json
// ❌ Missing required fields
{
  "id": "1",
  "name": "Product"
}

// ✅ All required fields present
{
  "id": "1",
  "name": "Product",
  "categoryId": "1",
  "unit": "pcs",
  "stockSystem": 10,
  "stockPhysical": 10,
  "minStock": 5,
  "price": 100000,
  "description": "Description",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Wrong Data Types

```json
// ❌ Wrong types
{
  "price": "100000",      // Should be number
  "stockSystem": "10",    // Should be number
  "createdAt": 1234567890 // Should be ISO string
}

// ✅ Correct types
{
  "price": 100000,
  "stockSystem": 10,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Too Many or Too Few Items

```json
// ❌ Empty - can't test UI
{
  "products": []
}

// ❌ Too many - unnecessary
{
  "products": [
    { /* 20+ items - overkill! */ }
  ]
}

// ✅ Minimal sample data (2-4 items)
{
  "products": [
    { "id": "1", "name": "Product 1" },
    { "id": "2", "name": "Product 2 (edge case)" }
  ]
}
```

## 🚀 Quick Reference

### File Checklist

When adding new data model:

- [ ] Create TypeScript interface in `src/types/*.types.ts`
- [ ] Add dummy data array to `server/db.json`
- [ ] Create mock API file in `src/services/mockApi/*.mock.ts`
- [ ] Create service file in `src/services/*Service.ts`
- [ ] Test with a screen/component

### Data Checklist

For db.json:

- [ ] **Keep it minimal** - Only 2-4 items per collection
- [ ] All required fields from TypeScript interface
- [ ] Correct data types (string, number, boolean)
- [ ] ISO date format for dates
- [ ] Valid foreign keys (if applicable)
- [ ] Realistic data (not just "test", "example")
- [ ] Include 1-2 edge cases (low stock, inactive, long text, etc.)

## 📞 Need Help?

Check these files for examples:
- `server/db.json` - Current dummy data
- `src/types/*.types.ts` - All type definitions
- `src/services/mockApi/*.mock.ts` - Mock API implementations
- `examples/service.example.ts` - Service pattern

---

**Remember:**
- Keep `server/db.json` **minimal** (2-4 items per collection)
- This is **sample/starter data**, not production data
- Data will be replaced when AI generates new features
- Mock API should feel like a real API - keep data realistic and type-safe!
