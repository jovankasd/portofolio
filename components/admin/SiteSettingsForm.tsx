"use client";

import { useState } from "react";
import type { SiteSettingsRow } from "@/server/db/types";
import AssetUploadField from "./AssetUploadField";

interface Props {
  initial: SiteSettingsRow | null;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

export default function SiteSettingsForm({ initial, onSubmit, isPending }: Props) {
  const [skills] = useState<string[]>(
    Array.isArray(initial?.skills) ? (initial.skills as string[]) : []
  );
  const [tools] = useState<string[]>(
    Array.isArray(initial?.tools) ? (initial.tools as string[]) : []
  );
  const [principles] = useState<{ number: string; title: string; description: string }[]>(
    Array.isArray(initial?.principles) ? (initial.principles as unknown as { number: string; title: string; description: string }[]) : []
  );

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }} 
      className="mb-8 p-6 rounded bg-white border border-[#1d1b18]/15 shadow-sm space-y-6"
    >
      <h2 className="font-display text-lg text-[#1d1b18] border-b border-[#1d1b18]/10 pb-3">
        Pengaturan Situs & About Section
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">Hero Tagline</label>
          <input
            name="hero_tagline"
            defaultValue={initial?.hero_tagline || ""}
            className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
          />
        </div>
        <div>
          <AssetUploadField
            label="CV URL"
            uploadLabel="File CV (PDF)"
            name="cv_url"
            kind="cv"
            accept="application/pdf"
            defaultValue={initial?.cv_url}
            hint="Format PDF (Max 5MB)"
          />
        </div>
      </div>

      <div>
        <label htmlFor="footer_text" className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">Teks footer</label>
        <input
          id="footer_text"
          name="footer_text"
          defaultValue={initial?.footer_text || ""}
          className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">Skills (Pisahkan dengan koma)</label>
        <textarea
          name="skills"
          defaultValue={skills.join(", ")}
          rows={2}
          className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
          placeholder="React.js, Tailwind CSS, Python..."
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">Tools (Pisahkan dengan koma)</label>
        <textarea
          name="tools"
          defaultValue={tools.join(", ")}
          rows={2}
          className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
          placeholder="VS Code, MCP, Supabase..."
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">Principles JSON Array</label>
        <textarea
          name="principles"
          defaultValue={JSON.stringify(principles, null, 2)}
          rows={8}
          className="w-full px-3 py-2 font-mono text-xs rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
        />
        <p className="text-[10px] text-[#1d1b18]/50 mt-1">Gunakan format JSON yang valid untuk principles.</p>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#1d1b18]/10">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2 font-mono text-xs rounded bg-[#1d1b18] text-[#f4f0e8] hover:bg-[#bd4b2a] transition-colors disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
