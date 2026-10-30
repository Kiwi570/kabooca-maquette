/* Croquis : teintes (variables CSS), passage d'une teinte à l'autre en cercle depuis la pastille touchée,
   initiales brodées sur l'écusson, tracé qui se dessine sur la fiche. */
import { calme, teinte } from './outils.js?v=1';

const gsap = () => window.gsap;

/* { corps, sangle, fil } (clés du nuancier) -> variables CSS. */
export function variables(choix) {
  const v = {};
  const corps = teinte(choix.corps), sangle = teinte(choix.sangle), fil = teinte(choix.fil);
  if (corps) { v['--t-corps'] = corps; v['--t-rabat'] = corps; }
  if (sangle) v['--t-sangle'] = sangle;
  if (fil) v['--t-fil'] = fil;
  return v;
}

export function appliquer(el, vars) {
  if (!el) return;
  Object.entries(vars).forEach(([k, val]) => el.style.setProperty(k, val));
}

/* Deux couches identiques : la couche du dessus prend les nouvelles teintes et se découvre en cercle
   depuis le point touché ; la couche du dessous les prend ensuite. Seul clip-path est animé. */
export function changerTeintes(conteneur, vars, point) {
  if (!conteneur) return;
  const dessous = conteneur.querySelector('.couche-dessous');
  const dessus = conteneur.querySelector('.couche-dessus');
  if (!dessus || calme() || !gsap()) { appliquer(dessous, vars); appliquer(dessus, vars); return; }
  const r = conteneur.getBoundingClientRect();
  const x = point ? ((point.x - r.left) / r.width) * 100 : 50;
  const y = point ? ((point.y - r.top) / r.height) * 100 : 50;
  gsap().killTweensOf(dessus);
  appliquer(dessus, vars);
  gsap().fromTo(dessus, { clipPath: `circle(0% at ${x}% ${y}%)` }, {
    clipPath: `circle(150% at ${x}% ${y}%)`, duration: 0.75, ease: 'power2.inOut',
    onComplete: () => { appliquer(dessous, vars); gsap().set(dessus, { clipPath: `circle(0% at ${x}% ${y}%)` }); },
  });
}

/* Initiales sur l'écusson de toutes les couches, brodées point par point (contour pointillé puis plein). */
export function initiales(conteneur, texte) {
  if (!conteneur) return;
  const t = (texte || '').toUpperCase().replace(/[^A-ZÀ-ÖØ-Þ0-9]/g, '').slice(0, 3);
  conteneur.querySelectorAll('[data-initiales]').forEach((el) => {
    if (el.textContent === t) return;
    el.textContent = t;
    if (calme()) return;
    el.classList.remove('brode');
    void el.getBoundingClientRect();
    el.classList.add('brode');
  });
  return t;
}

/* Le croquis se dessine : traits puis coutures et aplats. L'état de départ (caché) est posé par le CSS. */
export function dessiner(svg, { delai = 0 } = {}) {
  if (!svg) return null;
  const g = gsap();
  const conteneur = svg.closest('[data-dessin]');
  if (!g || calme()) { conteneur && conteneur.classList.add('dessine'); return null; }
  const traits = [...svg.querySelectorAll('.c-trait')];
  const echelle = svg.getBoundingClientRect().width / 400 || 1;
  traits.forEach((el) => {
    let l = 0;
    try { l = el.getTotalLength(); } catch {}
    el.style.vectorEffect = 'none';
    el.style.strokeWidth = (1.8 / echelle).toFixed(3);
    el.style.strokeDasharray = `${l} ${l}`;
    el.style.strokeDashoffset = String(l);
  });
  const fills = svg.querySelectorAll('.c-corps, .c-rabat, .c-sangle, .c-ecusson, .c-feuille, .c-nuance');
  const details = svg.querySelectorAll('.c-fil, .c-boucle, .c-ombre, .c-grille');
  const tl = g.timeline({ delay: delai, onComplete: () => {
    traits.forEach((el) => { el.style.vectorEffect = ''; el.style.strokeWidth = ''; el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; });
  } });
  conteneur && conteneur.classList.add('dessine');
  tl.set(svg, { opacity: 1 })
    .fromTo(fills, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.6, stagger: 0.02, ease: 'power1.out' }, 0.7)
    .fromTo(traits, { strokeDashoffset: (i, el) => el.style.strokeDashoffset }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.035, ease: 'power2.inOut' }, 0)
    .fromTo(details, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.02 }, 0.9);
  return tl;
}
