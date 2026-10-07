"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminSession,
} from "@/lib/auth/session";
import { checkRateLimit, recordLoginAttempt } from "@/lib/auth/rateLimit";
import type { ProjectRow, CredentialRow } from "@/lib/supabase/types";

// ── Helpers ──────────────────────────────────────────────────

function getClientIP(): string {
  const headersList = headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

function getClientUA(): string {
  return headers().get("user-agent") ?? "unknown";
}

async function requireAuth() {
  const valid = await verifyAdminSession();
  if (!valid) throw new Error("UNAUTHORIZED");
}

// ── Auth ─────────────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  error?: string;
  lockoutUntil?: number;
}

export async function authenticateAdmin(key: string): Promise<AuthResult> {
  const ip = getClientIP();
  const ua = getClientUA();

  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "TOO_MANY_ATTEMPTS",
      lockoutUntil: rateLimit.lockoutUntil ?? undefined,
    };
  }

  const keyHash = process.env.ADMIN_MASTER_KEY_HASH;
  if (!keyHash) {
    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "SERVER_MISCONFIGURED" };
    }
    // Dev fallback
    const DEV_KEY = "obsidian-master-2026";
    if (key !== DEV_KEY) {
      await recordLoginAttempt(ip, ua, false);
      return { success: false, error: "INVALID_KEY" };
    }
    await createAdminSession();
    await recordLoginAttempt(ip, ua, true);
    return { success: true };
  }

  const match = await bcrypt.compare(key, keyHash);
  if (!match) {
    await recordLoginAttempt(ip, ua, false);
    const updatedLimit = await checkRateLimit(ip);
    return {
      success: false,
      error: "INVALID_KEY",
      lockoutUntil: updatedLimit.lockoutUntil ?? undefined,
    };
  }

  await createAdminSession();
  await recordLoginAttempt(ip, ua, true);
  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  revalidatePath("/dossier-control");
}

// ── Projects CRUD ────────────────────────────────────────────

export interface ProjectPayload {
  title: string;
  summary: string;
  description?: string | null;
  thumbnail_url?: string | null;
  live_url?: string | null;
  github_url?: string | null;
  ai_tags?: string[];
  tech_stack?: string[];
  sort_order?: number;
  is_featured?: boolean;
}

export async function createProject(
  payload: ProjectPayload
): Promise<{ data: ProjectRow | null; error: string | null }> {
  await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;

  const { data, error } = await db
    .from("projects")
    .insert({ ...payload, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath("/");
  return { data: data as ProjectRow, error: null };
}

export async function updateProject(
  id: string,
  payload: Partial<ProjectPayload>
): Promise<{ data: ProjectRow | null; error: string | null }> {
  await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;

  const { data, error } = await db
    .from("projects")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath("/");
  return { data: data as ProjectRow, error: null };
}

export async function deleteProject(
  id: string
): Promise<{ error: string | null }> {
  await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;

  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

// ── Credentials CRUD ─────────────────────────────────────────

export interface CredentialPayload {
  title: string;
  issuer: string;
  issue_date: string;
  cert_image_url?: string | null;
  proof_image_url?: string | null;
  verification_url?: string | null;
  category?: "certificate" | "competition";
  sort_order?: number;
}

export async function createCredential(
  payload: CredentialPayload
): Promise<{ data: CredentialRow | null; error: string | null }> {
  await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;

  const { data, error } = await db
    .from("credentials")
    .insert(payload)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath("/");
  return { data: data as CredentialRow, error: null };
}

export async function updateCredential(
  id: string,
  payload: Partial<CredentialPayload>
): Promise<{ data: CredentialRow | null; error: string | null }> {
  await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;

  const { data, error } = await db
    .from("credentials")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath("/");
  return { data: data as CredentialRow, error: null };
}

export async function deleteCredential(
  id: string
): Promise<{ error: string | null }> {
  await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;

  const { error } = await db.from("credentials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

// ── Storage — Signed Upload URL ───────────────────────────────

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
  if (!file || file.size === 0) {
    return { url: "", error: "File gambar tidak ditemukan." };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { url: "", error: "Ukuran gambar terlalu besar (maksimal 8MB)." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const rawBase = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
  const safeName = rawBase.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const fileName = `${Date.now()}_${safeName}.${ext}`;
  const filePath = `uploads/${fileName}`;

  try {
    const db = createServerClient();
    const { data, error } = await db.storage
      .from("portfolio-assets")
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (!error && data) {
      const { data: publicData } = db.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);
      return { url: publicData.publicUrl };
    }

    // Fallback: simpan ke public/uploads lokal jika bucket Supabase belum siap
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    return { url: `/uploads/${fileName}` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengunggah gambar.";
    return { url: "", error: message };
  }
}

