import AboutProject from "@/components/AboutProject";
import Card from "@/components/Card";
import Feed, { type FeedEntry, type VerdictKey } from "@/components/Feed";
import { loadAnalyses } from "@/lib/data";
import { normalize } from "@/lib/search";
import { SITE_TITLE } from "@/lib/site";

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

  return (
    <Feed title={SITE_TITLE} entries={entries} about={<AboutProject />} />
  );
}
