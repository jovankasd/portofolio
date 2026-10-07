import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
import { getProjects, getCredentials, getPageBySlug } from "@/server/db/queries";

export const revalidate = 60; // optionally revalidate every 60s

export default async function HomePage() {
  const [dbProjects, dbCredentials, berandaPage, tentangPage, rekamJejakPage, hubungiSayaPage, footerPage] = await Promise.all([
    getProjects(),
    getCredentials(),
    getPageBySlug('beranda'),
    getPageBySlug('tentang'),
    getPageBySlug('rekam-jejak'),
    getPageBySlug('hubungi-saya'),
    getPageBySlug('footer'),
  ]);

  const projects = dbProjects.length > 0 ? dbProjects : INITIAL_PROJECTS;
  const credentials = dbCredentials.length > 0 ? dbCredentials : INITIAL_CREDENTIALS;
  
  const skillsStr = tentangPage?.metadata?.skills as string | undefined;
  const skills = skillsStr ? skillsStr.split(",").map(s => s.trim()).filter(Boolean) : INITIAL_SKILLS;
    
  const toolsStr = tentangPage?.metadata?.tools as string | undefined;
  const tools = toolsStr ? toolsStr.split(",").map(s => s.trim()).filter(Boolean) : INITIAL_TOOLS;
    
  const principles = tentangPage?.metadata?.principles && Array.isArray(tentangPage.metadata.principles) && tentangPage.metadata.principles.length > 0 
    ? (tentangPage.metadata.principles as unknown as { number: string; title: string; description: string }[]) 
    : INITIAL_PRINCIPLES;

  const footerText = (footerPage?.metadata?.footer_text as string | undefined) || `© ${new Date().getFullYear()} · ${DOSSIER_PROFILE.location}`;

  const socialsData = hubungiSayaPage?.metadata?.socials && Array.isArray(hubungiSayaPage.metadata.socials) && hubungiSayaPage.metadata.socials.length > 0 
    ? (hubungiSayaPage.metadata.socials as unknown as { label: string; url: string; address?: string }[])
    : DOSSIER_PROFILE.socials;

  return (
    <main id="top" className="min-h-dvh bg-[#F4F0E8] text-[#1D1B18]">
      <Navbar />

      <HeroSection metadata={berandaPage?.metadata} cvUrl={(berandaPage?.metadata?.cv_url as string | undefined) || DOSSIER_PROFILE.cv_filename} />

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

      <CredentialsSectionClient 
        credentials={credentials as unknown as CredentialItem[]} 
        title={rekamJejakPage?.title}
        content={rekamJejakPage?.content}
      />

      <DirectUplink 
        title={hubungiSayaPage?.title}
        content={hubungiSayaPage?.content}
        socials={socialsData}
      />

      <footer className="border-t border-[#1D1B18]/10 px-5 py-7 text-sm text-[#625C54] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-[#1D1B18]">{DOSSIER_PROFILE.codename}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{footerText}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
