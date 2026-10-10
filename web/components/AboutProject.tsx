import Link from "next/link";
import { loadAnalyses } from "@/lib/data";
import { fmtDate } from "@/lib/site";

/** Présentation compacte du projet : chapô court, compteurs, liens. Utilisée dans le rail droit et le panneau repliable mobile. */
export default function AboutProject() {
  const items = loadAnalyses();
  const nProps = items.reduce((n, a) => n + a.propositions.length, 0);
  const last = items[0]?.date;
  return (
    <>
      <p>
        Veille indépendante et non affiliée des publications officielles (X, TikTok, site de Nouvelle Énergie) : résumé fidèle,
        propositions concrètes et analyse de faisabilité. Le projet évalue des <strong>mesures</strong>, jamais la personne.
      </p>
      <dl className="stats">
        <div><dt>Publications</dt><dd>{items.length}</dd></div>
        <div><dt>Propositions analysées</dt><dd>{nProps}</dd></div>
        {last && <div><dt>Dernière publication</dt><dd><time dateTime={last}>{fmtDate(last)}</time></dd></div>}
      </dl>
      <p className="panel-links">
        <Link href="/methodologie" className="more">Lire la méthodologie</Link>
        <Link href="/methodologie#neutralite" className="more">Politique de neutralité</Link>
      </p>
    </>
  );
}
