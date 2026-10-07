import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const sql = readFileSync(path.resolve(__dirname, "../../supabase/schema.sql"), "utf8");
const normalized = sql.replace(/\s+/g, " ").toLowerCase();

describe("supabase/schema.sql — CMS migration", () => {
  test("membuat tabel pages dengan primary key uuid dan kolom dari spec", () => {
    expect(normalized).toContain("create table if not exists public.pages");
    const block = normalized.slice(normalized.indexOf("create table if not exists public.pages"));
    expect(block).toContain("id uuid primary key default gen_random_uuid()");
    expect(block).toContain("slug text not null unique");
    expect(block).toContain("title text not null");
    expect(block).toContain("content text");
    expect(block).toContain("metadata jsonb not null default '{}'::jsonb");
    expect(block).toContain("is_published boolean not null default true");
    expect(block).toContain("created_at timestamptz not null default now()");
    expect(block).toContain("updated_at timestamptz not null default now()");
  });

  test("memperluas site_settings dengan footer_text", () => {
    expect(normalized).toContain(
      "alter table public.site_settings add column if not exists footer_text text"
    );
  });

  test("pages memakai RLS dan publik hanya boleh membaca halaman terbit", () => {
    expect(normalized).toContain("alter table public.pages enable row level security");
    expect(normalized).toMatch(/create policy "public_read_published_pages" on public\.pages for select using \( ?is_published = true ?\)/);
  });

  test("bucket portfolio-assets publik dibuat secara idempoten", () => {
    expect(normalized).toMatch(
      /insert into storage\.buckets \(id, name, public\) values \('portfolio-assets', 'portfolio-assets', true\) on conflict \(id\) do nothing/
    );
  });

  test("seed halaman beranda dan tentang tidak menimpa data yang sudah ada", () => {
    expect(normalized).toContain("insert into public.pages");
    expect(normalized).toContain("'beranda'");
    expect(normalized).toContain("'tentang'");
    expect(normalized).toContain("on conflict (slug) do nothing");
  });
});
