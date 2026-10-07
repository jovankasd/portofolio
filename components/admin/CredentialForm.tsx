import { X } from "lucide-react";
import Field from "@/components/shared/Field";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { CredentialRow } from "@/server/db/types";

interface CredentialFormProps {
  initial: CredentialRow | null;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function CredentialForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: CredentialFormProps) {
  return (
    <form action={onSubmit} className="mb-8 p-6 sm:p-7 rounded border border-[#1d1b18]/20 bg-[#e9e2d6] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#1d1b18]/15">
        <h2 className="font-display text-xl text-[#1d1b18] tracking-tight">
          {initial ? "Edit Kredensial & Sertifikasi" : "Tambah Kredensial Baru"}
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
        <Field label="Judul Kredensial / Sertifikat" name="title" defaultValue={initial?.title} required placeholder="Contoh: Certified AI Architect" />
        <Field label="Penerbit (Issuer)" name="issuer" defaultValue={initial?.issuer} required placeholder="Contoh: Google Cloud / DeepMind" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tahun / Tanggal Terbit" name="issue_date" defaultValue={initial?.issue_date} required placeholder="2025" />
        <div>
          <label className="block font-mono text-xs text-[#1d1b18]/65 uppercase tracking-wider mb-1.5">
            Kategori
          </label>
          <select
            name="category"
            defaultValue={initial?.category ?? "certificate"}
            className="w-full bg-[#f4f0e8] border border-[#1d1b18]/20 rounded px-3.5 py-2 text-sm text-[#1d1b18] focus:outline-none focus:border-[#bd4b2a] font-sans"
          >
            <option value="certificate">Sertifikat Resmi</option>
            <option value="competition">Kompetisi / Hackathon</option>
          </select>
        </div>
      </div>

      <ImageUploadField
        label="Gambar Sertifikat Resmi"
        name="cert_image_url"
        defaultValue={initial?.cert_image_url}
        placeholder="/credentials/cert-ai-architect.svg atau URL gambar"
      />

      <ImageUploadField
        label="Foto Dokumentasi / Bukti Lapangan (opsional)"
        name="proof_image_url"
        defaultValue={initial?.proof_image_url}
        placeholder="/credentials/proof-hackathon.svg atau URL foto"
      />

      <Field
        label="URL Verifikasi Resmi (opsional)"
        name="verification_url"
        type="url"
        defaultValue={initial?.verification_url}
        placeholder="https://credential.net/..."
      />
      <Field label="Urutan Tampil (Sort Order)" name="sort_order" type="number" defaultValue={String(initial?.sort_order ?? 99)} />

      <div className="flex gap-3 pt-3 border-t border-[#1d1b18]/15">
        <button
          type="submit"
          disabled={isPending}
          className="font-mono text-xs px-5 py-2 bg-[#bd4b2a] hover:bg-[#a83f21] text-[#f8f3e9] rounded font-medium disabled:opacity-40 transition-colors"
        >
          {isPending ? "Menyimpan data..." : "Simpan Kredensial"}
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
