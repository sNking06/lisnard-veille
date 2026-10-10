# lisnard-veille

Fil d'actualité public qui résume et analyse la faisabilité des propositions publiées par les comptes officiels de David Lisnard (X, TikTok, site Nouvelle Énergie).

> Analyses générées par IA, pouvant contenir des erreurs. Chaque carte renvoie vers la publication d'origine. Le projet juge la faisabilité des mesures, jamais la personne.

## Statut
Démarrage : structure du dépôt uniquement, aucun code encore.

## Structure
- `data/` : publications brutes, transcriptions, analyses (un JSON par publication)
- `schema/` : schéma JSON des analyses
- `collectors/` : collecte X, TikTok, site (avec mode dégradé)
- `analyzer/` : prompt et script d'analyse
- `web/` : page Next.js déployée sur Vercel
- `docs/` : méthodologie et politique de neutralité
