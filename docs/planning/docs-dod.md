# Docs Definition of Done (DoD) Checklist

Setiap kali melakukan pembaruan atau pembuatan dokumen di `/docs`, pastikan kriteria berikut terpenuhi:

1. **Logical Separation**:
   - Dokumen PRD (`01-prd.md`) hanya berisi _kebutuhan fungsional_ (WHAT), bukan keputusan teknis spesifik.
   - Dokumen Standard Coding (`06-coding-standards.md`) menjadi satu-satunya tempat untuk aturan penulisan kode, penamaan, dan batasan teknologi backend/frontend.
   - Spesifikasi vendor dipisahkan ke `03-vendor-mapping.md` dan `03-olt-adapter-spec.md`.

2. **File Naming Standard**:
   - Nama file dokumen wajib menggunakan `kebab-case` huruf kecil (contoh: `genieacs-integration.md`).
   - File spesifikasi inti yang memiliki urutan baca diberikan prefix angka (contoh: `01-prd.md`, `02-architecture.md`).

3. **Link Integrity**:
   - Seluruh referensi antar file dokumen (markdown links) harus valid dan tidak boleh ada broken link.
   - Tidak boleh menggunakan absolute path local user (seperti `D:\Kerja\...`) di dalam file markdown. Gunakan path relatif dari lokasi dokumen terkait.

4. **Planning Separation**:
   - Semua file task tracking, ticket breakdown, dan roadmap harus berada di subfolder `planning/` agar tidak mengotori spesifikasi teknis utama.

5. **No Redundancy**:
   - Tidak boleh ada duplikasi tabel mapping vendor (misal, tabel status/alarm) di lebih dari satu file markdown. Masing-masing dokumen memiliki tanggung jawab tunggal.
