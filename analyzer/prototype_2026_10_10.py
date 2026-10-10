#!/usr/bin/env python3
"""Analyses du prototype (10/10/2026) rédigées par Grok Bot après recherches web.
Ce script ne fait que mettre en forme ces analyses (aucun appel réseau) -> data/analyses/*.json.
Tout chiffre non sourcé y est « non établi »."""
import json, glob, pathlib, datetime
ROOT = pathlib.Path(__file__).resolve().parent.parent
AN = ROOT / "data" / "analyses"; AN.mkdir(parents=True, exist_ok=True)
NOW = "2026-10-10"
WARN = "Analyse générée par IA, peut contenir des erreurs."
BY = "Grok Bot (prototype, recherches web du 10/10/2026)"
NE = "non établi"

def S(t, u): return {"titre": t, "url": u, "consulte_le": NOW}

CONST = S("Constitution du 4 octobre 1958 (texte en vigueur) – Conseil constitutionnel", "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur")

def raw(src, rid):
    return json.load(open(next(iter(sorted(glob.glob(str(ROOT / "data" / "raw" / src / (rid + ("*.json" if src == "site" else ".json")))))))))

def card(src, rid, resume, base, props=None, sources=None, citations=None, notes=None, titre=None, date=None):
    r = raw(src, rid)
    a = {"id": r["id"], "date": date or r["date"], "source": src, "lien": r["url"], "statut": "ok",
         "resume": resume, "base_du_resume": base, "analyse_realisee": bool(props),
         "propositions": props or [], "sources": sources or [], "analyse_ia": True, "avertissement": WARN,
         "genere_le": NOW, "genere_par": BY}
    if titre: a["titre"] = titre
    elif r.get("titre"): a["titre"] = r["titre"].split("|")[0].strip()
    if src == "x": a["integration"] = {"type": "x", "id": r["id"]}
    elif src == "tiktok": a["integration"] = {"type": "tiktok", "id": r["id"]}
    else: a["integration"] = {"type": "none", "id": r["id"]}
    if citations: a["citations"] = citations
    if notes: a["notes"] = notes
    (AN / f"{src}-{r['id']}.json").write_text(json.dumps(a, ensure_ascii=False, indent=2), encoding="utf-8")

TXT = "texte complet de la publication (collecté via MCP X natif)"
# ------------------------------------------------------------------ X : résumé seul
card("x", "2108470030484582726", "Message de félicitations aux policiers municipaux de Cannes qui, selon l'auteur, ont permis à une majorité de lycéens d'entrer dans deux lycées rouverts depuis deux jours, en formant un « couloir protecteur » au milieu de manifestants dont certains voulaient obstruer l'entrée.", TXT, notes="Compte rendu d'un fait local ; les faits décrits n'ont pas été vérifiés de manière indépendante.")
card("x", "2108465338555810257", "Réaction à l'annonce du ministre de l'Éducation sur « 3000 collaborateurs rémunérés sans aucune tâche à effectuer ». L'auteur qualifie la situation de confirmation de l'« état de délabrement » de l'appareil public central, évoque un « problème de logiciel et de RH » invoqué par le gouvernement, et affirme que ses « constats » et « solutions » pour « remettre l'Etat en ordre » en sortent confortés, sans détailler de mesure.", TXT, notes="Aucune mesure précise n'est énoncée dans la publication. L'annonce ministérielle citée n'a pas été vérifiée.")
card("x", "2108296749353988134", "Message de félicitations à Sophie Adenot (astronaute française) à l'issue de ses sorties extravéhiculaires, relayant une publication de @XploraSpace.", TXT)
card("x", "2107918332716315094", "Message de promotion du mouvement Nouvelle Énergie (« le mouvement de ceux qui veulent s'en sortir ») avec invitation à le rejoindre via un lien.", TXT)
card("x", "2107726438577090744", "Message de commémoration du 7 octobre 2023 (1163 victimes mentionnées). L'auteur dénonce un antisémitisme « décomplexé » en France et indique que la lutte contre « la barbarie islamiste » est un des combats prioritaires de Nouvelle Énergie, sans mesure précise.", TXT, notes="Aucune mesure concrète : orientation générale uniquement.")
card("x", "2107695062054256964", "Alerte de la ville de Cannes (risque de crue éclair) : passage pluvieux dès 7h, fermeture préventive de certains passages sous la voie ferrée vers le boulevard du Midi, équipes de la mairie et de l'agglomération au poste de commandement.", TXT, notes="Information opérationnelle municipale ; pas de proposition.")
card("x", "2107386164105613623", "Publication réduite au hashtag #OnLeFera accompagné d'un média (non analysé). Aucun contenu textuel exploitable.", "texte (hashtag seul) ; le média joint n'a pas été analysé", notes="Le contenu du média joint n'a pas été collecté.")
card("x", "2107223634251043014", "Message bref : l'auteur indique qu'il votera pour lui-même (« je vais voter pour moi ») et invite à ne plus essayer de le convaincre, avec le hashtag #ilsepassequelquechose.", TXT)
card("x", "2106981085091631555", "Commentaire ironique sur la position de l'Iran, qui avait dénoncé une « violence disproportionnée » contre des manifestants lors du blocage de lycées en France ; l'auteur oppose le traitement des manifestants en Iran. Lien vers un article joint.", TXT, notes="Commentaire sans mesure précise.")

# ------------------------------------------------------------------ X : MGCS
card("x", "2108303752990220619",
 "Après l'échec du SCAF, l'auteur voit dans le MGCS (char du futur franco-allemand, lancé en 2017-2018) une seconde impasse industrielle et stratégique. Il critique une coopération érigée en objectif politique avant d'avoir vérifié la convergence des intérêts militaires, la maîtrise des technologies et les responsabilités industrielles. Il relaie l'idée, issue d'un séminaire franco-allemand du 7 octobre, de partir des besoins opérationnels et des intérêts industriels avant toute traduction politique. Il demande que la France prépare « sans délai » le remplacement du Leclerc par un système complet (blindés, drones, robotique, IA, maîtrise des données), exige l'efficacité de chaque euro de défense et lie redressement des finances publiques et réindustrialisation à la souveraineté.",
 TXT + " (≈4 000 caractères)",
 [
  {"texte": "Préparer « sans délai » le renouvellement de la capacité de combat terrestre française, conçu comme un système complet (blindés, drones, robotique, IA, maîtrise des données) et non un simple remplacement du Leclerc.",
   "cout": "Non établi : aucun chiffrage du programme n'est fourni par la publication ni trouvé dans les sources consultées. Repère de contexte : la loi du 18 août 2026 actualisant la LPM 2024-2030 porterait les crédits de la mission Défense à 435,7 Md€ sur la période (+36 Md€ sur 2026-2030), d'après un extrait de recherche du JO ; ce montant n'est pas ventilé par programme.",
   "cadre_juridique": "Loi de programmation militaire (l'article 34 de la Constitution prévoit des lois de programmation et fixe les principes de l'organisation générale de la défense nationale) ; loi de finances annuelle pour les crédits. Si le programme est conduit avec un partenaire, un accord international (art. 52-55 de la Constitution) est nécessaire. Droit de l'UE (règles d'achats de défense, financements européens) : non établi.",
   "competence": "État (Gouvernement, ministère des Armées/DGA, Parlement pour la LPM). Ni les collectivités ni l'UE n'ont de compétence directe sur le choix d'un programme national d'armement.",
   "precedents": "France : le plan intermédiaire « Capint » (capacité intermédiaire, de transition) présenté par KNDS en juin 2026 est décrit par BFM Business comme un « plan B » de Paris, apte à intégrer de façon incrémentale des fonctions du MGCS. Le MGCS lui-même (lancé en 2018) est présenté par franceinfo et BFM comme en difficulté ; l'état-major l'a décrit le 8 oct. comme quitté par l'Allemagne, puis les ministres français et allemand ont affirmé le 9 oct. qu'il est « maintenu » et simplement décalé (mise en service vers la fin des années 2040 selon le communiqué du CEMA cité par BFM). Étranger : projet allemand Leopard 3 évoqué par l'auteur ; non vérifié par une source consultée. Autres précédents : non établi.",
   "verdict": "faisable_sous_conditions",
   "conditions": ["Financement garanti en loi de programmation militaire et en lois de finances, dans un contexte de finances publiques contraintes (non chiffré ici).",
                  "Capacité industrielle nationale (maîtrise des technologies, rôle des industriels) à confirmer : la publication la présente comme acquise, ce que les sources consultées ne permettent pas de vérifier.",
                  "Clarification du statut du MGCS : les autorités françaises et allemandes affirment le 9 oct. 2026 qu'il se poursuit ; un programme national parallèle supposerait d'arbitrer entre les deux voies.",
                  "Calendrier long : le MGCS visait une mise en service vers 2040, désormais vers la fin des années 2040."],
   "fiabilite": "moyenne", "doutes": "Situation évolutive (annonces contradictoires des 8 et 9 oct. 2026). Aucun chiffrage de programme trouvé. L'article du Monde n'a pas pu être consulté (page non chargée)."},
  {"texte": "Fonder la coopération d'armement sur les besoins opérationnels et les intérêts industriels, puis lui donner une traduction politique « lorsque cela est justifié » (le pouvoir politique fixe les ambitions et garantit les moyens ; les armées définissent les besoins ; les industriels construisent).",
   "cout": NE,
   "cadre_juridique": "Mesure de méthode ne requérant pas de texte nouveau ; les coopérations internationales restent régies par des accords soumis, selon les cas, à l'article 53 de la Constitution.",
   "competence": "État ; partenaires étrangers pour toute coopération bilatérale.",
   "precedents": "Le communiqué du chef d'état-major cité par BFM Business évoque un MGCS « recentré » sur la connectivité, le combat collaboratif, l'automatisation et la robotisation ; la publication attribue à un séminaire du 7 octobre une approche proche (non confirmé par une source consultée). Autres précédents : non établi.",
   "verdict": "faisable_sous_conditions",
   "conditions": ["Accord du ou des partenaires sur la méthode (non établi à ce stade).", "Capacité à arbitrer entre intérêts industriels nationaux divergents, difficulté déjà relevée par BFM Business (arrivée de Rheinmetall en 2019, tensions de répartition)."],
   "fiabilite": "moyenne", "doutes": "Proposition de nature méthodologique ; l'évaluation de faisabilité reste qualitative."}
 ],
 [S("« Les Allemands ont décidé de quitter le projet » : l'imbroglio du char du futur franco-allemand (BFM Business, 9 oct. 2026)", "https://www.bfmtv.com/economie/entreprises/defense/les-allemands-ont-decide-de-quitter-le-projet-l-imbroglio-du-char-du-futur-franco-allemand-enterre-puis-ressuscite-en-quelques-heures_AV-202610090383.html"),
  S("La France et l'Allemagne assurent que le projet commun MGCS du futur char est bien maintenu (franceinfo, 9 oct. 2026)", "https://www.franceinfo.fr/societe/armee-securite-defense/paris-et-berlin-assurent-que-le-projet-mgcs-du-futur-char-franco-allemand-est-bien-maintenu_8230096.html"),
  S("Loi n° 2026-791 actualisant la programmation militaire (JO du 18 août 2026, extrait via FHF)", "https://www.fhf.fr/sites/default/files/2026-08/Loi%20n%C2%B02026-791%20-%20programmation%20militaire_3.pdf"),
  CONST],
 citations=["Après le SCAF, le MGCS.", "La coopération doit renforcer notre puissance, jamais conditionner notre liberté de décision."],
 notes="Les sources de contexte sur le MGCS sont des médias (usage limité à la vérification des faits d'actualité ; la collecte des publications, elle, reste limitée aux comptes officiels). Le montant LPM provient d'un extrait de recherche, non d'une lecture intégrale du Journal officiel.")

# ------------------------------------------------------------------ TikTok
card("tiktok", "7694943551314070816", "Vidéo d'une minute « depuis la mairie » un samedi : l'auteur décrit une journée de travail municipal (courriels, parapheurs, rendez-vous, célébrations, mariages). D'après la légende, il se dit préoccupé par le budget communal et intercommunal face aux « intentions gouvernementales » qu'il décrit comme un prélèvement sur les marges financières créées par la commune depuis 12 ans, annonce y revenir plus tard et souhaite un bon week-end.", "légende de la vidéo (aucune transcription audio exploitable : l'essai faster-whisper n'a produit que du bruit, écarté)", notes="Les « intentions gouvernementales » ne sont pas précisées ; aucune mesure chiffrée ni proposition.")
card("tiktok", "7694930405778099488", "Extrait court : l'auteur cite l'action du général de Gaulle en 1958 (ordonnances) qui aurait fait passer l'État d'un déficit comparable à l'actuel à un excédent en un an, précise qu'il n'y a pas de « de Gaulle » aujourd'hui, et dit vouloir porter la « France réelle » (jeunes en apprentissage, personnes qui investissent et prennent des risques) via une « révolution du bon sens » et de la liberté.", "sous-titres automatiques TikTok (non relus) — transcription approximative", notes="Affirmation historique sur 1958 non vérifiée dans le cadre de ce prototype. Pas de mesure concrète.")
card("tiktok", "7694653654963342625", "Extrait : l'auteur interpelle Jean-Luc Mélenchon pour qu'il cesse d'utiliser les lycéens comme « chair à canon électorale », affirme que l'extrême gauche a aujourd'hui un « rôle criminel » dans les manifestations et demande aux syndicats lycéens de « faire le ménage » face à la récupération partisane.", "sous-titres automatiques TikTok (non relus) — transcription approximative", citations=["cesser de vouloir utiliser nos enfants comme de la chair à canon électorale"], notes="Propos polémique sur des acteurs politiques ; aucune mesure concrète n'est proposée. Les faits allégués ne sont pas vérifiés.")
card("tiktok", "7694590906946620704", "Extrait sur la grève dans les collèges et lycées : l'auteur la juge incongrue à l'heure de l'IA et de la robotique, reconnaît des « trous » dans les emplois du temps depuis la réforme du bac (« ça se répare ») et critique l'idée d'emplois du temps raccourcis, avec moins d'heures de cours et des options ajoutées.", "sous-titres automatiques TikTok (non relus) — transcription approximative", notes="Position générale sur l'organisation scolaire ; pas de mesure précise suffisamment définie pour être analysée.")
card("tiktok", "7694691256118594849",
 "Extrait sur l'égalitarisme à l'école : l'auteur estime que l'on ne réduit pas les inégalités en interdisant à tous de s'aider à la maison. Il affirme que les travaux à la maison sont interdits à l'école élémentaire depuis plusieurs décennies et soutient que tous les enfants devraient pouvoir accéder au manuel scolaire y compris à domicile, avec un accompagnement scolaire et un périscolaire réorienté dans cette direction, comme à Cannes. Il distingue éducation (familles) et instruction (école).",
 "sous-titres automatiques TikTok (non relus) — transcription approximative",
 [{"texte": "Garantir à tous les enfants l'accès au manuel scolaire, y compris à la maison, et développer l'accompagnement scolaire en réorientant le périscolaire dans cette direction.",
   "cout": "Non établi : aucun chiffrage dans la vidéo ni dans les sources consultées. Le coût dépend du nombre d'heures encadrées et du taux d'encadrement.",
   "cadre_juridique": "Le périscolaire relève de l'organisation communale. À l'école primaire, selon Service-Public (vérifié le 25/03/2025), l'enseignant ne peut pas donner de travail écrit à faire hors de la classe (référence : loi n° 2013-595 du 8 juillet 2013) ; les devoirs oraux (lecture, recherche, leçons à apprendre) restent possibles : la mesure proposée (accompagnement hors temps de classe) ne se heurte donc pas à cette règle, mais l'affirmation d'une interdiction générale des « travaux à la maison » est à nuancer. Pour l'accès aux manuels, aucun texte consulté.",
   "competence": "Communes (périscolaire, écoles élémentaires) ; État (programmes, règles sur les devoirs) ; au collège, dispositif national existant. L'article 72-2 de la Constitution prévoit que toute extension de compétence augmentant les dépenses des collectivités s'accompagne de ressources déterminées par la loi, ce qui concerne un éventuel déploiement imposé au niveau national.",
   "precedents": "France : « Devoirs faits », temps d'étude accompagnée au collège hors heures de classe, présenté sur education.gouv.fr (obligatoire pour les élèves de 6e depuis la rentrée 2023 d'après un extrait de recherche). Ville de Cannes : pratique évoquée par l'auteur, non vérifiée. Étranger : non établi.",
   "verdict": "faisable",
   "conditions": ["Décision et financement communaux (la mesure est à la main de chaque commune) ; un déploiement généralisé exigerait des moyens pour les communes et du personnel d'encadrement (non chiffré).", "Qualité et formation des intervenants à définir (non établi)."],
   "fiabilite": "moyenne", "doutes": "Transcription automatique approximative. La mesure est formulée en termes généraux ; l'analyse porte sur le périscolaire communal seulement. Le « manuel à la maison » n'est pas détaillé (papier ou numérique)."}],
 [S("Peut-on donner à un élève du primaire des devoirs à faire à la maison ? (Service-Public)", "https://www.service-public.gouv.fr/particuliers/vosdroits/F21842"),
  S("Devoirs faits : un temps d'étude accompagnée pour réaliser les devoirs (Ministère de l'Éducation nationale)", "https://www.education.gouv.fr/devoirs-faits-un-temps-d-etude-accompagnee-pour-realiser-les-devoirs-7337"),
  CONST],
 notes="La vidéo est analysée à partir des sous-titres automatiques TikTok, non relus.")

# ------------------------------------------------------------------ Site : élevage (résumé seul)
card("site", "david-lisnard-au-sommet-de-lelevage", "Compte rendu de la visite au Sommet de l'élevage : rencontres avec des éleveurs, les Jeunes Agriculteurs, la FNSEA, la Coordination rurale et Limagrain. Le texte cite les difficultés évoquées (normes, charges, concurrence internationale, complexité administrative, transmission) et résume les priorités du mouvement (simplifier les normes, réduire la bureaucratie, compétitivité, concurrence équitable, souveraineté alimentaire), avec des renvois vers le programme et un carnet agricole.", "texte de l'article du site Nouvelle Énergie", notes="Les priorités sont énoncées en termes généraux ; les mesures détaillées figurent dans le carnet de propositions renvoyé, non analysé ici.")

# ------------------------------------------------------------------ Site : CNews
card("site", "david-lisnard-sur-cnews",
 "Résumé d'un passage sur CNews : sur les mobilisations lycéennes, l'auteur distingue revendications et violences, appelle à plus de fermeté contre les « voyous » (23 interpellations par la police municipale de Cannes, chiffre cité) et dénonce une instrumentalisation politique. Sur l'école, il détaille un tronc commun exigeant (maths, français, langues, philosophie, sport, arts), la suppression de la carte scolaire, la liberté de choix des familles, l'autonomie des établissements, la liberté de recrutement des chefs d'établissement et une meilleure rémunération des enseignants. Il évoque aussi l'antisémitisme à Sciences Po, une compétition à droite avant le premier tour de 2027, la retraite par capitalisation et revendique plus de 40 000 adhésions payantes.",
 "texte de l'article du site Nouvelle Énergie (compte rendu, pas la transcription de l'interview)",
 [
  {"texte": "Supprimer la carte scolaire et laisser les familles choisir l'établissement de leur enfant.",
   "cout": NE,
   "cadre_juridique": "La sectorisation est fixée par le conseil municipal pour les écoles (art. L. 212-7 du code de l'éducation), par le conseil départemental pour les collèges (art. L. 213-1), la carte des lycées restant établie par les services de l'État ; les dérogations relèvent du maire (écoles, agissant comme agent de l'État) ou du DASEN (collèges), selon les sources consultées. Une suppression suppose une loi (art. 34 de la Constitution : l'enseignement relève des principes fondamentaux fixés par la loi), la libre administration des collectivités (art. 72) et la compensation des charges (art. 72-2) étant à respecter.",
   "competence": "Partagée : communes (écoles), départements (collèges), État/académies (affectations, lycées), régions (bâtiments des lycées). Pas de compétence de l'UE.",
   "precedents": "France : l'assouplissement de la carte scolaire à partir de 2007. Selon la revue Éducation & formations (ministère, 2018), la réforme a eu peu d'impact national sur les effectifs et la composition sociale, mais des collèges d'éducation prioritaire ont perdu des élèves et la part de familles très favorisées a augmenté dans le privé ; certaines études concluent à un renforcement de la ségrégation. Étranger : la revue consacre un article aux comparaisons internationales (équilibre entre liberté parentale et mixité) ; contenu détaillé non consulté, donc : non établi.",
   "verdict": "faisable_sous_conditions",
   "conditions": ["Règle d'affectation en cas de demandes supérieures aux places (critères à définir : tirage au sort, distance, résultats...) – non précisée dans la publication.",
                  "Dispositif contre les effets documentés de l'assouplissement de 2007 sur la mixité sociale (éducation prioritaire).",
                  "Capacités d'accueil et transport scolaire (collectivités) ; financement non établi.",
                  "Coordination État/départements/communes pour la planification de l'offre."],
   "fiabilite": "moyenne", "doutes": "Les sources portent sur l'assouplissement de 2007, non sur une suppression complète : l'extrapolation est incertaine."},
  {"texte": "Donner aux chefs d'établissement la liberté de recruter (ainsi que davantage d'autonomie aux établissements) et mieux rémunérer les enseignants.",
   "cout": "Non établi : la publication ne chiffre ni la hausse de rémunération ni le périmètre ; aucune source budgétaire consultée.",
   "cadre_juridique": "Les garanties fondamentales des fonctionnaires civils relèvent de la loi (art. 34 de la Constitution). Le recrutement et la rémunération des enseignants de l'État relèvent aujourd'hui de règles nationales : leur modification suppose une loi et des décrets. Détail du statut et jurisprudence : non établi (non consultés).",
   "competence": "État (statut, recrutement, rémunérations des personnels enseignants) ; les collectivités gèrent les bâtiments et certains personnels techniques.",
   "precedents": "Non établi (aucune source consultée sur les modèles d'autonomie de recrutement en France ou à l'étranger).",
   "verdict": "faisable_sous_conditions",
   "conditions": ["Réforme législative et statutaire (statut des enseignants) ; négociation avec les organisations représentatives.", "Cadrage de l'autonomie (périmètre : titulaires, contractuels, postes spécifiques) – non précisé.", "Financement des revalorisations, non établi."],
   "fiabilite": "faible", "doutes": "Analyse limitée au cadre constitutionnel général faute de sources spécifiques ; la publication est un compte rendu du site, non le programme détaillé."}
 ],
 [S("Le rôle des collectivités territoriales dans le service public de l'éducation (Ministère de l'Éducation nationale)", "https://www.education.gouv.fr/le-role-des-collectivites-territoriales-dans-le-service-public-de-l-education-et-le-partenariat-avec-8138"),
  S("Dérogations à la sectorisation scolaire (Sénat, question écrite 2016)", "https://www.senat.fr/questions/base/2016/qSEQ160220303.html"),
  S("Les effets de l'assouplissement de la carte scolaire (Éducation & formations, ministère de l'Éducation nationale)", "https://www.education.gouv.fr/les-effets-de-l-assouplissement-de-la-carte-scolaire-11579"),
  CONST],
 citations=["Je veux être le mouvement de ceux qui veulent s'en sortir."],
 notes="La retraite par capitalisation, mentionnée dans l'article, est analysée dans la carte consacrée aux Assises de l'AFER. La compétition à droite avant le premier tour relève de l'organisation des partis et n'a pas été analysée. Le tronc commun exigeant n'est pas assez détaillé pour être évalué.")

# ------------------------------------------------------------------ Site : ordre
card("site", "il-faut-vite-remettre-de-lordre",
 "Compte rendu d'une intervention sur les violences autour des mobilisations lycéennes. L'auteur y voit une mécanique politique visant à transformer des revendications en manifestations puis en « insurrection », appelle à une intervention précoce des forces de l'ordre pour extraire les individus violents, réaffirme sa position en faveur de la dissolution du Syndicat de la magistrature (tout en défendant le principe de la syndicalisation des magistrats), insiste sur un « combat culturel » par l'éducation et propose de développer des établissements disciplinaires pour extraire des classes les élèves les plus violents.",
 "texte de l'article du site Nouvelle Énergie",
 [
  {"texte": "Dissoudre le Syndicat de la magistrature (en maintenant le droit à la syndicalisation des magistrats mais pas de « syndicats politiques »).",
   "cout": "Aucun coût budgétaire direct identifié ; chiffrage : non établi.",
   "cadre_juridique": "L'article 10-1 de l'ordonnance n° 58-1270 du 22 déc. 1958 (loi organique) garantit aux magistrats le droit de créer des syndicats, d'y adhérer et d'y exercer des mandats ; le Conseil constitutionnel a examiné cet article en 2016 (déc. 2016-732 DC) et 2023 (déc. 2023-856 DC). L'article 10 interdit « toute délibération politique » au corps judiciaire et toute action concertée entravant le fonctionnement des juridictions. Selon le code du travail, un syndicat professionnel ne peut avoir un objet illicite et sa dissolution est prononcée judiciairement, à la diligence du procureur ou d'une personne justifiant d'un intérêt direct et personnel (art. L. 2131-1, L. 2131-2, L. 2136-1) ; la Cour d'appel de Paris (13 janv. 2026, RG 22/11857) a jugé irrecevable une action de parlementaires, citoyens/élus sans intérêt direct, visant la dissolution d'un syndicat professionnel. Une dissolution par décision politique ou administrative n'apparaît pas dans les textes consultés ; elle supposerait une loi (voire organique, art. 64 de la Constitution) soumise au contrôle du Conseil constitutionnel et à la liberté syndicale (alinéa 6 du Préambule de 1946, art. 11 CEDH, évoqués dans l'arrêt de la CA de Paris).",
   "competence": "Autorité judiciaire (tribunal judiciaire, procureur) pour une dissolution sur le fondement du code du travail ; Parlement (loi organique) pour modifier le régime syndical des magistrats ; pas de compétence des collectivités. Droit de l'UE : non établi.",
   "precedents": "France : aucune dissolution d'un syndicat de magistrats trouvée dans les sources consultées (non établi) ; la décision de la Cour d'appel de Paris de janvier 2026 montre la voie judiciaire et ses conditions de recevabilité. Étranger : non établi.",
   "verdict": "difficilement_faisable",
   "conditions": ["Preuve judiciaire d'un objet illicite devant le tribunal judiciaire, sur demande du procureur ou d'une personne ayant un intérêt direct et personnel ; ou modification de la loi organique, avec validation du Conseil constitutionnel.",
                  "Compatibilité avec la liberté syndicale (Préambule de 1946, art. 11 CEDH) : risque juridique élevé pour toute dissolution fondée sur l'orientation d'opinion.",
                  "Une alternative moins lourde (encadrer par la loi organique les prises de position publiques, art. 10 de l'ordonnance) relèverait d'une autre mesure que celle proposée."],
   "fiabilite": "moyenne", "doutes": "Textes lus via extraits de recherche pour l'ordonnance de 1958, les décisions du CC et l'arrêt de la CA de Paris ; pas d'analyse de la jurisprudence de la CEDH sur le droit syndical des magistrats. Le verdict porte sur la procédure, non sur le bien-fondé de la mesure."},
  {"texte": "Développer des établissements disciplinaires pour extraire des classes les élèves les plus violents, afin de les remettre sur le bon chemin et de protéger les autres.",
   "cout": "Non établi : aucun chiffrage dans la publication ; les rapports consultés n'en donnent pas dans les extraits lus.",
   "cadre_juridique": "Dispositifs relais (classes, ateliers, internats tremplins) accueillant temporairement des collégiens en rejet de l'école, décrits par éduscol ; les élèves restent le plus souvent inscrits dans leur établissement d'origine, avec convention. Les établissements de réinsertion scolaire (ERS) ont été créés par la circulaire n° 2010-090 du 29 juin 2010 (IGEN/IGAENR 2012). L'article 34 de la Constitution renvoie à la loi les principes fondamentaux de l'enseignement ; l'instruction obligatoire jusqu'à 16 ans est rappelée par la mission d'inspection comme une obligation du système public.",
   "competence": "État (Éducation nationale) ; départements pour les collèges (construction, fonctionnement) – la mission d'inspection relève que la mise en place des ERS a parfois été faite sans le concours des collectivités.",
   "precedents": "France : ERS créés à la rentrée 2010 (16 établissements dans 13 académies) ; le rapport d'inspection de juin 2012 les juge issus d'une mise en place « précipitée » et aux résultats « souvent décevants », sans conclure à un échec complet, et propose une formule de « dispositif de réinsertion scolaire » ; dispositifs relais existant depuis 1998. Étranger : le rapport comportait une étude comparative ; contenu non consulté, donc non établi.",
   "verdict": "faisable_sous_conditions",
   "conditions": ["Définition des critères d'admission et des garanties de scolarisation (obligation jusqu'à 16 ans).", "Association des collectivités (départements) et projet pédagogique global, recommandés par la mission d'inspection de 2012.", "Évaluation des résultats : bilan antérieur mitigé.", "Financement et personnels spécialisés : non établis."],
   "fiabilite": "moyenne", "doutes": "Rapport 2012 lu via extraits ; données chiffrées de sortie des élèves non reprises faute de lecture intégrale."}
 ],
 [S("Ordonnance n° 58-1270 du 22 décembre 1958 portant loi organique relative au statut de la magistrature (Légifrance, extrait)", "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000339259"),
  S("Décision n° 2016-732 DC du 28 juillet 2016 (Conseil constitutionnel)", "https://www.conseil-constitutionnel.fr/decision/2016/2016732DC.htm"),
  S("Ordonnance 58-1270 consolidée, art. 10 (Conseil constitutionnel, déc. 2001-445 DC)", "https://www.conseil-constitutionnel.fr/sites/default/files/as/root/bank_mm/decisions/2001445dc/consolidation_58_1270.pdf"),
  S("Cour d'appel de Paris, 13 janvier 2026, n° 22/11857 (dissolution d'un syndicat professionnel)", "https://librejustice.fr/decision/fr/P5v1_zox5V3g"),
  S("Code du travail, art. L2131-1 à L2131-6 (Légifrance)", "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006177912/"),
  S("Les établissements de rétablissement scolaire – bilan et perspectives (rapport 2012, vie-publique.fr)", "https://www.vie-publique.fr/rapport/36282-les-etablissements-de-retablissement-scolaire-bilan-et-perspectives"),
  S("Les dispositifs relais (éduscol)", "https://eduscol.education.gouv.fr/5298/les-dispositifs-relais"),
  CONST],
 citations=["On ne va pas vous laisser instrumentaliser nos enfants.", "Oui au droit à la syndicalisation dans la magistrature, mais pas à des syndicats politiques."],
 notes="Les passages sur les forces de l'ordre (intervention précoce) décrivent une doctrine d'intervention, non une mesure juridique précise, et n'ont pas été analysés.")

# ------------------------------------------------------------------ Site : AFER
card("site", "david-lisnard-aux-assises-de-lafer",
 "Compte rendu du « grand oral » aux Assises de l'AFER (Paris, 29 sept. 2026). L'auteur plaide pour que chacun reste « propriétaire de sa vie », veut une baisse massive de la dépense publique afin de baisser cotisations et fiscalité, défend une capitalisation obligatoire progressive en complément de la répartition (« capitalisme populaire »), refuse d'augmenter les prélèvements sur l'épargne, propose de libérer davantage le PEA et plus de neutralité fiscale entre actions et créances sur l'État, et s'engage à ne pas toucher à la fiscalité de l'assurance-vie.",
 "texte de l'article du site Nouvelle Énergie",
 [
  {"texte": "Mettre en place progressivement une retraite par capitalisation obligatoire, en maintenant la répartition comme filet de solidarité intergénérationnelle.",
   "cout": "Non établi pour la France (aucun chiffrage dans la publication). Le Conseil d'orientation des retraites (séance du 18 déc. 2025) identifie la « double contribution » des actifs comme obstacle majeur de la transition (financer les pensions actuelles et son propre capital) et décrit trois voies : double cotisation (risque récessif), mise à contribution des retraités actuels (sous-indexation, risque récessif) ou prise en charge par l'État (charge supplémentaire pour les finances publiques).",
   "cadre_juridique": "Création d'un régime obligatoire : loi (art. 34 de la Constitution : droit du travail, droit syndical et sécurité sociale ; lois de financement de la sécurité sociale). Exigences constitutionnelles précises sur l'obligation d'affiliation à un régime privé : non établi (jurisprudence non consultée). Existent déjà en France des régimes obligatoires fonctionnant par capitalisation collective : régime additionnel de la fonction publique (RAFP) et régime complémentaire des pharmaciens (CAVP), selon le COR.",
   "competence": "État (Parlement, LFSS) ; partenaires sociaux pour les régimes complémentaires existants ; pas de compétence des collectivités. Droit de l'UE : non établi.",
   "precedents": "Étranger : le COR (note du 12 nov. 2025) recense des expériences d'introduction de la capitalisation (Chili 1981, Mexique 1992/1997/2007, entre autres pays) avec des modalités variables (obligatoire pour nouveaux entrants, option, cotisations réorientées) ; chiffres par pays non repris ici. France : étude Fondapol sur un système mixte par points (hypothèses de rendement réel 3 à 5 %) ; la même étude relève des critiques sur l'endettement et la double cotisation et évoque un fonds d'amorçage pour atténuer la transition.",
   "verdict": "faisable_sous_conditions",
   "conditions": ["Financement de la transition : double cotisation, sous-indexation des pensions ou prise en charge par l'État (arbitrage non précisé dans la publication).",
                  "Redressement préalable ou simultané des finances publiques : relevé par les analyses consultées.",
                  "Montée en charge longue (plusieurs décennies) : les bénéfices ne se matérialisent qu'à long terme.",
                  "Vote d'une loi et contrôle constitutionnel de l'obligation d'affiliation (non analysé ici)."],
   "fiabilite": "moyenne", "doutes": "Documents du COR lus via extraits de recherche ; aucun chiffrage spécifique à la proposition (taux de cotisation, transition) trouvé."},
  {"texte": "Ne pas modifier la fiscalité de l'assurance-vie (engagement pris à la question de l'AFER : « Oui »).",
   "cout": "Aucun coût de mise en œuvre ; le manque à gagner par rapport à une hausse de fiscalité éventuelle : non établi.",
   "cadre_juridique": "La fiscalité relève de la loi (art. 34 : assiette, taux et recouvrement des impositions) et des lois de finances (art. 47). Une promesse présidentielle ne lie pas juridiquement le Parlement.",
   "competence": "État (Parlement et Gouvernement).",
   "precedents": "Non établi.",
   "verdict": "faisable",
   "conditions": ["Engagement politique : tout changement futur reste possible par une loi de finances votée par le Parlement ; la tenue de l'engagement dépend de la majorité parlementaire."],
   "fiabilite": "haute", "doutes": "Il s'agit d'un engagement de ne pas agir, sans effet budgétaire chiffré dans les sources."}
 ],
 [S("COR – Note de présentation générale, séance plénière du 18 décembre 2025", "https://www.cor-retraites.fr/sites/default/files/2025-12/Doc_01_Note%20de%20pr%C3%A9sentation%20g%C3%A9n%C3%A9rale.pdf"),
  S("COR – Document n° 6 : de la répartition à la capitalisation (18 déc. 2025)", "https://www.cor-retraites.fr/sites/default/files/2025-12/Doc_06_R%C3%A9partition%20%C3%A0%20Capitalisation.pdf"),
  S("COR – Montée en charge de la capitalisation (12 nov. 2025)", "https://www.cor-retraites.fr/sites/default/files/2025-11/COR_Transition%20capitalisation_12-11-2025.pdf"),
  S("Fondapol – Vers un système de retraite mixte répartition-capitalisation", "https://www.fondapol.org/etude/vers-un-systeme-de-retraite-mixte-repartition-capitalisation/"),
  CONST],
 citations=["Je cotise pour moi, avec des systèmes qui me permettent d'être propriétaire du fruit de mon travail."],
 notes="La baisse « massive » de la dépense publique et la libéralisation du PEA ne sont pas chiffrées dans la publication et n'ont pas été analysées.")

# ------------------------------------------------------------------ Site : Châlons
card("site", "a-la-foire-de-chalons",
 "Compte rendu d'un déplacement à la Foire de Châlons-en-Champagne (3 sept. 2026) avec des représentants agricoles. Nouvelle Énergie propose de supprimer les impôts de production spécifiquement agricoles et de transférer des charges fiscales et sociales non contributives vers l'assiette de la valeur ajoutée, de créer un compte épargne aléas climatiques et économiques défiscalisé et un crédit d'impôt pour la transmission, de réformer la loi sur l'eau et de conditionner les aides à l'efficacité de l'irrigation, et d'instaurer un « silence vaut autorisation » au bout de six mois pour les projets collectifs de stockage d'eau respectant les seuils hydrologiques du bassin.",
 "texte de l'article du site Nouvelle Énergie",
 [
  {"texte": "Supprimer les impôts de production spécifiquement agricoles et transférer les charges fiscales et sociales non contributives vers l'assiette de la valeur ajoutée.",
   "cout": "Ordre de grandeur partiel : selon la DGFiP (mai 2025), le secteur « agriculture, sylviculture et pêche » a supporté 0,2 Md€ d'impôts de production en 2023 (sur 92,7 Md€ pour l'ensemble de l'économie, périmètre de l'étude). Le coût du transfert de charges sociales « non contributives » vers la valeur ajoutée n'est pas chiffré : non établi.",
   "cadre_juridique": "Assiette, taux et recouvrement des impositions relèvent de la loi (art. 34 de la Constitution) et des lois de finances/LFSS. Un impôt assis sur la valeur ajoutée ou un transfert de cotisations suppose une loi ; compatibilité avec le droit de l'UE (aides d'État, concurrence) : non établi (non consulté). Selon les sources consultées, les exploitants agricoles sont généralement exonérés de CFE pour leur activité agricole, de sorte que la nature des « impôts de production agricoles » visés (taxe foncière non bâti, taxe pour frais de chambre d'agriculture, charges sociales ?) n'est pas précisée.",
   "competence": "État (fiscalité nationale et cotisations sociales) ; collectivités pour la taxe foncière sur les propriétés non bâties (recette locale) : une suppression appellerait compensation (art. 72-2 de la Constitution) ; UE pour l'encadrement des aides d'État.",
   "precedents": "France : le plan de relance de 2021 a réduit les impôts de production (réduction de moitié de la CVAE et de la CFE des établissements industriels) ; la suppression de la CVAE est repoussée à 2030 (LF 2025), d'après la DGFiP. L'agriculture a peu bénéficié de cette réforme (montants faibles). Étranger : non établi.",
   "verdict": "faisable_sous_conditions",
   "conditions": ["Définition précise des impositions visées et de l'assiette de remplacement (non précisées dans la publication).", "Financement et compensation aux collectivités pour les recettes locales supprimées (chiffre non établi).", "Vérification de la compatibilité avec le droit de l'UE (non établie).", "Les chiffres de la publication (revenu net agricole −40 % en 30 ans, 45 % vs 15 % de charges sociales) n'ont pas été vérifiés."],
   "fiabilite": "moyenne", "doutes": "Périmètre de la mesure flou ; seule la ligne « agriculture » de la DGFiP a pu être chiffrée, ce qui ne couvre pas nécessairement les charges sociales visées."},
  {"texte": "Pour les projets de stockage collectif d'eau multi-usages, instaurer un « silence vaut autorisation » après six mois, si les seuils hydrologiques du bassin sont respectés.",
   "cout": "Non établi. (Les chiffres de la publication — environ 400 projets bloqués, 7,5 % des pluies efficaces stockées — n'ont pas été confirmés par une source consultée.)",
   "cadre_juridique": "Principe général : le silence de l'administration pendant deux mois vaut acceptation (art. L. 231-1 du CRPA), avec des exceptions par décret, notamment lorsqu'une acceptation implicite serait incompatible avec des normes constitutionnelles ou conventionnelles (réponse ministérielle au Sénat, 2020). En matière d'environnement, le Conseil d'État (4 oct. 2023, n° 465921) a jugé que les textes du code de l'environnement imposent que toute décision autorisant un projet soumis à évaluation environnementale soit expresse, ce qui a conduit au décret n° 2025-1402 du 29 déc. 2025 (silence vaut rejet pour ces projets, en urbanisme). Les retenues d'eau relevant d'une autorisation environnementale sont, selon un extrait de recherche, parmi les procédures où le silence vaut rejet : non vérifié directement.",
   "competence": "État pour le régime de l'autorisation et les exceptions au principe « silence vaut accord » (loi/décret) ; l'évaluation environnementale découle du droit de l'UE (directive 2011/92/UE, non consultée directement) : la modification nationale serait limitée par ce cadre ; collectivités et agences de l'eau pour les projets locaux.",
   "precedents": "France : le principe « silence vaut accord » existe depuis 2013-2014 pour l'État et 2015 pour les collectivités (Sénat, 2020), avec exceptions dont l'environnement ; la jurisprudence du Conseil d'État de 2023 montre une exigence de décision expresse pour les projets soumis à évaluation environnementale. Étranger (Espagne : plus de stockage selon des extraits d'un site de l'Académie d'agriculture) : non établi comme précédent juridique.",
   "verdict": "difficilement_faisable",
   "conditions": ["Pour les projets soumis à évaluation environnementale, l'exigence de décision expresse (jurisprudence CE 2023) fait obstacle à une autorisation tacite ; il faudrait soit un cadre européen/national modifié, soit limiter la mesure aux projets non soumis à évaluation.", "Définition de seuils hydrologiques opposables par bassin et de moyens d'instruction suffisants pour tenir le délai de six mois.", "Sécurité contentieuse : une autorisation tacite resterait attaquable par des tiers."],
   "fiabilite": "faible", "doutes": "La directive européenne et le texte exact des exceptions (décret 2014-1273) n'ont été vus que par des synthèses/extraits ; l'analyse repose surtout sur la décision du CE de 2023 telle que rapportée par un cabinet d'avocats. Elle peut changer pour des projets non soumis à évaluation environnementale."}
 ],
 [S("Les impôts de production en 2023 : une nouvelle baisse de leur poids dans l'économie (DGFiP Statistiques n° 35, mai 2025)", "https://www.impots.gouv.fr/sites/default/files/media/9_statistiques/0_etudes_et_stats/0_publications/dgfip_statistiques/2025/num35_05/dgfip_stat_35_2025.pdf"),
  S("BOFiP – CFE : exonération des exploitants agricoles (extrait de recherche)", "https://bofip.impots.gouv.fr/bofip/809-PGP.html/identifiant%3DBOI-IF-CFE-10-30-10-20-20220831"),
  S("Application du principe « silence vaut accord » (Sénat, question écrite 2019, réponse 2020)", "https://www.senat.fr/questions/base/2019/qSEQ190912259.html"),
  S("Décret n° 2025-1402 du 29 décembre 2025 : pas de « silence vaut accord » pour un projet soumis à évaluation environnementale (Cabinet Gossement Avocats, 16 janv. 2026)", "https://www.gossement-avocats.com/blog/decret-n2025-1402-du-29-decembre-2025-relatif-aux-projets-faisant-lobjet-dune-autorisation-durbanisme-et-soumis-a-evaluation-environnementale-la-declaration-prealabl/"),
  CONST],
 citations=["Passé six mois, ce sera oui par défaut : bassin par bassin, sous contrôle scientifique."],
 notes="Deux autres mesures citées (compte épargne aléas climatiques et économiques ; crédit d'impôt à la transmission) et la réforme de la loi sur l'eau ne sont pas analysées faute de sources consultées. Les statistiques avancées dans la publication ne sont pas vérifiées.")
print(len(list(AN.glob("*.json"))), "analyses écrites")
