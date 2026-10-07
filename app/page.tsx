"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import ProjectCard from "@/components/ui/ProjectCard";
import CredentialModal from "@/components/ui/CredentialModal";
import DirectUplink from "@/components/ui/DirectUplink";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";
import { INITIAL_CREDENTIALS, INITIAL_PROJECTS } from "@/shared/constants/defaults";
import type { CredentialItem } from "@/shared/types";

const practices = [
  ["01", "Sistem agen", "Membuat alur kerja AI yang jelas batasnya, dapat diaudit, dan tetap berguna saat kondisi berubah."],
  ["02", "Produk yang dapat dijelaskan", "Menerjemahkan persoalan teknis menjadi pengalaman yang mudah dipahami orang yang menggunakannya."],
  ["03", "Keandalan", "Memilih aturan, validasi, dan pengukuran yang membuat perangkat lunak aman untuk diandalkan."],
];

export default function HomePage() {
  const [selectedCredential, setSelectedCredential] = useState<CredentialItem | null>(null);

  return (
    <main id="top" className="overflow-hidden bg-[#f4f0e8] text-[#1d1b18]">
      <Navbar />

      <section className="relative min-h-[760px] px-5 pb-16 pt-36 sm:px-8 sm:pt-44 lg:px-12">
        <div aria-hidden="true" className="absolute right-[-12rem] top-24 h-[31rem] w-[31rem] rounded-full border border-[#bd4b2a]/30 sm:right-[-4rem]" />
        <div aria-hidden="true" className="absolute right-[7%] top-[13rem] h-24 w-24 rounded-full bg-[#bd4b2a]" />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
          <div>
            <p className="mb-7 font-mono text-xs uppercase tracking-[0.16em] text-[#bd4b2a]">Portfolio · {DOSSIER_PROFILE.location}</p>
            <h1 className="max-w-5xl font-display text-[clamp(3.8rem,9vw,9.5rem)] leading-[0.82] tracking-[-0.075em]">
              Merancang AI<br />yang <em className="font-display text-[#bd4b2a]">benar-benar</em><br />bekerja.
            </h1>
            <div className="mt-12 grid max-w-2xl gap-7 sm:grid-cols-[1.25fr_0.75fr]">
              <p className="text-lg leading-relaxed text-[#1d1b18]/72">{DOSSIER_PROFILE.bio}</p>
              <div className="border-l border-[#1d1b18]/25 pl-5 text-sm leading-relaxed text-[#1d1b18]/60">Berbasis di Indonesia. Bekerja di antara sistem, bahasa, dan pengalaman manusia.</div>
            </div>
            <div className="mt-10 flex flex-wrap gap-5 text-sm font-medium">
              <a href="#karya" className="inline-flex items-center gap-2 border-b border-[#1d1b18] pb-1 hover:text-[#bd4b2a] hover:border-[#bd4b2a]">Lihat karya <ArrowDownRight className="h-4 w-4" /></a>
              <a href={`/${DOSSIER_PROFILE.cv_filename}`} download className="inline-flex items-center gap-2 border-b border-[#1d1b18]/30 pb-1 hover:border-[#1d1b18]"><Download className="h-4 w-4" /> Unduh CV</a>
            </div>
          </div>
          <div className="self-end border-t border-[#1d1b18]/20 pt-4 font-mono text-xs leading-relaxed text-[#1d1b18]/55 lg:mb-2">
            <p>FOKUS SAAT INI</p>
            <p className="mt-2 text-[#1d1b18]">Agentic systems<br />Knowledge infrastructure<br />Product engineering</p>
          </div>
        </div>
      </section>

      <section id="tentang" className="border-y border-[#1d1b18]/15 bg-[#e9e2d6] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#bd4b2a]">Cara saya bekerja</p>
          <div>
            <p className="max-w-4xl font-display text-4xl leading-[1.02] tracking-[-0.05em] sm:text-6xl">Teknologi yang baik terasa sederhana di tangan orang lain, meski pembuatannya tidak pernah sesederhana itu.</p>
            <div className="mt-14 grid gap-x-8 gap-y-8 md:grid-cols-3">
              {practices.map(([number, title, text]) => <div key={number} className="border-t border-[#1d1b18]/25 pt-4"><span className="font-mono text-xs text-[#bd4b2a]">{number}</span><h2 className="mt-6 font-display text-2xl tracking-[-0.04em]">{title}</h2><p className="mt-3 text-sm leading-relaxed text-[#1d1b18]/65">{text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="karya" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14 grid gap-7 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[#bd4b2a]">Pilihan karya</p><div><h2 className="font-display text-5xl leading-[0.9] tracking-[-0.06em] sm:text-7xl">Beberapa hal<br />yang saya bangun.</h2><p className="mt-5 max-w-lg text-base leading-relaxed text-[#1d1b18]/65">Eksperimen dan fondasi teknis untuk sistem yang lebih dapat dipercaya.</p></div></div>
          <div>{INITIAL_PROJECTS.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
        </div>
      </section>

      <section id="rekam-jejak" className="bg-[#1d1b18] px-5 py-20 text-[#f4f0e8] sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d67b5a]">Rekam jejak</p><div><h2 className="font-display text-5xl leading-[0.9] tracking-[-0.06em] sm:text-7xl">Pembelajaran yang bisa dibuktikan.</h2><div className="mt-14 grid gap-0 md:grid-cols-3">{INITIAL_CREDENTIALS.map((credential) => <button type="button" key={credential.id} onClick={() => setSelectedCredential(credential)} className="group border-t border-[#f4f0e8]/25 py-5 text-left md:pr-8"><span className="font-mono text-xs text-[#d67b5a]">{credential.issue_date}</span><h3 className="mt-5 font-display text-2xl leading-none tracking-[-0.04em] group-hover:text-[#d67b5a]">{credential.title}</h3><p className="mt-3 text-sm text-[#f4f0e8]/55">{credential.issuer}</p><span className="mt-6 inline-flex items-center gap-1 text-sm text-[#f4f0e8]/75">Lihat bukti <ArrowUpRight className="h-4 w-4" /></span></button>)}</div></div></div>
      </section>

      <DirectUplink />
      <footer className="bg-[#f4f0e8] px-5 py-6 font-mono text-[11px] text-[#1d1b18]/50 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] justify-between"><span>© {new Date().getFullYear()} {DOSSIER_PROFILE.codename}</span><span>Dibuat dengan perhatian.</span></div></footer>
      <CredentialModal credential={selectedCredential} onClose={() => setSelectedCredential(null)} />
    </main>
  );
}
