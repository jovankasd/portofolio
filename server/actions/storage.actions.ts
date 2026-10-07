"use server";

import { createServerClient } from "@/server/db/server";
import { verifyAdminSession } from "@/server/auth/session";
import {
  detectAssetFormat,
  isAssetKind,
  validateAssetFile,
  validateUploadFile,
} from "@/server/services/validation";

async function requireAuth() {
  const valid = await verifyAdminSession();
  if (!valid) throw new Error("UNAUTHORIZED");
}

export async function getUploadSignedUrl(
  fileName: string
): Promise<{ signedUrl: string; path: string; token: string } | { error: string }> {
  await requireAuth();
  const db = createServerClient();

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}_${safeName}`;

  const { data, error } = await db.storage
    .from("portfolio-assets")
    .createSignedUploadUrl(path);

  if (error || !data) return { error: error?.message ?? "Failed to create upload URL" };

  return { signedUrl: data.signedUrl, path: data.path, token: data.token };
}

export async function getPublicUrl(path: string): Promise<string> {
  const db = createServerClient();
  const { data } = db.storage.from("portfolio-assets").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadImageFile(
  formData: FormData
): Promise<{ url: string; error?: string }> {
  await requireAuth();

  const file = formData.get("file") as File | null;
  if (!file) {
    return { url: "", error: "File gambar tidak ditemukan." };
  }

  const validation = validateUploadFile(file);
  if (!validation.valid) {
    return { url: "", error: validation.error };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const rawBase = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
  const safeName = rawBase.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const fileName = `${Date.now()}_${safeName}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const db = createServerClient();
  const { data, error } = await db.storage
    .from("portfolio-assets")
    .upload(filePath, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error || !data) {
    return { url: "", error: error?.message ?? "Gagal mengunggah gambar ke storage." };
  }

  const { data: publicData } = db.storage
    .from("portfolio-assets")
    .getPublicUrl(filePath);

  return { url: publicData.publicUrl };
}

/**
 * CMS uploads (CV PDF / foto profil). Fixed path per kind with upsert so a new
 * upload replaces the old file instead of piling up in the bucket.
 * Expects FormData fields: `file` (File) and `kind` ("cv" | "photo").
 */
export async function uploadAsset(
  formData: FormData
): Promise<{ url: string; error?: string }> {
  if (!(await verifyAdminSession())) return { url: "", error: "Unauthorized" };

  const kind = formData.get("kind");
  if (!isAssetKind(kind)) return { url: "", error: "Jenis unggahan tidak dikenal." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { url: "", error: "File tidak ditemukan." };

  const checked = validateAssetFile(file, kind);
  if (!checked.valid) return { url: "", error: checked.error };

  const buffer = Buffer.from(await file.arrayBuffer());
  if (detectAssetFormat(buffer) !== checked.format) {
    return { url: "", error: "Isi file tidak sesuai dengan format yang diizinkan." };
  }

  const path = kind === "cv" ? "cv/cv.pdf" : `profile/photo.${checked.format}`;

  try {
    const db = createServerClient();
    const { error } = await db.storage
      .from("portfolio-assets")
      .upload(path, buffer, { contentType: file.type, upsert: true });

    if (error) return { url: "", error: error.message };

    const { data } = db.storage.from("portfolio-assets").getPublicUrl(path);
    // Fixed path means CDN/browsers may keep serving the old file; bust the cache.
    return { url: `${data.publicUrl}?v=${Date.now()}` };
  } catch (err) {
    return { url: "", error: err instanceof Error ? err.message : "Gagal mengunggah file." };
  }
}
