"use client";

import { useId, useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { uploadAsset } from "@/server/actions/storage.actions";
import { validateAssetFile, type AssetKind } from "@/server/services/validation";

interface Props {
  label: string;
  uploadLabel: string;
  name: string;
  kind: AssetKind;
  accept: string;
  defaultValue?: string | null;
  hint?: string;
}

/**
 * URL text input (kept editable for manual links) plus a file picker that
 * uploads through `uploadAsset` and fills the input with the public URL.
 * Size/type are checked here first and again on the server.
 */
export default function AssetUploadField({
  label,
  uploadLabel,
  name,
  kind,
  accept,
  defaultValue,
  hint,
}: Props) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const checked = validateAssetFile(file, kind);
    if (!checked.valid) {
      setError(checked.error);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("kind", kind);
      const res = await uploadAsset(fd);
      if (res.error) setError(res.error);
      else setUrl(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah file.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={`${id}-url`} className="block text-xs font-mono text-[#1d1b18]/65 mb-1.5">
        {label}
      </label>
      <input
        id={`${id}-url`}
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded border border-[#1d1b18]/20 focus:outline-none focus:border-[#bd4b2a]"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label
          htmlFor={`${id}-file`}
          className="inline-flex cursor-pointer items-center gap-2 rounded border border-[#1d1b18]/20 px-3 py-1.5 font-mono text-xs text-[#1d1b18]/70 transition-colors hover:border-[#bd4b2a]/50 hover:text-[#bd4b2a]"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {uploading ? "Mengunggah..." : "Unggah dari komputer"}
        </label>
        <input
          ref={fileRef}
          id={`${id}-file`}
          type="file"
          accept={accept}
          aria-label={uploadLabel}
          onChange={handleFile}
          disabled={uploading}
          className="sr-only"
        />
        {hint && <span className="font-mono text-[11px] text-[#1d1b18]/50">{hint}</span>}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 font-mono text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
