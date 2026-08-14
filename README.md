# Dashboard Template

A config-driven admin dashboard template (Next.js App Router + React Query + Zustand + Tailwind + shadcn/ui). Start a new project by copying this repository, then re-brand, shape navigation, and configure dashboard widgets from a single file — no feature-screen code changes.

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL if needed
pnpm dev
```

Sign in to the admin shell at `/login` → `/admin`.

## Everything Lives in One Config

`src/config/app.config.ts` (typed as `AppConfig`, validated by `src/config/app.config.schema.ts`) drives branding, theming, locale, navigation, and dashboard widgets. Run `pnpm test:run` to validate it.

### Re-branding (US2)

Edit `appConfig.branding`:

```ts
branding: {
  name: "Acme Control Center",
  logoPath: "/logo.svg",      // absolute public path, or null for text-only
  palette: "ocean",           // "default" | "ocean" | "forest"
  defaultLocale: "en",        // "en" | "ar"
},
```

The new identity appears on the login page, sidebar header, browser title, and default locale — with zero code edits. Theme defaults (`theme.defaultPalette`, `theme.defaultMode`, `theme.storageKey`) live in the same file.

### Navigation (US3)

Define sidebar sections in `appConfig.navigation`. Each entry is either a link (`href`, `icon`) or a group with `children`. The first entry becomes the brand-link target.

```ts
navigation: [
  { id: "dashboard", labelKey: "admin.sidebar.dashboard", href: "/admin", icon: "layout-dashboard" },
  {
    id: "general",
    labelKey: "admin.sidebar.general",
    href: null,
    icon: null,
    children: [
      { href: "/admin/settings", labelKey: "admin.sidebar.settings", icon: null },
    ],
  },
],
```

`labelKey`s are resolved through i18n, so every key must exist in every supported locale.

### Dashboard Widgets (US4)

`appConfig.dashboard.widgets` is a typed array of four widget kinds — `stat-card`, `chart`, `ranked-list`, `breakdown`. Each widget has a `titleKey` and a `source` (a local API route, never an external URL):

```ts
dashboard: {
  defaultDateRangeDays: 30,
  widgets: [
    {
      id: "total-value",
      type: "stat-card",
      titleKey: "dashboard.kpis.totalValue",
      source: "/api/dashboard/sample?kind=total-value&from={from}&to={to}",
      options: { field: "total_value", format: "currency" },
    },
  ],
},
```

The template ships a mock source at `/api/dashboard/sample?kind=total-value|trend|top-items|breakdown` so a fresh copy boots with a working dashboard. Widgets load independently (per-widget loading/error/empty states) and are formatted with `appConfig.formatting`. See `specs/010-generalize-dashboard/contracts/data-source.md` for the response envelope and per-kind shapes.

### Entity Screens (US5)

Reusable building blocks in `src/components/management/` (table, toolbar, detail sheet, form dialog, delete dialog, pagination) compose into a full CRUD screen. The recipe is documented in `specs/010-generalize-dashboard/contracts/management-pattern.md`:

```
src/features/<entity>/types/        entity types
src/features/<entity>/schemas/      Zod schema (create + edit)
src/app/api/<entity>/route.ts       list + create (standard envelope + meta pagination)
src/app/api/<entity>/[id]/route.ts  update + delete (409 business-rule errors)
src/features/<entity>/services/     fetch calls
src/features/<entity>/hooks/        React Query hooks
src/features/<entity>/components/   page composing the blocks
src/app/admin/<entity>/page.tsx     route under the admin shell
```

All text comes from i18n keys the caller supplies; the blocks never hard-code strings.

### Languages (i18n)

Supported locales are declared in `src/lib/i18n/types.ts` (`SUPPORTED_LOCALES`, each with a direction). Runtime translations live in `src/lib/i18n/translations-sample.ts` (seeded into the store so keys never flash as raw strings); `messages/<locale>.json` mirrors them for future tooling. To add a language: add a `Locale` entry, add the `translations-sample` dict, add `messages/<lang>.json`, and extend the `localeCodeSchema` in `src/config/app.config.schema.ts`.

### Data Sources

Dashboards and entity screens read from **local** Next.js API routes that proxy to your external backend. Point widget `source` / entity services at your routes — the generic `fetchWidget` / `useWidgetData` and the management blocks handle fetching and states for you. See `specs/010-generalize-dashboard/contracts/data-source.md`.

## Scripts

```bash
pnpm dev          # start the dev server
pnpm build        # production build (also type-checks + lints)
pnpm lint         # ESLint
pnpm format       # Prettier write
pnpm format:check # Prettier check
pnpm test:run     # Vitest (config schema, sample route, i18n/RTL)
```

## Project Structure

```
src/
  app/                  routes: /admin, /admin/settings, /login, api/*
  components/
    dashboard/          widget components + widget-renderer
    layout/             AdminShell, AdminSidebar, BrandLogo, top bar
    management/         reusable entity CRUD blocks
    ui/                 shadcn/ui primitives
  config/               app.config.ts + Zod schema
  features/dashboard/   generic widget service/hook/page
  lib/i18n/             translations, provider, store
  lib/stores/           zustand stores (theme, i18n, admin)
```
