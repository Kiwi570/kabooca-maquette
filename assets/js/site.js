/* Effets et fonctionnalités de Kabooça. Le socle gère l'ouverture, les transitions, l'en-tête, le menu,
   le mode calme, les boucles et les mesures : ce fichier ne contient que ce qui est propre au client. */
import { demarrer } from './socle/index.js?v=1';
import { jouer, arrivee, etatFinal } from './projet/intro.js?v=1';
import { initPanier } from './projet/panier.js?v=1';
import { initGalerie } from './projet/galerie.js?v=1';
import { initEclatee } from './projet/eclatee.js?v=1';
import { initPersonnaliser } from './projet/personnaliser.js?v=1';
import { initCatalogue } from './projet/catalogue.js?v=1';
import { initConfigurateur } from './projet/configurateur.js?v=1';
import { initVisionneuse } from './projet/visionneuse.js?v=1';
import { initLumiere } from './projet/lumiere.js?v=1';
import { initMicro } from './projet/micro.js?v=1';

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
    sur('lumiere', initLumiere);
  },
  jouer,
  etatFinal,
  arrivee,
});
