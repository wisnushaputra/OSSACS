# 01 - Authentication

**Phase:** Core Security

**Status:** COMPLETED
**Priority:** Critical

**Dependencies:**

- ✅ 00-project-setup.md

---

# Objective

Membangun sistem autentikasi dan otorisasi yang aman sebagai fondasi seluruh aplikasi BCMS.

Seluruh endpoint setelah fase ini harus menggunakan JWT Authentication dan Role Based Access Control (RBAC).

---

# Scope

Modul yang dikerjakan:

- Identity Management (User, Role, Permission)
- Authentication Core (Login, Logout, Refresh)
- Authorization Core (JWT, RBAC/PBAC)
- Session Management
- Audit Login

---

# Epic 1 — Database Foundation (Schema Verification)

// Catatan: Semua tabel ini sudah dibuat di fase 00-project-setup.md
// Task di sini adalah untuk verifikasi dan memastikan kesesuaian schema.

## Task 1.1: Verify 'users' table schema

- [x] 'users' table sudah sesuai dengan `05-database-spec.md` dan kebutuhan authentication.

## Task 1.2: Verify 'roles' table schema

- [x] 'roles' table sudah sesuai dengan `05-database-spec.md`.

## Task 1.3: Verify 'permissions' table schema

- [x] 'permissions' table sudah sesuai dengan `05-database-spec.md`.

## Task 1.4: Verify 'role_permissions' table schema

- [x] 'role_permissions' table (many-to-many) sudah sesuai dengan `05-database-spec.md`.

## Task 1.5: Clarify 'user_roles' table (Potentially Remove/Adjust)

- [x] Klarifikasi apakah diperlukan tabel 'user_roles' terpisah untuk many-to-many User-Role, atau 'users.roleId' sudah cukup.
  - Keputusan: `users.roleId` sudah cukup; `user_roles` terpisah tidak diperlukan saat ini.
  - Acceptance Criteria: Schema database untuk relasi User-Role telah final.

## Task 1.6: Verify 'refresh_tokens' table schema

- [x] 'refresh_tokens' table sudah sesuai dengan `05-database-spec.md`.

## Task 1.7: Verify 'audit_logs' table schema (for login events)

- [x] 'audit_logs' table sudah sesuai dengan `05-database-spec.md` dan dapat mencatat event login.

---

# Epic 2 — Identity Management (Backend)

## Task 2.1: Implement User Module (Repository, Service, API)

- [x] User Repository (CRUD, find by username/email)
- [x] User Service (Business logic: hash password, assign role)
- [x] User Controller/API (GET /users, GET /users/:id, POST /users, PUT /users/:id, DELETE /users/:id)
  - Acceptance Criteria: CRUD User berfungsi dengan validasi Zod.

## Task 2.2: Implement Role Module (Repository, Service, API)

- [x] Role Repository (CRUD)
- [x] Role Service
- [x] Role Controller/API (GET /roles, POST /roles, PUT /roles/:id, DELETE /roles/:id)
  - Acceptance Criteria: CRUD Role berfungsi.

## Task 2.3: Implement Permission Module (Repository, Service, API)

- [x] Permission Repository (CRUD, assign/revoke to role)
- [x] Permission Service
- [x] Permission Controller/API (GET /permissions, POST /permissions, PUT /permissions/:id)
  - Acceptance Criteria: CRUD Permission berfungsi.

## Task 2.4: Seeder Default Roles & Permissions

- [x] Buat seeder untuk default 'Admin', 'NOC', 'Technician' roles dan permission dasarnya.

---

# Epic 3 — Authentication Core (Backend)

## Task 3.1: Implement Login Workflow

- [x] Login API (POST /api/v1/auth/login)
  - Acceptance Criteria: Mengembalikan Access Token (JWT 15m) & Refresh Token (7 hari). Input divalidasi dengan Zod.

## Task 3.2: Implement Refresh Token Workflow

- [x] Refresh Token API (POST /api/v1/auth/refresh)
  - Acceptance Criteria: Mengembalikan Access Token & Refresh Token baru, token lama di-revoke.

## Task 3.3: Implement Logout Workflow

- [x] Logout API (POST /api/v1/auth/logout)
  - Acceptance Criteria: JWT di-blacklist/revoke, Refresh Token di-revoke dari DB.

## Task 3.4: Current User Info API

- [x] GET /api/v1/auth/me
  - Acceptance Criteria: Mengembalikan detail user yang sedang login.

## Task 3.5: Change Password API

- [x] POST /api/v1/auth/change-password

## Task 3.6: Reset Password API (Admin only)

- [x] POST /api/v1/auth/reset-password (untuk admin mereset password user lain)

---

# Epic 4 — Authorization Core (Backend)

## Task 4.1: JWT Middleware

- [x] Validasi JWT pada setiap request ke endpoint terproteksi.
  - Acceptance Criteria: Endpoint private terlindungi.

## Task 4.2: RBAC/PBAC Middleware

- [x] Middleware untuk memeriksa role dan permission user yang sedang login.
  - Acceptance Criteria: Akses ke resource dibatasi berdasarkan permission.

---

# Epic 5 — Session & Audit (Backend)

## Task 5.1: Session Tracking & Revocation

- [x] Logic untuk track sesi user dan memungkinkan admin me-revoke sesi.

## Task 5.2: Audit Login/Logout/Change

- [x] Integrasikan logic audit untuk Login, Logout, Failed Login, Password Change.
  - Acceptance Criteria: Semua aktivitas autentikasi tercatat di 'audit_logs'.

---

# Epic 6 — Frontend Authentication

## Task 6.1: Login Page UI & Logic

- [x] Login Page (`/login`) dengan form validasi dan integrasi API.

## Task 6.2: Protected Routes

- [x] Implementasi proteksi rute (redirect ke login jika tidak terautentikasi).

## Task 6.3: Auth Store Integration

- [x] Integrasi `useAuthStore` (Zustand) untuk mengelola state autentikasi global.

## Task 6.4: Auth API Service (Frontend)

- [x] Buat service untuk memanggil API autentikasi backend.

## Task 6.5: User Profile & Logout UI

- [x] Komponen untuk menampilkan info user dan tombol logout.

---

# Epic 7 — Testing

## Task 7.1: Backend Authentication Tests

- [x] Unit & Integration tests untuk Authentication Service, Repositories, API, dan Middlewares.

## Task 7.2: Frontend Authentication Tests

- [x] Tests untuk Login Page, Protected Routes, dan Auth Store.

---

# Final Acceptance Criteria

Fase Authentication dianggap selesai apabila:

- [x] Authentication API (Login, Logout, Refresh) berfungsi penuh.
- [x] Identity Management (User, Role, Permission CRUD) berfungsi penuh.
- [x] JWT dan RBAC/PBAC Middleware melindungi semua endpoint.
- [x] Session Management dan Audit berjalan.
- [x] Frontend memiliki halaman login fungsional dan proteksi rute.
- [x] Seluruh unit dan integration tests lulus.
- [x] Dokumentasi (API, Readme) diperbarui.

---

# Notes

- Password harus menggunakan bcrypt/Argon2.
- Password tidak boleh dicatat pada log.
- Refresh token disimpan dalam bentuk hash di database.
- Endpoint autentikasi menerapkan rate limiting.
- Seluruh input divalidasi menggunakan Zod.
- Semua response mengikuti standar API pada `04-api-spec.md`.
