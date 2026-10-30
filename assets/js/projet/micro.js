/* Micro-interactions : boutons magnétiques et cartes inclinables (souris seulement), images révélées le long
   d'une couture, parallaxe des grandes images, FAQ dépliée sans à-coup, tracé du plan d'accès,
   retour en haut (sous le voile pour un grand saut). Rien ne lit la mise en page pendant le défilement. */
import { etat, allerAncre } from '../socle/index.js?v=1';
import { souris } from './outils.js?v=1';

const gsap = () => window.gsap;

function magnetiques() {
  if (!souris() || etat.calme || !gsap()) return;
  document.querySelectorAll('[data-magnetique]').forEach((b) => {
    let r = null;
    b.addEventListener('pointerenter', () => { r = b.getBoundingClientRect(); });
    b.addEventListener('pointermove', (e) => {
      if (!r || e.pointerType !== 'mouse') return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      gsap().to(b, { x: Math.max(-8, Math.min(8, dx * 0.22)), y: Math.max(-6, Math.min(6, dy * 0.3)), duration: 0.35, ease: 'power3.out' });
    });
    b.addEventListener('pointerleave', () => { r = null; gsap().to(b, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, .5)' }); });
  });
}

function inclinaisons() {
  if (!souris() || etat.calme || !gsap()) return;
  document.querySelectorAll('[data-incline]').forEach((c) => {
    let r = null;
    c.addEventListener('pointerenter', () => { r = c.getBoundingClientRect(); });
    c.addEventListener('pointermove', (e) => {
      if (!r || e.pointerType !== 'mouse') return;
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      gsap().to(c, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
    });
    c.addEventListener('pointerleave', () => { r = null; gsap().to(c, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' }); });
  });
}

function revelations() {
  const els = document.querySelectorAll('.revele-couture');
  if (!els.length) return;
  if (etat.calme) { els.forEach((e) => e.classList.add('revele')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revele'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  els.forEach((e) => io.observe(e));
}

function parallaxes() {
  const ST = window.ScrollTrigger;
  if (etat.calme || !gsap() || !ST) return;
  document.querySelectorAll('.parallaxe').forEach((f) => {
    const img = f.querySelector('img');
    if (!img) return;
    gsap().fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* FAQ : ouverture et fermeture animées en hauteur (WAAPI), état final exact. */
function faq() {
  document.querySelectorAll('.faq-item').forEach((d) => {
    const s = d.querySelector('summary'), corps = d.querySelector('.faq-reponse');
    if (!s || !corps) return;
    let anim = null;
    s.addEventListener('click', (e) => {
      if (etat.calme) return;
      e.preventDefault();
      anim && anim.cancel();
      if (!d.open) {
        d.open = true;
        const h = corps.scrollHeight;
        anim = corps.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
      } else {
        const h = corps.scrollHeight;
        anim = corps.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.4,0,.2,1)' });
        anim.onfinish = () => { d.open = false; anim = null; };
      }
    });
  });
}

function plan() {
  const svg = document.querySelector('.plan-svg');
  if (!svg || etat.calme || !gsap()) return;
  /* États de départ posés par le CSS (fleuve non tracé, repère et route cachés). */
  const rhone = svg.querySelector('.plan-rhone');
  const repere = svg.querySelector('[data-plan-repere]');
  const route = svg.querySelector('.plan-route');
  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    gsap().timeline()
      .fromTo(rhone, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
      .fromTo(repere, { opacity: 0, scale: 2.2, svgOrigin: '117 250' }, { opacity: 1, scale: 1, svgOrigin: '117 250', duration: 0.6, ease: 'back.out(2)' }, 0.9)
      .fromTo(route, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.2);
  }, { rootMargin: '0px 0px -15% 0px' });
  io.observe(svg);
}

function retourHaut() {
  document.querySelectorAll('[data-retour-haut]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); allerAncre('#haut'); }));
}

export function initMicro() {
  magnetiques();
  inclinaisons();
  revelations();
  parallaxes();
  faq();
  plan();
  retourHaut();
}
