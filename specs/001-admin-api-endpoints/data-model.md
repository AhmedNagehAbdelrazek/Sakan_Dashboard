# Data Model: Admin API Endpoints Integration

**Feature**: specs/001-admin-api-endpoints/spec.md
**Phase**: 1 — Design & Contracts
**Date**: 2026-08-15

All entities below are sourced from the external backend contract (`Sakan Admin.postman_collection.json`) and the feature spec. The dashboard stores no persistent domain data; the backend is the single source of truth. Field names follow the backend's camelCase conventions.

## Entity Relationships

```text
User ──1:N── Property        (owner / userId)
User ──1:N── Activity        (actor / userId)
User ──1:N── FlatmateRequest (owner / userId)
User ──1:N── PropertyRequest (owner / userId)
User ──1:N── Application     (applicant / userId)
Property ──1:N── Application (target / propertyId)
Application ──1:1── Payment  (applicationId)
Payment ──N:1── User         (studentId, landlordId)
```

## Entities

### AdminSession
Represents an authenticated admin in the dashboard.

| Field | Type | Notes |
|-------|------|-------|
| user | User | identity returned at login |
| role | string | `super_admin`, `admin`, `manager` (also `student`, `landlord` exist platform-wide) |
| token | string | bearer token, stored server-side in httpOnly cookie + in-memory holder |

### User (account)
| Field | Type | Notes |
|-------|------|-------|
| id | string (uuid) | |
| username | string | |
| email | string | |
| phone | string | display only |
| countryCode | string | e.g. `+20` |
| role | enum | `student` \| `landlord` \| `admin` \| `super_admin` \| `manager` |
| verified | boolean | email-verified flag (mutable by admin) |
| active | boolean | account-active flag (mutable by admin) |
| createdAt / updatedAt | datetime | |

**Mutations**: update role, verified, active (all optional, PATCH).

### Activity
| Field | Type | Notes |
|-------|------|-------|
| id | number | |
| userId | string | actor |
| activityType | string | e.g. `login` |
| activityDetails | object | e.g. `{ ip }` |
| timestamp | datetime | |
| User | { username, email, role } | embedded actor summary |

Read-only. No mutations.

### Property
| Field | Type | Notes |
|-------|------|-------|
| id | string (uuid) | |
| title | string | |
| description | string | |
| images | string[] | URLs, rendered via image helper |
| pricePerMonth | string (decimal) | formatted as currency |
| totalRooms / availableRooms | number | |
| type | enum | e.g. `flat`, `studio`, `apartment` |
| address | string | |
| amenities | object | boolean map, e.g. `{ wifi, kitchen }` |
| userId | string | owner |
| isActive | boolean | |
| state | enum | `sent` \| `approved` \| `declined` |
| createdAt / updatedAt | datetime | |

**State transitions** (admin review workflow):
```text
sent ──approve──> approved
sent ──decline──> declined     (optional reason, ≤500 chars)
declined ──reopen──> sent
```

**Mutations**: approve, decline (optional `reason`), reopen.

### Application
| Field | Type | Notes |
|-------|------|-------|
| id | string (uuid) | |
| userId | string | applicant |
| propertyId | string | target property |
| status | enum | `pending` \| `approved` \| `rejected` \| `completed` |
| createdAt / updatedAt | datetime | |
| Property | { id, title, state } | embedded in detail |

**Approval metadata**: `approvedBy`, `approvedAt`, `approvalExpiresAt` (24h).
**Rejection metadata**: `reasonCategory` (required: `not_available` \| `not_interested` \| `payment_issue` \| `documents_missing` \| `other`), optional `detail`.
**Completion metadata**: `completedAt`.

**State transitions**:
```text
pending ──approve──> approved (records approver + 24h expiry)
pending ──reject──> rejected  (requires reasonCategory)
approved ──complete──> completed
```

### Payment
| Field | Type | Notes |
|-------|------|-------|
| id | string (uuid) | |
| applicationId | string | |
| studentId / landlordId | string | parties |
| status | enum | `pending` \| `received` \| `released` \| `refunded` |
| amount | number | |
| currency | string | e.g. `EGP` |
| method | string | e.g. `bank_transfer` |
| createdAt / updatedAt | datetime | |

**Lifecycle metadata**: `receivedAt`/`receivedBy`, `releasedAt`/`releasedBy`, `refundReason` (required), `refundedAt`.

**State transitions**:
```text
pending ──receive──> received
received ──release──> released
<any> ──refund──> refunded   (requires reason)
```

### FlatmateRequest
| Field | Type | Notes |
|-------|------|-------|
| id | string (uuid) | |
| userId | string | owner |
| preferredBudget | number | |
| preferredType | enum | property type |
| peopleWanted | number | |
| status | enum | e.g. `active` |
| joinInterests | array | |
| user | { id, username } | embedded in detail |

Read-only. No mutations.

### PropertyRequest
| Field | Type | Notes |
|-------|------|-------|
| id | string (uuid) | |
| userId | string | owner |
| message | string | free text |
| propertyType | enum | e.g. `flat` |
| requestType | enum | e.g. `looking` |
| address | string | |
| major | string | student's major |
| status | enum | `pending` \| `contacted` \| `resolved` \| `closed` |
| createdAt / updatedAt | datetime | |

**Valid transitions** (server-enforced):
```text
pending ──> contacted | closed
contacted ──> resolved | closed
```

**Mutations**: update status (required, must be a valid transition).

### Broadcast
| Field | Type | Notes |
|-------|------|-------|
| title | string | required |
| body | string | optional |
| type | string | optional free text, e.g. `promo` |

**Result**: `recipients` (number) — count of users reached.

## Validation rules (mapped from spec requirements)

- User update: role must be one of the five values; verified/active boolean.
- Property decline: reason optional, ≤500 chars.
- Application reject: reasonCategory required; detail optional.
- Payment refund: reason required.
- PropertyRequest status: must be a valid transition.
- Broadcast: title required.
- All mutation payloads validated with Zod in the owning feature's `schemas/`.

## Non-entities

- **Date ranges**: dashboard metrics do not accept a date range from the backend; the template's range filter applies only to sources that support it.
