/* Outils communs du projet : textes (lus dans la page), annonces aux lecteurs d'écran, détection de la souris. */
import { etat } from '../socle/index.js?v=2';

let cache = null;
export function textes() {
  if (cache) return cache;
  try { cache = JSON.parse(document.getElementById('textes-js').textContent); } catch { cache = {}; }
  return cache;
}

/* Remplace {cle} par la valeur. */
export const remplir = (s, vars = {}) => String(s || '').replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

let annonceT = 0;
export function annoncer(message) {
  const zone = document.querySelector('[data-annonce]');
  if (!zone) return;
  zone.textContent = '';
  clearTimeout(annonceT);
  annonceT = setTimeout(() => { zone.textContent = message; }, 60);
}

export const souris = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
export const calme = () => etat.calme;
export const borne = (v, a, b) => Math.min(b, Math.max(a, v));

/* Couleurs d'une teinte du nuancier. */
export function teinte(cle) {
  const t = textes().teintes || {};
  return t[cle] ? t[cle].hex : null;
}

/* Stockage local tolérant (navigation privée, données bloquées). */
export const local = {
  lire(cle, defaut = null) { try { const v = localStorage.getItem(cle); return v == null ? defaut : JSON.parse(v); } catch { try { localStorage.removeItem(cle); } catch {} return defaut; } },
  ecrire(cle, v) { try { localStorage.setItem(cle, JSON.stringify(v)); return true; } catch { return false; } },
};

/* Focus gardé dans une fenêtre ; renvoie une fonction qui l'arrête. */
export function garderFocus(racine) {
  const f = () => [...racine.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => el.offsetParent !== null && !el.closest('[hidden]'));
  const clavier = (e) => {
    if (e.key !== 'Tab') return;
    const liste = f();
    if (!liste.length) return;
    const i = liste.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); liste[liste.length - 1].focus(); }
    else if (!e.shiftKey && i === liste.length - 1) { e.preventDefault(); liste[0].focus(); }
  };
  document.addEventListener('keydown', clavier);
  return () => document.removeEventListener('keydown', clavier);
}
