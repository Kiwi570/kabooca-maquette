/* Aiguille et piqûres (ordinateur, souris) : le curseur devient une aiguille, pointe sur la position exacte
   de la souris, orientée selon le mouvement ; elle laisse derrière elle une ligne de points de couture qui
   s'efface en moins d'une seconde (canvas 2D plein écran, dessiné seulement tant qu'il reste des points).
   Sur un lien ou un bouton, l'aiguille pique (petit enfoncement) ; dans un champ de saisie, le curseur
   normal revient. Mode calme, tactile : rien. */
import { etat } from '../socle/index.js?v=2';
import { souris } from './outils.js?v=2';

const VIE = 850; /* ms */

export function initAiguille() {
  if (etat.calme || !souris()) return;
  const html = document.documentElement;
  const aig = document.createElement('div');
  aig.className = 'aiguille';
  aig.setAttribute('aria-hidden', 'true');
  aig.setAttribute('data-audit-ignorer', '');
  aig.innerHTML = '<svg viewBox="0 0 64 12" focusable="false"><path class="aiguille-corps" d="M0 6 L8 4.4 H54 Q60 4.4 61.5 6 Q60 7.6 54 7.6 H8 Z"/><rect class="aiguille-chas" x="47" y="5.1" width="9" height="1.8" rx=".9"/></svg>';
  const toile = document.createElement('canvas');
  toile.className = 'piqures';
  toile.setAttribute('aria-hidden', 'true');
  toile.setAttribute('data-audit-ignorer', '');
  document.body.append(toile, aig);
  const ctx = toile.getContext('2d');
  let dpr = 1, W = 0, H = 0;
  const taille = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    toile.width = Math.round(W * dpr); toile.height = Math.round(H * dpr);
  };
  taille();
  window.addEventListener('resize', taille);

  const points = []; /* { x, y, t, l } l : longueur cumulée (phase des points) */
  let x = -100, y = -100, angle = 0.85, cible = 0.85, raf = 0, cumul = 0, vu = false, pique = 0;
  const couleur = () => getComputedStyle(html).getPropertyValue('--orange').trim() || '#D2541E';
  let teinte = couleur();
  new MutationObserver(() => { teinte = couleur(); }).observe(html, { attributes: true, attributeFilter: ['data-accent'] });

  const dessiner = (t) => {
    raf = 0;
    while (points.length && t - points[0].t > VIE) points.shift();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (points.length > 1) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = teinte;
      ctx.setLineDash([6, 5]);
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        ctx.globalAlpha = Math.max(0, 1 - (t - b.t) / VIE) * 0.9;
        ctx.lineDashOffset = -a.l;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    /* Angle lissé vers la direction du mouvement ; au repos, l'aiguille revient pointe en haut à gauche. */
    let d = cible - angle;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    angle += d * 0.22;
    pique *= 0.82;
    aig.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad) translateX(${pique * 5}px)`;
    if (points.length > 1 || Math.abs(d) > 0.01 || pique > 0.02) raf = requestAnimationFrame(dessiner);
  };
  const relancer = () => { if (!raf) raf = requestAnimationFrame(dessiner); };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const nx = e.clientX, ny = e.clientY;
    if (!vu) { vu = true; html.classList.add('aiguille-active'); x = nx; y = ny; }
    const dx = nx - x, dy = ny - y, l = Math.hypot(dx, dy);
    /* La pointe est à gauche du dessin : l'aiguille avance pointe devant (angle du mouvement + demi-tour). */
    if (l > 2) cible = Math.atan2(dy, dx) + Math.PI;
    x = nx; y = ny;
    if (l > 0.5) { cumul += l; points.push({ x, y, t: performance.now(), l: cumul }); if (points.length > 90) points.shift(); }
    const cible2 = e.target.closest ? e.target : null;
    const champ = cible2 && cible2.closest('input, textarea, select, [contenteditable], iframe');
    aig.classList.toggle('aiguille-cachee', !!champ);
    aig.classList.toggle('aiguille-lien', !!(cible2 && cible2.closest('a, button, [role="button"], label, summary')));
    relancer();
  }, { passive: true });
  window.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') { pique = 1; relancer(); } }, { passive: true });
  document.addEventListener('pointerleave', () => aig.classList.add('aiguille-cachee'));
  document.addEventListener('pointerenter', () => aig.classList.remove('aiguille-cachee'));
  /* Au défilement, les points restent à l'écran : ils sont effacés pour ne pas flotter au-dessus du contenu. */
  window.addEventListener('scroll', () => { if (points.length) { points.length = 0; relancer(); } }, { passive: true });
}
