"use client";
import { useMemo, useState, type ReactNode } from "react";
import { VERDICTS, type Source, type Verdict } from "@/lib/types";
import { normalize } from "@/lib/search";
import { Dash, Dots } from "./VerdictBadge";

export type VerdictKey = Verdict | "sans_analyse";
/** Une entrée du fil : métadonnées de filtrage + carte déjà rendue côté serveur. */
export interface FeedEntry { key: string; source: Source; verdicts: VerdictKey[]; text: string; ts: number; node: ReactNode }

const NETS: [Source, string][] = [["x", "X"], ["tiktok", "TikTok"], ["site", "Site"]];
const VKEYS: VerdictKey[] = ["faisable", "faisable_sous_conditions", "difficilement_faisable", "sans_analyse"];
const vLabel = (k: VerdictKey) => (k === "sans_analyse" ? "Sans analyse" : VERDICTS[k].label);
const plural = (n: number, s: string) => `${n} ${s}${n > 1 ? "s" : ""}`;

function Chip({ on, onClick, children, count }: { on: boolean; onClick: () => void; children: ReactNode; count?: number }) {
  return (
    <button type="button" className="chip" aria-pressed={on} onClick={onClick}>
      <span className="chip-label">{children}</span>
      {count !== undefined && <span className="chip-n">{count}</span>}
    </button>
  );
}

export default function Feed({ entries }: { entries: FeedEntry[] }) {
  const [net, setNet] = useState<Source | "all">("all");
  const [verdict, setVerdict] = useState<VerdictKey | "all">("all");
  const [q, setQ] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of entries) {
      c[e.source] = (c[e.source] ?? 0) + 1;
      for (const v of e.verdicts) c[v] = (c[v] ?? 0) + 1;
    }
    return c;
  }, [entries]);

  const shown = useMemo(() => {
    const terms = normalize(q).split(/\s+/).filter(Boolean);
    return entries
      .filter((e) => (net === "all" || e.source === net) && (verdict === "all" || e.verdicts.includes(verdict)) && terms.every((t) => e.text.includes(t)))
      .sort((a, b) => (order === "desc" ? b.ts - a.ts : a.ts - b.ts));
  }, [entries, net, verdict, q, order]);

  const active = net !== "all" || verdict !== "all" || q.trim() !== "" || order !== "desc";
  const reset = () => { setNet("all"); setVerdict("all"); setQ(""); setOrder("desc"); };
  const status = shown.length === entries.length && !q.trim()
    ? plural(entries.length, "publication")
    : `${plural(shown.length, "publication")} sur ${entries.length}${q.trim() ? ` pour « ${q.trim()} »` : ""}`;

  return (
    <div className="feed-layout container">
      <aside className="rail" aria-label="Recherche et filtres">
        <div className="rail-inner">
          <form role="search" className="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="q" className="field-label">Rechercher</label>
            <div className="search-field">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Titre, résumé, proposition…"
                autoComplete="off" spellCheck={false} aria-describedby="q-hint" />
            </div>
            <p id="q-hint" className="hint">Recherche dans les titres, résumés et propositions.</p>
          </form>

          <fieldset className="facet">
            <legend className="field-label">Réseau</legend>
            <div className="chips">
              <Chip on={net === "all"} onClick={() => setNet("all")} count={entries.length}>Tous</Chip>
              {NETS.map(([k, l]) => (
                <Chip key={k} on={net === k} onClick={() => setNet(k)} count={counts[k] ?? 0}>{l}</Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="facet">
            <legend className="field-label">Verdict</legend>
            <div className="chips chips-stack">
              <Chip on={verdict === "all"} onClick={() => setVerdict("all")}>Tous les verdicts</Chip>
              {VKEYS.map((k) => (
                <Chip key={k} on={verdict === k} onClick={() => setVerdict(k)} count={counts[k] ?? 0}>
                  {k === "sans_analyse" ? <Dash /> : <Dots n={VERDICTS[k].niveau} />}
                  {vLabel(k)}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="facet">
            <label htmlFor="sort" className="field-label">Trier par date</label>
            <select id="sort" className="select" value={order} onChange={(e) => setOrder(e.target.value as "desc" | "asc")}>
              <option value="desc">Plus récentes d’abord</option>
              <option value="asc">Plus anciennes d’abord</option>
            </select>
          </div>

          {active && <button type="button" className="btn btn-quiet reset" onClick={reset}>Réinitialiser les filtres</button>}
        </div>
      </aside>

      <section className="feed-col" aria-labelledby="fil-titre">
        <div className="feed-head">
          <h2 id="fil-titre" className="section-title">Fil des publications</h2>
          <p className="count" role="status" aria-live="polite" aria-atomic="true">{status}</p>
        </div>
        {shown.length > 0 ? (
          <ol className="feed" role="list">
            {shown.map((e) => <li key={e.key}>{e.node}</li>)}
          </ol>
        ) : (
          <div className="empty">
            <p>Aucune publication ne correspond à ces critères.</p>
            <button type="button" className="btn btn-quiet" onClick={reset}>Réinitialiser les filtres</button>
          </div>
        )}
      </section>
    </div>
  );
}
