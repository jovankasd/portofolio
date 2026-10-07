import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { loadEnv } from "vite";

// Jalankan setelah schema.sql diterapkan di Supabase SQL Editor:
//   RUN_LIVE_DB_TESTS=1 npx vitest run tests/db/schema.live.test.ts
const live = process.env.RUN_LIVE_DB_TESTS === "1";

describe.skipIf(!live)("live Supabase — CMS schema", () => {
  let anon: SupabaseClient;
  let admin: SupabaseClient;
  const hiddenSlug = `hidden-test-${Date.now()}`;

  beforeAll(async () => {
    const env = loadEnv("test", process.cwd(), "");
    anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    await admin.from("pages").insert({ slug: hiddenSlug, title: "Hidden", is_published: false });
  });

  afterAll(async () => {
    await admin.from("pages").delete().eq("slug", hiddenSlug);
  });

  test("tabel pages ada dan site_settings memiliki footer_text", async () => {
    const pages = await anon.from("pages").select("id").limit(1);
    const settings = await anon.from("site_settings").select("footer_text").limit(1);
    expect(pages.error).toBeNull();
    expect(settings.error).toBeNull();
  });

  test("anon tidak dapat membaca halaman is_published = false", async () => {
    const { data, error } = await anon.from("pages").select("slug").eq("slug", hiddenSlug);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });
});
