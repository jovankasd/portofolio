"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, Check, X } from "lucide-react";
import { uploadImageFile } from "@/server/actions/storage.actions";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}

export default function ImageUploadField({
  label,
  name,
  defaultValue,
  placeholder,
}: ImageUploadFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await uploadImageFile(fd);
      if (res.error) {
        setUploadError(res.error);
      } else if (res.url) {
        setImageUrl(res.url);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block font-mono text-xs text-[#1d1b18]/65 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="font-mono text-[11px] text-[#bd4b2a] hover:underline"
        >
          {showManualUrl ? "Pilih Upload File" : "Input URL Manual"}
        </button>
      </div>

      <input type="hidden" name={name} value={imageUrl} />

      {!showManualUrl ? (
        <div className="space-y-2">
          {imageUrl ? (
            <div className="flex items-center justify-between gap-4 p-3 bg-[#f4f0e8] border border-[#1d1b18]/20 rounded">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-[#e9e2d6] border border-[#1d1b18]/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Pratinjau gambar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-[#1d1b18] truncate max-w-[280px] sm:max-w-md">{imageUrl}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 mt-0.5">
                    <Check className="w-3 h-3" /> Foto siap digunakan
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-[#1d1b18]/50 hover:text-red-700 rounded transition-colors"
                title="Hapus foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#1d1b18]/25 hover:border-[#bd4b2a] rounded bg-[#f4f0e8] hover:bg-[#faf7f2] transition-all text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-[#bd4b2a]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="font-mono text-xs">Sedang mengunggah gambar...</p>
                </div>
              ) : (
                <>
                  <div className="p-2.5 rounded-full bg-[#bd4b2a]/10 text-[#bd4b2a] group-hover:scale-105 transition-transform mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-[#1d1b18]">
                    Klik untuk memilih foto dari komputer
                  </p>
                  <p className="font-mono text-[11px] text-[#1d1b18]/50 mt-1">
                    PNG, JPG, WebP, atau SVG (maksimal 8MB)
                  </p>
                </>
              )}
            </div>
          )}

          {uploadError && (
            <p className="font-mono text-xs text-red-600 mt-1">{uploadError}</p>
          )}
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={placeholder || "https://... atau /projects/..."}
            className="w-full bg-[#f4f0e8] border border-[#1d1b18]/20 rounded px-3.5 py-2 text-sm text-[#1d1b18] placeholder:text-[#1d1b18]/30 focus:outline-none focus:border-[#bd4b2a] focus:ring-1 focus:ring-[#bd4b2a] font-sans transition-all"
          />
          {imageUrl && (
            <div className="mt-2 relative w-24 h-16 rounded overflow-hidden border border-[#1d1b18]/15 bg-[#f4f0e8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Pratinjau URL"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
