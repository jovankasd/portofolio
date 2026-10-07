import { ArrowUpRight } from "lucide-react";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";

export default function DirectUplink() {
  return (
    <section id="kontak" className="bg-[#bd4b2a] px-5 py-20 text-[#f8f3e9] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-[#f8f3e9]/70">Tersedia untuk kolaborasi</p>
          <h2 className="max-w-3xl font-display text-5xl leading-[0.9] tracking-[-0.06em] sm:text-7xl">Punya masalah yang layak dipecahkan?</h2>
        </div>
        <div className="self-end">
          <p className="max-w-md text-lg leading-relaxed text-[#f8f3e9]/80">Saya terbuka untuk membangun produk, mengurai sistem yang rumit, dan berdiskusi tentang pekerjaan yang membutuhkan rasa ingin tahu teknis.</p>
          <div className="mt-9 border-t border-[#f8f3e9]/30">
            {DOSSIER_PROFILE.socials.map((social) => <a key={social.label} href={social.url} target={social.url.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" className="group flex items-center justify-between border-b border-[#f8f3e9]/30 py-4 text-base sm:text-lg"><span>{social.label}</span><span className="flex items-center gap-2 text-[#f8f3e9]/75 group-hover:text-white">{social.address}<ArrowUpRight className="h-4 w-4" /></span></a>)}
          </div>
        </div>
      </div>
    </section>
  );
}
