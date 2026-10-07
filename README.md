# Obsidian & Atmosphere — The Tech Dossier 🖋️

> **Editorial Precision & Warm Atmosphere**  
> A personal portfolio and tech dossier for an AI Orchestrator & Agentic AI Engineer.
> 
> 🔴 **Live Demo:** [Obsidian & Atmosphere](https://portofolio-a7n03uyyy-jovankasuryad58296-7922s-projects.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript)](https://www.typescriptlang.org/)

## 📖 Overview

Most modern tech portfolios fall into two extremes: generic "neon sci-fi" templates lacking technical proof, or static sites that require code redeployment just to update a project. 

**Obsidian & Atmosphere** solves both. It replaces the generic AI aesthetic with a warm, editorial paper-tone design (`#f4f0e8`), weighted serif typography, and terracotta accents (`#bd4b2a`). Beyond its public face, it features a fully integrated **Dossier Control** — a secure, terminal-styled CMS powered by Supabase.

### ✨ Key Features

- 🎭 **Anti-Slop Editorial Design**: Asymmetric curation, high-contrast credential track records, and a warm paper aesthetic that stands out from the generic dark-mode crowd.
- 🔐 **Terminal-Based Admin Gateway**: Secure `/admin` route featuring a minimalist terminal console authentication (with a mobile-friendly "Cyber Macro Bar").
- 🗄️ **Dossier Control (CMS)**: Real-time CRUD management for projects and credentials, completely untethered from static deployments.
- 🧾 **Verifiable Credentials**: High-contrast modal pop-ups displaying hard proof of credentials, certificates, and field documentation.
- ⚡ **Performance & Accessibility**: Fluid typography, focus & scroll-locking modals, and highly optimized Next.js server actions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Language**: TypeScript
- **Testing**: Vitest

## 🚀 Getting Started

First, ensure you have set up your `.env.local` based on the `.env.local.example` file. You will need your Supabase URL, Anon Key, and Admin Password.

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Documentation

All architectural and design specifications are cleanly documented in the `docs/` directory:
- `docs/ARCHITECTURE.md`: Core system architecture and data flow.
- `docs/PRD.md`: Product Requirement Document and goals.
- `docs/DESIGN.md`: Visual design language, tokens, and UI components.
- `docs/BACKEND_SETUP.md`: Supabase schema and RLS configurations.

---
*Designed and engineered with precision.*
