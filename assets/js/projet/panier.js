/* Panier simulé : une seule source (localStorage), identique dans tous les onglets (événement storage),
   donnée abîmée nettoyée au chargement sans rien bloquer, tiroir avec focus gardé et Échap,
   pièce qui s'envole vers le panier, commande simulée qui vide le panier. */
import { bloquerDefilement, debloquerDefilement, suivre, lacher } from '../socle/index.js?v=2';
import { textes, remplir, annoncer, calme, local, garderFocus } from './outils.js?v=2';

const CLE = 'kabooca:panier';
let racine, liste, vide, pied, message, bouton, compte, modeles;
let ouvert = false, relacher = null, dernierAjout = 0;

const T = () => textes().panier || {};
const produits = () => textes().produits || {};

/* Lecture tolérante : seules les lignes valides sont gardées, le reste est nettoyé. */
export function lire() {
  const brut = local.lire(CLE, []);
  if (!Array.isArray(brut)) { local.ecrire(CLE, []); return []; }
  const p = produits();
  const propre = brut.filter((l) => l && typeof l.cle === 'string' && p[l.cle] && p[l.cle].fiche && Number.isInteger(l.qte) && l.qte > 0 && l.qte < 100);
  if (propre.length !== brut.length) local.ecrire(CLE, propre);
  return propre;
}

function ecrire(l) { local.ecrire(CLE, l); rendre(); }

function croquisMini(type) {
  const m = modeles && modeles.content.querySelector(`[data-croquis="${type}"]`);
  return m ? m.cloneNode(true) : document.createElement('span');
}

function rendre() {
  const l = lire();
  const n = l.reduce((s, x) => s + x.qte, 0);
  if (compte) { compte.textContent = String(n); compte.classList.toggle('plein', n > 0); }
  if (bouton) bouton.setAttribute('aria-label', `${(textes().panier || {}).titre || ''} : ${remplir(T().nombre, { n, s: n > 1 ? 's' : '' })}`);
  if (!liste) return;
  liste.replaceChildren(...l.map((x) => {
    const p = produits()[x.cle];
    const li = document.createElement('li');
    li.className = 'panier-ligne';
    const visuel = document.createElement('div');
    visuel.className = 'panier-ligne-croquis';
    visuel.appendChild(croquisMini(p.croquis));
    const nom = document.createElement('p');
    nom.className = 'panier-ligne-nom';
    nom.textContent = p.nom;
    const actions = document.createElement('div');
    actions.className = 'panier-ligne-actions';
    actions.innerHTML = `<span class="quantite" role="group" aria-label="${T().quantite}">
      <button type="button" data-moins aria-label="${remplir(T().moins, { nom: p.nom })}">−</button>
      <output aria-live="polite">${x.qte}</output>
      <button type="button" data-plus aria-label="${remplir(T().plus, { nom: p.nom })}">+</button></span>
      <button type="button" class="panier-retirer" data-retirer aria-label="${remplir(T().retirer, { nom: p.nom })}">${T().retirerCourt}</button>`;
    actions.querySelector('[data-moins]').addEventListener('click', () => changer(x.cle, -1));
    actions.querySelector('[data-plus]').addEventListener('click', () => changer(x.cle, +1));
    actions.querySelector('[data-retirer]').addEventListener('click', () => changer(x.cle, -Infinity));
    li.append(visuel, nom, actions);
    return li;
  }));
  vide.hidden = l.length > 0;
  pied.hidden = l.length === 0;
}

function changer(cle, delta) {
  const l = lire();
  const i = l.findIndex((x) => x.cle === cle);
  if (i < 0 && delta > 0) l.push({ cle, qte: Math.min(99, delta) });
  else if (i >= 0) {
    l[i].qte = Math.min(99, l[i].qte + delta);
    if (!(l[i].qte > 0)) l.splice(i, 1);
  }
  ecrire(l);
  if (!l.length && ouvert && vide) { const b = vide.querySelector('a'); b && b.focus({ preventScroll: true }); }
}

function envoler(source) {
  const gsap = window.gsap;
  const cible = bouton && bouton.getBoundingClientRect();
  if (!gsap || !source || !cible || calme() || !cible.width) return;
  const r = source.getBoundingClientRect();
  const copie = source.cloneNode(true);
  copie.removeAttribute('role'); copie.removeAttribute('aria-label'); copie.setAttribute('aria-hidden', 'true');
  const boite = document.createElement('div');
  boite.className = 'envol';
  boite.setAttribute('data-audit-ignorer', '');
  boite.appendChild(copie);
  const taille = Math.min(r.width, r.height, 220);
  Object.assign(boite.style, { left: `${r.left + r.width / 2 - taille / 2}px`, top: `${r.top + r.height / 2 - taille / 2}px`, width: `${taille}px`, height: `${taille}px` });
  document.body.appendChild(boite);
  const dx = cible.left + cible.width / 2 - (r.left + r.width / 2);
  const dy = cible.top + cible.height / 2 - (r.top + r.height / 2);
  gsap.timeline({ onComplete: () => { boite.remove(); compte && (compte.classList.remove('secoue'), void compte.offsetWidth, compte.classList.add('secoue')); } })
    .fromTo(boite, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }, { x: dx * 0.55, y: dy - 60, scale: 0.6, rotation: -8, duration: 0.42, ease: 'power2.out' })
    .to(boite, { x: dx, y: dy, scale: 0.12, rotation: 6, opacity: 0.2, duration: 0.4, ease: 'power2.in' });
}

export function ajouter(cle, source) {
  const t = performance.now();
  if (t - dernierAjout < 350) return; /* un double clic n'ajoute qu'un exemplaire */
  dernierAjout = t;
  changer(cle, 1);
  const p = produits()[cle];
  annoncer(remplir(T().ajoute, { nom: p ? p.nom : '' }));
  envoler(source);
}

function ouvrir() {
  if (ouvert || !racine) return;
  ouvert = true;
  racine.hidden = false;
  message.hidden = true;
  bouton.setAttribute('aria-expanded', 'true');
  bloquerDefilement('panier');
  suivre(racine);
  requestAnimationFrame(() => requestAnimationFrame(() => racine.classList.add('ouvert')));
  relacher = garderFocus(racine);
  const f = racine.querySelector('.panier-fermer');
  f && f.focus({ preventScroll: true });
}

function fermer() {
  if (!ouvert) return;
  ouvert = false;
  racine.classList.remove('ouvert');
  bouton.setAttribute('aria-expanded', 'false');
  relacher && relacher();
  const fin = () => { if (!ouvert) { racine.hidden = true; debloquerDefilement('panier'); lacher(racine); } };
  if (calme()) fin(); else setTimeout(fin, 460);
  bouton.focus({ preventScroll: true });
}

export function initPanier() {
  racine = document.querySelector('[data-panier]');
  bouton = document.querySelector('[data-panier-bouton]');
  compte = document.querySelector('[data-panier-compte]');
  if (!racine) return;
  liste = racine.querySelector('[data-panier-liste]');
  vide = racine.querySelector('[data-panier-vide]');
  pied = racine.querySelector('[data-panier-pied]');
  message = racine.querySelector('[data-panier-message]');
  modeles = racine.querySelector('[data-croquis-modeles]');
  rendre();
  window.addEventListener('storage', (e) => { if (e.key === CLE || e.key === null) rendre(); });
  bouton && bouton.addEventListener('click', () => (ouvert ? fermer() : ouvrir()));
  racine.querySelectorAll('[data-panier-fermer]').forEach((b) => b.addEventListener('click', fermer));
  document.addEventListener('keydown', (e) => { if (ouvert && e.key === 'Escape') { e.preventDefault(); fermer(); } });
  const commander = racine.querySelector('[data-panier-commander]');
  commander && commander.addEventListener('click', () => {
    if (!lire().length) return;
    commander.disabled = true;
    ecrire([]);
    message.textContent = T().commandeFaite;
    message.hidden = false;
    message.focus({ preventScroll: true });
    setTimeout(() => { commander.disabled = false; }, 800);
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-ajouter]');
    if (!b) return;
    const zone = b.closest('[data-creation], .fiche-tete');
    ajouter(b.dataset.ajouter, zone && zone.querySelector('.croquis'));
  });
  /* Un lien interne pendant que le panier est ouvert : il se ferme avant la transition. */
  racine.addEventListener('click', (e) => { if (e.target.closest('a[href]')) fermer(); });
}
