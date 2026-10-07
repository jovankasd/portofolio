# Product Requirement Document (PRD)
## Proyek: Personal Portfolio & Tech Dossier — "Editorial Precision & Warm Atmosphere"

| Field | Detail |
|---|---|
| Role / Persona | AI Orchestrator & Agentic AI Engineer |
| Versi Dokumen | 2.0 (Editorial & Anti-Slop Aligned) |
| Status | Produksi / Aktif |
| Target Rilis | 2026 |
| Codename | Editorial Precision & Warm Atmosphere — The Tech Dossier |

---

## 1. Executive Summary

"Editorial Precision & Warm Atmosphere" adalah portofolio personal dan *tech dossier* seorang AI Orchestrator & Agentic AI Engineer. Menggantikan tampilan AI generik (neon biru-ungu dan dark-mode sci-fi klise) dengan estetika editorial berbasis kertas hangat (*warm paper tone* `#f4f0e8`), tipografi serif berbobot, aksen terracotta (`#bd4b2a`), dan struktur kurasi asimetris.

Situs ini berfungsi ganda:
1. **Showcase Publik Kelas Dunia**: Menampilkan karya, filosofi kerja sistem agen, dan bukti kredibilitas nyata secara cepat, terstruktur, dan elegan.
2. **Pusat Kendali Arsip (Dossier Control)**: Gerbang otentikasi aman berbasis konsol terminal minimalis dan dasbor manajemen konten terhubung langsung ke basis data Supabase.

---

## 2. Latar Belakang & Problem Statement

Kebanyakan portofolio tech modern terjebak dalam dua ekstrem:
1. **Generic Tech Slop**: Menggunakan template gelap seragam, gradien neon ungu-biru, kartu bento tanpa hierarki, serta klaim berlebihan tanpa bukti teknis.
2. **Maintenance Overhead**: Banyak portofolio statis mengharuskan pengembang melakukan *commit* dan *redeploy* kode setiap kali ingin menambahkan proyek atau sertifikat baru.

Portofolio ini mengatasi kedua masalah tersebut dengan menerapkan filter **anti-slop** pada desain visual dan menyediakan **Dossier Control** terintegrasi Supabase agar pembaruan data dapat dilakukan secara instan kapan pun.

---

## 3. Visi & Target Terukur

**Visi:** Memposisikan pemilik sebagai *AI Orchestrator* yang merancang sistem otonom yang andal, dapat diaudit, dan berorientasi nilai nyata.

**Objectives Terukur:**
| ID | Objective | Target Metrik |
|---|---|---|
| O1 | Konversi Unduhan CV | ≥ 8% dari total pengunjung unik |
| O2 | Kejelasan Verifikasi Kredensial | 100% kredensial memiliki sertifikat / bukti foto & tautan registri |
| O3 | Kecepatan Muat Halaman | First Contentful Paint < 1.2s, Time to Interactive < 2.0s |
| O4 | Skor Performa Lighthouse | Skor ≥ 95 (Mobile & Desktop) |
| O5 | Keamanan Akses Admin | Rate-limited + lockout 5 menit setelah 3x salah percobaan |

---

## 4. Target Persona

1. **The Talent Scout / Technical Recruiter**: Mencari bukti kompetensi sistem nyata, bio yang ringkas dan padat, serta akses 1-klik unduh CV.
2. **The Engineering Leader / Founder**: Ingin melihat bagaimana kandidat merancang arsitektur AI agen, keandalan sistem, dan tautan kode/demo live.
3. **The Peer Engineer**: Menginspeksi kebersihan kode, pemilihan tech stack, dan implementasi arsitektur perangkat lunak.

---

## 5. Ruang Lingkup (Scope)

**In Scope:**
- Halaman utama publik editorial (`#f4f0e8`, serif headlines, asymmetric grid).
- Galeri proyek pilihan dengan tag AI, ringkasan, stack teknologi, tautan GitHub & Live demo.
- Bagian "Cara Saya Bekerja" (01 Sistem agen, 02 Produk yang dapat dijelaskan, 03 Keandalan).
- Rekam Jejak Kredensial berkontras tinggi (`#1d1b18`) dengan modal pop-up pendukung gambar sertifikat & dokumentasi bukti lapangan.
- Direct Uplink (Kontak cepat terracotta `#bd4b2a` dan unduh CV).
- Gerbang otentikasi `/dossier-control` dengan antarmuka konsol terminal dan Cyber Macro Bar untuk mobile.
- Dasbor admin `/dossier-control/dashboard` untuk operasi CRUD proyek dan kredensial secara realtime melalui Supabase.

**Out of Scope (v1):**
- Blog artikel panjang / multi-penulis.
- Multi-bahasa otomatis.
- Sistem pembayaran atau e-commerce.

---

## 6. Functional Requirements (FR)

| ID | Kategori | Deskripsi Persyaratan | Kriteria Penerimaan |
|---|---|---|---|
| **FR-01** | Navigasi | Navbar *sticky* minimalis dengan penanda scroll | Muncul latar blur lembut saat di-scroll >24px, tautan navigasi mulus, dan tombol CTA "Mari bicara" |
| **FR-02** | Hero | Headline tipografi display serif fluid | Teks terukur `clamp()` responsif, bio berorientasi sistem, dan tombol aksi unduh CV langsung |
| **FR-03** | Galeri Proyek | Kartu proyek editorial asimetris bernomor urut | Menampilkan urutan `01`, `02`, tag AI, deskripsi, stack, serta aksi Live Demo dan Kode GitHub |
| **FR-04** | Kredensial | Bagian kontras tinggi dengan modal interaktif | Klik item membuka modal warm paper dengan tab sertifikat/foto bukti dan tombol verifikasi eksternal |
| **FR-05** | Aksesibilitas Modal | Penguncian fokus & scroll | Modal dapat ditutup via tombol ESC, klik backdrop, atau tombol tutup; scroll body terkunci saat modal terbuka |
| **FR-06** | Kontak | Blok terracotta Direct Uplink | Tautan kontak (email, LinkedIn, GitHub) dengan aksi yang jelas dan mudah diakses |
| **FR-07** | Admin Auth | Konsol terminal verifikasi | Menerima `auth --key <KEY>` atau kunci langsung; mengunci input selama 5 menit jika gagal 3x berturut-turut |
| **FR-08** | Mobile Macro | Cyber Macro Bar | Muncul di viewport ponsel saat mengakses gerbang admin untuk kemudahan paste, clear, dan login |
| **FR-09** | Admin CRUD | Manajemen Proyek & Kredensial | Admin terotentikasi dapat menambah, menyunting, dan menghapus data proyek & kredensial ke Supabase |
| **FR-10** | Keamanan Sesi | Cookie berbasis HMAC-SHA256 | Sesi admin tersimpan aman dalam httpOnly cookie dengan verifikasi tanda tangan server |
