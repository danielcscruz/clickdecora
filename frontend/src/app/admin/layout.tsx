import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if ((session.user as any)?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="bg-dark text-cream px-6 h-14 flex items-center justify-between">
        <div className="font-display text-lg font-semibold">
          CD <span className="font-body text-xs font-light tracking-widest text-cream/40">ADMIN</span>
        </div>
        <div className="font-body text-xs text-cream/40">{session.user?.name}</div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
