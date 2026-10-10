import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veille Lisnard 2027 — fil d'actualité et faisabilité des propositions",
  description: "Résumés et analyses de faisabilité (générés par IA) des publications officielles de David Lisnard. Analyses pouvant contenir des erreurs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
