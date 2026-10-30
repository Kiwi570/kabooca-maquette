/* Visionneuse des détails (fiches) : s'ouvre depuis la vignette, à la bonne taille ; flèches du clavier,
   glissement et Échap ; chaque vue a son lien (#detail-n) qui l'ouvre directement ; focus gardé puis rendu.
   Loupe compte-fils sur l'image affichée (souris seulement), éteinte à la fermeture. */
import { bloquerDefilement, debloquerDefilement, suivre, lacher, quand } from '../socle/index.js?v=1';
import { textes, remplir, souris, calme, garderFocus } from './outils.js?v=1';

let loupe = null;

function initLoupe(cible) {
  if (!souris() || calme()) return () => {};
  if (!loupe) { loupe = document.createElement('div'); loupe.className = 'loupe'; loupe.setAttribute('aria-hidden', 'true'); loupe.setAttribute('data-audit-ignorer', ''); document.body.appendChild(loupe); }
  const Z = 2.6;
  const bouger = (e) => {
    const img = e.target.closest && e.target.closest('img');
    if (!img || !cible.contains(img) || !img.naturalWidth) { loupe.classList.remove('visible'); return; }
    const r = img.getBoundingClientRect();
    const s = getComputedStyle(img);
    const nw = img.naturalWidth, nh = img.naturalHeight;
    const k = s.objectFit === 'contain' ? Math.min(r.width / nw, r.height / nh) : Math.max(r.width / nw, r.height / nh);
    const w = nw * k, h = nh * k;
    const [px, py] = (s.objectPosition || '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
    const ox = r.left + (r.width - w) * (isNaN(px) ? 0.5 : px), oy = r.top + (r.height - h) * (isNaN(py) ? 0.5 : py);
    const x = e.clientX - ox, y = e.clientY - oy;
    if (x < 0 || y < 0 || x > w || y > h) { loupe.classList.remove('visible'); return; }
    loupe.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    loupe.style.backgroundSize = `${w * Z}px ${h * Z}px`;
    loupe.style.backgroundPosition = `${-(x * Z - 84)}px ${-(y * Z - 84)}px`;
    loupe.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    loupe.classList.add('visible');
  };
  const sortir = () => loupe.classList.remove('visible');
  cible.addEventListener('pointermove', bouger, { passive: true });
  cible.addEventListener('pointerleave', sortir);
  return () => { cible.removeEventListener('pointermove', bouger); cible.removeEventListener('pointerleave', sortir); sortir(); };
}

export function initVisionneuse() {
  const fen = document.querySelector('[data-visionneuse-fenetre]');
  const liens = [...document.querySelectorAll('[data-visionneuse]')];
  if (!fen || !liens.length) return;
  const T = textes().visionneuse || {};
  const vues = [...fen.querySelectorAll('[data-vue]')];
  const position = fen.querySelector('[data-visionneuse-position]');
  let i = 0, ouvert = false, retour = null, relacher = null, eteindreLoupe = null;

  const montrer = (n, depuis) => {
    i = (n + vues.length) % vues.length;
    vues.forEach((v, k) => { v.hidden = k !== i; });
    if (position) position.textContent = remplir(T.position, { n: i + 1, total: vues.length });
    history.replaceState(history.state, '', location.pathname + location.search + '#detail-' + (i + 1));
    const media = vues[i].querySelector('.media');
    const gsap = window.gsap;
    if (gsap && !calme() && media) {
      if (depuis) {
        const a = depuis.getBoundingClientRect(), b = media.getBoundingClientRect();
        gsap.fromTo(media, { x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2), scale: Math.max(0.12, a.width / b.width), opacity: 0.6 },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
      } else gsap.fromTo(media, { opacity: 0 }, { opacity: 1, duration: 0.3, clearProps: 'opacity' });
    }
  };

  const ouvrir = (n, depuis) => {
    if (!ouvert) {
      ouvert = true;
      retour = depuis || document.activeElement;
      fen.hidden = false;
      bloquerDefilement('visionneuse');
      suivre(fen);
      relacher = garderFocus(fen);
      eteindreLoupe = initLoupe(fen);
    }
    montrer(n, depuis);
    fen.querySelector('[data-visionneuse-fermer]').focus({ preventScroll: true });
  };
  const fermer = () => {
    if (!ouvert) return;
    ouvert = false;
    fen.hidden = true;
    relacher && relacher();
    eteindreLoupe && eteindreLoupe();
    debloquerDefilement('visionneuse');
    lacher(fen);
    history.replaceState(history.state, '', location.pathname + location.search);
    const cible = liens[i] || retour;
    cible && cible.focus({ preventScroll: true });
  };

  liens.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); ouvrir(Number(a.dataset.visionneuse), a); }));
  fen.querySelector('[data-visionneuse-prec]').addEventListener('click', () => montrer(i - 1));
  fen.querySelector('[data-visionneuse-suiv]').addEventListener('click', () => montrer(i + 1));
  fen.querySelector('[data-visionneuse-fermer]').addEventListener('click', fermer);
  fen.addEventListener('click', (e) => { if (e.target === fen || e.target.classList.contains('visionneuse-vue')) fermer(); });
  document.addEventListener('keydown', (e) => {
    if (!ouvert) return;
    if (e.key === 'Escape') { e.preventDefault(); fermer(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); montrer(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); montrer(i - 1); }
  });
  let x0 = null;
  fen.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  fen.addEventListener('pointerup', (e) => { if (x0 == null) return; const d = e.clientX - x0; x0 = null; if (Math.abs(d) > 50) montrer(i + (d < 0 ? 1 : -1)); });

  /* Lien direct : #detail-n ouvre la vue n une fois la page prête. */
  const depuisAdresse = () => {
    const m = /^#detail-(\d+)$/.exec(location.hash);
    if (m && vues[Number(m[1]) - 1]) ouvrir(Number(m[1]) - 1, liens[Number(m[1]) - 1]);
  };
  quand('pret', depuisAdresse);
  window.addEventListener('hashchange', () => { if (!ouvert) depuisAdresse(); });
}
