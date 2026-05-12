import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark text-cream/60 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div>
            <div className="font-display text-2xl font-semibold text-cream mb-2">
              CD <span className="font-body text-sm font-light tracking-widest text-cream/50">CLICK DECORA</span>
            </div>
            <p className="font-body text-sm text-cream/40 max-w-xs leading-relaxed">
              Design de interiores 100% online.<br />
              A um click do seu ambiente.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="font-body text-xs font-medium tracking-widest uppercase text-gold mb-4">
                Serviços
              </div>
              <ul className="space-y-2">
                {["Plano Essencial", "Plano Conforto", "Plano Exclusivo"].map((item) => (
                  <li key={item}>
                    <a href="#planos" className="font-body text-sm text-cream/50 hover:text-cream transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-body text-xs font-medium tracking-widest uppercase text-gold mb-4">
                Legal
              </div>
              <ul className="space-y-2">
                {[
                  { label: "Termos de uso", href: "/termos" },
                  { label: "Privacidade", href: "/privacidade" },
                  { label: "Entrar", href: "/login" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="font-body text-sm text-cream/50 hover:text-cream transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-body text-xs text-cream/30">
            © {new Date().getFullYear()} Click Decora. Todos os direitos reservados.
          </p>
          <p className="font-body text-xs text-cream/30">
            CNPJ: XX.XXX.XXX/0001-XX
          </p>
        </div>
      </div>
    </footer>
  );
}
