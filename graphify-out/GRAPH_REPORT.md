# Graph Report - portofolio  (2026-10-07)

## Corpus Check
- 83 files · ~56,362 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .woff 2, .example 1, (none) 1)

## Summary
- 470 nodes · 886 edges · 26 communities (21 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cae0d487`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- actions.ts
- app/page.tsx
- createServerClient
- package.json
- validation.ts
- auth.actions.ts
- server/actions.test.ts
- compilerOptions
- devDependencies
- dependencies
- PageForm.tsx
- mockData.ts
- Panduan Setup Backend — Obsidian & Atmosphere
- extends
- next.config.mjs
- postcss.config.mjs
- AI Prompt Orchestrator (PROMPT_ORCHESTRATOR.md)
- Spesifikasi Desain: CMS Portofolio Dinamis (Halaman & Pengaturan Global)
- Product Requirement Document (PRD)
- Technical & System Architecture
- Design Direction: Jovanka Surya Dilla
- layout.tsx
- README.md
- Obsidian & Atmosphere — The Tech Dossier
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `createServerClient()` - 29 edges
2. `next` - 23 edges
3. `DashboardClient()` - 21 edges
4. `createServerClient()` - 19 edges
5. `verifyAdminSession()` - 17 edges
6. `lucide-react` - 16 edges
7. `compilerOptions` - 15 edges
8. `react` - 13 edges
9. `uploadAsset()` - 12 edges
10. `AI Prompt Orchestrator (PROMPT_ORCHESTRATOR.md)` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Task 3: Admin UI - Edit Forms` --references--> `AssetUploadField()`  [INFERRED]
  docs/superpowers/plans/2026-10-07-dynamic-cms.md → components/admin/AssetUploadField.tsx
- `Review Focus` --references--> `HeroSection()`  [INFERRED]
  docs/superpowers/plans/2026-10-07-dynamic-cms.md → components/ui/HeroSection.tsx
- `Task 3: Admin UI - Edit Forms` --references--> `updateSiteSettings()`  [INFERRED]
  docs/superpowers/plans/2026-10-07-dynamic-cms.md → server/actions/site_settings.actions.ts
- `Task 1: Supabase Database Schema Migration` --references--> `PageRow`  [INFERRED]
  docs/superpowers/plans/2026-10-07-dynamic-cms.md → server/db/types.ts
- `upload()` --calls--> `uploadAsset()`  [EXTRACTED]
  tests/server/actions.test.ts → server/actions/storage.actions.ts

## Import Cycles
- None detected.

## Communities (26 total, 5 thin omitted)

### Community 0 - "actions.ts"
Cohesion: 0.08
Nodes (40): authenticateAdmin(), AuthResult, createCredential(), createProject(), CredentialPayload, deleteCredential(), deleteProject(), getClientIP() (+32 more)

### Community 1 - "app/page.tsx"
Cohesion: 0.08
Nodes (32): AdminPage(), metadata, revalidate, CyberMacroBar(), CyberMacroBarProps, TerminalShell(), AboutSection(), Principle (+24 more)

### Community 2 - "createServerClient"
Cohesion: 0.10
Nodes (39): CredentialForm(), CredentialFormProps, DashboardClient(), handleDeleteCred(), handleDeleteProject(), handleSaveCred(), handleSavePage(), handleSaveProject() (+31 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (30): name, private, scripts, build, dev, lint, start, test (+22 more)

### Community 4 - "validation.ts"
Cohesion: 0.10
Nodes (27): AssetUploadField(), handleFile(), Props, ImageUploadFieldProps, zod, getPublicUrl(), getUploadSignedUrl(), requireAuth() (+19 more)

### Community 5 - "auth.actions.ts"
Cohesion: 0.09
Nodes (27): checkInMemoryRateLimit(), POST(), RATE_LIMIT_MAP, env, config, middleware(), PROTECTED_PATHS, rewriteTo404() (+19 more)

### Community 6 - "server/actions.test.ts"
Cohesion: 0.11
Nodes (24): DashboardPage(), handleLogout(), metadata, HomePage(), logoutAdmin(), getAllPages(), getCredentials(), getPageBySlug() (+16 more)

### Community 7 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+13 more)

### Community 8 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom, @testing-library/react (+6 more)

### Community 9 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bcryptjs, clsx, iron-session, lucide-react, next, react, react-dom (+4 more)

### Community 10 - "PageForm.tsx"
Cohesion: 0.10
Nodes (19): DynamicPrinciplesField(), DynamicSocialsField(), PageForm(), Props, Dynamic CMS Implementation Plan, Global Constraints, Review Focus, Task 1: Supabase Database Schema Migration (+11 more)

### Community 11 - "mockData.ts"
Cohesion: 0.33
Nodes (5): CredentialItem, DOSSIER_PROFILE, INITIAL_CREDENTIALS, INITIAL_PROJECTS, ProjectItem

### Community 12 - "Panduan Setup Backend — Obsidian & Atmosphere"
Cohesion: 0.15
Nodes (12): A. Generate Bcrypt Hash untuk Master Key, Arsitektur Keamanan yang Sudah Diimplementasi, B. Generate Session Secret (32 karakter acak), Langkah 1: Buat Project Supabase, Langkah 2: Jalankan SQL Migration, Langkah 3: Buat Storage Bucket, Langkah 4: Ambil API Keys, Langkah 5: Generate Admin Credentials (+4 more)

### Community 13 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 16 - "AI Prompt Orchestrator (PROMPT_ORCHESTRATOR.md)"
Cohesion: 0.15
Nodes (12): 0. Filosofi Strategi, 1. Context Primer (Wajib Ditempel di Setiap Sesi Baru), 2. Tahap 0: Scaffolding & Setup, 3. Tahap 1: Eksekusi Visual & 3D (Gunakan Gemini / Codex), 4. Tahap 2: Eksekusi Logika & Backend (Gunakan Claude), 5. Tahap 3: Integrasi, Optimisasi & QA, 6. Tahap 4: Konten, SEO & Persiapan Rilis, 7. Prompt Engineering Best Practices untuk Proyek Ini (+4 more)

### Community 17 - "Spesifikasi Desain: CMS Portofolio Dinamis (Halaman & Pengaturan Global)"
Cohesion: 0.18
Nodes (10): 1. Tujuan (Purpose), 2.1 Perluasan `site_settings`, 2.2 Tabel Baru: `pages`, 2.3 Supabase Storage, 2. Arsitektur & Database, 3.1 Sisi Publik (Client & Server Components), 3.2 Sisi Panel Admin (`DashboardClient.tsx`), 3. Komponen & Alur Data (Data Flow) (+2 more)

### Community 18 - "Product Requirement Document (PRD)"
Cohesion: 0.22
Nodes (8): 1. Executive Summary, 2. Latar Belakang & Problem Statement, 3. Visi & Target Terukur, 4. Target Persona, 5. Ruang Lingkup (Scope), 6. Functional Requirements (FR), Product Requirement Document (PRD), Proyek: Personal Portfolio & Tech Dossier — "Editorial Precision & Warm Atmosphere"

### Community 19 - "Technical & System Architecture"
Cohesion: 0.25
Nodes (7): 1. Arsitektur Gambaran Umum (Overview), 2. Rasionalisasi Tech Stack, 3. Struktur Folder, 4. Keamanan & Kebijakan Data, 5. Aksesibilitas & Performa, Proyek: "Editorial Precision & Warm Atmosphere" — The Tech Dossier, Technical & System Architecture

### Community 20 - "Design Direction: Jovanka Surya Dilla"
Cohesion: 0.25
Nodes (7): Color system, Content direction, Design Direction: Jovanka Surya Dilla, Interaction and accessibility, Layout and components, Typography, Visual character

### Community 21 - "layout.tsx"
Cohesion: 0.33
Nodes (3): inter, jetbrainsMono, metadata

### Community 22 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **185 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `metadata`, `metadata`, `RATE_LIMIT_MAP` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 221 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `app/page.tsx` to `actions.ts`, `createServerClient`, `package.json`, `validation.ts`, `auth.actions.ts`, `server/actions.test.ts`, `layout.tsx`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `vitest` connect `package.json` to `app/page.tsx`, `createServerClient`, `validation.ts`, `server/actions.test.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `app/page.tsx` to `createServerClient`, `package.json`, `validation.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `metadata` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0815686274509804 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08311688311688312 - nodes in this community are weakly interconnected._
- **Should `createServerClient` be split into smaller, more focused modules?**
  _Cohesion score 0.10034013605442177 - nodes in this community are weakly interconnected._