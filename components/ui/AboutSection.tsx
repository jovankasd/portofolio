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
    <section id="tentang" className="flex min-h-svh flex-col justify-center border-y border-[#1D1B18]/10 bg-[#E9E2D6] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="w-full">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="text-sm font-medium text-[#BD4B2A]">Tentang saya</p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            {displayTitle}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-pretty text-base leading-7 text-[#625C54] sm:text-lg sm:leading-8">
            {displayContent.split("\n").filter((p) => p.trim() !== "").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-8 flex flex-col gap-4 border-l border-[#1D1B18]/10 pl-4 sm:pl-5">
            {skills.length > 0 && (
              <div>
                <p className="text-xs font-mono text-[#81776A] uppercase tracking-widest mb-1.5">Core Stack</p>
                <p className="text-sm leading-relaxed text-[#625C54] font-medium">
                  {skills.join(", ")}
                </p>
              </div>
            )}
            {tools.length > 0 && (
              <div>
                <p className="text-xs font-mono text-[#81776A] uppercase tracking-widest mb-1.5">Tools & Platforms</p>
                <p className="text-sm leading-relaxed text-[#625C54] font-medium">
                  {tools.join(", ")}
                </p>
              </div>
            )}
          </div>

          <Link href="#karya" className="mt-10 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#4D463D] transition-colors hover:text-[#BD4B2A]">
            Lihat karya pilihan <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="self-center divide-y divide-[#1D1B18]/15 border-y border-[#1D1B18]/15">
          {principles.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 50}>
              <article className="grid gap-2 py-5 sm:grid-cols-[2.5rem_1fr] sm:gap-4 group cursor-default">
                <span className="font-mono text-xs text-[#81776A] transition-colors duration-300 ease-in-out group-hover:text-[#BD4B2A]">{principle.number}</span>
                <div>
                  <h3 className="text-base font-medium">{principle.title}</h3>
                  <p className="mt-1.5 max-w-md text-pretty text-sm leading-6 text-[#625C54]">{principle.description}</p>
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
