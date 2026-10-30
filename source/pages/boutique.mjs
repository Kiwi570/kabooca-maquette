/* Boutique : catalogue filtrable (catégorie dans l'adresse, ?categorie=…) avec recherche (?q=…),
   cartes inclinables, ajout au panier, appel vers l'atelier sur mesure. */
import { html } from '../../outils/gabarit.mjs';
import { carteCreation, pageTete } from '../gabarits/elements.mjs';

export const page = { cle: 'boutique', fichier: 'boutique', imagePartage: 'grok/boutique-ouverture-1168.webp' };

export default (c) => {
  const cats = c.donnees.categories;
  const compte = (k) => c.donnees.catalogue.filter((p) => p.categorie === k).length;
  return html`
${pageTete(c, {
  surtitre: c.t('boutique.tete.surtitre'),
  titre: c.t('boutique.tete.titre'),
  texte: c.t('boutique.tete.texte'),
  action: html`<a class="bouton" href="#catalogue" data-action-principale data-magnetique>${c.t('boutique.tete.action')}</a>`,
  info: c.t('boutique.tete.info'),
  media: c.media({ nom: 'grok/boutique-ouverture', alt: c.s('boutique.tete.alt'), cadrage: '50% 45%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 50vw' }),
})}

<section class="catalogue conteneur" id="catalogue" data-catalogue>
  <div class="catalogue-tete">
    <h2 data-anime>${c.t('boutique.catalogue.titre')}</h2>
    <div class="catalogue-outils">
      <div class="champ champ--recherche">
        <label for="recherche">${c.t('boutique.catalogue.recherche')}</label>
        <input id="recherche" name="q" type="search" autocomplete="off" placeholder="${c.s('boutique.catalogue.rechercheAide')}" data-recherche>
      </div>
      <div class="filtres" role="group" aria-label="${c.s('boutique.catalogue.filtres')}">
        <button type="button" class="puce" data-filtre="" aria-pressed="true">${c.t('boutique.catalogue.toutes')} <span class="puce-nombre">${c.donnees.catalogue.length}</span></button>
        ${cats.map((k) => html`<button type="button" class="puce" data-filtre="${k.cle}" aria-pressed="false"${compte(k.cle) ? '' : html` disabled`}>${k.nom} <span class="puce-nombre">${compte(k.cle)}</span></button>`)}
      </div>
    </div>
    <p class="catalogue-resultat" data-resultat aria-live="polite">${c.t('boutique.catalogue.resultats', { n: c.donnees.catalogue.length, s: c.donnees.catalogue.length > 1 ? 's' : '' })}</p>
  </div>
  <div class="catalogue-grille" data-grille>
    ${c.donnees.catalogue.map((p) => carteCreation(c, p))}
  </div>
  <div class="catalogue-aucun" data-aucun hidden>
    <p>${c.t('boutique.catalogue.aucun')}</p>
    <p><button type="button" class="bouton bouton--contour" data-effacer>${c.t('boutique.catalogue.effacer')}</button></p>
  </div>
  <p class="catalogue-note">${c.t('boutique.catalogue.note')}</p>
</section>

<section class="bloc-image appel-atelier" id="sur-mesure-appel">
  <div class="conteneur bloc-image-grille">
    ${c.media({ nom: 'grok/maison-lumiere', alt: c.s('boutique.appel.alt'), cadrage: '55% 50%', classe: 'bloc-image-media bloc-image-media--portrait', sizes: '(max-width: 760px) 100vw, 38vw' })}
    <div class="bloc-image-texte">
      <h2 data-anime>${c.t('boutique.appel.titre')}</h2>
      <p data-anime>${c.t('boutique.appel.texte')}</p>
      <p data-anime>${c.lien('sur-mesure', { ancre: 'configurateur', classe: 'bouton', texte: c.t('boutique.appel.action'), attrs: 'data-magnetique' })}</p>
    </div>
  </div>
</section>
`;
};
