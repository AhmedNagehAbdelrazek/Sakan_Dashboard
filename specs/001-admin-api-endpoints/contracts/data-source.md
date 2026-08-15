# Data Source Contract: Local API Layer

**Feature**: specs/001-admin-api-endpoints/spec.md
**Date**: 2026-08-15

This document is the authoritative written contract for how dashboard widgets and entity screens consume data in this project. It supersedes the stale reference to `specs/010-generalize-dashboard/contracts/data-source.md` in the constitution (that file does not exist in this repository). The code-level source of truth is `src/features/dashboard/schemas/dashboard.schema.ts` (`apiEnvelopeSchema`).

## Layering

Per Constitution Principle II, all external backend communication flows:

```text
Feature Service  ──fetch──>  Local API Route  ──Request class──>  External Backend
(UI, no secrets)            (proxies, cookies, envelope)        (Sakan admin API)
```

Feature services MUST NOT call the external backend directly and MUST NOT manage cookies.

## Response envelope

Every local API route responds with the standard envelope:

```json
{ "status": "success" | "error", "data": <...>, "message": "..." }
```

- Success list: `data = { "items": [], "page": 1, "limit": 20, "total": 1, "totalPages": 1 }`
- Success single / mutation: `data = <record>` or `data = { "message": "..." }`
- Error: `status: "error"`, `message` (human-readable), non-2xx HTTP status.

## Pagination meta

Standardised to camelCase: `{ page, limit, total, totalPages }`.

- Local routes normalise backend responses (envelope or bare array) into this shape via `src/lib/api/normalize.ts`.
- `src/components/management/entity-pagination.tsx` consumes `{ page, limit, total, totalPages }`; it hides itself when `totalPages <= 1`.

## Widget data shapes

Dashboard widgets read `envelope.data` for one of four kinds:

| Widget kind | `data` shape | `options` |
|-------------|--------------|-----------|
| `stat-card` | a number, or an object containing the numeric `field` | `{ field, format: "number"\|"currency" }` |
| `chart` | array of row objects | `{ chartType: "line"\|"bar"\|"area", xField, yFields[] }` |
| `ranked-list` | array of row objects | `{ rankField, labelField, valueFields: [{ key, format }] }` |
| `breakdown` | array of row objects | `{ labelField, valueField, format }` |

Widget `source` MUST be a local route path beginning with `/` (enforced by config schema). Templates `{from}`, `{to}`, `{limit}` are substituted before fetch.

### Dashboard metrics (this feature)

`src/app/api/admin/dashboard/route.ts` proxies the backend `/api/admin/dashboard` and returns `{ status: "success", data: { totalUsers, totalLandlords, totalStudents, totalProperties, approvedProperties, totalApplications, pendingApplications, totalPayments, receivedPayments, releasedPayments, recentActivities } }`.

- 10 numeric metrics → `stat-card` widgets (`field` + `format: "number"`).
- `recentActivities` → `ranked-list` widget.

## Management block contract

Entity screens compose the reusable blocks in `src/components/management/`:

- **Table**: `columns: { key, headerKey, render(row) }[]`, `rows`, `rowKey`, `isLoading`, `isError`, `emptyTitleKey/emptyDescriptionKey`, `onRowClick`, `onRetry`.
- **Toolbar**: search `Input` (i18n placeholder), optional `Select` filters, optional Add button.
- **Pagination**: `meta: { page, limit, total, totalPages }`, `onPageChange`, i18n labels.
- **Detail sheet**: `fields: { key, labelKey, render(record) }[]`.
- **Form dialog**: `fields`, Zod `schema`, `initialValues`, `isSubmitting`, `onSubmit`.
- **Delete dialog**: confirm + `onConfirm` (used for destructive/decline-style actions where a confirm step is warranted).

All text is passed as i18n keys; blocks never hard-code strings.

## Error & loading states

- Per-widget: `WidgetFrame` renders `LoadingState` (skeleton), `ErrorState` (with retry), or `EmptyState` (title `common.noData`) and otherwise the widget body.
- Per-list: `entity-table` renders loading → error → empty → table in order.
- Mutations: buttons show in-progress state; failures surface the backend message and leave the record unchanged.
