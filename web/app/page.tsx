import Link from "next/link";
import Card from "@/components/Card";
import Feed, { type FeedEntry, type VerdictKey } from "@/components/Feed";
import { loadAnalyses } from "@/lib/data";
import { normalize } from "@/lib/search";
import { SITE_TITLE, fmtDate } from "@/lib/site";

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
    <Feed title={SITE_TITLE} entries={entries}>
      <section className="intro" aria-labelledby="intro-titre">
        <p className="kicker">Veille indépendante</p>
        <h2 id="intro-titre" className="display">Les publications officielles, résumées et analysées</h2>
        <p className="lede">
          Fil des publications des comptes officiels (X, TikTok, site de Nouvelle Énergie) : résumé fidèle,
          propositions concrètes et analyse de faisabilité. Le projet évalue des <strong>mesures</strong>, jamais la personne.
        </p>
        <dl className="stats">
          <div><dt>Publications</dt><dd>{items.length}</dd></div>
          <div><dt>Propositions analysées</dt><dd>{nProps}</dd></div>
          {last && <div><dt>Dernière publication</dt><dd><time dateTime={last}>{fmtDate(last)}</time></dd></div>}
        </dl>
        <p className="intro-links">
          <Link href="/methodologie" className="more">Lire la méthodologie</Link>
          <Link href="/methodologie#neutralite" className="more">Politique de neutralité</Link>
        </p>
      </section>
    </Feed>
  );
}
