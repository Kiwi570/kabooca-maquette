/* « Personnaliser en trois temps » (accueil) : les pastilles teintent le croquis en cercle depuis la pastille,
   les initiales se brodent sur l'écusson, le lien vers l'atelier emporte ces choix dans son adresse. */
import { local, textes } from './outils.js?v=2';
import { variables, appliquer, changerTeintes, initiales } from './croquis.js?v=2';

export function initPersonnaliser() {
  const zone = document.querySelector('[data-perso]');
  const croquis = document.querySelector('[data-perso-croquis]');
  if (!zone || !croquis) return;
  const lien = zone.querySelector('[data-lien-atelier]');
  const champ = zone.querySelector('[data-initiales-champ]');
  const memo = local.lire('kabooca:teintes', null);
  if (memo) {
    ['corps', 'sangle'].forEach((k) => { const r = zone.querySelector(`input[name="${k}"][value="${memo[k]}"]`); if (r) r.checked = true; });
  }
  const lire = () => ({
    corps: (zone.querySelector('input[name="corps"]:checked') || {}).value || 'vert',
    sangle: (zone.querySelector('input[name="sangle"]:checked') || {}).value || 'orange',
    fil: 'ivoire',
  });
  const majLien = () => {
    if (!lien) return;
    const c = lire();
    const u = new URL(lien.href, location.href);
    u.search = new URLSearchParams({ modele: 'sac-de-commandement', corps: c.corps, sangle: c.sangle, ...(champ && champ.value.trim() ? { initiales: initiales(croquis, champ.value) } : {}) }).toString();
    lien.href = u.pathname + u.search + u.hash;
  };
  /* Nom de la teinte choisie affiché à côté de chaque légende. */
  const noms = () => { const T = textes().teintes || {}, c = lire(); zone.querySelectorAll('[data-choix-nom]').forEach((el) => { const k = c[el.dataset.choixNom]; el.textContent = (T[k] && T[k].nom) || ''; }); };
  noms();
  const debut = lire();
  croquis.querySelectorAll('.couche').forEach((c) => appliquer(c, variables(debut)));
  zone.addEventListener('change', (e) => {
    const r = e.target;
    if (r.type !== 'radio') return;
    const b = r.closest('.pastille').getBoundingClientRect();
    changerTeintes(croquis, variables(lire()), { x: b.left + b.width / 2, y: b.top + b.height / 2 });
    local.ecrire('kabooca:teintes', lire());
    noms();
    majLien();
  });
  champ && champ.addEventListener('input', () => { champ.value = champ.value.toUpperCase().slice(0, 3); initiales(croquis, champ.value); majLien(); });
  majLien();
}
