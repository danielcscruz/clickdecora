"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const plans = [
  {
    name: "Essencial",
    slug: "essencial",
    price: 497,
    description: "Perfeito para transformar um ambiente com praticidade e estilo.",
    features: [
      "1 ambiente",
      "Entrega em 7 dias úteis",
      "Projeto 2D completo",
      "Lista de compras",
      "Consultoria via chat",
    ],
    highlight: false,
  },
  {
    name: "Conforto",
    slug: "conforto",
    price: 897,
    description: "Ideal para quem deseja renovar mais de um espaço com harmonia.",
    features: [
      "Até 3 ambientes",
      "Entrega em 14 dias úteis",
      "Projeto 2D + Moodboard",
      "Lista de compras",
      "Consultoria via Meet",
      "2 revisões",
    ],
    highlight: true,
    badge: "Mais popular",
  },
  {
    name: "Exclusivo",
    slug: "exclusivo",
    price: 1497,
    description: "Transformação completa do seu lar com acompanhamento total.",
    features: [
      "Ambientes ilimitados",
      "Projeto 3D completo",
      "Acompanhamento dedicado",
      "Lista de compras premium",
      "Reuniões ilimitadas",
      "Revisões ilimitadas",
      "Suporte pós-entrega 30 dias",
    ],
    highlight: false,
  },
];

export function Plans() {
  return (
    <section id="planos" className="bg-cream py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Investimento</div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-dark">
            Escolha seu plano
          </h2>
          <div className="gold-divider mt-6 mb-6" />
          <p className="font-body text-dark/60 max-w-xl mx-auto">
            Cada plano inclui projeto personalizado, comunicação direta com o designer
            e entrega digital completa.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative card transition-all duration-300 hover:shadow-card-hover flex flex-col ${
                plan.highlight
                  ? "border border-primary ring-1 ring-primary/10"
                  : "border border-gold/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-cream text-xs font-body font-medium px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  {plan.badge}
                </div>
              )}

              <div className="flex-1">
                <div className="section-label mb-2">{plan.name}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="font-display text-4xl font-semibold text-dark">
                    {formatCurrency(plan.price)}
                  </span>
                </div>
                <p className="font-body text-sm text-dark/60 mb-6 pb-6 border-b border-gold/20">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span className="font-body text-sm text-dark/70">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/checkout?plano=${plan.slug}`}
                className={plan.highlight ? "btn-primary text-center" : "btn-outline text-center"}
              >
                Começar com {plan.name}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-body text-xs text-dark/40 mt-8">
          Pagamento via PIX ou cartão de crédito. Projeto iniciado após confirmação do pagamento.
        </p>
      </div>
    </section>
  );
}
