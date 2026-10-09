"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";
import Reveal from "@/components/ui/Reveal";

export default function DirectUplink({ 
  title, 
  content,
  socials = DOSSIER_PROFILE.socials
}: { 
  title?: string | null; 
  content?: string | null;
  socials?: { label: string; url: string; address?: string }[];
}) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Nama, email, dan pesan wajib diisi.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pesan belum dapat dikirim.");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: unknown) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Pesan belum dapat dikirim. Silakan coba lagi.");
    }
  };

  const email = socials.find((social) => social.label === "EMAIL");
  const otherSocials = socials.filter((social) => social.label !== "EMAIL");

  return (
    <section id="kontak" className="flex min-h-svh items-center bg-surface-container-low px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <p className="mb-3 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant">Kontak</p>
          <h2 className="mt-3 max-w-lg text-balance font-headline-lg text-[36px] font-semibold leading-[42px] tracking-[-0.02em] text-on-surface sm:text-[56px] sm:leading-[60px] sm:tracking-[-0.03em]">{title || "Mari bicarakan ide atau proyek Anda."}</h2>
          <p className="mt-4 max-w-md text-pretty font-body-md text-[15px] leading-[24px] tracking-[-0.005em] text-on-surface-variant">{content || "Terbuka untuk percakapan tentang AI, rekayasa perangkat lunak, dan produk digital."}</p>
          {email && (
            <a href={email.url} className="mt-8 inline-flex h-[48px] items-center gap-2 font-label-nav text-[14px] font-medium text-on-surface transition-colors hover:text-outline">
              {email.address} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {otherSocials.map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noreferrer" className="inline-flex h-[40px] items-center font-label-nav text-[14px] font-medium text-on-surface-variant transition-colors hover:text-on-surface">
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-2 block font-label-nav text-[14px] font-medium text-on-surface">Nama</label>
              <input id="contact-name" type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Nama Anda" className="h-[48px] w-full rounded-[0.75rem] border border-outline-variant bg-surface px-4 font-body-md text-[15px] text-on-surface placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block font-label-nav text-[14px] font-medium text-on-surface">Email</label>
              <input id="contact-email" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="nama@email.com" className="h-[48px] w-full rounded-[0.75rem] border border-outline-variant bg-surface px-4 font-body-md text-[15px] text-on-surface placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-2 block font-label-nav text-[14px] font-medium text-on-surface">Pesan</label>
            <textarea id="contact-message" rows={5} required value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Ceritakan sedikit tentang ide atau kebutuhan Anda." className="w-full resize-y rounded-[0.75rem] border border-outline-variant bg-surface px-4 py-3 font-body-md text-[15px] text-on-surface placeholder:text-outline-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          {status === "error" && <div role="alert" className="flex items-center gap-2 font-body-sm text-error"><AlertCircle size={16} /><span>{errorMessage}</span></div>}
          {status === "success" && <div role="status" className="flex items-center gap-2 font-body-sm text-on-surface"><CheckCircle2 size={16} /><span>Pesan berhasil dikirim. Terima kasih.</span></div>}

          <button type="submit" disabled={status === "loading"} className="inline-flex h-[48px] items-center gap-2 rounded-pill bg-primary px-[28px] font-label-nav text-[14px] font-medium text-on-primary transition-colors hover:bg-[#262930] disabled:cursor-not-allowed disabled:opacity-60">
            {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</> : <>Kirim pesan <ArrowUpRight size={16} aria-hidden="true" /></>}
          </button>
        </form>
        </Reveal>
      </div>
    </section>
  );
}
