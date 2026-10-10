import Link from "next/link";
import { REPO } from "@/lib/site";
import NavLink from "./NavLink";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <>
      <div className="notice" role="note" aria-label="Avertissement">
        <p className="notice-inner container">
          <span className="ai-tag" aria-hidden="true">IA</span>
          <span><strong>Analyse générée par IA, peut contenir des erreurs.</strong>{" "}
            <span className="notice-sub">Le projet évalue des mesures, jamais la personne.</span></span>
        </p>
      </div>
      <header className="site-header">
        <div className="bar container">
          <Link href="/" className="brand">Veille Lisnard<span className="brand-year">&nbsp;2027</span></Link>
          <nav className="nav" aria-label="Navigation principale">
            <NavLink href="/methodologie">Méthodologie</NavLink>
            <a href={REPO} rel="noopener noreferrer">Dépôt<span className="sr-only"> GitHub du projet</span></a>
            <ThemeToggle />
          </nav>
        </div>
      </header>
    </>
  );
}
