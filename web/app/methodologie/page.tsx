import type { Metadata } from "next";
import ColumnHeader from "@/components/ColumnHeader";
import Disclosure from "@/components/Disclosure";
import { loadDoc } from "@/lib/data";
import { parseMarkdown, plainText, renderBlocks, renderInline, type Block, type RenderCtx } from "@/lib/markdown";
import { CONTACT_EMAIL, CONTACT_HREF, ISSUE_URL, REPO } from "@/lib/site";

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
      <ColumnHeader title="Méthodologie et neutralité">
        <nav className="tabs" aria-label="Sections de la page">
          {docs.map((d) => <a key={d.id} href={`#${d.id}`} className="tab"><span className="tab-label">{d.fallback}</span></a>)}
          <a href="#contact" className="tab"><span className="tab-label">Contact</span></a>
        </nav>
      </ColumnHeader>

      <section className="intro" aria-labelledby="intro-titre">
        <p className="kicker">Méthode</p>
        <h2 id="intro-titre" className="display">Comment ce site fonctionne</h2>
        <p className="lede">
          Collecte, résumé, analyse de faisabilité et règles de neutralité. Les textes ci-dessous reprennent
          les documents <code>docs/methodologie.md</code> et <code>docs/neutralite.md</code> du dépôt.
        </p>
      </section>

      <nav className="doc-toc" aria-label="Sommaire">
        <div className="fnote">
          <Disclosure id="sommaire" label="Afficher le sommaire" openLabel="Masquer le sommaire">
            <ol className="toc" role="list">
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
          </Disclosure>
        </div>
      </nav>

      {docs.map((d) => {
        const ctx: RenderCtx = { shift: 1, prefix: d.id, docs: DOC_IDS };
        return (
          <section key={d.id} id={d.id} className="doc-section prose" aria-labelledby={`${d.id}-titre`}>
            <p className="kicker doc-file">docs/{d.file}</p>
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
      <section id="contact" className="doc-section prose" aria-labelledby="contact-titre">
        <p className="kicker doc-file">Contact</p>
        <h2 id="contact-titre">Contact et corrections</h2>
        <p>
          Pour toute question ou demande de correction, écrire à{" "}
          <a href={CONTACT_HREF}>{CONTACT_EMAIL}</a>. Les erreurs peuvent aussi être signalées via le lien{" "}
          <a href={ISSUE_URL} rel="noopener noreferrer">Signaler une erreur</a> sur GitHub.
        </p>
      </section>
    </>
  );
}
