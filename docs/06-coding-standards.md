# 06-coding-standards.md

# Broadband Customer Monitoring System (BCMS) - Coding Standards

## 1. AI Development Constitution & Rules

AI must respect the system boundaries and logic layers defined in the architecture.

AI **TIDAK BOLEH**:

- Mengubah arsitektur.
- Membuat dependency baru tanpa alasan.
- Menggunakan library yang tidak diperlukan.
- Mengubah struktur folder.
- Mengubah response API.
- Mengubah schema database.
- Menulis business logic di Controller.
- Menulis query database di Controller.
- Mengakses Redis dari React.
- Memanggil GenieACS langsung dari Controller.
- Memanggil OLT Adapter langsung dari Controller.
- Memanggil HTTP API langsung dari React Component.

---

## 2. Layer Responsibilities

### Controller

Hanya:

- Validasi Request
- Memanggil Service
- Return Response

Tidak boleh:

- Business Logic
- SQL
- Redis
- HTTP Request
- Parsing

### Service

Hanya:

- Business Logic
- Workflow
- Transaction
- Event Publish

Tidak boleh:

- SQL langsung
- CLI
- HTTP Request langsung

### Repository

Hanya:

- Query Database
- Drizzle ORM

Tidak boleh:

- Business Logic
- HTTP
- Redis
- Socket

### Adapter

Hanya:

- Integrasi eksternal
- Retry
- Mapping
- Authentication
- Timeout

Tidak boleh:

- Business Rule
- Database

---

## 3. Tech Stack & Library Constraints

- **TypeScript strict mode**: `strict=true` wajib. Dilarang keras menggunakan `any`. Gunakan `unknown` atau Generics. Seluruh function wajib memiliki return type.
- **Fastify**: Gunakan Fastify Plugin, Route, dan Decorator. Jangan gunakan Express middleware.
- **Database**: Semua query database menggunakan Drizzle ORM. Dilarang menggunakan Raw SQL kecuali untuk Migration dan query yang sangat kritis dari sisi performansi.
- **Validation**: Menggunakan Zod untuk validasi request (body, query params, path params). Tidak boleh validasi manual.
- **Logging**: Menggunakan Pino Logger. Catat log pada API, Adapter, Queue, Socket, dan Workflow. Password/credential tidak boleh dicatatkan pada log.
- **Event Bus**: Semua perubahan status harus dipublikasikan ke Event Bus -> Redis -> Socket -> Frontend. Controller tidak boleh mengirim event langsung.
- **Queue**: Tugas-tugas asynchronous seperti ONU Registration, Replace ONU, Push PPPoE, Push WiFi, Backup, dan Restore harus menggunakan BullMQ.
- **Dependency Rules**: Jangan menambah package baru kecuali benar-benar diperlukan. Laporkan alasan, manfaat, dampak, dan alternatif sebelum menambahkan dependensi.

---

## 4. Code Style & Naming Conventions

- Nama file menggunakan `kebab-case`.
- Nama class menggunakan `PascalCase`.
- Nama interface diawali huruf `I` hanya jika benar-benar diperlukan; disarankan nama deskriptif tanpa prefix.
- Nama type menggunakan `PascalCase`.
- Nama function menggunakan `camelCase`.
- Nama konstanta menggunakan `UPPER_SNAKE_CASE`.
- Hindari singkatan yang tidak jelas.
- Gunakan istilah domain secara konsisten (ONU, OLT, Customer, Device, Provision, Workflow, Adapter, Event, Alarm, Task). Jangan mencampur `Client`, `User`, dan `Subscriber` jika yang dimaksud adalah `Customer`.

---

## 5. Performance Guidelines

- API response time: < 200 ms.
- Dashboard load time: < 2 detik.
- Realtime socket delay: < 1 detik.
- Target coverage unit test pada service layer: minimal 80%.

---

## 6. Pull Request Checklist

Sebelum melakukan merge, pastikan:

- Build berhasil.
- Lint berhasil.
- Test berhasil.
- Tidak ada TypeScript error.
- Tidak ada `console.log`.
- Tidak ada `TODO` yang tertinggal.
- Migration disertakan jika schema database berubah.
- Dokumentasi diperbarui jika ada perubahan API atau arsitektur.
