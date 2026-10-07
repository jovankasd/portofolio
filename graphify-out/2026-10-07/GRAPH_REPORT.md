# Graph Report - portofolio  (2026-10-07)

## Corpus Check
- 91 files · ~56,143 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .woff 2, .example 1, (none) 1)

## Summary
- 387 nodes · 829 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Dossier Auth Actions
- UI Components & Dashboard
- Admin Forms & Validation
- App Configuration & Tests
- Server Dashboard Actions
- Rate Limiting & Auth Core
- Storage Actions
- TypeScript Config
- Package DevDependencies
- Package Dependencies
- Dashboard Client Tests
- Mock Data
- Next.js Middleware
- ESLint Config
- Next Config
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `createServerClient()` - 29 edges
2. `DashboardClient()` - 24 edges
3. `next` - 23 edges
4. `createServerClient()` - 19 edges
5. `verifyAdminSession()` - 17 edges
6. `lucide-react` - 16 edges
7. `compilerOptions` - 15 edges
8. `react` - 13 edges
9. `HomePage()` - 12 edges
10. `uploadAsset()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `DashboardPage()` --calls--> `DashboardClient()`  [EXTRACTED]
  app/admin/dashboard/page.tsx → components/admin/DashboardClient.tsx
- `DashboardPage()` --calls--> `verifyAdminSession()`  [EXTRACTED]
  app/admin/dashboard/page.tsx → server/auth/session.ts
- `AdminPage()` --calls--> `TerminalShell()`  [EXTRACTED]
  app/admin/page.tsx → components/admin/TerminalShell.tsx
- `logoutAdmin()` --calls--> `destroyAdminSession()`  [EXTRACTED]
  app/dossier-control/actions.ts → lib/auth/session.ts
- `HomePage()` --calls--> `HeroSection()`  [EXTRACTED]
  app/page.tsx → components/ui/HeroSection.tsx

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "Dossier Auth Actions"
Cohesion: 0.08
Nodes (40): authenticateAdmin(), AuthResult, createCredential(), createProject(), CredentialPayload, deleteCredential(), deleteProject(), getClientIP() (+32 more)

### Community 1 - "UI Components & Dashboard"
Cohesion: 0.10
Nodes (37): DashboardPage(), handleLogout(), metadata, HomePage(), revalidate, AboutSection(), Principle, Props (+29 more)

### Community 2 - "Admin Forms & Validation"
Cohesion: 0.09
Nodes (32): AssetUploadField(), handleFile(), Props, CredentialForm(), CredentialFormProps, Props, Tab, ImageUploadField() (+24 more)

### Community 3 - "App Configuration & Tests"
Cohesion: 0.05
Nodes (32): HeroSection(), name, private, scripts, build, dev, lint, start (+24 more)

### Community 4 - "Server Dashboard Actions"
Cohesion: 0.11
Nodes (36): DashboardClient(), handleDeleteCred(), handleDeleteProject(), handleSaveCred(), handleSavePage(), handleSaveProject(), handleSaveSettings(), notify() (+28 more)

### Community 5 - "Rate Limiting & Auth Core"
Cohesion: 0.07
Nodes (24): AdminPage(), metadata, checkInMemoryRateLimit(), POST(), RATE_LIMIT_MAP, inter, jetbrainsMono, metadata (+16 more)

### Community 6 - "Storage Actions"
Cohesion: 0.12
Nodes (20): getPublicUrl(), getUploadSignedUrl(), requireAuth(), uploadAsset(), uploadImageFile(), detectAssetFormat(), isAssetKind(), validateUploadFile() (+12 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+13 more)

### Community 8 - "Package DevDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom, @testing-library/react (+6 more)

### Community 9 - "Package Dependencies"
Cohesion: 0.17
Nodes (12): dependencies, bcryptjs, clsx, iron-session, lucide-react, next, react, react-dom (+4 more)

### Community 10 - "Dashboard Client Tests"
Cohesion: 0.25
Nodes (6): beranda, mocks, openSettings(), renderDashboard(), settings, tentang

### Community 11 - "Mock Data"
Cohesion: 0.33
Nodes (5): CredentialItem, DOSSIER_PROFILE, INITIAL_CREDENTIALS, INITIAL_PROJECTS, ProjectItem

### Community 12 - "Next.js Middleware"
Cohesion: 0.40
Nodes (5): config, middleware(), PROTECTED_PATHS, rewriteTo404(), AdminSession

### Community 13 - "ESLint Config"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

## Knowledge Gaps
- **126 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `metadata`, `metadata`, `RATE_LIMIT_MAP` (+121 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 151 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Rate Limiting & Auth Core` to `Dossier Auth Actions`, `UI Components & Dashboard`, `App Configuration & Tests`, `Server Dashboard Actions`, `Next.js Middleware`?**
  _High betweenness centrality (0.283) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Admin Forms & Validation` to `UI Components & Dashboard`, `App Configuration & Tests`, `Rate Limiting & Auth Core`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `vitest` connect `App Configuration & Tests` to `Dashboard Client Tests`, `Admin Forms & Validation`, `Server Dashboard Actions`, `Storage Actions`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `metadata` to the rest of the system?**
  _126 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dossier Auth Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.0815686274509804 - nodes in this community are weakly interconnected._
- **Should `UI Components & Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.10122448979591837 - nodes in this community are weakly interconnected._
- **Should `Admin Forms & Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.08776595744680851 - nodes in this community are weakly interconnected._