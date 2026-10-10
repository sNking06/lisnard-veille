#!/usr/bin/env python3
"""Collecte du site unenouvelleenergie.fr (pas de flux RSS : on lit posts-sitemap.xml puis chaque article)."""
import re, json, sys, pathlib, html, requests
BASE = "https://www.unenouvelleenergie.fr"
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "raw" / "site"
UA = {"User-Agent": "lisnard-veille/0.1 (veille publique; contact: issues GitHub)"}

def strip(h):
    h = re.sub(r"(?s)<(script|style|nav|footer|header)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"</(p|h\d|li|div)>", "\n", h)
    h = re.sub(r"<[^>]+>", " ", h)
    return re.sub(r"[ \t]+", " ", html.unescape(h)).strip()

def collect(n=6, extra=()):
    OUT.mkdir(parents=True, exist_ok=True)
    sm = requests.get(f"{BASE}/posts-sitemap.xml", headers=UA, timeout=30).text
    items = re.findall(r"<loc>(.*?)</loc><lastmod>(.*?)</lastmod>", sm)
    items.sort(key=lambda x: x[1], reverse=True)
    sel = items[:n] + [(u, "") for u in extra]
    for url, lastmod in sel:
        slug = url.rstrip("/").rsplit("/", 1)[-1]
        path = OUT / f"{slug[:80]}.json"
        if path.exists():
            continue
        rec = {"id": slug[:80], "reseau": "site", "url": url, "date": lastmod, "statut": "ok"}
        try:
            h = requests.get(url, headers=UA, timeout=30).text
            title = re.search(r"<title>(.*?)</title>", h, re.S)
            m = re.search(r"(?s)<article.*?</article>|<main.*?</main>", h)
            rec["titre"] = html.unescape(title.group(1)).strip() if title else slug
            rec["texte"] = strip(m.group(0) if m else h)
            d = re.search(r'"datePublished":"(.*?)"', h)
            if d: rec["date"] = d.group(1)
        except Exception as e:
            rec.update(statut="degraded", erreur=str(e)[:200])
        path.write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8")
        print("ok", slug)

if __name__ == "__main__":
    collect(int(sys.argv[1]) if len(sys.argv) > 1 else 6, sys.argv[2:])
