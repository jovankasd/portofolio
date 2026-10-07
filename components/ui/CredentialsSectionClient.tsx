"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CredentialModal from "@/components/ui/CredentialModal";
import type { CredentialItem } from "@/shared/types";

interface Props {
  credentials: CredentialItem[];
}

export default function CredentialsSectionClient({ credentials }: Props) {
  const [selectedCredential, setSelectedCredential] = useState<CredentialItem | null>(null);

  return (
    <>
      <section id="rekam-jejak" className="flex min-h-svh items-center bg-[#1D1B18] px-5 py-20 text-[#F4F0E8] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <Reveal>
            <p className="text-sm font-medium text-[#D67B5A]">Rekam jejak</p>
            <h2 className="mt-3 text-balance text-3xl font-medium leading-tight tracking-[-0.04em]">Belajar, mencoba, dan membuktikan.</h2>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-6 text-[#D7CEC0]/75">Pendidikan dan bukti belajar yang melengkapi pengalaman membangun sistem.</p>
          </Reveal>
          <div>
            <Reveal>
              <article className="flex flex-col gap-2 border-y border-white/15 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <p className="text-xs text-[#D67B5A]">2023—sekarang · Semester 7</p>
                  <h3 className="mt-2 text-lg font-medium">Teknik Informatika</h3>
                  <p className="mt-1 text-sm text-[#D7CEC0]/75">Universitas Pamulang</p>
                </div>
                <span className="text-xs text-[#D67B5A]">Sedang menempuh</span>
              </article>
            </Reveal>
            <div className="divide-y divide-white/15 border-b border-white/15">
              {credentials.map((credential, index) => (
                <Reveal key={credential.id} delay={index * 80}>
                <article className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between group">
                  <div>
                    <p className="text-xs text-[#D67B5A]">{credential.issuer} · {credential.issue_date}</p>
                    <h3 className="mt-2 text-lg font-medium">{credential.title}</h3>
                  </div>
                  <button type="button" onClick={() => setSelectedCredential(credential)} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm text-[#D7CEC0] transition-colors group-hover:text-[#BD4B2A] sm:self-auto">
                    Lihat bukti <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CredentialModal credential={selectedCredential} onClose={() => setSelectedCredential(null)} />
    </>
  );
}
