# Tasks: Admin API Endpoints Integration

**Input**: Design documents from `/specs/001-admin-api-endpoints/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ (backend-api.md, data-source.md), quickstart.md

**Tests**: The feature spec does not explicitly request tests, so no dedicated TDD tasks are generated. Regression/verification tasks that keep the existing Vitest suites green and cover the new pure logic (list normaliser) are included in Phase 11.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single web app: `src/` at repository root; feature modules under `src/features/<name>/`; local API proxy routes under `src/app/api/<resource>/`; admin pages under `src/app/admin/<section>/page.tsx`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project-level scaffolding that all user stories depend on (i18n keys, navigation config, shared server proxy helper, environment documentation)

- [X] T001 [P] Add i18n keys for all new admin sections (nav labels + page titles: Users, Properties, Applications, Payments, Activities, Flatmate Requests, Property Requests, Broadcast) to `src/lib/i18n/translations-sample.ts`, `messages/en.json`, and `messages/ar.json`
- [X] T002 Update `src/config/app.config.ts` `navigation` to add section entries (with `href`, `icon`, `labelKey`) for all eight new admin screens (depends on T001 keys existing)
- [X] T003 [P] Create shared server-side proxy helper `src/lib/api/proxy.ts` exporting `proxyGet/proxyPatch/proxyPost(req, path, body?)` that forwards to the external backend via the `Request` class using the Bearer token from the `auth_token` cookie via `getAuthHeaders` (`src/lib/api/withAuth.ts`) and returns the local `{ status, data }` envelope
- [X] T004 [P] Update `.env.example` and the README "Quick Start" env section to document that `NEXT_PUBLIC_API_URL` must point to the backend host root so the documented `/api/*` paths resolve (e.g. `http://localhost:8000`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Extend the admin user model to match the backend login shape (`username`, `phone`, `countryCode`, `verified`, `role`): update `src/features/auth/types/auth.types.ts` and the `AdminUser` interface + `login` action in `src/lib/stores/admin.store.ts`
- [X] T006 [P] Create list normaliser `src/lib/api/normalize.ts` (bare array or `{ items, page, limit, total, totalPages? }` → canonical `{ items, page, limit, total, totalPages }`) and align `src/components/management/entity-pagination.tsx` `EntityListMeta` to use camelCase `totalPages`
- [X] T007 [P] Add `DashboardMetrics` type and Zod schema (10 numeric metrics + `recentActivities`) to `src/features/dashboard/types/dashboard.types.ts` and `src/features/dashboard/schemas/dashboard.schema.ts`
- [X] T008 [P] Create local proxy route `src/app/api/admin/dashboard/route.ts` forwarding `GET /api/admin/dashboard` via the proxy helper and returning `{ status: "success", data: <metrics> }`
- [X] T009 [P] Add `getDashboardMetrics` to `src/features/dashboard/services/dashboardService.ts` and `useDashboardMetrics` to `src/features/dashboard/hooks/use-dashboard-metrics.ts` (React Query, key `["admin", "dashboard"]`)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sign in against the live backend (Priority: P1) 🎯 MVP

**Goal**: Admin signs in with backend credentials (email + password); session persists across reloads; sign-out ends it.

**Independent Test**: Sign in with a valid backend account → land on `/admin`; wrong password → clear error, no navigation; reload → session kept; sign out → back to `/login`, screens protected.

### Implementation for User Story 1

- [X] T010 [US1] Update `src/app/api/auth/admin/login/route.ts` to call backend `POST /api/auth/login` and parse `{ user, role, token }`, set the httpOnly `auth_token` cookie, and return `{ user, token }` to the client
- [X] T011 [US1] Update `src/features/auth/services/adminAuthService.ts` to consume `{ user, token }`, store the token in `tokenHolder`, and un-comment the logout `fetch("/api/auth/admin/logout")` call
- [X] T012 [US1] Update `src/features/auth/components/AdminLoginForm.tsx` to map the returned user + role into the admin store and keep the existing 401/generic error handling
- [X] T013 [US1] Verify session persistence: confirm `src/middleware.ts` + `src/lib/auth/middleware.ts` use the `auth_token` cookie (update `src/lib/auth/constants.ts` if the cookie name diverges)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Dashboard metrics (Priority: P1)

**Goal**: Dashboard shows the 10 live backend metrics as labeled cards plus a recent-activity list, each with independent loading/error/empty states.

**Independent Test**: Sign in and confirm every metric value from `GET /api/admin/dashboard` renders with the correct label/format and that recent activity is listed; stop the backend → cards show retryable error states.

### Implementation for User Story 2

- [X] T014 [US2] Update `src/config/app.config.ts` `dashboard.widgets` to source the 10 numeric metrics from `/api/admin/dashboard` (stat-card, `field` + `format: "number"`) and `recentActivities` as a ranked-list widget (replacing the sample `total-value`/`trend`/`top-list` sources)
- [X] T015 [US2] Update `src/features/dashboard/components/dashboard-page.tsx` to use `useDashboardMetrics` (via `useWidgetData`/direct query) so each widget renders through `WidgetFrame` with its own loading/error/empty/retry states

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Manage user accounts (Priority: P2)

**Goal**: Users screen lists accounts (username, email, role) with pagination, shows full details, and updates role/verified/active.

**Independent Test**: List users → open a user's details → change role/verified/active → confirm the change persists after reload; rejected updates show the backend message.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Create `src/features/users/types/user.types.ts` (`User`, `UpdateUserInput`)
- [ ] T017 [P] [US3] Create update schema `src/features/users/schemas/user.schema.ts` (optional `role` enum: student|landlord|admin|super_admin|manager, `verified` boolean, `active` boolean)
- [ ] T018 [P] [US3] Create local proxy routes `src/app/api/user/route.ts` (GET list) and `src/app/api/user/[id]/route.ts` (GET detail + PATCH update) using the proxy helper and normaliser
- [ ] T019 [P] [US3] Create `src/features/users/services/userService.ts` (`listUsers`, `getUser`, `updateUser`)
- [ ] T020 [P] [US3] Create `src/features/users/hooks/use-users.ts` (list query, update mutation, invalidate on success)
- [ ] T021 [US3] Create `src/features/users/components/users-page.tsx` composing the management blocks (table with username/email/role columns, search toolbar, pagination, detail sheet, edit dialog)
- [ ] T022 [US3] Create `src/app/admin/users/page.tsx`
- [ ] T023 [US3] Add users screen i18n keys (columns, form labels, role options, error/empty text) to `src/lib/i18n/translations-sample.ts`, `messages/en.json`, `messages/ar.json`

**Checkpoint**: At this point, User Stories 1-3 should work independently

---

## Phase 6: User Story 4 - Review properties (Priority: P2)

**Goal**: Properties screen lists properties with state filter, shows full details, and supports approve / decline (optional reason) / reopen.

**Independent Test**: List properties → filter by state → open detail → approve a pending property; decline another with a reason; reopen a declined one; confirm each resulting state.

### Implementation for User Story 4

- [ ] T024 [P] [US4] Create `src/features/properties/types/property.types.ts` (`Property`, `PropertyActionResult`)
- [ ] T025 [P] [US4] Create decline schema `src/features/properties/schemas/property.schema.ts` (optional `reason` string, max 500 chars)
- [ ] T026 [P] [US4] Create local proxy routes `src/app/api/properties/route.ts` (GET list) and `src/app/api/properties/[id]/route.ts` (GET detail) plus action routes `src/app/api/properties/[id]/approve/route.ts`, `[id]/decline/route.ts`, `[id]/reopen/route.ts` (PATCH)
- [ ] T027 [P] [US4] Create `src/features/properties/services/propertyService.ts` (`listProperties`, `getProperty`, `approveProperty`, `declineProperty`, `reopenProperty`)
- [ ] T028 [P] [US4] Create `src/features/properties/hooks/use-properties.ts` (list query + state-filter param, three action mutations with invalidation)
- [ ] T029 [US4] Create `src/features/properties/components/properties-page.tsx` (table with title/type/price/state/owner, state filter select, detail sheet, approve/decline/reopen actions with confirm states)
- [ ] T030 [US4] Create `src/app/admin/properties/page.tsx`
- [ ] T031 [US4] Add properties i18n keys (state labels sent/approved/declined, approve/decline/reopen actions, decline reason field) to `src/lib/i18n/translations-sample.ts`, `messages/en.json`, `messages/ar.json`

**Checkpoint**: At this point, User Stories 1-4 should work independently

---

## Phase 7: User Story 5 - Manage rental applications (Priority: P2)

**Goal**: Applications screen lists applications, shows details (incl. property + approval deadline), and approves / rejects (required reason category + optional detail) / completes.

**Independent Test**: List applications → open a detail → approve (deadline shown); reject another requiring a reason category; complete an approved one; verify statuses.

### Implementation for User Story 5

- [ ] T032 [P] [US5] Create `src/features/applications/types/application.types.ts` (`Application`, `ApplicationDetail`, `RejectApplicationInput`)
- [ ] T033 [P] [US5] Create reject schema `src/features/applications/schemas/application.schema.ts` (`reasonCategory` required enum: not_available|not_interested|payment_issue|documents_missing|other; optional `detail`)
- [ ] T034 [P] [US5] Create local proxy routes `src/app/api/applications/route.ts` (GET list) and `src/app/api/applications/[id]/route.ts` (GET detail) plus `[id]/approve/route.ts`, `[id]/reject/route.ts`, `[id]/complete/route.ts` (PATCH)
- [ ] T035 [P] [US5] Create `src/features/applications/services/applicationService.ts` (`listApplications`, `getApplication`, `approveApplication`, `rejectApplication`, `completeApplication`)
- [ ] T036 [P] [US5] Create `src/features/applications/hooks/use-applications.ts` (list query, three action mutations with invalidation)
- [ ] T037 [US5] Create `src/features/applications/components/applications-page.tsx` (table with applicant/property/status, detail sheet incl. property + approval expiry, approve/reject (reason-category dialog)/complete actions)
- [ ] T038 [US5] Create `src/app/admin/applications/page.tsx`
- [ ] T039 [US5] Add applications i18n keys (statuses, reason categories, approval deadline label, reject dialog) to `src/lib/i18n/translations-sample.ts`, `messages/en.json`, `messages/ar.json`

**Checkpoint**: At this point, User Stories 1-5 should work independently

---

## Phase 8: User Story 6 - Track payments (Priority: P3)

**Goal**: Payments screen lists payments and advances them pending → received → released, or refunds with a required reason.

**Independent Test**: List payments → receive a pending one; release a received one; refund another (must supply a reason); verify who/when metadata and statuses.

### Implementation for User Story 6

- [ ] T040 [P] [US6] Create `src/features/payments/types/payment.types.ts` (`Payment`, `RefundPaymentInput`)
- [ ] T041 [P] [US6] Create refund schema `src/features/payments/schemas/payment.schema.ts` (required `reason` string)
- [ ] T042 [P] [US6] Create local proxy routes `src/app/api/payments/route.ts` (GET list) plus `src/app/api/payments/[id]/receive/route.ts`, `[id]/release/route.ts`, `[id]/refund/route.ts` (PATCH)
- [ ] T043 [P] [US6] Create `src/features/payments/services/paymentService.ts` (`listPayments`, `receivePayment`, `releasePayment`, `refundPayment`)
- [ ] T044 [P] [US6] Create `src/features/payments/hooks/use-payments.ts` (list query, three action mutations with invalidation)
- [ ] T045 [US6] Create `src/features/payments/components/payments-page.tsx` (table with application/amount/currency/method/status, detail sheet, receive/release/refund (reason dialog) actions)
- [ ] T046 [US6] Create `src/app/admin/payments/page.tsx`
- [ ] T047 [US6] Add payments i18n keys (statuses, receive/release/refund actions, refund reason field) to `src/lib/i18n/translations-sample.ts`, `messages/en.json`, `messages/ar.json`

**Checkpoint**: At this point, User Stories 1-6 should work independently

---

## Phase 9: User Story 7 - Activity log and housing requests (Priority: P3)

**Goal**: Activity Log, Flatmate Requests, and Property Requests screens; property-request status updates restricted to valid transitions.

**Independent Test**: Open each of the three screens and inspect records; change a property request's status along a valid transition (`pending→contacted`, `contacted→resolved`) and confirm it applies.

### Implementation for User Story 7

- [ ] T048 [P] [US7] Create `src/features/activities/types/activity.types.ts` + local proxy routes `src/app/api/activities/route.ts` (GET list) and `src/app/api/activities/[id]/route.ts` (GET detail) + `src/features/activities/services/activityService.ts` + `src/features/activities/hooks/use-activities.ts`
- [ ] T049 [P] [US7] Create `src/features/flatmate-requests/types/` + local proxy routes `src/app/api/flatmate-requests/route.ts` (GET list) and `[id]/route.ts` (GET detail) + `src/features/flatmate-requests/services/flatmateRequestService.ts` + `src/features/flatmate-requests/hooks/use-flatmate-requests.ts`
- [ ] T050 [P] [US7] Create `src/features/property-requests/types/` + status schema `src/features/property-requests/schemas/propertyRequest.schema.ts` (required `status`; UI offers only pending→contacted|closed, contacted→resolved|closed) + local proxy routes `src/app/api/property-requests/route.ts` (GET list), `[id]/route.ts` (GET detail), `[id]/status/route.ts` (PATCH) + service + `src/features/property-requests/hooks/use-property-requests.ts`
- [ ] T051 [US7] Create `src/features/activities/components/activities-page.tsx` (table with user/type/timestamp/details, detail sheet) + `src/app/admin/activities/page.tsx`
- [ ] T052 [US7] Create `src/features/flatmate-requests/components/flatmate-requests-page.tsx` (table with budget/preferred type/people wanted/status, detail sheet) + `src/app/admin/flatmate-requests/page.tsx`
- [ ] T053 [US7] Create `src/features/property-requests/components/property-requests-page.tsx` (table with message/type/major/address/status, detail sheet, status-update select restricted to valid transitions) + `src/app/admin/property-requests/page.tsx`
- [ ] T054 [US7] Add monitoring i18n keys (activity types, request types, statuses, majors, columns) to `src/lib/i18n/translations-sample.ts`, `messages/en.json`, `messages/ar.json`

**Checkpoint**: At this point, User Stories 1-7 should work independently

---

## Phase 10: User Story 8 - Broadcast notifications (Priority: P3)

**Goal**: Broadcast screen composes a notification (required title, optional body/type) and shows the recipient count returned by the backend.

**Independent Test**: Send a broadcast with a title → recipient count shown; attempt to send without a title → blocked with a prompt; backend failure → error with retry.

### Implementation for User Story 8

- [ ] T055 [P] [US8] Create `src/features/broadcast/types/broadcast.types.ts` (`BroadcastInput`, `BroadcastResult`) + `src/features/broadcast/schemas/broadcast.schema.ts` (required `title`, optional `body`, optional `type`)
- [ ] T056 [P] [US8] Create local proxy route `src/app/api/admin/broadcast/route.ts` (POST) forwarding `POST /api/admin/broadcast` and returning the `{ message, recipients }` payload
- [ ] T057 [P] [US8] Create `src/features/broadcast/services/broadcastService.ts` (`sendBroadcast`) + `src/features/broadcast/hooks/use-broadcast.ts` (mutation with invalidation/toast)
- [ ] T058 [US8] Create `src/features/broadcast/components/broadcast-page.tsx` (title/body/type form via react-hook-form + Zod, submission state, recipient-count result, error retry)
- [ ] T059 [US8] Create `src/app/admin/broadcast/page.tsx`
- [ ] T060 [US8] Add broadcast i18n keys (form labels, placeholders, recipients message, send action) to `src/lib/i18n/translations-sample.ts`, `messages/en.json`, `messages/ar.json`

**Checkpoint**: At this point, all user stories should be independently functional

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T061 [P] Verify every new screen and dashboard widget respects loading/error/empty/retry states (via `WidgetFrame` + management blocks) and that a failure in one section never blocks another
- [ ] T062 Update config-schema and i18n expectations touched by the navigation/dashboard changes so `pnpm test:run` passes, and add unit tests for the list normaliser in `src/lib/api/normalize.test.ts`
- [ ] T063 [P] Run `pnpm lint`, `pnpm format:check`, `pnpm test:run`, and `pnpm build`; fix all reported issues
- [ ] T064 [P] Run the quickstart.md validation walkthrough end-to-end (login → dashboard → every section → every mutation) against the live backend
- [ ] T065 [P] Update `README.md` (project structure, env docs, section list) and `specs/001-admin-api-endpoints/quickstart.md` with any corrections discovered during validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories proceed in priority order (P1 → P2 → P3) in this feature
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - independent of US1
- **User Story 3 (P2)**: Can start after Foundational - independent of US1/US2
- **User Story 4 (P2)**: Can start after Foundational - independent of US3
- **User Story 5 (P2)**: Can start after Foundational - independent of US4
- **User Story 6 (P3)**: Can start after Foundational - independent of US5
- **User Story 7 (P3)**: Can start after Foundational - independent of US6
- **User Story 8 (P3)**: Can start after Foundational - independent of US7

### Within Each User Story

- Types and schemas before services
- Services before routes/hooks (or in parallel where marked [P])
- Page component composes the blocks, then the admin route page, then i18n keys
- Story complete (and checkpoint run) before moving to the next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004 after T001 keys; T002 needs T001)
- All Foundational tasks marked [P] can run in parallel (T005-T009)
- The 8 user stories are mutually independent once Foundational is done (only sequential here for incremental delivery)
- Within a story: types / schemas / routes / services / hooks marked [P] can run in parallel; the page component (needs types+services+hooks) runs after

---

## Parallel Example: User Story 3

```bash
# Launch all independent building blocks for User Story 3 together:
Task: "Create src/features/users/types/user.types.ts"
Task: "Create src/features/users/schemas/user.schema.ts"
Task: "Create src/app/api/user/route.ts + src/app/api/user/[id]/route.ts"
Task: "Create src/features/users/services/userService.ts"
Task: "Create src/features/users/hooks/use-users.ts"

# Then compose (depends on the above):
Task: "Create src/features/users/components/users-page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (sign in against the live backend)
4. **STOP and VALIDATE**: Sign in with real credentials, reload, sign out
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP!
3. Add User Story 2 (live dashboard) → Test independently
4. Add User Stories 3-5 (P2: Users, Properties, Applications) → Test each independently
5. Add User Stories 6-8 (P3: Payments, Monitoring, Broadcast) → Test each independently
6. Phase 11 Polish: quality gates (`lint`/`format:check`/`test:run`/`build`), validation walkthrough, docs

### Parallel Team Strategy

With multiple developers (after Setup + Foundational):

1. Developer A: User Story 1 → 2 (auth + dashboard)
2. Developer B: User Story 3 (Users) and 4 (Properties)
3. Developer C: User Story 5 (Applications) and 6 (Payments)
4. Developer D: User Story 7 (Monitoring) and 8 (Broadcast)
5. Stories integrate independently; Phase 11 polish by the whole team

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No dedicated test tasks (not requested in spec); existing suites must stay green (Phase 11)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
