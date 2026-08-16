# ERP School Backend

Production-oriented multi-tenant REST API for the School ERP.

## Stack

- Node.js 20+
- Express
- MongoDB + Mongoose
- JWT access/refresh authentication
- bcrypt password hashing
- RBAC permissions and `schoolId` tenant isolation
- Helmet, CORS, request rate limiting and audit logs

## Run locally

```bash
cd backend
cp .env.example .env
npm install
npm run seed:superadmin
npm run dev
```

API base: `http://localhost:5000/api/v1`  
Health: `GET /health`

## Core routes

- `/auth` – login, refresh, logout, current user, change password
- `/schools`, `/administrators`, `/users`
- `/academics/sessions`, `/academics/classes`, `/academics/sections`, `/academics/subjects`
- `/students`, `/parents`, `/teachers`
- `/attendance` (`POST /bulk` supported)
- `/timetable`, `/assignments`, `/examinations`, `/results`
- `/fees` and `/fees/payments`
- `/notices`, `/leaves`, `/notifications`
- `/reports/dashboard`, `/audit`

## Tenant isolation

School-scoped requests resolve the school from the authenticated account. Administrators may send `x-school-id` only for schools assigned to them. Super Admin may use `x-school-id` when working inside a school context. Resource-level scopes further limit students, parents and teachers to their own/linked/assigned records.

## Authentication

Send access tokens as:

```text
Authorization: Bearer <accessToken>
```

Refresh tokens are rotated whenever `/auth/refresh` succeeds.

## Important production setup

Set strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`, restrict `CORS_ORIGINS`, use a managed MongoDB deployment with backups, keep `.env` out of Git, and run the API behind HTTPS/reverse proxy.
