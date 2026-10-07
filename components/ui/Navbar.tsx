"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${isScrolled ? "border-b border-[#1D1B18]/[0.07] bg-[#F4F0E8]/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="scroll-progress absolute inset-x-0 top-0 h-0.5 bg-[#BD4B2A]" style={{ "--scroll-progress": progress } as CSSProperties} />
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="#beranda" className="text-sm font-semibold tracking-[-0.02em] text-[#1D1B18]">
          {DOSSIER_PROFILE.codename}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={activeSection === link.section ? "location" : undefined}
              className={`nav-link text-sm transition-colors hover:text-[#1D1B18] ${activeSection === link.section ? "nav-link-current" : "text-[#625C54]"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="#kontak" aria-current={activeSection === "kontak" ? "location" : undefined} className={`hidden min-h-10 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:border-[#BD4B2A] hover:bg-[#E9E2D6] md:inline-flex ${activeSection === "kontak" ? "border-[#BD4B2A] bg-[#E9E2D6] text-[#1D1B18]" : "border-[#1D1B18]/15 text-[#4D463D]"}`}>
          Hubungi saya
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-[#4D463D] hover:bg-[#E9E2D6] md:hidden"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#1D1B18]/10 bg-[#F4F0E8] px-5 pb-5 pt-2 md:hidden" aria-label="Navigasi seluler">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={activeSection === link.section ? "location" : undefined} className="flex min-h-12 items-center border-b border-[#1D1B18]/[0.07] text-base text-[#4D463D]">
              {link.label}
            </Link>
          ))}
          <Link href="#kontak" onClick={() => setOpen(false)} aria-current={activeSection === "kontak" ? "location" : undefined} className="mt-4 inline-flex min-h-11 items-center rounded-md bg-[#1D1B18] px-4 text-sm font-medium text-[#F4F0E8]">
            Hubungi saya
          </Link>
        </nav>
      )}
    </header>
  );
}
