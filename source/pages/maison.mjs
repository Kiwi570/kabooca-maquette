/* La Maison : la mission (textes réels du site actuel), trois exigences, l'atelier (à compléter), Roquemaure. */
import { html } from '../../outils/gabarit.mjs';
import { croquis } from '../gabarits/croquis.mjs';
import { pageTete, surtitre, etiquette, appelFin, marquer } from '../gabarits/elements.mjs';

export const page = { cle: 'maison', fichier: 'maison', imagePartage: 'grok/maison-ouverture-1168.webp' };

export default (c) => html`
${pageTete(c, {
  surtitre: c.t('maison.tete.surtitre'),
  titre: c.t('maison.tete.titre'),
  texte: c.t('maison.tete.texte'),
  action: c.lien('boutique', { classe: 'bouton', texte: c.t('maison.tete.action'), attrs: 'data-action-principale data-magnetique' }),
  info: c.t('maison.tete.info'),
  media: c.media({ nom: 'grok/maison-ouverture', alt: c.s('maison.tete.alt'), cadrage: '55% 50%', cadrageMobile: '40% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 50vw' }),
})}

<section class="bloc-image" id="mission">
  <div class="conteneur bloc-image-grille">
    ${c.media({ nom: 'grok/maison-matieres', alt: c.s('maison.mission.alt'), cadrage: '50% 55%', classe: 'bloc-image-media bloc-image-media--portrait parallaxe', sizes: '(max-width: 760px) 100vw, 40vw' })}
    <div class="bloc-image-texte">
      ${surtitre(c.t('maison.mission.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('maison.mission.titre')}</h2>
      <p class="texte-grand texte-marque" data-anime>${marquer(c.t('maison.mission.texte'), ['technique', 'colorée', 'sophistiquée'])}</p>
      <p data-anime>${c.t('maison.mission.texte2')}</p>
    </div>
  </div>
</section>

<section class="valeurs" id="valeurs">
  <div class="conteneur valeurs-grille">
    <div class="valeurs-texte">
      ${surtitre(c.t('maison.valeurs.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('maison.valeurs.titre')}</h2>
      <ol class="valeurs-liste">
        ${[1, 2, 3].map((n) => html`<li data-anime><span class="valeurs-num" aria-hidden="true">0${n}</span><h3>${c.t('maison.valeurs.v' + n)}</h3><p>${c.t('maison.valeurs.v' + n + 'Texte')}</p></li>`)}
      </ol>
    </div>
    ${c.media({ nom: 'grok/maison-gestes', alt: c.s('maison.valeurs.alt'), cadrage: '55% 40%', classe: 'valeurs-media', sizes: '(max-width: 760px) 100vw, 36vw' })}
  </div>
</section>

<section class="atelier-bloc conteneur" id="atelier">
  <div class="atelier-visuel">${croquis(c, 'patron')}<span class="badge-croquis">${c.t('commun.croquisCourt')}</span></div>
  <div>
    ${surtitre(c.t('maison.atelier.surtitre'), 'data-anime')}
    <h2 data-anime>${c.t('maison.atelier.titre')}</h2>
    <p data-anime>${c.t('maison.atelier.texte')}</p>
    ${etiquette(c, c.t('maison.atelier.aFournir'), [{ libelle: c.t('maison.atelier.titre'), valeur: c.t('maison.atelier.points') }])}
  </div>
</section>

<section class="bloc-image" id="roquemaure">
  <div class="conteneur bloc-image-grille bloc-image-grille--inverse">
    <div class="bloc-image-texte">
      ${surtitre(c.t('maison.lieu.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('maison.lieu.titre')}</h2>
      <p data-anime>${c.t('maison.lieu.texte')}</p>
      <p data-anime>${c.lien('contact', { ancre: 'acces', classe: 'bouton bouton--contour', texte: c.t('maison.lieu.action') })}</p>
    </div>
    ${c.media({ nom: 'grok/maison-lumiere', alt: c.s('maison.lieu.alt'), cadrage: '50% 50%', classe: 'bloc-image-media parallaxe', sizes: '(max-width: 760px) 100vw, 50vw' })}
  </div>
</section>

${appelFin(c, { titre: c.t('maison.fin.titre'), texte: c.t('maison.fin.texte') })}
`;
