# Backend

Central multi-tenant API for ERP School.

The backend is organized by domain modules under `src/modules`. Every school-owned query must be scoped by `schoolId`, and all protected endpoints must enforce role/permission checks server-side.
