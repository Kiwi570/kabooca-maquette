/* Lumière rasante (WebGL) sur la photo d'ouverture de l'accueil : le relief du cuir et de la toile, tiré de
   la luminance de l'image, est éclairé par une lumière qui suit la souris. Ordinateur et souris seulement,
   après l'ouverture ; arrêtée hors écran et onglet caché (boucle du socle) ; densité de pixels limitée à 1,25 ;
   qualité réduite d'elle-même si les images prennent trop de temps. Sans WebGL : la photo seule. */
import { boucle, quand, etat } from '../socle/index.js?v=1';
import { souris } from './outils.js?v=1';

const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FS = `precision mediump float;
uniform sampler2D t; uniform vec2 res; uniform vec2 img; uniform vec2 pos; uniform vec2 lum; uniform float force;
varying vec2 v;
float L(vec2 q){ return dot(texture2D(t, q).rgb, vec3(.299, .587, .114)); }
void main(){
  float rs = res.x / res.y, ri = img.x / img.y;
  vec2 s = rs > ri ? vec2(1., ri / rs) : vec2(rs / ri, 1.);
  vec2 uv = (1. - s) * pos + v * s;
  vec3 base = texture2D(t, uv).rgb;
  vec2 px = 1.25 / img;
  float hx = L(uv + vec2(px.x, 0.)) - L(uv - vec2(px.x, 0.));
  float hy = L(uv + vec2(0., px.y)) - L(uv - vec2(0., px.y));
  vec3 n = normalize(vec3(-hx * 5.5, -hy * 5.5, 1.));
  vec2 a = vec2(rs, 1.);
  vec3 dir = normalize(vec3((lum - v) * a, .42));
  float d = distance(v * a, lum * a);
  float halo = exp(-d * d * 2.6);
  float diff = dot(n, dir) - dir.z;
  vec3 col = base * (1. + diff * 1.9 * halo * force) + vec3(1., .94, .82) * .045 * halo * force;
  gl_FragColor = vec4(col, 1.);
}`;

export function initLumiere() {
  const figure = document.querySelector('.hero-media');
  if (!figure || etat.calme || !souris() || !matchMedia('(min-width: 901px)').matches) return;
  quand('pret', () => demarrer(figure));
}

function demarrer(figure) {
  const img = figure.querySelector('img');
  if (!img || !img.complete || !img.naturalWidth) { img && img.addEventListener('load', () => demarrer(figure), { once: true }); return; }
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-lumiere';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-audit-ignorer', '');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
  if (!gl) return;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); } catch { return; }
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const U = (n) => gl.getUniformLocation(prog, n);
  const u = { res: U('res'), img: U('img'), pos: U('pos'), lum: U('lum'), force: U('force') };
  const [px, py] = (getComputedStyle(img).objectPosition || '50% 50%').split(' ').map((x) => parseFloat(x) / 100);
  gl.uniform2f(u.img, img.naturalWidth, img.naturalHeight);
  gl.uniform2f(u.pos, isNaN(px) ? 0.5 : px, 1 - (isNaN(py) ? 0.5 : py));
  figure.appendChild(canvas);

  let qualite = 1, lents = 0, w = 0, h = 0;
  const taille = () => {
    const r = figure.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * qualite;
    w = Math.max(1, Math.round(r.width * dpr)); h = Math.max(1, Math.round(r.height * dpr));
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.res, w, h);
  };
  taille();
  new ResizeObserver(taille).observe(figure);

  let cx = 0.72, cy = 0.62, tx = 0.72, ty = 0.62, force = 0, inactif = 0, temps = 0, cumul = 0;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = figure.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height;
    inactif = 0;
  }, { passive: true });

  boucle(canvas, (pas) => {
    /* Plafonné à 60 images par seconde, même sur un écran plus rapide. */
    cumul += pas;
    if (cumul < 1 / 62) return;
    const dt = Math.min(0.05, cumul);
    cumul = 0;
    const t0 = performance.now();
    temps += dt; inactif += dt;
    /* Sans mouvement de souris, la lumière dérive lentement sur le cuir. */
    if (inactif > 2.5) { tx = 0.62 + Math.cos(temps * 0.35) * 0.22; ty = 0.55 + Math.sin(temps * 0.5) * 0.18; }
    const k = 1 - Math.exp(-dt * 5);
    cx += (tx - cx) * k; cy += (ty - cy) * k;
    force += (1 - force) * (1 - Math.exp(-dt * 1.5));
    gl.uniform2f(u.lum, cx, cy);
    gl.uniform1f(u.force, force);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    /* Images trop lentes : on baisse la résolution, une fois pour toutes. */
    if (performance.now() - t0 > 12 || dt > 0.03) { if (++lents > 30 && qualite > 0.6) { qualite = 0.6; taille(); } } else lents = Math.max(0, lents - 1);
  }, { lourde: true });
  requestAnimationFrame(() => canvas.classList.add('visible'));
  /* Retour arrière depuis le cache : le dessin WebGL est perdu ; le canvas se cache avant le départ
     et ne revient (en fondu, sur la même photo) qu'une fois redessiné. Contexte perdu : la photo seule. */
  window.addEventListener('pagehide', () => { canvas.style.transition = 'none'; canvas.classList.remove('visible'); });
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    requestAnimationFrame(() => { gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); canvas.style.transition = ''; requestAnimationFrame(() => canvas.classList.add('visible')); });
  });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); canvas.remove(); });
}
