import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/shared/types";
import Reveal from "@/components/ui/Reveal";

export default function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <Reveal delay={index * 90}>
    <article className="group grid gap-6 py-8 sm:py-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-14">
      <div>
        <p className="text-sm text-[#81776A]">0{index + 1} <span className="mx-1.5">/</span> {project.ai_tags.slice(0, 2).join(" · ")}</p>
        <h3 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">{project.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#625C54] sm:text-base sm:leading-7">{project.summary}</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#625C54]">{project.description}</p>

        <p className="mt-5 text-xs text-[#81776A]">{project.tech_stack.slice(0, 4).join(" · ")}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-[#BD4B2A] hover:text-[#1D1B18]">
              Lihat proyek <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-[#625C54] hover:text-[#1D1B18]">
            Kode sumber <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="project-visual relative aspect-[16/10] overflow-hidden rounded-lg bg-[#E9E2D6]">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={`Visual ${project.title}`}
            fill
            className="object-cover grayscale"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1D1B18]/5 text-[#81776A]">
            <span className="text-sm">Tidak ada pratinjau</span>
          </div>
        )}
      </div>
    </article>
    </Reveal>
  );
}
