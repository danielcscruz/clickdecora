"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

export function ClientNav({ session }: { session: Session }) {
  const pathname = usePathname();

  return (
    <header className="bg-surface border-b border-gold/20 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-display text-xl font-semibold text-primary">
          CD
          <span className="font-body text-xs font-light tracking-widest ml-2 text-dark/50">
            CLICK DECORA
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-body transition-colors",
              pathname === "/dashboard"
                ? "bg-primary/5 text-primary"
                : "text-dark/60 hover:text-dark"
            )}
          >
            <LayoutDashboard size={15} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-body text-dark/60 hover:text-dark transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
