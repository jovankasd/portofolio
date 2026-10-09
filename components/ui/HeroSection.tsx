import Image from "next/image";
import { ArrowDown, Download } from "lucide-react";


export default function HeroSection({ metadata, cvUrl }: { metadata?: Record<string, string>, cvUrl: string }) {
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
  
  const finalCvUrl = (cvUrl || "").startsWith("http") ? cvUrl : `/${cvUrl || ""}`;

  return (
    <section id="beranda" className="home-hero relative flex min-h-svh items-center overflow-hidden bg-background px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-2">
          <div className="home-copy relative z-10">
            <p className="mb-6 flex items-center gap-3 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] text-on-surface uppercase anim-hero-text">
              <span aria-hidden="true" className="size-2 rounded-full bg-tertiary-fixed-dim" />
              {eyebrow}
            </p>
            <h1 className="text-balance font-display-hero text-[48px] font-bold leading-[48px] tracking-[-0.03em] uppercase text-on-surface lg:text-[104px] lg:leading-[96px] lg:tracking-[-0.04em] anim-hero-text" style={{ animationDelay: "100ms" }}>
              <span className="block">{firstName}</span>
              {lastName && <span className="block">{lastName}</span>}
            </h1>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 anim-hero-text" style={{ animationDelay: "200ms" }}>
              <p className="font-headline-sm text-[18px] font-semibold text-on-surface">{rolePrimary}</p>
              <span aria-hidden="true" className="hidden h-5 w-px bg-outline-variant sm:block" />
              <p className="font-headline-sm text-[18px] font-semibold text-on-surface-variant">{roleSecondary}</p>
            </div>
            <p className="mt-6 max-w-lg text-pretty font-body-lg text-[18px] leading-[28px] tracking-[-0.01em] text-on-surface-variant anim-hero-text" style={{ animationDelay: "300ms" }}>
              {description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 anim-hero-text" style={{ animationDelay: "400ms" }}>
              <a href="#karya" className="inline-flex h-[48px] items-center gap-2 rounded-pill bg-primary px-[28px] font-label-nav text-[14px] font-medium text-on-primary transition-colors hover:bg-[#262930]">
                {ctaText} <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a href={finalCvUrl} download className="inline-flex h-[48px] items-center gap-2 rounded-pill border border-outline-variant px-[28px] font-label-nav text-[14px] font-medium text-on-surface transition-all duration-150 hover:border-outline hover:bg-surface-container-lowest" target="_blank" rel="noopener noreferrer">
                <Download size={16} aria-hidden="true" /> {cvButtonText}
              </a>
            </div>
            <p className="mt-14 border-t border-outline-variant pt-5 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant anim-hero-text" style={{ animationDelay: "500ms" }}>
              Sistem agen <span className="mx-2 text-outline-variant" aria-hidden="true">/</span> Infrastruktur pengetahuan <span className="mx-2 text-outline-variant" aria-hidden="true">/</span> Rekayasa produk
            </p>
          </div>

          <div className="home-portrait relative mx-auto w-full max-w-[430px] lg:ml-auto lg:mr-0 anim-hero-text" style={{ animationDelay: "600ms" }}>
            <div aria-hidden="true" className="home-portrait-field absolute inset-x-8 bottom-5 top-4 rounded-t-full rounded-b-[12px] bg-surface-variant sm:inset-x-12" />
            <Image
              src={photoUrl}
              alt={`Foto ${name}`}
              width={1086}
              height={1448}
              priority
              className="home-portrait-image relative z-10 h-auto w-full object-contain"
              sizes="(max-width: 1024px) 80vw, 430px"
            />
            <p className="absolute bottom-7 right-0 z-20 border border-outline-variant bg-surface/95 px-4 py-3 font-label-nav text-[14px] font-medium text-on-surface shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:bottom-10 sm:right-1">
              {caption}
            </p>
          </div>

          <a href="#karya" aria-label="Gulir ke pilihan karya" className="home-scroll-cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] uppercase text-on-surface-variant transition-colors hover:text-on-surface lg:inline-flex anim-hero-text" style={{ animationDelay: "700ms" }}>
            <ArrowDown size={14} aria-hidden="true" />
            Jelajahi pilihan karya
          </a>
        </div>
      </section>
  );
}
