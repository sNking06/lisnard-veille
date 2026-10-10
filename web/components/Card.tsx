"use client";
import { useState } from "react";
import { VERDICTS, type Analyse, type Proposition } from "@/lib/types";
import Embed from "./Embed";

const NET = { x: "X", tiktok: "TikTok", site: "Site Nouvelle Énergie" } as const;
const fmt = (d: string) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date(d));

function Badge({ v }: { v: Proposition["verdict"] }) {
  const m = VERDICTS[v];
  return <span className="badge" data-v={v} title="Verdict de faisabilité de la mesure (analyse IA)"><span aria-hidden>{m.symbole}</span> {m.label}</span>;
}

function Prop({ p }: { p: Proposition }) {
  return (
    <div className="prop">
      <h4>{p.texte}</h4>
      <p><Badge v={p.verdict} /> {p.fiabilite && <span className="fiab">fiabilité de l’analyse : {p.fiabilite}</span>}</p>
      <dl>
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

export default function Card({ a, repo }: { a: Analyse; repo: string }) {
  const [open, setOpen] = useState(false);
  const issue = `${repo}/issues/new?labels=erreur&title=${encodeURIComponent(`[Erreur] ${a.source} ${a.id}`)}&body=${encodeURIComponent(`Publication : ${a.lien}\nAnalyse : data/analyses/${a.source}-${a.id}.json\n\nErreur constatée (merci de citer une source) :\n`)}`;
  const verdicts = Array.from(new Set(a.propositions.map((p) => p.verdict)));
  return (
    <article className="card" id={`${a.source}-${a.id}`}>
      <div className="meta">
        <span className={`net net-${a.source}`}>{NET[a.source]}</span>
        <time dateTime={a.date}>{fmt(a.date)}</time>
        {verdicts.map((v) => <Badge key={v} v={v} />)}
      </div>
      {a.titre && <h3>{a.titre}</h3>}
      {a.statut === "degraded" ? (
        <p className="deg">Contenu non collecté (mode dégradé) : consultez la publication d’origine.</p>
      ) : (
        <p className="resume">{a.resume}</p>
      )}
      {a.citations && a.citations.length > 0 && <blockquote className="cit">{a.citations.map((c, i) => <p key={i}>« {c} »</p>)}</blockquote>}
      {a.integration && a.integration.type !== "none" && <Embed type={a.integration.type} id={a.integration.id} lien={a.lien} />}
      {a.propositions.length > 0 ? (
        <>
          <button className="toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? "Masquer l’analyse" : `Voir l’analyse (${a.propositions.length} proposition${a.propositions.length > 1 ? "s" : ""})`}
          </button>
          {open && (
            <div className="analyse">
              {a.propositions.map((p, i) => <Prop key={i} p={p} />)}
              {a.sources.length > 0 && (
                <div className="srcs"><h4>Sources consultées</h4><ul>{a.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener noreferrer" target="_blank">{s.titre}</a></li>)}</ul></div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="nop">Aucune proposition concrète : résumé seul.</p>
      )}
      {a.notes && <p className="notes">Note : {a.notes}</p>}
      {a.base_du_resume && <p className="base">Base du résumé : {a.base_du_resume}.</p>}
      <p className="ia">⚠️ {a.avertissement}</p>
      <p className="links">
        <a href={a.lien} rel="noopener noreferrer" target="_blank">Publication d’origine ↗</a>
        <a href={issue} rel="noopener noreferrer" target="_blank">Signaler une erreur</a>
      </p>
    </article>
  );
}
