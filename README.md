# lisnard-veille

Site : https://ilsepassequelquechose-2027.vercel.app

Fil d'actualité public qui résume et analyse la **faisabilité des propositions** publiées par les comptes officiels de David Lisnard (X, TikTok, site Nouvelle Énergie).

> ⚠️ Analyses générées par IA, pouvant contenir des erreurs. Chaque carte renvoie vers la publication d'origine et propose « Signaler une erreur » (issue GitHub). Le projet juge la faisabilité des mesures, jamais la personne. Voir [docs/neutralite.md](docs/neutralite.md).

## Statut (10/10/2026) — prototype fonctionnel
- 10 posts X originaux, 5 vidéos TikTok, 8 articles du site collectés ; **6 publications analysées** (11 propositions) et 17 résumées seules. Voir [docs/methodologie.md](docs/methodologie.md).
- Site Next.js (export statique) dans `web/` ; `npm run build` passe.
- Workflow GitHub Actions `veille` : collecte TikTok + site, analyse des nouveautés (si clé), validation, build.

## Structure
- `data/raw/{x,tiktok,site}` publications brutes · `data/transcripts` transcriptions TikTok · `data/analyses` un JSON par publication
- `schema/analysis.schema.json` schéma des analyses · `analyzer/` prompt + `run.py` (list / validate / analyze)
- `collectors/` : `x_ingest.py` (normalisation des réponses MCP X), `collect_tiktok.py`, `collect_youtube.py` (chaîne officielle https://www.youtube.com/@david_lisnard, liée depuis unenouvelleenergie.fr), `collect_site.py` ; `scripts/collect_all.sh` lance les trois (idempotent, retente les cartes dégradées)
- `web/` : Next.js · `docs/` : méthodologie, neutralité, collecte X

## Utilisation locale
```bash
pip install -r collectors/requirements.txt
scripts/collect_all.sh 5          # TikTok + YouTube (@david_lisnard) + site, nouveautés seulement
python analyzer/run.py list        # publications sans analyse
python analyzer/run.py validate    # validation du schéma
cd web && npm install && npm run build   # sortie : web/out
```

## Collecte X
Faite par **Grok Bot** (routine, outils MCP X natifs) qui pousse les JSON dans `data/raw/x/` : voir [docs/collecte_x.md](docs/collecte_x.md). Le workflow GitHub **n'alimente pas** la partie X.

## Déploiement (Vercel)
Projet à importer avec **Root Directory = `web`** (config : `web/vercel.json`, export statique `out`). Cocher « Include source files outside of the Root Directory » ou laisser le script `web/scripts/sync-data.mjs` utiliser la copie `web/content/analyses` (commitée).

## Ce qui manque / à configurer (rien n'est inventé)
- **Secret `ANALYZER_API_KEY`** (clé API d'un fournisseur de modèle compatible « chat completions ») ; variables de dépôt `ANALYZER_MODEL` (obligatoire) et `ANALYZER_API_URL` (optionnel, défaut : endpoint OpenAI). Sans eux, l'étape d'analyse automatique est ignorée : les nouvelles publications restent « à analyser » (voir `analyzer/run.py list`).
- **Recherche web pour l'analyse automatique** : `run.py analyze` n'a pas d'outil de recherche ; les analyses sourcées du prototype ont été faites par Grok Bot. À brancher (outil de recherche ou relecture humaine) avant de publier des analyses automatiques.
- **Routine Grok Bot** pour X (planification de la collecte et du push).
- **Déploiement Vercel durable** : un déploiement anonyme temporaire (60 min) a été créé avec `vercel deploy --temporary` ; il faut un compte Vercel (`vercel login` ou « claim deployment ») puis importer le dépôt avec Root Directory = `web`.
- TikTok depuis les runners GitHub : yt-dlp peut être bloqué (mode dégradé prévu) ; cookies/proxy non configurés.
- Les cartes TikTok reposent sur les sous-titres automatiques de la plateforme.

## Note déploiement
Le 10/10/2026, `vercel deploy --temporary` depuis `web/` (preset Next.js) a produit un déploiement dont la route `/` renvoyait 404 (`/index` fonctionnait) ; le dossier statique `web/out` déployé tel quel fonctionne. À valider avec un vrai projet Vercel (Root Directory `web`) ; si le 404 persiste, utiliser le preset « Other » avec Output Directory `out`.
