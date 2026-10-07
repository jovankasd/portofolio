import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/ui/HeroSection";
import AboutSection from "@/components/ui/AboutSection";
import ProjectCard from "@/components/ui/ProjectCard";
import DirectUplink from "@/components/ui/DirectUplink";
import Reveal from "@/components/ui/Reveal";
import CredentialsSectionClient from "@/components/ui/CredentialsSectionClient";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";
import { INITIAL_CREDENTIALS, INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_TOOLS, INITIAL_PRINCIPLES } from "@/shared/constants/defaults";
import type { ProjectItem, CredentialItem } from "@/shared/types";
import { getProjects, getCredentials, getSiteSettings, getPageBySlug } from "@/server/db/queries";

export const revalidate = 60; // optionally revalidate every 60s

export default async function HomePage() {
  const [dbProjects, dbCredentials, siteSettings, berandaPage, tentangPage] = await Promise.all([
    getProjects(),
    getCredentials(),
    getSiteSettings(),
    getPageBySlug('beranda'),
    getPageBySlug('tentang'),
  ]);

  const projects = dbProjects.length > 0 ? dbProjects : INITIAL_PROJECTS;
  const credentials = dbCredentials.length > 0 ? dbCredentials : INITIAL_CREDENTIALS;
  
  const skills = siteSettings && Array.isArray(siteSettings.skills) && siteSettings.skills.length > 0 
    ? (siteSettings.skills as string[]) 
    : INITIAL_SKILLS;
    
  const tools = siteSettings && Array.isArray(siteSettings.tools) && siteSettings.tools.length > 0 
    ? (siteSettings.tools as string[]) 
    : INITIAL_TOOLS;
    
  const principles = siteSettings && Array.isArray(siteSettings.principles) && siteSettings.principles.length > 0 
    ? (siteSettings.principles as unknown as { number: string; title: string; description: string }[]) 
    : INITIAL_PRINCIPLES;

  const footerText = siteSettings?.footer_text || `© ${new Date().getFullYear()} · ${DOSSIER_PROFILE.location}`;

  return (
    <main id="top" className="min-h-dvh bg-[#F4F0E8] text-[#1D1B18]">
      <Navbar />

      <HeroSection metadata={berandaPage?.metadata} cvFilename={DOSSIER_PROFILE.cv_filename} />

      <AboutSection 
        skills={skills} 
        tools={tools} 
        principles={principles} 
        title={tentangPage?.title}
        content={tentangPage?.content}
      />

      <section id="karya" className="flex min-h-svh items-center px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-[#BD4B2A]">Pilihan karya</p>
              <h2 className="mt-3 text-balance text-3xl font-medium tracking-[-0.04em] sm:text-4xl">Beberapa hal yang saya bangun.</h2>
            </div>
            <p className="max-w-md text-pretty text-sm leading-6 text-[#625C54]">Proyek tentang cara membuat sistem AI lebih berguna, terarah, dan dapat diandalkan.</p>
          </Reveal>
          <div className="divide-y divide-[#1D1B18]/10 border-y border-[#1D1B18]/10">
            {projects.map((project, index) => <ProjectCard key={project.id} project={project as unknown as ProjectItem} index={index} />)}
          </div>
          <Reveal className="mt-8">
            <Link href="#tentang" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#4D463D] transition-colors hover:text-[#BD4B2A]">
              Kenali cara saya bekerja <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CredentialsSectionClient credentials={credentials as unknown as CredentialItem[]} />

      <DirectUplink />

      <footer className="border-t border-[#1D1B18]/10 px-5 py-7 text-sm text-[#625C54] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-[#1D1B18]">{DOSSIER_PROFILE.codename}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{footerText}</span>
            <Link href="/admin" className="transition-colors hover:text-[#BD4B2A]">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
