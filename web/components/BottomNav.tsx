import { IconDoc, IconHome, IconSearch } from "./Icons";
import NavLink, { SearchLink } from "./NavLink";
import ThemeToggle from "./ThemeToggle";

/** Barre de navigation basse (mobile uniquement). */
export default function BottomNav() {
  return (
    <nav className="bnav" aria-label="Navigation mobile">
      <ul role="list">
        <li><NavLink href="/" className="bnav-item"><span className="nav-icon"><IconHome /></span><span className="nav-label">Fil</span></NavLink></li>
        <li><SearchLink className="bnav-item"><span className="nav-icon"><IconSearch /></span><span className="nav-label">Recherche</span></SearchLink></li>
        <li><NavLink href="/methodologie" className="bnav-item"><span className="nav-icon"><IconDoc /></span><span className="nav-label">Méthodologie</span></NavLink></li>
        <li><ThemeToggle className="bnav-item" /></li>
      </ul>
    </nav>
  );
}
