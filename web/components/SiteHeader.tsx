import Link from "next/link";
import { REPO, SITE_TITLE } from "@/lib/site";
import { IconCode, IconDoc, IconHome, IconScale, IconSearch } from "./Icons";
import NavLink, { SearchLink } from "./NavLink";
import ThemeToggle from "./ThemeToggle";

/** Rail de navigation gauche (tablette et bureau) ; sur mobile, la barre basse (BottomNav) prend le relais. */
export default function SiteHeader() {
  return (
    <header className="lrail" aria-label="En-tête du site">
      <div className="lrail-inner">
        <Link href="/" className="lrail-brand" title={SITE_TITLE}>
          <span className="mark" aria-hidden="true">VL</span>
          <span className="nav-label">{SITE_TITLE}</span>
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="lrail-list" role="list">
            <li><NavLink href="/" className="nav-item" title="Fil des publications"><span className="nav-icon"><IconHome /></span><span className="nav-label">Fil</span></NavLink></li>
            <li><SearchLink className="nav-item" title="Rechercher"><span className="nav-icon"><IconSearch /></span><span className="nav-label">Recherche</span></SearchLink></li>
            <li><NavLink href="/methodologie" className="nav-item" title="Méthodologie"><span className="nav-icon"><IconDoc /></span><span className="nav-label">Méthodologie</span></NavLink></li>
            <li><Link href="/methodologie#neutralite" className="nav-item" title="Politique de neutralité"><span className="nav-icon"><IconScale /></span><span className="nav-label">Neutralité</span></Link></li>
            <li><a href={REPO} rel="noopener noreferrer" className="nav-item" title="Code et données (GitHub)"><span className="nav-icon"><IconCode /></span><span className="nav-label">Code et données</span></a></li>
            <li><ThemeToggle className="nav-item" /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
