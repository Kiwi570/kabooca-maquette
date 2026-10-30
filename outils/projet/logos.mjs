#!/usr/bin/env node
/* Fichiers du logo à partir des tracés (source/gabarits/logo-traces.json) :
   logo.svg (emblème vert), logo-clair.svg (emblème crème), favicon.svg, apple-touch-icon.png (180 px).
   Usage : node outils/projet/logos.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const R = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const T = JSON.parse(readFileSync(join(R, 'source/gabarits/logo-traces.json'), 'utf8'));
const VERT = '#1C3A2B', CREME = '#F0E0B0';
const [x0, y0, x1, y1] = T.embleme.boite;
const m = 6, w = x1 - x0 + 2 * m, h = y1 - y0 + 2 * m;
const embleme = (couleur) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(x0 - m).toFixed(1)} ${(y0 - m).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}"><path fill="${couleur}" fill-rule="evenodd" d="${T.embleme.d}"/></svg>\n`;
writeFileSync(join(R, 'assets/images/logo.svg'), embleme(VERT));
writeFileSync(join(R, 'assets/images/logo-clair.svg'), embleme(CREME));
/* Favicon : emblème crème sur carré vert arrondi. */
const cote = Math.max(w, h) * 1.28, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
const icone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(cx - cote / 2).toFixed(1)} ${(cy - cote / 2).toFixed(1)} ${cote.toFixed(1)} ${cote.toFixed(1)}"><rect x="${(cx - cote / 2).toFixed(1)}" y="${(cy - cote / 2).toFixed(1)}" width="${cote.toFixed(1)}" height="${cote.toFixed(1)}" rx="${(cote * 0.22).toFixed(1)}" fill="${VERT}"/><g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(.78) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})"><path fill="${CREME}" fill-rule="evenodd" d="${T.embleme.d}"/></g></svg>\n`;
writeFileSync(join(R, 'assets/images/favicon.svg'), icone);
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const nav = await chromium.launch();
const p = await nav.newPage({ viewport: { width: 180, height: 180 } });
await p.setContent(`<html><body style="margin:0">${icone.replace('<svg ', '<svg width="180" height="180" ')}</body></html>`);
await p.screenshot({ path: join(R, 'assets/images/apple-touch-icon.png') });
/* Contrôle visuel : logo complet (emblème et mot) comparé à l'original. */
const [a0, b0, a1, b1] = T.mot.boite;
const test = `<svg xmlns="http://www.w3.org/2000/svg" width="1160" height="860" viewBox="0 0 580 430"><rect width="580" height="430" fill="${VERT}"/><path fill="${CREME}" fill-rule="evenodd" d="${T.embleme.d} ${T.mot.d}"/></svg>`;
const p2 = await nav.newPage({ viewport: { width: 1160, height: 860 } });
await p2.setContent(`<html><body style="margin:0">${test}</body></html>`);
await p2.screenshot({ path: process.argv[2] || '/tmp/logo-test.png' });
await nav.close();
console.log('OK logos', { embleme: [w, h].map(Math.round), mot: [a1 - a0, b1 - b0].map(Math.round) });
