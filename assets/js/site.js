/* Effets et fonctionnalités de Kabooça. Le socle gère l'ouverture, les transitions, l'en-tête, le menu,
   le mode calme, les boucles et les mesures : ce fichier ne contient que ce qui est propre au client. */
import { demarrer } from './socle/index.js?v=2';
import { jouer, arrivee, etatFinal } from './projet/intro.js?v=2';
import { initPanier } from './projet/panier.js?v=2';
import { initGalerie } from './projet/galerie.js?v=2';
import { initEclatee } from './projet/eclatee.js?v=2';
import { initPersonnaliser } from './projet/personnaliser.js?v=2';
import { initCatalogue } from './projet/catalogue.js?v=2';
import { initConfigurateur } from './projet/configurateur.js?v=2';
import { initVisionneuse } from './projet/visionneuse.js?v=2';
import { initMicro } from './projet/micro.js?v=2';
import { initCuir } from './projet/cuir.js?v=2';
import { initTitres } from './projet/titres.js?v=2';
import { initAiguille } from './projet/aiguille.js?v=2';
import { initCigale } from './projet/cigale.js?v=2';
import { initRuban } from './projet/ruban.js?v=2';
import { initFil } from './projet/fil.js?v=2';
import { initRelief } from './projet/relief.js?v=2';
import { initNuancier } from './projet/nuancier.js?v=2';
import { initPatron } from './projet/patron.js?v=2';
import { initMetre } from './projet/metre.js?v=2';

const sur = (nom, f) => { try { f(); } catch (err) { console.error('[kabooca]', nom, err); } };

demarrer({
  preparer() {
    document.documentElement.classList.add('nav-mesuree');
    /* Rechargement : l'intro repart du haut ; ScrollTrigger ne doit pas rétablir l'ancienne position. */
    if (document.documentElement.dataset.arrivee === 'intro' && window.ScrollTrigger) window.ScrollTrigger.clearScrollMemory('manual');
    sur('panier', initPanier);
    sur('galerie', initGalerie);
    sur('eclatee', initEclatee);
    sur('personnaliser', initPersonnaliser);
    sur('catalogue', initCatalogue);
    sur('configurateur', initConfigurateur);
    sur('visionneuse', initVisionneuse);
    sur('micro', initMicro);
    sur('patron', initPatron);
    sur('cuir', initCuir);
    sur('titres', initTitres);
    sur('aiguille', initAiguille);
    sur('cigale', initCigale);
    sur('ruban', initRuban);
    sur('fil', initFil);
    sur('relief', initRelief);
    sur('nuancier', initNuancier);
    sur('metre', initMetre);
  },
  jouer,
  etatFinal,
  arrivee,
});
