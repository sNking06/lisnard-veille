import Link from "next/link";
import VerdictLegend from "./VerdictLegend";

/** Rail droit (grand écran) : présentation courte et légende des verdicts. */
export default function RightRail() {
  return (
    <aside className="rrail" aria-label="À propos et légende">
      <div className="rrail-inner">
        <section className="panel" aria-labelledby="rr-about">
          <p className="kicker">Le projet</p>
          <h2 id="rr-about">À propos</h2>
          <p>
            Veille indépendante et non affiliée des publications officielles (X, TikTok, site de Nouvelle Énergie).
            Le projet évalue des <strong>mesures</strong>, jamais la personne.
          </p>
          <p className="panel-links">
            <Link href="/methodologie" className="more">Méthodologie</Link>
            <Link href="/methodologie#neutralite" className="more">Politique de neutralité</Link>
          </p>
        </section>
        <section className="panel" aria-labelledby="rr-legend">
          <p className="kicker">Analyse IA</p>
          <h2 id="rr-legend">Lire les verdicts</h2>
          <VerdictLegend />
        </section>
      </div>
    </aside>
  );
}
