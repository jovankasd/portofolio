# Technical & System Architecture
## Proyek: "Editorial Precision & Warm Atmosphere" — The Tech Dossier

**Tech Stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres & Storage) · Lucide Icons · Vercel

---

## 1. Arsitektur Gambaran Umum (Overview)

```
┌────────────────────────────────┐         ┌──────────────────────────────┐
│       CLIENT (Browser)         │         │        VERCEL EDGE / SERVER  │
│  Next.js 14 App Router (CSR)   │◄───────►│  Middleware (Stealth Guard)   │
│  Tailwind Warm Editorial UI    │         │  Server Actions (Auth & CRUD)│
└───────────────┬────────────────┘         └───────────────┬──────────────┘
                │                                          │
                ▼                                          ▼
        Static / ISR Cache                         ┌──────────────────────┐
        (Halaman Publik)                           │       SUPABASE       │
                                                   │ Postgres (RLS Active)│
                                                   │ Storage Assets Bucket│
                                                   └──────────────────────┘
```

Alur Sistem:
1. **Pengunjung Publik**: Mengakses root path `/` yang dioptimasi secara statis. Menampilkan kartu proyek pilihan dan galeri sertifikasi dengan modal detail.
2. **Pengelola / Admin**: Mengakses rute `/dossier-control`. Otentikasi diverifikasi di sisi server via Server Actions dengan perlindungan rate-limiting (maksimal 3 percobaan sebelum lockout 5 menit). Sesi disimpan aman dalam httpOnly cookie terenkripsi HMAC-SHA256.
3. **Dasbor Konten (`/dossier-control/dashboard`)**: Menghubungkan admin langsung ke tabel `projects` dan `credentials` di Supabase untuk operasi tambah, edit, atau hapus entri secara realtime.

---

## 2. Rasionalisasi Tech Stack

| Pilihan | Alasan Dipilih |
|---|---|
| **Next.js 14 (App Router)** | Rendering hybrid (SSG + SSR), performa instan tanpa overhead runtime 3D yang lambat, Server Actions aman untuk mutasi data, dan Middleware native untuk perlindungan rute. |
| **Tailwind CSS + Custom Tokens** | Sistem token terpusat (`styles/tokens.css` & `tailwind.config.ts`) memungkinkan integrasi estetika editorial warm paper (`#f4f0e8`), deep charcoal (`#1d1b18`), dan terracotta (`#bd4b2a`) dengan efisiensi bundle minimal. |
| **Supabase (PostgreSQL + Storage)** | Basis data relasional fleksibel dengan skema terstruktur untuk proyek dan kredensial, dilengkapi Row-Level Security (RLS) dan asset storage untuk sertifikat resmi. |
| **Lucide Icons** | Ikon monoline ringan dengan stroke konsisten (1.5px) yang melengkapi tipografi serif tanpa terkesan kartunis atau berlebihan. |

---

## 3. Struktur Folder

```
portofolio/
├── app/
│   ├── layout.tsx                     # Root layout (Inter + JetBrains Mono)
│   ├── page.tsx                       # Halaman utama portofolio editorial
│   ├── globals.css                    # Pengaturan font-display dan styling dasar
│   ├── dossier-control/
│   │   ├── page.tsx                   # Gerbang verifikasi konsol terminal
│   │   └── dashboard/
│   │       └── page.tsx               # Dasbor manajemen konten
│   └── api/
│       └── contact/route.ts           # Endpoint kontak rate-limited
├── components/
│   ├── ui/                            # (Sekarang untuk komponen UI spesifik lainnya)
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── CredentialModal.tsx
│   │   └── DirectUplink.tsx
│   ├── admin/                         # Komponen panel admin
│   │   ├── TerminalShell.tsx
│   │   ├── CyberMacroBar.tsx
│   │   ├── DashboardClient.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── CredentialForm.tsx
│   │   └── ImageUploadField.tsx
│   └── shared/                        # Komponen lintas lapisan
│       └── Field.tsx
├── server/                            # BACKEND: Logika server
│   ├── actions/                       # Server Actions
│   │   ├── auth.actions.ts
│   │   ├── project.actions.ts
│   │   ├── credential.actions.ts
│   │   └── storage.actions.ts
│   ├── services/                      # Business logic
│   │   └── validation.ts              # Zod schemas untuk input validation
│   ├── db/                            # Database layer
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   └── auth/                          # Auth infrastructure
│       ├── session.ts
│       └── rate-limit.ts
├── shared/                            # Kode lintas lapisan
│   ├── types/                         # Shared TypeScript types
│   │   └── index.ts
│   ├── constants/                     # Konstanta statis dan fallback
│   │   ├── profile.ts
│   │   └── defaults.ts
│   └── utils.ts
├── config/                            # Konfigurasi aplikasi
│   ├── env.ts                         # Runtime environment validation
│   └── site.ts                        # Konfigurasi meta/SEO
├── styles/
│   └── tokens.css                     # Design tokens (warna, radius, transisi)
├── supabase/
│   └── schema.sql                     # Skema SQL PostgreSQL & tabel audit
└── tailwind.config.ts                 # Konfigurasi Tailwind dengan token editorial
```

---

## 4. Keamanan & Kebijakan Data

1. **Prinsip Least Privilege**: Kunci anon publik Supabase hanya memiliki hak *SELECT* untuk data publik. Operasi mutasi (*INSERT*, *UPDATE*, *DELETE*) hanya dapat dieksekusi melalui Server Actions yang memverifikasi sesi admin yang sah.
2. **Perlindungan Brute-Force**: Modul `rateLimit.ts` mencatat percobaan gagal berdasarkan identifier sesi/IP. Tiga kegagalan berturut-turut memicu penguncian terminal (*lockout*) selama 300 detik (5 menit).
3. **In-Memory & Storage Fallback**: Jika koneksi Supabase belum dikonfigurasi pada lingkungan lokal, sistem secara mulus menggunakan data fallback dari `mockData.ts` sehingga portofolio tetap dapat ditampilkan dan diuji secara sempurna.

---

## 5. Aksesibilitas & Performa

- **Zero Heavy WebGL Overhead**: Pengalihan dari 3D Three.js ke layout editorial murni mereduksi ukuran bundle JavaScript awal dari ~400 kB menjadi hanya 87 kB, meningkatkan First Load JS dan Core Web Vitals.
- **Rasio Kontras WCAG AA**: Seluruh warna teks terhadap latar belakang telah divalidasi memiliki rasio kontras di atas 4.5:1 untuk keterbacaan optimal bagi seluruh pengguna.
