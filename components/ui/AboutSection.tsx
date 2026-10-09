import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";

interface Principle {
  number: string;
  title: string;
  description: string;
}

interface Props {
  skills?: string[];
  tools?: string[];
  principles?: Principle[];
  title?: string | null;
  content?: string | null;
}

export default function AboutSection({ skills = [], tools = [], principles = [], title, content }: Props) {
  const displayTitle = title || "Di balik sistem yang rumit, pengalaman harus terasa sederhana.";
  const displayContent = content || DOSSIER_PROFILE.bio;

  return (
    <section id="tentang" className="flex min-h-svh flex-col justify-center border-y border-outline-variant bg-surface px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="w-full">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="mb-3 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant">Tentang saya</p>
          <h2 className="mt-3 max-w-2xl text-balance font-headline-lg text-[36px] font-semibold leading-[42px] tracking-[-0.02em] text-on-surface sm:text-[56px] sm:leading-[60px] sm:tracking-[-0.03em]">
            {displayTitle}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-pretty font-body-md text-[15px] leading-[24px] tracking-[-0.005em] text-on-surface-variant">
            {displayContent.split("\n").filter((p) => p.trim() !== "").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-8 flex flex-col gap-4 border-l border-outline-variant pl-4 sm:pl-5">
            {skills.length > 0 && (
              <div>
                <p className="mb-2 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant">Core Stack</p>
                <p className="font-body-md text-[15px] leading-[24px] tracking-[-0.005em] text-on-surface">
                  {skills.join(", ")}
                </p>
              </div>
            )}
            {tools.length > 0 && (
              <div>
                <p className="mb-2 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant">Tools & Platforms</p>
                <p className="font-body-md text-[15px] leading-[24px] tracking-[-0.005em] text-on-surface">
                  {tools.join(", ")}
                </p>
              </div>
            )}
          </div>

          <Link href="#karya" className="mt-10 inline-flex h-10 items-center gap-2 font-label-nav text-[14px] font-medium text-on-surface-variant transition-colors hover:text-on-surface">
            Lihat karya pilihan <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="self-center divide-y divide-outline-variant border-y border-outline-variant">
          {principles.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 50}>
              <article className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr] sm:gap-4 group cursor-default transition-colors hover:bg-surface-container-lowest">
                <span className="font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-outline transition-colors duration-300 ease-in-out group-hover:text-primary">{principle.number}</span>
                <div>
                  <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">{principle.title}</h3>
                  <p className="mt-2 max-w-md text-pretty font-body-sm text-[13px] leading-[20px] text-on-surface-variant">{principle.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
