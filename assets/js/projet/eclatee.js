/* Vue éclatée (effet signature) : sur ordinateur, scène épinglée pilotée par le défilement ;
   le croquis se décompose en pièces numérotées, les cotes se tracent, puis il se réassemble aux couleurs
   choisies par le visiteur. Sur téléphone et écran bas : il s'éclate une fois à l'écran, un bouton le
   réassemble. En mode calme : éclaté, en couleurs, repères visibles, sans mouvement. */
import { etat } from '../socle/index.js?v=3';
import { local, teinte } from './outils.js?v=3';
import { variables, appliquer } from './croquis.js?v=3';

const ECART = {
  sangle: { y: -70 }, rabat: { y: -28 }, 'soufflet-g': { x: -45 }, 'soufflet-d': { x: 45 }, languettes: { y: 40 }, corps: {},
};

export function initEclatee() {
  const section = document.querySelector('.eclatee');
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (!section || !gsap) return;
  const cadre = section.querySelector('.eclatee-cadre');
  const couleur = section.querySelector('.eclatee-couleur');
  const pieces = (k) => section.querySelectorAll(`[data-piece="${k}"]`);
  const reperes = section.querySelectorAll('.eclatee-repere');
  const lignes = section.querySelectorAll('.eclatee-ligne');
  const ancres = section.querySelectorAll('.eclatee-ancre');
  const cotes = section.querySelector('[data-cotes]');
  const fin = section.querySelector('.eclatee-fin');
  const bascule = section.querySelector('[data-eclatee-bascule]');

  /* Couleurs essayées dans « Personnaliser » (mémorisées), sinon celles de la maquette. */
  /* Par défaut, cuir ivoire : le sac se détache du fond vert (et diffère de celui de « Personnaliser »). */
  const choix = local.lire('kabooca:teintes', null) || { corps: 'ivoire', sangle: 'orange', fil: 'graphite' };
  if (teinte(choix.corps)) appliquer(couleur, variables(choix));

  lignes.forEach((l) => { const n = l.getTotalLength ? l.getTotalLength() : 60; l.style.strokeDasharray = `${n} ${n}`; l.dataset.longueur = n; });

  const eclater = (tl, t, d = 0.8) => {
    Object.entries(ECART).forEach(([k, v]) => tl.fromTo(pieces(k), { x: 0, y: 0 }, { x: v.x || 0, y: v.y || 0, duration: d, ease: 'power3.inOut' }, t));
  };
  const assembler = (tl, t, d = 0.8) => {
    Object.keys(ECART).forEach((k) => tl.to(pieces(k), { x: 0, y: 0, duration: d, ease: 'power3.inOut' }, t));
  };
  const montrerReperes = (tl, t) => {
    tl.fromTo(lignes, { strokeDashoffset: (i, el) => el.dataset.longueur, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, t)
      .fromTo(ancres, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, t)
      .fromTo(reperes, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power1.out' }, t + 0.2)
      .fromTo(cotes, { opacity: 0 }, { opacity: 1, duration: 0.5 }, t + 0.5);
  };

  if (etat.calme) {
    Object.entries(ECART).forEach(([k, v]) => gsap.set(pieces(k), { x: v.x || 0, y: v.y || 0 }));
    return;
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1001px) and (min-height: 601px)', () => {
    if (!ST) return;
    const tl = gsap.timeline({
      defaults: { overwrite: false },
      scrollTrigger: { trigger: section, start: 'top top', end: '+=190%', pin: true, anticipatePin: 1, scrub: 0.8, invalidateOnRefresh: true },
    });
    tl.to({}, { duration: 0.2 });
    eclater(tl, 0.2, 1);
    montrerReperes(tl, 0.9);
    tl.to({}, { duration: 0.6 }, 1.6);
    tl.to([...reperes, ...lignes, ...ancres, cotes], { opacity: 0, duration: 0.4 }, 2.2);
    assembler(tl, 2.3, 1);
    tl.fromTo(couleur, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.inOut' }, 2.7)
      .fromTo(fin, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 3.1)
      .to({}, { duration: 0.4 }, 3.6);
    return () => tl.kill();
  });
  mm.add('(max-width: 1000px), (max-height: 600px)', () => {
    let eclate = false, tlCourante = null;
    gsap.set(fin, { opacity: 1 });
    const jouer = (versEclate) => {
      tlCourante && tlCourante.progress(1);
      const tl = gsap.timeline();
      if (versEclate) { eclater(tl, 0, 0.9); montrerReperes(tl, 0.55); tl.to(couleur, { opacity: 0, duration: 0.4 }, 0); }
      else { tl.to([...reperes, ...lignes, ...ancres, cotes], { opacity: 0, duration: 0.3 }, 0); assembler(tl, 0.15, 0.8); tl.to(couleur, { opacity: 1, duration: 0.6 }, 0.6); }
      tlCourante = tl;
      eclate = versEclate;
      if (bascule) bascule.textContent = versEclate ? bascule.dataset.libelleAssembler : bascule.dataset.libelleEclater;
    };
    const st = ST && ST.create({ trigger: cadre, start: 'top 75%', once: true, onEnter: () => jouer(true) });
    if (bascule) {
      bascule.hidden = false;
      bascule.onclick = () => jouer(!eclate);
    }
    return () => { st && st.kill(); if (bascule) { bascule.hidden = true; bascule.onclick = null; } };
  });
}
