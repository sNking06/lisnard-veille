import { VERDICTS, type Verdict } from "@/lib/types";

/** Trois points pleins/vides : la gradation est portée par la forme, pas par la couleur. */
export function Dots({ n }: { n: number }) {
  return (
    <span className="dots" aria-hidden="true">
      {[0, 1, 2].map((i) => <span key={i} className={i < n ? "dot on" : "dot"} />)}
    </span>
  );
}

/** Marqueur des publications sans proposition analysée. */
export function Dash() {
  return <span className="dots dots-none" aria-hidden="true"><span className="dash" /></span>;
}

export default function VerdictBadge({ v }: { v: Verdict }) {
  const m = VERDICTS[v];
  return (
    <span className="verdict" title="Verdict de faisabilité de la mesure (analyse IA)">
      <Dots n={m.niveau} />
      <span>{m.label}</span>
    </span>
  );
}
