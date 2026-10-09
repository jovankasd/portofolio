import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/shared/types";
import Reveal from "@/components/ui/Reveal";

export default function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const mainLink = project.live_url || project.github_url || "#";
  
  return (
    <Reveal delay={index * 90}>
      <article className="group overflow-hidden rounded-[1rem] border border-outline-variant bg-surface-container-lowest transition-all duration-200 hover:border-primary">
        <a href={mainLink} target={mainLink !== "#" ? "_blank" : undefined} rel={mainLink !== "#" ? "noreferrer" : undefined} className="block relative aspect-[16/10] overflow-hidden bg-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={`Visual ${project.title}`}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container text-on-surface-variant">
              <span className="font-label-nav text-sm">Tidak ada pratinjau</span>
            </div>
          )}
        </a>
        <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <h3 className="font-headline-sm text-[18px] font-semibold leading-[24px] text-on-surface">{project.title}</h3>
            {project.summary && (
              <p className="line-clamp-2 font-body-sm text-[13px] leading-[20px] text-on-surface-variant mb-1 sm:hidden md:block">
                {project.summary}
              </p>
            )}
            <p className="font-body-sm text-[13px] leading-[20px] text-on-surface-variant">{project.ai_tags.slice(0, 3).join(" · ")}</p>
          </div>
          {mainLink !== "#" && (
            <a href={mainLink} target="_blank" rel="noreferrer" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-outline hover:text-on-surface" aria-label={`Lihat proyek ${project.title}`}>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}
