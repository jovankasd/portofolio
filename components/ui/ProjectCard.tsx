import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/shared/types";

export default function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <article className="group grid gap-5 border-t border-[#1d1b18]/20 py-7 sm:grid-cols-[72px_1fr] sm:gap-7">
      <div className="font-mono text-xs text-[#bd4b2a]">0{index + 1}</div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div>
          <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#1d1b18]/48">
            {project.ai_tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <h3 className="font-display text-3xl leading-[0.98] tracking-[-0.045em] text-[#1d1b18] sm:text-4xl">{project.title}</h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#1d1b18]/68">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] text-[#1d1b18]/52">
            {project.tech_stack.map((tech) => <span key={tech}>{tech}</span>)}
          </div>
          <div className="mt-6 flex gap-5 text-sm font-medium">
            {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#bd4b2a] hover:underline">Lihat proyek <ArrowUpRight className="h-4 w-4" /></a>}
            <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#1d1b18] hover:underline"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.54 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg> Kode</a>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#d9d2c5]">
          <Image src={project.thumbnail_url} alt={`Ilustrasi ${project.title}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 280px" />
        </div>
      </div>
    </article>
  );
}
