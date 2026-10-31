/* Configurateur de l'atelier sur mesure : quatre étapes annoncées, hauteur animée entre les étapes,
   croquis et récapitulatif en direct, choix préremplis par l'adresse (lus par le socle), envoi simulé
   seulement à la dernière étape (le socle vérifie les champs et bloque le double envoi). */
import { calme, textes, remplir } from './outils.js?v=3';
import { variables, appliquer, changerTeintes, initiales } from './croquis.js?v=3';
import { aller } from '../socle/index.js?v=3';

export function initConfigurateur() {
  const form = document.querySelector('[data-configurateur]');
  if (!form) return;
  const T = textes().configurateur || {};
  const P = textes().produits || {};
  const teintes = textes().teintes || {};
  const pas = [...form.querySelectorAll('[data-pas]')];
  const indicateurs = [...form.querySelectorAll('[data-indicateur-pas]')];
  const conteneur = form.querySelector('[data-pas-conteneur]');
  const etapeN = form.querySelector('[data-etape-n]');
  const prec = form.querySelector('[data-precedent]'), suiv = form.querySelector('[data-suivant]'), envoyer = form.querySelector('[data-envoyer]');
  const zone = document.querySelector('[data-config-croquis]');
  const recap = (k) => document.querySelector(`[data-recap="${k}"]`);
  let courant = 1;

  form.classList.add('config--etapes');
  pas.forEach((f) => f.setAttribute('tabindex', '-1'));

  const choix = () => ({
    modele: (form.querySelector('input[name="modele"]:checked') || {}).value || 'sac-de-commandement',
    corps: (form.querySelector('input[name="corps"]:checked') || {}).value,
    sangle: (form.querySelector('input[name="sangle"]:checked') || {}).value,
    fil: (form.querySelector('input[name="fil"]:checked') || {}).value,
    initiales: (form.querySelector('[name="initiales"]') || {}).value || '',
  });
  const typeCourant = () => {
    const r = form.querySelector('input[name="modele"]:checked');
    return (r && r.dataset.croquisType) || 'besace';
  };
  const coucheType = (t) => zone && zone.querySelector(`.config-croquis-type[data-type="${t}"]`);

  function majRecap(point) {
    const c = choix();
    const nomModele = P[c.modele] ? P[c.modele].nom : T.autre;
    if (recap('modele')) recap('modele').textContent = nomModele;
    const nom = (k) => (teintes[k] ? teintes[k].nom : '');
    if (recap('couleurs')) recap('couleurs').textContent = `${T.corps}\u00a0: ${nom(c.corps)} · ${T.sangle}\u00a0: ${nom(c.sangle)} · ${T.fil}\u00a0: ${nom(c.fil)}`;
    const ini = initiales(zone, c.initiales);
    if (recap('marquage')) recap('marquage').textContent = ini || T.recapAucun;
    /* Croquis du modèle choisi, aux couleurs choisies. */
    if (zone) {
      const t = typeCourant();
      zone.querySelectorAll('.config-croquis-type').forEach((el) => { el.hidden = el.dataset.type !== t; });
      const couche = coucheType(t);
      const vars = variables(c);
      if (point && couche) changerTeintes(couche, vars, point);
      else zone.querySelectorAll('.couche').forEach((el) => appliquer(el, vars));
      zone.querySelectorAll('.config-croquis-type').forEach((el) => { if (el !== couche) el.querySelectorAll('.couche').forEach((x) => appliquer(x, vars)); });
    }
  }

  function afficher(n, { focus = true } = {}) {
    n = Math.max(1, Math.min(pas.length, n));
    const avant = conteneur.getBoundingClientRect().height;
    pas.forEach((f) => f.classList.toggle('actif', Number(f.dataset.pas) === n));
    indicateurs.forEach((li) => {
      const k = Number(li.dataset.indicateurPas);
      if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      li.classList.toggle('fait', k < n);
    });
    if (etapeN) etapeN.textContent = remplir(T.etape, { n });
    prec.hidden = n === 1;
    suiv.hidden = n === pas.length;
    envoyer.hidden = n !== pas.length;
    const apres = conteneur.getBoundingClientRect().height;
    const nouveau = pas[n - 1];
    if (!calme() && window.gsap && courant !== n) {
      window.gsap.fromTo(nouveau, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform' });
      conteneur.animate([{ height: avant + 'px' }, { height: apres + 'px' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    courant = n;
    if (focus) {
      const haut = form.getBoundingClientRect().top;
      if (haut < 0) aller(form, { instant: calme() });
      nouveau.focus({ preventScroll: true });
    }
  }

  suiv.addEventListener('click', () => afficher(courant + 1));
  prec.addEventListener('click', () => afficher(courant - 1));
  /* Entrée dans un champ avant la dernière étape : étape suivante, jamais d'envoi. */
  form.addEventListener('submit', (e) => {
    if (courant < pas.length) { e.preventDefault(); e.stopImmediatePropagation(); afficher(courant + 1); }
  }, true);
  form.addEventListener('change', (e) => {
    const r = e.target;
    let point = null;
    if (r.type === 'radio' && r.closest('.pastille')) { const b = r.closest('.pastille').getBoundingClientRect(); point = { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }
    majRecap(point);
  });
  const ini = form.querySelector('[name="initiales"]');
  ini && ini.addEventListener('input', () => { ini.value = ini.value.toUpperCase().slice(0, 3); majRecap(); });

  /* Teintes inconnues dans l'adresse : celles par défaut sont gardées par le formulaire. */
  ['corps', 'sangle', 'fil'].forEach((k) => { if (!form.querySelector(`input[name="${k}"]:checked`)) { const d = form.querySelector(`input[name="${k}"]`); if (d) d.checked = true; } });
  if (!form.querySelector('input[name="modele"]:checked')) form.querySelector('input[name="modele"]').checked = true;
  majRecap();
  afficher(1, { focus: false });
}
