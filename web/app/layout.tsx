import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import RightRail from "@/components/RightRail";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE_TITLE } from "@/lib/site";
import "./globals.css";

// Police variable unique (titres, interface et texte courant), auto-hébergée par Next au build.
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: `${SITE_TITLE} — fil d'actualité et faisabilité des propositions`, template: `%s — ${SITE_TITLE}` },
  description: "Résumés et analyses de faisabilité (générés par IA) des publications officielles de David Lisnard. Analyses pouvant contenir des erreurs.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1450" },
  ],
};

// Pose le thème avant le premier rendu (pas de flash) : choix enregistré, sinon préférence du système, sinon clair.
const THEME_SCRIPT = `(function(){var t="light";try{var s=localStorage.getItem("theme");if(s==="light"||s==="dark")t=s;else if(matchMedia("(prefers-color-scheme: dark)").matches)t="dark"}catch(e){}document.documentElement.dataset.theme=t})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable} suppressHydrationWarning>
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
