/* Politique de confidentialité : à compléter (RGPD). */
import { legale } from '../gabarits/legal.mjs';

export const page = { cle: 'confidentialite', fichier: 'confidentialite', imagePartage: 'grok/confidentialite-ouverture-1168.webp', sansAction: true };
export default (c) => legale(c, { prefixe: 'confidentialite', sections: ['responsable', 'donnees', 'finalites', 'duree', 'navigateur', 'droits'], image: 'grok/confidentialite-ouverture', cadrage: '50% 40%' });
