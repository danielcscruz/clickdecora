"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Como funciona o projeto 100% online?",
    a: "Todo o processo acontece de forma digital: você compra um plano, agenda uma reunião por videoconferência, envia fotos dos ambientes pelo chat e recebe seu projeto completo em PDF, com lista de compras e orientações detalhadas.",
  },
  {
    q: "Quanto tempo leva para receber meu projeto?",
    a: "O prazo varia conforme o plano: Essencial (7 dias úteis), Conforto (14 dias úteis) e Exclusivo (prazo combinado na reunião). O prazo começa após o envio das fotos e informações do ambiente.",
  },
  {
    q: "Posso pedir revisões?",
    a: "Sim! O plano Conforto inclui 2 revisões e o Exclusivo oferece revisões ilimitadas. O plano Essencial inclui 1 rodada de ajustes pequenos.",
  },
  {
    q: "Como é feito o pagamento?",
    a: "Aceitamos PIX e cartão de crédito via Mercado Pago. O projeto é iniciado somente após a confirmação do pagamento.",
  },
  {
    q: "Vocês atendem em todo o Brasil?",
    a: "Sim! Como o serviço é 100% online, atendemos clientes em qualquer cidade do Brasil.",
  },
  {
    q: "O que acontece após a entrega?",
    a: "O chat permanece ativo para dúvidas pontuais. O plano Exclusivo inclui suporte dedicado por 30 dias após a entrega.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gold/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-body font-medium text-dark">{q}</span>
        {open ? (
          <Minus size={16} className="text-primary shrink-0" />
        ) : (
          <Plus size={16} className="text-primary shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-dark/60 pb-5 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="bg-surface-alt py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="section-label mb-4">Dúvidas</div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-dark">
            Perguntas frequentes
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
