"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Calendar, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import type { Purchase } from "@/types";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import { formatDate } from "@/lib/utils";

export function DashboardClient({
  purchases,
  userName,
}: {
  purchases: Purchase[];
  userName: string;
}) {
  const active = purchases.filter(
    (p) => p.status === "paid" || p.status === "in_progress"
  );
  const delivered = purchases.filter((p) => p.status === "delivered");

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="section-label mb-1">Bem-vinda de volta</div>
        <h1 className="font-display text-3xl font-light text-dark">
          {userName ? `Olá, ${userName.split(" ")[0]}` : "Olá"}
        </h1>
      </motion.div>

      {purchases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card border border-gold/20 text-center py-12"
        >
          <div className="font-display text-2xl font-light text-dark mb-3">
            Seu projeto começa aqui
          </div>
          <p className="font-body text-sm text-dark/50 mb-8">
            Escolha um plano e transforme seu ambiente.
          </p>
          <Link href="/#planos" className="btn-primary">
            Ver planos
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-medium text-dark mb-4">
                Projetos ativos
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {active.map((p, i) => (
                  <PurchaseCard key={p.id} purchase={p} index={i} />
                ))}
              </div>
            </section>
          )}

          {delivered.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-medium text-dark mb-4">
                Projetos entregues
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {delivered.map((p, i) => (
                  <PurchaseCard key={p.id} purchase={p} index={i} delivered />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function PurchaseCard({
  purchase,
  index,
  delivered = false,
}: {
  purchase: Purchase;
  index: number;
  delivered?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card border border-gold/20 hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-body text-xs text-dark/40 mb-0.5">Protocolo</div>
          <div className="font-body font-semibold text-primary tracking-wide">
            {purchase.protocol}
          </div>
        </div>
        <span
          className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${
            STATUS_COLORS[purchase.status]
          }`}
        >
          {STATUS_LABELS[purchase.status]}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-dark/40 font-body mb-5">
        <Clock size={12} />
        Criado em {formatDate(purchase.created_at)}
      </div>

      <div className="flex gap-3">
        {!delivered && (
          <Link
            href={`/chat/${purchase.protocol}`}
            className="btn-primary text-sm py-2 flex-1 text-center"
          >
            <MessageSquare size={14} />
            Abrir chat
          </Link>
        )}
        <Link
          href={`/agendamento/${purchase.protocol}`}
          className="btn-outline text-sm py-2 flex-1 text-center"
        >
          <Calendar size={14} />
          {delivered ? "Ver reuniões" : "Agendar"}
        </Link>
      </div>
    </motion.div>
  );
}
