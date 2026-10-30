/* Mètre ruban : un mètre de couturière court le long du bord droit de la page (vraies unités : 1 cm = 37,8 px
   CSS), gradué au centimètre et numéroté tous les 10 cm ; il défile avec la page. Un curseur fixe, au milieu
   du bord, lit la mesure en centimètres. Ordinateur et tablette (le bord manque sur téléphone). Le ruban est
   recalculé avec la page (ScrollTrigger), jamais pendant le défilement ; seule la lecture change. Mode calme :
   ruban affiché, lecture mise à jour sans animation. */
import { quand } from '../socle/index.js?v=2';

const CM = 96 / 2.54;

export function initMetre() {
  if (!matchMedia('(min-width: 761px)').matches) return;
  const ruban = document.createElement('div');
  ruban.className = 'metre';
  ruban.setAttribute('aria-hidden', 'true');
  ruban.setAttribute('data-audit-ignorer', '');
  const lecture = document.createElement('div');
  lecture.className = 'metre-lecture';
  lecture.setAttribute('aria-hidden', 'true');
  lecture.setAttribute('data-audit-ignorer', '');
  /* La lecture est dessinée par le CSS (::after, attribut data-valeur) : décor, hors des textes de la page. */
  lecture.dataset.valeur = '0';
  document.body.append(ruban, lecture);
  document.body.classList.add('porte-metre');
  let n = 0;
  const construire = () => {
    const H = document.documentElement.scrollHeight;
    const total = Math.floor(H / CM / 10);
    if (total === n) return;
    n = total;
    let h = '';
    for (let i = 1; i <= total; i++) h += `<span class="metre-nombre" style="top:${(i * 10 * CM).toFixed(1)}px">${i * 10}</span>`;
    ruban.innerHTML = h;
  };
  let ecrit = -1, raf = 0;
  const lire = () => {
    raf = 0;
    const v = Math.round((window.scrollY + window.innerHeight / 2) / CM);
    if (v !== ecrit) { lecture.dataset.valeur = v; ecrit = v; }
  };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(lire); }, { passive: true });
  quand('pret', () => {
    construire(); lire();
    if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', () => { construire(); lire(); });
    window.addEventListener('resize', construire);
  });
}
