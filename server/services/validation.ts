import { z } from "zod";

const MAX_TEXT = 500;
const MAX_LONG_TEXT = 5000;
const MAX_URL = 2048;
const MAX_TAG_ITEMS = 20;
const MAX_TAG_LENGTH = 60;

// ── Project validation ──────────────────────────────────────

export const projectPayloadSchema = z.object({
  title: z
    .string()
    .min(1, "Judul proyek wajib diisi")
    .max(MAX_TEXT, `Judul maksimal ${MAX_TEXT} karakter`),
  summary: z
    .string()
    .min(1, "Ringkasan wajib diisi")
    .max(MAX_LONG_TEXT, `Ringkasan maksimal ${MAX_LONG_TEXT} karakter`),
  description: z
    .string()
    .max(MAX_LONG_TEXT)
    .nullable()
    .optional()
    .transform((v) => v || null),
  thumbnail_url: z
    .string()
    .max(MAX_URL)
    .nullable()
    .optional()
    .transform((v) => v || null),
  live_url: z
    .string()
    .max(MAX_URL)
    .nullable()
    .optional()
    .transform((v) => v || null),
  github_url: z
    .string()
    .max(MAX_URL)
    .nullable()
    .optional()
    .transform((v) => v || null),
  ai_tags: z
    .array(z.string().max(MAX_TAG_LENGTH))
    .max(MAX_TAG_ITEMS)
    .optional()
    .default([]),
  tech_stack: z
    .array(z.string().max(MAX_TAG_LENGTH))
    .max(MAX_TAG_ITEMS)
    .optional()
    .default([]),
  sort_order: z.number().int().min(0).max(9999).optional().default(99),
  is_featured: z.boolean().optional().default(false),
});

export type ProjectPayload = z.infer<typeof projectPayloadSchema>;

// ── Credential validation ───────────────────────────────────

export const credentialPayloadSchema = z.object({
  title: z
    .string()
    .min(1, "Judul kredensial wajib diisi")
    .max(MAX_TEXT, `Judul maksimal ${MAX_TEXT} karakter`),
  issuer: z
    .string()
    .min(1, "Penerbit wajib diisi")
    .max(MAX_TEXT, `Penerbit maksimal ${MAX_TEXT} karakter`),
  issue_date: z
    .string()
    .min(1, "Tanggal terbit wajib diisi")
    .max(50),
  cert_image_url: z
    .string()
    .max(MAX_URL)
    .nullable()
    .optional()
    .transform((v) => v || null),
  proof_image_url: z
    .string()
    .max(MAX_URL)
    .nullable()
    .optional()
    .transform((v) => v || null),
  verification_url: z
    .string()
    .max(MAX_URL)
    .nullable()
    .optional()
    .transform((v) => v || null),
  category: z
    .enum(["certificate", "competition"])
    .optional()
    .default("certificate"),
  sort_order: z.number().int().min(0).max(9999).optional().default(99),
});

export type CredentialPayload = z.infer<typeof credentialPayloadSchema>;

// ── Contact message validation ──────────────────────────────

export const contactMessageSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(120, "Nama maksimal 120 karakter"),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(254, "Email maksimal 254 karakter"),
  message: z
    .string()
    .min(1, "Pesan wajib diisi")
    .max(2000, "Pesan maksimal 2000 karakter"),
});

// ── Auth key validation ─────────────────────────────────────

export const authKeySchema = z
  .string()
  .min(1, "Kunci akses wajib diisi")
  .max(256, "Kunci terlalu panjang");

// ── File upload validation ──────────────────────────────────

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

export function validateUploadFile(file: File): { valid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { valid: false, error: "File gambar tidak ditemukan." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Ukuran gambar terlalu besar (maksimal 8MB)." };
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isValidExt = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
    if (!isValidExt) {
      return {
        valid: false,
        error: `Format file tidak didukung. Gunakan: ${ALLOWED_IMAGE_TYPES.map((t) => t.split("/")[1]).join(", ")}.`,
      };
    }
  }
  return { valid: true };
}

// ── Page validation ─────────────────────────────────────────

const MAX_PAGE_CONTENT = 20000;
const MAX_METADATA_KEYS = 40;

export const pageUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Judul halaman wajib diisi")
    .max(MAX_TEXT, `Judul maksimal ${MAX_TEXT} karakter`),
  content: z
    .string()
    .max(MAX_PAGE_CONTENT, `Konten maksimal ${MAX_PAGE_CONTENT} karakter`)
    .nullable()
    .optional(),
  metadata: z
    .record(z.string().max(MAX_TAG_LENGTH), z.string().max(MAX_URL))
    .refine((m) => Object.keys(m).length <= MAX_METADATA_KEYS, "Terlalu banyak field metadata")
    .optional(),
  is_published: z.boolean().optional(),
});

export type PageUpdatePayload = z.infer<typeof pageUpdateSchema>;

// ── CMS asset (CV / foto profil) validation ─────────────────

export type AssetKind = "cv" | "photo";
export type AssetFormat = "pdf" | "jpg" | "png" | "webp";

export const MAX_ASSET_SIZE = 5 * 1024 * 1024; // 5MB

const ASSET_RULES: Record<
  AssetKind,
  { mimes: Record<string, AssetFormat>; extension: RegExp; error: string }
> = {
  cv: {
    mimes: { "application/pdf": "pdf" },
    extension: /\.pdf$/i,
    error: "File CV harus berformat PDF.",
  },
  photo: {
    mimes: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" },
    extension: /\.(jpe?g|png|webp)$/i,
    error: "Foto harus berformat JPG, PNG, atau WebP.",
  },
};

export function isAssetKind(value: unknown): value is AssetKind {
  return value === "cv" || value === "photo";
}

/** Metadata-level checks (size, MIME, extension). Content is checked by detectAssetFormat. */
export function validateAssetFile(
  file: { name: string; size: number; type: string },
  kind: AssetKind
): { valid: true; format: AssetFormat } | { valid: false; error: string } {
  const rule = ASSET_RULES[kind];
  if (!file || file.size === 0) return { valid: false, error: "File tidak ditemukan." };
  if (file.size > MAX_ASSET_SIZE) {
    return { valid: false, error: "Ukuran file terlalu besar (maksimal 5MB)." };
  }
  
  if (!rule.extension.test(file.name)) return { valid: false, error: rule.error };

  let format = rule.mimes[file.type];
  if (!format) {
    if (kind === "cv") format = "pdf";
    else if (/\.png$/i.test(file.name)) format = "png";
    else if (/\.webp$/i.test(file.name)) format = "webp";
    else format = "jpg";
  }

  return { valid: true, format };
}

/** Identify a file by its magic bytes; the client-supplied MIME type is not trusted. */
export function detectAssetFormat(bytes: Uint8Array): AssetFormat | null {
  const startsWith = (sig: number[], offset = 0) =>
    sig.every((b, i) => bytes[offset + i] === b);

  if (startsWith([0x25, 0x50, 0x44, 0x46, 0x2d])) return "pdf"; // %PDF-
  if (startsWith([0xff, 0xd8, 0xff])) return "jpg";
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) return "webp";
  return null;
}
