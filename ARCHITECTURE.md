# ERP School Architecture

This repository is structured as a multi-school School ERP with six roles:

- Super Admin
- Administrator
- School Admin
- Teacher
- Student
- Parent

## Applications

- `Superadmin/` — independent platform-control Next.js application.
- `Frontend/frontend/` — shared role-based school portal for Administrator, School Admin, Teacher, Student and Parent.
- `backend/` — centralized multi-tenant API and business layer.

## Core rules

1. Every school-owned record must be scoped by `schoolId`.
2. Authorization must be enforced on the backend with RBAC; frontend route guards are only a UX layer.
3. Super Admin is platform-scoped, Administrator can be assigned multiple schools, School Admin is school-scoped, and Teacher/Student/Parent access is restricted to assigned/linked resources.
4. Feature modules should stay isolated so they can be enabled or expanded independently.
5. Shared UI, types, hooks and API clients should be reused instead of duplicating role applications.

## Portal route groups

`Frontend/frontend/app/(portal)/`

- `administrator/`
- `school-admin/`
- `teacher/`
- `student/`
- `parent/`

## Backend domains

`backend/src/modules/`

- schools
- administrators
- academics
- students
- parents
- teachers
- attendance
- timetable
- assignments
- examinations
- results
- fees
- notices
- leaves
- reports
- notifications
- audit

This commit establishes folders only. Business logic will be implemented module-by-module.
