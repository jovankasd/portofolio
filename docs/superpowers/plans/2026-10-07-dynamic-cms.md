# Dynamic CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mentransisi website portofolio dari konten statis menjadi CMS dinamis untuk mengatur semua halaman dan pengaturan global melalui panel admin.

**Architecture:** Memperluas tabel `site_settings` untuk footer, membuat tabel `pages` dengan kolom `metadata` (JSONB) untuk tata letak halaman spesifik, dan menggunakan Supabase Storage untuk mengunggah CV (PDF) serta foto profil.

**Tech Stack:** Next.js (App Router), Supabase (PostgreSQL, Storage), TypeScript.

**Spec:** `docs/superpowers/specs/2026-10-07-dynamic-cms-design.md`

## Global Constraints

- Validasi file CV wajib berekstensi PDF dengan ukuran maksimal 5MB.
- Validasi file Foto profil wajib berekstensi JPG/PNG/WebP dengan ukuran maksimal 5MB.
- Harus terdapat nilai *fallback default* pada front-end saat data kosong/null (misal: `hero_name || "Nama Saya"`).
- Fitur *upload* file ke *storage* dan modifikasi tabel dilindungi dengan `verifyAdminSession()`.

## Review Focus

- File yang diupload gagal namun form admin tetap sukses.
  - Test: Di dalam `tests/admin/storage.actions.test.ts`, buat fungsi storage throw error, dan pastikan action `uploadAsset` mengembalikan `{ error: ... }`.
- Halaman pengunjung *crash* saat `metadata` kosong.
  - Test: Di `tests/frontend/page.test.tsx`, render halaman Beranda dengan mock `getPageBySlug` me-return `metadata: null`. Pastikan render tidak melempar error dan menampilkan fallback.
- Server Action dipanggil tanpa sesi admin.
  - Test: Di `tests/admin/pages.actions.test.ts`, panggil `updatePageAction` tanpa mock session. Pastikan throw `Unauthorized`.
- Ekstensi file `.exe` yang disamarkan menjadi `.pdf`.
  - Test: Di `tests/admin/storage.actions.test.ts`, upload file dengan mime type `application/x-msdownload`, pastikan ditolak.
- Data Supabase dibaca oleh publik saat `is_published = false`.
  - Test: Coba fetch langsung ke Supabase API tanpa key admin untuk row yang disembunyikan.

---

### Task 1: Pembaruan Skema Database & Storage

**Files:**
- Modify: `supabase/schema.sql`
- Create: `tests/db/schema.test.ts` (Opsional untuk integrasi)

**Interfaces:**
- Consumes: Koneksi ke Supabase lokal/produksi.
- Produces: Tabel `pages`, penambahan kolom `footer_text` di `site_settings`.

- [ ] **Step 1: Write the failing test**
```typescript
// tests/db/schema.test.ts
import { supabase } from '@/server/db/client';

test('tabel pages ada dan site_settings memiliki footer_text', async () => {
    const { error: pagesErr } = await supabase.from('pages').select('id').limit(1);
    const { error: settingsErr } = await supabase.from('site_settings').select('footer_text').limit(1);
    
    expect(pagesErr?.message).not.toContain('does not exist');
    expect(settingsErr?.message).not.toContain('does not exist');
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/db/schema.test.ts`
Expected: FAIL dengan pesan "relation public.pages does not exist".

- [ ] **Step 3: Implement SQL Schema di `supabase/schema.sql`**
Tambahkan `create table if not exists public.pages (id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, content text, metadata jsonb default '{}'::jsonb, is_published boolean default true, created_at timestamptz default now(), updated_at timestamptz default now());`. Aktifkan RLS dan buat policy baca publik untuk `is_published = true`. Tambahkan `alter table public.site_settings add column if not exists footer_text text;`. Lalu jalankan migrasi/script ini ke Supabase.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/db/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add supabase/schema.sql tests/db/schema.test.ts
git commit -m "feat: setup pages table and expand site_settings schema"
```

### Task 2: Server Actions & Queries (Pages & Storage)

**Files:**
- Modify: `server/db/types.ts`
- Modify: `server/db/queries.ts`
- Create: `server/actions/pages.actions.ts`
- Create: `server/actions/storage.actions.ts`
- Create: `tests/server/actions.test.ts`

**Interfaces:**
- Consumes: `verifyAdminSession()` dari `server/auth/session.ts`, tabel `pages` dari Task 1.
- Produces: `getPageBySlug(slug: string)`, `updatePageAction(slug: string, data: any)`, `uploadAsset(file: File, folder: string) -> string`

- [ ] **Step 1: Write the failing test**
```typescript
// tests/server/actions.test.ts
import { getPageBySlug } from '@/server/db/queries';

test('getPageBySlug mengembalikan data null untuk slug tidak valid', async () => {
    const data = await getPageBySlug('invalid-slug');
    expect(data).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/server/actions.test.ts`
Expected: FAIL (getPageBySlug is not defined).

- [ ] **Step 3: Implement `getPageBySlug`, `updatePageAction`, dan `uploadAsset`**
Di `types.ts`, tambahkan interface `Page`. 
Di `queries.ts`, implementasikan `getPageBySlug` menggunakan `supabase.from('pages').select('*').eq('slug', slug).single()`.
Di `pages.actions.ts`, periksa `verifyAdminSession()`, lalu jalankan update.
Di `storage.actions.ts`, periksa sesi, validasi ekstensi PDF/Gambar dan batas 5MB, lalu jalankan `supabase.storage.from('portfolio-assets').upload(...)` dengan opsi `upsert: true`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/server/actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add server/db/types.ts server/db/queries.ts server/actions/pages.actions.ts server/actions/storage.actions.ts tests/server/actions.test.ts
git commit -m "feat: implement database queries and protected server actions for pages and storage"
```

### Task 3: Antarmuka Admin (DashboardClient)

**Files:**
- Modify: `components/admin/DashboardClient.tsx`
- Create: `components/admin/PageForm.tsx`

**Interfaces:**
- Consumes: `updatePageAction` dan `uploadAsset` (dari Task 2).
- Produces: UI interaktif dengan tab "Halaman Situs" untuk mengedit metadata Beranda dan isi konten Tentang, serta komponen unggah CV di tab "Pengaturan Situs".

- [ ] **Step 1: Write the failing test**
```typescript
// tests/components/DashboardClient.test.tsx
import { render, screen } from '@testing-library/react';
import DashboardClient from '@/components/admin/DashboardClient';

test('terdapat tab Halaman Situs', () => {
    render(<DashboardClient initialProjects={[]} initialCredentials={[]} initialSettings={{} as any} initialPages={[]} />);
    expect(screen.getByText(/Halaman Situs/i)).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/components/DashboardClient.test.tsx`
Expected: FAIL (tidak menemukan text "Halaman Situs" atau property initialPages tidak ada).

- [ ] **Step 3: Implementasi UI Form di `DashboardClient.tsx` dan `PageForm.tsx`**
Perbarui `DashboardClient.tsx` untuk menerima prop `initialPages: Page[]`. Tambahkan tab "pages" (Halaman Situs) di samping "settings" (Pengaturan Situs). 
Saat tab "pages" aktif, tampilkan list halaman. Jika diklik, tampilkan `PageForm.tsx`.
Di dalam form Pengaturan Situs, tambahkan `<input type="file" />` untuk mengunggah CV menggunakan `uploadAsset`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/components/DashboardClient.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add components/admin/DashboardClient.tsx components/admin/PageForm.tsx tests/components/DashboardClient.test.tsx
git commit -m "feat: add pages management and file upload UI to admin dashboard"
```

### Task 4: Integrasi Data Halaman Publik

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/tentang/page.tsx`
- Modify: `app/admin/dashboard/page.tsx`

**Interfaces:**
- Consumes: `getPageBySlug` (Task 2).
- Produces: Rendering halaman publik dinamis menggunakan fallback data.

- [ ] **Step 1: Write the failing test**
```typescript
// tests/frontend/homepage.test.tsx
import { render } from '@testing-library/react';
import HomePage from '@/app/page';

test('homepage menggunakan fallback jika metadata kosong', async () => {
    // Render RSC is complex in vitest, mock getPageBySlug internally or check via e2e
    const { getByText } = render(await HomePage());
    expect(getByText('Nama Bawaan')).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/frontend/homepage.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementasi fetcher di Halaman Publik**
Di `app/admin/dashboard/page.tsx`, tambahkan pemanggilan `getAllPages()` dan masukkan ke `initialPages` milik `DashboardClient`.
Di `app/page.tsx`, panggil `const page = await getPageBySlug('beranda')`. Gunakan `page?.metadata?.hero_name || "Nama Anda"`, `page?.metadata?.hero_description || "..."`, dst. untuk merender UI. Lakukan hal yang sama untuk `app/tentang/page.tsx`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/frontend/homepage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add app/page.tsx app/tentang/page.tsx app/admin/dashboard/page.tsx tests/frontend/homepage.test.tsx
git commit -m "feat: hydrate public pages with dynamic cms data"
```
