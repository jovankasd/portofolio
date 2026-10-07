"use client";

import type { PageRow } from "@/server/db/types";
import { PAGE_FIELDS } from "@/shared/content/pageFields";
import AssetUploadField from "./AssetUploadField";

interface Props {
  page: PageRow;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (slug: string, payload: { title: string; content: string | null; metadata: Record<string, any>; is_published: boolean }) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function PageForm({ page, onSubmit, onCancel, isPending }: Props) {
  const fields = PAGE_FIELDS[page.slug] || [];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newMetadata: Record<string, any> = { ...page.metadata };
    fields.forEach((f) => {
      const val = (fd.get(f.key) as string) || "";
      if (f.type === "principles" || f.type === "socials") {
        try {
          newMetadata[f.key] = JSON.parse(val);
        } catch {
          newMetadata[f.key] = [];
        }
      } else {
        newMetadata[f.key] = val;
      }
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
            if (f.type === "file") {
              return (
                <div key={f.key}>
                  <AssetUploadField
                    label={f.label}
                    uploadLabel={`Unggah ${f.label}`}
                    name={f.key}
                    kind="cv"
                    accept="application/pdf"
                    defaultValue={page.metadata?.[f.key]}
                    hint="Format PDF (Max 10MB)"
                  />
                </div>
              );
            }
            if (f.type === "textarea" || f.type === "comma-separated") {
              return (
                <div key={f.key}>
                  <label htmlFor={f.key} className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">{f.label}</label>
                  <textarea
                    id={f.key}
                    name={f.key}
                    defaultValue={typeof page.metadata?.[f.key] === "string" ? page.metadata?.[f.key] : JSON.stringify(page.metadata?.[f.key] || "")}
                    rows={f.type === "comma-separated" ? 2 : 3}
                    className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
                  />
                </div>
              );
            }
            if (f.type === "principles") {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return <DynamicPrinciplesField key={f.key} defaultValue={page.metadata?.[f.key] as any} name={f.key} />;
            }
            if (f.type === "socials") {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return <DynamicSocialsField key={f.key} defaultValue={page.metadata?.[f.key] as any} name={f.key} />;
            }
            return (
              <div key={f.key}>
                <label htmlFor={f.key} className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">{f.label}</label>
                <input
                  id={f.key}
                  name={f.key}
                  defaultValue={typeof page.metadata?.[f.key] === "string" ? page.metadata?.[f.key] : ""}
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

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DynamicPrinciplesField({ defaultValue, name }: { defaultValue: any; name: string }) {
  const [items, setItems] = useState<{ number: string; title: string; description: string }[]>(
    Array.isArray(defaultValue) ? defaultValue : []
  );

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono text-[#1d1b18]/65">Prinsip Kerja</label>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((item, i) => (
        <div key={i} className="p-3 border border-[#1d1b18]/10 rounded space-y-2 bg-gray-50/50">
          <div className="flex gap-2">
            <input
              placeholder="01"
              value={item.number}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].number = e.target.value;
                setItems(newItems);
              }}
              className="w-16 px-2 py-1 text-sm rounded border border-[#1d1b18]/20"
            />
            <input
              placeholder="Judul Prinsip"
              value={item.title}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].title = e.target.value;
                setItems(newItems);
              }}
              className="flex-1 px-2 py-1 text-sm rounded border border-[#1d1b18]/20"
            />
            <button
              type="button"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              className="px-2 text-xs text-red-500 hover:bg-red-50 rounded"
            >
              Hapus
            </button>
          </div>
          <textarea
            placeholder="Deskripsi..."
            value={item.description}
            onChange={(e) => {
              const newItems = [...items];
              newItems[i].description = e.target.value;
              setItems(newItems);
            }}
            rows={2}
            className="w-full px-2 py-1 text-sm rounded border border-[#1d1b18]/20"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { number: "", title: "", description: "" }])}
        className="text-xs font-mono text-[#bd4b2a] hover:underline"
      >
        + Tambah Prinsip
      </button>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DynamicSocialsField({ defaultValue, name }: { defaultValue: any; name: string }) {
  const [items, setItems] = useState<{ label: string; url: string; address?: string }[]>(
    Array.isArray(defaultValue) ? defaultValue : []
  );

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono text-[#1d1b18]/65">Media Sosial</label>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 space-y-2">
            <input
              placeholder="Label (misal: LinkedIn)"
              value={item.label}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].label = e.target.value;
                setItems(newItems);
              }}
              className="w-full px-2 py-1 text-sm rounded border border-[#1d1b18]/20"
            />
            <input
              placeholder="URL atau Username"
              value={item.url}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].url = e.target.value;
                setItems(newItems);
              }}
              className="w-full px-2 py-1 text-sm rounded border border-[#1d1b18]/20"
            />
            <input
              placeholder="(Opsional) Alamat Email/dll"
              value={item.address || ""}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i].address = e.target.value;
                setItems(newItems);
              }}
              className="w-full px-2 py-1 text-sm rounded border border-[#1d1b18]/20"
            />
          </div>
          <button
            type="button"
            onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded mt-1"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, { label: "", url: "" }])}
        className="text-xs font-mono text-[#bd4b2a] hover:underline"
      >
        + Tambah Sosial Media
      </button>
    </div>
  );
}
