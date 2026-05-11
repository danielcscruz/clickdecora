"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const PLAN_IDS: Record<string, number> = {
  essencial: 1,
  conforto: 2,
  exclusivo: 3,
};

const PLAN_PRICES: Record<string, number> = {
  essencial: 497,
  conforto: 897,
  exclusivo: 1497,
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const plano = params.get("plano") ?? "essencial";
  const paymentStatus = params.get("payment");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: PLAN_IDS[plano] ?? 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Erro ao criar checkout");
      window.location.href = data.checkout_url;
    } catch (e: any) {
      setError(e.message ?? "Erro inesperado");
      setLoading(false);
    }
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border border-gold/20 max-w-md w-full text-center p-10"
        >
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="font-display text-3xl font-medium text-dark mb-3">
            Pagamento confirmado!
          </h1>
          <p className="font-body text-sm text-dark/60 mb-8">
            Seu projeto foi criado. Acesse o dashboard para ver o protocolo e iniciar a conversa.
          </p>
          <Link href="/dashboard" className="btn-primary w-full justify-center">
            Ir para o dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === "failure") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="card border border-gold/20 max-w-md w-full text-center p-10">
          <XCircle size={48} className="text-red-400 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="font-display text-3xl font-medium text-dark mb-3">
            Pagamento não efetuado
          </h1>
          <p className="font-body text-sm text-dark/60 mb-8">
            Ocorreu um problema com o pagamento. Você pode tentar novamente.
          </p>
          <button onClick={startCheckout} className="btn-primary w-full justify-center">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border border-gold/20 max-w-md w-full p-8"
      >
        <div className="section-label mb-2">Resumo do pedido</div>
        <h1 className="font-display text-3xl font-medium text-dark mb-6 capitalize">
          Plano {plano}
        </h1>

        <div className="bg-surface-alt border border-gold/20 rounded-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-dark/70 capitalize">Plano {plano}</span>
            <span className="font-body font-semibold text-dark">
              {formatCurrency(PLAN_PRICES[plano] ?? 497)}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={startCheckout}
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Pagar com Mercado Pago"
          )}
        </button>
        <p className="font-body text-xs text-center text-dark/40 mt-4">
          PIX ou cartão de crédito · Pagamento seguro
        </p>
      </motion.div>
    </div>
  );
}
