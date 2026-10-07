"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/server/actions/project.actions";
import {
  createCredential,
  updateCredential,
  deleteCredential,
} from "@/server/actions/credential.actions";
import { updatePageAction } from "@/server/actions/pages.actions";
import type { ProjectRow, CredentialRow, PageRow } from "@/server/db/types";
import ProjectForm from "./ProjectForm";
import CredentialForm from "./CredentialForm";
import PageForm from "./PageForm";

interface Props {
  initialPages: PageRow[];
  initialProjects: ProjectRow[];
  initialCredentials: CredentialRow[];
}

type Tab = "pages" | "projects" | "credentials";

export default function DashboardClient({ initialPages, initialProjects, initialCredentials }: Props) {
  const [tab, setTab] = useState<Tab>("pages");
  const [pages, setPages] = useState(initialPages);
  const [projects, setProjects] = useState(initialProjects);
  const [credentials, setCredentials] = useState(initialCredentials);
  const [editingPage, setEditingPage] = useState<PageRow | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);
  const [editingCred, setEditingCred] = useState<CredentialRow | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCredForm, setShowCredForm] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function notify(type: "ok" | "err", text: string) {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  }

  // ── Pages ──────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSavePage(slug: string, payload: { title: string; content: string | null; metadata: Record<string, any>; is_published: boolean }) {
    startTransition(async () => {
      const { data, error } = await updatePageAction(slug, payload);
      if (error) { notify("err", error); return; }
      setPages((prev) => prev.map((p) => (p.slug === slug ? data! : p)));
      notify("ok", "Halaman berhasil diperbarui.");
      setEditingPage(null);
    });
  }

  // ── Projects ────────────────────────────────────────────────

  async function handleSaveProject(formData: FormData) {
    const payload = {
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      description: (formData.get("description") as string) || null,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      live_url: (formData.get("live_url") as string) || null,
      github_url: (formData.get("github_url") as string) || null,
      ai_tags: ((formData.get("ai_tags") as string) || "").split(",").map((t) => t.trim()).filter(Boolean),
      tech_stack: ((formData.get("tech_stack") as string) || "").split(",").map((t) => t.trim()).filter(Boolean),
      sort_order: parseInt(formData.get("sort_order") as string) || 99,
      is_featured: formData.get("is_featured") === "true" || formData.get("is_featured") === "on",
    };

    startTransition(async () => {
      if (editingProject) {
        const { data, error } = await updateProject(editingProject.id, payload);
        if (error) { notify("err", error); return; }
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? data! : p)));
        notify("ok", "Proyek berhasil diperbarui.");
      } else {
        const { data, error } = await createProject(payload);
        if (error) { notify("err", error); return; }
        setProjects((prev) => [...prev, data!]);
        notify("ok", "Proyek baru berhasil ditambahkan.");
      }
      setEditingProject(null);
      setShowProjectForm(false);
    });
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Hapus proyek ini secara permanen?")) return;
    startTransition(async () => {
      const { error } = await deleteProject(id);
      if (error) { notify("err", error); return; }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      notify("ok", "Proyek berhasil dihapus.");
    });
  }

  // ── Credentials ─────────────────────────────────────────────

  async function handleSaveCred(formData: FormData) {
    const payload = {
      title: formData.get("title") as string,
      issuer: formData.get("issuer") as string,
      issue_date: formData.get("issue_date") as string,
      cert_image_url: (formData.get("cert_image_url") as string) || null,
      proof_image_url: (formData.get("proof_image_url") as string) || null,
      verification_url: (formData.get("verification_url") as string) || null,
      category: (formData.get("category") as "certificate" | "competition") || "certificate",
      sort_order: parseInt(formData.get("sort_order") as string) || 99,
    };

    startTransition(async () => {
      if (editingCred) {
        const { data, error } = await updateCredential(editingCred.id, payload);
        if (error) { notify("err", error); return; }
        setCredentials((prev) => prev.map((c) => (c.id === editingCred.id ? data! : c)));
        notify("ok", "Kredensial berhasil diperbarui.");
      } else {
        const { data, error } = await createCredential(payload);
        if (error) { notify("err", error); return; }
        setCredentials((prev) => [...prev, data!]);
        notify("ok", "Kredensial baru berhasil ditambahkan.");
      }
      setEditingCred(null);
      setShowCredForm(false);
    });
  }

  async function handleDeleteCred(id: string) {
    if (!confirm("Hapus kredensial ini?")) return;
    startTransition(async () => {
      const { error } = await deleteCredential(id);
      if (error) { notify("err", error); return; }
      setCredentials((prev) => prev.filter((c) => c.id !== id));
      notify("ok", "Kredensial berhasil dihapus.");
    });
  }


  return (
    <div>
      {/* Status Toast */}
      {statusMsg && (
        <div
          className={`fixed top-5 right-5 z-50 font-mono text-xs px-4 py-2.5 rounded border shadow-lg ${
            statusMsg.type === "ok"
              ? "bg-[#e9e2d6] border-[#2e7d32]/40 text-[#2e7d32]"
              : "bg-[#e9e2d6] border-[#c62828]/40 text-[#c62828]"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-8 mb-8 border-b border-[#1d1b18]/15 overflow-x-auto">
        {(["pages", "projects", "credentials"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-xs uppercase tracking-[0.16em] pb-3 whitespace-nowrap transition-colors ${
              tab === t
                ? "text-[#bd4b2a] border-b-2 border-[#bd4b2a] font-medium"
                : "text-[#1d1b18]/45 hover:text-[#1d1b18]"
            }`}
          >
            {t === "pages" ? "Halaman Situs" : t === "projects" ? "Proyek Portofolio" : "Kredensial & Sertifikasi"}
          </button>
        ))}
      </div>

      {/* ── Pages Tab ── */}
      {tab === "pages" && (
        <div>
          {editingPage ? (
            <PageForm
              page={editingPage}
              onSubmit={handleSavePage}
              onCancel={() => setEditingPage(null)}
              isPending={isPending}
            />
          ) : (
            <div className="space-y-3">
              {pages.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-5 rounded border border-[#1d1b18]/15 bg-[#fcfbf9] hover:border-[#1d1b18]/30 transition-all shadow-sm">
                  <div className="min-w-0 pr-4">
                    <h3 className="font-display text-xl text-[#1d1b18] mt-1 truncate">{p.title} <span className="font-mono text-xs text-[#1d1b18]/45">/{p.slug}</span></h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingPage(p)}
                      className="p-2 text-[#1d1b18]/50 hover:text-[#bd4b2a] hover:bg-[#1d1b18]/5 rounded transition-colors"
                      aria-label={`Edit ${p.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {pages.length === 0 && (
                <div className="p-12 text-center border border-dashed border-[#1d1b18]/20 rounded bg-[#fcfbf9]">
                  <p className="font-mono text-xs text-[#1d1b18]/40">
                    Tidak ada halaman dinamis ditemukan. Pastikan tabel pages sudah dibuat dengan menjalankan schema.sql di database Anda.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Projects Tab ── */}
      {tab === "projects" && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-mono text-xs text-[#1d1b18]/50">{projects.length} entri proyek tersimpan</p>
            <button
              onClick={() => { setEditingProject(null); setShowProjectForm((v) => !v); }}
              className="inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-2 rounded bg-[#bd4b2a] hover:bg-[#a83f21] text-[#f8f3e9] font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Proyek
            </button>
          </div>

          {showProjectForm && (
            <ProjectForm
              initial={editingProject}
              onSubmit={handleSaveProject}
              onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
              isPending={isPending}
            />
          )}

          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-5 rounded border border-[#1d1b18]/15 bg-[#fcfbf9] hover:border-[#1d1b18]/30 transition-all shadow-sm">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#bd4b2a]">Order: {p.sort_order}</span>
                    {p.is_featured && (
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-[#bd4b2a]/10 text-[#bd4b2a] border border-[#bd4b2a]/20">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl text-[#1d1b18] mt-1 truncate">{p.title}</h3>
                  <p className="text-sm text-[#1d1b18]/65 mt-1 line-clamp-1">{p.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] text-[#1d1b18]/45">
                    {p.tech_stack?.slice(0, 4).map((tech) => (
                      <span key={tech}>#{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditingProject(p); setShowProjectForm(true); }}
                    className="p-2 text-[#1d1b18]/50 hover:text-[#bd4b2a] hover:bg-[#1d1b18]/5 rounded transition-colors"
                    aria-label="Edit proyek"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="p-2 text-[#1d1b18]/50 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    aria-label="Hapus proyek"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="p-12 text-center border border-dashed border-[#1d1b18]/20 rounded bg-[#fcfbf9]">
                <p className="font-mono text-xs text-[#1d1b18]/40">
                  Belum ada proyek dalam arsip. Klik &ldquo;Tambah Proyek&rdquo; untuk memulai.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Credentials Tab ── */}
      {tab === "credentials" && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-mono text-xs text-[#1d1b18]/50">{credentials.length} entri kredensial tersimpan</p>
            <button
              onClick={() => { setEditingCred(null); setShowCredForm((v) => !v); }}
              className="inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-2 rounded bg-[#bd4b2a] hover:bg-[#a83f21] text-[#f8f3e9] font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Kredensial
            </button>
          </div>

          {showCredForm && (
            <CredentialForm
              initial={editingCred}
              onSubmit={handleSaveCred}
              onCancel={() => { setShowCredForm(false); setEditingCred(null); }}
              isPending={isPending}
            />
          )}

          <div className="space-y-3">
            {credentials.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-5 rounded border border-[#1d1b18]/15 bg-[#fcfbf9] hover:border-[#1d1b18]/30 transition-all shadow-sm">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#bd4b2a]">{c.issue_date}</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-[#1d1b18]/5 text-[#1d1b18]/60 border border-[#1d1b18]/10">
                      {c.category}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-[#1d1b18] mt-1 truncate">{c.title}</h3>
                  <p className="text-sm text-[#1d1b18]/60 mt-0.5">{c.issuer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditingCred(c); setShowCredForm(true); }}
                    className="p-2 text-[#1d1b18]/50 hover:text-[#bd4b2a] hover:bg-[#1d1b18]/5 rounded transition-colors"
                    aria-label="Edit kredensial"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCred(c.id)}
                    className="p-2 text-[#1d1b18]/50 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    aria-label="Hapus kredensial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {credentials.length === 0 && (
              <div className="p-12 text-center border border-dashed border-[#1d1b18]/20 rounded bg-[#fcfbf9]">
                <p className="font-mono text-xs text-[#1d1b18]/40">
                  Belum ada sertifikat atau kredensial. Tambahkan entri baru.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
