-- =============================================================
-- OBSIDIAN & ATMOSPHERE — Supabase Schema Migration
-- Jalankan ini di Supabase SQL Editor (project Anda > SQL Editor)
-- =============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Tabel: projects ──────────────────────────────────────────

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  description text,
  thumbnail_url text,
  live_url text,
  github_url text,
  ai_tags text[] not null default '{}',
  tech_stack text[] not null default '{}',
  sort_order integer not null default 99,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Tabel: credentials ───────────────────────────────────────

create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date text not null,
  cert_image_url text,
  proof_image_url text,
  verification_url text,
  category text not null default 'certificate'
    check (category in ('certificate', 'competition')),
  sort_order integer not null default 99,
  created_at timestamptz not null default now()
);

-- ── Tabel: messages ──────────────────────────────────────────

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Tabel: admin_audit_log ───────────────────────────────────

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null
    check (event_type in ('login_success', 'login_fail', 'lockout')),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ── Tabel: site_settings ─────────────────────────────────────

create table if not exists public.site_settings (
  id integer primary key default 1,
  hero_tagline text,
  cv_url text,
  social_links jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  principles jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

-- Pastikan kolom baru ditambahkan jika tabel sudah pernah dibuat tanpa kolom tersebut
alter table public.site_settings add column if not exists cv_url text;
alter table public.site_settings add column if not exists social_links jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists skills jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists tools jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists principles jsonb not null default '[]'::jsonb;

-- Seed baris tunggal site_settings
insert into public.site_settings (id, hero_tagline, cv_url, social_links, skills, tools, principles)
values (
  1,
  'Merancang AI yang benar-benar bekerja.',
  '/Dossier_AI_Orchestrator_CV.pdf',
  '[
    {"label": "GITHUB", "address": "github.com/username", "url": "https://github.com"},
    {"label": "LINKEDIN", "address": "linkedin.com/in/username", "url": "https://linkedin.com"},
    {"label": "EMAIL", "address": "you@email.com", "url": "mailto:you@email.com"}
  ]'::jsonb,
  '["React.js", "Tailwind CSS", "Python", "Flask", "SQLite", "MySQL"]'::jsonb,
  '["Google Antigravity", "VS Code", "Google AI Studio", "MCP", "Supabase"]'::jsonb,
  '[
    { "number": "01", "title": "AI yang punya batas", "description": "Agen bekerja dalam ruang yang jelas, dengan aturan yang bisa dipahami." },
    { "number": "02", "title": "Mudah digunakan", "description": "Teknologi rumit tetap harus terasa sederhana bagi orang yang memakainya." },
    { "number": "03", "title": "Siap diandalkan", "description": "Hasil penting perlu bisa diuji, ditelusuri, dan diperbaiki." },
    { "number": "04", "title": "Extensible by Design", "description": "Membangun jembatan konteks menggunakan Model Context Protocol (MCP) agar AI Agent dapat berkembang secara modular dan terarah." }
  ]'::jsonb
)
on conflict (id) do nothing;

-- =============================================================
-- Row Level Security (RLS)
-- =============================================================

alter table public.projects enable row level security;
alter table public.credentials enable row level security;
alter table public.messages enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.site_settings enable row level security;

-- projects: siapa saja boleh baca, tidak ada yang boleh tulis (via anon)
create policy "public_read_projects"
  on public.projects for select
  using (true);

-- credentials: siapa saja boleh baca
create policy "public_read_credentials"
  on public.credentials for select
  using (true);

-- site_settings: siapa saja boleh baca
create policy "public_read_site_settings"
  on public.site_settings for select
  using (true);

-- messages, admin_audit_log: TIDAK ADA akses publik sama sekali
-- Semua mutasi hanya lewat service role dari Server Actions.

-- =============================================================
-- Storage Bucket: portfolio-assets
-- (Buat di Supabase Dashboard > Storage > New Bucket)
-- Nama: portfolio-assets
-- Public: true (agar URL gambar bisa diakses langsung)
-- =============================================================

-- =============================================================
-- Data Sample (opsional — hapus sebelum production)
-- =============================================================

insert into public.projects (title, summary, thumbnail_url, github_url, ai_tags, tech_stack, sort_order, is_featured)
values
  (
    'Autonomous Agent Orchestrator',
    'Multi-agent runtime framework for asynchronous task decomposition, tool dispatch, and verification loops.',
    null,
    'https://github.com/example/orchestrator',
    array['Multi-Agent Architecture', 'Tool Calling', 'Autonomous Loops'],
    array['TypeScript', 'Next.js', 'Python', 'LangGraph'],
    1, true
  ),
  (
    'GraphRAG Semantic Knowledge Engine',
    'Knowledge graph ingestion pipeline turning unstructured dossiers into queryable topological subgraphs.',
    null,
    'https://github.com/example/graphrag',
    array['Knowledge Graphs', 'RAG Pipelines', 'AST Parsing'],
    array['Python', 'NetworkX', 'PostgreSQL'],
    2, true
  )
on conflict do nothing;

-- =============================================================
-- CMS DINAMIS — halaman, footer, dan bucket aset
-- Idempoten: aman dijalankan ulang di Supabase SQL Editor.
-- =============================================================

-- ── Tabel: pages ─────────────────────────────────────────────
-- slug 'beranda' memakai kolom metadata (hero_*, profile_photo_url);
-- slug 'tentang' memakai title (judul) dan content (paragraf teks).

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages enable row level security;

-- Publik hanya boleh membaca halaman yang diterbitkan.
-- Semua mutasi lewat service role dari Server Actions.
drop policy if exists "public_read_published_pages" on public.pages;
create policy "public_read_published_pages"
  on public.pages for select
  using (is_published = true);

-- ── site_settings: teks footer ───────────────────────────────

alter table public.site_settings add column if not exists footer_text text;

-- ── Storage bucket: portfolio-assets (publik) ────────────────

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- ── Seed halaman awal (tidak menimpa isi yang sudah diubah) ──

insert into public.pages (slug, title, content, metadata)
values
  (
    'beranda',
    'Beranda',
    null,
    '{
      "hero_name": "Jovanka Surya Dilla",
      "hero_eyebrow": "Personal portfolio · AI systems",
      "hero_role_primary": "AI Orchestrator",
      "hero_role_secondary": "Agentic AI Engineer",
      "hero_description": "Merancang sistem AI yang membantu pekerjaan nyata terasa lebih jelas, terarah, dan bisa diandalkan.",
      "hero_caption": "AI yang bekerja untuk manusia.",
      "hero_cta_text": "Lihat karya",
      "hero_cv_button_text": "Unduh CV",
      "profile_photo_url": "/images/FotoSaya_cutout.png"
    }'::jsonb
  ),
  (
    'tentang',
    'Di balik sistem yang rumit, pengalaman harus terasa sederhana.',
    'Saya merancang sistem AI dan perangkat lunak yang membantu orang menyelesaikan pekerjaan nyata, dari fondasi data hingga pengalaman yang mereka lihat di layar.',
    '{}'::jsonb
  )
on conflict (slug) do nothing;
