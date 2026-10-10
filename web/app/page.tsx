import Feed from "@/components/Feed";
import { loadAnalyses } from "@/lib/data";

const REPO = "https://github.com/sNking06/lisnard-veille";

export default function Home() {
  const items = loadAnalyses();
  return (
    <main className="wrap">
      <header className="top">
        <h1>Veille Lisnard 2027</h1>
        <p className="lede">
          Fil des publications des comptes officiels (X, TikTok, site de Nouvelle Énergie) : résumé fidèle,
          propositions concrètes et analyse de faisabilité. Le projet évalue des <strong>mesures</strong>, jamais la personne.
        </p>
        <p className="banner" role="note">
          ⚠️ Analyses générées par IA, pouvant contenir des erreurs. Chaque carte renvoie vers la publication d’origine.
          Une erreur ? Utilisez « Signaler une erreur » sur la carte. <a href={`${REPO}/blob/main/docs/neutralite.md`}>Politique de neutralité</a> ·{" "}
          <a href={`${REPO}/blob/main/docs/methodologie.md`}>Méthodologie</a>
        </p>
      </header>
      <Feed items={items} repo={REPO} />
      <footer className="foot">
        <p>
          Projet indépendant, non affilié. Collecte : X par Grok Bot (routine), TikTok et site par GitHub Actions. Les vidéos ne sont pas republiées :
          lecteurs officiels intégrés uniquement. <a href={REPO}>Code et données</a>.
        </p>
      </footer>
    </main>
  );
}
