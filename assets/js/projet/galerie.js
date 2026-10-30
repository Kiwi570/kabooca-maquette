/* Les quatre lignes : galerie horizontale épinglée sur ordinateur (barre de progression, arrêt en douceur
   sur chaque carte), glissement au doigt sur téléphone. Les croquis pendent à leur suspente et se balancent
   avec une physique de pendule (souris et vitesse de la galerie), calculée selon le temps écoulé. */
import { boucle, etat } from '../socle/index.js?v=2';
import { souris } from './outils.js?v=2';

export function initGalerie() {
  const section = document.querySelector('.collections');
  const piste = section && section.querySelector('.collections-piste');
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (!piste || !gsap || !ST || etat.calme) return;

  const pendules = [...section.querySelectorAll('[data-suspendu]')].map((el) => ({ el, a: 0, v: 0, ecrit: null }));
  let vitesse = 0;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px) and (min-height: 520px)', () => {
    piste.removeAttribute('tabindex');
    piste.removeAttribute('role');
    const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
    const barre = section.querySelector('.galerie-progres span');
    const cartes = [...piste.children];
    const tween = gsap.fromTo(piste, { x: 0 }, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: section, start: 'top top', end: () => '+=' + distance(), pin: true, anticipatePin: 1, scrub: 0.7, invalidateOnRefresh: true,
        snap: { snapTo: (p) => { const n = cartes.length - 1; return Math.round(p * n) / n; }, duration: { min: 0.2, max: 0.6 }, delay: 0.12, ease: 'power2.inOut' },
        onUpdate: (s) => { if (barre) barre.style.transform = `scaleX(${s.progress})`; vitesse = s.getVelocity(); },
      },
    });
    /* Une carte atteinte au clavier est ramenée à l'écran. */
    const focus = (e) => {
      const carte = e.target.closest('.carte-ligne');
      const st = tween.scrollTrigger;
      if (!carte || !st) return;
      const i = cartes.indexOf(carte);
      const y = st.start + (st.end - st.start) * (i / Math.max(1, cartes.length - 1));
      window.scrollTo({ top: y, behavior: 'instant' });
    };
    piste.addEventListener('focusin', focus);
    return () => { piste.setAttribute('tabindex', '0'); piste.setAttribute('role', 'region'); piste.removeEventListener('focusin', focus); };
  });

  /* Sur téléphone, la piste défile d'elle-même : sa vitesse fait balancer les croquis. */
  let dernierX = piste.scrollLeft, dernierT = performance.now();
  piste.addEventListener('scroll', () => {
    const t = performance.now();
    vitesse = ((piste.scrollLeft - dernierX) / Math.max(1, t - dernierT)) * -1000;
    dernierX = piste.scrollLeft; dernierT = t;
  }, { passive: true });

  if (souris()) {
    section.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const p = pendules.find((x) => x.el.parentElement.contains(e.target));
      if (p) p.v += e.movementX * 0.9;
    }, { passive: true });
  }

  boucle(section, (dt) => {
    const pousse = Math.max(-1, Math.min(1, vitesse / 2500));
    vitesse *= Math.exp(-dt * 6);
    pendules.forEach((p) => {
      /* Pendule amorti : raideur 26, amortissement 3,2, poussée de la galerie. */
      const acc = -26 * p.a - 3.2 * p.v + pousse * 60;
      p.v += acc * dt;
      p.a += p.v * dt;
      p.a = Math.max(-9, Math.min(9, p.a));
      const val = Math.abs(p.a) < 0.02 && Math.abs(p.v) < 0.02 ? 0 : p.a;
      const s = val.toFixed(2);
      if (s !== p.ecrit) { p.el.style.transform = `rotate(${s}deg)`; p.ecrit = s; }
    });
  });
}
