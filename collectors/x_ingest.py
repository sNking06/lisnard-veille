#!/usr/bin/env python3
"""Normalise les réponses brutes de get_users_posts (MCP X natif, utilisé par Grok Bot)
vers data/raw/x/<id>.json. Usage: x_ingest.py reponse1.json [reponse2.json ...]
Les fichiers d'entrée peuvent contenir du texte autour de l'objet JSON (sortie d'outil)."""
import json, sys, pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "raw" / "x"
USER = "davidlisnard"

def load(path):
    t = open(path, encoding="utf-8").read()
    return json.loads(t[t.index('{"data"'): t.rindex("}") + 1])

def normalise(p, includes):
    full = p.get("note_tweet", {}).get("text") or p["text"]
    quoted = None
    for r in p.get("referenced_tweets", []) or []:
        if r["type"] == "quoted":
            q = next((t for t in includes.get("tweets", []) if t["id"] == r["id"]), None)
            quoted = {"id": r["id"], "texte": ((q or {}).get("note_tweet") or {}).get("text") or (q or {}).get("text"), "auteur_id": (q or {}).get("author_id")}
    return {
        "id": p["id"], "reseau": "x", "compte": USER,
        "date": p["created_at"],
        "url": f"https://x.com/{USER}/status/{p['id']}",
        "texte": full,
        "citation": quoted,
        "metriques": p.get("public_metrics"),
        "type": "texte",
        "statut": "ok",
        "collecte_par": "Grok Bot (MCP X natif, get_users_posts)",
    }

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    seen = {}
    for f in sys.argv[1:]:
        d = load(f)
        for p in d["data"]:
            if p.get("referenced_tweets") and any(r["type"] in ("retweeted", "replied_to") for r in p["referenced_tweets"]):
                continue
            n = normalise(p, d.get("includes", {}))
            old = seen.get(p["id"])
            if old and old["citation"] and not n["citation"]:
                n["citation"] = old["citation"]
            if old and len(old["texte"]) > len(n["texte"]):
                n["texte"] = old["texte"]
            seen[p["id"]] = n
    for i in sorted(seen, reverse=True)[:10]:
        (OUT / f"{i}.json").write_text(json.dumps(seen[i], ensure_ascii=False, indent=2), encoding="utf-8")
        print("ok", i)
