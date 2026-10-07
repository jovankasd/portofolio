"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/server/db/server";
import { verifyAdminSession } from "@/server/auth/session";
import { credentialPayloadSchema, type CredentialPayload } from "@/server/services/validation";
import type { CredentialRow } from "@/server/db/types";

async function requireAuth() {
  const valid = await verifyAdminSession();
  if (!valid) throw new Error("UNAUTHORIZED");
}

export async function createCredential(
  payload: CredentialPayload
): Promise<{ data: CredentialRow | null; error: string | null }> {
  await requireAuth();

  const parsed = credentialPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;
  const { data, error } = await db
    .from("credentials")
    .insert(parsed.data)
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

  const parsed = credentialPayloadSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServerClient() as any;
  const { data, error } = await db
    .from("credentials")
    .update(parsed.data)
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

  const db = createServerClient();
  const { error } = await db.from("credentials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}
