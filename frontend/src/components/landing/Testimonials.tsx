"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mariana Costa",
    location: "São Paulo, SP",
    text: "Transformaram minha sala em um espaço que eu amo voltar pra casa. O chat foi incrível — senti que tinha uma designer dedicada só pra mim.",
    plan: "Plano Conforto",
  },
  {
    name: "Rafael Andrade",
    location: "Belo Horizonte, MG",
    text: "Processo super simples e resultado surpreendente. Recebi o projeto em 6 dias e o moodboard foi exatamente o que eu imaginava, mas não sabia descrever.",
    plan: "Plano Essencial",
  },
  {
    name: "Camila Torres",
    location: "Rio de Janeiro, RJ",
    text: "Contratei o Exclusivo e valeu cada centavo. Meu apartamento completo ficou com uma identidade visual coesa. As reuniões online foram ótimas.",
    plan: "Plano Exclusivo",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="bg-primary py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label text-gold mb-4">Depoimentos</div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-cream">
            O que dizem nossos clientes
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-primary-light/40 border border-white/10 rounded-sm p-8"
            >
              <Quote size={20} className="text-gold mb-4" strokeWidth={1.5} />
              <p className="font-body text-sm text-cream/80 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="pt-4 border-t border-white/10">
                <div className="font-display text-base font-medium text-cream">{t.name}</div>
                <div className="font-body text-xs text-cream/50 mt-0.5">{t.location}</div>
                <div className="font-body text-xs text-gold mt-2">{t.plan}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
