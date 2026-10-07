/**
 * Editable fields per page slug. Single source of truth shared by the admin
 * form (components/admin/PageForm.tsx) and the public resolvers
 * (shared/content/resolve.ts), so a key can't be edited without being read.
 */
export type PageFieldType = "text" | "textarea" | "photo" | "file" | "comma-separated" | "principles" | "socials";

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
  { key: "cv_url", label: "File CV (PDF)", type: "file" },
];

export const TENTANG_FIELDS: readonly PageField[] = [
  { key: "skills", label: "Keahlian (Pisahkan dengan koma)", type: "comma-separated" },
  { key: "tools", label: "Peralatan (Pisahkan dengan koma)", type: "comma-separated" },
  { key: "principles", label: "Prinsip", type: "principles" },
];

export const HUBUNGI_SAYA_FIELDS: readonly PageField[] = [
  { key: "socials", label: "Media Sosial", type: "socials" },
];

export const FOOTER_FIELDS: readonly PageField[] = [
  { key: "footer_text", label: "Teks Footer", type: "text" },
];

/** Pages that store their fields in `metadata`. Any other slug edits title + content. */
export const PAGE_FIELDS: Record<string, readonly PageField[]> = {
  beranda: HERO_FIELDS,
  tentang: TENTANG_FIELDS,
  "hubungi-saya": HUBUNGI_SAYA_FIELDS,
  footer: FOOTER_FIELDS,
};
