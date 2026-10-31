/* Patron qui se plie (atelier sur mesure) : le patron d'une besace se trace sur la feuille, ses pièces se
   découpent et prennent le cuir, puis elles se plient en 3D (soufflets, fond, dos, dessus, rabat) jusqu'à
   former le sac, vu de trois quarts, sangle posée. Couleurs et initiales : celles du configurateur, en direct.
   Ordinateur : scène épinglée pilotée par le défilement. Téléphone et écran bas : jouée une fois à l'écran,
   bouton « Rejouer ». Mode calme et sans JavaScript : le sac assemblé (état final, posé par le CSS).
   Seules des variables CSS sont animées (aucune opacité ni découpe sur les pièces 3D, qui resteraient à plat). */
import { etat } from '../socle/index.js?v=3';
import { variables, appliquer } from './croquis.js?v=3';
import { local } from './outils.js?v=3';

const DEPART = { '--trace': 0, '--cuir': 0, '--plie-souf': 0, '--plie-fond': 0, '--plie-dos': 0, '--plie-dessus': 0, '--plie-rabat': 0, '--anse': 0, '--cam-y': 1, '--cam-s': 1, '--cam-rx': 0, '--cam-ry': 0, '--noms': 0 };

export function initPatron() {
  const scene = document.querySelector('[data-patron]');
  if (!scene) return;
  const vue = scene.querySelector('.patron-vue');
  const traits = [...scene.querySelectorAll('.patron-trace path')];
  const etapes = [...scene.querySelectorAll('[data-etape-patron]')];
  const rejouer = scene.querySelector('[data-patron-rejouer]');
  const gsap = window.gsap, ST = window.ScrollTrigger;

  /* Couleurs et initiales du configurateur (ou mémorisées depuis l'accueil). */
  const form = document.querySelector('[data-configurateur]');
  const lireCouleurs = () => {
    const v = (n, d) => (form && (form.querySelector(`input[name="${n}"]:checked`) || {}).value) || d;
    const memo = local.lire('kabooca:teintes', null) || {};
    return { corps: v('corps', memo.corps || 'vert'), sangle: v('sangle', memo.sangle || 'orange'), fil: v('fil', 'ivoire') };
  };
  const initiales = scene.querySelector('[data-initiales-patron]');
  const champ = form && form.querySelector('[data-initiales-champ]');
  const majCouleurs = () => appliquer(vue, variables(lireCouleurs()));
  const majInitiales = () => { if (initiales) initiales.textContent = (champ && champ.value || '').toUpperCase().replace(/[^A-ZÀ-ÖØ-Þ0-9]/g, '').slice(0, 3); };
  majCouleurs(); majInitiales();
  form && form.addEventListener('change', majCouleurs);
  champ && champ.addEventListener('input', majInitiales);

  if (etat.calme || !gsap) return;
  const marquer = (n) => etapes.forEach((e, i) => e.classList.toggle('en-cours', i === n));
  /* État de départ posé tout de suite (feuille vierge), avant toute lecture de la timeline. */
  gsap.set(vue, DEPART);
  traits.forEach((p) => { p.setAttribute('pathLength', '1'); p.style.strokeDashoffset = '1'; });
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
  traits.forEach((p) => { p.setAttribute('pathLength', '1'); });
  tl.set(vue, DEPART, 0)
    .call(() => marquer(0), null, 0)
    .fromTo(traits, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.07, ease: 'power1.inOut' }, 0)
    .to(vue, { '--noms': 1, duration: 0.4 }, 0.3)
    .call(() => marquer(1), null, 1.0)
    .to(vue, { '--cuir': 1, '--trace': 1, duration: 0.6 }, 1.0)
    .to(vue, { '--noms': 0, duration: 0.3 }, 1.4)
    .call(() => marquer(2), null, 1.6)
    .to(vue, { '--plie-souf': 1, duration: 0.6 }, 1.6)
    .to(vue, { '--plie-fond': 1, duration: 0.6 }, 1.95)
    .to(vue, { '--plie-dos': 1, duration: 0.6 }, 2.3)
    .to(vue, { '--plie-dessus': 1, duration: 0.5 }, 2.75)
    .call(() => marquer(3), null, 3.1)
    .to(vue, { '--plie-rabat': 1, duration: 0.6, ease: 'back.out(1.4)' }, 3.1)
    .to(vue, { '--cam-y': 0, '--cam-s': 1.45, '--cam-rx': 1, '--cam-ry': 1, duration: 2.1, ease: 'power2.inOut' }, 1.6)
    .to(vue, { '--anse': 1, duration: 0.5, ease: 'back.out(1.6)' }, 3.5)
    .to({}, { duration: 0.3 }, 4);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1001px) and (min-height: 601px)', () => {
    if (!ST) return;
    tl.progress(0);
    const st = ST.create({ trigger: scene, start: 'top top', end: '+=170%', pin: true, anticipatePin: 1, scrub: 0.8, animation: tl, invalidateOnRefresh: true });
    return () => { st.kill(); tl.progress(1); };
  });
  mm.add('(max-width: 1000px), (max-height: 600px)', () => {
    tl.progress(0);
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      tl.timeScale(1.1).play(0);
    }, { threshold: 0.45 });
    io.observe(vue);
    if (rejouer) { rejouer.hidden = false; rejouer.onclick = () => tl.timeScale(1.1).play(0); }
    return () => { io.disconnect(); if (rejouer) { rejouer.hidden = true; rejouer.onclick = null; } tl.progress(1); };
  });
}
