"use client";

import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { DOSSIER_PROFILE } from "@/shared/constants/profile";

const links = [
  { label: "Tentang", href: "#tentang" },
  { label: "Karya", href: "#karya" },
  { label: "Pengalaman", href: "#rekam-jejak" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled ? "bg-[#f4f0e8]/95 backdrop-blur border-b border-[#1d1b18]/15" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" className="font-display text-lg leading-none tracking-[-0.04em] text-[#1d1b18]">
          {DOSSIER_PROFILE.codename}<span className="text-[#bd4b2a]">.</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
          {links.map((link) => <a key={link.href} href={link.href} className="text-sm text-[#1d1b18]/65 transition-colors hover:text-[#bd4b2a]">{link.label}</a>)}
        </nav>
        <a href="#kontak" className="hidden items-center gap-1.5 text-sm font-medium text-[#1d1b18] md:inline-flex">
          Mari bicara <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center text-[#1d1b18] md:hidden" aria-expanded={open} aria-label="Buka navigasi">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && <nav className="border-t border-[#1d1b18]/15 bg-[#f4f0e8] px-5 pb-6 pt-3 md:hidden" aria-label="Navigasi seluler">
        {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-[#1d1b18]/10 py-3 font-display text-2xl text-[#1d1b18]">{link.label}</a>)}
      </nav>}
    </header>
  );
}
