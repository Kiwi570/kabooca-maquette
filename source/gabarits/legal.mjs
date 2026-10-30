/* Pages légales : image en tête, sommaire qui suit la lecture, barre de lecture, sections de texte. */
import { html } from '../../outils/gabarit.mjs';
import { surtitre } from './elements.mjs';

export function legale(c, { prefixe, sections, image, cadrage = '50% 50%' }) {
  return html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court" id="debut">
  <div class="page-tete-texte">
    ${surtitre(c.t('commun.informations'))}
    <h1>${c.t(prefixe + '.titre')}</h1>
    <p class="page-tete-intro">${c.t(prefixe + '.texte')}</p>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`${prefixe}.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  ${c.media({ nom: image, alt: '', cadrage, priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`${prefixe}.${s}.titre`)}</h2><p>${c.tb(`${prefixe}.${s}.texte`)}</p></section>`)}
</div>
`;
}
