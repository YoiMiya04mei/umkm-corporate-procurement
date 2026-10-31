# PT MITRA KARYA PRATAMA — UMKM CORPORATE PROFILE & PROCUREMENT PLATFORM

Website profil korporasi modern dan portal pengadaan barang (supplier) & layanan jasa (service provider) terpadu berstandar B2B dan B2G. Dilengkapi katalog produk berfitur RFQ (Request for Quotation), alur kerja layanan, portofolio proyek, publikasi wawasan industri, dan Admin CMS Dashboard untuk mengelola seluruh informasi legalitas, produk, dan permohonan harga.

---

## 1. Fitur Utama

### A. Halaman Publik (Public Website)
- **Beranda (Home Page)**:
  - Hero Section dinamis dengan visual procurement modern & badge kemitraan.
  - Profil singkat perusahaan & 6 pilar keunggulan (Why Choose Us).
  - Kategori bisnis terintegrasi (Pengadaan Barang, Supplier, General Trading, IT & Networking, Mekanikal & Elektrikal, General Services).
  - Produk unggulan (Featured Products) dengan foto, SKU, spesifikasi, dan tombol Minta Penawaran (RFQ).
  - Layanan jasa unggulan dengan daftar ruang lingkup pekerjaan.
  - Counter statistik pencapaian dinamis (Proyek Selesai, Klien, Produk, Pengalaman) yang dapat diubah dari CMS.
  - Portofolio rekam jejak serah terima 100%.
  - Mitra rekanan & logo klien.
  - Testimoni manajer pengadaan dengan rating bintang.
  - Artikel & wawasan industri terbaru.
  - Banner CTA kerja sama pengadaan.
  - Footer korporasi komprehensif dengan navigasi cepat, kontak, dan nomor NIB/NPWP.
- **Tentang Kami (`/tentang-kami`)**:
  - Sejarah pendirian perusahaan.
  - Visi dan Misi korporasi.
  - Nilai-nilai utama perusahaan (Core Values).
  - Komitmen mutu & SLA pelayanan.
  - Struktur organisasi & profil pimpinan departemen.
  - Legalitas resmi (NIB, NPWP, Akta Notaris, SK Kemenkumham, Sertifikasi KBLI/K3).
- **Katalog Produk (`/produk` & `/produk/[slug]`)**:
  - Pencarian kata kunci (Search by Title, SKU, Brand).
  - Filter multi-kategori dan pengurutan (Sort by Newest, Name).
  - Halaman detail produk dengan galeri foto, tabel spesifikasi teknis lengkap, ketersediaan stok (*Ready Stock / Indent / Pre-Order*), produk terkait, dan tombol langsung Minta Penawaran Harga (RFQ).
- **Layanan Jasa (`/layanan` & `/layanan/[slug]`)**:
  - Katalog jasa kontraktor, instalasi IT data center, maintenance genset, dan konsultasi pengadaan.
  - Detail layanan memuat ruang lingkup kerja (Scope of Work), 4 tahapan alur proyek, keunggulan teknis, dan formulir konsultasi.
- **Portofolio Proyek (`/portofolio` & `/portofolio/[slug]`)**:
  - Filter proyek per sektor (B2B Swasta, B2G Pemerintah, IT Infrastruktur).
  - Detail portofolio dengan nama klien, lokasi proyek, tahun penyelesaian, deskripsi pekerjaan, dan dokumentasi foto.
- **Artikel & Berita (`/artikel` & `/artikel/[slug]`)**:
  - Publikasi tips tender, regulasi K3, dan strategi efisiensi rantai pasok.
  - Detail artikel dilengkapi author, tanggal, durasi baca, format konten, dan SEO metadata.
- **Hubungi Kami (`/kontak`)**:
  - Alamat kantor, nomor telepon, WhatsApp pengadaan, email resmi, dan jam operasional.
  - Peta Google Maps interaktif.
  - Formulir pesan kontak dengan validasi Zod dan notifikasi status pengiriman.
- **Request for Quotation / RFQ (`/rfq` & `/rfq/sukses`)**:
  - Formulir lengkap permohonan harga barang/jasa untuk instansi dan perusahaan.
  - Generate Nomor Tiket RFQ otomatis (`RFQ-YYYYMMDD-XXXX`).
  - Fitur upload berkas BoQ, ToR, atau gambar kerja (PDF, DOCX, XLSX, ZIP, Gambar maks. 10MB).
  - Halaman konfirmasi sukses dengan tombol langsung follow-up via WhatsApp membawa Nomor RFQ.
- **Floating WhatsApp**:
  - Tombol WhatsApp melayang di sudut kanan bawah seluruh halaman publik dengan pesan template cepat.

---

### B. Admin CMS Dashboard (`/admin`)
- **Autentikasi Aman**: Login berbasis session cookie HTTP-only terenkripsi dengan password hashing `bcryptjs`.
- **Overview Dashboard (`/admin`)**:
  - Kartu metrik: Total Produk, Total Layanan, Portofolio, Artikel, Kategori, Total RFQ, dan RFQ Baru.
  - Tabel antrean RFQ terbaru dengan badge status.
  - Daftar pesan kontak masuk terbaru.
  - Pintasan aksi cepat.
- **Manajemen RFQ (`/admin/rfq`)**:
  - Filter status: `NEW`, `REVIEWED`, `QUOTATION_PREPARED`, `SENT`, `APPROVED`, `REJECTED`, `COMPLETED`.
  - Modal detail menampilkan seluruh spesifikasi pemohon, lokasi, dan tombol download berkas lampiran.
  - Pengubahan status RFQ dan kolom catatan internal admin (riwayat nomor SPH resmi, harga penawaran, dll).
- **Manajemen Produk (`/admin/products`)**:
  - CRUD produk lengkap, input SKU, brand, kategori, deskripsi singkat dan lengkap.
  - Builder spesifikasi teknis dinamis (tabel parameter dan nilai).
  - Opsi harga (bisa diisi atau disembunyikan agar pelanggan menekan tombol RFQ).
  - Status ketersediaan (Ready Stock / Indent / Pre Order) dan galeri foto.
- **Manajemen Layanan (`/admin/services`)**:
  - CRUD layanan jasa, kategori, deskripsi, ruang lingkup kerja per butir, dan tahapan proses pengerjaan.
- **Manajemen Portofolio (`/admin/portfolio`)**:
  - CRUD proyek, nama klien, lokasi, tahun pengerjaan, dan dokumentasi foto lapangan.
- **Manajemen Artikel (`/admin/articles`)**:
  - CRUD artikel, thumbnail, excerpt, format konten rich text/HTML, serta tag SEO title & description.
- **Kelola Kategori (`/admin/categories`)**:
  - Tambah, edit, dan hapus kategori untuk Produk, Layanan, Portofolio, dan Artikel.
- **Pengaturan Profil Perusahaan (`/admin/settings`)**:
  - Ubah Nama Perusahaan, Nama Badan Hukum (PT/CV), Tagline, Deskripsi, Sejarah.
  - Ubah Data Legalitas: Nomor NIB, NPWP, Akta Notaris, SK Kemenkumham, Sertifikasi KBLI/K3.
  - Ubah Kontak & Lokasi: Telepon, WhatsApp, Email, Alamat, Kota, Provinsi, Jam Operasional, dan URL Google Maps.
  - Ubah Angka Statistik Beranda: Jumlah Proyek, Klien, Produk, dan Tahun Pengalaman.
  - Ubah Visi, Misi, dan Core Values perusahaan.

---

## 2. Tech Stack

| Lapisan | Teknologi |
|---|---|
| **Framework** | Next.js (App Router, Server Actions, Route Handlers) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS (dengan Palette Corporate Navy, Blue & Gold) |
| **Ikonografi** | Lucide React |
| **Database ORM** | Prisma ORM |
| **Database** | SQLite (Dev lokal zero-config) / PostgreSQL (Produksi & Docker) |
| **Autentikasi** | Session Cookie (HttpOnly, SameSite) & `bcryptjs` |
| **Validasi Data** | Zod Schema Validation |
| **Container** | Docker & Docker Compose |

### Palet Warna Desain
- **Dark Navy**: `#101D32`
- **Corporate Blue**: `#183B63`
- **Gold Accent**: `#C8A96B`
- **White**: `#FFFFFF`
- **Light Gray**: `#F4F6F9`

---

## 3. Akun Administrator Default

Setelah menjalankan seed, Anda dapat masuk ke CMS Dashboard melalui:
- **URL Login**: `http://localhost:3000/admin/login`
- **Email**: `admin@perusahaan.co.id`
- **Password**: `AdminCorporate2026!`

*(Catatan: Kredensial dan data demo dapat diubah sewaktu-waktu melalui menu CMS Pengaturan Perusahaan).*

---

## 4. Cara Instalasi & Menjalankan (Local Development)

### Prasyarat
- Node.js versi 18 atau lebih baru (direkomendasikan v20 / v22 / v24).
- npm (Node Package Manager).

### Langkah Menjalankan
1. **Clone atau Buka Direktori Project**:
   ```bash
   cd "c:\Users\permadi pratama\OneDrive\文档\Project antigravity\New folder"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Inisialisasi Database & Seeding**:
   Project telah dikonfigurasi menggunakan SQLite untuk pengembangan lokal instan tanpa perlu menginstall server database tambahan:
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

5. **Akses Halaman Kunci**:
   - Beranda: [http://localhost:3000](http://localhost:3000)
   - Tentang Kami: [http://localhost:3000/tentang-kami](http://localhost:3000/tentang-kami)
   - Katalog Produk: [http://localhost:3000/produk](http://localhost:3000/produk)
   - Layanan Jasa: [http://localhost:3000/layanan](http://localhost:3000/layanan)
   - Portofolio Proyek: [http://localhost:3000/portofolio](http://localhost:3000/portofolio)
   - Artikel: [http://localhost:3000/artikel](http://localhost:3000/artikel)
   - Kontak: [http://localhost:3000/kontak](http://localhost:3000/kontak)
   - Formulir RFQ: [http://localhost:3000/rfq](http://localhost:3000/rfq)
   - Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 5. Deployment Menggunakan Docker & PostgreSQL

Aplikasi telah dilengkapi `Dockerfile` multi-stage dan `docker-compose.yml` yang siap untuk deployment produksi dengan PostgreSQL 16:

1. **Jalankan Service dengan Docker Compose**:
   ```bash
   docker compose up -d --build
   ```
2. Docker akan secara otomatis:
   - Menjalankan container PostgreSQL 16 Alpine dengan volume persisten.
   - Melakukan kompilasi standalone Next.js.
   - Menjalankan container aplikasi pada port `3000`.

---

## 6. Menjalankan Pengujian (Testing)

Untuk memverifikasi seluruh integritas database, enkripsi password, Zod validation, alur RFQ, dan operasi CRUD:

```bash
npx tsx tests/verify-all.ts
```

Output:
```
==================================================
📊 TEST RESULTS: 24 PASSED | 0 FAILED
==================================================
```

Untuk memverifikasi build produksi Next.js:
```bash
npm run build
```

---

## 7. Keamanan & Optimasi SEO

- **Perlindungan Rute**: Middleware edge melindungi seluruh rute `/admin/*` (kecuali `/admin/login`). Percobaan akses tanpa cookie sesi yang valid otomatis dialihkan ke halaman login.
- **Password Hashing**: Menggunakan `bcryptjs` dengan 12 salt rounds.
- **Sanitasi File Upload**: Validasi MIME type ketat (hanya dokumen PDF, DOCX, XLSX, ZIP, dan gambar JPG/PNG/WebP) serta pembatasan ukuran maksimal 10MB dengan nama file acak berbasis UUID dan timestamp.
- **SEO & Metatags**:
  - Dynamic Open Graph dan Twitter Cards pada setiap produk, layanan, dan artikel.
  - Sitemap dinamis otomatis di `/sitemap.xml`.
  - Pengaturan crawler bot di `/robots.txt`.
