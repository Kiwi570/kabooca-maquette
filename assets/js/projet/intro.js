/* Intro cousue (environ 2,2 s), jouée à chaque arrivée et à chaque rechargement :
   0,05 s l'aiguille part sur la couture ; le fil pique le logo à mesure qu'elle passe ;
   0,95 s le logo se remplit ; 1,3 s la couture se tend ; 1,45 s elle s'ouvre en deux rabats ;
   1,55 s le premier écran de la page se met en place. Le patron du logo est visible dès la première image. */
import { dessiner } from './croquis.js?v=1';

const gsap = () => window.gsap;
let decoupes = [];

/* Titres de pages intérieures découpés en lignes (masque), puis rendus à leur texte d'origine
   à la fin de l'animation : ils se recomposent ensuite librement au redimensionnement. */
function lignesTitre(el) {
  const S = window.SplitText;
  if (!S || !el) return null;
  const d = S.create ? S.create(el, { type: 'lines', mask: 'lines', linesClass: 'ligne' }) : new S(el, { type: 'lines', linesClass: 'ligne' });
  decoupes.push(d);
  return d;
}

function rendreTitres() { decoupes.forEach((d) => { try { d.revert(); } catch {} }); decoupes = []; }

/* Premier écran propre à chaque page, ajouté à une timeline à l'instant t. */
function premierEcran(tl, t) {
  const g = gsap();
  const hero = document.querySelector('.hero');
  if (hero) {
    tl.fromTo('.hero-media img', { scale: 1.07 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, t - 0.15)
      .fromTo('.hero .surtitre', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', onStart: () => document.querySelector('.hero .surtitre').classList.add('vu') }, t)
      .fromTo('.hero-ligne', { yPercent: 112, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.11, ease: 'power4.out' }, t + 0.05)
      .fromTo('.hero-intro, .hero-actions, .hero-info', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out' }, t + 0.35);
    return;
  }
  const titre = document.querySelector('main h1.titre-decoupe');
  if (titre) {
    const d = lignesTitre(titre);
    g.set(titre, { opacity: 1 });
    if (d && d.lines && d.lines.length) {
      tl.fromTo(d.lines, { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', onComplete: rendreTitres }, t);
    } else {
      tl.fromTo(titre, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, t);
    }
  }
  const dessin = document.querySelector('.fiche-tete [data-dessin] .croquis');
  if (dessin) tl.add(() => dessiner(dessin), t + 0.1);
}

export function jouer() {
  const g = gsap();
  const p = document.querySelector('[data-ouverture]');
  if (!g || !p) return null;
  const haut = p.querySelector('.ouv-haut'), bas = p.querySelector('.ouv-bas');
  const revele = p.querySelector('.ouv-revele'), plein = p.querySelector('.ouv-plein');
  const couture = p.querySelector('.ouv-couture'), aiguille = p.querySelector('.ouv-aiguille');
  const logo = p.querySelector('.ouv-logo').getBoundingClientRect();
  const W = window.innerWidth;
  /* L'aiguille traverse en 1,05 s : le fil pique le logo pendant qu'elle passe au-dessous. */
  const debut = 0.05, duree = 1.05, depart = -160, arrivee = W + 40;
  const quand = (x) => debut + duree * ((x - depart) / (arrivee - depart));
  const tL = quand(logo.left), tR = quand(logo.right);
  const tl = g.timeline();
  tl.fromTo(aiguille, { x: depart }, { x: arrivee, duration: duree, ease: 'none' }, debut)
    .fromTo(couture, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: duree, ease: 'none' }, debut)
    .fromTo(revele, { attr: { width: 0 } }, { attr: { width: 600 }, duration: Math.max(0.2, tR - tL), ease: 'none' }, tL)
    .fromTo(plein, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, Math.min(tR, 1.05) - 0.1)
    .fromTo(haut, { yPercent: 0 }, { yPercent: -1.4, duration: 0.14, ease: 'power2.out' }, 1.3)
    .fromTo(bas, { yPercent: 0 }, { yPercent: 1.4, duration: 0.14, ease: 'power2.out' }, 1.3)
    .to(haut, { yPercent: -101, duration: 0.72, ease: 'power3.inOut' }, 1.45)
    .to(bas, { yPercent: 101, duration: 0.72, ease: 'power3.inOut' }, 1.45);
  premierEcran(tl, 1.62);
  return tl;
}

/* Arrivée par un lien interne : le premier écran se met en place pendant que le voile se retire. */
export function arrivee() {
  const g = gsap();
  if (!g) return;
  const tl = g.timeline();
  premierEcran(tl, 0.12);
}

/* État final (retour, calme, secours) : tout à sa place, sans animation. */
export function etatFinal() {
  const g = gsap();
  rendreTitres();
  if (!g) return;
  g.set('.hero-media img, .hero-ligne, .hero-intro, .hero-actions, .hero-info, .hero .surtitre, main h1.titre-decoupe', { clearProps: 'transform,opacity' });
  document.querySelectorAll('[data-dessin]').forEach((d) => d.classList.add('dessine'));
}
