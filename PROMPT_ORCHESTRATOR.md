# AI Prompt Orchestrator (PROMPT_ORCHESTRATOR.md)
## Strategi: The Hybrid Fusion

---

## 0. Filosofi Strategi
Tidak semua model AI unggul di area yang sama. Model dengan kekuatan visual-spasial (Gemini/Codex) lebih andal untuk kode kreatif berat-render (Three.js, animasi, tata letak UI). Model dengan penalaran logis-terstruktur (Claude) lebih andal untuk logika keamanan, state machine, dan arsitektur backend yang butuh presisi & kehati-hatian. Sebagai **AI Orchestrator**, tugas Anda bukan menulis semua kode sendiri, melainkan **mengorkestrasi model yang tepat untuk pekerjaan yang tepat**, lalu meninjau dan menyatukan hasilnya — ini sekaligus menjadi bukti hidup (dogfooding) dari persona yang ditampilkan portofolio ini sendiri.

---

## 1. Context Primer (Wajib Ditempel di Setiap Sesi Baru)
Sebelum memberi instruksi spesifik ke model manapun, tempel dahulu blok konteks berikut agar semua model bekerja dengan asumsi yang sama:

> "Konteks proyek: Next.js 14 (App Router) + TypeScript strict + Tailwind CSS + React Three Fiber + Supabase. Palet warna: latar `#0A0D14`, kartu kaca `rgba(18,24,38,0.65)` dengan blur 16px, border `rgba(255,255,255,0.08)`, aksen cyan `#38BDF8`, status online hijau `#22C55E`. Font: Inter untuk teks, JetBrains Mono untuk elemen terminal. Tidak ada efek suara sama sekali. Semua komponen ditulis sebagai fungsi TypeScript strict (tanpa `any`), gunakan Tailwind saja untuk styling (tanpa CSS-in-JS), dan selalu keluarkan file lengkap — bukan potongan diff."

---

## 2. Tahap 0: Scaffolding & Setup
*Instruksi Inisialisasi Proyek (model apa saja):*
> "Buatkan perintah setup awal proyek Next.js 14 App Router dengan TypeScript, Tailwind CSS, dan struktur folder berikut: `app/`, `components/3d/`, `components/ui/`, `components/admin/`, `lib/supabase/`, `lib/auth/`, `middleware.ts`. Sertakan instalasi `@react-three/fiber`, `@react-three/drei`, `@supabase/supabase-js`, dan `three`."

---

## 3. Tahap 1: Eksekusi Visual & 3D (Gunakan Gemini / Codex)

**Prompt A — Hero Scene 3D:**
> "Buatkan komponen React Three Fiber Next.js `HeroCanvas3D.tsx` dengan latar belakang `#0A0D14`. Buat tebing hitam geometris sederhana (low-poly, bukan realistis) di bawah, dan siluet karakter menghadap horizon berkabut. Gunakan `THREE.FogExp2` untuk kabut volumetrik dengan densitas rendah. Implementasikan scroll-bound camera: pada 0–30% scroll, kamera dolly-in menembus kabut melewati siluet lalu mendarat di latar polos. Optimalkan agar tetap 60 FPS tanpa audio apa pun. Sertakan fallback statis jika `prefers-reduced-motion` aktif."

**Prompt B — Camera Rig Terpisah (untuk modularitas):**
> "Pisahkan logika kamera dari Prompt A menjadi `CameraRig.tsx` yang menerima `scrollProgress` (0–1) sebagai prop dan menginterpolasi posisi/rotasi/FOV kamera sesuai storyboard: 0% wide shot, 30% dolly selesai & fog menipis, 60–100% hanya parallax mikro. Gunakan `useFrame` dengan lerp halus, bukan perubahan posisi instan."

**Prompt C — Project Card Interaktif:**
> "Buat komponen `ProjectCard.tsx` pakai Tailwind CSS. Desain: dark frosted glass (`rgba(18,24,38,0.65)`, blur 16px, border putih opacity 8%). Saat di-hover, kartu tilt 3D halus (maksimum ±8 derajat) mengikuti posisi kursor, dan muncul overlay dengan 2 tombol aksi: `[Lihat Projek]` & `[GitHub]`. Untuk mobile, overlay muncul saat tap pertama. Sertakan skeleton loading state dan empty state bertuliskan `SIGNAL LOST — NO PROJECTS DEPLOYED`."

**Prompt D — Certificate Modal:**
> "Buat komponen `CredentialModal.tsx` yang muncul dengan animasi fade-in 0.2 detik saat kartu sertifikat diklik. Latar belakang layar menjadi hitam 85% opacity dengan blur. Tampilkan gambar sertifikat resolusi penuh, foto bukti/lomba (opsional), metadata issuer & tanggal, serta tombol tautan verifikasi eksternal. Modal harus bisa ditutup dengan klik luar, tombol close, atau tombol Esc."

**Prompt E — Cyber Macro Bar:**
> "Buat komponen `CyberMacroBar.tsx` untuk mobile: bilah 4 tombol (`AUTH`, `PASTE-KEY`, `EXEC`, `CLS`) yang menempel tepat di atas keyboard virtual HP, hanya tampil di route `/dossier-control`. Setiap tombol menyala cyan halus saat disentuh (active state) dan kembali redup saat dilepas. Pastikan tidak menutupi input field aktif."

**Prompt F — Fallback Non-3D / Low-End Device:**
> "Buat varian ringan dari `HeroCanvas3D` bernama `HeroFallbackStatic.tsx` berupa gambar/CSS gradient statis dengan nuansa visual serupa (siluet + kabut + horizon gelap), dipakai saat WebGL tidak didukung atau `navigator.hardwareConcurrency` menunjukkan perangkat low-end."

---

## 4. Tahap 2: Eksekusi Logika & Backend (Gunakan Claude)

**Prompt A — Terminal Shell (Login UI):**
> "Buat antarmuka terminal `TerminalShell.tsx` untuk login admin. Tampilan monokrom hitam dengan teks JetBrains Mono warna `#38BDF8`. Pengguna mengetik `auth --key [SANDI]`. Tambahkan state machine: idle → typing → verifying → success/fail. Jika gagal 3 kali berturut-turut, bekukan form 5 menit dengan countdown visual `[LOCKED — RETRY IN 04:59]`. Jangan simpan sandi di state React lebih lama dari yang diperlukan."

**Prompt B — Middleware Keamanan (Stealth Guard):**
> "Buat `middleware.ts` Next.js. Lindungi seluruh path `/dossier-control/*`. Verifikasi cookie sesi yang ditandatangani (bukan sekadar keberadaan cookie). Jika tidak ada sesi sah, jangan render error 401 atau redirect — gunakan `NextResponse.rewrite()` ke halaman 404 asli agar URL di address bar tidak berubah dan tidak ada indikasi rute admin ini ada. Sertakan komentar yang menjelaskan kenapa rewrite dipilih dibanding redirect."

**Prompt C — Skema & RLS Supabase:**
> "Buatkan skema SQL Supabase untuk tabel `projects`, `credentials`, `messages`, dan `admin_audit_log` sesuai struktur berikut: [tempel struktur kolom dari ARCHITECTURE.md §4]. Sertakan Row-Level Security: publik hanya boleh SELECT pada `projects` dan `credentials`, tanpa akses sama sekali ke `messages` dan `admin_audit_log`. Seluruh INSERT/UPDATE/DELETE hanya lewat service role."

**Prompt D — Server Actions CRUD:**
> "Buat Server Actions di `app/dossier-control/actions.ts` untuk create/update/delete pada tabel `projects` dan `credentials` menggunakan Supabase service role client dari `lib/supabase/server.ts`. Validasi bahwa sesi admin valid di awal setiap action sebelum mutasi apa pun dijalankan. Panggil `revalidatePath('/')` setelah mutasi sukses."

**Prompt E — Rate Limiting Dua Lapis:**
> "Buat `lib/auth/rateLimit.ts` yang mengimplementasikan rate limit sisi server (bukan hanya `localStorage`): simpan percobaan gagal berdasarkan IP address, maksimum 5 kegagalan dalam 15 menit lalu kunci 10 menit. Gunakan tabel `admin_audit_log` di Supabase sebagai penyimpanan (atau Upstash Redis bila tersedia). Sertakan fungsi `constantTimeCompare` untuk mencegah timing attack saat verifikasi key."

**Prompt F — Formulir Kontak:**
> "Buat Server Action `submitContactMessage` yang menyimpan `name`, `email`, `message` ke tabel `messages`, dengan validasi input dasar dan rate limit sederhana per IP untuk mencegah spam."

---

## 5. Tahap 3: Integrasi, Optimisasi & QA

**Prompt Integrasi:**
> "Integrasikan `HeroCanvas3D` ke dalam `app/page.tsx` menggunakan `next/dynamic` dengan `ssr: false`, tampilkan placeholder gradient CSS ringan selagi kanvas 3D dimuat."

**Prompt Audit Performa:**
> "Tinjau seluruh komponen di `components/3d/` dan sarankan optimasi bundle size, code-splitting, serta potensi memory leak dari geometri/material Three.js yang tidak di-dispose saat unmount."

**Prompt Audit Aksesibilitas:**
> "Tinjau seluruh halaman publik untuk kepatuhan `prefers-reduced-motion`, kontras warna WCAG AA, dan navigasi keyboard penuh (termasuk modal dan kartu proyek)."

**Prompt Audit Keamanan (Klaude khusus):**
> "Tinjau end-to-end alur `middleware.ts` + `TerminalShell.tsx` + Server Action `authenticateAdmin` untuk celah keamanan: kebocoran timing, kemungkinan bypass rewrite 404, penyimpanan secret yang tidak aman, dan potensi CSRF."

---

## 6. Tahap 4: Konten, SEO & Persiapan Rilis

**Prompt SEO & Metadata:**
> "Buat metadata dinamis (`generateMetadata`) untuk `app/page.tsx` termasuk Open Graph image, serta file `sitemap.xml` dan `robots.txt` untuk proyek Next.js App Router ini."

**Prompt Seed Data:**
> "Buat skrip seed data untuk Supabase yang mengisi 3 contoh proyek dan 2 contoh kredensial ke tabel `projects` dan `credentials`, agar development lokal punya data untuk diuji tanpa harus mengisi manual lewat dashboard admin."

---

## 7. Prompt Engineering Best Practices untuk Proyek Ini
- Selalu tempel **Context Primer** (§1) di awal sesi baru, apa pun model yang dipakai.
- Selalu minta **file lengkap**, bukan potongan diff — memudahkan review dan copy-paste langsung.
- Selalu sebutkan batasan eksplisit yang mudah dilupakan model: **tanpa audio**, **TypeScript strict**, **hanya Tailwind**, **60 FPS budget**.
- Bangun komponen 3D **satu per satu** (Scene → Camera → integrasi), jangan minta "buat semua sekaligus" — lebih mudah di-debug.
- Untuk kode yang menyentuh keamanan (middleware, auth, rate limit), **selalu minta model menjelaskan alasan** di balik setiap keputusan (mis. kenapa rewrite bukan redirect) — ini membantu proses review Anda sebagai orchestrator.
- Setelah menerima kode dari model visual (Gemini/Codex), lakukan **review manual singkat** untuk memori leak Three.js (`geometry.dispose()`, `material.dispose()`) sebelum integrasi.

---

## 8. Alur Kerja Orkestrasi (Ringkas)
```
Ide/Requirement (PRD.md)
        │
        ▼
Tempel Context Primer (§1)
        │
        ├──► Kebutuhan Visual/3D ──► Gemini / Codex ──► Review Human ─┐
        │                                                              │
        └──► Kebutuhan Logika/Keamanan ──► Claude ──► Review Human ──┤
                                                                       ▼
                                                              Integrasi ke Repo
                                                                       │
                                                                       ▼
                                                              Testing (ARCHITECTURE.md §11)
                                                                       │
                                                                       ▼
                                                                  Iterasi / Rilis
```

---

## 9. Template Tracking Prompt
| Prompt ID | Tahap | Model | Status | File Output | Catatan |
|---|---|---|---|---|---|
| V-01 | Visual | Gemini | ☐ Belum / ☐ Selesai | `HeroCanvas3D.tsx` | |
| V-02 | Visual | Gemini | ☐ Belum / ☐ Selesai | `CameraRig.tsx` | |
| V-03 | Visual | Gemini | ☐ Belum / ☐ Selesai | `ProjectCard.tsx` | |
| L-01 | Logika | Claude | ☐ Belum / ☐ Selesai | `TerminalShell.tsx` | |
| L-02 | Logika | Claude | ☐ Belum / ☐ Selesai | `middleware.ts` | |
| L-03 | Logika | Claude | ☐ Belum / ☐ Selesai | `rateLimit.ts` | |

*(Salin baris sesuai kebutuhan untuk setiap prompt baru yang dijalankan.)*
