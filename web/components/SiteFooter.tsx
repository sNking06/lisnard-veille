import Link from "next/link";
import { ISSUE_URL, REPO, SITE_TITLE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container foot-grid">
        <div className="foot-about">
          <p className="foot-brand">{SITE_TITLE}</p>
          <p>Projet indépendant, non affilié. Le projet évalue des <strong>mesures</strong>, jamais la personne.</p>
        </div>
        <div>
          <h2 className="foot-h">Collecte</h2>
          <p>
            X par Grok Bot (routine), TikTok et site par GitHub Actions. Les vidéos ne sont pas republiées :
            lecteurs officiels intégrés uniquement, chargés au clic.
          </p>
        </div>
        <nav aria-label="Liens de pied de page">
          <h2 className="foot-h">Ressources</h2>
          <ul className="foot-links" role="list">
            <li><Link href="/methodologie">Méthodologie</Link></li>
            <li><Link href="/methodologie#neutralite">Politique de neutralité</Link></li>
            <li><a href={REPO} rel="noopener noreferrer">Code et données</a></li>
            <li><a href={ISSUE_URL} rel="noopener noreferrer">Signaler une erreur</a></li>
          </ul>
        </nav>
      </div>
      <div className="container foot-bottom">
        <p><span className="ai-tag" aria-hidden="true">IA</span> Analyse générée par IA, peut contenir des erreurs. Chaque carte renvoie vers la publication d’origine.</p>
      </div>
    </footer>
  );
}
