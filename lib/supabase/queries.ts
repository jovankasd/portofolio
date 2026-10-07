import { createServerClient } from "@/lib/supabase/server";
import type { ProjectRow, CredentialRow, SiteSettingsRow } from "@/lib/supabase/types";

// ── Projects ────────────────────────────────────────────────

export async function getProjects(): Promise<ProjectRow[]> {
  const db = createServerClient();
  const { data, error } = await db
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getProjects]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const db = createServerClient();
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

// ── Credentials ─────────────────────────────────────────────

export async function getCredentials(): Promise<CredentialRow[]> {
  const db = createServerClient();
  const { data, error } = await db
    .from("credentials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getCredentials]", error.message);
    return [];
  }
  return data ?? [];
}

// ── Site Settings ────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  const db = createServerClient();
  const { data, error } = await db
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return null;
  return data;
}
