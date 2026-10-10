# Collecte X (compte @davidlisnard, id 103918784)

La collecte X **n'est pas faite par un script du dépôt** : elle est réalisée par **Grok Bot** (routine), via les outils MCP X natifs (`get_users_posts`, `get_posts_by_ids`) — pas de scraping, pas d'API payante.

Principe :
1. Grok Bot appelle `get_users_posts` (id `103918784`, `exclude=retweets,replies`, `max_results` ≤ 25, champs `created_at,text,note_tweet,public_metrics,referenced_tweets,entities`), puis pagine avec `until_id` si moins de 10 publications originales sont obtenues.
2. Le texte complet des posts longs vient du champ `note_tweet` (le champ `text` est tronqué).
3. Les réponses brutes sont normalisées avec `collectors/x_ingest.py` et écrites dans `data/raw/x/<id>.json`.
4. Grok Bot commit et pousse ces JSON sur `main` ; le workflow GitHub Actions prend ensuite le relais (analyse des nouveautés + build).

Limites respectées : 30 requêtes/min et 1000/jour (une collecte = 3 à 5 appels). Les retweets et réponses ne sont pas traités (hors propos du compte).

Format d'un fichier : `id, reseau, compte, date, url, texte, citation{id,texte,auteur_id}, metriques, type, statut, collecte_par`.

Le workflow GitHub Actions **ne collecte pas X** : sans routine Grok Bot, la partie X n'est pas mise à jour.
