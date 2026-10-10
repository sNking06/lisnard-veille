#!/usr/bin/env python3
"""Analyse des publications brutes -> data/analyses/<source>-<id>.json (schema/analysis.schema.json).

Modes :
  run.py list                 liste les publications brutes sans analyse
  run.py validate             valide tous les JSON de data/analyses contre le schéma
  run.py analyze [--limit N]  appelle un modèle (API compatible OpenAI) pour les publications sans analyse.
                              Requiert les secrets ANALYZER_API_KEY (+ optionnel ANALYZER_API_URL, ANALYZER_MODEL).
                              Sans clé : n'écrit rien et sort proprement (code 0).

Les analyses du prototype (10/10/2026) ont été rédigées par Grok Bot avec recherches web ; elles portent
« genere_par ». La recherche web n'est PAS faite par `analyze` : sans outil de recherche, le modèle doit
répondre « non établi » pour tout chiffre ou précédent non fourni (voir prompt.md).
"""
import json, os, sys, pathlib, glob, datetime, urllib.request
from jsonschema import Draft202012Validator

ROOT = pathlib.Path(__file__).resolve().parent.parent
AN = ROOT / "data" / "analyses"
SCHEMA = json.load(open(ROOT / "schema" / "analysis.schema.json", encoding="utf-8"))
WARN = "Analyse générée par IA, peut contenir des erreurs."

def raws():
    for src in ("x", "tiktok", "site"):
        for f in sorted(glob.glob(str(ROOT / "data" / "raw" / src / "*.json"))):
            yield src, json.load(open(f, encoding="utf-8"))

def out_path(src, rid):
    return AN / f"{src}-{rid}.json"

def pending():
    return [(s, r) for s, r in raws() if not out_path(s, r["id"]).exists()]

def validate():
    v, bad = Draft202012Validator(SCHEMA), 0
    for f in sorted(glob.glob(str(AN / "*.json"))):
        errs = list(v.iter_errors(json.load(open(f, encoding="utf-8"))))
        for e in errs:
            bad += 1; print(f"{os.path.basename(f)}: {'/'.join(map(str, e.path))}: {e.message[:150]}")
    print("OK" if not bad else f"{bad} erreur(s)"); return bad == 0

def material(src, r):
    if src == "tiktok":
        t = ""
        if r.get("transcription"):
            t = open(ROOT / r["transcription"]["fichier"], encoding="utf-8").read()
        return f"Légende: {r.get('description','')}\nTranscription ({(r.get('transcription') or {}).get('source','aucune')}): {t}"
    return r.get("texte", "")

def analyze(limit):
    key = os.environ.get("ANALYZER_API_KEY")
    if not key:
        print("ANALYZER_API_KEY absente : analyse automatique ignorée (voir README)."); return
    url = os.environ.get("ANALYZER_API_URL", "https://api.openai.com/v1/chat/completions")
    model = os.environ.get("ANALYZER_MODEL", "")
    if not model:
        print("ANALYZER_MODEL absent : analyse ignorée."); return
    prompt = open(ROOT / "analyzer" / "prompt.md", encoding="utf-8").read()
    AN.mkdir(parents=True, exist_ok=True)
    for src, r in pending()[:limit]:
        body = {"model": model, "response_format": {"type": "json_object"}, "messages": [
            {"role": "system", "content": prompt + "\n\nSchéma:\n" + json.dumps(SCHEMA, ensure_ascii=False)},
            {"role": "user", "content": json.dumps({"source": src, "id": r["id"], "date": r.get("date"), "lien": r["url"], "matiere": material(src, r)}, ensure_ascii=False)}]}
        req = urllib.request.Request(url, json.dumps(body).encode(), {"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
        try:
            d = json.load(urllib.request.urlopen(req, timeout=300))
            a = json.loads(d["choices"][0]["message"]["content"])
            a.update(id=r["id"], source=src, lien=r["url"], analyse_ia=True, avertissement=WARN, statut="ok",
                     genere_le=datetime.datetime.now().astimezone().isoformat(), genere_par=f"modèle {model} (sans recherche web)")
            errs = list(Draft202012Validator(SCHEMA).iter_errors(a))
            if errs: print("rejeté (schéma):", r["id"], errs[0].message[:100]); continue
            out_path(src, r["id"]).write_text(json.dumps(a, ensure_ascii=False, indent=2), encoding="utf-8"); print("ok", src, r["id"])
        except Exception as e:
            print("échec", src, r["id"], str(e)[:120])

if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else "list"
    if c == "list":
        for s, r in pending(): print(s, r["id"])
    elif c == "validate": sys.exit(0 if validate() else 1)
    elif c == "analyze": analyze(int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else 5)
