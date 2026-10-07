"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, ExternalLink, Award, Image as ImageIcon } from "lucide-react";
import type { CredentialItem } from "@/shared/types";

interface CredentialModalProps {
  credential: CredentialItem | null;
  onClose: () => void;
}

export default function CredentialModal({ credential, onClose }: CredentialModalProps) {
  const [activeTab, setActiveTab] = useState<"cert" | "proof">("cert");

  // Handle ESC key to close modal (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (credential) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // lock scroll
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [credential, onClose]);

  if (!credential) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="credential-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Warm charcoal backdrop with subtle blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1d1b18]/70 backdrop-blur-sm transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Modal Dialog Content - Editorial Warm */}
      <div className="relative w-full max-w-2xl bg-[#f4f0e8] text-[#1d1b18] border border-[#1d1b18]/15 rounded-lg shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#1d1b18]/15">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider text-[#bd4b2a] bg-[#bd4b2a]/10 border border-[#bd4b2a]/25">
                {credential.category}
              </span>
              <span className="font-mono text-xs text-[#1d1b18]/50">
                Terbit · {credential.issue_date}
              </span>
            </div>
            <h2
              id="credential-modal-title"
              className="text-2xl sm:text-3xl font-display font-medium text-[#1d1b18] tracking-tight leading-tight"
            >
              {credential.title}
            </h2>
            <p className="text-sm text-[#1d1b18]/65 mt-1.5">
              Diterbitkan oleh: <span className="font-medium text-[#1d1b18]">{credential.issuer}</span>
            </p>
          </div>

          {/* Close button with min 44px tap target */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] rounded border border-[#1d1b18]/15 text-[#1d1b18]/60 hover:text-[#1d1b18] hover:border-[#1d1b18]/30 hover:bg-[#1d1b18]/5 transition-all focus-visible:outline-2 focus-visible:outline-[#bd4b2a]"
            aria-label="Tutup jendela kredensial"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tab switch if proof image exists */}
        {credential.proof_image_url && (
          <div className="flex gap-2 my-4" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "cert"}
              onClick={() => setActiveTab("cert")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 min-h-[44px] rounded font-mono text-xs transition-colors ${
                activeTab === "cert"
                  ? "bg-[#bd4b2a] border border-[#bd4b2a] text-[#f8f3e9]"
                  : "bg-transparent border border-[#1d1b18]/20 text-[#1d1b18]/70 hover:text-[#1d1b18] hover:border-[#1d1b18]/40"
              }`}
            >
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              <span>SERTIFIKAT RESMI</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "proof"}
              onClick={() => setActiveTab("proof")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 min-h-[44px] rounded font-mono text-xs transition-colors ${
                activeTab === "proof"
                  ? "bg-[#bd4b2a] border border-[#bd4b2a] text-[#f8f3e9]"
                  : "bg-transparent border border-[#1d1b18]/20 text-[#1d1b18]/70 hover:text-[#1d1b18] hover:border-[#1d1b18]/40"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>DOKUMENTASI / FOTO BUKTI</span>
            </button>
          </div>
        )}

        {/* Image Preview Canvas */}
        <div className="relative w-full h-72 sm:h-80 rounded overflow-hidden border border-[#1d1b18]/15 bg-[#e9e2d6] my-5">
          <Image
            src={activeTab === "cert" ? credential.cert_image_url : (credential.proof_image_url || credential.cert_image_url)}
            alt={`Pratinjau ${credential.title}`}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#1d1b18]/15 flex items-center justify-between">
          <span className="font-mono text-xs text-[#1d1b18]/50">
            DOKUMEN TERVERIFIKASI
          </span>

          {credential.verification_url ? (
            <a
              href={credential.verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded bg-[#bd4b2a] hover:bg-[#a83f21] text-[#f8f3e9] font-medium text-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#bd4b2a]"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>VERIFIKASI PADA REGISTRI</span>
            </a>
          ) : (
            <span className="font-mono text-xs text-[#1d1b18]/50">
              ARSIP INTERNAL
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
