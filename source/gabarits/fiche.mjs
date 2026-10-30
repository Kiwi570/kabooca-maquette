/* Fiche d'une création : croquis qui se dessine, informations, ajout au panier, fiche technique à compléter,
   détails en illustration (visionneuse, loupe), appel vers l'atelier, autres créations. */
import { html } from '../../outils/gabarit.mjs';
import { croquis } from './croquis.mjs';
import { surtitre, etiquette, carteCreation } from './elements.mjs';

const DETAILS = [
  { nom: 'grok/accueil-couture', alt: 'accueil.fabrication.altCouture', legende: 'accueil.fabrication.legendeCouture', cadrage: '50% 50%' },
  { nom: 'grok/accueil-boucles', alt: 'accueil.fabrication.altBoucles', legende: 'accueil.fabrication.legendeBoucles', cadrage: '50% 50%' },
  { nom: 'grok/maison-matieres', alt: 'maison.mission.alt', legende: 'accueil.fabrication.matieres', cadrage: '50% 55%' },
];

export function fiche(cle) {
  const meta = { cle, fichier: `boutique/${cle}`, imagePartage: 'grok/boutique-fiche-fond-1168.webp' };
  const rendu = (c) => {
    const p = c.donnees.catalogue.find((x) => x.cle === cle);
    const cat = c.donnees.categories.find((k) => k.cle === p.categorie);
    const autres = c.donnees.catalogue.filter((x) => x.cle !== cle);
    const champs = ['matiere', 'dimensions', 'poids', 'coloris', 'fermeture', 'entretien', 'delai'];
    return html`
<nav class="fil-ariane conteneur" aria-label="${c.s('fiche.fil')}"><ol><li>${c.lien('boutique', { texte: c.t('fiche.boutique') })}</li><li aria-current="page">${p.nom}</li></ol></nav>
<section class="fiche-tete conteneur" id="debut">
  <div class="fiche-visuel" data-dessin>
    ${croquis(c, p.croquis, { classe: 'fiche-croquis' })}
    <span class="badge-croquis">${c.t('commun.croquis')}</span>
  </div>
  <div class="fiche-texte">
    ${surtitre(`${p.numero} · ${cat.nom}`, 'data-anime')}
    <h1 class="titre-decoupe" data-anime="gsap">${p.nom}</h1>
    <p class="fiche-accroche" data-anime>${p.accroche}</p>
    <p class="fiche-prix info-cle" data-info-cle data-anime><span data-prix>${c.t('commun.prixACompleter')}</span></p>
    <p class="fiche-actions" data-anime>
      <button type="button" class="bouton" data-ajouter="${p.cle}" data-action-principale data-magnetique>${c.t('fiche.ajouter')}</button>
      ${c.lien('sur-mesure', { ancre: 'configurateur', params: 'modele=' + p.cle, classe: 'bouton bouton--contour', texte: c.t('fiche.personnaliser') })}
    </p>
    ${p.intituleAValider ? html`<p class="fiche-note" data-anime>${c.t('fiche.intitule')}</p>` : ''}
  </div>
</section>

<section class="fiche-details conteneur" id="details">
  <div class="fiche-details-texte">
    <h2 data-anime>${c.t('fiche.details.titre')}</h2>
    <p data-anime>${c.t('fiche.details.texte')}</p>
    ${etiquette(c, p.nom, champs.map((k) => ({ libelle: c.t('fiche.details.' + k), valeur: c.t('commun.aCompleter') })))}
  </div>
  <div class="fiche-galerie">
    <h3 data-anime>${c.t('fiche.details.galerie')}</h3>
    <p class="fiche-galerie-texte" data-anime>${c.t('fiche.details.galerieTexte')}</p>
    <ul class="vignettes" data-visionneuse-groupe>
      ${DETAILS.map((d, i) => html`<li><a class="vignette" href="#detail-${i + 1}" id="vignette-${i + 1}" data-visionneuse="${i}" data-sans-transition aria-label="${c.s('fiche.details.ouvrir', { nom: c.s(d.legende) })}">${c.media({ nom: d.nom, alt: c.s(d.alt), cadrage: d.cadrage, classe: 'vignette-media', sizes: '(max-width: 760px) 33vw, 14vw', legende: c.t(d.legende) })}</a></li>`)}
    </ul>
  </div>
</section>

<div class="visionneuse" data-visionneuse-fenetre data-recouvrement data-gouttiere="#141716" hidden role="dialog" aria-modal="true" aria-label="${c.s('visionneuse.titre')}">
  <div class="visionneuse-scene" data-visionneuse-scene>
    ${DETAILS.map((d, i) => html`<div class="visionneuse-vue" id="detail-${i + 1}" data-vue="${i}" hidden>${c.media({ nom: d.nom, alt: c.s(d.alt), cadrage: '50% 50%', classe: 'visionneuse-media', sizes: '90vw' })}<p class="visionneuse-legende">${c.t(d.legende)}</p></div>`)}
  </div>
  <p class="visionneuse-position" data-visionneuse-position aria-live="polite"></p>
  <button type="button" class="visionneuse-bouton visionneuse-prec" data-visionneuse-prec aria-label="${c.s('visionneuse.precedent')}">‹</button>
  <button type="button" class="visionneuse-bouton visionneuse-suiv" data-visionneuse-suiv aria-label="${c.s('visionneuse.suivant')}">›</button>
  <button type="button" class="visionneuse-bouton visionneuse-fermer" data-visionneuse-fermer>${c.t('visionneuse.fermer')}</button>
</div>

<section class="bloc-image fiche-appel" id="personnaliser">
  <div class="conteneur bloc-image-grille">
    ${c.media({ nom: 'grok/boutique-fiche-fond', alt: c.s('fiche.appel.alt'), cadrage: '72% 62%', classe: 'bloc-image-media bloc-image-media--portrait', sizes: '(max-width: 760px) 100vw, 36vw' })}
    <div class="bloc-image-texte">
      <h2 data-anime>${c.t('fiche.appel.titre')}</h2>
      <p data-anime>${c.t('fiche.appel.texte')}</p>
      <p data-anime>${c.lien('sur-mesure', { ancre: 'configurateur', params: 'modele=' + p.cle, classe: 'bouton', texte: c.t('fiche.personnaliser'), attrs: 'data-magnetique' })}</p>
    </div>
  </div>
</section>

<section class="autres conteneur" id="autres">
  <h2 data-anime>${c.t('fiche.autres')}</h2>
  <div class="catalogue-grille catalogue-grille--trois">${autres.map((x) => carteCreation(c, x))}</div>
</section>
`;
  };
  return { meta, rendu };
}
