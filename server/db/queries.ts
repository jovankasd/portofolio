import { createServerClient } from "@/server/db/server";
import type { ProjectRow, CredentialRow, SiteSettingsRow, PageRow } from "@/server/db/types";

// ── Helpers ──────────────────────────────────────────────────
const DB_TIMEOUT_MS = 2000;

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`DB timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// ── Projects ────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectRow[]> {
  try {
    const db = createServerClient();
    const { data, error } = await withTimeout(
      db
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true }),
      DB_TIMEOUT_MS
    );

    if (error) {
      console.error("[getProjects]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[getProjects timeout/error]", err);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  try {
    const db = createServerClient();
    const { data, error } = await withTimeout(
      db
        .from("projects")
        .select("*")
        .eq("id", id)
        .single(),
      DB_TIMEOUT_MS
    );

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Credentials ─────────────────────────────────────────────

export async function getCredentials(): Promise<CredentialRow[]> {
  try {
    const db = createServerClient();
    const { data, error } = await withTimeout(
      db
        .from("credentials")
        .select("*")
        .order("sort_order", { ascending: true }),
      DB_TIMEOUT_MS
    );

    if (error) {
      console.error("[getCredentials]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[getCredentials timeout/error]", err);
    return [];
  }
}

// ── Site Settings ────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  try {
    const db = createServerClient();
    const { data, error } = await withTimeout(
      db
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single(),
      DB_TIMEOUT_MS
    );

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Pages ───────────────────────────────────────────────────

/**
 * Public read: only published pages. The service-role client bypasses RLS,
 * so the is_published filter has to be applied here too.
 */
export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  try {
    const db = createServerClient();
    const { data, error } = await withTimeout(
      db
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle(),
      DB_TIMEOUT_MS
    );

    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

/** Admin read: every page, including unpublished ones. */
export async function getAllPages(): Promise<PageRow[]> {
  try {
    const db = createServerClient();
    const { data, error } = await withTimeout(
      db.from("pages").select("*").order("created_at", { ascending: true }),
      DB_TIMEOUT_MS
    );

    if (error) {
      console.error("[getAllPages]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[getAllPages timeout/error]", err);
    return [];
  }
}
