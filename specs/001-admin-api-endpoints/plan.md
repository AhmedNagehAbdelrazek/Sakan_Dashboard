# Implementation Plan: Admin API Endpoints Integration

**Branch**: `001-admin-api-endpoints` | **Date**: 2026-08-15 | **Spec**: [specs/001-admin-api-endpoints/spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-admin-api-endpoints/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Wire the config-driven admin dashboard template to the live Sakan admin backend (contract in `Sakan Admin.postman_collection.json`): reconcile sign-in to `POST /api/auth/login`, replace sample dashboard widgets with live metrics from `GET /api/admin/dashboard`, and add eight admin sections (Users, Properties, Applications, Payments, Activities, Flatmate Requests, Property Requests, Broadcast) each exposing the backend's read ("showing") and mutation capabilities. All data flows through the template's three-layer proxy pattern (feature service → local API route → `Request` class), and all new text is i18n-first (English + Arabic).

## Technical Context

**Language/Version**: TypeScript ^5.0.0 (strict, `@/*` → `./src/*`), Next.js ^15 (App Router only), React ^19 (Server Components by default, `"use client"` minimised)

**Primary Dependencies**: TanStack React Query ^5, Zustand ^5, Axios ^1.7, React Hook Form ^7 + `@hookform/resolvers` ^3, Zod ^3, Tailwind CSS ^4, shadcn/ui (Radix primitives), lucide-react, recharts, sonner, date-fns, clsx + tailwind-merge, class-variance-authority

**Storage**: No domain persistence — the external backend is the single source of truth. Client-side persistence only: httpOnly `auth_token` cookie (session), Zustand `persist` in `localStorage` (theme, locale, admin store).

**Testing**: Vitest ^2 + React Testing Library ^16 (`pnpm test:run`) — existing suites cover the config schema, the sample dashboard route, and i18n. Playwright ^1 declared (`test:e2e`) but no config present; not extended by this feature.

**Target Platform**: Web — admin dashboard served by Next.js (SSR + client), browser with RTL support.

**Project Type**: Web application (frontend consuming an external REST backend).

**Performance Goals**: List screens render data within 2 s (p95) under normal backend performance (spec SC-005); each mutation workflow completes in under 1 minute (SC-004).

**Constraints**: Constitution Principle II (three-layer proxy — feature services must never call the external backend directly or manage cookies); Principle V (i18n-first, no hard-coded display strings, en + ar); config-schema validation rejects non-local widget `source` paths; WCAG 2.1 AA; sample data must never appear on live admin screens.

**Scale/Scope**: 8 admin screens + dashboard; ~15 backend read operations and 12 mutation operations; 8 user stories; ~65 implementation tasks.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate (constitution principle) | Status | Notes |
|-------------------------------|--------|-------|
| **I. Feature-Based Domain Slicing** | ✅ PASS | New entities live in `src/features/<name>/` (types, schemas, services, hooks, components) — no cross-feature imports; shared logic in `src/lib/` |
| **II. Centralised API Layer (NON-NEGOTIABLE)** | ✅ PASS | Feature services fetch local routes only; local routes proxy via the `Request` class and own cookies; shared `src/lib/api/proxy.ts` forwards the `auth_token` cookie as `Authorization: Bearer` |
| **III. State Management via Zustand** | ✅ PASS | Admin session/user state extended in `src/lib/stores/admin.store.ts`; no new global stores required |
| **IV. Form Validation (RHF + Zod)** | ✅ PASS | All mutation forms use react-hook-form + Zod schemas in the owning feature's `schemas/` |
| **V. i18n-First & Theme-First UI** | ✅ PASS | Every new string is a flat key in `translations-sample.ts` + `messages/{en,ar}.json`; management blocks receive keys; no hard-coded strings |
| **Data Source Contract** | ✅ PASS | Local envelope `{ status, data, meta? }` per `contracts/data-source.md` (this feature supersedes the stale constitution reference); widget `source` stays a local route |
| **Testing & quality gates** | ✅ PASS | Existing Vitest suites kept green; `pnpm test:run`, `pnpm lint`, `pnpm format:check`, `pnpm build` pass on completion |
| **Git conventions** | ✅ PASS | Work proceeds on feature branch `001-admin-api-endpoints`; commits use conventional messages |

**Re-check after Phase 1 design**: ✅ All gates still pass — the design (see `research.md`, `data-model.md`, `contracts/`) introduces no architectural deviations, so the Complexity Tracking table below remains empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-admin-api-endpoints/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── backend-api.md   # external Sakan admin API contract (from Postman)
│   └── data-source.md   # local envelope + widget/management-block contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/login/page.tsx            # existing admin login page
│   ├── admin/
│   │   ├── page.tsx                     # /admin dashboard (updated for live metrics)
│   │   ├── settings/page.tsx            # existing placeholder
│   │   ├── users/page.tsx               # US3
│   │   ├── properties/page.tsx          # US4
│   │   ├── applications/page.tsx        # US5
│   │   ├── payments/page.tsx            # US6
│   │   ├── activities/page.tsx          # US7
│   │   ├── flatmate-requests/page.tsx   # US7
│   │   ├── property-requests/page.tsx   # US7
│   │   └── broadcast/page.tsx           # US8
│   └── api/                             # local proxy routes (Layer 2)
│       ├── auth/admin/login/route.ts    # US1 - target POST /api/auth/login
│       ├── auth/admin/logout/route.ts   # US1
│       ├── admin/dashboard/route.ts     # US2
│       ├── admin/broadcast/route.ts     # US8
│       ├── user/route.ts + [id]/route.ts                  # US3
│       ├── properties/route.ts + [id]/{approve,decline,reopen}/route.ts   # US4
│       ├── applications/route.ts + [id]/{approve,reject,complete}/route.ts # US5
│       ├── payments/route.ts + [id]/{receive,release,refund}/route.ts      # US6
│       ├── activities/route.ts + [id]/route.ts            # US7
│       ├── flatmate-requests/route.ts + [id]/route.ts     # US7
│       └── property-requests/route.ts + [id]/{status}/route.ts # US7
├── components/management/               # existing reusable blocks
│   └── entity-pagination.tsx            # aligned to {page,limit,total,totalPages}
├── config/app.config.ts                 # navigation + dashboard widgets updated
├── features/
│   ├── auth/                            # US1 - types/service/form updated
│   ├── dashboard/                       # US2 - metrics types/schema/service/hook
│   ├── users/                           # US3
│   ├── properties/                      # US4
│   ├── applications/                    # US5
│   ├── payments/                        # US6
│   ├── activities/                      # US7
│   ├── flatmate-requests/               # US7
│   ├── property-requests/               # US7
│   └── broadcast/                       # US8
├── lib/
│   ├── api/
│   │   ├── proxy.ts                     # shared server-side forwarder (Layer 2)
│   │   ├── normalize.ts                 # list response normaliser
│   │   ├── withAuth.ts                  # existing (cookie → Bearer)
│   │   └── Request.ts                   # existing (Layer 3, unchanged)
│   └── i18n/translations-sample.ts      # all new keys (en)
└── messages/                            # en.json + ar.json (mirrors)

specs/001-admin-api-endpoints/           # documentation for this feature
```

**Structure Decision**: Single-project web app layout, extended along the existing template conventions: one feature module per domain area under `src/features/`, one local API-route folder per resource under `src/app/api/`, and one admin page under `src/app/admin/`. Configuration (navigation, dashboard widgets) is updated in `src/config/app.config.ts`; all strings go through i18n keys. No new top-level structure is introduced.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. The design conforms to all constitution gates; the Complexity Tracking table is intentionally empty.
