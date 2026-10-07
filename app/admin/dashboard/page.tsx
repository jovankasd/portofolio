import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/server/auth/session";
import { getProjects, getCredentials, getAllPages } from "@/server/db/queries";
import { logoutAdmin } from "@/server/actions/auth.actions";
import DashboardClient from "@/components/admin/DashboardClient";

export const metadata = {
  title: "Admin · Dasbor",
  robots: "noindex, nofollow",
};

async function handleLogout() {
  "use server";
  await logoutAdmin();
  redirect("/admin");
}

export default async function DashboardPage() {
  const valid = await verifyAdminSession();
  if (!valid) redirect("/admin");

  const [projects, credentials, pages] = await Promise.all([
    getProjects(),
    getCredentials(),
    getAllPages(),
  ]);

  return (
    <main className="min-h-screen bg-[#f4f0e8] p-5 text-[#1d1b18] sm:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#1d1b18]/15 pb-6">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[#bd4b2a]">
              ADMIN · PENGELOLA ARSIP
            </p>
            <h1 className="font-display text-3xl tracking-[-0.03em] text-[#1d1b18] sm:text-4xl">
              Dasbor Manajemen Konten
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="rounded border border-[#1d1b18]/20 bg-transparent px-3.5 py-1.5 font-mono text-xs text-[#1d1b18]/65 transition-colors hover:border-[#bd4b2a]/40 hover:text-[#bd4b2a]"
            >
              Lihat Website ↗
            </a>
            <form action={handleLogout}>
              <button
                type="submit"
                className="rounded border border-[#1d1b18]/20 bg-transparent px-3.5 py-1.5 font-mono text-xs text-[#1d1b18]/60 transition-colors hover:border-red-700/40 hover:text-red-700"
              >
                Keluar Sesi
              </button>
            </form>
          </div>
        </header>

        <DashboardClient
          initialPages={pages}
          initialProjects={projects}
          initialCredentials={credentials}
        />
      </div>
    </main>
  );
}
