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
    <main id="top" className="min-h-dvh bg-background text-on-surface">
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
          <Reveal className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant">Pilihan karya</p>
              <h2 className="text-balance font-headline-lg text-[36px] font-semibold leading-[42px] tracking-[-0.02em] text-on-surface sm:text-[56px] sm:leading-[60px] sm:tracking-[-0.03em]">Beberapa hal yang saya bangun.</h2>
            </div>
            <p className="max-w-md text-pretty font-body-md text-[15px] leading-[24px] tracking-[-0.005em] text-on-surface-variant">Proyek tentang cara membuat sistem AI lebih berguna, terarah, dan dapat diandalkan.</p>
          </Reveal>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {projects.map((project, index) => <ProjectCard key={project.id} project={project as unknown as ProjectItem} index={index} />)}
          </div>
          
          <Reveal className="mt-12 flex justify-center sm:justify-start">
            <Link href="#tentang" className="inline-flex h-[48px] items-center gap-2 rounded-pill border border-outline-variant px-[28px] font-label-nav text-[14px] font-medium text-on-surface transition-all duration-150 hover:border-outline hover:bg-surface-container-lowest">
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
