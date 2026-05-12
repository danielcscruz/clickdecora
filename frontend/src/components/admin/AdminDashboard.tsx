"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ChevronDown } from "lucide-react";
import Link from "next/link";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import type { Purchase } from "@/types";
import { formatDate } from "@/lib/utils";

interface AdminPurchase extends Purchase {
  user_name: string;
  user_email: string;
}

export function AdminDashboard({
  purchases,
  token,
}: {
  purchases: AdminPurchase[];
  token: string;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [localPurchases, setLocalPurchases] = useState(purchases);

  const filtered =
    filter === "all"
      ? localPurchases
      : localPurchases.filter((p) => p.status === filter);

  async function updateStatus(protocol: string, status: string) {
    setUpdating(protocol);
    try {
      const res = await fetch(`/api/admin/purchases/${protocol}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLocalPurchases((prev) =>
          prev.map((p) =>
            p.protocol === protocol ? { ...p, status: status as any } : p
          )
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  const statuses = ["all", "pending", "paid", "in_progress", "delivered", "cancelled"];

  return (
    <div>
      <div className="mb-8">
        <div className="section-label mb-1">Gestão</div>
        <h1 className="font-display text-3xl font-light text-dark">Clientes</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", count: purchases.length, color: "text-dark" },
          { label: "Pagos", count: purchases.filter((p) => p.status !== "pending" && p.status !== "cancelled").length, color: "text-emerald-600" },
          { label: "Em andamento", count: purchases.filter((p) => p.status === "in_progress").length, color: "text-primary" },
          { label: "Entregues", count: purchases.filter((p) => p.status === "delivered").length, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="card border border-gold/20 text-center">
            <div className={`font-display text-3xl font-semibold ${s.color}`}>{s.count}</div>
            <div className="font-body text-xs text-dark/50 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-body text-xs px-3 py-1.5 rounded-full transition-colors border ${
              filter === s
                ? "bg-primary text-cream border-primary"
                : "bg-surface border-gold/20 text-dark/60 hover:border-primary/30"
            }`}
          >
            {s === "all" ? "Todos" : STATUS_LABELS[s as Purchase["status"]]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card border border-gold/20 overflow-x-auto p-0">
        <table className="w-full">
          <thead className="bg-surface-alt border-b border-gold/20">
            <tr>
              {["Protocolo", "Cliente", "Status", "Data", "Ações"].map((h) => (
                <th
                  key={h}
                  className="font-body text-xs font-medium text-dark/50 text-left px-4 py-3 tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center font-body text-sm text-dark/40 py-8">
                  Nenhum resultado
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-gold/10 hover:bg-surface-alt/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-body font-semibold text-sm text-primary">
                      {p.protocol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-body text-sm text-dark">{p.user_name}</div>
                    <div className="font-body text-xs text-dark/40">{p.user_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${
                        STATUS_COLORS[p.status as Purchase["status"]]
                      }`}
                    >
                      {STATUS_LABELS[p.status as Purchase["status"]]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-dark/50">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/chat/${p.protocol}`}
                        className="text-primary hover:text-primary-light transition-colors"
                        title="Abrir chat"
                      >
                        <MessageSquare size={16} strokeWidth={1.5} />
                      </Link>
                      <select
                        value={p.status}
                        disabled={updating === p.protocol}
                        onChange={(e) => updateStatus(p.protocol, e.target.value)}
                        className="font-body text-xs border border-gold/30 rounded-sm px-2 py-1 bg-surface focus:outline-none focus:border-primary"
                      >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="in_progress">Em andamento</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
