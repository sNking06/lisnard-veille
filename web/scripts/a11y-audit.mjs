// Audit axe-core (WCAG 2.x A/AA) des pages principales : thèmes clair/sombre × bureau 1280 / mobile 390.
// Prérequis : npm i --no-save playwright @axe-core/playwright && npx playwright install chromium
// Usage : npm run build && npx serve out -l 3000   puis   node scripts/a11y-audit.mjs [http://localhost:3000]
// Les lecteurs tiers (iframes X / TikTok) sont exclus : leur contenu ne dépend pas de ce site.
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const PAGES = ["/", "/methodologie", "/page-inexistante"];
const VIEWPORTS = { bureau: { width: 1280, height: 900 }, mobile: { width: 390, height: 844 } };
const THEMES = ["light", "dark"];

const browser = await chromium.launch();
let total = 0;
for (const theme of THEMES) {
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      // Ouvre les dépliants pour auditer aussi leur contenu (détail des analyses, légende, sommaire).
      await page.evaluate(() => document.querySelectorAll('button[aria-expanded="false"]').forEach((b) => b.click()));
      await page.waitForTimeout(300);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .exclude(".embed iframe")
        .analyze();
      total += violations.length;
      console.log(`${violations.length ? "✗" : "✓"} ${path} — ${theme} — ${vpName} : ${violations.length} violation(s)`);
      for (const v of violations) {
        console.log(`  [${v.impact}] ${v.id} : ${v.help}`);
        for (const n of v.nodes.slice(0, 5)) console.log(`    ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1] ?? ""}`);
      }
    }
    await ctx.close();
  }
}
await browser.close();
process.exit(total ? 1 : 0);
