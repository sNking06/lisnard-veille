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
