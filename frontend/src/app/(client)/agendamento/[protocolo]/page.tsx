import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import type { Purchase } from "@/types";
import { CalendlyEmbed } from "@/components/client/CalendlyEmbed";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AgendamentoPage({ params }: { params: { protocolo: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const token = (session as any)?.accessToken as string;
  let purchase: Purchase | null = null;

  try {
    purchase = await apiFetch<Purchase>(`/purchases/${params.protocolo}`, { token });
  } catch {
    redirect("/dashboard");
  }

  if (!purchase || purchase.status === "pending") redirect("/dashboard");

  const calendlyUrl = process.env.CALENDLY_URL ?? "";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-dark/40 hover:text-dark transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="section-label">Protocolo {params.protocolo}</div>
          <h1 className="font-display text-2xl font-medium text-dark">Agendar reunião</h1>
        </div>
      </div>

      <div className="card border border-gold/20">
        <p className="font-body text-sm text-dark/60 mb-6">
          Escolha um horário para sua consultoria. A reunião será por videoconferência.
        </p>
        <CalendlyEmbed url={calendlyUrl} protocol={params.protocolo} />
      </div>
    </div>
  );
}
