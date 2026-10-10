import type { Metadata } from "next";
import { loadDoc } from "@/lib/data";
import { parseMarkdown, plainText, renderBlocks, renderInline, type Block, type RenderCtx } from "@/lib/markdown";
import { REPO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Méthodologie et neutralité",
  description: "Méthode de collecte, de résumé et d'analyse de faisabilité, et politique de neutralité du projet.",
};

// Textes repris tels quels des documents du dépôt (docs/), lus au moment du build.
const DOCS = [
  { id: "methodologie", file: "methodologie.md", fallback: "Méthodologie" },
  { id: "neutralite", file: "neutralite.md", fallback: "Neutralité" },
];
const DOC_IDS = DOCS.map((d) => d.id);

function prepare(d: (typeof DOCS)[number]) {
  const src = loadDoc(d.file);
  if (!src) return { ...d, title: d.fallback, body: null as Block[] | null, toc: [] as { id: string; text: string }[] };
  const blocks = parseMarkdown(src, d.id);
  const first = blocks[0];
  const title = first?.t === "h" && first.level === 1 ? first.text : null;
  const body = title ? blocks.slice(1) : blocks;
  const toc = body.flatMap((b) => (b.t === "h" && b.level === 2 ? [{ id: b.id, text: plainText(b.text) }] : []));
  return { ...d, title: title ?? d.fallback, body, toc };
}

export default function Methodologie() {
  const docs = DOCS.map(prepare);
  return (
    <>
      <section className="hero hero-compact" aria-labelledby="titre">
        <div className="container">
          <p className="kicker">Comment ce site fonctionne</p>
          <h1 id="titre">Méthodologie et neutralité</h1>
          <p className="lede">
            Collecte, résumé, analyse de faisabilité et règles de neutralité. Les textes ci-dessous reprennent
            les documents <code>docs/methodologie.md</code> et <code>docs/neutralite.md</code> du dépôt.
          </p>
        </div>
      </section>

      <div className="container doc-layout">
        <nav className="toc" aria-label="Sommaire">
          <div className="toc-inner">
            <h2 className="eyebrow">Sommaire</h2>
            <ol role="list">
              {docs.map((d) => (
                <li key={d.id}>
                  <a href={`#${d.id}`} className="toc-doc">{plainText(d.title)}</a>
                  {d.toc.length > 0 && (
                    <ol role="list">
                      {d.toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="doc-body">
          {docs.map((d) => {
            const ctx: RenderCtx = { shift: 1, prefix: d.id, docs: DOC_IDS };
            return (
              <section key={d.id} id={d.id} className="doc-section prose" aria-labelledby={`${d.id}-titre`}>
                <p className="kicker">docs/{d.file}</p>
                <h2 id={`${d.id}-titre`}>{renderInline(d.title, ctx)}</h2>
                {d.body ? renderBlocks(d.body, ctx) : (
                  <p>Document indisponible lors de la génération du site.</p>
                )}
                <p className="doc-src">
                  <a href={`${REPO}/blob/main/docs/${d.file}`} rel="noopener noreferrer">Voir le fichier source sur GitHub</a>
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
