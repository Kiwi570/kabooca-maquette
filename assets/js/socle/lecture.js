/* Pages longues : barre de lecture [data-barre-lecture] et sommaire qui suit la lecture [data-sommaire].
   La barre ne lit que window.scrollY et la hauteur gardée : aucune mesure pendant le défilement. */
import { mesures } from './mesures.js?v=2';

export function initLecture() {
  const barre = document.querySelector('[data-barre-lecture]');
  if (barre) {
    let raf = 0;
    const maj = () => {
      raf = 0;
      const max = Math.max(1, mesures.pageH - window.innerHeight);
      barre.style.transform = `scaleX(${Math.min(1, window.scrollY / max)})`;
    };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(maj); }, { passive: true });
    maj();
  }
  const sommaire = document.querySelector('[data-sommaire]');
  if (sommaire) {
    const liens = new Map();
    sommaire.querySelectorAll('a[href^="#"]').forEach((a) => {
      const c = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (c) liens.set(c, a);
    });
    const ordre = [...liens.keys()];
    const marquer = (a) => { sommaire.querySelectorAll('[aria-current]').forEach((x) => x.removeAttribute('aria-current')); if (a) a.setAttribute('aria-current', 'location'); };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const a = liens.get(e.target);
      if (e.isIntersecting) marquer(a);
      /* En remontant, la section active repasse sous la bande : la précédente reprend la main,
         et avant la première section, aucune rubrique n'est signalée. */
      else if (a.hasAttribute('aria-current') && e.rootBounds && e.boundingClientRect.top > e.rootBounds.top) {
        const i = ordre.indexOf(e.target);
        marquer(i > 0 ? liens.get(ordre[i - 1]) : null);
      }
    }), { rootMargin: '-30% 0px -60% 0px' });
    liens.forEach((_, c) => io.observe(c));
  }
}
