# Backend API Contract: Sakan Admin

**Feature**: specs/001-admin-api-endpoints/spec.md
**Source**: `Sakan Admin.postman_collection.json`
**Date**: 2026-08-15

The authoritative external contract for the Sakan admin backend. All paths are relative to the base URL (the Postman `{{baseUrl}}` variable); requests use `Authorization: Bearer <token>` for everything except login.

## Auth

### POST /api/auth/login
No auth. Request: `{ email, password }`.
Response 200:
```json
{
  "user": { "id": "...", "username": "...", "email": "...", "phone": "...", "countryCode": "+20", "role": "super_admin", "verified": true },
  "role": "super_admin",
  "token": "<jwt>"
}
```

## Users

### GET /api/user
Lists accounts. May return a bare array or `{ items, page, limit, total }`.
```json
[{ "id": "...", "username": "...", "email": "...", "role": "admin" }]
```

### GET /api/user/:id
```json
{ "id": "...", "username": "...", "email": "...", "phone": "...", "role": "student", "verified": true, "active": true, "createdAt": "...", "updatedAt": "..." }
```

### PATCH /api/user/:id
Body (all optional): `role` (student|landlord|admin|super_admin|manager), `verified` (bool), `active` (bool). Returns the updated user.

## Activities

### GET /api/activities?page=1&limit=20
May return a bare array or an envelope. The acting user is embedded (lowercase `user`).
```json
[{ "id": 1, "activityType": "login", "activityDetails": { "ip": "..." }, "timestamp": "...", "createdAt": "...", "updatedAt": "...", "user": { "id": "...", "username": "...", "email": "...", "role": "student" } }]
```

### GET /api/activities/:id
Single activity record (same shape as a list row).

## Properties

### GET /api/properties?page=1&limit=20
The owner is embedded (lowercase `owner`).
```json
{ "items": [{ "id": "...", "title": "...", "description": "...", "images": ["..."], "pricePerMonth": "7500.00", "totalRooms": 1, "availableRooms": 1, "type": "flat", "address": "...", "amenities": { "wifi": true }, "owner": { "id": "...", "username": "...", "email": "...", "phone": "...", "role": "landlord", "verified": true, "active": true }, "isActive": true, "state": "sent", "createdAt": "...", "updatedAt": "..." }], "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
```

### GET /api/properties/:id
Single property (same shape as a list row).

### PATCH /api/properties/:id/approve
Response 200: `{ "message": "Property approved successfully", "property": { "id": "...", "state": "approved" } }`

### PATCH /api/properties/:id/decline
Body (optional): `{ "reason": "Insufficient photos and unclear address." }` (≤500 chars).
Response 200: `{ "message": "Property declined successfully", "property": { "id": "...", "state": "declined" } }`

### PATCH /api/properties/:id/reopen
Response 200: `{ "message": "Property reopened and sent for review successfully", "property": { "id": "...", "state": "sent" } }`

## Applications

### GET /api/applications?page=1&limit=20
The applicant and property are embedded (lowercase `user` and `property`).
```json
{ "items": [{ "id": "...", "status": "pending", "createdAt": "...", "updatedAt": "...", "user": { "id": "...", "username": "...", "email": "...", "role": "student" }, "property": { "id": "...", "title": "..." } }], "page": 1, "limit": 20, "total": 1 }
```

### GET /api/applications/:id
The embedded `property` also includes `state`.

### PATCH /api/applications/:id/approve
```json
{ "id": "...", "status": "approved", "approvedBy": "...", "approvedAt": "...", "approvalExpiresAt": "..." }
```

### PATCH /api/applications/:id/reject
Body: `reasonCategory` (required: not_available|not_interested|payment_issue|documents_missing|other), `detail` (optional).
```json
{ "id": "...", "status": "rejected", "message": "Not eligible" }
```

### PATCH /api/applications/:id/complete
```json
{ "id": "...", "status": "completed", "completedAt": "..." }
```

## Payments

### GET /api/payments?page=1&limit=20
The student, landlord, and application are embedded.
```json
{ "items": [{ "id": "...", "status": "pending", "amount": 7500, "currency": "EGP", "method": "bank_transfer", "createdAt": "...", "updatedAt": "...", "student": { "id": "...", "username": "...", "email": "...", "role": "student" }, "landlord": { "id": "...", "username": "...", "email": "...", "role": "landlord" }, "application": { "id": "..." } }], "page": 1, "limit": 20, "total": 1 }
```

> Note: action responses (`receive`/`release`/`refund`) still return plain IDs (`receivedBy`, `releasedBy`, `applicationId`, `studentId`, `landlordId`).

### PATCH /api/payments/:id/receive
```json
{ "id": "...", "status": "received", "receivedAt": "...", "receivedBy": "..." }
```

### PATCH /api/payments/:id/release
```json
{ "id": "...", "status": "released", "releasedAt": "...", "releasedBy": "..." }
```

### PATCH /api/payments/:id/refund
Body: `{ "reason": "Student withdrew from the tenancy." }` (required).
```json
{ "id": "...", "applicationId": "...", "studentId": "...", "landlordId": "...", "status": "refunded", "amount": 7500, "currency": "EGP", "refundReason": "...", "refundedAt": "..." }
```

## Flatmate Requests

### GET /api/flatmate-requests
The user is embedded (lowercase `user`).
```json
{ "items": [{ "id": "...", "preferredBudget": 5000, "preferredType": "flat", "peopleWanted": 2, "status": "active", "joinInterests": [], "user": { "id": "...", "username": "...", "email": "...", "role": "student" } }], "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
```

### GET /api/flatmate-requests/:id
Same shape as a list row (user embedded).

## Property Requests

### GET /api/property-requests?page=1&limit=20
The user is embedded (lowercase `user`).
```json
{ "items": [{ "id": "...", "message": "...", "propertyType": "flat", "requestType": "looking", "address": "...", "major": "Engineering", "status": "pending", "createdAt": "...", "updatedAt": "...", "user": { "id": "...", "username": "...", "email": "...", "role": "student" } }], "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
```

### GET /api/property-requests/:id
Single request (same shape as a list row).

### PATCH /api/property-requests/:id/status
Body: `{ "status": "contacted" }` (required). Valid transitions: `pending→contacted|closed`, `contacted→resolved|closed`. Returns the updated request (this response keeps the plain `userId` string).

## Dashboard

### GET /api/admin/dashboard?from=<ISO>&to=<ISO>&limit=<number>
`from`, `to`, and `limit` are optional query params that scope the data to a period.
```json
{
  "range": { "from": "2026-07-16T16:53:52.512Z", "to": "2026-08-15T16:53:52.512Z" },
  "metrics": {
    "users": { "newUsersCount": 16, "totalUsersCount": 16 },
    "properties": { "activeListingsCount": 3, "newListingsCount": 6 },
    "applications": { "byStatus": { "pending": 2, "approved": 1, "paid": 0, "checked_in": 1, "rejected": 1, "refunded": 0, "completed": 1 } },
    "payments": { "byStatus": { "pending": 1, "received": 1, "released": 1, "refunded": 0 } }
  },
  "needsAttention": {
    "applications": [],
    "payments": [],
    "propertyRequests": [],
    "properties": []
  },
  "trends": {
    "users": [{ "date": "2026-08-15", "count": 16 }],
    "applications": [{ "date": "2026-08-15", "count": 6 }],
    "payments": [{ "date": "2026-08-15", "count": 3 }]
  },
  "meta": { "limit": 20 }
}
```

The dashboard renders this as:
- `metrics.users.*` / `metrics.properties.*` → stat-card widgets.
- `metrics.applications.byStatus` / `metrics.payments.byStatus` → breakdown widgets.
- `trends.*` → chart widgets.
- `needsAttention` → the "Needs Attention" panel with links to the entity pages.

## Broadcast

### POST /api/admin/broadcast
Body: `title` (required), `body` (optional), `type` (optional).
```json
{ "message": "Broadcast sent successfully", "recipients": 1240 }
```

## Error conventions

- Errors return a non-2xx status with a `message` string (and, on some endpoints, structured error fields). The dashboard must surface the message verbatim and leave no partial state.
- Business-rule rejections (invalid transition, missing required field) come back as 4xx with a human-readable message.
