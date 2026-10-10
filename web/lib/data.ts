import fs from "node:fs";
import path from "node:path";
import type { Analyse } from "./types";

export function loadAnalyses(): Analyse[] {
  const dir = path.join(process.cwd(), "content", "analyses");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Analyse)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

/** Lit un document de ../docs (source de vérité) ou, à défaut, sa copie web/content/docs. */
export function loadDoc(name: string): string | null {
  for (const p of [path.join(process.cwd(), "..", "docs", name), path.join(process.cwd(), "content", "docs", name)]) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
  }
  return null;
}
