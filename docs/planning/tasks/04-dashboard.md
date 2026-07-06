# 04 - Dashboard

**Phase:** Dashboard & Visualization

**Status:** COMPLETED

**Priority:** High

**Dependencies:**

- ✅ 00-project-setup.md
- ✅ 01-authentication.md
- ✅ 02-master-data.md
- ✅ 03-operational-data.md

---

# Objective

Membangun Dashboard utama BCMS sebagai pusat monitoring jaringan broadband secara realtime.

Dashboard harus memberikan gambaran kondisi jaringan dalam satu layar, mulai dari jumlah pelanggan, status ONU, alarm aktif, workflow yang sedang berjalan, hingga performa sistem.

---

# Scope

Modul yang dikerjakan:

- Summary Dashboard
- Customer Statistics
- ONU Statistics
- OLT Statistics
- Alarm Dashboard
- Workflow Dashboard
- System Metrics
- Realtime Dashboard
- Interactive Charts
- Quick Actions

---

# Epic 1 — Dashboard Summary API

## Task 1.1

- ✅ [x] Dashboard Summary Endpoint

```http
GET /api/v1/dashboard/summary
```

Acceptance Criteria

Mengembalikan:

- Total Customer
- Total OLT
- Total ONU
- Online ONU
- Offline ONU
- LOS
- Dying Gasp
- Active Alarm
- Running Workflow

---

## Task 1.2

- ✅ [x] Cache Dashboard Summary (Redis)

Acceptance Criteria

TTL dapat dikonfigurasi.

---

# Epic 2 — Customer Statistics

## Task 2.1

- [x] Customer Status Summary

---

## Task 2.2

- [x] Customer by Region

---

## Task 2.3

- [x] Customer by POP

---

## Task 2.4

- [x] New Customer Trend

Acceptance Criteria

Grafik harian, mingguan, dan bulanan.

---

# Epic 3 — ONU Statistics

## Task 3.1

- - [x] Online vs Offline

---

## Task 3.2

- - [x] LOS Statistics

---

## Task 3.3

- - [x] Dying Gasp Statistics

---

## Task 3.4

- - [x] ONU by Vendor

---

## Task 3.5

- - [x] ONU by Model

---

## Task 3.6

- - [x] Optical Power Distribution

Acceptance Criteria

Menampilkan distribusi RX Power berdasarkan kategori:

- Normal
- Warning
- Critical

---

# Epic 4 — OLT Statistics

## Task 4.1

- ✅ [x] OLT Health Summary

---

## Task 4.2

- ✅ [x] OLT by Vendor

---

## Task 4.3

- ✅ [x] PON Port Utilization

---

## Task 4.4

- ✅ [x] ONU Capacity Usage

Acceptance Criteria

Persentase penggunaan slot ONU pada setiap OLT.

---

# Epic 5 — Alarm Dashboard

## Task 5.1

- [x] Active Alarm Counter

---

## Task 5.2

- [x] Alarm by Severity

---

## Task 5.3

- [x] Alarm Trend

---

## Task 5.4

- [x] Latest Alarm Table

Acceptance Criteria

Menampilkan:

- Waktu
- Customer
- ONU
- OLT
- Alarm
- Severity

---

# Epic 6 — Workflow Dashboard

## Task 6.1

- [x] Running Workflow

---

## Task 6.2

- [x] Workflow Success Rate

---

## Task 6.3

- [x] Workflow Failure Rate

---

## Task 6.4

- [x] Latest Workflow

---

# Epic 7 — System Metrics

## Task 7.1

- [x] API Response Time

---

## Task 7.2

- [x] Queue Length

---

## Task 7.3

- [x] Worker Status

---

## Task 7.4

- [x] Redis Status

---

## Task 7.5

- [x] PostgreSQL Status

---

# Epic 8 — Dashboard UI

## Task 8.1

- [x] Dashboard Layout

---

## Task 8.2

- [x] Summary Cards

Cards:

- Total Customer
- Online
- Offline
- LOS
- Dying Gasp
- Active Alarm
- Workflow

---

## Task 8.3

- [x] Charts Section

Charts:

- Customer Growth
- ONU Status
- Alarm Trend
- Vendor Distribution
- Optical Distribution

---

## Task 8.4

- [x] Latest Activity Panel

---

## Task 8.5

- [x] Quick Action Panel

Shortcut:

- Register ONU
- Replace ONU
- Push PPPoE
- Push WiFi
- Reboot ONU

---

# Epic 9 — Filtering

## Task 9.1

- [x] Filter by Region

---

## Task 9.2

- [x] Filter by POP

---

## Task 9.3

- [x] Filter by Vendor

---

## Task 9.4

- [x] Filter by OLT

---

## Task 9.5

- [x] Date Range Filter

---

# Epic 10 — Dashboard Performance

## Task 10.1

- ✅ [x] Redis Cache

---

## Task 10.2

- [ ] Query Optimization

---

## Task 10.3

- [ ] Lazy Loading

---

## Task 10.4

- ✅ [x] Skeleton Loading

---

# Epic 11 — Permission

## Task 11.1

- ✅ [x] Dashboard Read Permission

---

## Task 11.2

- ✅ [x] Widget Permission

Acceptance Criteria

Widget tertentu dapat disembunyikan berdasarkan permission pengguna.

---

# Epic 12 — Frontend Testing

- ✅ [x] Dashboard Page Test
- ✅ [x] Dashboard API Test
- ✅ [x] Dashboard Store Test
- ✅ [x] Widget Test

---

# Deliverables

Setelah fase ini selesai:

- Dashboard utama tersedia.
- Ringkasan statistik dapat ditampilkan.
- Grafik interaktif tersedia.
- Alarm aktif terlihat.
- Workflow dapat dipantau.
- Status sistem dapat dipantau.
- Dashboard siap menerima update realtime pada fase berikutnya.

---

# Acceptance Criteria

- ✅ [x] Dashboard dapat diakses setelah login.
- ✅ [x] Semua kartu statistik tampil.
- ✅ [x] Semua grafik berfungsi.
- [ ] Filter bekerja dengan benar.
- ✅ [x] Quick Action tersedia.
- ✅ [x] Cache Redis aktif.
- [ ] Query dashboard telah dioptimalkan.
- ✅ [x] Unit test lulus.
- ✅ [x] Dokumentasi diperbarui.

---

# Notes

- Dashboard pada fase ini menggunakan data dari database.
- Pembaruan otomatis menggunakan Socket.IO akan diimplementasikan pada fase **05-realtime.md**.
- Semua endpoint harus mengikuti `04-api-spec.md`.
- Statistik harus mengambil data dari tabel operasional (`device_status`, `alarms`, `workflows`, `system_metrics`) dan bukan langsung dari tabel master.
- Desain UI mengikuti layout NOC dengan fokus pada keterbacaan dan performa.
