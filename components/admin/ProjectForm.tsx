import { X } from "lucide-react";
import Field from "@/components/shared/Field";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { ProjectRow } from "@/server/db/types";

interface ProjectFormProps {
  initial: ProjectRow | null;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: ProjectFormProps) {
  return (
    <form action={onSubmit} className="mb-8 p-6 sm:p-7 rounded border border-[#1d1b18]/20 bg-[#e9e2d6] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#1d1b18]/15">
        <h2 className="font-display text-xl text-[#1d1b18] tracking-tight">
          {initial ? "Edit Proyek Portofolio" : "Tambah Proyek Baru"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-[#1d1b18]/50 hover:text-[#1d1b18] rounded"
          aria-label="Tutup form"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Judul Proyek" name="title" defaultValue={initial?.title} required placeholder="Contoh: Agentic Orchestrator" />
        <Field label="Urutan Tampil (Sort Order)" name="sort_order" type="number" defaultValue={String(initial?.sort_order ?? 99)} />
      </div>

      <Field
        label="Ringkasan Singkat"
        name="summary"
        type="textarea"
        defaultValue={initial?.summary}
        required
        placeholder="Ringkasan 1-2 kalimat untuk kartu portofolio"
      />

      <Field
        label="Deskripsi Lengkap (opsional)"
        name="description"
        type="textarea"
        defaultValue={initial?.description}
        placeholder="Penjelasan teknis dan arsitektur mendalam"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live Demo URL" name="live_url" type="url" defaultValue={initial?.live_url} placeholder="https://..." />
        <Field label="Repository GitHub URL" name="github_url" type="url" defaultValue={initial?.github_url} placeholder="https://github.com/..." />
      </div>

      <ImageUploadField
        label="Foto Sampul / Thumbnail Proyek"
        name="thumbnail_url"
        defaultValue={initial?.thumbnail_url}
        placeholder="/projects/agent-orchestrator.svg atau https://..."
      />

      <Field label="AI Tags (pisahkan koma)" name="ai_tags" defaultValue={initial?.ai_tags?.join(", ")} placeholder="Multi-Agent, LangGraph, RAG" />
      <Field label="Tech Stack (pisahkan koma)" name="tech_stack" defaultValue={initial?.tech_stack?.join(", ")} placeholder="Next.js, Python, Supabase, Tailwind" />

      <div>
        <label className="block font-mono text-xs text-[#1d1b18]/65 uppercase tracking-wider mb-1.5">
          Tampilkan Sebagai Featured
        </label>
        <select
          name="is_featured"
          defaultValue={String(initial?.is_featured ?? false)}
          className="w-full sm:w-48 bg-[#f4f0e8] border border-[#1d1b18]/20 rounded px-3.5 py-2 text-sm text-[#1d1b18] focus:outline-none focus:border-[#bd4b2a] font-sans"
        >
          <option value="true">Ya, Featured</option>
          <option value="false">Tidak, Reguler</option>
        </select>
      </div>

      <div className="flex gap-3 pt-3 border-t border-[#1d1b18]/15">
        <button
          type="submit"
          disabled={isPending}
          className="font-mono text-xs px-5 py-2 bg-[#bd4b2a] hover:bg-[#a83f21] text-[#f8f3e9] rounded font-medium disabled:opacity-40 transition-colors"
        >
          {isPending ? "Menyimpan data..." : "Simpan Proyek"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-xs px-4 py-2 border border-[#1d1b18]/20 text-[#1d1b18]/70 hover:text-[#1d1b18] rounded transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
