/* Catalogue : filtres par catégorie et recherche gardés dans l'adresse (?categorie=…&q=…),
   recherche sans accents, majuscules ni pluriels, passage en fondu sans moment vide,
   retour au début du catalogue s'il a raccourci au-dessus de l'écran. */
import { aller } from '../socle/index.js?v=2';
import { textes, remplir, calme } from './outils.js?v=2';

const normaliser = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean).map((m) => (m.length > 3 ? m.replace(/(s|x)$/, '') : m));

export function initCatalogue() {
  const zone = document.querySelector('[data-catalogue]');
  if (!zone) return;
  const T = textes().catalogue || {};
  const cartes = [...zone.querySelectorAll('[data-creation]')];
  const boutons = [...zone.querySelectorAll('[data-filtre]')];
  const champ = zone.querySelector('[data-recherche]');
  const resultat = zone.querySelector('[data-resultat]');
  const aucun = zone.querySelector('[data-aucun]');
  const mots = new Map(cartes.map((c) => [c, normaliser(c.dataset.mots)]));
  const params = new URLSearchParams(location.search);
  let categorie = params.get('categorie') || '';
  if (!boutons.some((b) => b.dataset.filtre === categorie && !b.disabled)) categorie = '';
  if (champ) champ.value = params.get('q') || '';
  let minuteur = 0;

  function correspond(c) {
    if (categorie && c.dataset.categorie !== categorie) return false;
    const q = normaliser(champ ? champ.value : '');
    if (!q.length) return true;
    const m = mots.get(c);
    return q.every((x) => m.some((y) => y.startsWith(x)));
  }

  function appliquer({ anime = true, ramener = true } = {}) {
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === categorie)));
    const haut = zone.getBoundingClientRect().top;
    const garder = cartes.filter(correspond);
    const partir = cartes.filter((c) => !garder.includes(c) && !c.hidden);
    const venir = garder.filter((c) => c.hidden);
    const fin = () => {
      partir.forEach((c) => { c.hidden = true; c.classList.remove('masquee'); });
      venir.forEach((c) => { c.hidden = false; c.classList.add('masquee'); });
      requestAnimationFrame(() => requestAnimationFrame(() => venir.forEach((c) => c.classList.remove('masquee'))));
      if (aucun) aucun.hidden = garder.length > 0;
      if (resultat) resultat.textContent = remplir(T.resultats, { n: garder.length, s: garder.length > 1 ? 's' : '' });
      if (ramener && haut < 0) aller(zone, { instant: calme() });
    };
    clearTimeout(minuteur);
    if (anime && !calme() && partir.length) { partir.forEach((c) => c.classList.add('masquee')); minuteur = setTimeout(fin, 230); }
    else fin();
    /* Adresse partageable. */
    const p = new URLSearchParams(location.search);
    categorie ? p.set('categorie', categorie) : p.delete('categorie');
    champ && champ.value.trim() ? p.set('q', champ.value.trim()) : p.delete('q');
    const s = p.toString();
    history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
  }

  boutons.forEach((b) => b.addEventListener('click', () => { categorie = b.dataset.filtre; appliquer(); }));
  let attente = 0;
  champ && champ.addEventListener('input', () => { clearTimeout(attente); attente = setTimeout(() => appliquer({ ramener: false }), 160); });
  champ && champ.addEventListener('search', () => appliquer({ ramener: false }));
  const effacer = zone.querySelector('[data-effacer]');
  effacer && effacer.addEventListener('click', () => { if (champ) champ.value = ''; categorie = ''; appliquer(); champ && champ.focus(); });
  appliquer({ anime: false, ramener: false });
  if (location.hash === '#recherche' && champ) requestAnimationFrame(() => champ.focus({ preventScroll: true }));
}
