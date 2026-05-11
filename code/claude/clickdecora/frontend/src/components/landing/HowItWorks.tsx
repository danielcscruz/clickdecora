"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Calendar, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    number: "01",
    title: "Escolha seu plano",
    description:
      "Selecione o pacote ideal para o seu projeto — de um ambiente único a uma transformação completa do lar.",
  },
  {
    icon: Calendar,
    number: "02",
    title: "Agende sua reunião",
    description:
      "Após a compra, marque uma conversa online com nossa equipe para alinhar estilo, necessidades e expectativas.",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Acompanhe pelo chat",
    description:
      "Receba seu projeto via chat dedicado, envie fotos dos ambientes e revise cada detalhe em tempo real.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-surface-alt py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Processo</div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-dark">
            Como funciona
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gold/30" />
              )}

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-primary/5 border border-gold/30 rounded-sm flex items-center justify-center mx-auto mb-6">
                  <step.icon size={24} className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="section-label mb-3">{step.number}</div>
                <h3 className="font-display text-2xl font-medium text-dark mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-dark/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
