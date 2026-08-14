# Next.js Modern Frontend Template – Specification

**Use case:** A reusable, production‑grade Next.js frontend template for any kind of project.  
**Output:** A fully structured Next.js application that can serve as a starting point for admin dashboards, SaaS platforms, booking systems, etc.

---

## 1. Tech Stack (Fixed)

| Area | Technology | Notes |
|------|------------|-------|
| Framework | Next.js 15 (latest stable) | App Router only, no Pages Router |
| Language | TypeScript (strict mode) | |
| Styling | Tailwind CSS 4 | Utility‑first |
| UI Library | shadcn/ui (latest) | Radix primitives + Tailwind |
| Icons | lucide-react | |
| State Management | Zustand | Lightweight, scalable |
| Forms | React Hook Form + Zod | Validation and types |
| API Client | Custom centralized `Request` class | Axios or fetch? **Axios** (interceptors, retry, queue) |
| Auth Tokens | HTTP‑only cookies + refresh via API route | Next.js middleware for protected routes |
| i18n | Custom solution, translations fetched from backend JSON | Next.js App Router compatible |
| Linting | ESLint (flat config) + Prettier | |
| Theme | Multiple named palettes × dark/light mode | Via CSS custom properties, switchable with a button |

---

## 2. Architecture & Folder Structure

The project follows **Feature‑based Domain Sliced** architecture, with strict separation of concerns. The API layer uses a **centralized request handler** pattern.

```
src/
├── app/                        # Next.js App Router pages & layouts
│   ├── (auth)/                 # Auth route group (public)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/            # Protected route group
│   │   ├── layout.tsx          # Dashboard layout, requires auth
│   │   ├── page.tsx
│   │   └── ...
│   ├── api/                    # Next.js Route Handlers (backend for frontend)
│   │   └── auth/
│   │       ├── refresh/route.ts
│   │       └── logout/route.ts
│   ├── layout.tsx              # Root layout (providers)
│   ├── page.tsx
│   └── globals.css
├── components/                 # Shared UI components
│   ├── ui/                     # shadcn/ui components (auto‑generated)
│   ├── forms/                  # Reusable form fields (Input, Select, etc.)
│   ├── layout/                 # Header, Sidebar, Footer
│   └── providers/              # ThemeProvider, I18nProvider, etc.
├── features/                   # Feature modules (domain‑driven)
│   ├── auth/
│   │   ├── components/         # LoginForm, RegisterForm
│   │   ├── hooks/              # useLogin, useLogout
│   │   ├── services/           # authService.ts
│   │   └── types/              # auth.types.ts
│   ├── user/
│   │   ├── services/           # userService.ts
│   │   └── ...
│   ├── booking/                # Example domain
│   │   └── services/           # bookingService.ts
│   └── ...
├── lib/                        # Core infrastructure
│   ├── api/                    # Centralized API layer
│   │   ├── Request.ts          # Single HTTP client class (axios wrapper)
│   │   ├── endpoints.ts        # Base URL and constants
│   │   ├── interceptors/       # Request/response interceptors
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── queue.ts            # Request queue for token refresh
│   ├── i18n/                   # Internationalization
│   │   ├── provider.tsx        # Fetches backend translations, provides context
│   │   ├── client.ts           # Hook: useTranslation()
│   │   └── types.ts
│   ├── stores/                 # Zustand global stores
│   │   ├── auth.store.ts
│   │   ├── theme.store.ts
│   │   └── i18n.store.ts       # To store loaded translations
│   ├── theme/                  # Theme system
│   │   ├── palettes.ts         # Named palettes: { [name]: { light, dark } }
│   │   ├── apply-theme.ts      # Applies palette + mode to <html>
│   │   └── types.ts
│   ├── auth/                   # Authentication utilities
│   │   ├── middleware.ts       # Next.js middleware for route protection
│   │   ├── constants.ts
│   │   └── getToken.ts         # Reads token from cookies (server & client)
│   └── utils/                  # General utilities
├── hooks/                      # Shared hooks (useDebounce, etc.)
├── types/                      # Global types
├── middleware.ts               # Next.js middleware entry point
└── config/                     # App configuration (env‑based)
    └── app.config.ts
```

### Key Rules
- **Feature modules** own their services, components, hooks, and types.
- **`lib/api/`** contains the single `Request` class – every service calls only `Request`.
- **`lib/stores/`** is where Zustand stores live – they don’t import any components.
- **No direct `fetch`/`axios` calls** outside `lib/api/`.
- **No circular dependencies**: services → Request → interceptors (dependency direction is one‑way).

---

## 3. Centralized API Layer (`src/lib/api/`)

### 3.1 `Request.ts` – The Single Entry Point

A **class** built on **axios** (because of its mature interceptor, retry, and queue support).  
All domain services use static methods that forward to `Request`:

```ts
// src/lib/api/Request.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setupAuthInterceptor } from './interceptors/auth.interceptor';
import { setupErrorInterceptor } from './interceptors/error.interceptor';
import { API_BASE_URL } from './endpoints';

class Request {
  private instance: AxiosInstance;
  private refreshQueue: Array<{ resolve: Function; reject: Function }> = [];
  private isRefreshing = false;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL, withCredentials: true });
    setupAuthInterceptor(this.instance, this);
    setupErrorInterceptor(this.instance);
  }

  // Expose HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config).then(res => res.data);
  }
  // post, put, patch, delete similarly...

  // Token refresh & queue logic
  async handleTokenRefresh() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      try {
        const res = await axios.post('/api/auth/refresh'); // to our own API route
        // token is set as httpOnly cookie automatically
        this.refreshQueue.forEach(cb => cb.resolve(true));
        this.refreshQueue = [];
      } catch (err) {
        this.refreshQueue.forEach(cb => cb.reject(err));
        this.refreshQueue = [];
        throw err;
      } finally {
        this.isRefreshing = false;
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.refreshQueue.push({ resolve, reject });
    });
  }
}

export const request = new Request(API_BASE_URL);
```

### 3.2 `endpoints.ts`
```ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const AUTH_REFRESH_URL = '/api/auth/refresh';
```

### 3.3 Interceptors
- **Auth interceptor** (`interceptors/auth.interceptor.ts`): attaches access token from cookie (read via `document.cookie` or a helper) to every request header.
- **Error interceptor** (`interceptors/error.interceptor.ts`): intercepts 401, calls `request.handleTokenRefresh()`, retries the failed request.

### 3.4 Domain Services (Example)
```ts
// src/features/auth/services/authService.ts
import { request } from '@/lib/api/Request';

export const authService = {
  login: (credentials: LoginDto) => request.post('/auth/login', credentials),
  forgotPassword: (email: string) => request.post('/auth/forgot-password', { email }),
};

// src/features/booking/services/bookingService.ts
import { request } from '@/lib/api/Request';

export const bookingService = {
  getBookings: () => request.get('/bookings'),
  createBooking: (data: CreateBookingDto) => request.post('/bookings', data),
};
```
Services are **plain objects** (not classes) because they don’t hold state. They only compose API calls.

---

## 4. Authentication & Protected Routes

### 4.1 Token Storage
- Access and refresh tokens are stored in **HTTP‑only cookies** (set by the backend on login, and also by the `/api/auth/refresh` route).
- The frontend never sees tokens – only the cookie is sent automatically via `withCredentials: true`.

### 4.2 `middleware.ts` (Next.js Middleware)
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/(auth)');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 4.3 Route Groups
- `(auth)/` – public pages (login, register)  
- `(dashboard)/` – protected pages (wrapped by layout that checks client‑side auth status if needed)

### 4.4 Client‑side Hooks
- `useAuth()` hook from Zustand store that holds user object and status.

---

## 5. Theming – Multiple Palettes × Dark/Light

### 5.1 Palette Definition (`src/lib/theme/palettes.ts`)
Each palette has a `light` and `dark` variant, defining a set of CSS custom properties (HSL colors).  
Example palettes: `default`, `ocean`, `forest`, `sunset`.

```ts
export const palettes = {
  default: {
    light: {
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      primary: '220 70% 50%',
      // ... all shadcn required tokens
    },
    dark: {
      background: '0 0% 3.9%',
      foreground: '0 0% 98%',
      primary: '220 70% 60%',
      // ...
    }
  },
  ocean: {
    light: { /* ... */ },
    dark: { /* ... */ }
  },
  // ...
};
```

### 5.2 Application (`src/lib/theme/apply-theme.ts`)
```ts
export function applyTheme(paletteName: string, mode: 'light' | 'dark') {
  const root = document.documentElement;
  const palette = palettes[paletteName]?.[mode];
  if (!palette) return;
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--${key}`, value);
  }
  root.classList.toggle('dark', mode === 'dark');
}
```

### 5.3 Zustand Theme Store
```ts
// src/lib/stores/theme.store.ts
import { create } from 'zustand';
import { applyTheme } from '@/lib/theme/apply-theme';

interface ThemeState {
  palette: string;
  mode: 'light' | 'dark';
  setPalette: (palette: string) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  palette: 'default',
  mode: 'light',
  setPalette: (palette) => {
    set({ palette });
    applyTheme(palette, get().mode);
  },
  toggleMode: () => {
    const newMode = get().mode === 'light' ? 'dark' : 'light';
    set({ mode: newMode });
    applyTheme(get().palette, newMode);
  }
}));
```

### 5.4 Theme Switcher Button
A component that cycles through palettes and toggles dark/light, persisted in `localStorage` (hydrated on app init).

---

## 6. State Management (Zustand)

Stores are plain Zustand stores, grouped under `src/lib/stores/`.  
- `auth.store.ts` – user object, login/logout actions.
- `theme.store.ts` – palette and mode.
- `i18n.store.ts` – holds current locale and translation dictionary.

All stores are **client‑side only**; they are used within `'use client'` components or custom hooks.

---

## 7. Forms (React Hook Form + Zod)

Shared form components in `src/components/forms/` (like `FormField`, `Input`, etc.).  
Each feature can define its own validation schemas:

```ts
// src/features/auth/schemas/login.schema.ts
import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginFormData = z.infer<typeof loginSchema>;
```

Forms use `useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })`.

---

## 8. Internationalization (i18n)

### 8.1 Approach
- Translation data is fetched as a JSON blob **from the backend** during app initialization.
- The i18n provider stores this dictionary in Zustand and re‑renders the app when locale changes.
- All text in components comes from a `useTranslation()` hook.

### 8.2 `src/lib/i18n/` Architecture
- `provider.tsx`: Client component that fetches `{ "en": {...}, "ar": {...} }` from an endpoint like `/api/translations` (or from the main backend), then sets the store.
- `client.ts`: Exports `useTranslation()` that reads the dictionary based on current locale.
- Backend sends translations as a flat or nested JSON; we’ll assume a structure like `{ "login.title": "Welcome" }`.

The hook:
```ts
export function useTranslation() {
  const locale = useI18nStore(s => s.locale);
  const dict = useI18nStore(s => s.dict);
  return {
    t: (key: string) => dict?.[locale]?.[key] ?? key,
    locale,
    changeLocale: useI18nStore(s => s.changeLocale)
  };
}
```

### 8.3 SSR Considerations
During SSR, the translation dictionary might not be available. We’ll provide a fallback (key or empty string) and avoid layout shifts. The client will hydrate with the real dictionary.

---

## 9. Code Quality

### 9.1 ESLint (Flat Config) + Prettier
- Use ESLint with Next.js plugin and strict TypeScript rules.
- Prettier for formatting, integrated via `eslint-config-prettier`.
- Add `lint-staged` + `husky` (optional, but recommended for template).

### 9.2 `package.json` scripts:
```json
{
  "lint": "next lint",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

---

## 10. Implementation Plan for `speckit`

1. **Initialize Next.js project** with App Router, TypeScript, Tailwind.
2. **Setup shadcn/ui** – init, add components.
3. **Create folder structure** as above.
4. **Implement `lib/api/`**:
   - `Request.ts` with axios, interceptors, queue.
   - `endpoints.ts`.
5. **Implement `lib/auth/`**:
   - Middleware `middleware.ts`.
   - Token helpers.
6. **Build theme system**:
   - Palettes, apply‑theme, Zustand store, switcher component.
7. **Build i18n provider and hook**.
8. **Create feature modules** (e.g., `auth`, `user`) with services, hooks, forms.
9. **Setup form system** with React Hook Form + Zod.
10. **Add protected route group `(dashboard)` and auth layout**.
11. **Integrate linting and formatting**.
12. **Document the architecture** (README).

---

## 11. Additional Best Practices Included

- **Server Components** for data‑fetched UI: if a page needs data from the external backend, it can call the backend directly from the server (using `fetch` with server‑side cookies) – not through the `Request` class, which is client‑bound. This avoids exposing tokens to the client.
- **`use client`** boundaries are minimised; only interactive components (forms, theme switcher) are client components.
- **Environment variables** for API base URL etc.
- **Error boundaries** for graceful UI fallback.
- **Axios** is chosen because of its built‑in interceptor chain, request queue examples, and wide adoption.
