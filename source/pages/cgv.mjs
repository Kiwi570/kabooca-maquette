/* Conditions générales de vente : trame à compléter, références légales vérifiées. */
import { legale } from '../gabarits/legal.mjs';

export const page = { cle: 'cgv', fichier: 'cgv', imagePartage: 'grok/cgv-ouverture-1168.webp', sansAction: true };
export default (c) => legale(c, { prefixe: 'cgv', sections: ['objet', 'prix', 'commande', 'paiement', 'livraison', 'retractation', 'personnalisees', 'garanties', 'mediation', 'droit'], image: 'grok/cgv-ouverture' });
