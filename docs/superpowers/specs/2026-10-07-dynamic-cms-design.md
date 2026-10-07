# Spesifikasi Desain: CMS Portofolio Dinamis (Halaman & Pengaturan Global)

## 1. Tujuan (Purpose)
Mentransisi website portofolio dari konten statis (*hardcoded*) menjadi dinamis sepenuhnya melalui panel admin buatan sendiri. Administrator harus dapat mengubah teks, gambar, pengaturan elemen global (seperti footer), dan memperbarui file CV secara langsung tanpa perlu melakukan modifikasi kode.

## 2. Arsitektur & Database
Fitur ini bertumpu pada Supabase sebagai database relasional dan penyimpanan file (storage), serta Next.js App Router (Server Components) untuk pengambilan data.

### 2.1 Perluasan `site_settings`
Tabel `site_settings` (singleton, `id = 1`) akan diperluas untuk menyimpan konfigurasi global situs:
- `footer_text` (text): Menyimpan teks hak cipta atau teks global footer.
- `cv_url` (text): (Sudah ada) Akan diperbarui alurnya agar mendukung fitur unggah (upload) PDF langsung via panel admin.

### 2.2 Tabel Baru: `pages`
Tabel baru bernama `pages` akan dibuat untuk menyimpan konten halaman dinamis dan statis.
**Kolom:**
- `id` (uuid, primary key)
- `slug` (text, unique): URL halaman (contoh: `beranda`, `tentang`).
- `title` (text): Judul halaman.
- `content` (text): Konten teks panjang (Markdown/HTML) untuk halaman yang lebih naratif seperti "Tentang".
- `metadata` (jsonb): Menyimpan struktur data spesifik untuk komponen khusus. Contoh `slug='beranda'` metadata: `{ "hero_name": "...", "hero_description": "...", "profile_photo_url": "..." }`.
- `is_published` (boolean): Default `true`.
- `created_at` (timestamptz): Timestamp pembuatan.
- `updated_at` (timestamptz): Timestamp pembaruan terakhir.

### 2.3 Supabase Storage
- Bucket `portfolio-assets` akan digunakan untuk menyimpan unggahan PDF (CV) dan gambar (Foto Profil).
- Pengunggahan file dari panel admin akan menimpa file lama (atau menggunakan mekanisme URL/nama file yang diperbarui) untuk memastikan file sampah tidak menumpuk.

## 3. Komponen & Alur Data (Data Flow)

### 3.1 Sisi Publik (Client & Server Components)
- **Data Fetching:** Halaman-halaman publik (`app/page.tsx`, `app/tentang/page.tsx`) dan elemen global (Footer) akan memanggil fungsi pengambilan data (seperti `getSiteSettings()` dan `getPageBySlug('slug_name')`) pada tahap *Server-Side Rendering*.
- **Rendering:** Data tersebut dimasukkan sebagai *props* agar teks/gambar tampil sesuai konfigurasi terbaru dari database.

### 3.2 Sisi Panel Admin (`DashboardClient.tsx`)
- **Tab Halaman Situs:** Menampilkan daftar *slug* yang tersedia (Beranda, Tentang). Memilih salah satu akan memunculkan *form* dinamis. (Khusus *slug* 'beranda', *form* akan menampilkan input `metadata` seperti Nama, Foto, dan Deskripsi).
- **Tab Pengaturan Situs:** Ditambahkan input teks untuk *Footer* dan komponen khusus *File Input* (dengan indikator *loading*) untuk memperbarui file PDF CV.

## 4. Keamanan & Penanganan Eror (Error Handling)
1. **Validasi File (Storage):**
   - File CV divalidasi dengan wajib berekstensi PDF dan ukuran maksimal 5MB.
   - Foto profil divalidasi dengan format JPG/PNG/WebP dan ukuran maksimal 5MB.
   - Pengecekan ukuran dan tipe dilakukan ganda (di antarmuka pengguna dan saat dieksekusi oleh *server action*).
2. **Graceful Fallbacks:** 
   - Komponen front-end harus menangani kondisi jika data kosong (*null*). Misalnya: `data.metadata?.hero_name || "Nama Saya"`. Jika pengguna tidak sengaja mengosongkan data di panel admin, tampilan UI website tidak akan *crash*.
3. **Role-based Access:** Fitur *upload* file ke *storage* dan modifikasi tabel dilindungi dengan `verifyAdminSession()`. Hanya administrator sah yang dapat melakukan perubahan.
