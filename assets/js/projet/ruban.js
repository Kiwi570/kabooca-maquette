/* Ruban qui accélère : le bandeau « SUR MESURE • PERSONNALISÉ • KABOOÇA » défile tout seul, accélère avec le
   défilement de la page, change de sens quand on remonte et s'incline avec la vitesse, puis reprend son allure.
   Boucle du socle (arrêtée hors écran, onglet caché, mode calme) ; le bouton Pause l'arrête. */
import { boucle, etat } from '../socle/index.js?v=2';

export function initRuban() {
  const ruban = document.querySelector('[data-ruban]');
  const p = ruban && ruban.querySelector('p');
  if (!p || etat.calme) return;
  ruban.removeAttribute('data-boucle-css');
  p.classList.add('ruban-js');
  let periode = 0;
  const mesurer = () => { periode = p.scrollWidth / 2; };
  mesurer();
  window.addEventListener('resize', mesurer);
  document.fonts && document.fonts.ready.then(mesurer);
  let x = 0, sens = 1, vitesse = 0, y = window.scrollY, t = performance.now(), incl = 0, ecrit = '';
  window.addEventListener('scroll', () => {
    const n = performance.now(), ny = window.scrollY;
    const v = ((ny - y) / Math.max(8, n - t)) * 1000;
    y = ny; t = n;
    if (Math.abs(v) > 30) sens = v > 0 ? 1 : -1;
    vitesse = Math.max(vitesse, Math.min(2400, Math.abs(v) * 0.9));
  }, { passive: true });
  boucle(ruban, (dt) => {
    if (!periode) return;
    vitesse *= Math.exp(-dt * 2.4);
    x -= sens * (55 + vitesse) * dt;
    if (x <= -periode) x += periode;
    if (x > 0) x -= periode;
    incl += (sens * Math.min(10, vitesse / 120) - incl) * (1 - Math.exp(-dt * 8));
    const val = `translate3d(${x.toFixed(1)}px,0,0) skewX(${(-incl).toFixed(2)}deg)`;
    if (val !== ecrit) { p.style.transform = val; ecrit = val; }
  });
}
