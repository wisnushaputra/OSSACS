# 02 - Master Data

**Phase:** Core Data

**Status:** COMPLETED

**Priority:** High

**Dependencies:**

- ✅ 00-project-setup.md
- ✅ 01-authentication.md

---

# Objective

Membangun seluruh master data yang menjadi fondasi operasional BCMS.

Semua data harus sudah dapat dikelola melalui API dan antarmuka web, serta siap digunakan oleh Workflow Engine, GenieACS Integration, dan OLT Adapter.

---

# Scope

Modul yang dikerjakan:

- Customer
- OLT
- PON Port
- ONU
- Vendor
- Profile
- Region
- POP
- VLAN
- Service Profile

---

# Epic 1 — Customer

## Task 1.1

- [x] Create Customer Database Schema

Acceptance Criteria

- UUID
- Customer Code
- Full Name
- Identity Number (Opsional)
- Phone
- Email
- Address
- Region
- POP
- Status
- Created At
- Updated At

---

## Task 1.2

- [x] Customer Repository

---

## Task 1.3

- [x] Customer Service

---

## Task 1.4

- [x] Customer CRUD API

Endpoints

```http
GET    /api/v1/customers
GET    /api/v1/customers/:id
POST   /api/v1/customers
PUT    /api/v1/customers/:id
DELETE /api/v1/customers/:id
```

---

## Task 1.5

- [x] Customer Search

Acceptance Criteria

Search berdasarkan:

- Customer Code
- Nama
- Nomor Telepon
- Serial ONU

---

## Task 1.6

- [x] Pagination

---

## Task 1.7

- [x] Customer Detail Page

---

# Epic 2 — OLT

## Task 2.1

- [x] OLT Database Schema

Acceptance Criteria

- Name
- Vendor
- Model
- IP Address
- Port
- Username
- Encrypted Password
- Transport
- Status
- Region
- POP

---

## Task 2.2

- [x] OLT CRUD API

---

## Task 2.3

- [x] OLT Connection Test

Acceptance Criteria

Pengguna dapat menguji koneksi ke OLT sebelum disimpan.

---

## Task 2.4

- [x] Encrypt Credential

Acceptance Criteria

Password OLT tidak disimpan dalam bentuk plain te t.

---

## Task 2.5

- [x] OLT Detail Page

---

# Epic 3 — PON Port

## Task 3.1

- [x] PON Port Schema

---

## Task 3.2

- [x] Generate Default PON Port

Acceptance Criteria

Saat OLT dibuat, sistem dapat membuat daftar PON berdasarkan konfigurasi OLT (misalnya 16/32/64 port).

---

## Task 3.3

- [x] PON Port API

---

## Task 3.4

- [x] PON Port Utilization

Acceptance Criteria

Menampilkan jumlah ONU terpakai dan slot yang masih tersedia.

---

# Epic 4 — ONU

## Task 4.1

- [x] ONU Database Schema

Acceptance Criteria

- Serial Number
- Vendor
- Model
- Firmware
- Status
- RX Power
- TX Power
- Temperature
- Bias Current
- Voltage
- Customer
- OLT
- PON Port

---

## Task 4.2

- [x] ONU CRUD API

---

## Task 4.3

- [x] ONU Search

Acceptance Criteria

Pencarian berdasarkan:

- Serial Number
- Customer
- Vendor
- OLT
- Status

---

## Task 4.4

- [x] ONU Detail Page

---

## Task 4.5

- [x] ONU Status Badge

Status

- Online
- Offline
- LOS
- Dying Gasp
- Disabled
- Unknown

---

# Epic 5 — Vendor

## Task 5.1

- [x] Vendor Schema

---

## Task 5.2

- [x] Vendor Seeder

Acceptance Criteria

Vendor bawaan:

- Huawei
- ZTE
- Fiberhome
- VSOL
- Nokia
- Raisecom

---

## Task 5.3

- [x] Vendor Management API

---

# Epic 6 — Service Profile

## Task 6.1

- [x] Line Profile Schema

---

## Task 6.2

- [x] Service Profile Schema

---

## Task 6.3

- [x] DBA Profile Schema

---

## Task 6.4

- [x] VLAN Profile Schema

---

## Task 6.5

- [x] CRUD Profile

Acceptance Criteria

Profile dapat dipilih saat workflow Register ONU.

---

# Epic 7 — Region & POP

## Task 7.1

- [x] Region Schema

---

## Task 7.2

- [x] POP Schema

---

## Task 7.3

- [x] Region CRUD

---

## Task 7.4

- [x] POP CRUD

---

## Task 7.5

- [x] Mapping OLT ke POP

---

# Epic 8 — Frontend

## Customer

- [x] Customer List
- [x] Customer Detail
- [x] Customer Form

---

## OLT

- [x] OLT List
- [x] OLT Detail
- [x] OLT Form

---

## ONU

- [x] ONU List
- [x] ONU Detail
- [x] ONU Form

---

## Profile

- [x] Profile List
- [x] Profile Form

---

# Epic 9 — Validation

## Task 9.1

- [x] Zod Validation

---

## Task 9.2

- [x] Duplicate Customer Validation

---

## Task 9.3

- [x] Duplicate OLT Validation

---

## Task 9.4

- [x] Duplicate ONU Validation

Acceptance Criteria

Serial Number ONU harus unik.

---

# Epic 10 — Testing

Backend

- [x] Repository Test
- [x] Service Test
- [x] API Test

---

Frontend

- [x] Customer Page Test
- [x] OLT Page Test
- [x] ONU Page Test

---

# Deliverables

Setelah fase ini selesai:

- CRUD Customer tersedia.
- CRUD OLT tersedia.
- CRUD ONU tersedia.
- CRUD Vendor tersedia.
- CRUD Profile tersedia.
- CRUD Region & POP tersedia.
- PON Port dapat dikelola.
- API terdokumentasi.
- Frontend siap digunakan untuk administrasi data master.

---

# Acceptance Criteria

Fase Master Data dianggap selesai apabila:

- [x] Seluruh tabel master telah dibuat.
- [x] Seluruh migration berhasil dijalankan.
- [x] Semua endpoint CRUD berfungsi.
- [x] Validasi data aktif.
- [x] Pencarian dan pagination tersedia.
- [x] Frontend dapat mengelola seluruh master data.
- [x] Unit test dan integration test lulus.
- [x] Dokumentasi diperbarui.

---

# Notes

- Semua endpoint harus menggunakan JWT dan Permission Middleware.
- Gunakan soft delete untuk Customer, OLT, dan ONU jika sesuai kebutuhan operasional.
- Password OLT harus dienkripsi sebelum disimpan.
- Semua response mengikuti `04-api-spec.md`.
- Struktur database harus tetap mengacu pada `05-database-spec.md`.
- Mapping vendor harus mengikuti `03-vendor-mapping.md`.
