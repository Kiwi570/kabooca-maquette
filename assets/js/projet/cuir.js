/* Cuir vivant (WebGL) : les grandes photos se creusent sous la souris comme un cuir qu'on presse (creux qui
   suit le pointeur et se résorbe lentement derrière lui, enfoncement plus marqué au clic avec une onde),
   éclairées par une lumière rasante qui révèle le grain. Photo d'ouverture de l'accueil : effet permanent,
   lumière qui dérive au repos, rien n'est recalculé pendant le défilement. Autres photos : un seul contexte
   WebGL partagé, posé sur la photo survolée (textures gardées en cache, six au plus).
   Ordinateur et souris seulement ; boucles du socle (arrêtées hors écran, onglet caché, mode calme) ;
   densité de pixels limitée ; qualité réduite d'elle-même si les images sont lentes. Sans WebGL : les photos.
   Partout (téléphone compris) : les photos s'étirent légèrement selon la vitesse de défilement, comme un cuir
   souple (transformations seules, rien n'est mesuré pendant le défilement). */
import { boucle, quand, etat } from '../socle/index.js?v=2';
import { souris } from './outils.js?v=2';

const N = 6;
const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FS = `precision mediump float;
uniform sampler2D t; uniform vec2 res; uniform vec2 img; uniform vec2 pos; uniform vec2 lum; uniform vec2 asp;
uniform float force; uniform float onde; uniform float temps; uniform float decal; uniform float actif;
uniform vec3 presse[${N}]; uniform vec3 clic;
varying vec2 v;
float L(vec2 q){ return dot(texture2D(t, q).rgb, vec3(.299, .587, .114)); }
float creux(vec2 q){
  float h = 0.;
  for (int i = 0; i < ${N}; i++) { vec2 d = q - presse[i].xy * asp; h -= presse[i].z * exp(-dot(d, d) * 34.); }
  if (clic.z < 1.) { float k = distance(q, clic.xy * asp) - clic.z * .5; h += .6 * exp(-k * k * 300.) * (1. - clic.z); }
  return h;
}
void main(){
  float rs = res.x / res.y, ri = img.x / img.y;
  vec2 q = v * asp;
  float e = .006;
  float h0 = 0.;
  vec2 g = vec2(0.);
  /* Sans creux en cours (cas le plus fréquent, et pendant le défilement), le calcul des creux est sauté. */
  if (actif > .5) {
    h0 = creux(q);
    g = vec2(creux(q + vec2(e, 0.)) - h0, creux(q + vec2(0., e)) - h0) / e;
  }
  vec2 w = v + vec2(0., sin(v.x * 8. + temps * 1.6) * onde * .007 + decal);
  w -= g * .0045;
  vec2 s = rs > ri ? vec2(1., ri / rs) : vec2(rs / ri, 1.);
  vec2 uv = clamp((1. - s) * pos + w * s, vec2(.001), vec2(.999));
  vec3 base = texture2D(t, uv).rgb;
  vec2 px = 1.25 / img;
  float gx = L(uv + vec2(px.x, 0.)) - L(uv - vec2(px.x, 0.));
  float gy = L(uv + vec2(0., px.y)) - L(uv - vec2(0., px.y));
  vec3 n = normalize(vec3(-gx * 5.5 - g.x * .11, -gy * 5.5 - g.y * .11, 1.));
  vec3 dir = normalize(vec3((lum - v) * asp, .42));
  float d = distance(q, lum * asp);
  float halo = exp(-d * d * 2.6);
  float diff = dot(n, dir) - dir.z;
  vec3 col = base * (1. + diff * 1.9 * halo * force) + vec3(1., .94, .82) * .045 * halo * force;
  col *= 1. + h0 * .28;
  gl_FragColor = vec4(col, 1.);
}`;

/* Un contexte WebGL sur un canvas, qu'on peut poser sur une photo puis sur une autre. */
function creerRendu(classe) {
  const canvas = document.createElement('canvas');
  canvas.className = classe;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-audit-ignorer', '');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const U = (n) => gl.getUniformLocation(prog, n);
  const u = Object.fromEntries(['res', 'img', 'pos', 'lum', 'asp', 'force', 'onde', 'temps', 'decal', 'clic', 'actif'].map((k) => [k, U(k)]));
  u.presse = U('presse');
  const cache = new Map(); /* img -> texture */
  const r = {
    canvas, gl, figure: null, img: null, qualite: 1, w: 0, h: 0,
    presse: new Float32Array(N * 3), clic: [0, 0, 9],
    texture(img) {
      let tex = cache.get(img);
      if (!tex) {
        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); } catch { gl.deleteTexture(tex); return false; }
        [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        cache.set(img, tex);
        if (cache.size > 6) { const [k, vieux] = cache.entries().next().value; if (k !== img) { gl.deleteTexture(vieux); cache.delete(k); } }
      } else gl.bindTexture(gl.TEXTURE_2D, tex);
      return true;
    },
    poser(figure) {
      const img = figure.querySelector('img');
      if (!img || !img.complete || !img.naturalWidth) return false;
      if (!r.texture(img)) return false;
      r.figure = figure; r.img = img;
      const pic = figure.querySelector('picture');
      figure.insertBefore(canvas, pic ? pic.nextSibling : figure.firstChild);
      const [px, py] = (getComputedStyle(img).objectPosition || '50% 50%').split(' ').map((x) => parseFloat(x) / 100);
      gl.uniform2f(u.img, img.naturalWidth, img.naturalHeight);
      gl.uniform2f(u.pos, isNaN(px) ? 0.5 : px, 1 - (isNaN(py) ? 0.5 : py));
      r.taille();
      return true;
    },
    taille() {
      if (!r.figure) return;
      const b = r.figure.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * r.qualite;
      r.w = Math.max(1, Math.round(b.width * dpr)); r.h = Math.max(1, Math.round(b.height * dpr));
      canvas.width = r.w; canvas.height = r.h;
      gl.viewport(0, 0, r.w, r.h);
      gl.uniform2f(u.res, r.w, r.h);
      gl.uniform2f(u.asp, r.w / r.h, 1);
    },
    dessiner({ lum, force, onde = 0, temps = 0, decal = 0 }) {
      gl.uniform2f(u.lum, lum[0], lum[1]);
      gl.uniform1f(u.force, force);
      gl.uniform1f(u.onde, onde);
      gl.uniform1f(u.temps, temps);
      gl.uniform1f(u.decal, decal);
      gl.uniform3fv(u.presse, r.presse);
      let actif = r.clic[2] < 1 ? 1 : 0;
      for (let i = 2; i < r.presse.length && !actif; i += 3) if (r.presse[i] > 0.01) actif = 1;
      gl.uniform1f(u.actif, actif);
      gl.uniform3f(u.clic, r.clic[0], r.clic[1], r.clic[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); canvas.remove(); r.perdu = true; });
  return r;
}

/* Creux : [0] suit le pointeur, [1..5] sont les empreintes laissées derrière lui, qui se résorbent. */
function empreintes() {
  const pts = Array.from({ length: N }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  let dernier = 0, appui = 0, vise = 0;
  return {
    pts,
    suivre(x, y, dedans) { pts[0].x = x; pts[0].y = y; vise = dedans ? 0.5 : 0; },
    appuyer(v) { appui = v ? 1 : 0; },
    pas(dt, t) {
      const cible = Math.max(vise, appui ? 0.95 : 0);
      pts[0].z += (cible - pts[0].z) * (1 - Math.exp(-dt * 9));
      if (t - dernier > 0.07 && pts[0].z > 0.05) {
        dernier = t;
        for (let i = N - 1; i > 1; i--) Object.assign(pts[i], pts[i - 1]);
        pts[1].x = pts[0].x; pts[1].y = pts[0].y; pts[1].z = pts[0].z * 0.8;
      }
      for (let i = 1; i < N; i++) pts[i].z *= Math.exp(-dt * 2.2);
      return pts.some((p) => p.z > 0.01);
    },
    ecrire(arr) { pts.forEach((p, i) => { arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; }); },
  };
}

/* Vitesse de défilement lissée, partagée (px par seconde). */
const defil = { v: 0, y: window.scrollY, t: performance.now() };
window.addEventListener('scroll', () => {
  const t = performance.now(), y = window.scrollY;
  const inst = ((y - defil.y) / Math.max(8, t - defil.t)) * 1000;
  defil.v += (inst - defil.v) * 0.35;
  defil.y = y; defil.t = t;
}, { passive: true });

function heros() {
  const figure = document.querySelector('.hero-media');
  if (!figure) return;
  const demarrer = () => {
    const img = figure.querySelector('img');
    if (!img || !img.complete || !img.naturalWidth) { img && img.addEventListener('load', demarrer, { once: true }); return; }
    const r = creerRendu('hero-lumiere');
    if (!r || !r.poser(figure)) return;
    new ResizeObserver(() => r.taille()).observe(figure);
    /* Premier dessin tout de suite : compilation et envoi de la texture payés à l'ouverture, pas au défilement. */
    r.dessiner({ lum: [0.72, 0.62], force: 0, temps: 0 });
    try { r.gl.finish(); } catch {}
    const e = empreintes();
    let cx = 0.72, cy = 0.62, tx = 0.72, ty = 0.62, force = 0, inactif = 0, temps = 0, cumul = 0, lents = 0;
    const local = (ev) => { const b = figure.getBoundingClientRect(); return [(ev.clientX - b.left) / b.width, 1 - (ev.clientY - b.top) / b.height, b]; };
    window.addEventListener('pointermove', (ev) => {
      if (ev.pointerType !== 'mouse') return;
      const [x, y] = local(ev);
      tx = x; ty = y; inactif = 0;
      e.suivre(x, y, x >= 0 && x <= 1 && y >= 0 && y <= 1 && ev.target.closest && !ev.target.closest('a, button, h1, p'));
    }, { passive: true });
    figure.parentElement.addEventListener('pointerdown', (ev) => {
      if (ev.pointerType !== 'mouse' || (ev.target.closest && ev.target.closest('a, button'))) return;
      const [x, y] = local(ev);
      r.clic = [x, y, 0]; e.appuyer(true);
    });
    window.addEventListener('pointerup', () => e.appuyer(false));
    suivreEtirement(r.canvas);
    boucle(r.canvas, (pas) => {
      cumul += pas;
      /* Pendant le défilement, la photo garde sa dernière image (elle s'étire comme les autres photos) :
         aucun calcul WebGL en plein défilement. */
      if (performance.now() - defil.t < 140) return;
      if (cumul < 1 / 62) return;
      const dt = Math.min(0.05, cumul);
      cumul = 0;
      const t0 = performance.now();
      temps += dt; inactif += dt;
      if (inactif > 2.5) { tx = 0.62 + Math.cos(temps * 0.35) * 0.22; ty = 0.55 + Math.sin(temps * 0.5) * 0.18; }
      const k = 1 - Math.exp(-dt * 5);
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      force += (1 - force) * (1 - Math.exp(-dt * 1.5));
      if (r.clic[2] < 1) r.clic[2] += dt * 0.9;
      e.pas(dt, temps);
      e.ecrire(r.presse);
      r.dessiner({ lum: [cx, cy], force, temps });
      if (performance.now() - t0 > 12) { if (++lents > 6 && r.qualite > 0.3) { r.qualite = r.qualite > 0.7 ? 0.6 : r.qualite > 0.45 ? 0.45 : 0.3; lents = 0; r.taille(); } } else lents = Math.max(0, lents - 1);
    }, { lourde: true });
    requestAnimationFrame(() => r.canvas.classList.add('visible'));
    window.addEventListener('pagehide', () => { r.canvas.style.transition = 'none'; r.canvas.classList.remove('visible'); });
    window.addEventListener('pageshow', (ev) => {
      if (!ev.persisted || r.perdu) return;
      requestAnimationFrame(() => { r.dessiner({ lum: [cx, cy], force, temps }); r.canvas.style.transition = ''; requestAnimationFrame(() => r.canvas.classList.add('visible')); });
    });
  };
  demarrer();
}

function survols() {
  let r = null, essaye = false, actif = null, sortie = 0, cumul = 0, temps = 0;
  const e = empreintes();
  let lx = 0.5, ly = 0.5, force = 0;
  const eligible = (f) => f && !f.classList.contains('hero-media') && !f.closest('[data-panier], [data-menu], dialog') && f.getBoundingClientRect().width >= 240;
  const quitter = () => { if (!actif) return; e.suivre(lx, ly, false); sortie = 1; };
  /* Pendant le défilement, les photos passent sous une souris immobile : on ne pose rien (aucun envoi de
     texture en plein défilement) ; le cuir se pose au premier vrai mouvement de souris. */
  let defile = 0;
  window.addEventListener('scroll', () => { defile = performance.now(); }, { passive: true });
  const survol = (ev) => {
    if (ev.pointerType !== 'mouse' || performance.now() - defile < 300) return;
    const f = ev.target.closest && ev.target.closest('main figure.media');
    if (f === actif) { sortie = 0; return; }
    if (!eligible(f)) { quitter(); return; }
    if (!essaye) { essaye = true; r = creerRendu('cuir'); if (r) boucle(r.canvas, tick, { lourde: true }); }
    if (!r || r.perdu) return;
    if (actif) r.canvas.classList.remove('visible');
    if (!r.poser(f)) { actif = null; return; }
    actif = f; sortie = 0; force = 0;
    e.pts.forEach((p) => { p.z = 0; });
    requestAnimationFrame(() => r.canvas.classList.add('visible'));
  };
  document.addEventListener('pointerover', survol, { passive: true });
  document.addEventListener('pointermove', (ev) => {
    if (!actif) { survol(ev); return; }
    if (ev.pointerType !== 'mouse') return;
    const b = actif.getBoundingClientRect();
    lx = (ev.clientX - b.left) / b.width; ly = 1 - (ev.clientY - b.top) / b.height;
    const dedans = lx >= 0 && lx <= 1 && ly >= 0 && ly <= 1;
    e.suivre(lx, ly, dedans);
    if (!dedans) quitter();
  }, { passive: true });
  document.addEventListener('pointerdown', (ev) => { if (actif && ev.pointerType === 'mouse' && actif.contains(ev.target)) { r.clic = [lx, ly, 0]; e.appuyer(true); } });
  window.addEventListener('pointerup', () => e.appuyer(false));
  function tick(pas) {
    if (!actif) return;
    cumul += pas;
    if (cumul < 1 / 62) return;
    const dt = Math.min(0.05, cumul);
    cumul = 0; temps += dt;
    force += ((sortie ? 0 : 1) - force) * (1 - Math.exp(-dt * 4));
    if (r.clic[2] < 1) r.clic[2] += dt * 0.9;
    const vivant = e.pas(dt, temps);
    e.ecrire(r.presse);
    const img = r.img;
    const decal = img && window.gsap ? (window.gsap.getProperty(img, 'yPercent') || 0) / 100 : 0;
    r.dessiner({ lum: [lx, ly], force, decal });
    /* Sortie : le cuir se résorbe, puis le canvas s'efface et la boucle s'arrête d'elle-même. */
    if (sortie && !vivant && force < 0.03) { r.canvas.classList.remove('visible'); actif = null; }
  }
}

/* Étirement des photos selon la vitesse de défilement (transformations seules). */
const vues = new Set();
let ioEtire = null;
function suivreEtirement(el) {
  if (!ioEtire) return;
  ioEtire.observe(el);
}
function etirements() {
  ioEtire = new IntersectionObserver((es) => es.forEach((en) => { const p = en.target; if (en.isIntersecting) vues.add(p); else { vues.delete(p); p.style.transform = ''; } }));
  document.querySelectorAll('main figure.media picture').forEach((p) => { if (!p.closest('.config-marquage-media, .vignette, [data-galerie]')) ioEtire.observe(p); });
  let a = 0, raf = 0, ecrit = '';
  const tick = () => {
    raf = 0;
    const cible = Math.max(-1, Math.min(1, defil.v / 3000));
    a += (cible - a) * 0.18;
    defil.v *= 0.9;
    const s = Math.abs(a) < 0.002 ? 0 : a;
    const val = s ? `scaleY(${(1 + Math.abs(s) * 0.06).toFixed(4)})` : '';
    if (val !== ecrit) {
      ecrit = val;
      vues.forEach((p) => { p.style.transformOrigin = s > 0 ? '50% 100%' : '50% 0%'; p.style.transform = val; });
    }
    if (s) raf = requestAnimationFrame(tick);
  };
  window.addEventListener('scroll', () => { if (!raf && !etat.calme) raf = requestAnimationFrame(tick); }, { passive: true });
}

/* Rendu WebGL logiciel (pas de vraie carte graphique : machine virtuelle, vieux pilote, navigateur de test) :
   chaque image coûterait au processeur ; les photos restent seules, sans cuir vivant. */
function rendLogiciel() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const nom = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    const perte = gl.getExtension('WEBGL_lose_context');
    perte && perte.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(nom);
  } catch { return true; }
}

export function initCuir() {
  if (etat.calme) return;
  etirements();
  if (!souris() || !matchMedia('(min-width: 901px)').matches) return;
  quand('pret', () => { if (rendLogiciel()) return; heros(); survols(); });
}
