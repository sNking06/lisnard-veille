import type { Verdict } from "@/lib/types";
import VerdictBadge, { Dash } from "./VerdictBadge";

const LEGEND: Verdict[] = ["faisable", "faisable_sous_conditions", "difficilement_faisable"];

/** Légende des verdicts (rail droit en grand écran, panneau repliable du filtre ailleurs). */
export default function VerdictLegend() {
  return (
    <>
      <ul className="legend" role="list">
        {LEGEND.map((v) => <li key={v}><VerdictBadge v={v} /></li>)}
        <li><span className="verdict"><Dash /><span>Sans analyse</span></span></li>
      </ul>
      <p className="panel-note">Verdicts de faisabilité établis par IA, portant sur la mesure. La forme des repères, non la couleur, indique le niveau.</p>
    </>
  );
}
