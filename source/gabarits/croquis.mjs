/* Croquis d'illustration des pièces, dessinés en SVG pour la maquette (en attendant les photos).
   Les couleurs se règlent par variables CSS sur le conteneur : --t-corps, --t-rabat, --t-sangle,
   --t-fil, --t-boucle, --t-ecusson, --trait. Chaque pièce porte une classe c-* et un groupe data-piece,
   lus par la vue éclatée et le configurateur. Aucun texte dans les dessins : les noms sont en HTML. */
import { brut } from '../../outils/gabarit.mjs';

const VB = '0 0 400 420';

/* Besace à rabat : sert aussi à la vue éclatée (groupes data-piece). */
function besace() {
  return `
  <ellipse class="c-ombre" cx="200" cy="366" rx="150" ry="9"/>
  <g data-piece="sangle">
    <path class="c-sangle c-trait" d="M66 186 C52 34 348 34 334 186 L318 186 C330 60 70 60 82 186 Z"/>
    <path class="c-fil" d="M74 184 C61 47 339 47 326 184"/>
    <rect class="c-boucle" x="61" y="176" width="26" height="16" rx="4"/>
    <rect class="c-boucle" x="313" y="176" width="26" height="16" rx="4"/>
  </g>
  <g data-piece="soufflet-g">
    <path class="c-corps c-trait" d="M58 196 L76 186 L76 356 L58 348 Z"/>
    <path class="c-fil" d="M64 200 L70 197 L70 350 L64 346"/>
  </g>
  <g data-piece="soufflet-d">
    <path class="c-corps c-trait" d="M342 196 L324 186 L324 356 L342 348 Z"/>
    <path class="c-fil" d="M336 200 L330 197 L330 350 L336 346"/>
  </g>
  <g data-piece="corps">
    <rect class="c-corps c-trait" x="76" y="186" width="248" height="170" rx="12"/>
    <rect class="c-fil" x="85" y="195" width="230" height="152" rx="7"/>
    <path class="c-sangle c-trait" d="M166 187 C166 152 234 152 234 187 L222 187 C222 166 178 166 178 187 Z"/>
  </g>
  <g data-piece="rabat">
    <path class="c-rabat c-trait" d="M76 198 Q76 186 88 186 H312 Q324 186 324 198 V282 Q324 296 310 298 L214 311 Q200 313 186 311 L90 298 Q76 296 76 282 Z"/>
    <path class="c-fil" d="M86 200 Q86 195 91 195 H309 Q314 195 314 200 V279 Q314 287 306 288 L212 301 Q200 303 188 301 L94 288 Q86 287 86 279 Z"/>
    <circle class="c-ecusson" cx="200" cy="244" r="25"/>
    <circle class="c-fil c-fil--ecusson" cx="200" cy="244" r="19"/>
    <text class="c-initiales" x="200" y="251" text-anchor="middle" data-initiales aria-hidden="true" data-audit-ignorer></text>
  </g>
  <g data-piece="languettes">
    <rect class="c-sangle c-trait" x="126" y="236" width="24" height="104" rx="4"/>
    <rect class="c-sangle c-trait" x="250" y="236" width="24" height="104" rx="4"/>
    <path class="c-fil" d="M138 242 V334 M262 242 V334"/>
    <rect class="c-boucle" x="119" y="276" width="38" height="24" rx="5"/>
    <rect class="c-boucle" x="243" y="276" width="38" height="24" rx="5"/>
    <path class="c-boucle" d="M138 276 V300 M262 276 V300"/>
  </g>`;
}

function accessoires() {
  return `
  <ellipse class="c-ombre" cx="200" cy="356" rx="150" ry="8"/>
  <g data-piece="porte-cartes">
    <rect class="c-corps c-trait" x="58" y="186" width="190" height="136" rx="14"/>
    <rect class="c-fil" x="67" y="195" width="172" height="118" rx="9"/>
    <path class="c-rabat c-trait" d="M58 228 H248 V306 Q248 322 232 322 H74 Q58 322 58 306 Z"/>
    <path class="c-trait c-vide" d="M110 228 Q153 252 196 228"/>
    <circle class="c-ecusson" cx="153" cy="282" r="22"/>
    <circle class="c-fil c-fil--ecusson" cx="153" cy="282" r="16"/>
    <text class="c-initiales c-initiales--petit" x="153" y="287" text-anchor="middle" data-initiales aria-hidden="true" data-audit-ignorer></text>
  </g>
  <g data-piece="porte-cles">
    <path class="c-boucle" d="M296 92 H330 Q346 92 346 108 Q346 124 330 124 H296 Z"/>
    <rect class="c-sangle c-trait" x="300" y="116" width="26" height="128" rx="6"/>
    <path class="c-fil" d="M306 124 V236 M320 124 V236"/>
    <path class="c-boucle" d="M313 244 V258 M302 258 H324 Q334 258 334 270 V316 Q334 342 313 342 Q292 342 292 316 V270 Q292 258 302 258 Z"/>
    <path class="c-boucle" d="M302 296 L322 276"/>
  </g>`;
}

function sacADos() {
  return `
  <ellipse class="c-ombre" cx="200" cy="378" rx="130" ry="8"/>
  <g data-piece="bretelles">
    <path class="c-sangle c-trait" d="M104 130 C72 170 74 270 100 352 L114 350 C92 276 92 182 120 138 Z"/>
    <path class="c-sangle c-trait" d="M296 130 C328 170 326 270 300 352 L286 350 C308 276 308 182 280 138 Z"/>
  </g>
  <g data-piece="corps">
    <path class="c-corps c-trait" d="M118 136 Q118 84 168 84 H232 Q282 84 282 136 V356 Q282 368 270 368 H130 Q118 368 118 356 Z"/>
    <path class="c-fil" d="M128 138 Q128 94 170 94 H230 Q272 94 272 138 V354 Q272 358 268 358 H132 Q128 358 128 354 Z"/>
    <path class="c-sangle c-trait" d="M176 85 C176 56 224 56 224 85 L214 85 C214 68 186 68 186 85 Z"/>
    <path class="c-fil" d="M136 150 Q200 124 264 150"/>
    <rect class="c-boucle" x="252" y="140" width="10" height="20" rx="3"/>
    <rect class="c-ecusson c-trait" x="168" y="164" width="64" height="44" rx="8"/>
    <rect class="c-fil c-fil--ecusson" x="174" y="170" width="52" height="32" rx="5"/>
    <text class="c-initiales" x="200" y="193" text-anchor="middle" data-initiales aria-hidden="true" data-audit-ignorer></text>
  </g>
  <g data-piece="poche">
    <rect class="c-rabat c-trait" x="138" y="226" width="124" height="122" rx="12"/>
    <rect class="c-fil" x="146" y="234" width="108" height="106" rx="8"/>
    <rect class="c-sangle c-trait" x="132" y="250" width="136" height="13" rx="2"/>
    <rect class="c-sangle c-trait" x="132" y="280" width="136" height="13" rx="2"/>
    <rect class="c-sangle c-trait" x="132" y="310" width="136" height="13" rx="2"/>
    <path class="c-fil" d="M158 250 V263 M182 250 V263 M206 250 V263 M230 250 V263 M254 250 V263 M158 280 V293 M182 280 V293 M206 280 V293 M230 280 V293 M254 280 V293 M158 310 V323 M182 310 V323 M206 310 V323 M230 310 V323 M254 310 V323"/>
  </g>
  <g data-piece="compression">
    <rect class="c-sangle c-trait" x="106" y="196" width="18" height="44" rx="3"/>
    <rect class="c-sangle c-trait" x="276" y="196" width="18" height="44" rx="3"/>
    <rect class="c-boucle" x="102" y="210" width="26" height="16" rx="4"/>
    <rect class="c-boucle" x="272" y="210" width="26" height="16" rx="4"/>
  </g>`;
}

function patron() {
  return `
  <ellipse class="c-ombre" cx="200" cy="370" rx="160" ry="8"/>
  <g data-piece="feuille">
    <rect class="c-feuille c-trait" x="54" y="70" width="292" height="292" rx="6"/>
    <path class="c-grille" d="M54 118 H346 M54 166 H346 M54 214 H346 M54 262 H346 M54 310 H346 M102 70 V362 M150 70 V362 M198 70 V362 M246 70 V362 M294 70 V362"/>
  </g>
  <g data-piece="pieces">
    <path class="c-corps c-trait" d="M80 100 H226 Q238 100 238 112 V176 Q238 188 226 190 L160 200 Q153 201 146 200 L92 190 Q80 188 80 176 Z"/>
    <path class="c-fil" d="M90 110 H224 Q228 110 228 114 V174 Q228 180 222 181 L159 190 Q153 191 147 190 L95 181 Q90 180 90 174 Z"/>
    <rect class="c-rabat c-trait" x="80" y="226" width="150" height="110" rx="4"/>
    <rect class="c-fil" x="90" y="236" width="130" height="90" rx="2"/>
    <path class="c-trait" d="M80 266 L90 272 L80 278 Z M230 266 L220 272 L230 278 Z"/>
    <path class="c-trait c-vide" d="M155 246 V316 M149 254 L155 246 L161 254 M149 308 L155 316 L161 308"/>
    <rect class="c-sangle c-trait" x="258" y="100" width="26" height="200" rx="3"/>
    <path class="c-fil" d="M264 108 V292 M278 108 V292"/>
  </g>
  <g data-piece="nuancier">
    <rect class="c-nuance n1 c-trait" x="276" y="292" width="76" height="26" rx="4" transform="rotate(-38 296 330)"/>
    <rect class="c-nuance n2 c-trait" x="276" y="292" width="76" height="26" rx="4" transform="rotate(-22 296 330)"/>
    <rect class="c-nuance n3 c-trait" x="276" y="292" width="76" height="26" rx="4" transform="rotate(-6 296 330)"/>
    <rect class="c-nuance n4 c-trait" x="276" y="292" width="76" height="26" rx="4" transform="rotate(10 296 330)"/>
    <rect class="c-nuance n5 c-trait" x="276" y="292" width="76" height="26" rx="4" transform="rotate(26 296 330)"/>
    <circle class="c-boucle" cx="296" cy="330" r="6"/>
  </g>`;
}

const DESSINS = { besace, accessoires, 'sac-a-dos': sacADos, patron };
const ALT = { besace: 'croquis.besace', accessoires: 'croquis.accessoires', 'sac-a-dos': 'croquis.sacADos', patron: 'croquis.patron' };

/** SVG du croquis `type`. `decoratif` : aria-hidden (le texte voisin le décrit déjà). */
export function croquis(c, type, { classe = '', decoratif = false } = {}) {
  const dessin = DESSINS[type] ? DESSINS[type]() : '';
  const etiquette = decoratif ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${c.s(ALT[type]).replace(/"/g, '&quot;')}"`;
  return brut(`<svg class="croquis croquis--${type} ${classe}" viewBox="${VB}" ${etiquette} data-croquis="${type}">${dessin}</svg>`);
}

/** Le type de croquis de chaque modèle du catalogue. */
export const typeCroquis = (cle, catalogue) => (catalogue.find((p) => p.cle === cle) || {}).croquis || 'patron';
