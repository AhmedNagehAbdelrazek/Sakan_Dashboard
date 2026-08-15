# Quickstart: Admin API Endpoints Integration

**Feature**: specs/001-admin-api-endpoints/spec.md

## Prerequisites

- Node.js + pnpm installed
- The Sakan admin backend running and reachable (see `.env.example`)

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the backend **host root** so the documented `/api/*` paths resolve, e.g.:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If your backend is mounted at a different prefix, adjust so that `<NEXT_PUBLIC_API_URL>/api/auth/login` is the login URL.

## Run

```bash
pnpm dev
```

Open `http://localhost:3000`. You will be redirected to `/login`.

## Validation walkthrough

1. **Sign in** — use a valid Sakan admin account (e.g. the super-admin credentials from the Postman collection). Wrong credentials show an error; correct credentials land on `/admin`; reloading keeps the session.
2. **Dashboard** — confirm all 10 metric cards (users, landlords, students, properties, approved properties, applications, pending applications, payments, received payments, released payments) plus recent activity render with live values.
3. **Users** — list accounts, open a detail, change role / verified / active, confirm the updated values persist after reload.
4. **Properties** — list, filter by state (sent / approved / declined), open a detail, then approve, decline (optionally with a reason), and reopen; verify the state changes and the message confirms.
5. **Applications** — list, open a detail (shows property), approve (shows approval deadline), reject (must pick a reason category), complete; verify status changes.
6. **Payments** — list, then receive → release, and refund a payment (must provide a reason); verify who/when metadata appears.
7. **Activities** — verify the log lists user, type, timestamp, details, and a full record opens.
8. **Flatmate Requests** — verify budget, preferred type, people wanted, and status are shown.
9. **Property Requests** — list, open detail, change status using only valid transitions (`pending→contacted|closed`, `contacted→resolved|closed`).
10. **Broadcast** — compose title (+ optional body/type) and send; verify the recipient count is shown; sending without a title is blocked.

## Validation commands

```bash
pnpm test:run     # config schema, i18n, proxy normalizer unit tests
pnpm lint         # ESLint
pnpm format:check # Prettier
pnpm build        # type-check + production build
```

## Sign out

Use the top bar logout; the session cookie is cleared and `/admin` becomes protected again.
