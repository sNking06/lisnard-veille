# Méthodologie

## Collecte
- **X** (`@davidlisnard`, id 103918784) : par Grok Bot via les outils MCP X natifs, JSON poussés dans `data/raw/x/` (voir `collecte_x.md`). Retweets et réponses exclus.
- **TikTok** (`@david.lisnard`) : `collectors/collect_tiktok.py` (yt-dlp : métadonnées + sous-titres ; à défaut audio temporaire + faster-whisper). Les sous-titres TikTok sont automatiques et non relus. Si yt-dlp échoue : carte « degraded » (lien + lecteur officiel, sans résumé).
- **Site** (unenouvelleenergie.fr) : pas de flux RSS ; lecture de `posts-sitemap.xml` puis de chaque article (`collectors/collect_site.py`). Pas de médias tiers pour la collecte.

## Analyse
- Une publication contenant des propositions concrètes reçoit une analyse par proposition : coût estimé, cadre juridique/constitutionnel, compétence (État/UE/collectivités), précédents (France/étranger), verdict et conditions, sources.
- Les autres publications reçoivent un résumé seul.
- Verdicts : *faisable*, *faisable sous conditions*, *difficilement faisable*. Un verdict porte sur la **mise en œuvre de la mesure**, pas sur son opportunité politique.
- Tout chiffre ou précédent non sourcé est marqué « non établi ». Seules les sources réellement consultées sont citées.
- Prototype (10/10/2026) : analyses rédigées par Grok Bot avec recherches web (`analyzer/prototype_2026_10_10.py`). Plusieurs textes juridiques ont été lus via des extraits de moteur de recherche ; la fiabilité est indiquée par proposition (`fiabilite`, `doutes`).
- Automatisation : `analyzer/run.py analyze` appelle un modèle externe **sans recherche web** ; il doit donc répondre « non établi » pour ce qui n'est pas fourni. Une relecture humaine reste recommandée.

## Limites connues
Voir le README (section « Ce qui manque ») et les champs `doutes` / `notes` de chaque analyse.

- **Lecteurs intégrés** : les lecteurs officiels X (platform.twitter.com) et TikTok (tiktok.com/embed/v2) sont affichés sur chaque carte, chargés en différé au défilement, sans lecture automatique : l’utilisateur appuie sur lecture. Un lien vers la publication d’origine est toujours proposé.
