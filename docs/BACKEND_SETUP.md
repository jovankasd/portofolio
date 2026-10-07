# Panduan Setup Backend — Obsidian & Atmosphere

## Langkah 1: Buat Project Supabase

1. Buka **[supabase.com](https://supabase.com)** → Sign in / Sign up
2. Klik **New Project**
3. Isi nama project (misal: `obsidian-atmosphere`) dan buat database password yang kuat
4. Pilih region terdekat (Singapore untuk Indonesia)
5. Klik **Create new project** dan tunggu ~2 menit

---

## Langkah 2: Jalankan SQL Migration

1. Di Supabase Dashboard → klik **SQL Editor** (ikon terminal di sidebar kiri)
2. Klik **New query**
3. Copy-paste seluruh isi file `supabase/schema.sql`
4. Klik **Run** (Ctrl+Enter)

Ini akan membuat semua tabel, mengaktifkan RLS, dan memasukkan data sample.

---

## Langkah 3: Buat Storage Bucket

1. Di Supabase Dashboard → **Storage** → **New bucket**
2. Nama bucket: `portfolio-assets`
3. Centang **Public bucket** (agar URL gambar bisa diakses langsung)
4. Klik **Create bucket**

---

## Langkah 4: Ambil API Keys

Di Supabase Dashboard → **Project Settings** → **API**:

| Key | Lokasi | Digunakan untuk |
|---|---|---|
| `Project URL` | API Settings | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon public` | Project API keys | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` | Project API keys (scroll ke bawah) | `SUPABASE_SERVICE_ROLE_KEY` |

---

## Langkah 5: Generate Admin Credentials

### A. Generate Bcrypt Hash untuk Master Key

Buka terminal di folder proyek:

```bash
node -e "const b=require('bcryptjs'); b.hash('GANTI_DENGAN_PASSWORD_ANDA', 12).then(h => console.log('HASH:', h))"
```

Salin output hash (dimulai dengan `$2b$12$...`).

### B. Generate Session Secret (32 karakter acak)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Langkah 6: Buat File `.env.local`

Salin `.env.local.example` menjadi `.env.local` dan isi nilainya:

```bash
copy .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_MASTER_KEY_HASH=$2b$12$...hash-dari-langkah-5A...
ADMIN_SESSION_SECRET=...hex-dari-langkah-5B...
```

---

## Langkah 7: Test Login

1. Jalankan `npm run dev`
2. Buka `http://localhost:3000/dossier-control`
3. Ketik password yang Anda hash di langkah 5A
4. Jika berhasil, akan diarahkan ke `/dossier-control/dashboard`

> **Di Development (tanpa `.env.local`):** Gunakan demo key `obsidian-master-2026` untuk test tanpa Supabase.

---

## Arsitektur Keamanan yang Sudah Diimplementasi

| Lapisan | Implementasi |
|---|---|
| Password | Bcrypt hash + constant-time compare (anti timing attack) |
| Session | iron-session: HttpOnly + Secure + SameSite=Strict cookie, TTL 2 jam |
| Middleware | Rewrite ke 404 — URL tetap sama, tidak ada redirect yang membocorkan rute |
| Rate limit server | Tersimpan di `admin_audit_log` Supabase — tidak bisa di-bypass via incognito |
| Supabase RLS | Anon key hanya bisa SELECT; mutasi wajib lewat service role di server |
| Secret exposure | Tidak ada env var sensitif dengan prefix `NEXT_PUBLIC_` |

---

## Troubleshooting

**"Missing Supabase server env vars"** — Pastikan `.env.local` ada dan sudah diisi dengan benar. Restart dev server setelah mengubah env vars.

**Login selalu gagal di dev** — Pastikan `ADMIN_MASTER_KEY_HASH` tidak diset (maka dev fallback aktif dengan key `obsidian-master-2026`), ATAU hash sudah benar.

**Dashboard menampilkan data kosong** — Pastikan SQL migration sudah dijalankan dan data sample ada di Supabase.
