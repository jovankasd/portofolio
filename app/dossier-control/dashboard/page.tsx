import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/server/auth/session";
import { getProjects, getCredentials } from "@/server/db/queries";
import { logoutAdmin } from "@/server/actions/auth.actions";
import DashboardClient from "@/components/admin/DashboardClient";

export const metadata = {
  title: "Pengelola Arsip // Dossier Core",
  robots: "noindex, nofollow",
};

async function handleLogout() {
  "use server";
  await logoutAdmin();
  redirect("/dossier-control");
}

export default async function DashboardPage() {
  const valid = await verifyAdminSession();
  if (!valid) redirect("/dossier-control");

  const [projects, credentials] = await Promise.all([
    getProjects(),
    getCredentials(),
  ]);

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#1d1b18] p-5 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#1d1b18]/15 pb-6">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] text-[#bd4b2a] uppercase mb-1">
              DOSSIER CORE · PENGELOLA ARSIP
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-[#1d1b18] tracking-[-0.03em]">
              Dasbor Manajemen Konten
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="font-mono text-xs text-[#1d1b18]/65 hover:text-[#bd4b2a] border border-[#1d1b18]/20 hover:border-[#bd4b2a]/40 px-3.5 py-1.5 rounded bg-transparent transition-colors"
            >
              Lihat Website ↗
            </a>
            <form action={handleLogout}>
              <button
                type="submit"
                className="font-mono text-xs text-[#1d1b18]/60 hover:text-red-700 border border-[#1d1b18]/20 hover:border-red-700/40 px-3.5 py-1.5 rounded bg-transparent transition-colors"
              >
                Keluar Sesi
              </button>
            </form>
          </div>
        </header>

        <DashboardClient
          initialProjects={projects}
          initialCredentials={credentials}
        />
      </div>
    </main>
  );
}
