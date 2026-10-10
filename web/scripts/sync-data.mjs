// Copie data/analyses (racine du dépôt) vers web/content/analyses avant le build.
// Si ../data n'est pas accessible (ex. Vercel sans « source files outside root »), on garde web/content/ déjà commité.
import fs from "node:fs";
import path from "node:path";
const src = path.resolve("..", "data", "analyses");
const dst = path.resolve("content", "analyses");
if (fs.existsSync(src)) {
  fs.rmSync(dst, { recursive: true, force: true });
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) if (f.endsWith(".json")) fs.copyFileSync(path.join(src, f), path.join(dst, f));
  console.log("sync-data: analyses copiées depuis ../data/analyses");
} else {
  console.log("sync-data: ../data introuvable, utilisation de web/content/analyses déjà présent");
}
