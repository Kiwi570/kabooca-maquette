/* Nuancier qui recolore : dans le pied de page, les cinq cuirs du nuancier s'ouvrent en éventail autour de
   leur rivet quand il arrive à l'écran ; en choisir un donne sa couleur à tout le site (coutures, surtitres,
   fil, aiguille…), avec un passage en cercle depuis la lame touchée (View Transitions quand le navigateur
   les connaît, sinon changement direct). Le choix est gardé pour les autres pages (appliqué avant le premier
   affichage par le script critique). Mode calme : éventail ouvert, changement direct. */
import { etat } from '../socle/index.js?v=2';
import { local, annoncer, textes } from './outils.js?v=2';

const html = document.documentElement;

export function appliquerAccent(cle, depuis) {
  const changer = () => { if (cle === 'orange') delete html.dataset.accent; else html.dataset.accent = cle; };
  if (etat.calme || !document.startViewTransition || !depuis) { changer(); return; }
  const r = Math.hypot(Math.max(depuis.x, innerWidth - depuis.x), Math.max(depuis.y, innerHeight - depuis.y));
  let vt;
  try { vt = document.startViewTransition(changer); } catch { changer(); return; }
  vt.ready.then(() => {
    html.animate({ clipPath: [`circle(0px at ${depuis.x}px ${depuis.y}px)`, `circle(${r}px at ${depuis.x}px ${depuis.y}px)`] },
      { duration: 750, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' });
  }).catch(() => {});
}

export function initNuancier() {
  const eventails = document.querySelectorAll('[data-eventail]');
  if (!eventails.length) return;
  const actuel = () => html.dataset.accent || 'orange';
  const noms = textes().teintes || {};
  const maj = (cle = actuel()) => eventails.forEach((ev) => ev.querySelectorAll('[data-accent-choix]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.accentChoix === cle))));
  maj();
  eventails.forEach((ev) => {
    if (etat.calme) ev.classList.add('ouvert');
    else {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { ev.classList.add('ouvert'); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' });
      io.observe(ev);
    }
    ev.addEventListener('click', (e) => {
      const b = e.target.closest('[data-accent-choix]');
      if (!b) return;
      const cle = b.dataset.accentChoix;
      if (cle === actuel()) return;
      const r = b.getBoundingClientRect();
      appliquerAccent(cle, { x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2 });
      local.ecrire('kabooca:accent', cle);
      maj(cle);
      annoncer(`${ev.dataset.prefixeAnnonce || ''} ${(noms[cle] && noms[cle].nom) || cle}`.trim());
    });
  });
}
