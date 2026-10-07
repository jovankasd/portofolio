"use client";

import type { PageRow } from "@/server/db/types";
import { PAGE_FIELDS } from "@/shared/content/pageFields";
import AssetUploadField from "./AssetUploadField";

interface Props {
  page: PageRow;
  onSubmit: (slug: string, payload: { title: string; content: string | null; metadata: Record<string, string> }) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function PageForm({ page, onSubmit, onCancel, isPending }: Props) {
  const fields = PAGE_FIELDS[page.slug] || [];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newMetadata: Record<string, string> = { ...page.metadata };
    fields.forEach((f) => {
      newMetadata[f.key] = (fd.get(f.key) as string) || "";
    });
    const newTitle = fd.get("title") as string;
    const newContent = fd.get("content") as string;
    
    onSubmit(page.slug, {
      title: newTitle,
      content: newContent || null,
      metadata: newMetadata,
      is_published: page.is_published,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 rounded bg-white border border-[#1d1b18]/15 shadow-sm space-y-6">
      <h2 className="font-display text-lg text-[#1d1b18] border-b border-[#1d1b18]/10 pb-3">
        Edit Halaman: {page.slug}
      </h2>

      <div>
        <label htmlFor="title" className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">Judul halaman</label>
        <input
          id="title"
          name="title"
          defaultValue={page.title}
          className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
          required
        />
      </div>

      {fields.length === 0 && (
        <div>
          <label htmlFor="content" className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">Isi halaman</label>
          <textarea
            id="content"
            name="content"
            defaultValue={page.content || ""}
            rows={8}
            className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
          />
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#1d1b18]/50 mb-2">Metadata Spesifik</h3>
          {fields.map((f) => {
            if (f.type === "photo") {
              return (
                <div key={f.key}>
                  <AssetUploadField
                    label={f.label}
                    uploadLabel={`Unggah ${f.label}`}
                    name={f.key}
                    kind="photo"
                    accept="image/jpeg, image/png, image/webp"
                    defaultValue={page.metadata?.[f.key]}
                    hint="Format JPG/PNG/WebP (Max 5MB)"
                  />
                </div>
              );
            }
            if (f.type === "textarea") {
              return (
                <div key={f.key}>
                  <label htmlFor={f.key} className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">{f.label}</label>
                  <textarea
                    id={f.key}
                    name={f.key}
                    defaultValue={page.metadata?.[f.key] || ""}
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
                  />
                </div>
              );
            }
            return (
              <div key={f.key}>
                <label htmlFor={f.key} className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">{f.label}</label>
                <input
                  id={f.key}
                  name={f.key}
                  defaultValue={page.metadata?.[f.key] || ""}
                  className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-[#1d1b18]/10">
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-xs px-4 py-2 text-[#1d1b18]/60 hover:text-[#1d1b18] transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2 font-mono text-xs rounded bg-[#1d1b18] text-[#f4f0e8] hover:bg-[#bd4b2a] transition-colors disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Simpan Halaman"}
        </button>
      </div>
    </form>
  );
}
