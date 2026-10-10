import type { Metadata, Viewport } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE_TITLE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE_TITLE} — fil d'actualité et faisabilité des propositions`, template: `%s — ${SITE_TITLE}` },
  description: "Résumés et analyses de faisabilité (générés par IA) des publications officielles de David Lisnard. Analyses pouvant contenir des erreurs.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

// Pose le thème (préférence enregistrée, sinon système) avant le premier rendu : pas de flash.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#contenu">Aller au contenu</a>
        <SiteHeader />
        <main id="contenu" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
