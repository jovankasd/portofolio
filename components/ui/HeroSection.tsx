import Image from "next/image";
import { ArrowDown, Download } from "lucide-react";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";

export default function HeroSection({ metadata, cvUrl }: { metadata?: any, cvUrl: string }) {
  const name = metadata?.hero_name || "Jovanka Surya Dilla";
  const eyebrow = metadata?.hero_eyebrow || "Personal portfolio · AI systems";
  const rolePrimary = metadata?.hero_role_primary || "AI Orchestrator";
  const roleSecondary = metadata?.hero_role_secondary || "Agentic AI Engineer";
  const description = metadata?.hero_description || "Merancang sistem AI yang membantu pekerjaan nyata terasa lebih jelas, terarah, dan bisa diandalkan.";
  const caption = metadata?.hero_caption || "AI yang bekerja untuk manusia.";
  const ctaText = metadata?.hero_cta_text || "Lihat karya";
  const cvButtonText = metadata?.hero_cv_button_text || "Unduh CV";
  const photoUrl = metadata?.profile_photo_url || "/images/FotoSaya_cutout.png";

  const [firstName, ...restName] = name.split(" ");
  const lastName = restName.join(" ");
  
  const finalCvUrl = cvUrl.startsWith("http") ? cvUrl : `/${cvUrl}`;

  return (
    <section id="beranda" className="home-hero relative flex min-h-svh items-center overflow-hidden px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-2">
          <div className="home-copy relative z-10">
            <p className="mb-5 flex items-center gap-3 text-sm font-medium text-[#BD4B2A]">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#BD4B2A]" />
              {eyebrow}
            </p>
            <h1 className="home-name text-balance leading-[0.84] text-[#1D1B18]">
              <span className="block">{firstName}</span>
              {lastName && <span className="home-name-second block">{lastName}</span>}
            </h1>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p className="text-sm font-medium text-[#4D463D]">{rolePrimary}</p>
              <span aria-hidden="true" className="hidden h-4 w-px bg-[#1D1B18]/20 sm:block" />
              <p className="text-sm text-[#625C54]">{roleSecondary}</p>
            </div>
            <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-[#625C54] sm:text-lg sm:leading-8">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#karya" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#1D1B18] px-5 text-sm font-medium text-[#F4F0E8] transition-colors hover:bg-[#BD4B2A]">
                {ctaText} <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a href={finalCvUrl} download className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#4D463D] transition-colors hover:text-[#BD4B2A]" target="_blank" rel="noopener noreferrer">
                <Download size={16} aria-hidden="true" /> {cvButtonText}
              </a>
            </div>
            <p className="mt-14 border-t border-[#1D1B18]/15 pt-5 text-[11px] font-mono tracking-widest text-[#81776A] uppercase opacity-90 transition-opacity hover:opacity-100">
              Sistem agen <span className="mx-2" aria-hidden="true">/</span> Infrastruktur pengetahuan <span className="mx-2" aria-hidden="true">/</span> Rekayasa produk
            </p>
          </div>

          <div className="home-portrait relative mx-auto w-full max-w-[430px] lg:ml-auto lg:mr-0">
            <div aria-hidden="true" className="home-portrait-field absolute inset-x-8 bottom-5 top-4 rounded-t-[48%] rounded-b-[12px] bg-[#E9E2D6] sm:inset-x-12" />
            <Image
              src={photoUrl}
              alt={`Foto ${name}`}
              width={1086}
              height={1448}
              priority
              className="home-portrait-image relative z-10 h-auto w-full object-contain"
              sizes="(max-width: 1024px) 80vw, 430px"
            />
            <p className="absolute bottom-7 right-0 z-20 border-l border-[#BD4B2A]/45 bg-[#F4F0E8]/95 px-4 py-3 text-sm font-medium text-[#1D1B18] sm:bottom-10 sm:right-1">
              {caption}
            </p>
          </div>

          <a href="#karya" aria-label="Gulir ke pilihan karya" className="home-scroll-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-[#81776A] transition-colors hover:text-[#1D1B18] lg:inline-flex">
            <span aria-hidden="true" className="home-scroll-mark" />
            Jelajahi pilihan karya
          </a>
        </div>
      </section>
  );
}
