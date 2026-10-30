/* Page 404 « Point sauté », aux couleurs de Kabooça. */
import { html } from '../../outils/gabarit.mjs';
import { pageTete } from '../gabarits/elements.mjs';

export const page = { cle: '404', fichier: '404', partage: false };

export default (c) => pageTete(c, {
  surtitre: c.t('introuvable.surtitre'),
  titre: c.t('introuvable.titre'),
  texte: c.t('introuvable.texte'),
  action: html`${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })} ${c.lien('boutique', { classe: 'bouton bouton--contour', texte: c.t('introuvable.boutique') })}`,
  media: c.media({ nom: 'grok/404-ouverture', alt: c.s('introuvable.alt'), cadrage: '45% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 50vw' }),
  classe: 'introuvable',
});
