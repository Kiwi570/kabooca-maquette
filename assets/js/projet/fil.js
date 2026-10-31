/* Fil conducteur (accueil) : au défilement, une aiguille coud un fil orange le long de la page, dans la marge
   (jamais sur un texte), avec un détour dans l'espace libre au bas de chaque section. Le fil passe devant la
   photo d'ouverture, s'enfonce sous les sections épinglées et sous la photo du ruban (œillets aux points de
   piqûre), puis se noue près de la cigale du pied de page. L'aiguille se tient aux deux tiers de l'écran.
   Le tracé est calculé une fois (et à chaque recalcul de ScrollTrigger) ; pendant le défilement, seuls la
   découpe du fil et la position de l'aiguille changent (aucune mesure). Mode calme : fil entier, sans aiguille. */
import { etat, quand } from '../socle/index.js?v=3';

const NS = 'http://www.w3.org/2000/svg';
const TETE = 0.64;

export function initFil() {
  const hero = document.querySelector('.hero');
  if (!hero || document.documentElement.dataset.page !== 'accueil') return;
  document.body.classList.add('porte-fil');
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'fil-svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('data-audit-ignorer', '');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = `<defs><clipPath id="fil-decoupe"><rect class="fil-decoupe" x="0" y="0" width="0" height="0"/></clipPath></defs>
<g clip-path="url(#fil-decoupe)"><path class="fil-trace"/><g class="fil-oeillets"></g></g>
<g class="fil-noeud"><circle r="4.5"/><path d="M0 0 q 10 4 16 14"/></g>
<g class="fil-tete"><path class="fil-aiguille" d="M-2 0 Q-2 -2.6 2 -2.6 H40 L47 0 L40 2.6 H2 Q-2 2.6 -2 0 Z"/><rect class="fil-chas" x="2" y="-0.9" width="10" height="1.8" rx=".9"/></g>`;
  document.body.appendChild(svg);
  const decoupe = svg.querySelector('.fil-decoupe');
  const trace = svg.querySelector('.fil-trace');
  const oeillets = svg.querySelector('.fil-oeillets');
  const tete = svg.querySelector('.fil-tete');
  const noeud = svg.querySelector('.fil-noeud');
  let P = [], debutY = 0, finY = 0, cachees = [], pret = false;

  const docRect = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, left: r.left, right: r.right, height: r.height }; };

  function construire() {
    const vh = window.innerHeight, W = document.documentElement.clientWidth;
    const cont = document.querySelector('main .conteneur');
    const texte = cont ? cont.getBoundingClientRect().left + parseFloat(getComputedStyle(cont).paddingLeft) : 20;
    const voie = Math.max(7, Math.min(texte / 2, 60));
    const ampleur = Math.min(170, W * 0.2);
    const h = docRect(hero);
    debutY = h.top + vh * TETE;
    const pied = document.querySelector('.pied-logo') || document.querySelector('.pied');
    const pl = docRect(pied);
    finY = pl.top + pl.height / 2;
    const finX = Math.max(voie + 10, pl.left - 10);
    /* Zones où le fil passe dessous : sections épinglées (toute leur réserve) et photo du ruban. */
    cachees = [];
    document.querySelectorAll('main .epingle, main .eclatee, main .ruban-section').forEach((s) => {
      const z = docRect(s.parentElement && s.parentElement.classList.contains('pin-spacer') ? s.parentElement : s);
      cachees.push([z.top, z.bottom]);
    });
    /* Détours : dans le rembourrage bas de chaque section visible (espace sans texte). */
    const detours = [];
    document.querySelectorAll('main > section, main > div.ruban-section').forEach((s) => {
      if (s.matches('.hero, .epingle, .eclatee, .ruban-section')) return;
      const r = docRect(s), pb = parseFloat(getComputedStyle(s).paddingBottom) || 0;
      if (pb < 48) return;
      detours.push([r.bottom - pb * 0.85, r.bottom - pb * 0.2]);
    });
    const x = (y) => {
      let v = voie + Math.sin(y / 23) * 1.2 + Math.sin(y / 71) * 2.2;
      for (const [a, b] of detours) if (y > a && y < b) { const u = (y - a) / (b - a); v += ampleur * Math.sin(Math.PI * u) ** 2; }
      if (y > finY - 90) { const u = Math.min(1, (y - (finY - 90)) / 90); v += (finX - voie) * (u * u * (3 - 2 * u)); }
      return v;
    };
    P = [];
    for (let y = debutY; y <= finY;) {
      P.push({ x: x(y), y });
      const pente = Math.abs(x(y + 0.5) - x(y)) / 0.5;
      y += Math.max(0.35, 3 / Math.sqrt(1 + pente * pente));
    }
    P.push({ x: x(finY), y: finY });
    const cache = (y) => cachees.some(([a, b]) => y >= a && y <= b);
    let d = '', dedans = false;
    const trous = [];
    P.forEach((p, i) => {
      p.c = cache(p.y);
      if (!p.c) { d += (dedans ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); if (!dedans && i) trous.push(p); dedans = true; }
      else { if (dedans) trous.push(P[i - 1]); dedans = false; }
    });
    trace.setAttribute('d', d);
    oeillets.innerHTML = trous.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4"/>`).join('');
    noeud.setAttribute('transform', `translate(${P[P.length - 1].x.toFixed(1)} ${finY.toFixed(1)})`);
    decoupe.setAttribute('width', W);
    pret = true;
    maj();
  }

  /* Recherche de l'échantillon de hauteur y (tracé toujours descendant). */
  const chercher = (y) => { let a = 0, b = P.length - 1; while (b - a > 1) { const m = (a + b) >> 1; if (P[m].y <= y) a = m; else b = m; } return a; };
  let ecrit = '';
  function maj() {
    if (!pret || !P.length) return;
    if (etat.calme) { decoupe.setAttribute('height', finY + 20); tete.style.display = 'none'; noeud.classList.add('visible'); return; }
    const y = Math.max(debutY, Math.min(finY, window.scrollY + window.innerHeight * TETE));
    const i = chercher(y), p = P[i], q = P[Math.min(P.length - 1, i + 3)], o = P[Math.max(0, i - 3)];
    const ang = Math.atan2(q.y - o.y, q.x - o.x) * 180 / Math.PI;
    const val = `${y.toFixed(1)}|${p.x.toFixed(1)}|${ang.toFixed(1)}|${p.c}`;
    if (val === ecrit) return;
    ecrit = val;
    decoupe.setAttribute('height', y.toFixed(1));
    tete.setAttribute('transform', `translate(${p.x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    const fini = y >= finY - 1;
    tete.style.display = p.c || fini ? 'none' : '';
    noeud.classList.toggle('visible', fini);
  }
  let raf = 0;
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; maj(); }); }, { passive: true });
  quand('pret', () => {
    construire();
    if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', construire);
    window.addEventListener('resize', () => requestAnimationFrame(construire));
  });
}
