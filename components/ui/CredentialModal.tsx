"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ExternalLink, Award, Image as ImageIcon } from "lucide-react";
import type { CredentialItem } from "@/shared/types";

export default function CredentialModal({ credential, onClose }: { credential: CredentialItem | null; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"cert" | "proof">("cert");

  useEffect(() => {
    if (!credential) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [credential, onClose]);

  if (!credential) return null;
  const imageUrl = activeTab === "proof" && credential.proof_image_url ? credential.proof_image_url : credential.cert_image_url;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="credential-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-[#1D1B18]/65 backdrop-blur-sm" aria-label="Tutup jendela bukti" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#1D1B18]/10 bg-[#F4F0E8] p-5 text-[#1D1B18] shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-5 border-b border-[#1D1B18]/10 pb-5">
          <div>
            <p className="text-sm text-[#625C54]">{credential.issuer} · {credential.issue_date}</p>
            <h2 id="credential-modal-title" className="mt-2 text-2xl font-medium tracking-tight">{credential.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[#1D1B18]/10 text-[#625C54] hover:bg-[#E9E2D6] hover:text-[#1D1B18]" aria-label="Tutup">
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        {credential.proof_image_url && (
          <div className="my-4 flex gap-2" role="tablist" aria-label="Jenis dokumen">
            <button type="button" role="tab" aria-selected={activeTab === "cert"} onClick={() => setActiveTab("cert")} className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm ${activeTab === "cert" ? "bg-[#1D1B18] text-[#F4F0E8]" : "border border-[#1D1B18]/10 text-[#625C54] hover:bg-[#E9E2D6]"}`}><Award size={15} /> Sertifikat</button>
            <button type="button" role="tab" aria-selected={activeTab === "proof"} onClick={() => setActiveTab("proof")} className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm ${activeTab === "proof" ? "bg-[#1D1B18] text-[#F4F0E8]" : "border border-[#1D1B18]/10 text-[#625C54] hover:bg-[#E9E2D6]"}`}><ImageIcon size={15} /> Dokumentasi</button>
          </div>
        )}

        <div className="relative my-5 h-72 w-full overflow-hidden rounded-lg bg-[#E9E2D6] sm:h-80">
          {imageUrl ? (
            <Image src={imageUrl} alt={`Bukti ${credential.title}`} fill className="object-cover p-4" sizes="(max-width: 768px) 100vw, 640px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1D1B18]/5 text-[#81776A]">
              <span className="text-sm">Dokumen fisik</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1D1B18]/10 pt-4">
          <span className="text-sm text-[#625C54]">{credential.category === "competition" ? "Pencapaian" : "Sertifikasi"}</span>
          {credential.verification_url ? (
            <a href={credential.verification_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1D1B18] px-4 text-sm font-medium text-[#F4F0E8] hover:bg-[#BD4B2A]">
              <ExternalLink size={15} aria-hidden="true" /> Buka tautan verifikasi
            </a>
          ) : <span className="text-sm text-[#625C54]">Dokumen pribadi</span>}
        </div>
      </div>
    </div>
  );
}
