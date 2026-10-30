/* Titres cousus : quand un titre de section apparaît, ses lettres s'assemblent une à une derrière une aiguille
   qui court sur la ligne de base ; les étiquettes techniques (surtitres en mono) se décodent comme une machine
   à étiqueter. Déclenché au moment exact où le socle rend l'élément visible (.vu), dans la même image :
   rien n'est visible avant son animation. Au retour, en mode calme et en secours : rien ne bouge.
   Le texte d'origine est rendu à la fin (lecteurs d'écran, redimensionnement). */
import { etat } from '../socle/index.js?v=2';

const html = document.documentElement;
const SIGNES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const AIGUILLE = '<svg viewBox="0 0 160 24" focusable="false"><path d="M0 12 H70" class="ta-fil"/><path class="ta-corps" d="M68 12 Q70 8.5 76 8.5 H150 L159 12 L150 15.5 H76 Q70 15.5 68 12 Z"/><rect class="ta-chas" x="76" y="10.6" width="16" height="2.8" rx="1.4"/></svg>';

const immobile = () => etat.calme || html.classList.contains('sans-transition') || html.classList.contains('secours') || html.dataset.arrivee === 'retour';

function surVu(el, fn) {
  if (el.classList.contains('vu')) return;
  const mo = new MutationObserver(() => {
    if (!el.classList.contains('vu')) return;
    mo.disconnect();
    if (!immobile()) fn(el);
  });
  mo.observe(el, { attributes: true, attributeFilter: ['class'] });
}

function coudre(h) {
  const gsap = window.gsap, S = window.SplitText;
  if (!gsap || !S) return;
  let d;
  try { d = S.create ? S.create(h, { type: 'words,chars', charsClass: 'tc' }) : new S(h, { type: 'words,chars', charsClass: 'tc' }); } catch { return; }
  const chars = d.chars || [];
  if (!chars.length) { d.revert && d.revert(); return; }
  h.classList.add('titre-en-couture');
  const aiguille = document.createElement('span');
  aiguille.className = 'titre-aiguille';
  aiguille.setAttribute('aria-hidden', 'true');
  aiguille.setAttribute('data-audit-ignorer', '');
  aiguille.innerHTML = AIGUILLE;
  h.appendChild(aiguille);
  const pas = Math.min(0.03, 0.55 / chars.length);
  const duree = pas * chars.length + 0.35;
  /* L'aiguille court jusqu'à la fin du texte : le titre prend la largeur de son texte pendant la couture
     (classe CSS), et l'aiguille avance en pourcentage de cette largeur. Aucune mesure. */
  const fin = () => { try { d.revert(); } catch {} aiguille.remove(); h.classList.remove('titre-en-couture'); };
  gsap.timeline({ onComplete: fin })
    .fromTo(chars, { yPercent: 55, rotation: (i) => ((i * 47) % 23) - 11, opacity: 0 },
      { yPercent: 0, rotation: 0, opacity: 1, duration: 0.55, stagger: pas, ease: 'back.out(1.7)' }, 0)
    .fromTo(aiguille, { left: '0%', x: -40, opacity: 0 }, { left: '100%', x: -50, opacity: 1, duration: duree, ease: 'power1.inOut' }, 0)
    .to(aiguille, { opacity: 0, duration: 0.2 }, duree - 0.15);
}

function decoder(el) {
  const noeuds = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const n = w.currentNode; if (n.textContent.trim() && !n.parentElement.closest('.piqure')) noeuds.push(n); }
  if (!noeuds.length) return;
  const finaux = noeuds.map((n) => n.textContent);
  const total = finaux.join('').length;
  const debut = performance.now(), duree = Math.min(900, 300 + total * 22);
  const brouiller = (s, part) => [...s].map((ch, i) => (/\s/.test(ch) || i / s.length < part ? ch : SIGNES[(Math.random() * SIGNES.length) | 0])).join('');
  const id = setInterval(() => {
    const p = Math.min(1, (performance.now() - debut) / duree);
    noeuds.forEach((n, k) => { n.textContent = p >= 1 ? finaux[k] : brouiller(finaux[k], p * 1.15 - 0.1); });
    if (p >= 1) clearInterval(id);
  }, 45);
  noeuds.forEach((n, k) => { n.textContent = brouiller(finaux[k], 0); });
}

export function initTitres() {
  if (etat.calme) return;
  document.querySelectorAll('main h2[data-anime]').forEach((h) => surVu(h, coudre));
  document.querySelectorAll('.surtitre[data-anime]').forEach((s) => surVu(s, decoder));
}
