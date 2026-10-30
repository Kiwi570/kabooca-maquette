/* Fiche de la création « sac-de-commandement » (gabarit commun : source/gabarits/fiche.mjs). */
import { fiche } from '../gabarits/fiche.mjs';

const f = fiche('sac-de-commandement');
export const page = f.meta;
export default f.rendu;
