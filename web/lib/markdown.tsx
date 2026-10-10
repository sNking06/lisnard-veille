// Rendu Markdown minimal côté serveur (aucune dépendance, aucun HTML brut injecté) :
// titres, paragraphes, listes (imbriquées), citations, code, tableaux, filets, gras/italique, liens.
import { createElement, Fragment, type ReactNode } from "react";
import { REPO } from "./site";

export type Block =
  | { t: "h"; level: number; text: string; id: string }
  | { t: "p"; text: string }
  | { t: "list"; ordered: boolean; start: number; loose: boolean; items: Block[][] }
  | { t: "quote"; blocks: Block[] }
  | { t: "code"; text: string }
  | { t: "hr" }
  | { t: "table"; head: string[]; rows: string[][] };

interface ParseCtx { prefix: string; slugs: Map<string, number> }
export interface RenderCtx {
  /** Décalage des niveaux de titre (1 : un « # » devient <h2>). */
  shift: number;
  /** Préfixe des ancres du document courant. */
  prefix: string;
  /** Documents rendus sur la même page : un lien vers « x.md » devient l'ancre « #x ». */
  docs: string[];
}

const BLANK = /^\s*$/;
const HEAD = /^ {0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const HR = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;
const LIST = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const QUOTE = /^ {0,3}>\s?(.*)$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const TSEP = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/;
const SETEXT = /^ {0,3}(=+|-+)\s*$/;

const indent = (l: string) => (/^\s*/.exec(l)?.[0].length ?? 0);
const startsBlock = (l: string) => HEAD.test(l) || HR.test(l) || QUOTE.test(l) || FENCE.test(l) || LIST.test(l);

export function plainText(s: string) {
  return s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*]|(?<![\p{L}\p{N}])_|_(?![\p{L}\p{N}])/gu, "").replace(/<([^>]+)>/g, "$1");
}

/** Ancres compatibles avec celles de GitHub (minuscules, ponctuation retirée, espaces → tirets). */
export function slugify(s: string) {
  return plainText(s).trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
}

function heading(level: number, text: string, ctx: ParseCtx): Block {
  const base = slugify(text) || "section";
  const n = ctx.slugs.get(base) ?? 0;
  ctx.slugs.set(base, n + 1);
  return { t: "h", level, text, id: `${ctx.prefix}-${n ? `${base}-${n}` : base}` };
}

function cells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function joinLines(buf: string[]) {
  return buf.map((l, k) => {
    const hard = k < buf.length - 1 && /( {2,}|\\)$/.test(l);
    return l.trim().replace(/\\$/, "") + (k < buf.length - 1 ? (hard ? "\n" : " ") : "");
  }).join("");
}

function parseList(lines: string[], i: number, ctx: ParseCtx, out: Block[]): number {
  const first = LIST.exec(lines[i])!;
  const base = first[1].length;
  const ordered = /\d/.test(first[2]);
  const items: { lines: string[]; content: number }[] = [];
  let loose = false;
  const isSibling = (m: RegExpExecArray | null): boolean =>
    !!m && m[1].length >= base && m[1].length <= base + 1 && /\d/.test(m[2]) === ordered;
  while (i < lines.length) {
    const l = lines[i];
    const m = LIST.exec(l);
    if (m && isSibling(m)) { items.push({ lines: [m[3]], content: m[0].length - m[3].length }); i++; continue; }
    if (m && m[1].length <= base + 1) break; // autre type de liste au même niveau
    const cur = items[items.length - 1];
    if (BLANK.test(l)) {
      let j = i + 1;
      while (j < lines.length && BLANK.test(lines[j])) j++;
      if (j < lines.length && (isSibling(LIST.exec(lines[j])) || indent(lines[j]) > base + 1)) {
        cur.lines.push(""); loose = true; i = j; continue;
      }
      break;
    }
    const ind = indent(l);
    if (ind > base + 1 || !startsBlock(l)) { cur.lines.push(l.slice(Math.min(ind, cur.content))); i++; continue; }
    break;
  }
  out.push({
    t: "list", ordered, start: ordered ? parseInt(first[2], 10) : 1, loose,
    items: items.map((it) => parse(it.lines, ctx)),
  });
  return i;
}

function parse(lines: string[], ctx: ParseCtx): Block[] {
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (BLANK.test(line)) { i++; continue; }
    if (line.trimStart().startsWith("<!--")) { // commentaires HTML ignorés
      while (i < lines.length && !lines[i].includes("-->")) i++;
      i++; continue;
    }
    const fence = FENCE.exec(line);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith(fence[1])) buf.push(lines[i++]);
      i++;
      out.push({ t: "code", text: buf.join("\n") });
      continue;
    }
    const h = HEAD.exec(line);
    if (h) { out.push(heading(h[1].length, h[2], ctx)); i++; continue; }
    if (HR.test(line)) { out.push({ t: "hr" }); i++; continue; }
    if (QUOTE.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && !BLANK.test(lines[i])) { const q = QUOTE.exec(lines[i]); buf.push(q ? q[1] : lines[i]); i++; }
      out.push({ t: "quote", blocks: parse(buf, ctx) });
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1].includes("-") && TSEP.test(lines[i + 1])) {
      const head = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && !BLANK.test(lines[i]) && lines[i].includes("|")) rows.push(cells(lines[i++]));
      out.push({ t: "table", head, rows });
      continue;
    }
    if (LIST.test(line)) { i = parseList(lines, i, ctx, out); continue; }
    const buf = [line];
    i++;
    while (i < lines.length && !BLANK.test(lines[i]) && !SETEXT.test(lines[i]) && !startsBlock(lines[i])) buf.push(lines[i++]);
    if (i < lines.length && SETEXT.test(lines[i])) {
      out.push(heading(lines[i].trim().startsWith("=") ? 1 : 2, joinLines(buf), ctx));
      i++;
      continue;
    }
    out.push({ t: "p", text: joinLines(buf) });
  }
  return out;
}

export function parseMarkdown(src: string, prefix: string): Block[] {
  const body = src.replace(/^﻿/, "").replace(/\r\n?/g, "\n").replace(/^---\n[\s\S]*?\n---\n/, "");
  return parse(body.split("\n"), { prefix, slugs: new Map() });
}

/* ---------- Rendu ---------- */

function resolveHref(raw: string, ctx: RenderCtx): { href: string; external: boolean } {
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return { href: raw, external: /^https?:/i.test(raw) };
  if (raw.startsWith("#")) return { href: `#${ctx.prefix}-${raw.slice(1)}`, external: false };
  const [p, hash] = raw.split("#");
  const clean = p.replace(/^\.\//, "");
  const doc = /^(?:\.\.\/docs\/)?([\w-]+)\.md$/.exec(clean);
  if (doc && ctx.docs.includes(doc[1])) return { href: hash ? `#${doc[1]}-${hash}` : `#${doc[1]}`, external: false };
  const repoPath = clean.startsWith("../") ? clean.slice(3) : `docs/${clean}`;
  return { href: `${REPO}/blob/main/${repoPath}${hash ? `#${hash}` : ""}`, external: true };
}

// \x | `code` | **gras** | __gras__ | [lien](url) / ![image](url) | <url> | url nue | *italique* | _italique_
const INLINE =
  /\\([!-/:-@[-`{-~])|`([^`]+)`|\*\*(.+?)\*\*|__(.+?)__|(!?)\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|<(https?:\/\/[^>\s]+)>|(https?:\/\/[^\s<>]*[^\s<>.,;:!?)\]»"'])|\*(?!\s)([^*]+?)(?<!\s)\*|(?<![\p{L}\p{N}])_(?!\s)([^_]+?)(?<!\s)_(?![\p{L}\p{N}])/gu;

function link(raw: string, label: ReactNode, ctx: RenderCtx, key: string) {
  const { href, external } = resolveHref(raw, ctx);
  return external
    ? <a key={key} href={href} rel="noopener noreferrer">{label}</a>
    : <a key={key} href={href}>{label}</a>;
}

export function renderInline(text: string, ctx: RenderCtx): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  const push = (s: string) => s.split("\n").forEach((part, j) => {
    if (j) out.push(<br key={`br${k++}`} />);
    if (part) out.push(part);
  });
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) push(text.slice(last, idx));
    last = idx + m[0].length;
    const key = `i${k++}`;
    if (m[1] !== undefined) out.push(m[1]);
    else if (m[2] !== undefined) out.push(<code key={key}>{m[2]}</code>);
    else if (m[3] !== undefined || m[4] !== undefined) out.push(<strong key={key}>{renderInline(m[3] ?? m[4], ctx)}</strong>);
    else if (m[6] !== undefined) out.push(link(m[7], renderInline(m[6], ctx), ctx, key)); // images rendues comme liens
    else if (m[8] !== undefined || m[9] !== undefined) { const u = m[8] ?? m[9]; out.push(link(u, u, ctx, key)); }
    else out.push(<em key={key}>{renderInline(m[10] ?? m[11], ctx)}</em>);
  }
  if (last < text.length) push(text.slice(last));
  return out;
}

export function renderBlocks(blocks: Block[], ctx: RenderCtx, tight = false): ReactNode[] {
  return blocks.map((b, k) => {
    switch (b.t) {
      case "h":
        return createElement(`h${Math.min(6, b.level + ctx.shift)}`, { key: k, id: b.id }, renderInline(b.text, ctx));
      case "p":
        return tight ? <Fragment key={k}>{renderInline(b.text, ctx)}</Fragment> : <p key={k}>{renderInline(b.text, ctx)}</p>;
      case "list": {
        const items = b.items.map((it, j) => <li key={j}>{renderBlocks(it, ctx, !b.loose)}</li>);
        return b.ordered
          ? <ol key={k} start={b.start !== 1 ? b.start : undefined}>{items}</ol>
          : <ul key={k}>{items}</ul>;
      }
      case "quote":
        return <blockquote key={k}>{renderBlocks(b.blocks, ctx)}</blockquote>;
      case "code":
        return <pre key={k}><code>{b.text}</code></pre>;
      case "hr":
        return <hr key={k} />;
      case "table":
        return (
          <div key={k} className="table-wrap" role="region" aria-label="Tableau" tabIndex={0}>
            <table>
              <thead><tr>{b.head.map((c, j) => <th key={j} scope="col">{renderInline(c, ctx)}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, n) => <td key={n}>{renderInline(c, ctx)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
    }
  });
}
