# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v2 — la version vivante (30 octobre 2026)

Comparaison des archives v1 et v2 : 10 scripts ajoutés (aiguille, cigale, cuir, fil, mètre, nuancier, patron, relief, ruban, titres), 1 retiré (lumiere.js, remplacé par cuir.js) ; styles, textes, gabarits, pages et 3 scripts du socle (transitions, ouverture, sommaire) modifiés. Dans les autres scripts, seul le numéro de version passe de ?v=1 à ?v=2.

**Onze effets nouveaux**
- Rabat de transition : entre deux pages, un rabat de cuir vert tombe d'en haut, lèvre arrondie et cousue en tête ; son fermoir tourniquet se verrouille, puis se rouvre et le rabat se relève sur la nouvelle page.
- Cigale qui bat des ailes : l'emblème est séparé en corps et ailes. La cigale de l'en-tête bat des ailes selon la vitesse de défilement, puis se pose ; celle du rabat bat des ailes pendant sa chute ; survol du logo.
- Titres cousus : les lettres des titres de section s'assemblent derrière une aiguille qui court sur la ligne ; les étiquettes techniques (surtitres) se décodent comme une machine à étiqueter.
- Aiguille et piqûres : sur ordinateur, le curseur devient une aiguille orientée selon le mouvement, qui laisse une ligne de points de couture éphémère ; elle pique au clic et se colore sur les liens.
- Cuir vivant : sur ordinateur, les grandes photos se creusent sous la souris comme un cuir pressé (empreintes qui se résorbent, onde au clic), sous une lumière rasante (WebGL, un seul contexte partagé, coupé sur les rendus graphiques logiciels). Sur tous les écrans, les photos s'étirent un peu selon la vitesse de défilement.
- Fil conducteur (accueil) : au défilement, une aiguille coud un fil orange dans la marge, avec un détour au bas de chaque section, des œillets là où il passe sous les sections épinglées et sous le ruban, et un nœud près de la cigale du pied de page.
- Croquis en relief : les croquis pivotent en 3D à la souris, leurs pièces se décalent selon leur profondeur, le rabat de la besace bascule au survol (il s'entrouvre une fois à l'écran sur téléphone).
- Nuancier qui recolore : un éventail de cinq cuirs dans le pied de page de chaque page ; un choix donne sa couleur aux accents de tout le site (passage en cercle), gardé d'une page à l'autre.
- Patron qui se plie (atelier sur mesure) : nouvelle section « Du patron au sac » ; le patron se trace, se découpe, prend le cuir et se plie en 3D jusqu'à la besace, aux couleurs et initiales du configurateur. Épinglée sur ordinateur ; jouée une fois, avec « Rejouer », sur téléphone.
- Mètre ruban : sur ordinateur et tablette, un mètre de couturière gradué au centimètre (vraies unités) longe le bord droit et lit la position en centimètres.
- Ruban qui accélère : le bandeau défilant suit la vitesse et le sens du défilement et s'incline.
- Remplacés : le curseur œillet (par l'aiguille) et la lumière seule sur la photo d'accueil (par le cuir vivant).

**Textes (second regard)**
- « brodées » et « trois lettres au plus », non vérifiés, deviennent des mentions à confirmer ; « écusson » devient « pastille ».
- « Fiche de fabrication » devient « Fiche de la pièce » ; « délai de fabrication » devient « délai de réalisation ».
- « Créer la mienne » devient « Créer ma pièce » ; « Essayer vos couleurs » à la fin de la vue éclatée.
- Pluriels justes (« 4 créations », « 1 article ») ; espaces insécables dans « L × H × P » ; téléphone de l'hébergeur marqué « à compléter » ; « © 2026 Kabooça ».

**Mise en page**
- Tablette : le bouton Menu remplace les liens dès qu'ils ne tiennent plus sur une ligne.
- Téléphone : plus de bande claire sous le pied de page ; récapitulatif du sur-mesure après les étapes ; mention « Illustration générée » de la photo du bas du sur-mesure remise sur sa photo.
- Pied de page séparé par une couture (il ne se confond plus avec le bloc vert de la page Maison).
- Vue éclatée : sac en cuir ivoire par défaut (il ne se perd plus dans le fond vert), légende remontée.
- Suspentes des croquis en fil avec œillet ; nom des teintes choisies à côté des pastilles ; fil d'Ariane aligné ; sommaire des pages légales sans rubrique active avant la première.
- Fiches produit sur téléphone à l'horizontale : titre, prix et bouton dans le premier écran. Sans JavaScript, sur téléphone : l'en-tête réserve sa vraie hauteur.
- Contraste renforcé des pastilles d'étape, du compteur du panier et de la lecture du mètre.

**Images**
- La photo du nuancier n'est plus répétée sur la boutique et les fiches (cuir drapé et toile à sangle à la place).

## v1 — la base (30 octobre 2026)

Mise en ligne à la demande avant l'audit complet (audit rapide passé, échecs trouvés corrigés). L'audit complet et le second regard viendront avec la v2.

**Pages**
- Accueil, Boutique, trois fiches (Sac de Commandement, Accessoires de Précision, Sacs de Légion Étrangère), Atelier sur mesure, La Maison, Contact, Mentions légales, CGV, Confidentialité, page 404 « Point sauté ».
- Textes tirés du site actuel (accroches, lignes, catégories, mission) ; tout ce qui manque est marqué « à compléter ».

**Direction artistique « Sellerie technique »**
- Ivoire, vert profond, graphite, accents orange signal et cobalt ; Fraunces (titres), Jost (texte), JetBrains Mono (fiches techniques), hébergées avec le site.
- Logo cigale vectorisé depuis le site actuel : en-tête, pied de page, voile, favicon, icône iPhone, images de partage.

**Mouvement**
- Intro cousue : le patron du logo, l'aiguille qui court sur la couture, le fil qui pique le logo, la couture qui s'ouvre en deux rabats.
- Voile de transition vert profond portant l'emblème et le nom de la page.
- Vue éclatée du croquis pilotée par le défilement (pièces numérotées, cotes, réassemblage en couleurs) ; version adaptée sur téléphone.
- Galerie épinglée des quatre lignes, croquis suspendus qui se balancent ; lumière rasante WebGL sur la photo d'ouverture (ordinateur).
- Teintes appliquées en cercle depuis la pastille, initiales brodées, ajout au panier qui s'envole, boutons magnétiques, cartes inclinables, curseur œillet, loupe compte-fils.

**Fonctionnalités**
- Catalogue filtrable avec recherche (filtres gardés dans l'adresse), panier simulé (deux onglets, donnée abîmée nettoyée, commande simulée).
- Configurateur sur mesure en quatre étapes, préremplis par l'adresse, récapitulatif en direct.
- Visionneuse des détails avec lien direct, formulaires simulés avec mentions RGPD, plan schématique d'accès.

**Images**
- 32 illustrations générées (ambiances, matières, atelier), toutes marquées « Illustration générée ».
- Les photos de produits du site actuel, générées par l'IA de Wix, ne sont pas reprises : les pièces sont représentées par des croquis d'illustration en attendant les vraies photos.

**Mise en ligne**
- noindex dans chaque page et dans vercel.json, en-têtes de sécurité, images de partage 1200×630, données structurées (Store) avec les seules informations réelles.
