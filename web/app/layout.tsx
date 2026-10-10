import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import RightRail from "@/components/RightRail";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE_TITLE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE_TITLE} — fil d'actualité et faisabilité des propositions`, template: `%s — ${SITE_TITLE}` },
  description: "Résumés et analyses de faisabilité (générés par IA) des publications officielles de David Lisnard. Analyses pouvant contenir des erreurs.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

// Pose le thème avant le premier rendu (pas de flash) : sombre par défaut, clair seulement si choisi.
const THEME_SCRIPT = `(function(){var t="dark";try{if(localStorage.getItem("theme")==="light")t="light"}catch(e){}document.documentElement.dataset.theme=t})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#contenu">Aller au contenu</a>
        <div className="shell">
          <SiteHeader />
          <div className="column">
            <main id="contenu" tabIndex={-1}>{children}</main>
            <SiteFooter />
          </div>
          <RightRail />
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
