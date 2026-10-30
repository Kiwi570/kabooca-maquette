/* Atelier sur mesure : configurateur en quatre étapes (modèle, couleurs, marquage, coordonnées),
   croquis recoloré en direct, récapitulatif fixe sur grand écran, demande simulée, FAQ.
   Les choix arrivent préremplis par l'adresse (?modele=…&corps=…&sangle=…&initiales=…). */
import { html, brut } from '../../outils/gabarit.mjs';
import { croquis } from '../gabarits/croquis.mjs';
import { pageTete, surtitre } from '../gabarits/elements.mjs';

export const page = { cle: 'sur-mesure', fichier: 'sur-mesure', imagePartage: 'grok/sur-mesure-ouverture-1168.webp' };

const TYPES = ['besace', 'accessoires', 'sac-a-dos', 'patron'];

export default (c) => {
  const K = 'surMesure.configurateur';
  const t = (k, v) => c.t(`${K}.${k}`, v);
  const modeles = [...c.donnees.catalogue.filter((p) => p.fiche), { cle: 'autre', croquis: 'patron', nom: c.s(`${K}.autre`), accroche: c.s(`${K}.autreTexte`) }];
  const nuancier = (nom, defaut, legende) => html`<fieldset class="nuancier"><legend>${legende}</legend><div class="pastilles">${c.donnees.teintes.map((x) => html`<label class="pastille" style="--teinte:${x.hex}"><input type="radio" name="${nom}" value="${x.cle}" data-teinte="${x.hex}"${x.cle === defaut ? brut(' checked') : ''}><span class="pastille-rond" aria-hidden="true"></span><span class="pastille-nom">${x.nom}</span></label>`)}</div></fieldset>`;
  return html`
${pageTete(c, {
  surtitre: c.t('surMesure.tete.surtitre'),
  titre: c.t('surMesure.tete.titre'),
  texte: c.t('surMesure.tete.texte'),
  action: html`<a class="bouton" href="#configurateur" data-action-principale data-magnetique>${c.t('surMesure.tete.action')}</a>`,
  info: c.t('surMesure.tete.info'),
  media: c.media({ nom: 'grok/sur-mesure-ouverture', alt: c.s('surMesure.tete.alt'), cadrage: '72% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 50vw' }),
})}

<section class="patron-scene" id="du-patron-au-sac" data-patron>
  <div class="conteneur patron-grille">
    <div class="patron-texte">
      ${surtitre(c.t('surMesure.patron.surtitre'), 'data-anime')}
      <h2 data-anime>${c.t('surMesure.patron.titre')}</h2>
      <p data-anime>${c.t('surMesure.patron.texte')}</p>
      <ol class="patron-etapes" data-anime>${['tracer', 'decouper', 'assembler', 'fermer'].map((k, i) => html`<li data-etape-patron="${i}"><span class="patron-etape-num" aria-hidden="true">${i + 1}</span>${c.t('surMesure.patron.' + k)}</li>`)}</ol>
      <p class="patron-note" data-anime>${c.t('surMesure.patron.note')}</p>
      <p class="actions" data-anime><a class="lien-fleche" href="#configurateur">${c.t('surMesure.patron.action')}</a> <button type="button" class="bouton bouton--contour bouton--petit js-seul" data-patron-rejouer hidden>${c.t('surMesure.patron.rejouer')}</button></p>
    </div>
    <div class="patron-vue" data-visuel data-superpose aria-hidden="true">
      <div class="patron-feuille"></div>
      <div class="patron-ombre"></div>
      <div class="patron-camera">
        ${brut(`<svg class="patron-trace" viewBox="-0.3 -0.3 35.6 55.1" focusable="false">
          <path d="M0 0 H5.5 V17 H0 Z"/><path d="M5.5 0 H29.5 V17 H5.5 Z"/><path d="M29.5 0 H35 V17 H29.5 Z"/>
          <path d="M5.5 17 H29.5 V22.5 H5.5 Z"/><path d="M5.5 22.5 H29.5 V39.5 H5.5 Z"/><path d="M5.5 39.5 H29.5 V45 H5.5 Z"/>
          <path d="M5.5 45 H29.5 V50 Q29.5 52.6 26.6 53 L19 54.2 Q17.5 54.5 16 54.2 L8.4 53 Q5.5 52.6 5.5 50 Z"/>
        </svg>`)}
        <div class="pp pp-avant">
          <span class="pp-nom">${c.t('surMesure.patron.avant')}</span>
          <div class="pp pp-souf-g"><span class="pp-nom">${c.t('surMesure.patron.soufflet')}</span></div>
          <div class="pp pp-souf-d"><span class="pp-nom">${c.t('surMesure.patron.soufflet')}</span></div>
          <div class="pp pp-fond"><span class="pp-nom">${c.t('surMesure.patron.fond')}</span>
            <div class="pp pp-dos"><span class="pp-nom">${c.t('surMesure.patron.dos')}</span>
              <div class="pp pp-dessus"><span class="pp-nom">${c.t('surMesure.patron.dessus')}</span>
                <div class="pp pp-rabat"><span class="pp-nom">${c.t('surMesure.patron.rabat')}</span><span class="pp-pastille"><span data-initiales-patron></span></span></div>
              </div>
            </div>
          </div>
          <span class="pp-anse"></span>
        </div>
      </div>
      <span class="badge-croquis">${c.t('surMesure.patron.badge')}</span>
    </div>
  </div>
</section>

<section class="configurateur" id="configurateur">
  <div class="conteneur config-grille">
    <form class="config-form" data-formulaire data-configurateur action="#" novalidate>
      <h2>${t('titre')}</h2>
      <ol class="config-etapes" aria-label="${c.s(`${K}.etapes`)}">
        ${[1, 2, 3, 4].map((n) => html`<li data-indicateur-pas="${n}"><span class="config-etape-num" aria-hidden="true">${n}</span>${t('e' + n)}</li>`)}
      </ol>
      <p class="config-etape-n js-seul" data-etape-n aria-live="polite">${t('etape', { n: 1 })}</p>
      <div class="config-pas" data-pas-conteneur>
        <fieldset class="config-bloc" data-pas="1">
          <legend>${t('e1')}</legend>
          <p class="config-aide">${t('e1Texte')}</p>
          <div class="modeles">${modeles.map((m, i) => html`<label class="modele"><input type="radio" name="modele" value="${m.cle}" data-croquis-type="${m.croquis}"${i === 0 ? brut(' checked') : ''}><span class="modele-croquis">${croquis(c, m.croquis, { decoratif: true })}</span><span class="modele-nom">${m.nom}</span><span class="modele-texte">${m.accroche}</span></label>`)}</div>
        </fieldset>
        <fieldset class="config-bloc" data-pas="2">
          <legend>${t('e2')}</legend>
          <p class="config-aide">${t('e2Texte')}</p>
          ${nuancier('corps', 'vert', t('corps'))}
          ${nuancier('sangle', 'orange', t('sangle'))}
          ${nuancier('fil', 'ivoire', t('fil'))}
          <p class="config-note">${c.t('commun.teintesExemple')}</p>
        </fieldset>
        <fieldset class="config-bloc" data-pas="3">
          <legend>${t('e3')}</legend>
          <p class="config-aide">${t('e3Texte')}</p>
          <div class="config-marquage">
            <div>
              <div class="champ champ--court"><label for="c-initiales">${t('initiales')}</label><input id="c-initiales" name="initiales" maxlength="3" autocomplete="off" spellcheck="false" aria-describedby="c-initiales-aide" data-initiales-champ><p class="champ-aide" id="c-initiales-aide">${t('initialesAide')}</p></div>
              <div class="champ"><label for="c-idee">${t('idee')}</label><textarea id="c-idee" name="idee" rows="3"></textarea></div>
            </div>
            ${c.media({ nom: 'grok/sur-mesure-marquage', alt: c.s(`${K}.altMarquage`), cadrage: '50% 50%', classe: 'config-marquage-media', sizes: '(max-width: 760px) 40vw, 16vw' })}
          </div>
        </fieldset>
        <fieldset class="config-bloc" data-pas="4">
          <legend>${t('e4')}</legend>
          <p class="config-aide">${t('e4Texte')}</p>
          <div class="champs-deux">
            <div class="champ"><label for="c-prenom">${t('prenom')}</label><input id="c-prenom" name="prenom" autocomplete="given-name" required></div>
            <div class="champ"><label for="c-nom">${t('nom')}</label><input id="c-nom" name="nom" autocomplete="family-name" required></div>
          </div>
          <div class="champs-deux">
            <div class="champ"><label for="c-email">${t('email')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="c-tel">${t('tel')}</label><input id="c-tel" name="tel" type="tel" autocomplete="tel"></div>
          </div>
          <div class="champ"><label for="c-message">${t('message')}</label><textarea id="c-message" name="message" rows="4"></textarea></div>
          <p class="config-note config-note--retractation">${t('retractation')}</p>
          <p class="mention-donnees">${c.tb(`${K}.donnees`)}</p>
        </fieldset>
      </div>
      <p class="config-nav">
        <button type="button" class="bouton bouton--contour js-seul" data-precedent>${t('precedent')}</button>
        <button type="button" class="bouton js-seul" data-suivant>${t('suivant')}</button>
        <button type="submit" class="bouton" data-envoyer>${t('envoyer')}</button>
      </p>
      <p data-message-envoi data-texte="${c.s(`${K}.envoye`)}" role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="config-recap" aria-labelledby="recap-titre">
      <div class="config-recap-colle">
        <h3 id="recap-titre">${t('recap')}</h3>
        <div class="config-croquis" data-config-croquis>
          ${TYPES.map((ty, i) => html`<div class="config-croquis-type" data-type="${ty}"${i ? brut(' hidden') : ''}>${croquis(c, ty, { classe: 'couche couche-dessous croquis--couleur', decoratif: i > 0 })}${croquis(c, ty, { classe: 'couche couche-dessus croquis--couleur', decoratif: true })}</div>`)}
          <span class="badge-croquis">${c.t('commun.croquisCourt')}</span>
        </div>
        <dl class="recap-liste">
          <div><dt>${t('recapModele')}</dt><dd data-recap="modele">${modeles[0].nom}</dd></div>
          <div><dt>${t('recapCouleurs')}</dt><dd data-recap="couleurs">${t('corps')} : ${c.donnees.teintes[1].nom} · ${t('sangle')} : ${c.donnees.teintes[3].nom} · ${t('fil')} : ${c.donnees.teintes[0].nom}</dd></div>
          <div><dt>${t('recapMarquage')}</dt><dd data-recap="marquage">${t('recapAucun')}</dd></div>
        </dl>
      </div>
    </aside>
  </div>
</section>

<section class="faq conteneur" id="questions">
  <div class="faq-liste">
    ${surtitre(c.t('surMesure.tete.surtitre'), 'data-anime')}
    <h2 data-anime>${c.t('surMesure.faq.titre')}</h2>
    ${c.donnees['faq-sur-mesure'].map((f, i) => html`<details class="faq-item" id="question-${i + 1}" data-anime><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}
    <div class="faq-apres" data-anime>
      <p class="faq-apres-titre">${c.t('surMesure.faq.apres')}</p>
      <p>${c.t('surMesure.faq.apresTexte')}</p>
      <p class="actions">${c.lien('contact', { ancre: 'formulaire', params: 'sujet=sur-mesure', classe: 'bouton', texte: c.t('commun.ecrire') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a></p>
    </div>
  </div>
  ${c.media({ nom: 'grok/sur-mesure-couleurs', alt: c.s(`${K}.altCouleurs`), cadrage: '40% 55%', classe: 'faq-media', sizes: '(max-width: 760px) 100vw, 34vw' })}
</section>
`;
};
