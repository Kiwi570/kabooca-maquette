/* Contact : coordonnées réelles, formulaire simulé (sujet prérempli par ?sujet=…), plan schématique d'accès. */
import { html, brut } from '../../outils/gabarit.mjs';
import { pageTete } from '../gabarits/elements.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'grok/contact-ouverture-1168.webp' };

/* Plan schématique (longitude et latitude réelles, projection simple) : 320 × 500. */
const LIEUX = { roquemaure: [117, 250], avignon: [158, 460], orange: [161, 67], chateauneuf: [199, 237] };
const pc = ([x, y]) => `--x:${((x / 320) * 100).toFixed(1)}%;--y:${((y / 500) * 100).toFixed(1)}%`;

function plan(c) {
  const rhone = 'M52 0 C60 50 70 110 82 146 C100 190 130 210 142 229 C152 252 154 285 150 313 C146 342 124 356 127 375 C130 400 150 425 150 448 C150 470 138 486 135 500';
  return html`<figure class="plan" data-visuel>
  <div class="plan-cadre">
    ${brut(`<svg class="plan-svg" viewBox="0 0 320 500" role="img" aria-label="${c.s('contact.acces.planAlt').replace(/"/g, '&quot;')}">
      <rect class="plan-fond" width="320" height="500"/>
      <path class="plan-grille" d="M0 100 H320 M0 200 H320 M0 300 H320 M0 400 H320 M80 0 V500 M160 0 V500 M240 0 V500"/>
      <path class="plan-rhone-rive" d="${rhone}"/>
      <path class="plan-rhone" d="${rhone}" pathLength="1"/>
      <path class="plan-route" d="M117 250 C135 300 150 380 158 460"/>
      <circle class="plan-ville" cx="158" cy="460" r="5"/><circle class="plan-ville" cx="161" cy="67" r="5"/><circle class="plan-ville" cx="199" cy="237" r="4"/>
      <g class="plan-repere" data-plan-repere><circle cx="117" cy="250" r="16"/><circle class="plan-repere-coeur" cx="117" cy="250" r="5"/></g>
    </svg>`)}
    <span class="plan-etiquette plan-etiquette--fort" data-repere style="${pc([92, 250])}">${c.t('contact.acces.roquemaure')}</span>
    <span class="plan-etiquette" data-repere style="${pc([174, 460])}">${c.t('contact.acces.avignon')}</span>
    <span class="plan-etiquette" data-repere style="${pc([177, 67])}">${c.t('contact.acces.orange')}</span>
    <span class="plan-etiquette plan-etiquette--petit" data-repere style="${pc([212, 222])}">${c.t('contact.acces.chateauneuf')}</span>
    <span class="plan-etiquette plan-etiquette--eau" data-repere style="${pc([104, 140])}">${c.t('contact.acces.rhone')}</span>
  </div>
  <figcaption class="plan-legende">${c.t('contact.acces.plan')}</figcaption>
</figure>`;
}

export default (c) => {
  const F = 'contact.formulaire';
  const carte = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('3 rue de Prilly 30150 Roquemaure');
  return html`
${pageTete(c, {
  surtitre: c.t('contact.tete.surtitre'),
  titre: c.t('contact.tete.titre'),
  texte: c.t('contact.tete.texte'),
  action: html`<a class="bouton" href="#formulaire" data-action-principale data-magnetique>${c.t('contact.tete.action')}</a>`,
  info: html`<a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a>`,
  media: c.media({ nom: 'grok/contact-ouverture', alt: c.s('contact.tete.alt'), cadrage: '55% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 50vw' }),
  apres: html`<dl class="coordonnees" data-anime>
    <div><dt>${c.t('commun.emailLibelle')}</dt><dd><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></dd></div>
    <div><dt>${c.t('commun.adresseLibelle')}</dt><dd>${c.site.contact.rue}, ${c.site.contact.ville}</dd></div>
  </dl>`,
})}

<section class="contact-formulaire conteneur" id="formulaire">
  <div class="contact-formulaire-cote">
    <h2 data-anime>${c.t(F + '.titre')}</h2>
    <p data-anime>${c.t(F + '.texte')}</p>
    ${c.media({ nom: 'grok/accueil-contact', alt: c.s(F + '.alt'), cadrage: '50% 50%', classe: 'contact-formulaire-media', sizes: '(max-width: 760px) 100vw, 32vw' })}
  </div>
  <form data-formulaire class="formulaire" action="#" novalidate>
    <div class="champs-deux">
      <div class="champ"><label for="f-prenom">${c.t(F + '.prenom')}</label><input id="f-prenom" name="prenom" autocomplete="given-name" required></div>
      <div class="champ"><label for="f-nom">${c.t(F + '.nom')}</label><input id="f-nom" name="nom" autocomplete="family-name" required></div>
    </div>
    <div class="champs-deux">
      <div class="champ"><label for="f-email">${c.t(F + '.email')}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="champ"><label for="f-tel">${c.t(F + '.tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel"></div>
    </div>
    <div class="champ"><label for="f-sujet">${c.t(F + '.sujet')}</label>
      <select id="f-sujet" name="sujet">
        <option value="sur-mesure">${c.t(F + '.sujetSurMesure')}</option>
        <option value="piece">${c.t(F + '.sujetPiece')}</option>
        <option value="commande">${c.t(F + '.sujetCommande')}</option>
        <option value="autre" selected>${c.t(F + '.sujetAutre')}</option>
      </select></div>
    <div class="champ"><label for="f-message">${c.t(F + '.message')}</label><textarea id="f-message" name="message" rows="6" required></textarea></div>
    <p class="mention-donnees">${c.tb(F + '.donnees')}</p>
    <button type="submit" class="bouton">${c.t(F + '.envoyer')}</button>
    <p data-message-envoi role="status" tabindex="-1" hidden></p>
  </form>
</section>

<section class="acces conteneur" id="acces">
  <div class="acces-texte">
    <h2 data-anime>${c.t('contact.acces.titre')}</h2>
    <p data-anime>${c.t('contact.acces.texte')}</p>
    <address class="acces-adresse" data-anime>${c.site.nom}<br>${c.site.contact.rue}<br>${c.site.contact.ville}<br>${c.site.contact.pays}</address>
    <p data-anime>${c.t('contact.acces.horaires')}</p>
    <p data-anime><a class="bouton bouton--contour" href="${carte}" target="_blank" rel="noopener">${c.t('contact.acces.ouvrir')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></p>
  </div>
  ${plan(c)}
</section>
`;
};
