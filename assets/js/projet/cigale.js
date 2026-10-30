/* Cigale qui bat des ailes : la cigale de l'en-tête bat des ailes selon la vitesse de défilement, puis se pose
   (ailes refermées) quand le défilement s'arrête. Sa boucle ne tourne que pendant le battement.
   Sur le voile, elle bat des ailes pendant que le rabat tombe. Mode calme : immobile. */
import { etat, quand } from '../socle/index.js?v=2';

export function initCigale() {
  if (etat.calme) return;
  const ailes = (racine) => racine ? [racine.querySelector('.aile-g'), racine.querySelector('.aile-d')] : [];
  const [g, d] = ailes(document.querySelector('.entete-logo .cigale'));
  if (g && d) {
    let amp = 0, phase = 0, raf = 0, dernier = 0, yAvant = window.scrollY, tAvant = performance.now(), ecrit = '';
    const poser = (a) => {
      const s = a.toFixed(1);
      if (s === ecrit) return;
      ecrit = s;
      g.style.transform = `rotate(${s}deg)`;
      d.style.transform = `rotate(${-a}deg)`;
    };
    const tick = (t) => {
      const dt = Math.min(0.05, dernier ? (t - dernier) / 1000 : 1 / 60);
      dernier = t;
      amp *= Math.exp(-dt * 3.2);
      phase += dt * Math.PI * 2 * 7.5;
      /* Ailes écartées en moyenne, battement autour : jamais repliées dans le corps. */
      poser(amp * (0.55 + 0.45 * Math.sin(phase)));
      if (amp > 0.25) raf = requestAnimationFrame(tick);
      else { raf = 0; dernier = 0; amp = 0; poser(0); }
    };
    const relancer = () => { if (!raf && !etat.calme) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', () => {
      const t = performance.now(), y = window.scrollY;
      const v = Math.abs(y - yAvant) / Math.max(8, t - tAvant); /* px par ms */
      yAvant = y; tAvant = t;
      amp = Math.min(24, Math.max(amp, v * 9));
      if (amp > 1) relancer();
    }, { passive: true });
  }
  /* Voile : battement pendant la chute du rabat (WAAPI, sur l'emblème du voile). */
  quand('voile', () => {
    const [vg, vd] = ailes(document.querySelector('[data-voile] .cigale'));
    if (!vg || !vg.animate) return;
    const k = (s) => [0, 18, 4, 18, 4, 14, 0].map((a) => ({ transform: `rotate(${s * a}deg)` }));
    vg.animate(k(1), { duration: 620, easing: 'ease-in-out' });
    vd.animate(k(-1), { duration: 620, easing: 'ease-in-out' });
  });
}
