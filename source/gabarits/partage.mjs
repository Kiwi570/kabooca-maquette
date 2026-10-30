/* Image de partage 1200×630 de chaque page : emblème et mot Kabooça, accroche de la page en Fraunces,
   photo d'ambiance à droite, couture orange. outils/images-partage.mjs photographie ces pages. */
import { readFileSync } from 'node:fs';
import { html, brut } from '../../outils/gabarit.mjs';
import { croquis } from './croquis.mjs';

const LOGO = JSON.parse(readFileSync(new URL('./logo-traces.json', import.meta.url), 'utf8'));
const vb = (b) => `${b[0].toFixed(1)} ${b[1].toFixed(1)} ${(b[2] - b[0]).toFixed(1)} ${(b[3] - b[1]).toFixed(1)}`;

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  const produit = c.donnees.catalogue.find((p) => p.cle === cle);
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`:root{--fond:${c.site.couleurs.fond};--texte:${c.site.couleurs.texte}}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#F4EFE4;color:#1E1F1C}
.carte{display:grid;grid-template-columns:1fr 520px;width:1200px;height:630px}
.carte-texte{position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:60px 56px 56px 64px}
.marque{display:flex;align-items:center;gap:16px;color:#1C3A2B}.marque svg{fill:#1C3A2B}
.carte-titre{font-family:var(--police-titres);font-weight:340;font-size:70px;line-height:1;margin:0;letter-spacing:-.02em;text-wrap:balance}
.carte-sous{margin:18px 0 0;font:500 18px/1.3 var(--police-mono);letter-spacing:.1em;text-transform:uppercase;color:#A63F12}
.couture{position:absolute;left:64px;right:56px;bottom:40px;height:3px;background:repeating-linear-gradient(90deg,#D2541E 0 12px,transparent 12px 20px)}
.carte-image{position:relative;background:center/cover no-repeat}
.carte-image .mention-ia{right:14px;bottom:14px;font-size:14px}
.carte-croquis{display:grid;place-items:center;background:#EBE3D3;padding:56px}.carte-croquis .croquis{width:100%;height:auto}
.carte-croquis .badge-croquis{font-size:14px;left:16px;bottom:16px}`)}</style>
</head><body>
<div class="carte">
  <div class="carte-texte">
    <div class="marque">${brut(`<svg viewBox="${vb(LOGO.embleme.boite)}" height="64"><path fill-rule="evenodd" d="${LOGO.embleme.d}"/></svg><svg viewBox="${vb(LOGO.mot.boite)}" height="20"><path fill-rule="evenodd" d="${LOGO.mot.d}"/></svg>`)}</div>
    <div><p class="carte-titre">${c.t(`pages.${cle}.accroche`)}</p><p class="carte-sous">${c.t('commun.sloganSuite')}</p></div>
    <span class="couture"></span>
  </div>
  ${produit ? html`<div class="carte-image carte-croquis">${croquis(c, produit.croquis, { decoratif: true })}<span class="badge-croquis">${c.t('commun.croquisCourt')}</span></div>`
    : html`<div class="carte-image" style="background-image:url('/assets/images/${image}')"><span class="mention-ia">${c.t('commun.mentionIa')}</span></div>`}
</div>
</body></html>`;
}
