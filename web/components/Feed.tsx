"use client";
import { useMemo, useState } from "react";
import type { Analyse } from "@/lib/types";
import Card from "./Card";

const NETS = [["all", "Tous"], ["x", "X"], ["tiktok", "TikTok"], ["site", "Site"]] as const;

export default function Feed({ items, repo }: { items: Analyse[]; repo: string }) {
  const [net, setNet] = useState<string>("all");
  const [onlyAnalysed, setOnly] = useState(false);
  const shown = useMemo(
    () => items.filter((i) => (net === "all" || i.source === net) && (!onlyAnalysed || i.propositions.length > 0)),
    [items, net, onlyAnalysed],
  );
  return (
    <section aria-label="Fil des publications">
      <div className="filters" role="group" aria-label="Filtres">
        {NETS.map(([k, l]) => (
          <button key={k} className={net === k ? "chip on" : "chip"} aria-pressed={net === k} onClick={() => setNet(k)}>{l}</button>
        ))}
        <label className="chk"><input type="checkbox" checked={onlyAnalysed} onChange={(e) => setOnly(e.target.checked)} /> Avec analyse de propositions</label>
        <span className="count">{shown.length} publication{shown.length > 1 ? "s" : ""}</span>
      </div>
      <div className="feed">
        {shown.map((a) => <Card key={`${a.source}-${a.id}`} a={a} repo={repo} />)}
        {shown.length === 0 && <p>Aucune publication.</p>}
      </div>
    </section>
  );
}
