"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-cream grain-overlay overflow-hidden pt-16">
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #6B0F1A 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-label mb-6"
        >
          Design de interiores 100% online
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-dark leading-tight mb-8"
        >
          Seu espaço,
          <br />
          <em className="text-primary not-italic font-medium">sua essência.</em>
          <br />
          Nosso design.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="gold-divider mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-lg text-dark/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Transformamos ambientes através do design inteligente e da psicologia dos espaços.
          Sua casa deve refletir quem você é — e promover bem-estar, funcionalidade e beleza.
          Tudo isso, <em>a um click de distância.</em>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="#planos" className="btn-primary text-base px-10 py-4">
            Ver planos
            <ArrowRight size={18} />
          </Link>
          <Link href="#como-funciona" className="btn-outline text-base px-10 py-4">
            Como funciona
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          {[
            { number: "+200", label: "Ambientes transformados" },
            { number: "100%", label: "Projetos online" },
            { number: "4.9★", label: "Avaliação média" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl font-semibold text-primary">{stat.number}</div>
              <div className="font-body text-sm text-dark/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
}
