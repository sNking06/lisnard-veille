"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { VERDICTS, type Source, type Verdict } from "@/lib/types";
import { normalize } from "@/lib/search";
import ColumnHeader from "./ColumnHeader";
import Disclosure from "./Disclosure";
import { IconSearch } from "./Icons";
import { Dash, Dots } from "./VerdictBadge";
import VerdictLegend from "./VerdictLegend";

export type VerdictKey = Verdict | "sans_analyse";
/** Une entrée du fil : métadonnées de filtrage + publication déjà rendue côté serveur. */
export interface FeedEntry { key: string; source: Source; verdicts: VerdictKey[]; text: string; ts: number; node: ReactNode }

const TABS: [Source | "all", string][] = [["all", "Tout"], ["x", "X"], ["tiktok", "TikTok"], ["site", "Site"]];
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

export default function Feed({ title, entries, children }: { title: string; entries: FeedEntry[]; children?: ReactNode }) {
  const [net, setNet] = useState<Source | "all">("all");
  const [verdict, setVerdict] = useState<VerdictKey | "all">("all");
  const [q, setQ] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const input = useRef<HTMLInputElement>(null);

  // Arrivée depuis le lien « Recherche » d'une autre page : focus direct dans le champ.
  useEffect(() => {
    if (window.location.hash === "#recherche") input.current?.focus();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: entries.length };
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
    <>
      <ColumnHeader title={title}>
        <div className="tabs" role="group" aria-label="Filtrer par réseau">
          {TABS.map(([k, l]) => (
            <button key={k} type="button" className="tab" aria-pressed={net === k} onClick={() => setNet(k)}>
              <span className="tab-label">{l}<span className="sr-only">{`, ${plural(counts[k] ?? 0, "publication")}`}</span></span>
            </button>
          ))}
        </div>
      </ColumnHeader>

      {children}

      <section aria-labelledby="fil-titre">
        <header className="section-head">
          <p className="kicker">Le fil</p>
          <h2 id="fil-titre" className="section-title">Publications et analyses</h2>
        </header>
        <div className="filters">
          <form role="search" id="recherche" className="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="q" className="sr-only">Rechercher dans les publications</label>
            <div className="search-field">
              <IconSearch className="search-icon" size={18} />
              <input ref={input} id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (titre, résumé, proposition)"
                autoComplete="off" spellCheck={false} aria-describedby="q-hint" />
            </div>
            <p id="q-hint" className="sr-only">Recherche dans les titres, résumés et propositions.</p>
          </form>
          <div className="chips" role="group" aria-label="Filtrer par verdict">
            <Chip on={verdict === "all"} onClick={() => setVerdict("all")}>Tous les verdicts</Chip>
            {VKEYS.map((k) => (
              <Chip key={k} on={verdict === k} onClick={() => setVerdict(k)} count={counts[k] ?? 0}>
                {k === "sans_analyse" ? <Dash /> : <Dots n={VERDICTS[k].niveau} />}
                {vLabel(k)}
              </Chip>
            ))}
          </div>
          {/* La légende du rail droit n'est visible qu'en grand écran : version repliable ailleurs. */}
          <div className="legend-box">
            <Disclosure id="legende-verdicts" label="Comprendre les verdicts" openLabel="Comprendre les verdicts">
              <VerdictLegend />
            </Disclosure>
          </div>
        </div>

        <div className="feed-bar">
          <p className="count" role="status" aria-live="polite" aria-atomic="true">{status}</p>
          <div className="feed-tools">
            {active && <button type="button" className="link-btn" onClick={reset}>Réinitialiser</button>}
            <label htmlFor="sort" className="sr-only">Trier par date</label>
            <select id="sort" className="select" value={order} onChange={(e) => setOrder(e.target.value as "desc" | "asc")}>
              <option value="desc">Plus récentes d’abord</option>
              <option value="asc">Plus anciennes d’abord</option>
            </select>
          </div>
        </div>
        {shown.length > 0 ? (
          <ol className="feed" role="list">
            {shown.map((e) => <li key={e.key}>{e.node}</li>)}
          </ol>
        ) : (
          <div className="empty">
            <p>Aucune publication ne correspond à ces critères.</p>
            <button type="button" className="btn" onClick={reset}>Réinitialiser les filtres</button>
          </div>
        )}
      </section>
    </>
  );
}
