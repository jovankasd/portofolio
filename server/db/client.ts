import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let _client: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Browser-side Supabase client using the public anon key.
 * Lazy-initialized to prevent crashes when env variables are missing at import time.
 */
export function getSupabaseBrowserClient() {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  _client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return _client;
}
