/* Éléments partagés par les pages de Kabooça : surtitre cousu, étiquette technique, carte de création,
   haut de page intérieure, appel final. */
import { html, brut, texteBrut } from '../../outils/gabarit.mjs';
import { croquis } from './croquis.mjs';

/* Surtitre en mono précédé d'un petit point sellier qui se coud à l'apparition. */
export const surtitre = (texte, attrs = '') => html`<p class="surtitre"${brut(attrs ? ' ' + attrs : '')}><span class="piqure" aria-hidden="true"></span>${texte}</p>`;

/* Étiquette technique cousue : lignes { libelle, valeur }. */
export function etiquette(c, titre, lignes, { classe = '' } = {}) {
  return html`<div class="etiquette ${classe}" data-visuel>
  <p class="etiquette-titre">${titre}</p>
  <dl>${lignes.map((l) => html`<div class="etiquette-ligne"><dt>${l.libelle}</dt><dd${l.prix ? brut(' data-prix') : ''}>${l.valeur}</dd></div>`)}</dl>
</div>`;
}

/* Lien vers la fiche ou vers l'atelier, selon la création. */
export const lienCreation = (c, p, { classe = '', texte } = {}) => p.fiche
  ? c.lien(p.cle, { classe, texte: texte ?? c.t('boutique.catalogue.fiche') })
  : c.lien('sur-mesure', { ancre: 'configurateur', params: 'modele=autre', classe, texte: texte ?? c.t('boutique.catalogue.creer') });

/* Carte d'une création (boutique, autres créations). */
export function carteCreation(c, p, { niveau = 'h3', ajout = true } = {}) {
  const cat = c.donnees.categories.find((k) => k.cle === p.categorie);
  const titre = niveau === 'h2' ? html`<h2 class="carte-nom">${p.nom}</h2>` : html`<h3 class="carte-nom">${p.nom}</h3>`;
  return html`<article class="carte-creation" data-creation="${p.cle}" data-categorie="${p.categorie}" data-mots="${`${p.nom} ${p.accroche} ${cat ? cat.nom + ' ' + cat.texte : ''}`}" data-incline>
  <div class="carte-visuel">
    ${croquis(c, p.croquis, { decoratif: false })}
    <span class="badge-croquis">${c.t('commun.croquisCourt')}</span>
  </div>
  <div class="carte-texte">
    <p class="carte-numero">${p.numero} · ${cat ? cat.nom : ''}</p>
    ${titre}
    <p class="carte-accroche">${p.accroche}</p>
    ${p.fiche ? html`<p class="carte-prix" data-prix>${c.t('commun.prixACompleter')}</p>` : ''}
    <p class="carte-actions">
      ${lienCreation(c, p, { classe: 'bouton bouton--contour bouton--petit' })}
      ${ajout && p.fiche ? html`<button type="button" class="bouton bouton--petit" data-ajouter="${p.cle}">${c.t('boutique.catalogue.ajouter')}</button>` : ''}
    </p>
  </div>
</article>`;
}

/* Haut d'une page intérieure : titre, texte, action principale, information clé, grande image. */
export function pageTete(c, { surtitre: st, titre, texte, action, info, media, classe = '', apres = '' }) {
  return html`<section class="page-tete ${classe}" id="debut">
  <div class="page-tete-texte">
    ${st ? surtitre(st, 'data-anime') : ''}
    <h1 class="titre-decoupe" data-anime="gsap">${titre}</h1>
    ${texte ? html`<p class="page-tete-intro" data-anime>${texte}</p>` : ''}
    ${action || info ? html`<p class="page-tete-actions" data-anime>${action || ''}${info ? html`<span class="info-cle" data-info-cle>${info}</span>` : ''}</p>` : ''}
    ${apres}
  </div>
  ${media}
</section>`;
}

/* Appel à l'action en fin de page : croquis du patron, deux boutons. */
export function appelFin(c, { titre, texte } = {}) {
  return html`<section class="appel-fin" id="appel">
  <div class="conteneur appel-fin-grille">
    <div class="appel-fin-visuel">${croquis(c, 'patron', { decoratif: true })}</div>
    <div>
      <h2 data-anime>${titre ?? c.t('fin.titre')}</h2>
      <p data-anime>${texte ?? c.t('fin.texte')}</p>
      <p class="appel-fin-actions" data-anime>
        ${c.lien('sur-mesure', { ancre: 'configurateur', classe: 'bouton', texte: c.t('fin.creer'), attrs: 'data-magnetique' })}
        ${c.lien('contact', { ancre: 'formulaire', classe: 'bouton bouton--contour', texte: c.t('fin.ecrire') })}
      </p>
    </div>
  </div>
</section>`;
}

/* Mots clés soulignés au feutre orange quand le paragraphe apparaît (écrits dans la page). */
export const marquer = (v, mots) => brut(texteBrut(v).replace(new RegExp(`(?<![\\p{L}])(${mots.join('|')})(?![\\p{L}])`, 'gu'), '<span class="marque">$1</span>'));
