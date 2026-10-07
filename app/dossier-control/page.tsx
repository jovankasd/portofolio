import React from "react";
import type { Metadata } from "next";
import TerminalShell from "@/components/admin/TerminalShell";

export const metadata: Metadata = {
  title: "Pusat Kendali // Dossier Control",
  description: "Gerbang otentikasi arsip portofolio.",
  robots: "noindex, nofollow",
};

export default function DossierControlPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#1d1b18] flex flex-col items-center justify-center p-4 sm:p-8 relative pb-24 sm:pb-8">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <p className="font-mono text-xs text-[#bd4b2a] tracking-[0.16em] uppercase mb-2">
            DOSSIER VAULT · OTENTIKASI
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1d1b18] tracking-[-0.04em]">
            Pusat Kendali Arsip
          </h1>
          <p className="mt-2 text-sm text-[#1d1b18]/65 max-w-md mx-auto">
            Verifikasi kunci keamanan untuk mengelola projek, kredensial, dan rekam jejak.
          </p>
        </div>

        <TerminalShell />

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#1d1b18]/60 hover:text-[#bd4b2a] border-b border-[#1d1b18]/20 hover:border-[#bd4b2a] pb-0.5 transition-colors"
          >
            ← Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </main>
  );
}
