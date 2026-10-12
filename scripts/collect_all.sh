#!/usr/bin/env bash
# Collecte idempotente TikTok + YouTube + site : ne traite que les nouveautés (et retente les cartes dégradées).
# Usage : scripts/collect_all.sh [N]   (N = nombre de publications récentes examinées par source, défaut 5)
# Chaque source échoue indépendamment (yt-dlp bloqué => message « mode dégradé », code de sortie 0).
# Ensuite : python analyzer/run.py list  -> publications à analyser.
set -u
cd "$(dirname "$0")/.."
N="${1:-5}"
PY="${PYTHON:-}"
if [ -z "$PY" ]; then
  if [ -x .venv/bin/python ]; then PY=.venv/bin/python; else PY=python3; fi
fi
"$PY" -c "import yt_dlp" 2>/dev/null || echo "yt-dlp absent : pip install -r collectors/requirements.txt (TikTok/YouTube en mode dégradé)"
"$PY" -m pip install -q -U yt-dlp >/dev/null 2>&1 || true   # TikTok/YouTube cassent souvent les vieilles versions
"$PY" collectors/collect_tiktok.py "$N"  || echo "tiktok: échec (ignoré)"
"$PY" collectors/collect_youtube.py "$N" || echo "youtube: échec (ignoré)"
"$PY" collectors/collect_site.py "$N"    || echo "site: échec (ignoré)"
echo "--- publications sans analyse :"
"$PY" analyzer/run.py list
