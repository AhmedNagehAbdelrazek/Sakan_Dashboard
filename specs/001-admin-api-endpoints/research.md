# Research: Admin API Endpoints Integration

**Feature**: specs/001-admin-api-endpoints/spec.md
**Phase**: 0 — Outline & Research
**Date**: 2026-08-15

This document records the decisions taken to design the integration of the dashboard template with the live Sakan admin backend described in `Sakan Admin.postman_collection.json`. Each decision records the choice, rationale, and alternatives considered.

## 1. Backend base URL resolution

- **Decision**: `NEXT_PUBLIC_API_URL` must be configured to the backend **host root** (e.g. `http://localhost:8000`) so that the documented Postman paths (`/api/auth/login`, `/api/user`, `/api/properties/...`) resolve correctly when appended by the axios `Request` client (`baseURL + path`).
- **Rationale**: The Postman contract uses `{{baseUrl}}/api/...`. The template default (`http://localhost:8000/api/v1`) would produce `http://localhost:8000/api/v1/api/...`, which is wrong. Using the exact documented paths keeps the proxy layer an unambiguous mirror of the external contract.
- **Alternatives considered**:
  - Keep `/api/v1` default and strip the `/api` prefix in every proxy path — rejected: it obfuscates the contract and risks drift when the backend path changes.
  - Introduce a separate `BACKEND_API_URL` env var — rejected: single source of truth already exists (`NEXT_PUBLIC_API_URL`); `.env.example` documentation suffices.

## 2. Login endpoint and response shape

- **Decision**: Update the local proxy route `src/app/api/auth/admin/login/route.ts` to call the backend `POST /api/auth/login` (not `/admin/auth/login`) and to parse the documented response `{ user: { id, username, email, phone, countryCode, role, verified }, role, token }`. Keep the **local** route path `/api/auth/admin/login` (feature-service contract unchanged), keep the httpOnly `auth_token` cookie, and return `{ user, token }` to the client.
- **Rationale**: The whole feature is defined by the Postman contract; the current proxy targets an older backend contract. Only the server route and the user shape need to change; the client login flow stays intact.
- **Alternatives considered**:
  - Rename the local route to `/api/auth/login` — rejected: pure churn, no functional benefit.
  - Store the token in `localStorage` instead of the httpOnly cookie — rejected: violates the security-boundary principle (Layer 2 owns cookies).

## 3. List response shapes (bare array vs envelope)

- **Decision**: Treat the paginated envelope `{ items, page, limit, total, totalPages? }` as authoritative for list endpoints, but make the local proxy and a shared normalizer tolerant of a **bare array** (wrapped into `{ items, page: 1, limit: items.length, total: items.length, totalPages: 1 }`).
- **Rationale**: The Postman saved examples for `/api/user` and `/api/activities` show bare arrays while the collection's own test scripts read `json.items[0].id` for every list — evidence the live backend returns the envelope and the bare arrays are simplified artifacts. Tolerance costs little and prevents hard failures either way.
- **Alternatives considered**: Require the envelope everywhere — rejected: breaks if the backend truly returns bare arrays for those two resources.

## 4. Local data envelope

- **Decision**: All local API routes return the template's documented envelope:
  - List: `{ status: "success", data: { items, page, limit, total, totalPages } }`
  - Mutation/detail: `{ status: "success", data: <record or message> }`
  - Error: `{ status: "error", message }` with a matching HTTP status.
- **Rationale**: This matches `apiEnvelopeSchema` in `src/features/dashboard/schemas/dashboard.schema.ts` and `src/types/api.d.ts`, so existing widget and management-block plumbing works unchanged.
- **Note**: The constitution's "Data Source Contract" section references `specs/010-generalize-dashboard/contracts/data-source.md`, which does **not exist** in this repository. This feature ships `contracts/data-source.md` as the authoritative written contract; the schema file remains the code-level source of truth.
- **Alternatives considered**: Pass the backend envelope through untouched — rejected: mixes two envelope dialects and breaks the template's existing consumers.

## 5. Dashboard metrics → widgets

- **Decision**: The backend dashboard endpoint returns a flat object with 11 keys (10 numeric metrics + `recentActivities`). The local proxy `src/app/api/admin/dashboard/route.ts` returns `{ status: "success", data: <object> }`; the config maps the 10 numeric fields to **stat-card** widgets (`options.field` + `format: "number"`) and `recentActivities` to a **ranked-list** widget.
- **Rationale**: The stat-card widget already reads an object field (`data[options.field]`) and the ranked-list renders arrays of records — both fit without new widget types. A single source keeps all metrics on one load path.
- **Alternatives considered**: One local route per metric — rejected: 10 round-trips instead of 1. A custom "metrics grid" widget — rejected: reuse existing widget kinds.

## 6. Auth forwarding for server proxy routes

- **Decision**: Server API routes forward the admin session by reading the httpOnly `auth_token` cookie via `getAuthHeaders(req)` (`src/lib/api/withAuth.ts`) and passing `Authorization: Bearer <token>` explicitly in the `Request` call config. A small shared helper `src/lib/api/proxy.ts` centralises `get/patch/post` forwarding so every entity route is a few lines.
- **Rationale**: The axios auth interceptor reads the client-side in-memory `tokenHolder`, which is empty on the server. Explicit header forwarding is the only reliable server-side path and keeps tokens out of client code (Constitution Principle II).
- **Alternatives considered**: Rely on `withCredentials` cookies (axios sends `Cookie` header) — rejected: the external API authenticates via `Authorization: Bearer`, not session cookies.

## 7. Status transitions and mutation validation

- **Decision**: The client offers only **valid** transitions and enforces required fields with Zod schemas (e.g. application reject reason category, payment refund reason, broadcast title); the backend remains the final authority. Invalid-transition or conflict responses from the backend are surfaced verbatim as error messages.
- **Rationale**: Prevents user error at the source while keeping the backend authoritative (per spec: "business-rule rejections surface the reason clearly").
- **Alternatives considered**: Send first, let backend reject — rejected: worse UX for a 2-state UI.

## 8. i18n coverage

- **Decision**: Every new user-facing string is a flat key in `src/lib/i18n/translations-sample.ts` and mirrored in `messages/en.json` and `messages/ar.json`. Screens pass **keys** to the management blocks (table headers, toolbar placeholders, pagination labels, dialogs) and use `useTranslation()` for everything else. Arabic RTL is handled by the existing provider.
- **Rationale**: Constitution Principle V forbids hard-coded display strings; the template's flat-key system is the existing mechanism.

## 9. Property images

- **Decision**: Reuse `getImageUrl()` (`src/lib/utils.ts`) to rewrite backend image URLs; missing/broken images render a placeholder without breaking the layout.
- **Rationale**: The template already anticipates image proxying; interactive maps are out of scope (per spec assumptions).

## Alternatives summary

| Area | Chosen | Rejected |
|------|--------|----------|
| Base URL | host root + `/api/*` paths | `/api/v1` prefix stripping |
| Login | `/api/auth/login` parse `{user,role,token}` | keep old `/admin/auth/login` |
| Lists | envelope + tolerant normalizer | envelope-only |
| Local envelope | `{status,data,meta?}` success envelope | backend pass-through |
| Widgets | stat-card ×10 + ranked-list | custom widget / per-metric routes |
| Proxy auth | cookie → Bearer via shared helper | withCredentials cookies |
| Validation | client pre-validates + backend authoritative | backend-only |
| i18n | flat keys en/ar | hard-coded strings |
