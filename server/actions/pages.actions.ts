"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/server/db/server";
import { verifyAdminSession } from "@/server/auth/session";
import { pageUpdateSchema, type PageUpdatePayload } from "@/server/services/validation";
import type { PageRow } from "@/server/db/types";

export async function updatePageAction(
  slug: string,
  payload: PageUpdatePayload
): Promise<{ data: PageRow | null; error: string | null }> {
  const valid = await verifyAdminSession();
  if (!valid) return { data: null, error: "Unauthorized" };

  const parsed = pageUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServerClient() as any;
    const { data, error } = await db
      .from("pages")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("slug", slug)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    revalidatePath("/");
    return { data: data as PageRow, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Internal server error" };
  }
}
