import Link from "next/link";
import Card from "@/components/Card";
import Feed, { type FeedEntry, type VerdictKey } from "@/components/Feed";
import VerdictBadge, { Dash } from "@/components/VerdictBadge";
import { loadAnalyses } from "@/lib/data";
import { normalize } from "@/lib/search";
import { fmtDate } from "@/lib/site";
import type { Verdict } from "@/lib/types";

const LEGEND: Verdict[] = ["faisable", "faisable_sous_conditions", "difficilement_faisable"];

export default function Home() {
  const items = loadAnalyses();
  const entries: FeedEntry[] = items.map((a) => ({
    key: `${a.source}-${a.id}`,
    source: a.source,
    verdicts: a.propositions.length ? Array.from(new Set<VerdictKey>(a.propositions.map((p) => p.verdict))) : ["sans_analyse"],
    text: normalize([a.titre ?? "", a.resume, ...a.propositions.map((p) => p.texte)].join(" ")),
    ts: +new Date(a.date),
    node: <Card a={a} />,
  }));
  const nProps = items.reduce((n, a) => n + a.propositions.length, 0);
  const last = items[0]?.date;

  return (
    <>
      <section className="hero" aria-labelledby="titre">
        <div className="container hero-grid">
          <div className="hero-main">
            <p className="kicker">Veille indépendante des publications officielles</p>
            <h1 id="titre">Veille Lisnard 2027</h1>
            <p className="lede">
              Fil des publications des comptes officiels (X, TikTok, site de Nouvelle Énergie) : résumé fidèle,
              propositions concrètes et analyse de faisabilité. Le projet évalue des <strong>mesures</strong>, jamais la personne.
            </p>
            <p className="hero-links">
              <Link href="/methodologie" className="btn btn-quiet">Lire la méthodologie</Link>
              <Link href="/methodologie#neutralite" className="text-link">Politique de neutralité</Link>
            </p>
          </div>
          <aside className="hero-aside" aria-label="En bref">
            <dl className="facts-row">
              <div><dt>Publications</dt><dd>{items.length}</dd></div>
              <div><dt>Propositions analysées</dt><dd>{nProps}</dd></div>
              {last && <div><dt>Dernière publication</dt><dd className="fact-date"><time dateTime={last}>{fmtDate(last)}</time></dd></div>}
            </dl>
            <div className="legend">
              <h2 className="eyebrow">Lire les verdicts</h2>
              <ul role="list">
                {LEGEND.map((v) => <li key={v}><VerdictBadge v={v} /></li>)}
                <li><span className="verdict"><Dash /><span>Sans analyse</span></span></li>
              </ul>
              <p className="legend-note">Verdicts de faisabilité établis par IA, portant sur la mesure. La forme des repères, non la couleur, indique le niveau.</p>
            </div>
          </aside>
        </div>
      </section>
      <Feed entries={entries} />
    </>
  );
}
