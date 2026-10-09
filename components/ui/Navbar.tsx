"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";

const links = [
  { label: "Beranda", href: "#beranda", section: "beranda" },
  { label: "Tentang", href: "#tentang", section: "tentang" },
  { label: "Karya", href: "#karya", section: "karya" },
  { label: "Rekam jejak", href: "#rekam-jejak", section: "rekam-jejak" },
];

const sectionIds = [...links.map((link) => link.section), "kontak"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("beranda");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        let current = sectionIds[0];
        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top <= 120) current = id;
        }
        setActiveSection(current);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${isScrolled ? "border-b border-outline-variant bg-surface/85 backdrop-blur-[12px] shadow-sm" : "bg-transparent"}`}>
      <div className="scroll-progress absolute inset-x-0 top-0 h-[2px] bg-primary origin-left" style={{ transform: `scaleX(${progress})` }} />
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="#beranda" className="font-label-uppercase text-[12px] font-semibold leading-[16px] tracking-[0.08em] text-on-surface uppercase">
          {DOSSIER_PROFILE.codename}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={activeSection === link.section ? "location" : undefined}
              className={`font-label-nav text-[14px] font-medium leading-[18px] tracking-[-0.01em] transition-all hover:underline hover:text-on-surface underline-offset-4 ${activeSection === link.section ? "text-on-surface underline decoration-outline-variant" : "text-on-surface-variant decoration-transparent"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="#kontak" aria-current={activeSection === "kontak" ? "location" : undefined} className="hidden h-[40px] items-center rounded-pill border border-outline-variant px-[24px] font-label-nav text-[14px] font-medium text-on-surface transition-all duration-150 hover:border-outline hover:bg-surface-container-lowest md:inline-flex">
          Hubungi saya
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-pill text-on-surface transition-colors hover:bg-surface-container md:hidden"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-outline-variant bg-surface px-5 pb-5 pt-2 md:hidden" aria-label="Navigasi seluler">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={activeSection === link.section ? "location" : undefined} className="flex min-h-12 items-center border-b border-outline-variant/50 font-label-nav text-[14px] font-medium text-on-surface">
              {link.label}
            </Link>
          ))}
          <Link href="#kontak" onClick={() => setOpen(false)} aria-current={activeSection === "kontak" ? "location" : undefined} className="mt-4 inline-flex h-[48px] w-full items-center justify-center rounded-pill bg-primary px-[28px] font-label-nav text-[14px] font-medium text-on-primary transition-colors hover:bg-[#262930]">
            Hubungi saya
          </Link>
        </nav>
      )}
    </header>
  );
}
