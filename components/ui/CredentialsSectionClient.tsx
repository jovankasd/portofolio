"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CredentialModal from "@/components/ui/CredentialModal";
import type { CredentialItem } from "@/shared/types";

interface Props {
  credentials: CredentialItem[];
  title?: string | null;
  content?: string | null;
}

export default function CredentialsSectionClient({ credentials, title, content }: Props) {
  const [selectedCredential, setSelectedCredential] = useState<CredentialItem | null>(null);

  return (
    <>
      <section id="rekam-jejak" className="flex min-h-svh items-center bg-background px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <Reveal>
            <p className="mb-3 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant">Rekam jejak</p>
            <h2 className="mt-3 text-balance font-headline-lg text-[36px] font-semibold leading-[42px] tracking-[-0.02em] text-on-surface sm:text-[56px] sm:leading-[60px] sm:tracking-[-0.03em]">{title || "Belajar, mencoba, dan membuktikan."}</h2>
            <p className="mt-4 max-w-sm text-pretty font-body-md text-[15px] leading-[24px] tracking-[-0.005em] text-on-surface-variant">{content || "Pendidikan dan bukti belajar yang melengkapi pengalaman membangun sistem."}</p>
          </Reveal>
          <div>
            <Reveal>
              <article className="flex flex-col gap-3 border-y border-outline-variant py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <p className="font-label-nav text-[14px] text-on-surface-variant">2023—sekarang · Semester 7</p>
                  <h3 className="mt-2 font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">Teknik Informatika</h3>
                  <p className="mt-1 font-body-sm text-[13px] leading-[20px] text-on-surface-variant">Universitas Pamulang</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-surface-container px-3 py-1 font-label-nav text-[12px] font-medium text-on-surface">Sedang menempuh</span>
              </article>
            </Reveal>
            <div className="divide-y divide-outline-variant border-b border-outline-variant">
              {credentials.map((credential, index) => (
                <Reveal key={credential.id} delay={index * 80}>
                <article className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-label-nav text-[14px] text-on-surface-variant">{credential.issuer} · {credential.issue_date}</p>
                    <h3 className="mt-2 font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">{credential.title}</h3>
                  </div>
                  <button type="button" onClick={() => setSelectedCredential(credential)} className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full border border-outline-variant px-4 font-label-nav text-[14px] font-medium text-on-surface transition-colors hover:border-outline sm:self-auto">
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
