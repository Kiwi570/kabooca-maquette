/* Gabarit commun de Kabooça : head, logo, panneau d'ouverture (intro cousue), voile, en-tête, menu,
   pied de page, barre fixe du téléphone, panier en tiroir.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README du socle). */
import { readFileSync } from 'node:fs';
import { html, brut } from '../../outils/gabarit.mjs';
import { croquis } from './croquis.mjs';

const LOGO = JSON.parse(readFileSync(new URL('./logo-traces.json', import.meta.url), 'utf8'));
const boite = (b, m = 0) => `${(b[0] - m).toFixed(1)} ${(b[1] - m).toFixed(1)} ${(b[2] - b[0] + 2 * m).toFixed(1)} ${(b[3] - b[1] + 2 * m).toFixed(1)}`;
const VB_EMBLEME = boite(LOGO.embleme.boite, 2);
/* L'emblème en trois parties pour la cigale qui bat des ailes : corps (tête, thorax, abdomen), aile gauche, aile droite. */
const SOUS = LOGO.embleme.d.split(/(?=M)/).filter((x) => x.trim());
const CORPS = [0, 1, 4].map((i) => SOUS[i]).join(' ');
const [AILE_G, AILE_D] = [SOUS[2], SOUS[3]];
/* Pivots des ailes (pointe haute), dans le repère du <svg> extérieur (viewBox 0 0 w h). */
const [X0, Y0] = VB_EMBLEME.split(' ').map(Number);
const PIVOT_G = [235.8 - X0, 47.2 - Y0], PIVOT_D = [342.3 - X0, 45.3 - Y0];
const VB_MOT = boite(LOGO.mot.boite, 1);

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));

/* Textes lus par le JavaScript du projet : un seul bloc JSON, tiré de donnees/textes. */
function textesJs(c) {
  const cles = ['panier', 'visionneuse'];
  const o = {};
  for (const k of cles) o[k] = c.objet(k);
  o.catalogue = c.objet('boutique.catalogue');
  o.configurateur = c.objet('surMesure.configurateur');
  o.eclatee = c.objet('accueil.eclatee');
  o.croquis = c.objet('croquis.pieces');
  o.produits = Object.fromEntries(c.donnees.catalogue.map((p) => [p.cle, { nom: p.nom, croquis: p.croquis, categorie: p.categorie, fiche: p.fiche ? c.url(p.cle) : null }]));
  o.teintes = Object.fromEntries(c.donnees.teintes.map((t) => [t.cle, { nom: t.nom, hex: t.hex }]));
  return JSON.stringify(o).replace(/</g, '\\u003c');
}

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
<script type="application/json" id="textes-js">${brut(textesJs(c))}</script>
</head>`;
}

/* Tracés du logo, une seule fois par page, repris par <use>. */
function definitions() {
  return brut(`<svg class="definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<symbol id="logo-embleme" viewBox="${VB_EMBLEME}"><path fill-rule="evenodd" d="${LOGO.embleme.d}"/></symbol>
<symbol id="logo-corps" viewBox="${VB_EMBLEME}"><path fill-rule="evenodd" d="${CORPS}"/></symbol>
<symbol id="logo-aile-g" viewBox="${VB_EMBLEME}"><path fill-rule="evenodd" d="${AILE_G}"/></symbol>
<symbol id="logo-aile-d" viewBox="${VB_EMBLEME}"><path fill-rule="evenodd" d="${AILE_D}"/></symbol>
<symbol id="logo-mot" viewBox="${VB_MOT}"><path fill-rule="evenodd" d="${LOGO.mot.d}"/></symbol>
<path id="logo-traces" fill-rule="evenodd" d="${LOGO.embleme.d} ${LOGO.mot.d}"/>
</defs></svg>`);
}

/* Le <svg> extérieur a un viewBox d'origine 0 0 : le symbole fait lui-même sa mise à l'échelle. */
const taille = (vb) => { const [, , w, h] = vb.split(' '); return `0 0 ${w} ${h}`; };
export const logoEmbleme = (classe = 'logo-embleme') => brut(`<svg class="${classe}" viewBox="${taille(VB_EMBLEME)}" aria-hidden="true" focusable="false"><use href="#logo-embleme"/></svg>`);
/* Cigale aux ailes mobiles (en-tête, voile, pied) : chaque aile pivote autour de sa pointe haute. */
export const logoCigale = (classe = 'logo-embleme') => brut(`<svg class="${classe} cigale" viewBox="${taille(VB_EMBLEME)}" aria-hidden="true" focusable="false" style="--pivot-g:${PIVOT_G[0].toFixed(1)}px ${PIVOT_G[1].toFixed(1)}px;--pivot-d:${PIVOT_D[0].toFixed(1)}px ${PIVOT_D[1].toFixed(1)}px"><use class="aile aile-g" href="#logo-aile-g"/><use class="aile aile-d" href="#logo-aile-d"/><use href="#logo-corps"/></svg>`);
export const logoMot = (classe = 'logo-mot') => brut(`<svg class="${classe}" viewBox="${taille(VB_MOT)}" aria-hidden="true" focusable="false"><use href="#logo-mot"/></svg>`);

const icone = {
  recherche: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>'),
  panier: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 8h14l-1.2 12H6.2Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/><path class="icone-boucle" d="M10.2 13h3.6v3h-3.6Z"/></svg>'),
  fermer: brut('<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>'),
};

/* Panneau d'ouverture : le patron du logo est visible dès la première image ; pendant l'intro, l'aiguille
   court sur la couture, le fil pique le logo, puis la couture s'ouvre en deux rabats. */
function ouverture(c) {
  return html`<div class="ouverture-panneau" data-ouverture data-gouttiere="${c.site.couleurs.ouverture}" aria-hidden="true">
  <div class="ouv-moitie ouv-haut">
    <svg class="ouv-logo" viewBox="0 -6 580 432" focusable="false">
      <defs><clipPath id="ouv-revele"><rect class="ouv-revele" x="-10" y="-20" width="0" height="470"/></clipPath></defs>
      <use class="ouv-guide" href="#logo-traces"/>
      <use class="ouv-plein" href="#logo-traces"/>
      <g clip-path="url(#ouv-revele)"><use class="ouv-fil" href="#logo-traces"/></g>
    </svg>
    <span class="ouv-couture"></span>
  </div>
  <div class="ouv-moitie ouv-bas"><p class="ouv-ligne">${c.t('commun.slogan')}</p></div>
  <svg class="ouv-aiguille" viewBox="0 0 160 24" focusable="false"><path class="ouv-aiguille-fil" d="M0 12 H70"/><path class="ouv-aiguille-corps" d="M68 12 Q70 8.5 76 8.5 H150 L159 12 L150 15.5 H76 Q70 15.5 68 12 Z"/><rect class="ouv-aiguille-chas" x="76" y="10.6" width="16" height="2.8" rx="1.4"/></svg>
</div>`;
}

function voile(c) {
  /* Le voile est un rabat de cuir : lèvre arrondie et cousue sous le panneau, fermoir tourniquet qui se verrouille. */
  return html`<div data-voile aria-hidden="true">
  <span class="voile-levre"><span class="voile-levre-couture"></span></span>
  <div class="voile-contenu">${logoCigale('voile-embleme')}<span data-voile-libelle>${c.libelle(c.page.cle)}</span><span class="voile-couture"></span></div>
  <svg class="voile-fermoir" viewBox="0 0 64 64" focusable="false"><rect class="fermoir-plaque" x="4" y="10" width="56" height="44" rx="10"/><rect class="fermoir-fente" x="14" y="27" width="36" height="10" rx="5"/><circle class="fermoir-vis" cx="11" cy="17" r="2"/><circle class="fermoir-vis" cx="53" cy="17" r="2"/><circle class="fermoir-vis" cx="11" cy="47" r="2"/><circle class="fermoir-vis" cx="53" cy="47" r="2"/><g class="fermoir-tourne"><rect x="27" y="15" width="10" height="34" rx="5"/><circle cx="32" cy="32" r="3"/></g></svg>
</div>`;
}

function entete(c) {
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}" aria-label="${c.s('commun.accueilLogo')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>${logoCigale()}${logoMot()}</a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil').map((k) => html`<li>${c.lien(k, { classe: 'nav-lien' })}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      <a class="entete-icone entete-recherche" href="${c.url('boutique', 'recherche')}" data-libelle="${c.libelle('boutique')}">${icone.recherche}<span class="visuellement-cache">${c.t('commun.rechercher')}</span></a>
      <button type="button" class="entete-icone" data-panier-bouton aria-controls="panier" aria-expanded="false">${icone.panier}<span class="visuellement-cache">${c.t('commun.panierOuvrir')}</span><span class="panier-compte" data-panier-compte aria-hidden="true">0</span></button>
      <a class="bouton entete-action" href="${c.url(c.site.actionEntete.page, c.site.actionEntete.ancre)}" data-libelle="${c.libelle(c.site.actionEntete.page)}" data-magnetique>${c.t('commun.actionEntete')}</a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul class="menu-liens">${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
    <div class="menu-cote">
      <p><a class="bouton bouton--creme" href="${c.url(c.site.actionEntete.page, c.site.actionEntete.ancre)}" data-libelle="${c.libelle(c.site.actionEntete.page)}">${c.t('commun.actionEntete')}</a></p>
      <p><a class="menu-petit" href="${c.url('boutique', 'recherche')}" data-libelle="${c.libelle('boutique')}">${c.t('commun.rechercher')}</a></p>
      <p><a class="menu-petit" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
      <p><a class="menu-petit" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      <p><button type="button" class="lien menu-petit" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  const legales = ['mentions-legales', 'cgv', 'confidentialite'];
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div class="pied-marque">
      <a class="pied-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}" aria-label="${c.s('commun.accueilLogo')}">${logoCigale('pied-embleme')}${logoMot('pied-mot')}</a>
      <p class="pied-slogan">${c.t('commun.slogan')}<br>${c.t('commun.sloganSuite')}</p>
      <div class="eventail" data-eventail data-superpose role="group" aria-labelledby="eventail-titre" data-prefixe-annonce="${c.s('commun.nuancierAnnonce')}">
        <p class="pied-titre" id="eventail-titre">${c.t('commun.nuancierTitre')}</p>
        <div class="eventail-lames">
          ${c.donnees.teintes.map((t, i) => html`<button type="button" class="lame" style="--teinte:${t.hex};--i:${i}" data-accent-choix="${t.cle}" aria-pressed="false"><span class="lame-nom">${t.nom}</span></button>`)}
          <span class="eventail-rivet" aria-hidden="true"></span>
        </div>
        <p class="eventail-note">${c.t('commun.nuancierNote')}</p>
      </div>
    </div>
    <div>
      <p class="pied-titre">${c.t('commun.coordonnees')}</p>
      <p>${c.site.contact.rue}<br>${c.site.contact.ville}<br><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a><br><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.informations')}</p>
      <ul>${legales.map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
      <p class="pied-titre pied-titre--suite">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition data-retour-haut>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>© 2026 ${c.site.nom}</p></div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  <a class="bouton" href="${c.url(a.page, a.ancre)}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEntete')}</a>
</div>`;
}

function panier(c) {
  return html`<div class="panier" id="panier" data-panier data-recouvrement data-gouttiere="${c.site.couleurs.fond}" hidden>
  <div class="panier-fond" data-panier-fermer></div>
  <div class="panier-tiroir" role="dialog" aria-modal="true" aria-labelledby="panier-titre">
    <div class="panier-tete">
      <h2 id="panier-titre">${c.t('panier.titre')}</h2>
      <button type="button" class="panier-fermer" data-panier-fermer>${icone.fermer}<span class="visuellement-cache">${c.t('panier.fermer')}</span></button>
    </div>
    <ul class="panier-liste" data-panier-liste></ul>
    <div class="panier-vide" data-panier-vide>
      <p>${c.t('panier.vide')}</p>
      <p>${c.lien('boutique', { classe: 'bouton bouton--contour', texte: c.t('panier.voirBoutique') })}</p>
    </div>
    <div class="panier-pied" data-panier-pied>
      <p class="panier-total"><span>${c.t('panier.total')}</span><strong data-prix>${c.t('commun.aCompleter')}</strong></p>
      <p class="panier-note">${c.t('panier.noteTotal')}</p>
      <p class="panier-note">${c.t('panier.paiement')}</p>
      <button type="button" class="bouton panier-commander" data-panier-commander>${c.t('panier.commander')}</button>
    </div>
    <p class="panier-message" data-panier-message role="status" tabindex="-1" hidden></p>
  </div>
  <template data-croquis-modeles>${['besace', 'accessoires', 'sac-a-dos', 'patron'].map((t) => croquis(c, t, { decoratif: true, classe: 'panier-croquis' }))}</template>
</div>
<p class="visuellement-cache" aria-live="polite" data-annonce></p>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-page="${c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut">
${definitions()}
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
${panier(c)}
</body>
</html>`;
}
