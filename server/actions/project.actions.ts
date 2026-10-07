"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/server/db/server";
import { verifyAdminSession } from "@/server/auth/session";
import { projectPayloadSchema, type ProjectPayload } from "@/server/services/validation";
import type { ProjectRow } from "@/server/db/types";

async function requireAuth() {
  const valid = await verifyAdminSession();
  if (!valid) throw new Error("UNAUTHORIZED");
}

export async function createProject(
  payload: ProjectPayload
): Promise<{ data: ProjectRow | null; error: string | null }> {
  await requireAuth();

  const parsed = projectPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;
  const { data, error } = await db
    .from("projects")
    .insert({ ...parsed.data, updated_at: new Date().toISOString() })
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

  const parsed = projectPayloadSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;
  const { data, error } = await db
    .from("projects")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
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

  const db = createServerClient();
  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}
