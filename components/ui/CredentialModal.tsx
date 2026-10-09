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
      <button type="button" onClick={onClose} className="absolute inset-0 bg-[#111215]/40 backdrop-blur-sm" aria-label="Tutup jendela bukti" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1rem] border border-outline-variant bg-surface p-5 text-on-surface shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-5 border-b border-outline-variant pb-5">
          <div>
            <p className="font-label-nav text-[14px] text-on-surface-variant">{credential.issuer} · {credential.issue_date}</p>
            <h2 id="credential-modal-title" className="mt-2 font-headline-sm text-[18px] font-semibold leading-[24px]">{credential.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface transition-colors" aria-label="Tutup">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {credential.proof_image_url && (
          <div className="my-5 flex gap-2" role="tablist" aria-label="Jenis dokumen">
            <button type="button" role="tab" aria-selected={activeTab === "cert"} onClick={() => setActiveTab("cert")} className={`inline-flex h-[40px] items-center gap-2 rounded-full px-4 font-label-nav text-[14px] font-medium transition-colors ${activeTab === "cert" ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface"}`}><Award size={16} /> Sertifikat</button>
            <button type="button" role="tab" aria-selected={activeTab === "proof"} onClick={() => setActiveTab("proof")} className={`inline-flex h-[40px] items-center gap-2 rounded-full px-4 font-label-nav text-[14px] font-medium transition-colors ${activeTab === "proof" ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface"}`}><ImageIcon size={16} /> Dokumentasi</button>
          </div>
        )}

        <div className="relative my-5 h-72 w-full overflow-hidden rounded-[0.5rem] bg-surface-container sm:h-80 border border-outline-variant">
          {imageUrl ? (
            <Image src={imageUrl} alt={`Bukti ${credential.title}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-variant text-on-surface-variant">
              <span className="font-label-nav text-[14px]">Dokumen fisik</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-5">
          <span className="font-label-nav text-[14px] font-medium text-on-surface-variant">{credential.category === "competition" ? "Pencapaian" : "Sertifikasi"}</span>
          {credential.verification_url ? (
            <a href={credential.verification_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-[40px] items-center gap-2 rounded-pill bg-primary px-[20px] font-label-nav text-[14px] font-medium text-on-primary hover:bg-[#262930] transition-colors">
              <ExternalLink size={16} aria-hidden="true" /> Buka tautan verifikasi
            </a>
          ) : <span className="font-label-nav text-[14px] font-medium text-on-surface-variant">Dokumen pribadi</span>}
        </div>
      </div>
    </div>
  );
}
