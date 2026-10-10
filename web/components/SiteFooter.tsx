import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_HREF, ISSUE_URL, REPO, SITE_TITLE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="kicker">Veille indépendante</p>
      <p className="foot-brand">{SITE_TITLE}</p>
      <p>Projet indépendant, non affilié. Le projet évalue des <strong>mesures</strong>, jamais la personne.</p>
      <p>
        Collecte : X par Grok Bot (routine), TikTok et site par GitHub Actions. Les vidéos ne sont pas republiées :
        lecteurs officiels intégrés uniquement, affichés sur chaque publication sans lecture automatique.
      </p>
      <nav aria-label="Liens de pied de page">
        <ul className="foot-links" role="list">
          <li><Link href="/methodologie">Méthodologie</Link></li>
          <li><Link href="/methodologie#neutralite">Politique de neutralité</Link></li>
          <li><a href={REPO} rel="noopener noreferrer">Code et données</a></li>
          <li><a href={ISSUE_URL} rel="noopener noreferrer">Signaler une erreur</a></li>
          <li>Contact : <a href={CONTACT_HREF}>{CONTACT_EMAIL}</a></li>
        </ul>
      </nav>
      <p className="foot-ai"><span className="ai-tag" aria-hidden="true">IA</span> Analyse générée par IA, peut contenir des erreurs. Chaque publication renvoie vers son original.</p>
    </footer>
  );
}
