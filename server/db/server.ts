import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { env } from "@/config/env";

/**
 * Server-only Supabase client using the service role key.
 * Bypasses RLS — use exclusively in Server Actions and API Routes.
 */
export function createServerClient() {
  const supabaseUrl = env.supabase.url();
  const serviceRoleKey = env.supabase.serviceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase server env vars. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
