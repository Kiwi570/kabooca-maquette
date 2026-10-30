/* Mentions légales : fiche à fournir, éditeur, hébergeur vérifié, propriété intellectuelle, crédits. */
import { legale } from '../gabarits/legal.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/mentions-ouverture-1168.webp', sansAction: true };
export default (c) => legale(c, { prefixe: 'mentions', sections: ['fiche', 'editeur', 'hebergeur', 'propriete', 'credits', 'donnees'], image: 'grok/mentions-ouverture', cadrage: '50% 60%' });
