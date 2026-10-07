"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";
import Reveal from "@/components/ui/Reveal";

export default function DirectUplink() {
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

  const email = DOSSIER_PROFILE.socials.find((social) => social.label === "EMAIL");
  const socials = DOSSIER_PROFILE.socials.filter((social) => social.label !== "EMAIL");

  return (
    <section id="kontak" className="flex min-h-svh items-center bg-[#E9E2D6] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <p className="text-sm font-medium text-[#BD4B2A]">Kontak</p>
          <h2 className="mt-3 max-w-lg text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">Mari bicarakan ide atau proyek Anda.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#625C54]">Terbuka untuk percakapan tentang AI, rekayasa perangkat lunak, dan produk digital.</p>
          {email && (
            <a href={email.url} className="mt-7 inline-flex min-h-11 items-center gap-2 text-base font-medium text-[#4D463D] hover:text-[#BD4B2A]">
              {email.address} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noreferrer" className="min-h-10 inline-flex items-center text-sm text-[#625C54] hover:text-[#1D1B18]">
                {social.label === "GITHUB" ? "GitHub" : social.label === "LINKEDIN" ? "LinkedIn" : social.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[#4D463D]">Nama</label>
              <input id="contact-name" type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Nama Anda" className="min-h-12 w-full rounded-md border border-[#1D1B18]/15 bg-[#F4F0E8] px-4 text-sm text-[#1D1B18] placeholder:text-[#81776A] focus:border-[#BD4B2A] focus:outline-none focus:ring-2 focus:ring-[#BD4B2A]/20" />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-[#4D463D]">Email</label>
              <input id="contact-email" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="nama@email.com" className="min-h-12 w-full rounded-md border border-[#1D1B18]/15 bg-[#F4F0E8] px-4 text-sm text-[#1D1B18] placeholder:text-[#81776A] focus:border-[#BD4B2A] focus:outline-none focus:ring-2 focus:ring-[#BD4B2A]/20" />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[#4D463D]">Pesan</label>
            <textarea id="contact-message" rows={5} required value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Ceritakan sedikit tentang ide atau kebutuhan Anda." className="w-full resize-y rounded-md border border-[#1D1B18]/15 bg-[#F4F0E8] px-4 py-3 text-sm text-[#1D1B18] placeholder:text-[#81776A] focus:border-[#BD4B2A] focus:outline-none focus:ring-2 focus:ring-[#BD4B2A]/20" />
          </div>

          {status === "error" && <div role="alert" className="flex items-center gap-2 text-sm text-[#8B514B]"><AlertCircle size={16} /><span>{errorMessage}</span></div>}
          {status === "success" && <div role="status" className="flex items-center gap-2 text-sm text-[#4D463D]"><CheckCircle2 size={16} /><span>Pesan berhasil dikirim. Terima kasih.</span></div>}

          <button type="submit" disabled={status === "loading"} className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#1D1B18] px-5 text-sm font-medium text-[#F4F0E8] transition-colors hover:bg-[#BD4B2A] disabled:cursor-not-allowed disabled:opacity-60">
            {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</> : <>Kirim pesan <ArrowUpRight size={16} aria-hidden="true" /></>}
          </button>
        </form>
        </Reveal>
      </div>
    </section>
  );
}
