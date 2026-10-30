# Kabooça — maquette

Maquette du futur site de Kabooça (sacs et accessoires personnalisés, Roquemaure), direction artistique « Sellerie technique » : ivoire, vert profond, graphite, accents orange signal et cobalt ; Fraunces, Jost et JetBrains Mono.

Site statique prêt pour Vercel (`cleanUrls`), sans étape de construction : les pages HTML sont générées à l'avance à partir des fichiers de données.

## Pages

| Adresse | Contenu |
|---|---|
| `/` | Promesse, les quatre lignes (galerie épinglée), vue éclatée du croquis, personnalisation (teintes et initiales), ruban, fabrication, la Maison, contact |
| `/boutique` | Catalogue filtrable (`?categorie=sacs`) avec recherche (`?q=…`), ajout au panier |
| `/boutique/sac-de-commandement`, `/boutique/accessoires-de-precision`, `/boutique/sacs-legion-etrangere` | Fiches : croquis qui se dessine, fiche technique à compléter, détails en visionneuse (`#detail-1`…), personnalisation |
| `/sur-mesure` | Atelier en quatre étapes, choix préremplis par l'adresse (`?modele=…&corps=…&sangle=…&fil=…&initiales=…`), FAQ |
| `/maison` | Mission, trois exigences, atelier (à compléter), Roquemaure |
| `/contact` | Coordonnées, formulaire (`?sujet=sur-mesure`), plan schématique |
| `/mentions-legales`, `/cgv`, `/confidentialite`, `404` | Pages légales à compléter, page « Point sauté » |

Le panier (tiroir) est présent sur toutes les pages.

## Travailler sur le site

```
python3 outils/images.py recu/lot.json     # images reçues -> WebP en plusieurs tailles
node outils/generer.mjs                    # pages HTML à partir de donnees/ et source/
node outils/images-partage.mjs             # images de partage 1200×630 (assets/partage/)
node _audit/audit.mjs                      # audit complet avant chaque livraison
```

- Textes : `donnees/textes/fr.json`. Catalogue, catégories, teintes, FAQ : `donnees/*.json`. Réglages (couleurs, contact, adresse de la maquette, numéro de version) : `donnees/site.json`.
- Ne jamais modifier à la main les pages générées (`index.html`, `boutique.html`…).
- Le logo est vectorisé depuis le PNG du site actuel : `python3 outils/projet/tracer-logo.py` puis `node outils/projet/logos.mjs`.
- Chaque version livrée change `version` dans `donnees/site.json` (numéro `?v=N` des feuilles de style et des scripts).

## À fournir par Kabooça

- Photos réelles des pièces (elles remplacent les croquis d'illustration ; détourées pour les effets).
- Pour chaque pièce : matières, dimensions, poids, coloris, fermeture, entretien, délai, prix TTC.
- Options réelles de personnalisation et teintes disponibles (les teintes de la maquette sont des exemples).
- Mentions légales : raison sociale, forme, capital, SIRET, RCS, TVA, directeur de la publication.
- CGV complètes, médiateur de la consommation, moyens de paiement, livraison.
- Politique de confidentialité (durées de conservation, responsable).
- Fondateur ou équipe, atelier, savoir-faire ; horaires d'accueil s'il y en a.
- Autorisation d'usage du nom et des insignes de la Légion étrangère, le cas échéant (des collections existent sous licence officielle). En attendant, aucun insigne n'est dessiné et l'intitulé « Sacs de Légion Étrangère » est marqué « à valider ».
- Comptes de réseaux sociaux réels (ceux du site actuel renvoient vers les pages d'accueil génériques).

## Incohérences relevées sur le site actuel

- Deux e-mails : contact@kabooza.fr (faute) et contact@kabooca.fr.
- Deux téléphones : +33 1 23 45 67 89 (numéro du modèle Wix) et 07 66 49 37 16.
- Deux logos : la cigale (affichée) et un nœud doré (déclaré dans les réglages Wix). La maquette garde la cigale.
- « La légendre en votre personne » (faute) ; boutique vide ; champ « Anniversaire » dans le contact.
- Les photos de produits du site actuel sont générées par l'IA de Wix : elles ne montrent pas de vraies pièces et ne sont pas reprises.

## À la mise en ligne définitive

À retirer :
- `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json`.
- Panier, commande et formulaires simulés (à brancher sur la vraie boutique et l'envoi réel).
- Teintes d'exemple, croquis d'illustration (dès que les photos sont là), mentions « à compléter ».
- L'adresse de la maquette (`adresse` dans `donnees/site.json`, données structurées dans `donnees/structure.json`).

À garder :
- La mention « Illustration générée » sur toutes les images créées par IA (dossier `assets/images/grok/`).
