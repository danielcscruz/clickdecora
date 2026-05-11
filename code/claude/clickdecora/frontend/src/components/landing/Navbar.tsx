"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-semibold text-primary tracking-tight">
          CD
          <span className="font-body text-sm font-light tracking-[0.15em] ml-2 text-dark/70">
            CLICK DECORA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="font-body text-sm text-dark/70 hover:text-primary transition-colors">
            Como funciona
          </a>
          <a href="#planos" className="font-body text-sm text-dark/70 hover:text-primary transition-colors">
            Planos
          </a>
          <a href="#depoimentos" className="font-body text-sm text-dark/70 hover:text-primary transition-colors">
            Depoimentos
          </a>
          <Link href="/login" className="font-body text-sm text-dark/70 hover:text-primary transition-colors">
            Entrar
          </Link>
          <Link href="#planos" className="btn-primary text-sm py-2 px-5">
            Começar projeto
          </Link>
        </nav>

        <button
          className="md:hidden text-dark/70 hover:text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-gold/20 px-6 py-4 flex flex-col gap-4">
          <a href="#como-funciona" className="font-body text-sm text-dark/70" onClick={() => setOpen(false)}>Como funciona</a>
          <a href="#planos" className="font-body text-sm text-dark/70" onClick={() => setOpen(false)}>Planos</a>
          <a href="#depoimentos" className="font-body text-sm text-dark/70" onClick={() => setOpen(false)}>Depoimentos</a>
          <Link href="/login" className="font-body text-sm text-dark/70">Entrar</Link>
          <Link href="#planos" className="btn-primary text-sm py-2 text-center">Começar projeto</Link>
        </div>
      )}
    </header>
  );
}
