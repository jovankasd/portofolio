import type { Metadata } from "next";
import TerminalShell from "@/components/admin/TerminalShell";

export const metadata: Metadata = {
  title: "Admin",
  description: "Gerbang administrasi portofolio.",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#f4f0e8] p-4 pb-24 text-[#1d1b18] sm:p-8">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-[#bd4b2a]">
            ADMIN · OTENTIKASI
          </p>
          <h1 className="font-display text-3xl tracking-[-0.04em] text-[#1d1b18] sm:text-4xl">
            Admin
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#1d1b18]/65">
            Verifikasi kunci keamanan untuk mengelola proyek, kredensial, dan rekam jejak.
          </p>
        </div>

        <TerminalShell />

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 border-b border-[#1d1b18]/20 pb-0.5 font-mono text-xs text-[#1d1b18]/60 transition-colors hover:border-[#bd4b2a] hover:text-[#bd4b2a]"
          >
            ← Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </main>
  );
}
