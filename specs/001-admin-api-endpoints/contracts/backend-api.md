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
May return a bare array or an envelope.
```json
[{ "id": 1, "userId": "...", "activityType": "login", "activityDetails": { "ip": "..." }, "timestamp": "...", "createdAt": "...", "updatedAt": "...", "User": { "username": "...", "email": "...", "role": "student" } }]
```

### GET /api/activities/:id
Single activity record (same shape as a list row).

## Properties

### GET /api/properties?page=1&limit=20
```json
{ "items": [{ "id": "...", "title": "...", "description": "...", "images": ["..."], "pricePerMonth": "7500.00", "totalRooms": 1, "availableRooms": 1, "type": "flat", "address": "...", "amenities": { "wifi": true }, "userId": "...", "isActive": true, "state": "sent", "createdAt": "...", "updatedAt": "..." }], "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
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
```json
{ "items": [{ "id": "...", "userId": "...", "propertyId": "...", "status": "pending", "createdAt": "...", "updatedAt": "..." }], "page": 1, "limit": 20, "total": 1 }
```

### GET /api/applications/:id
Adds embedded property: `"Property": { "id": "...", "title": "...", "state": "approved" }`.

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
```json
{ "items": [{ "id": "...", "applicationId": "...", "studentId": "...", "landlordId": "...", "status": "pending", "amount": 7500, "currency": "EGP", "method": "bank_transfer", "createdAt": "...", "updatedAt": "..." }], "page": 1, "limit": 20, "total": 1 }
```

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
```json
{ "items": [{ "id": "...", "userId": "...", "preferredBudget": 5000, "preferredType": "flat", "peopleWanted": 2, "status": "active", "joinInterests": [] }], "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
```

### GET /api/flatmate-requests/:id
Adds embedded `user: { id, username }`.

## Property Requests

### GET /api/property-requests?page=1&limit=20
```json
{ "items": [{ "id": "...", "userId": "...", "message": "...", "propertyType": "flat", "requestType": "looking", "address": "...", "major": "Engineering", "status": "pending", "createdAt": "...", "updatedAt": "..." }], "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
```

### GET /api/property-requests/:id
Single request (same shape as a list row).

### PATCH /api/property-requests/:id/status
Body: `{ "status": "contacted" }` (required). Valid transitions: `pending→contacted|closed`, `contacted→resolved|closed`. Returns the updated request.

## Dashboard

### GET /api/admin/dashboard
```json
{
  "totalUsers": 1240, "totalLandlords": 180, "totalStudents": 1040,
  "totalProperties": 320, "approvedProperties": 260,
  "totalApplications": 510, "pendingApplications": 34,
  "totalPayments": 190, "receivedPayments": 150, "releasedPayments": 120,
  "recentActivities": []
}
```

## Broadcast

### POST /api/admin/broadcast
Body: `title` (required), `body` (optional), `type` (optional).
```json
{ "message": "Broadcast sent successfully", "recipients": 1240 }
```

## Error conventions

- Errors return a non-2xx status with a `message` string (and, on some endpoints, structured error fields). The dashboard must surface the message verbatim and leave no partial state.
- Business-rule rejections (invalid transition, missing required field) come back as 4xx with a human-readable message.
