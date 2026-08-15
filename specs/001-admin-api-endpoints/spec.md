# Feature Specification: Admin API Endpoints Integration

**Feature Branch**: `001-admin-api-endpoints`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: "make a spec about updating this dashboard template with the endpoints of this postman collection, add the sections with all the showing and mutation needed @Sakan Admin.postman_collection.json"

## User Scenarios & Testing *(mandatory)*

The dashboard template is currently a self-contained shell with sample data and two placeholder screens. This feature connects it to the live Sakan admin backend described in the Postman collection and adds a screen for every managed data area, each with the read ("showing") and change ("mutation") capabilities that the backend exposes.

Stories are ordered by importance. Each is independently testable and valuable on its own.

### User Story 1 - Sign in against the live backend (Priority: P1)

An admin opens the dashboard, signs in with the credentials issued by the Sakan backend (email + password), and is taken to the dashboard. The session survives page reloads. Signing out returns them to the login page and locks the admin screens again.

**Why this priority**: Every other section requires an authenticated session. Without working sign-in nothing else is usable, and the login flow is the first thing any admin touches.

**Independent Test**: Can be fully tested by signing in with a valid backend account (lands on the dashboard), with a wrong password (clear error, no navigation), reloading the page (session kept), and signing out (returned to login, screens protected).

**Acceptance Scenarios**:

1. **Given** a valid admin account, **When** I submit correct credentials, **Then** I am signed in and land on the dashboard.
2. **Given** invalid credentials, **When** I submit them, **Then** I see a clear error and remain on the login page.
3. **Given** an authenticated session, **When** I reload the dashboard page, **Then** I stay signed in.
4. **Given** I am signed in, **When** I sign out, **Then** I am returned to the login page and admin screens are no longer accessible.

---

### User Story 2 - Dashboard metrics (Priority: P1)

After signing in, the admin sees the dashboard populated with live figures from the backend: total users (split into landlords and students), total properties (including how many are approved), total applications (including how many are pending), and payments received versus released, plus a feed of the most recent activity.

**Why this priority**: The dashboard is the landing screen and the first thing admins see. Live, correctly formatted figures are the immediate value of connecting the template to the real backend.

**Independent Test**: Can be fully tested by signing in and verifying that every metric value returned by the backend is displayed with a correct, human-readable label and formatting, and that recent activity is listed.

**Acceptance Scenarios**:

1. **Given** the backend returns the dashboard metrics, **When** the dashboard loads, **Then** each of the metric values (users, landlords, students, properties, approved properties, applications, pending applications, payments, received payments, released payments) is shown as a labeled card with the correct value and formatting.
2. **Given** the backend returns recent activity, **When** the dashboard loads, **Then** the most recent activities are listed.
3. **Given** the metrics service fails or is slow, **When** the dashboard loads, **Then** the affected cards show a clear error or empty state and can be retried without reloading the page.
4. **Given** metric values change on the backend, **When** the dashboard refreshes, **Then** the displayed values update to match.

---

### User Story 3 - Manage user accounts (Priority: P2)

The admin opens the Users screen, sees a paginated list of accounts (username, email, role), opens a user's full profile (phone, country code, verification, active status, created/updated dates), and updates a user's role, email-verification flag, and account-active flag.

**Why this priority**: Account management is a core admin responsibility; role and status corrections directly affect what users can do on the platform.

**Independent Test**: Can be fully tested by listing users, opening one user's details, changing their role/verification/active status, and confirming the change is persisted.

**Acceptance Scenarios**:

1. **Given** the backend returns users, **When** the admin opens the Users screen, **Then** each row shows username, email, and role.
2. **Given** more users than one page, **When** the admin moves between pages, **Then** the list shows the correct page and total counts.
3. **Given** a selected user, **When** the admin opens their details, **Then** the full profile and status flags are shown.
4. **Given** the admin edits role, verified, or active and saves, **When** the change is submitted, **Then** the backend applies it and the admin sees confirmation with the updated values.
5. **Given** the backend rejects the update, **When** the admin submits, **Then** the admin sees the reason and the screen stays consistent.

---

### User Story 4 - Review properties (Priority: P2)

The admin reviews property submissions: sees a paginated list of properties with their review state, filters by state (sent / approved / declined), opens a property's full details (description, images, monthly price, rooms, type, address, amenities, owner, active flag), and approves, declines (with an optional reason), or reopens a property for review.

**Why this priority**: Property moderation is the primary admin workflow on this platform; listing quality and trust depend on timely review.

**Independent Test**: Can be fully tested by listing properties, filtering by state, and performing each of the three review actions while confirming the resulting state.

**Acceptance Scenarios**:

1. **Given** the backend returns properties, **When** the admin opens the Properties screen, **Then** each row shows title, type, price, review state, and owner.
2. **Given** multiple review states exist, **When** the admin filters by state, **Then** only matching properties are shown.
3. **Given** a pending property, **When** the admin approves it, **Then** its state becomes approved and the UI confirms.
4. **Given** a pending property, **When** the admin declines it (optionally with a reason), **Then** its state becomes declined and the UI confirms.
5. **Given** a declined property, **When** the admin reopens it, **Then** its state returns to sent for review and the UI confirms.

---

### User Story 5 - Manage rental applications (Priority: P2)

The admin manages student rental applications: sees a paginated list with status, opens an application's details (applicant, property, status timeline), and approves, rejects, or completes it. Rejection requires choosing a reason category (not available, not interested, payment issue, documents missing, other) with an optional detail note. Approval surfaces the approval deadline.

**Why this priority**: Applications move the platform's core transaction forward; admins must be able to act on them quickly and consistently.

**Independent Test**: Can be fully tested by listing applications, opening one, and performing each of the three actions while confirming the resulting status and any recorded metadata (approver, approval deadline, reason).

**Acceptance Scenarios**:

1. **Given** the backend returns applications, **When** the admin opens the Applications screen, **Then** each row shows applicant, property, and status.
2. **Given** a pending application, **When** the admin approves it, **Then** its status becomes approved and the approval deadline is shown.
3. **Given** a pending application, **When** the admin rejects it, **Then** they must pick a reason category (optional detail), the status becomes rejected, and the UI confirms.
4. **Given** an approved application, **When** the admin completes it, **Then** its status becomes completed with a completion date.
5. **Given** a rejection without a required reason category, **When** the admin submits, **Then** the admin is prompted and no state change occurs.

---

### User Story 6 - Track payments (Priority: P3)

The admin tracks the payment lifecycle: sees a paginated list of payments (application, student, landlord, amount, currency, method, status), and advances a payment from pending to received to released, or refunds it. Refunds require a written reason.

**Why this priority**: Payment handling is important but lower volume and less frequent than the review workflows above.

**Independent Test**: Can be fully tested by listing payments and performing each lifecycle action (receive, release, refund) while confirming the new status and recorded actor/timestamp.

**Acceptance Scenarios**:

1. **Given** the backend returns payments, **When** the admin opens the Payments screen, **Then** each row shows the application, student, landlord, amount, currency, method, and status.
2. **Given** a pending payment, **When** the admin marks it received, **Then** its status becomes received with who and when.
3. **Given** a received payment, **When** the admin marks it released, **Then** its status becomes released with who and when.
4. **Given** a payment, **When** the admin refunds it, **Then** they must provide a reason, the status becomes refunded, and the UI confirms.

---

### User Story 7 - Activity log and housing requests (Priority: P3)

The admin monitors platform activity and student housing requests: the Activity Log shows user actions (user, activity type, timestamp, details) with a full record on demand; Flatmate Requests shows students seeking flatmates (budget, preferred property type, people wanted, status); Property Requests shows students searching for housing (message, property type, major, address, status) and lets the admin update a request's status using only valid transitions (pending -> contacted or closed; contacted -> resolved or closed).

**Why this priority**: These are monitoring and follow-up workflows, valuable but secondary to the transactional screens.

**Independent Test**: Can be fully tested by opening each of the three screens, inspecting records, and changing a property request's status along a valid transition.

**Acceptance Scenarios**:

1. **Given** activities exist, **When** the admin opens the Activity Log, **Then** each entry shows the user, activity type, timestamp, and details, and a full record can be opened.
2. **Given** flatmate requests exist, **When** the admin opens Flatmate Requests, **Then** each request shows budget, preferred type, people wanted, and status.
3. **Given** property requests exist, **When** the admin opens Property Requests, **Then** each request shows message, property type, major, address, and status.
4. **Given** a property request, **When** the admin changes its status, **Then** only valid transitions are offered, the chosen transition is applied, and the UI confirms.

---

### User Story 8 - Broadcast notifications (Priority: P3)

The admin composes a notification (required title, optional body and type) and sends it to all users, then sees confirmation of how many recipients it reached.

**Why this priority**: Broadcasting is useful for announcements but is an occasional, standalone action.

**Independent Test**: Can be fully tested by sending a broadcast with a title and confirming the returned recipient count, and by attempting to send without a title (blocked with a prompt).

**Acceptance Scenarios**:

1. **Given** the admin enters a title (and optionally body/type), **When** they send, **Then** the backend confirms the broadcast and the admin sees the number of recipients.
2. **Given** no title is entered, **When** the admin tries to send, **Then** they are prompted for it and nothing is sent.
3. **Given** the broadcast fails, **When** the admin sends, **Then** they see an error and can retry.

---

### Edge Cases

- **Backend unreachable or timed out**: each screen and dashboard card shows an error state with a retry action; no screen crashes and other screens keep working.
- **Empty datasets**: lists and widgets show a friendly empty state rather than an error.
- **Business-rule rejections**: mutations blocked by the backend (e.g., invalid status transition, missing required reason) surface the reason clearly and leave no partial change visible.
- **Expired session during use**: the admin is returned to the login screen and can sign in again; any in-flight action shows an error rather than a stale success.
- **Mixed list shapes**: some lists are delivered as a paginated envelope and others as a plain array; all lists display consistently regardless of shape.
- **Large result sets**: pagination lets the admin move through results without loading everything at once.
- **Concurrent edits by another admin** (e.g., a property already approved when I decline it): the screen reflects the latest state or shows a clear conflict message.
- **Missing or broken images** on a property: a placeholder is shown and the layout does not break.
- **Right-to-left / Arabic layout**: all new screens render correctly in both languages.

## Requirements *(mandatory)*

### Functional Requirements

**Authentication**

- **FR-001**: The system MUST sign admins in against the live backend using email and password credentials and MUST keep the session valid across page reloads.
- **FR-002**: The system MUST prevent unauthenticated access to all admin screens and redirect to the sign-in page.
- **FR-003**: The system MUST let an admin sign out, ending the session so admin screens become inaccessible again.
- **FR-004**: The system MUST show a clear, non-technical error when sign-in fails and MUST NOT navigate away from the login screen.

**Dashboard**

- **FR-005**: The dashboard MUST display all metric values returned by the backend dashboard service: total users, total landlords, total students, total properties, approved properties, total applications, pending applications, total payments, received payments, and released payments.
- **FR-006**: The dashboard MUST display the recent activity returned by the backend dashboard service.
- **FR-007**: Each dashboard metric MUST be shown with a human-readable label and formatted consistently (currency where applicable, numbers elsewhere).
- **FR-008**: Each dashboard card MUST handle its own loading, error, and empty states and support retrying independently of the others.

**Users**

- **FR-009**: The Users screen MUST list accounts showing username, email, and role, with pagination.
- **FR-010**: The Users screen MUST show a full account record on demand: phone, country code, role, verified flag, active flag, and created/updated dates.
- **FR-011**: The Users screen MUST let an admin update a user's role (student, landlord, admin, super_admin, manager), email-verification flag, and active flag, and MUST confirm the result with the updated values.

**Properties**

- **FR-012**: The Properties screen MUST list properties showing title, type, monthly price, review state, and owner, with pagination.
- **FR-013**: The Properties screen MUST support filtering the list by review state (sent / approved / declined).
- **FR-014**: The Properties screen MUST show a full property record on demand: description, images, monthly price, total and available rooms, type, address, amenities, owner, active flag, and created/updated dates.
- **FR-015**: The Properties screen MUST support approving a property, declining a property (with an optional written reason), and reopening a declined property for review, confirming the resulting state each time.

**Applications**

- **FR-016**: The Applications screen MUST list applications showing applicant, property, and status, with pagination.
- **FR-017**: The Applications screen MUST show a full application record on demand, including the related property and status history.
- **FR-018**: The Applications screen MUST support approving an application and MUST show the resulting approval deadline.
- **FR-019**: The Applications screen MUST support rejecting an application and MUST require a reason category (not available, not interested, payment issue, documents missing, other) with an optional detail note.
- **FR-020**: The Applications screen MUST support completing an application and MUST show the resulting completion date.

**Payments**

- **FR-021**: The Payments screen MUST list payments showing application, student, landlord, amount, currency, method, and status, with pagination.
- **FR-022**: The Payments screen MUST support marking a payment as received and MUST record who and when.
- **FR-023**: The Payments screen MUST support marking a payment as released and MUST record who and when.
- **FR-024**: The Payments screen MUST support refunding a payment and MUST require a written reason.

**Activities**

- **FR-025**: The Activity Log screen MUST list activity entries showing the user, activity type, timestamp, and details.
- **FR-026**: The Activity Log screen MUST show a full activity record on demand.

**Flatmate Requests**

- **FR-027**: The Flatmate Requests screen MUST list requests showing preferred budget, preferred property type, people wanted, and status.
- **FR-028**: The Flatmate Requests screen MUST show a full request record on demand, including the requesting user.

**Property Requests**

- **FR-029**: The Property Requests screen MUST list requests showing message, property type, request type, major, address, and status, with pagination.
- **FR-030**: The Property Requests screen MUST show a full request record on demand.
- **FR-031**: The Property Requests screen MUST support updating a request's status using ONLY valid transitions (pending -> contacted or closed; contacted -> resolved or closed) and MUST confirm the change.

**Broadcast**

- **FR-032**: The Broadcast screen MUST let an admin compose a notification with a required title and optional body and type.
- **FR-033**: The Broadcast screen MUST submit the notification to the backend, which sends it to all users, and MUST display the returned recipient count.

**Cross-cutting**

- **FR-034**: Every list and detail view MUST show loading, error (with retry), and empty states.
- **FR-035**: Every mutation MUST show an in-progress state and a confirmation or error result, and MUST NOT leave partial or stale changes visible when it fails.
- **FR-036**: All new on-screen text MUST be available in both supported languages (English and Arabic), with correct left-to-right and right-to-left rendering.
- **FR-037**: Admin screens MUST always reflect live backend data; bundled sample data MAY remain available for offline development but MUST NOT appear on live admin screens.
- **FR-038**: A failure in one screen MUST NOT prevent other screens from loading.

### Key Entities *(include if feature involves data)*

- **Admin Session**: The authenticated admin identity obtained at sign-in, including the role (e.g., super_admin, admin, manager) and a token that authorizes backend calls.
- **User**: An account on the platform with username, email, phone, country code, role (student, landlord, admin, super_admin, manager), verified and active flags, and timestamps.
- **Activity**: A logged platform event with the acting user, activity type, details, and timestamp.
- **Property**: A listing with title, description, images, monthly price, total and available rooms, type, address, amenities, owner, active flag, and review state (sent / approved / declined).
- **Application**: A student's rental application linking a user to a property, with status (pending / approved / rejected / completed) and recorded approval/expiry metadata.
- **Payment**: A money movement tied to an application with student and landlord parties, amount, currency, method, and status (pending / received / released / refunded) plus refund reason when refunded.
- **FlatmateRequest**: A student seeking flatmates with preferred budget, preferred property type, number of people wanted, status, and join interests.
- **PropertyRequest**: A student searching for housing with a message, property type, request type, major, address, and status (pending / contacted / resolved / closed).
- **Broadcast**: A notification with title, body, and type, sent to all users; the result is a recipient count.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can sign in with valid backend credentials and reach the dashboard in under 5 seconds.
- **SC-002**: 100% of the metric values returned by the backend dashboard service are visible on the dashboard with correct labels and formatting.
- **SC-003**: 100% of the read and mutation capabilities documented in the backend contract are reachable from a corresponding admin screen.
- **SC-004**: An admin can complete any single mutation workflow (approve, decline, reject, receive, release, refund, status change, broadcast) in under 1 minute.
- **SC-005**: Under normal backend performance, list screens display their data within 2 seconds (p95); otherwise a clear loading, error, or empty state is shown.
- **SC-006**: 100% of new on-screen text is available in English and Arabic and renders correctly in both layouts.
- **SC-007**: 95% of admin task flows (view -> act -> confirm) complete without an error message.

## Assumptions

- The backend base address is supplied through the existing environment configuration (the same setting the template already uses) and points to the Sakan backend described by the Postman collection.
- The backend follows the documented contract: sign-in returns the user, role, and a token; list endpoints return either a paginated envelope (items, page, limit, total) or a plain array; mutations return the updated record and/or a confirmation message.
- Any authenticated admin role (super_admin, admin, manager) may use every screen; no additional role-based restrictions are introduced by this feature.
- Broadcasting always targets all users; there is no recipient selection.
- Dashboard date-range controls apply only where the backend supports them; metrics without a date range are displayed as-is.
- The template's existing structure for screens and widgets is retained; this specification describes behaviour and outcomes, not how the screens are built.
- Property images are handled with the template's existing image handling; interactive maps are out of scope.
- A bundled sample dataset may remain for offline or demo use but must never appear on live admin screens.
