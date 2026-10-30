/* Accueil : la promesse, les quatre lignes (galerie épinglée), la vue éclatée (signature), la personnalisation,
   le ruban, la fabrication, la Maison, le contact. Ordre : ce que le visiteur cherche, puis ce qui le rassure. */
import { html, brut } from '../../outils/gabarit.mjs';
import { croquis } from '../gabarits/croquis.mjs';
import { surtitre, etiquette, lienCreation, marquer } from '../gabarits/elements.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/accueil-ouverture-1168.webp' };

/* Repères de la vue éclatée (coordonnées du croquis 400 × 420, pièces écartées). */
export const REPERES = [
  { n: 1, cle: 'sangle', ancre: [300, 40], point: [346, 6] },
  { n: 2, cle: 'rabat', ancre: [104, 172], point: [42, 128] },
  { n: 3, cle: 'soufflet', ancre: [20, 300], point: [-26, 262] },
  { n: 4, cle: 'corps', ancre: [104, 344], point: [48, 392] },
  { n: 5, cle: 'languette', ancre: [266, 372], point: [326, 404] },
  { n: 6, cle: 'couture', ancre: [314, 214], point: [372, 158] },
];
const pct = ([x, y]) => `--x:${((x / 400) * 100).toFixed(2)}%;--y:${((y / 420) * 100).toFixed(2)}%`;

function eclatee(c) {
  const lignes = REPERES.map((r) => `<path class="eclatee-ligne" data-repere-ligne="${r.n}" d="M${r.ancre[0]} ${r.ancre[1]} L${r.point[0]} ${r.point[1]}"/><circle class="eclatee-ancre" data-repere-ligne="${r.n}" cx="${r.ancre[0]}" cy="${r.ancre[1]}" r="3"/>`).join('');
  const cotes = `<g class="eclatee-cotes" data-cotes>
    <path class="eclatee-cote" d="M76 396 H324 M76 388 V404 M324 388 V404"/>
    <path class="eclatee-cote" d="M412 186 V356 M404 186 H420 M404 356 H420"/>
  </g>`;
  return html`<section class="eclatee" id="piece-par-piece" data-entete-cache>
  ${c.media({ nom: 'grok/accueil-patronage', alt: c.s('accueil.eclatee.alt'), cadrage: '58% 50%', cadrageMobile: '92% 50%', classe: 'eclatee-fond', sizes: '100vw' })}
  <div class="eclatee-scene">
    <div class="eclatee-texte">
      ${surtitre(c.t('accueil.eclatee.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('accueil.eclatee.titre')}</h2>
      <p data-anime>${c.t('accueil.eclatee.texte')}</p>
      <p class="eclatee-legende-titre" data-anime>${c.t('accueil.eclatee.legende')}</p>
      <ol class="eclatee-legende" data-anime>${REPERES.map((r) => html`<li><span class="eclatee-num" aria-hidden="true">${r.n}</span>${c.t('croquis.pieces.' + r.cle)}</li>`)}</ol>
      <p class="eclatee-note" data-anime>${c.t('accueil.eclatee.note')}</p>
    </div>
    <div class="eclatee-dessin" data-eclatee>
      <div class="eclatee-cadre">
        ${croquis(c, 'besace', { classe: 'eclatee-croquis croquis--ligne' })}
        ${croquis(c, 'besace', { classe: 'eclatee-croquis eclatee-couleur croquis--couleur', decoratif: true })}
        ${brut(`<svg class="eclatee-calque" viewBox="0 0 400 420" aria-hidden="true" focusable="false">${lignes}${cotes}</svg>`)}
        ${REPERES.map((r) => html`<span class="eclatee-repere" data-repere data-repere-n="${r.n}" style="${pct(r.point)}" aria-hidden="true">${r.n}</span>`)}
        <span class="eclatee-repere eclatee-repere--cote" data-repere data-cote style="${pct([200, 412])}" aria-hidden="true">L</span>
        <span class="eclatee-repere eclatee-repere--cote" data-repere data-cote style="${pct([428, 271])}" aria-hidden="true">H</span>
      </div>
      <p class="eclatee-fin"><span data-eclatee-fin>${c.t('accueil.eclatee.fin')}</span> <a class="lien-fleche" href="#personnaliser">${c.t('accueil.eclatee.essayer')}</a></p>
      <p class="eclatee-bascule-ligne"><button type="button" class="bouton bouton--contour bouton--petit bouton--creme-contour" data-eclatee-bascule hidden data-libelle-assembler="${c.s('accueil.eclatee.assembler')}" data-libelle-eclater="${c.s('accueil.eclatee.eclater')}">${c.t('accueil.eclatee.assembler')}</button></p>
    </div>
  </div>
</section>`;
}

function personnaliser(c) {
  const teintes = c.donnees.teintes;
  const pastilles = (nom, defaut) => teintes.map((t) => html`<label class="pastille" style="--teinte:${t.hex}"><input type="radio" name="${nom}" value="${t.cle}" data-teinte="${t.hex}"${t.cle === defaut ? brut(' checked') : ''}><span class="pastille-rond" aria-hidden="true"></span><span class="visuellement-cache">${t.nom}</span></label>`);
  return html`<section class="personnaliser" id="personnaliser">
  <div class="conteneur perso-grille">
    <div class="perso-texte">
      ${surtitre(c.t('accueil.personnaliser.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('accueil.personnaliser.titre')}</h2>
      <ol class="perso-etapes" data-anime>
        <li><strong>${c.t('accueil.personnaliser.etape1')}</strong> ${c.t('accueil.personnaliser.etape1Texte')}</li>
        <li><strong>${c.t('accueil.personnaliser.etape2')}</strong> ${c.t('accueil.personnaliser.etape2Texte')}</li>
        <li><strong>${c.t('accueil.personnaliser.etape3')}</strong> ${c.t('accueil.personnaliser.etape3Texte')}</li>
      </ol>
      <div class="perso-reglages" data-perso>
        <fieldset class="nuancier"><legend>${c.t('accueil.personnaliser.corps')}<span class="nuancier-choix" data-choix-nom="corps"></span></legend><div class="pastilles">${pastilles('corps', 'vert')}</div></fieldset>
        <fieldset class="nuancier"><legend>${c.t('accueil.personnaliser.sangle')}<span class="nuancier-choix" data-choix-nom="sangle"></span></legend><div class="pastilles">${pastilles('sangle', 'orange')}</div></fieldset>
        <div class="champ champ--court">
          <label for="perso-initiales">${c.t('accueil.personnaliser.initiales')}</label>
          <input id="perso-initiales" name="initiales" maxlength="3" autocomplete="off" spellcheck="false" aria-describedby="perso-initiales-aide" data-initiales-champ>
          <p class="champ-aide" id="perso-initiales-aide">${c.t('accueil.personnaliser.initialesAide')}</p>
        </div>
        <p class="perso-note">${c.t('commun.teintesExemple')}</p>
        <p>${c.lien('sur-mesure', { ancre: 'configurateur', params: 'modele=sac-de-commandement&corps=vert&sangle=orange', classe: 'bouton', texte: c.t('accueil.personnaliser.action'), attrs: 'data-lien-atelier data-magnetique' })}</p>
      </div>
    </div>
    <div class="perso-visuel">
      <div class="perso-croquis" data-perso-croquis>
        ${croquis(c, 'besace', { classe: 'couche couche-dessous croquis--couleur' })}
        ${croquis(c, 'besace', { classe: 'couche couche-dessus croquis--couleur', decoratif: true })}
        <span class="badge-croquis">${c.t('commun.croquis')}</span>
      </div>
      ${c.media({ nom: 'grok/accueil-nuancier', alt: c.s('accueil.personnaliser.alt'), cadrage: '45% 60%', classe: 'perso-photo', sizes: '(max-width: 760px) 60vw, 22vw' })}
    </div>
  </div>
</section>`;
}

export default (c) => html`
<section class="hero" id="debut">
  ${c.media({ nom: 'grok/accueil-ouverture', alt: c.s('accueil.hero.alt'), cadrage: '64% 50%', cadrageMobile: '50% 58%', priorite: true, classe: 'hero-media', sizes: '100vw' })}
  <div class="hero-texte">
    ${surtitre(c.t('accueil.hero.surtitre'), 'data-anime="gsap"')}
    <h1 class="hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne hero-ligne--accent" data-anime="gsap">${c.t('accueil.hero.titre2')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      ${c.lien('sur-mesure', { ancre: 'configurateur', classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-magnetique' })}
      <a class="bouton bouton--contour" href="#collections">${c.t('accueil.hero.secondaire')}</a>
    </p>
    <p class="hero-info info-cle" data-info-cle data-anime="gsap">${c.t('accueil.hero.info')}</p>
  </div>
</section>

<section class="collections ecran epingle" id="collections" data-entete-cache>
  <div class="conteneur collections-tete">
    <div>
      ${surtitre(c.t('accueil.collections.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('accueil.collections.titre')}</h2>
    </div>
    <div class="collections-intro">
      <p data-anime>${c.t('accueil.collections.texte')}</p>
      <ul class="puces-categories" data-anime>${c.donnees.categories.map((k) => html`<li>${c.lien('boutique', { ancre: 'catalogue', params: 'categorie=' + k.cle, classe: 'puce', texte: k.nom })}</li>`)}</ul>
    </div>
  </div>
  <div class="piste collections-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.collections.region')}">
    ${c.donnees.catalogue.map((p) => html`<article class="carte-ligne" id="ligne-${p.cle}">
      <div class="carte-ligne-visuel">
        <span class="suspente" aria-hidden="true"></span>
        <div class="suspendu" data-suspendu>${croquis(c, p.croquis)}</div>
        <span class="badge-croquis">${c.t('commun.croquisCourt')}</span>
        <span class="carte-ligne-numero" aria-hidden="true">${p.numero}</span>
      </div>
      <div class="carte-ligne-texte">
        <h3>${p.nom}</h3>
        <p>${p.accroche}</p>
        <p>${lienCreation(c, p, { classe: 'lien-fleche', texte: p.fiche ? c.t('accueil.collections.voirFiche') : c.t('accueil.collections.creer') })}</p>
      </div>
    </article>`)}
    <article class="carte-ligne carte-ligne--fin">
      <div class="carte-ligne-fin">
        ${surtitre(c.t('boutique.tete.surtitre'))}
        <p class="carte-ligne-fin-titre">${c.t('accueil.collections.finTitre')}</p>
        <p>${c.lien('boutique', { classe: 'bouton bouton--creme', texte: c.t('accueil.collections.tout') })}</p>
      </div>
    </article>
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
  <p class="glisser" aria-hidden="true">${c.t('commun.faitesGlisser')}</p>
</section>

${eclatee(c)}

${personnaliser(c)}

<div class="ruban-section">
  ${c.media({ nom: 'grok/accueil-ruban-sangle', alt: '', cadrage: '50% 45%', classe: 'ruban-fond', sizes: '100vw' })}
  <div class="ruban" id="ruban" data-boucle-css data-ruban><p>${c.t('accueil.ruban.texte')} ${c.t('accueil.ruban.texte')} ${c.t('accueil.ruban.texte')} ${c.t('accueil.ruban.texte')}</p></div>
  <button type="button" class="ruban-pause" data-pause-pour="ruban" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
</div>

<section class="fabrication" id="fabrication">
  <div class="conteneur fab-tete">
    ${surtitre(c.t('accueil.fabrication.surtitre'), 'data-anime')}
    <h2 data-anime>${c.t('accueil.fabrication.titre')}</h2>
    <p data-anime>${c.t('accueil.fabrication.texte')}</p>
  </div>
  <div class="conteneur fab-grille">
    ${c.media({ nom: 'grok/accueil-etabli', alt: c.s('accueil.fabrication.altEtabli'), cadrage: '50% 55%', classe: 'fab-etabli revele-couture', sizes: '(max-width: 760px) 100vw, 56vw', legende: c.t('accueil.fabrication.legendeEtabli') })}
    ${c.media({ nom: 'grok/accueil-couture', alt: c.s('accueil.fabrication.altCouture'), cadrage: '50% 50%', classe: 'fab-couture revele-couture', sizes: '(max-width: 760px) 50vw, 20vw', legende: c.t('accueil.fabrication.legendeCouture') })}
    ${c.media({ nom: 'grok/accueil-boucles', alt: c.s('accueil.fabrication.altBoucles'), cadrage: '50% 50%', classe: 'fab-boucles revele-couture', sizes: '(max-width: 760px) 50vw, 20vw', legende: c.t('accueil.fabrication.legendeBoucles') })}
    ${etiquette(c, c.t('accueil.fabrication.fiche'), ['matieres', 'fils', 'attaches', 'finitions'].map((k) => ({ libelle: c.t('accueil.fabrication.' + k), valeur: c.t('commun.aCompleter') })), { classe: 'fab-etiquette' })}
  </div>
</section>

<section class="bloc-image maison-bloc" id="maison">
  <div class="conteneur bloc-image-grille">
    ${c.media({ nom: 'grok/accueil-maison', alt: c.s('accueil.maison.alt'), cadrage: '60% 50%', classe: 'bloc-image-media parallaxe', sizes: '(max-width: 760px) 100vw, 50vw' })}
    <div class="bloc-image-texte">
      ${surtitre(c.t('accueil.maison.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('accueil.maison.titre')}</h2>
      <p class="texte-marque" data-anime>${marquer(c.t('accueil.maison.texte'), ['technique', 'colorée', 'sophistiquée'])}</p>
      <p data-anime>${c.lien('maison', { classe: 'bouton bouton--contour', texte: c.t('accueil.maison.action') })}</p>
    </div>
  </div>
</section>

<section class="bloc-image contact-bloc" id="contact">
  <div class="conteneur bloc-image-grille bloc-image-grille--inverse">
    <div class="bloc-image-texte">
      ${surtitre(c.t('accueil.contact.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('accueil.contact.titre')}</h2>
      <p data-anime>${c.t('accueil.contact.texte')}</p>
      <dl class="coordonnees" data-anime>
        <div><dt>${c.t('commun.telephoneLibelle')}</dt><dd><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></dd></div>
        <div><dt>${c.t('commun.emailLibelle')}</dt><dd><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></dd></div>
        <div><dt>${c.t('commun.adresseLibelle')}</dt><dd>${c.site.contact.rue}, ${c.site.contact.ville}</dd></div>
      </dl>
      <p class="actions" data-anime>
        ${c.lien('contact', { ancre: 'formulaire', classe: 'bouton', texte: c.t('commun.ecrire'), attrs: 'data-magnetique' })}
        <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
      </p>
    </div>
    ${c.media({ nom: 'grok/accueil-contact', alt: c.s('accueil.contact.alt'), cadrage: '50% 50%', classe: 'bloc-image-media bloc-image-media--portrait', sizes: '(max-width: 760px) 100vw, 40vw' })}
  </div>
</section>
`;
