/**
 * Editable fields per page slug. Single source of truth shared by the admin
 * form (components/admin/PageForm.tsx) and the public resolvers
 * (shared/content/resolve.ts), so a key can't be edited without being read.
 */
export type PageFieldType = "text" | "textarea" | "photo";

export interface PageField {
  key: string;
  label: string;
  type: PageFieldType;
}

export const HERO_FIELDS: readonly PageField[] = [
  { key: "hero_name", label: "Nama lengkap", type: "text" },
  { key: "hero_eyebrow", label: "Teks kecil di atas nama", type: "text" },
  { key: "hero_role_primary", label: "Peran utama", type: "text" },
  { key: "hero_role_secondary", label: "Peran kedua", type: "text" },
  { key: "hero_description", label: "Deskripsi singkat", type: "textarea" },
  { key: "hero_caption", label: "Keterangan di foto", type: "text" },
  { key: "hero_cta_text", label: "Teks tombol karya", type: "text" },
  { key: "hero_cv_button_text", label: "Teks tombol unduh CV", type: "text" },
  { key: "profile_photo_url", label: "Foto profil", type: "photo" },
];

/** Pages that store their fields in `metadata`. Any other slug edits title + content. */
export const PAGE_FIELDS: Record<string, readonly PageField[]> = {
  beranda: HERO_FIELDS,
};
