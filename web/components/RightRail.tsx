import AboutProject from "./AboutProject";
import VerdictLegend from "./VerdictLegend";

/** Rail droit (grand écran) : présentation courte et légende des verdicts. */
export default function RightRail() {
  return (
    <aside className="rrail" aria-label="À propos et légende">
      <div className="rrail-inner">
        <section className="panel" aria-labelledby="rr-about">
          <p className="kicker">Le projet</p>
          <h2 id="rr-about">À propos</h2>
          <AboutProject />
        </section>
        <section className="panel" aria-labelledby="rr-legend">
          <p className="kicker">Analyse IA</p>
          <h2 id="rr-legend">Lire les verdicts</h2>
          <VerdictLegend />
        </section>
      </div>
    </aside>
  );
}
