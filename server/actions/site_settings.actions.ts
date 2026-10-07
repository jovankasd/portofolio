"use server";

import { createServerClient } from "@/server/db/server";
import { verifyAdminSession } from "@/server/auth/session";
import type { Database } from "@/server/db/types";

type UpdatePayload = Database["public"]["Tables"]["site_settings"]["Update"];

export async function updateSiteSettings(payload: UpdatePayload) {
  try {
    const valid = await verifyAdminSession();
    if (!valid) return { error: "Unauthorized" };

    const db = createServerClient();
    const { data, error } = await db
      .from("site_settings")
      // @ts-expect-error Supabase types for update resolve to never due to circular ref
      .update(payload)
      .eq("id", 1)
      .select()
      .single();

    if (error) {
      console.error("[updateSiteSettings error]", error.message);
      return { error: error.message };
    }
    return { data };
  } catch (err: any) {
    return { error: err.message || "Internal server error" };
  }
}
