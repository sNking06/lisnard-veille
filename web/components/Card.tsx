import type { Analyse, Proposition } from "@/lib/types";
import { NETWORKS, REPO, fmtDate } from "@/lib/site";
import Disclosure from "./Disclosure";
import Embed from "./Embed";
import VerdictBadge from "./VerdictBadge";

const NEW_TAB = <span className="sr-only"> (nouvel onglet)</span>;

function Detail({ p, n, total }: { p: Proposition; n: number; total: number }) {
  return (
    <div className="detail-prop">
      <h5 className="detail-title">
        {total > 1 && <span className="detail-n">Proposition {n}</span>}
        {p.texte}
      </h5>
      <p className="detail-verdict">
        <VerdictBadge v={p.verdict} />
        {p.fiabilite && <span className="fiab">Fiabilité de l’analyse : {p.fiabilite}</span>}
      </p>
      <dl className="facts">
        <dt>Coût estimé</dt><dd>{p.cout}</dd>
        <dt>Cadre juridique / constitutionnel</dt><dd>{p.cadre_juridique}</dd>
        <dt>Compétence (État / UE / collectivités)</dt><dd>{p.competence}</dd>
        <dt>Précédents (France / étranger)</dt><dd>{p.precedents}</dd>
        {p.conditions.length > 0 && (<><dt>Conditions</dt><dd><ul>{p.conditions.map((c, i) => <li key={i}>{c}</li>)}</ul></dd></>)}
        {p.doutes && (<><dt>Réserves</dt><dd>{p.doutes}</dd></>)}
      </dl>
    </div>
  );
}

export default function Card({ a }: { a: Analyse }) {
  const anchor = `${a.source}-${a.id}`;
  const date = fmtDate(a.date);
  const net = NETWORKS[a.source];
  const issue = `${REPO}/issues/new?labels=erreur&title=${encodeURIComponent(`[Erreur] ${a.source} ${a.id}`)}&body=${encodeURIComponent(`Publication : ${a.lien}\nAnalyse : data/analyses/${a.source}-${a.id}.json\n\nErreur constatée (merci de citer une source) :\n`)}`;
  const n = a.propositions.length;
  return (
    <article className="card" id={anchor} aria-labelledby={`${anchor}-t`}>
      <header className="card-head">
        <p className="card-meta">
          <span className="net">{net.label}</span>
          <time dateTime={a.date}>{date}</time>
        </p>
        <h3 id={`${anchor}-t`} className={a.titre ? "card-title" : "sr-only"}>{a.titre ?? `${net.long} du ${date}`}</h3>
      </header>

      {a.statut === "degraded" ? (
        <p className="muted-note">Contenu non collecté (mode dégradé) : consultez la publication d’origine.</p>
      ) : (
        <p className="resume">{a.resume}</p>
      )}
      {a.base_du_resume && <p className="base">Base du résumé : {a.base_du_resume}.</p>}

      {a.citations && a.citations.length > 0 && (
        <blockquote className="quote">{a.citations.map((c, i) => <p key={i}>« {c} »</p>)}</blockquote>
      )}

      {a.integration && a.integration.type !== "none" && <Embed type={a.integration.type} id={a.integration.id} lien={a.lien} />}

      {n > 0 ? (
        <section className="props" aria-labelledby={`${anchor}-p`}>
          <h4 id={`${anchor}-p`} className="eyebrow">{n > 1 ? `${n} propositions relevées` : "1 proposition relevée"}</h4>
          <ol className="prop-list" role="list">
            {a.propositions.map((p, i) => (
              <li key={i}>
                <p className="prop-text">{p.texte}</p>
                <VerdictBadge v={p.verdict} />
              </li>
            ))}
          </ol>
          <Disclosure id={`${anchor}-detail`} label="Voir le détail de l’analyse" openLabel="Masquer le détail de l’analyse">
            {a.propositions.map((p, i) => <Detail key={i} p={p} n={i + 1} total={n} />)}
            {a.sources.length > 0 && (
              <div className="sources">
                <h5 className="eyebrow">Sources consultées</h5>
                <ol>
                  {a.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} rel="noopener noreferrer" target="_blank">{s.titre}{NEW_TAB}</a>
                      {s.consulte_le && <span className="consulted"> — consulté le {fmtDate(s.consulte_le)}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {(a.genere_le || a.genere_par) && (
              <p className="gen">
                Analyse générée{a.genere_le && <> le {fmtDate(a.genere_le)}</>}{a.genere_par && <> par {a.genere_par}</>}.
              </p>
            )}
          </Disclosure>
        </section>
      ) : (
        <p className="muted-note">Aucune proposition concrète analysée : résumé seul.</p>
      )}

      {a.notes && <p className="note"><span className="note-label">Note</span> {a.notes}</p>}

      <footer className="card-foot">
        <p className="ai-flag"><span className="ai-tag" aria-hidden="true">IA</span><span>{a.avertissement}</span></p>
        <ul className="card-links" role="list">
          <li><a href={a.lien} rel="noopener noreferrer" target="_blank">Publication d’origine<span aria-hidden="true"> ↗</span>{NEW_TAB}</a></li>
          <li><a href={issue} rel="noopener noreferrer" target="_blank">Signaler une erreur{NEW_TAB}</a></li>
        </ul>
      </footer>
    </article>
  );
}
