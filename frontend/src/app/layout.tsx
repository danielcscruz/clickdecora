import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Click Decora — Design de Interiores 100% Online",
  description:
    "Transforme seu ambiente com design de interiores profissional, sem sair de casa. A um click do seu ambiente.",
  keywords: ["design de interiores", "decoração online", "projeto de decoração", "click decora"],
  openGraph: {
    title: "Click Decora",
    description: "Design de interiores 100% online. A um click do seu ambiente.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-cream font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
