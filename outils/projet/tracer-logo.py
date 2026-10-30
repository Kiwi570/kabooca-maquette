#!/usr/bin/env python3
"""Vectorise le logo cigale (PNG du site actuel) en tracés SVG : emblème et mot KABOOÇA séparés.
Usage : python3 outils/projet/tracer-logo.py  ->  source/gabarits/logo-traces.json"""
import json, numpy as np, cv2
from pathlib import Path
R = Path(__file__).resolve().parents[2]
img = cv2.imread(str(R / 'recu/site/logo-cigale-empile.png'), cv2.IMREAD_UNCHANGED)
a = img[:, :, 3]
K = 6
big = cv2.resize(a, (a.shape[1] * K, a.shape[0] * K), interpolation=cv2.INTER_CUBIC)
big = cv2.GaussianBlur(big, (0, 0), 1.2)
_, bw = cv2.threshold(big, 127, 255, cv2.THRESH_BINARY)
n, lab, stats, _ = cv2.connectedComponentsWithStats(bw)
comp = sorted([(stats[i][1], i) for i in range(1, n) if stats[i][4] > 200 * K])
print('composants', [(tuple(stats[i][:4] // K)) for _, i in comp])
def tracer(mask):
    cs, h = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    d = []
    for c in cs:
        if cv2.contourArea(c) < 30 * K: continue
        ap = cv2.approxPolyDP(c, 0.9, True)[:, 0, :] / K
        d.append('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in ap) + 'Z')
    return ' '.join(d)
ys = [stats[i][1] for _, i in comp]
emb = np.zeros_like(bw); mot = np.zeros_like(bw)
for _, i in comp:
    x, y, w, h, s = stats[i]
    (emb if y / K < 300 else mot)[lab == i] = 255
def boite(m):
    ys_, xs_ = np.where(m > 0); return [float(xs_.min() / K), float(ys_.min() / K), float((xs_.max() + 1) / K), float((ys_.max() + 1) / K)]
res = {'embleme': {'d': tracer(emb), 'boite': boite(emb)}, 'mot': {'d': tracer(mot), 'boite': boite(mot)}}
(R / 'source/gabarits/logo-traces.json').write_text(json.dumps(res))
print({k: (v['boite'], len(v['d'])) for k, v in res.items()})
