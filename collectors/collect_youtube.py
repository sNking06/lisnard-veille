#!/usr/bin/env python3
"""Collecte YouTube (chaîne officielle @david_lisnard, liée depuis unenouvelleenergie.fr) via yt-dlp :
métadonnées + sous-titres français (manuels sinon automatiques). Pas de téléchargement de la vidéo ni de l'audio.
Idempotent : ne traite que les vidéos absentes de data/raw/youtube/ (ou en mode dégradé).
Mode dégradé : si yt-dlp échoue sur une vidéo, carte « degraded » (lien + lecteur officiel, aucun résumé)."""
import json, re, sys, tempfile, pathlib, datetime, glob, subprocess
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from collect_tiktok import todo
ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW, TR = ROOT / "data" / "raw" / "youtube", ROOT / "data" / "transcripts"
CHANNEL = "https://www.youtube.com/@david_lisnard"
YT = [sys.executable, "-m", "yt_dlp", "--no-warnings", "-q", "--extractor-args", "youtube:lang=fr"]

def vtt_to_text(path):
    """Sous-titres auto YouTube : balises de minutage inline + lignes répétées (défilement) -> texte dédoublonné."""
    out = []
    for line in open(path, encoding="utf-8"):
        line = re.sub(r"<[^>]+>", "", line).strip()
        if not line or "-->" in line or re.match(r"^(WEBVTT|Kind:|Language:|NOTE)", line): continue
        if out and (line == out[-1] or out[-1].endswith(line)): continue
        out.append(line)
    return " ".join(out)

def run(args, timeout=180):
    return subprocess.run(YT + args, capture_output=True, text=True, timeout=timeout)

def one(vid, tmp):
    url = f"https://www.youtube.com/watch?v={vid}"
    rec = {"id": vid, "reseau": "youtube", "compte": "@david_lisnard", "url": url,
           "embed": {"type": "youtube", "video_id": vid}, "statut": "degraded", "date": None}
    try:
        run(["--skip-download", "--write-info-json", "--write-subs", "--write-auto-subs", "--sub-langs", "fr.*,fr",
             "--sub-format", "vtt", "-o", f"{tmp}/{vid}.%(ext)s", url])
        info = json.load(open(f"{tmp}/{vid}.info.json", encoding="utf-8"))
    except Exception as e:
        rec["erreur"] = str(e)[:200]; return rec
    ts = info.get("timestamp") or (info.get("upload_date") and datetime.datetime.strptime(info["upload_date"], "%Y%m%d").replace(tzinfo=datetime.timezone.utc).timestamp())
    rec.update(date=datetime.datetime.fromtimestamp(ts, datetime.timezone.utc).isoformat() if ts else None,
               titre=info.get("title") or "", description=(info.get("description") or "")[:2000],
               duree_s=info.get("duration"), vues=info.get("view_count"), statut="ok")
    manual = set((info.get("subtitles") or {}).keys())
    subs = sorted(glob.glob(f"{tmp}/{vid}.fr*.vtt"))
    if subs:
        lang = subs[0].split(".")[-2]
        src = "sous-titres YouTube" + ("" if lang in manual else " automatiques (non relus)")
        TR.mkdir(parents=True, exist_ok=True)
        (TR / f"youtube-{vid}.txt").write_text(vtt_to_text(subs[0]), encoding="utf-8")
        rec["transcription"] = {"fichier": f"data/transcripts/youtube-{vid}.txt", "source": src}
    return rec

def main(n=5, ids=None):
    RAW.mkdir(parents=True, exist_ok=True)
    if not ids:
        try:
            r = run(["--flat-playlist", "-J", "--playlist-end", str(n), CHANNEL + "/videos"], 120)
            ids = [e["id"] for e in json.loads(r.stdout)["entries"]]
        except Exception as e:
            print("youtube: yt-dlp liste KO (mode dégradé, rien d'écrit):", str(e)[:150]); return
    for vid in ids:
        p = RAW / f"{vid}.json"
        if not todo(p): continue
        with tempfile.TemporaryDirectory() as tmp:
            rec = one(vid, tmp)
        if rec["statut"] != "ok" and p.exists(): print("youtube: toujours dégradé", vid); continue
        p.write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8"); print("youtube:", rec["statut"], vid)

if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "--ids": main(ids=a[1:])
    else: main(int(a[0]) if a else 5)
