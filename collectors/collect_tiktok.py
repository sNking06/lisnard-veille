#!/usr/bin/env python3
"""Collecte TikTok via yt-dlp : métadonnées + sous-titres, sinon audio + faster-whisper.
Mode dégradé : si yt-dlp échoue, on écrit une carte « degraded » (lien + intégration officielle, aucun résumé).
Aucune vidéo n'est conservée ni republiée : l'audio temporaire est supprimé."""
import json, re, sys, os, subprocess, tempfile, pathlib, datetime, glob, shutil
ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW, TR = ROOT / "data" / "raw" / "tiktok", ROOT / "data" / "transcripts"
HANDLE = "david.lisnard"
YT = [sys.executable, "-m", "yt_dlp", "--no-warnings", "-q"]

def run(args, timeout=180):
    return subprocess.run(YT + args, capture_output=True, text=True, timeout=timeout)

def vtt_to_text(path):
    t = open(path, encoding="utf-8").read()
    t = re.sub(r"WEBVTT|^\d.*-->.*$|^NOTE.*$", "", t, flags=re.M)
    return " ".join(t.split())

def whisper(audio):
    try:
        from faster_whisper import WhisperModel
        seg, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(audio, language="fr")
        txt = " ".join(s.text.strip() for s in seg)
        # hallucinations connues de Whisper sur du silence/de la musique
        return None if re.search(r"Amara\.org|Sous-titrage", txt) or len(txt) < 20 else txt
    except Exception as e:
        print("whisper indisponible:", e); return None

def one(vid, tmp):
    url = f"https://www.tiktok.com/@{HANDLE}/video/{vid}"
    rec = {"id": vid, "reseau": "tiktok", "compte": HANDLE, "url": url,
           "embed": {"type": "tiktok", "video_id": vid}, "statut": "degraded", "date": None}
    try:
        r = run(["--write-info-json", "--write-subs", "--all-subs", "-f", "bestaudio/best", "-o", f"{tmp}/{vid}.%(ext)s", url])
        info = json.load(open(f"{tmp}/{vid}.info.json"))
    except Exception as e:
        rec["erreur"] = str(e)[:200]; return rec
    rec.update(date=datetime.datetime.fromtimestamp(info["timestamp"], datetime.timezone.utc).isoformat(),
               description=info.get("description") or "", duree_s=info.get("duration"), vues=info.get("view_count"),
               statut="ok")
    subs = sorted(glob.glob(f"{tmp}/{vid}.fra*.vtt")) or sorted(glob.glob(f"{tmp}/{vid}.*.vtt"))
    text, src = None, None
    if subs:
        text, src = vtt_to_text(subs[0]), "sous-titres automatiques TikTok (non relus)"
    else:
        audio = (glob.glob(f"{tmp}/{vid}.m4a") + glob.glob(f"{tmp}/{vid}.mp3") + glob.glob(f"{tmp}/{vid}.mp4"))
        if audio:
            text, src = whisper(audio[0]), "transcription automatique faster-whisper (small, non relue)"
    if text:
        TR.mkdir(parents=True, exist_ok=True)
        (TR / f"tiktok-{vid}.txt").write_text(text, encoding="utf-8")
        rec["transcription"] = {"fichier": f"data/transcripts/tiktok-{vid}.txt", "source": src}
    return rec

def todo(p):
    """Nouveau, ou déjà vu mais en mode dégradé (nouvelle tentative)."""
    if not p.exists(): return True
    try: return json.load(open(p, encoding="utf-8")).get("statut") != "ok"
    except Exception: return True

def main(n=5, ids=None):
    RAW.mkdir(parents=True, exist_ok=True)
    if not ids:
        try:
            r = run(["--flat-playlist", "-J", "--playlist-end", str(n), f"https://www.tiktok.com/@{HANDLE}"], 120)
            ids = [e["id"] for e in json.loads(r.stdout)["entries"]]
        except Exception as e:
            print("tiktok: yt-dlp liste KO (mode dégradé, rien d'écrit):", str(e)[:150]); return
    for vid in ids:
        p = RAW / f"{vid}.json"
        if not todo(p): continue
        with tempfile.TemporaryDirectory() as tmp:
            rec = one(vid, tmp)
        if rec["statut"] != "ok" and p.exists(): print("tiktok: toujours dégradé", vid); continue
        p.write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8"); print("tiktok:", rec["statut"], vid)

if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "--ids": main(ids=a[1:])
    else: main(int(a[0]) if a else 5)
