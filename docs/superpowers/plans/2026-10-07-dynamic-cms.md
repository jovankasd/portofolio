# Dynamic CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mentransisikan portofolio statis menjadi dinamis penuh melalui panel admin yang memungkinkan perubahan teks, gambar (Foto Profil), dan PDF (CV) dengan Supabase dan Next.js Server Components.

**Architecture:** Memperluas tabel `site_settings` untuk pengaturan teks footer & CV, serta menambahkan tabel `pages` untuk mengatur metadata/konten per slug halaman. Admin panel (Client Components) menggunakan Server Actions dengan validasi ketat dan otorisasi sesi admin untuk memutasi data. Publik memanggil data via SSR di Server Components dengan graceful fallbacks.

**Tech Stack:** Next.js (App Router), Supabase (Database & Storage), TypeScript, React, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-10-07-dynamic-cms-design.md`

## Global Constraints

- File CV divalidasi wajib berekstensi PDF dan maksimal 5MB.
- Foto profil divalidasi dengan format JPG/PNG/WebP dan maksimal 5MB.
- Pengecekan ukuran dan tipe dilakukan ganda (UI front-end dan saat dieksekusi server action).
- Fitur *upload* ke storage dan modifikasi tabel wajib dilindungi `verifyAdminSession()`.
- Semua data komponen front-end (publik) menangani kondisi *null* menggunakan *graceful fallback* (seperti `|| "Nilai Default"`).

## Review Focus

- **File CV melebihi 5MB atau format selain PDF:** Expectation: Di frontend ditolak, jika lolos, di Server Action gagal dilempar pesan error, UI menolak menyimpan.
  - Test: Di Task 2 (`tests/backend/actions.test.ts`), `validateFile` test case reject invalid files.
- **Data admin dikosongkan secara tak sengaja:** Expectation: Website publik tidak *crash*, UI *fallback* statis langsung tampil.
  - Test: Di Task 4 (`tests/frontend/homepage.test.tsx`), pass `null` ke `HeroSection` test.
- **Tindakan Admin oleh non-Admin (Anonim):** Expectation: Endpoints di server actions menolak query, table page tidak berubah.
  - Test: Di Task 2 (`tests/backend/actions.test.ts`), invoke server action updatePage tanpa auth session admin.
- **Duplikasi file sampah akibat upload ganda:** Expectation: Path upload akan menimpa (overwrite) atau menghapus file lama di Supabase storage.
  - Test: Di Task 2, pengecekan opsi `upsert: true` di Storage Action.

---

### Task 1: Supabase Database Schema Migration

**Files:**
- Modify: `supabase/schema.sql`
- Modify: `server/db/types.ts`
- Test: `tests/backend/db.test.ts`

**Interfaces:**
- Consumes: Konfigurasi eksisting Supabase.
- Produces: Definisi tabel `pages`, penambahan kolom `footer_text` ke `site_settings`, dan `PageRow` interface di Typescript.

- [ ] **Step 1: Write the failing test**

```typescript
import { test, expect } from 'vitest';
import { supabase } from '@/server/db/client';

test('Database has pages table and footer_text in site_settings', async () => {
  const { error: pageErr } = await supabase.from('pages').select('id').limit(1);
  expect(pageErr).toBeNull();
  
  const { error: siteErr } = await supabase.from('site_settings').select('footer_text').limit(1);
  expect(siteErr).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest tests/backend/db.test.ts`
Expected: FAIL with missing relations atau missing columns.

- [ ] **Step 3: Implement Schema & TypeScript Types**

Modify `supabase/schema.sql`: 
Pastikan block SQL untuk membuat tabel `pages` lengkap dengan `slug`, `title`, `content`, `metadata` (jsonb), dan `is_published` diinisialisasi beserta RLS read untuk publik.
Tambahkan `ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_text text;`.
Pastikan bucket `portfolio-assets` dibuat.

Modify `server/db/types.ts`:
Tambahkan `export interface PageRow { ... }` dan perbarui properti `SiteSettingsRow` menambahkan `footer_text?: string`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest tests/backend/db.test.ts` (setelah sinkronisasi skema ke Supabase dev).
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/schema.sql server/db/types.ts tests/backend/db.test.ts
git commit -m "feat(db): add pages table and site_settings footer_text"
```

### Task 2: Server Actions & Validation (Storage & Database)

**Files:**
- Modify: `server/services/validation.ts`
- Modify: `server/actions/storage.actions.ts`
- Modify: `server/actions/pages.actions.ts`
- Modify: `server/actions/site_settings.actions.ts`
- Test: `tests/backend/actions.test.ts`

**Interfaces:**
- Consumes: Konfigurasi schema database dan session auth admin.
- Produces: API (Server Actions) mutasi seperti `updatePage(slug, data)`, `updateSiteSettings(data)`, dan validasi input `validateFile(file, type)`.

- [ ] **Step 1: Write the failing tests**

```typescript
import { test, expect } from 'vitest';
import { validateFile } from '@/server/services/validation';
import { updatePage } from '@/server/actions/pages.actions';

test('validateFile rejects invalid size', () => {
  const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "cv.pdf", { type: "application/pdf" });
  expect(() => validateFile(largeFile, 'document')).toThrow();
});

test('updatePage blocks unauthorized access', async () => {
  await expect(updatePage('beranda', { title: "Test", metadata: {}, is_published: true, content: null })).rejects.toThrow();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest tests/backend/actions.test.ts`
Expected: FAIL 

- [ ] **Step 3: Implement Server Actions and Validation**

Modify `server/services/validation.ts`: Implementasi fungsi untuk memvalidasi ekstensi (PDF/JPG/PNG/WEBP) dan cek max 5MB size limit.
Modify `server/actions/storage.actions.ts`: Fungsi upload file (asset CV dan foto) dengan opsional update/upsert agar menimpa file lama. Gunakan `verifyAdminSession()`. Panggil validasi file.
Modify `server/actions/pages.actions.ts` dan `site_settings.actions.ts`: Terapkan proteksi `verifyAdminSession()` di setiap fungsi update, lalu lakukan update Supabase row terkait.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest tests/backend/actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/services/validation.ts server/actions/ tests/backend/actions.test.ts
git commit -m "feat(backend): implement admin-secured storage and db update actions"
```

### Task 3: Admin UI - Edit Forms

**Files:**
- Modify: `components/admin/SiteSettingsForm.tsx`
- Modify: `components/admin/PageForm.tsx`
- Test: `tests/frontend/admin.test.tsx`

**Interfaces:**
- Consumes: Server Actions `updatePage`, `updateSiteSettings`, dan state internal form dari komponen admin induk.
- Produces: Antarmuka UI yang bisa digunakan admin dengan field yang lengkap, serta pesan error feedback (validasi ganda UI).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

test('SiteSettingsForm includes footer_text text input and CV File Upload field', () => {
  render(<SiteSettingsForm settings={{}} onSubmit={vi.fn()} isPending={false} />);
  expect(screen.getByLabelText(/Teks Footer/i)).toBeDefined();
  expect(screen.getByLabelText(/Unggah CV/i)).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest tests/frontend/admin.test.tsx`
Expected: FAIL, missing inputs di layar.

- [ ] **Step 3: Implement Frontend Admin Forms**

Modify `components/admin/SiteSettingsForm.tsx`: Implementasi input `footer_text` dan integrasikan komponen file upload (`AssetUploadField` jika ada atau native `<input type="file">`) untuk handle PDF CV upload, include client-side validation <= 5MB.
Modify `components/admin/PageForm.tsx`: Map object `metadata` JSON kedalam form field khusus slug `beranda` (seperti nama, deskripsi, foto url dengan upload handler gambar), serta text editor `content` standar.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest tests/frontend/admin.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/admin/ tests/frontend/admin.test.tsx
git commit -m "feat(admin): design settings and page editor forms with local validation"
```

### Task 4: Public Views & SSR Hydration

**Files:**
- Modify: `server/db/queries.ts`
- Modify: `app/page.tsx`
- Modify: `components/ui/HeroSection.tsx`
- Modify: `app/tentang/page.tsx`
- Modify: `components/ui/Footer.tsx`
- Test: `tests/frontend/homepage.test.tsx`

**Interfaces:**
- Consumes: Table `pages` dan tabel `site_settings` via query.
- Produces: Komponen final yang di-render secara dinamis di klien sesuai data admin.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import HeroSection from '@/components/ui/HeroSection';

test('HeroSection gracefully falls back if page metadata is completely empty/null', () => {
  render(<HeroSection metadata={null} />);
  // Verifikasi fallback "Nama Saya" exists to prove graceful degradation
  expect(screen.getByText(/Nama Saya/i)).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest tests/frontend/homepage.test.tsx`
Expected: FAIL, error null reference.

- [ ] **Step 3: Implement Graceful Hydration in Views**

Modify `server/db/queries.ts`: Tambah atau lengkapi ekspor async function `getPageBySlug(slug: string)` dan sesuaikan return fields.
Modify `app/page.tsx`, `app/tentang/page.tsx`: Fetch SSR di layout/page. Arahkan data ke props children component.
Modify `components/ui/HeroSection.tsx` & `components/ui/Footer.tsx`: Aplikasikan pola logical OR (`|| "Default value"`) di seluruh variabel yang bersumber dari props Supabase untuk menjamin 0 downtime error saat field admin tak sengaja dikosongkan.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest tests/frontend/homepage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/db/queries.ts app/ components/ui/ tests/frontend/homepage.test.tsx
git commit -m "feat(public): inject dynamic CMS payload with bulletproof fallback states"
```
