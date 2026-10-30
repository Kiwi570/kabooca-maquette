/* Croquis en relief : chaque croquis devient un objet en couches. À la souris, il pivote en 3D et ses pièces
   se décalent selon leur profondeur (sangle au fond, rabat et languettes devant) ; au survol, le rabat de la
   besace s'ouvre en basculant au-dessus de sa charnière. Au doigt, le rabat s'entrouvre une fois quand le
   croquis arrive à l'écran. Seules deux variables CSS changent au mouvement. Mode calme : rien. */
import { etat } from '../socle/index.js?v=2';
import { souris } from './outils.js?v=2';

const EXCLUS = '.eclatee-croquis, .panier-croquis, .modele-croquis .croquis, .carte-croquis .croquis';

export function initRelief() {
  if (etat.calme) return;
  const croquis = [...document.querySelectorAll('main .croquis')].filter((s) => !s.matches(EXCLUS) && !s.closest('template'));
  if (!croquis.length) return;
  const zones = new Map();
  croquis.forEach((s) => {
    s.classList.add('en-relief');
    const zone = s.closest('.carte-ligne-visuel, .carte-creation, .fiche-visuel, .perso-croquis, .atelier-visuel, .appel-fin-visuel, .config-croquis') || s.parentElement;
    if (!zones.has(zone)) zones.set(zone, []);
    zones.get(zone).push(s);
  });
  if (souris()) {
    zones.forEach((liste, zone) => {
      let r = null, raf = 0, mx = 0, my = 0;
      const poser = () => { raf = 0; liste.forEach((s) => { s.style.setProperty('--mx', mx.toFixed(3)); s.style.setProperty('--my', my.toFixed(3)); }); };
      zone.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        r = zone.getBoundingClientRect();
        liste.forEach((s) => s.classList.add('rabat-ouvert', 'relief-actif'));
      });
      zone.addEventListener('pointermove', (e) => {
        if (!r || e.pointerType !== 'mouse') return;
        mx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        my = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        if (!raf) raf = requestAnimationFrame(poser);
      }, { passive: true });
      zone.addEventListener('pointerleave', () => {
        r = null; mx = 0; my = 0;
        if (!raf) raf = requestAnimationFrame(poser);
        liste.forEach((s) => s.classList.remove('rabat-ouvert', 'relief-actif'));
      });
    });
  } else {
    const besaces = croquis.filter((s) => s.querySelector('[data-piece="rabat"]'));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add('rabat-ouvert');
      setTimeout(() => e.target.classList.remove('rabat-ouvert'), 1300);
    }), { threshold: 0.7 });
    besaces.forEach((s) => io.observe(s));
  }
}
