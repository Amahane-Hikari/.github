// Generates the SVG artwork used by profile/README.md  ·  design t002 "Eternal Ice"
//   node scripts/build-profile-assets.mjs
// No dependencies. Every SVG is self-contained (system font stacks, no external requests)
// and carries its own dark background, so it reads the same in GitHub light and dark themes.
// Motifs — eternal ice, ice arrows, instant photos, the 03.07 calendar page — are original
// vector drawings; no official artwork is used.
import fs from 'node:fs';
import path from 'node:path';

const out = path.join(import.meta.dirname, '..', 'profile', 'assets');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'projects'), { recursive: true });

const SANS = "'Segoe UI','Helvetica Neue','PingFang SC','Microsoft YaHei','Noto Sans CJK SC',Arial,sans-serif";
const MONO = "ui-monospace,'SFMono-Regular','Cascadia Mono',Consolas,'Liberation Mono',monospace";
const C = {
  panel: '#0D1230', line: '#2E3A72',
  pink: '#FF8FC0', pink2: '#FFC6DF', hot: '#FF5FA2', ice: '#8FD3FF', ice2: '#D2F0FF', lav: '#B9A8FF',
  text: '#F0F5FF', mute: '#9AA6CC', lock: '#7CF0B5', amber: '#FFD28A', peach: '#FFB38A',
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (name, svg) => fs.writeFileSync(path.join(out, name), svg.replace(/\n\s*\n/g, '\n'));
const f1 = (n) => Math.round(n * 10) / 10;
const f3 = (n) => Math.round(n * 1000) / 1000;
const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const svgOpen = (w, h, title, desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<style>
  text{font-family:${SANS}}
  .m{font-family:${MONO}}
  @keyframes tw{0%,100%{opacity:.15;transform:scale(.55)}50%{opacity:1;transform:scale(1)}}
  @keyframes bob{50%{transform:translateY(-10px)}}
  @keyframes pulse{50%{opacity:.3}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;

// ---------- shared defs ----------
const baseDefs = (W) => `
<linearGradient id="bg" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#060918"/><stop offset=".5" stop-color="#101538"/><stop offset="1" stop-color="#241848"/></linearGradient>
<linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.ice}"/></linearGradient>
<linearGradient id="prism" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${f1(W / 2)}" y2="0" spreadMethod="repeat">
  <stop offset="0" stop-color="${C.pink}"/><stop offset=".2" stop-color="${C.pink2}"/><stop offset=".38" stop-color="#FFFFFF"/><stop offset=".56" stop-color="${C.ice}"/><stop offset=".78" stop-color="${C.lav}"/><stop offset="1" stop-color="${C.pink}"/>
  <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="${f1(W / 2)} 0" dur="6s" repeatCount="indefinite"/>
</linearGradient>
<linearGradient id="tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.ice}" stop-opacity="0"/><stop offset=".7" stop-color="${C.ice}" stop-opacity=".65"/><stop offset="1" stop-color="#fff"/></linearGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="crys" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".45" stop-color="${C.ice2}" stop-opacity=".7"/><stop offset="1" stop-color="#4FA8E8" stop-opacity=".25"/></linearGradient>
<linearGradient id="auroraP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.pink}" stop-opacity="0"/><stop offset=".4" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.lav}" stop-opacity="0"/></linearGradient>
<linearGradient id="auroraI" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.ice}" stop-opacity="0"/><stop offset=".6" stop-color="${C.ice}"/><stop offset="1" stop-color="${C.ice}" stop-opacity="0"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glowL" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="24"/></filter>`;

// ---------- motifs ----------
function snow(cx, cy, r, stroke, sw = 2, extra = '') {
  let s = `<g transform="translate(${f1(cx)} ${f1(cy)})" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" fill="none" ${extra}>`;
  for (let i = 0; i < 6; i++) {
    s += `<path transform="rotate(${i * 60})" d="M0 0V${f1(-r)}M0 ${f1(-r * 0.55)}L${f1(r * 0.22)} ${f1(-r * 0.78)}M0 ${f1(-r * 0.55)}L${f1(-r * 0.22)} ${f1(-r * 0.78)}M0 ${f1(-r * 0.3)}L${f1(r * 0.14)} ${f1(-r * 0.42)}M0 ${f1(-r * 0.3)}L${f1(-r * 0.14)} ${f1(-r * 0.42)}"/>`;
  }
  return s + '</g>';
}
const spin = (cx, cy, dur, dir = 1) =>
  `<animateTransform attributeName="transform" type="rotate" from="0 ${f1(cx)} ${f1(cy)}" to="${360 * dir} ${f1(cx)} ${f1(cy)}" dur="${dur}s" repeatCount="indefinite"/>`;
const starPath = (x, y, s) => `M${f1(x)} ${f1(y - s)}Q${f1(x)} ${f1(y)} ${f1(x + s)} ${f1(y)}Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y + s)}Q${f1(x)} ${f1(y)} ${f1(x - s)} ${f1(y)}Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y - s)}Z`;
const sparkle = (x, y, s, fill, delay = 0, dur = 3.2) =>
  `<path d="${starPath(x, y, s)}" fill="${fill}" filter="url(#glow)" style="transform-origin:${f1(x)}px ${f1(y)}px;animation:tw ${dur}s ease-in-out ${delay}s infinite"/>`;
const hexPts = (cx, cy, r, off = 0) => Array.from({ length: 6 }, (_, i) => {
  const a = ((i * 60 + off - 90) * Math.PI) / 180;
  return `${f1(cx + r * Math.cos(a))},${f1(cy + r * Math.sin(a))}`;
}).join(' ');

function stars(W, H, n, seed) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const d = f1(2 + r() * 4);
    s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(0.5 + r() * 1.3)}" fill="${['#fff', C.ice2, C.pink2][i % 3]}"><animate attributeName="opacity" values=".1;1;.1" dur="${d}s" begin="-${f1(r() * d)}s" repeatCount="indefinite"/></circle>`;
  }
  return s;
}

function snowfall(W, H, n, seed, { min = 8, max = 16, op = 0.85 } = {}) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = f1(r() * W), drift = f1((r() - 0.5) * 90), d = f1(min + r() * (max - min)), big = r() < 0.3;
    const size = f1(big ? 4 + r() * 4 : 0.9 + r() * 1.6);
    const shape = big
      ? `<g>${snow(0, 0, size, C.ice2, 1.1)}${spin(0, 0, f1(6 + r() * 6), r() < 0.5 ? 1 : -1)}</g>`
      : `<circle r="${size}" fill="#fff"/>`;
    s += `<g opacity="${f1(op * (0.45 + r() * 0.55))}">${shape}<animateTransform attributeName="transform" type="translate" values="${x} -12;${f1(x + drift)} ${H + 12}" dur="${d}s" begin="-${f1(r() * d)}s" repeatCount="indefinite"/></g>`;
  }
  return s;
}

const arrowShape = (len) => `<rect x="${-len}" y="-1.8" width="${len}" height="3.6" rx="1.8" fill="url(#tail)"/><path d="M0 -7L22 0L0 7L5 0Z" fill="#fff"/><path d="M${-len + 8} 0l-12 -7M${-len + 8} 0l-12 7M${-len + 20} 0l-12 -7M${-len + 20} 0l-12 7" stroke="${C.ice2}" stroke-width="2" stroke-linecap="round"/>`;

// A volley of ice arrows: each streaks in, lands, and bursts into frost.
function volley(n, seed, { xs = [0, 1200], ys = [200, 400], ang = 112, len = 150, dur = 3.6, travel = 520 } = {}) {
  const r = rng(seed);
  const rad = (ang * Math.PI) / 180, dx = Math.cos(rad), dy = Math.sin(rad);
  let s = '';
  for (let i = 0; i < n; i++) {
    const ex = f1(xs[0] + r() * (xs[1] - xs[0])), ey = f1(ys[0] + r() * (ys[1] - ys[0]));
    const sx = f1(ex - dx * travel), sy = f1(ey - dy * travel);
    const d = f1(dur * (0.8 + r() * 0.6)), b = f1(r() * d);
    const tm = `dur="${d}s" begin="-${b}s" repeatCount="indefinite"`;
    s += `<g opacity="0"><animateTransform attributeName="transform" type="translate" values="${sx} ${sy};${ex} ${ey};${ex} ${ey}" keyTimes="0;.26;1" ${tm}/><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.04;.25;.31;1" ${tm}/>
<g transform="rotate(${ang})" filter="url(#glow)">${arrowShape(len)}</g></g>
<g transform="translate(${ex} ${ey})" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.25;.27;.45;1" ${tm}/>
<circle r="4" fill="none" stroke="${C.ice2}" stroke-width="2"><animate attributeName="r" values="2;2;28;28" keyTimes="0;.26;.45;1" ${tm}/></circle>${snow(0, 0, 12, '#fff', 1.6)}</g>`;
  }
  return s;
}

function aurora(W, y, h, seed) {
  const r = rng(seed);
  const wave = (amp, ph) => {
    let d = `M0 ${y}`;
    for (let x = 0; x <= W; x += W / 6) d += ` Q${f1(x + W / 12)} ${f1(y + Math.sin(x / 140 + ph) * amp - amp)} ${f1(x + W / 6)} ${f1(y + Math.cos(x / 170 + ph) * amp * 0.6)}`;
    return d + ` V${y + h} H0Z`;
  };
  const band = (grad, op, ph) =>
    `<path d="${wave(28, ph)}" fill="url(#${grad})" opacity="${op}" filter="url(#soft)"><animate attributeName="d" values="${wave(28, ph)};${wave(44, ph + 1.6)};${wave(28, ph)}" dur="${f1(10 + r() * 6)}s" repeatCount="indefinite"/></path>`;
  return band('auroraP', 0.42, r() * 6) + band('auroraI', 0.34, r() * 6);
}

function shard(x, y, s, rot, k = 0) {
  const w = s * 0.34, h = s;
  const pts = `0,${-h} ${f1(w)},${f1(-h * 0.55)} ${f1(w)},${f1(h * 0.55)} 0,${h} ${f1(-w)},${f1(h * 0.55)} ${f1(-w)},${f1(-h * 0.55)}`;
  const facet = `0,${-h} ${f1(w)},${f1(-h * 0.55)} ${f1(w)},${f1(h * 0.55)} 0,${h}`;
  return `<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="${4 + (k % 3)}s" begin="-${k}s" repeatCount="indefinite"/>
<g transform="rotate(${rot})" filter="url(#glow)"><polygon points="${pts}" fill="url(#crys)" stroke="#fff" stroke-opacity=".8" stroke-width="1.2"/><polygon points="${facet}" fill="#3F8FD8" fill-opacity=".3"/><path d="M0 ${-h}V${h}" stroke="#fff" stroke-opacity=".55"/></g></g></g>`;
}

// ---------- instant photos ----------
const photos = {
  sunset: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9EC8"/><stop offset=".62" stop-color="#FFCBA8"/><stop offset="1" stop-color="#8FD3FF"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/><circle cx="${f1(w * 0.62)}" cy="${f1(h * 0.6)}" r="${f1(h * 0.18)}" fill="#FFF4E6"/><rect y="${f1(h * 0.7)}" width="${w}" height="${f1(h * 0.3)}" fill="#6FA9E8" opacity=".9"/>
<path d="M${f1(w * 0.1)} ${f1(h * 0.8)}H${f1(w * 0.45)}M${f1(w * 0.55)} ${f1(h * 0.9)}H${f1(w * 0.9)}" stroke="#fff" stroke-opacity=".75" stroke-width="2"/><path d="${starPath(w * 0.22, h * 0.24, 6)}" fill="#fff"/>`,
  night: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1A4A"/><stop offset="1" stop-color="#4A3380"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/>${[[0.15, 0.2], [0.8, 0.15], [0.7, 0.75], [0.25, 0.8], [0.5, 0.1]].map(([a, b]) => `<circle cx="${f1(w * a)}" cy="${f1(h * b)}" r="1.4" fill="#fff"/>`).join('')}${snow(w / 2, h / 2, h * 0.32, C.ice2, 2.2)}`,
  train: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2D7A"/><stop offset=".7" stop-color="#B7A6FF"/><stop offset="1" stop-color="#FF8FC0"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/><path d="M-4 ${f1(h * 0.5)}Q${f1(w * 0.5)} ${f1(h * 0.05)} ${w + 4} ${f1(h * 0.3)}" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 5" opacity=".8"/>
<path d="M0 ${f1(h * 0.82)}H${w}" stroke="#1A1F45" stroke-width="3"/>${[0, 1, 2].map((i) => `<rect x="${f1(w * 0.12 + i * w * 0.26)}" y="${f1(h * 0.62)}" width="${f1(w * 0.24)}" height="${f1(h * 0.18)}" rx="3" fill="#1A1F45"/><rect x="${f1(w * 0.16 + i * w * 0.26)}" y="${f1(h * 0.66)}" width="${f1(w * 0.07)}" height="${f1(h * 0.06)}" fill="${C.amber}"/>`).join('')}`,
  ice: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8F7FF"/><stop offset="1" stop-color="#7FBDF0"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/>${[[0.3, 0.55, 0.42, -15], [0.62, 0.5, 0.5, 10], [0.82, 0.68, 0.3, 25]].map(([a, b, s, rot]) => `<g transform="translate(${f1(w * a)} ${f1(h * b)}) rotate(${rot})"><polygon points="0,${f1(-h * s)} ${f1(h * s * 0.3)},${f1(-h * s * 0.5)} ${f1(h * s * 0.3)},${f1(h * s * 0.5)} 0,${f1(h * s)} ${f1(-h * s * 0.3)},${f1(h * s * 0.5)} ${f1(-h * s * 0.3)},${f1(-h * s * 0.5)}" fill="#fff" fill-opacity=".7" stroke="#4F8FD0" stroke-opacity=".6"/></g>`).join('')}`,
  camera: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC6DF"/><stop offset="1" stop-color="#B9A8FF"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/><g transform="translate(${f1(w / 2)} ${f1(h / 2 + 4)})"><rect x="-26" y="-17" width="52" height="34" rx="7" fill="#26305F"/><rect x="-10" y="-23" width="20" height="8" rx="2" fill="#26305F"/><circle r="11" fill="${C.ice}" stroke="#fff" stroke-width="3"/><rect x="14" y="-22" width="8" height="5" rx="2" fill="${C.hot}"/></g>`,
};
function tinted(tint, glyph) {
  return (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="#1A2350"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/><g transform="translate(${f1(w / 2)} ${f1(h / 2)})">${glyph}</g>`;
}

function polaroid(x, y, rot, w, h, photo, caption, id, { tape = C.pink, swing = 0, dur = 4 } = {}) {
  const pad = 7, ph = h - pad - 28;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${swing ? `<g><animateTransform attributeName="transform" type="rotate" values="${-swing};${swing};${-swing}" dur="${dur}s" repeatCount="indefinite"/>` : '<g>'}
<rect x="${f1(-w / 2 + 4)}" y="6" width="${w}" height="${h}" rx="3" fill="#000" opacity=".4"/>
<rect x="${f1(-w / 2)}" y="0" width="${w}" height="${h}" rx="3" fill="#F7F4FF"/>
<clipPath id="${id}"><rect x="${f1(-w / 2 + pad)}" y="${pad}" width="${w - 2 * pad}" height="${ph}"/></clipPath>
<g clip-path="url(#${id})"><g transform="translate(${f1(-w / 2 + pad)} ${pad})">${photo(w - 2 * pad, ph, id)}</g></g>
<text x="0" y="${h - 9}" text-anchor="middle" font-size="13" font-style="italic" font-weight="700" fill="#5B5F86">${esc(caption)}</text>
<rect x="-18" y="-9" width="36" height="15" fill="${tape}" opacity=".8" transform="rotate(-5)"/></g></g>`;
}

// ---------- the eternal ice ----------
// A hexagonal prism of ice with 03.07 frozen inside; cracks race across it and light pours out.
function eternalIce(cx, cy) {
  const P = {
    top: [cx, cy - 200], tl: [cx - 96, cy - 128], tr: [cx + 96, cy - 128], tcL: [cx - 34, cy - 112], tcR: [cx + 34, cy - 112],
    bl: [cx - 96, cy + 118], br: [cx + 96, cy + 118], bcL: [cx - 34, cy + 136], bcR: [cx + 34, cy + 136], bot: [cx, cy + 196],
  };
  const pt = (k) => P[k].join(',');
  const outline = ['top', 'tr', 'br', 'bot', 'bl', 'tl'].map(pt).join(' ');
  const faces = [
    [['tl', 'tcL', 'bcL', 'bl'], '#fff', 0.26],
    [['tcL', 'tcR', 'bcR', 'bcL'], C.ice2, 0.12],
    [['tcR', 'tr', 'br', 'bcR'], '#5FA6EE', 0.3],
    [['top', 'tcL', 'tl'], '#fff', 0.5],
    [['top', 'tcR', 'tcL'], '#fff', 0.32],
    [['top', 'tr', 'tcR'], C.ice, 0.4],
    [['bl', 'bcL', 'bot'], C.lav, 0.3],
    [['bcL', 'bcR', 'bot'], C.pink, 0.22],
    [['bcR', 'br', 'bot'], '#5FA6EE', 0.36],
  ].map(([ks, col, op]) => `<polygon points="${ks.map(pt).join(' ')}" fill="${col}" fill-opacity="${op}"/>`).join('');
  const edges = [['top', 'tcL'], ['top', 'tcR'], ['tcL', 'bcL'], ['tcR', 'bcR'], ['tcL', 'tcR'], ['bcL', 'bcR'], ['bcL', 'bot'], ['bcR', 'bot'], ['tl', 'tcL'], ['tcR', 'tr'], ['bl', 'bcL'], ['bcR', 'br']]
    .map(([a, b]) => `M${pt(a).replace(',', ' ')}L${pt(b).replace(',', ' ')}`).join('');
  const cracks = [
    `M${cx} ${cy - 10}L${cx - 40} ${cy - 70}L${cx - 70} ${cy - 92}`, `M${cx} ${cy - 10}L${cx + 52} ${cy - 44}L${cx + 90} ${cy - 40}`,
    `M${cx} ${cy - 10}L${cx + 30} ${cy + 64}L${cx + 58} ${cy + 108}`, `M${cx} ${cy - 10}L${cx - 50} ${cy + 50}L${cx - 88} ${cy + 64}`,
    `M${cx} ${cy - 10}L${cx - 6} ${cy - 120}`,
  ];
  return `
<ellipse cx="${cx}" cy="${cy + 214}" rx="190" ry="22" fill="${C.ice}" opacity=".3" filter="url(#soft)"/>
<circle cx="${cx}" cy="${cy}" r="230" fill="url(#halo)"><animate attributeName="r" values="210;250;210" dur="5s" repeatCount="indefinite"/></circle>
<g>${spin(cx, cy, 70)}<polygon points="${hexPts(cx, cy, 236)}" fill="none" stroke="${C.pink}" stroke-opacity=".4" stroke-width="1.5"/><polygon points="${hexPts(cx, cy, 236, 30)}" fill="none" stroke="${C.ice}" stroke-opacity=".25" stroke-dasharray="2 8"/></g>
<g opacity=".14">${spin(cx, cy, 150, -1)}${snow(cx, cy, 250, C.ice2, 3)}</g>
<g>${spin(cx, cy, 40, -1)}<circle cx="${cx}" cy="${cy}" r="214" fill="none" stroke="${C.lav}" stroke-opacity=".4" stroke-dasharray="10 14"/></g>
<circle r="5" fill="#fff" filter="url(#glow)"><animateMotion dur="8s" repeatCount="indefinite" path="M${cx - 222} ${cy}a222 222 0 1 1 444 0a222 222 0 1 1 -444 0"/></circle>
<circle r="4" fill="${C.pink}" filter="url(#glow)"><animateMotion dur="12s" repeatCount="indefinite" path="M${cx - 200} ${cy}a200 200 0 1 0 400 0a200 200 0 1 0 -400 0"/></circle>
<g style="animation:bob 6s ease-in-out infinite">
<g filter="url(#glowL)"><polygon points="${outline}" fill="#9CD8FF" fill-opacity=".14" stroke="#fff" stroke-opacity=".9" stroke-width="2.4"/></g>
${faces}
<path d="${edges}" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" fill="none"/>
<g clip-path="url(#iceclip)">
  <circle cx="${cx}" cy="${cy - 6}" r="60" fill="${C.pink}" opacity=".4" filter="url(#soft)"><animate attributeName="opacity" values=".25;.6;.25" dur="3.5s" repeatCount="indefinite"/></circle>
  <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="58" font-weight="900" fill="url(#prism)" filter="url(#glow)" textLength="168" lengthAdjust="spacingAndGlyphs">03.07</text>
  <text x="${cx}" y="${cy + 42}" text-anchor="middle" class="m" font-size="12" fill="#fff" letter-spacing="4" opacity=".9">ETERNAL · ICE</text>
  ${cracks.map((d, i) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="170" stroke-dashoffset="170" filter="url(#glow)"><animate attributeName="stroke-dashoffset" values="170;170;0;0;170" keyTimes="0;${f1(0.08 + i * 0.06)};${f1(0.3 + i * 0.06)};.9;1" dur="7s" repeatCount="indefinite"/></path>`).join('')}
  <rect x="${cx - 260}" y="${cy - 220}" width="90" height="440" fill="url(#sheen)" transform="skewX(-18)"><animate attributeName="x" values="${cx - 260};${cx + 260};${cx + 260}" keyTimes="0;.32;1" dur="4.5s" repeatCount="indefinite"/></rect>
</g>
</g>
${shard(cx - 150, cy + 170, 40, -28, 0)}${shard(cx + 152, cy + 176, 34, 24, 1)}${shard(cx - 196, cy + 112, 22, -48, 2)}${shard(cx + 196, cy - 150, 18, 36, 1.5)}${shard(cx - 180, cy - 170, 14, -30, 3)}`;
}

// ---------- hero ----------
function hero() {
  const W = 1200, H = 600, CX = 280, CY = 270;
  const tick = '三月七 ✦ MARCH 7TH ✦ 03.07 ✦ WEB APPS ✦ DEVELOPER TOOLS ✦ MINECRAFT AUTOMATION ✦ 咔嚓 ✦ ';
  const icePoly = (() => {
    const p = [[CX, CY - 200], [CX + 96, CY - 128], [CX + 96, CY + 118], [CX, CY + 196], [CX - 96, CY + 118], [CX - 96, CY - 128]];
    return p.map((q) => q.join(',')).join(' ');
  })();
  return `${svgOpen(W, H, 'March7th · 团队主页', '一块永不融化的冰里冻着 03.07，冰箭划过夜空，拍立得在周围漂浮。March7thTeam：把好奇心写成工具，把想象力做成交互。')}
<defs>${baseDefs(W)}
<radialGradient id="halo"><stop offset="0" stop-color="${C.ice}" stop-opacity=".34"/><stop offset=".5" stop-color="${C.pink}" stop-opacity=".12"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<radialGradient id="burst"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="${C.ice2}" stop-opacity=".5"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<clipPath id="round"><rect width="${W}" height="${H}" rx="28"/></clipPath>
<clipPath id="iceclip"><polygon points="${icePoly}"/></clipPath>
<clipPath id="t1"><text x="560" y="236" font-size="128" font-weight="900" textLength="590" lengthAdjust="spacingAndGlyphs">MARCH</text></clipPath>
<style>@keyframes tick{to{transform:translateX(-50%)}}
@keyframes rise{0%{transform:translateY(16px);opacity:0}100%{transform:none;opacity:1}}</style>
</defs>
<g clip-path="url(#round)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${aurora(W, 40, 140, 7)}
${stars(W, H, 90, 37)}
${volley(8, 307, { xs: [40, 430], ys: [440, 540], ang: 104, travel: 600, len: 170 })}
${eternalIce(CX, CY)}
${polaroid(118, 64, -16, 112, 134, photos.sunset, '03.07 ♡', 'pA', { tape: C.pink, swing: 3, dur: 5 })}
${polaroid(452, 360, 12, 104, 124, photos.camera, '咔嚓!', 'pB', { tape: C.ice, swing: 3, dur: 4.4 })}
${polaroid(440, 70, 9, 92, 112, photos.train, 'next stop', 'pC', { tape: C.lav, swing: 2, dur: 6 })}
${snowfall(W, H, 56, 703)}

<!-- ticker -->
<rect x="0" y="${H - 52}" width="${W}" height="52" fill="#05070F" opacity=".85"/>
<path d="M0 ${H - 52}H${W}" stroke="url(#brand)" stroke-width="2"/>
<g style="transform-box:fill-box;animation:tick 26s linear infinite"><text x="0" y="${H - 19}" class="m" font-size="18" font-weight="700" fill="url(#prism)" letter-spacing="3">${esc(tick.repeat(4))}</text></g>
</g>

<!-- type -->
<g transform="translate(562 82)"><rect width="262" height="36" rx="18" fill="${C.pink}" fill-opacity=".16" stroke="${C.pink}" stroke-opacity=".9" filter="url(#glow)"/>
<g>${spin(22, 18, 8)}${snow(22, 18, 10, C.pink2, 2)}</g><text x="42" y="25" font-size="18" font-weight="800" fill="${C.pink2}" letter-spacing="2">三月七 · MARCH 7TH</text></g>
<text x="842" y="106" class="m" font-size="14" fill="${C.ice}" letter-spacing="3">TEAM · EST. 2022</text>

<g fill="url(#prism)" filter="url(#glowL)"><text x="560" y="236" font-size="128" font-weight="900" textLength="590" lengthAdjust="spacingAndGlyphs">MARCH</text></g>
<g clip-path="url(#t1)"><rect x="300" y="110" width="150" height="150" fill="url(#sheen)" transform="skewX(-20)"><animate attributeName="x" values="300;1300;1300" keyTimes="0;.4;1" dur="5s" repeatCount="indefinite"/></rect></g>

<text x="556" y="392" font-size="168" font-weight="900" fill="#fff" fill-opacity=".05" stroke="url(#prism)" stroke-width="3.2" textLength="350" lengthAdjust="spacingAndGlyphs" filter="url(#glow)">7TH</text>
<g transform="translate(934 300)">
  <text x="0" y="0" font-size="50" font-weight="900" fill="${C.pink2}" filter="url(#glow)">三月七</text>
  <rect x="0" y="16" width="200" height="4" rx="2" fill="url(#brand)"/>
  <text x="0" y="48" class="m" font-size="15" fill="${C.ice2}" letter-spacing="2">ICE · ARROW · SNAP</text>
  <text x="0" y="74" class="m" font-size="13" fill="${C.mute}" letter-spacing="2">f/3.7 · 1/307s · ISO 307</text>
</g>
<g filter="url(#glow)">${snow(1128, 150, 16, '#fff', 2)}${snow(910, 330, 8, C.ice2, 1.5)}</g>
${sparkle(980, 140, 10, '#fff', 0.4)}${sparkle(1150, 240, 8, C.pink2, 1.4)}${sparkle(700, 420, 9, C.ice2, 2)}

<text x="562" y="458" font-size="31" font-weight="800" fill="${C.text}">把好奇心写成工具，把想象力做成交互。</text>
<text x="562" y="496" class="m" font-size="15" fill="${C.ice2}" textLength="580" lengthAdjust="spacing">WEB APPS · DEVELOPER TOOLS · MINECRAFT AUTOMATION</text>

<!-- shutter -->
<circle cx="${CX}" cy="${CY}" r="0" fill="url(#burst)"><animate attributeName="r" values="0;0;520;520" keyTimes="0;.8;.88;1" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.799;.805;.9;1" dur="7s" repeatCount="indefinite"/></circle>
<rect width="${W}" height="${H}" rx="28" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;0;.7;0;0" keyTimes="0;.8;.805;.85;1" dur="7s" repeatCount="indefinite"/></rect>
<g transform="translate(400 300) rotate(-12)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.8;.81;.96;.99;1" dur="7s" repeatCount="indefinite"/>
<g><animateTransform attributeName="transform" type="scale" values=".3;.3;1.35;1;1" keyTimes="0;.8;.83;.86;1" dur="7s" repeatCount="indefinite"/>
<text x="0" y="0" text-anchor="middle" font-size="54" font-weight="900" fill="${C.hot}" stroke="#fff" stroke-width="6" paint-order="stroke" filter="url(#glow)">咔嚓！</text></g></g>
<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="27" fill="none" stroke="url(#prism)" stroke-width="3" opacity=".8"/>
</svg>`;
}

// ---------- name story: the 03.07 calendar page ----------
function story() {
  const W = 1200, H = 400;
  const lines = [
    ['她在一块永不融化的冰里醒来，忘了从前的一切，', C.text, 400],
    ['于是用醒来那天的日期给自己取了名字，', C.text, 400],
    ['再用相机认真记下之后的每一个瞬间。', C.text, 400],
    ['我们借用这个名字：把每个想法都好好保存，', C.pink2, 800],
    ['做成能用、能玩、也值得回看的作品。', C.pink2, 800],
  ];
  const torn = [0, 1, 2, 3].map((i) => {
    const d = 6, b = i * 1.5;
    return `<g opacity="0"><animate attributeName="opacity" values="0;.9;0" keyTimes="0;.1;1" dur="${d}s" begin="${b}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="230 120;${360 + i * 40} ${-60 + i * 20}" dur="${d}s" begin="${b}s" repeatCount="indefinite"/>
<g><animateTransform attributeName="transform" type="rotate" values="0;${200 + i * 60}" dur="${d}s" begin="${b}s" repeatCount="indefinite"/><rect x="-26" y="-18" width="52" height="36" rx="3" fill="#F7F4FF"/><text x="0" y="8" text-anchor="middle" font-size="20" font-weight="900" fill="#9AA6CC">${3 + i}</text></g></g>`;
  }).join('');
  return `${svgOpen(W, H, '名字的由来：03.07', lines.map((l) => l[0]).join(''))}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}" rx="24"/></clipPath>
<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6EEFF"/></linearGradient>
<linearGradient id="frost" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.ice}" stop-opacity=".75"/><stop offset=".4" stop-color="${C.ice2}" stop-opacity=".2"/><stop offset="1" stop-color="${C.ice2}" stop-opacity="0"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="${C.pink}" stop-opacity=".35"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient></defs>
<g clip-path="url(#r)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${aurora(W, 10, 110, 11)}
${stars(W, H, 60, 77)}
<circle cx="240" cy="210" r="220" fill="url(#halo)"/>
<g opacity=".12">${spin(1100, 330, 90)}${snow(1100, 330, 140, C.ice2, 3)}</g>
${torn}
<g transform="translate(240 206) rotate(-6)"><g style="animation:bob 6s ease-in-out infinite">
  <rect x="-128" y="-140" width="256" height="292" rx="16" fill="#000" opacity=".4" transform="translate(8 10)"/>
  <rect x="-128" y="-140" width="256" height="292" rx="16" fill="url(#paper)"/>
  <path d="M-128 -124a16 16 0 0 1 16 -16h224a16 16 0 0 1 16 16v54h-256z" fill="${C.hot}"/>
  <text x="0" y="-92" text-anchor="middle" font-size="26" font-weight="900" fill="#fff" letter-spacing="6">MARCH</text>
  ${[-80, -40, 0, 40, 80].map((x) => `<circle cx="${x}" cy="-140" r="7" fill="#1A2350" stroke="#C9D4F0" stroke-width="3"/>`).join('')}
  <text x="0" y="78" text-anchor="middle" font-size="190" font-weight="900" fill="url(#prism)" stroke="#2A3566" stroke-width="2" paint-order="stroke">7</text>
  <text x="0" y="122" text-anchor="middle" font-size="16" font-weight="700" fill="#5B5F86" letter-spacing="3">冰中醒来的那一天</text>
  <rect x="-128" y="40" width="256" height="112" fill="url(#frost)"/>
  <g filter="url(#glow)">${snow(-100, 130, 13, '#fff', 2)}${snow(98, 118, 10, '#fff', 1.8)}${snow(-58, 142, 7, '#fff', 1.5)}</g>
  <g transform="translate(92 -40) rotate(14)"><path d="M0 8C-14 -6 -10 -18 0 -12C10 -18 14 -6 0 8Z" fill="${C.pink}" stroke="#fff" stroke-width="2.5"/></g>
  <circle cx="0" cy="-30" r="0" fill="none" stroke="${C.hot}" stroke-width="5" opacity=".85"><animate attributeName="r" values="0;0;96;96" keyTimes="0;.15;.4;1" dur="6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.85;.85;0" keyTimes="0;.15;.85;1" dur="6s" repeatCount="indefinite"/></circle>
</g></g>
${polaroid(410, 210, 10, 96, 114, photos.ice, 'day one', 'pI', { tape: C.pink, swing: 3, dur: 5 })}
${shard(80, 90, 22, -30, 0)}${shard(420, 70, 16, 26, 1)}${shard(60, 340, 14, 50, 2)}
${snowfall(W, H, 40, 1307)}
</g>
<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="23" fill="none" stroke="url(#prism)" stroke-width="2" opacity=".55"/>
<text x="540" y="78" class="m" font-size="14" fill="${C.ice}" letter-spacing="4">00 · WHY “MARCH 7TH”</text>
<text x="540" y="132" font-size="44" font-weight="900" fill="url(#prism)" filter="url(#glow)">名字，来自一块冰</text>
<rect x="540" y="150" width="72" height="5" rx="2.5" fill="${C.hot}" filter="url(#glow)"/>
${lines.map(([t, col, wt], i) => `<text x="540" y="${198 + i * 34 + (i >= 3 ? 14 : 0)}" font-size="21" fill="${col}" font-weight="${wt}" style="animation:rise 1s ease-out ${f1(0.2 + i * 0.25)}s both">${esc(t)}</text>`).join('')}
<style>@keyframes rise{0%{transform:translateY(14px);opacity:0}100%{transform:none;opacity:1}}</style>
${sparkle(1110, 80, 12, C.pink2, 0.5)}${sparkle(1150, 180, 9, C.ice2, 1.5)}
</svg>`;
}

// ---------- section header: crystal index + an arrow drawing the underline ----------
function header(file, no, en, zh, sub, seed) {
  const W = 1200, H = 112;
  write(file, `${svgOpen(W, H, `${en} · ${zh}`, sub)}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}" rx="18"/></clipPath></defs>
<g clip-path="url(#r)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${aurora(W, 60, 60, seed)}
${stars(W, H, 36, seed)}
${snowfall(W, H, 16, seed + 2, { min: 5, max: 9 })}
<path d="M120 92H1168" stroke="${C.line}" stroke-width="2"/>
<path d="M120 92H1168" stroke="url(#brand)" stroke-width="3" stroke-dasharray="1048" stroke-dashoffset="1048" filter="url(#glow)"><animate attributeName="stroke-dashoffset" values="1048;0;0;1048" keyTimes="0;.22;.9;1" dur="6s" repeatCount="indefinite"/></path>
<g opacity="0"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.22;.24;1" dur="6s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="130 92;1180 92;1180 92" keyTimes="0;.22;1" dur="6s" repeatCount="indefinite"/><g filter="url(#glow)">${arrowShape(110)}</g></g>
<g transform="translate(1168 92)" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.21;.23;.4;1" dur="6s" repeatCount="indefinite"/><circle r="4" fill="none" stroke="#fff" stroke-width="2"><animate attributeName="r" values="2;2;24;24" keyTimes="0;.22;.4;1" dur="6s" repeatCount="indefinite"/></circle>${snow(0, 0, 12, '#fff', 1.8)}</g>
</g>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="17" fill="none" stroke="${C.line}"/>
<g transform="translate(62 54)">
  <g>${spin(0, 0, 24)}<polygon points="${hexPts(0, 0, 38)}" fill="#9CD8FF" fill-opacity=".1" stroke="url(#brand)" stroke-width="2.5" filter="url(#glow)"/><polygon points="${hexPts(0, 0, 30, 30)}" fill="none" stroke="#fff" stroke-opacity=".25"/></g>
  <text x="0" y="11" text-anchor="middle" class="m" font-size="30" font-weight="900" fill="url(#prism)">${no}</text>
</g>
<text x="124" y="40" class="m" font-size="14" letter-spacing="4" fill="${C.ice}">${esc(en)}</text>
<text x="124" y="76" font-size="32" font-weight="900" fill="${C.text}">${esc(zh)}</text>
<text x="${W - 32}" y="58" text-anchor="end" font-size="18" fill="${C.pink2}">${esc(sub)}</text>
</svg>`);
}

// ---------- project cards: memory shards ----------
const chipW = (s) => [...s].reduce((a, ch) => a + (ch.charCodeAt(0) > 255 ? 14 : 7.9), 0) + 20;

function card({ file, no, name, desc, chips, tint, art, seed }) {
  const W = 600, H = 330;
  const outline = '30,2 556,2 598,44 598,300 570,328 2,328 2,32';
  const inner = '40,14 548,14 586,52 586,184 14,184 14,40';
  let x = 28;
  const chipSvg = chips.map((c) => {
    const w = chipW(c);
    const s = `<g transform="translate(${f1(x)} 274)"><rect width="${f1(w)}" height="28" rx="6" fill="${tint}" fill-opacity=".16" stroke="${tint}" stroke-opacity=".7"/><text x="${f1(w / 2)}" y="19" text-anchor="middle" font-size="13" fill="${tint}" class="m" font-weight="700">${esc(c)}</text></g>`;
    x += w + 8;
    return s;
  }).join('');
  write(`projects/${file}.svg`, `${svgOpen(W, H, name, `${name}：${desc}`)}
<defs>${baseDefs(W)}
<linearGradient id="ph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint}" stop-opacity=".38"/><stop offset=".6" stop-color="#101735"/><stop offset="1" stop-color="#0A0F1F"/></linearGradient>
<clipPath id="pc"><polygon points="${inner}"/></clipPath>
<clipPath id="cc"><polygon points="${outline}"/></clipPath>
<filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
<style>@keyframes run{from{transform:translateX(0)}to{transform:translateX(var(--d,200px))}}
@keyframes dash{to{stroke-dashoffset:-60}}
@keyframes sway{50%{transform:translateY(-5px)}}</style>
</defs>
<g clip-path="url(#cc)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<g clip-path="url(#pc)">
  <rect width="${W}" height="200" fill="url(#ph)"/>
  <g transform="translate(14 14)">${art(tint)}</g>
  <g transform="translate(14 14)">${snowfall(572, 170, 12, seed, { min: 6, max: 11, op: 0.7 })}</g>
  <rect x="-200" y="0" width="120" height="200" fill="url(#sheen)" transform="skewX(-20)"><animate attributeName="x" values="-200;900;900" keyTimes="0;.35;1" dur="6s" begin="${f1((seed % 7) * 0.6)}s" repeatCount="indefinite"/></rect>
</g>
<polygon points="${inner}" fill="none" stroke="#fff" stroke-opacity=".35"/>
<text x="586" y="318" text-anchor="end" font-size="96" font-weight="900" fill="none" stroke="${tint}" stroke-opacity=".28" stroke-width="2">${no}</text>
<g opacity=".16">${spin(470, 268, 30)}${snow(470, 268, 34, tint, 3)}</g>
</g>
<polygon points="${outline}" fill="none" stroke="url(#prism)" stroke-width="2.5" filter="url(#glow)"><animate attributeName="stroke-opacity" values=".5;1;.5" dur="4s" repeatCount="indefinite"/></polygon>
<g transform="translate(556 2)">${shard(0, 18, 20, 40, seed % 4)}</g>
<g transform="translate(26 26)"><polygon points="${hexPts(16, 16, 16)}" fill="${tint}" fill-opacity=".25" stroke="#fff" stroke-opacity=".8" filter="url(#glow)"/><text x="16" y="21" text-anchor="middle" class="m" font-size="13" font-weight="900" fill="#fff">${no}</text></g>
<text x="62" y="47" class="m" font-size="12" fill="#fff" opacity=".85" letter-spacing="3">MEMORY SHARD</text>
<text x="28" y="226" class="m" font-size="27" font-weight="800" fill="${C.text}">${esc(name)}</text>
<text x="28" y="256" font-size="17.5" fill="${C.mute}">${esc(desc)}</text>
${chipSvg}
</svg>`);
}

// card artwork (each drawn in a 572x170 box)
const art = {
  api: (t) => `
<g fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
  <path d="M20 50H170L230 92H350" stroke="${C.ice}"/>
  <path d="M20 138H150L230 92" stroke="${C.pink}"/>
  <path d="M350 92H430L480 50H556" stroke="${C.lav}"/>
  <path d="M350 92H430L480 136H556" stroke="${C.amber}"/>
</g>
<path id="rt" d="M20 50H170L230 92H350H430L480 50H556" fill="none"/>
<path id="rt2" d="M20 138H150L230 92H350H430L480 136H556" fill="none"/>
${[[20, 50], [100, 50], [170, 50], [20, 138], [150, 138], [480, 50], [556, 50], [480, 136], [556, 136]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#0A0F1F" stroke="${C.text}" stroke-width="3"/>`).join('')}
<g><circle cx="290" cy="92" r="30" fill="#0A0F1F" stroke="${t}" stroke-width="4" filter="url(#glow)"/><circle cx="290" cy="92" r="38" fill="none" stroke="${t}" stroke-opacity=".5" stroke-dasharray="4 7" style="animation:dash 2s linear infinite"/>
<text x="290" y="99" class="m" font-size="20" font-weight="700" fill="${C.text}" text-anchor="middle">/v1</text></g>
<g filter="url(#glow)"><rect x="-11" y="-6" width="22" height="12" rx="6" fill="#fff"/><animateMotion dur="5s" repeatCount="indefinite" rotate="auto"><mpath href="#rt"/></animateMotion></g>
<g filter="url(#glow)"><rect x="-11" y="-6" width="22" height="12" rx="6" fill="${C.pink2}"/><animateMotion dur="6s" begin="-2s" repeatCount="indefinite" rotate="auto"><mpath href="#rt2"/></animateMotion></g>
<text x="200" y="162" class="m" font-size="12" fill="${C.mute}">model · key · credit</text>`,

  proxy: (t) => `
<g stroke="${C.line}" stroke-width="2" stroke-dasharray="4 6"><path d="M70 76H250M70 110H250M70 144H250M326 92H520"/></g>
${[76, 110, 144].map((y) => `<circle cx="70" cy="${y}" r="10" fill="#0A0F1F" stroke="${C.ice}" stroke-width="3"/>`).join('')}
<g filter="url(#glow)"><rect x="262" y="24" width="52" height="136" rx="10" fill="#0A0F1F" stroke="${t}" stroke-width="3"/>
<path d="M276 92l9 10 17-22" fill="none" stroke="${C.lock}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>
<text x="288" y="44" class="m" font-size="11" fill="${t}" text-anchor="middle">ALLOW</text>
<circle cx="520" cy="92" r="30" fill="#0A0F1F" stroke="${t}" stroke-width="3" filter="url(#glow)"/><text x="520" y="98" class="m" font-size="14" fill="${t}" text-anchor="middle">origin</text>
<g style="--d:170px"><rect x="84" y="70" width="24" height="12" rx="3" fill="${C.ice}" filter="url(#glow)" style="animation:run 2.6s linear infinite"/></g>
<g style="--d:180px"><rect x="330" y="86" width="24" height="12" rx="3" fill="${C.pink}" filter="url(#glow)" style="animation:run 2.6s linear infinite .8s"/></g>
<g><rect x="84" y="138" width="24" height="12" rx="3" fill="#FF6B8B"><animate attributeName="x" values="84;226;226" keyTimes="0;.7;1" dur="3.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.7;1" dur="3.2s" repeatCount="indefinite"/></rect>
<text x="130" y="166" class="m" font-size="12" fill="#FF6B8B">10.0.0.0/8 ✕</text></g>`,

  atlas: (t) => `
<g stroke="#26305F" stroke-width="1">${Array.from({ length: 16 }, (_, i) => `<path d="M${i * 38} 0V170"/>`).join('')}${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${i * 38 + 6}H572"/>`).join('')}</g>
<rect x="30" y="36" width="150" height="112" rx="8" fill="#141B3A" stroke="${C.line}" stroke-width="2"/>
<rect x="388" y="36" width="154" height="54" rx="8" fill="#141B3A" stroke="${C.line}" stroke-width="2"/>
<rect x="388" y="102" width="154" height="46" rx="8" fill="#141B3A" stroke="${C.line}" stroke-width="2"/>
<g filter="url(#glow)"><rect x="200" y="44" width="168" height="96" rx="8" fill="${t}" fill-opacity=".14" stroke="${t}" stroke-width="3"/></g>
<rect x="216" y="62" width="92" height="12" rx="4" fill="${C.text}" opacity=".8"/><rect x="216" y="84" width="132" height="8" rx="4" fill="${C.mute}"/><rect x="216" y="102" width="64" height="22" rx="11" fill="${t}"><animate attributeName="width" values="64;110;64" dur="4s" repeatCount="indefinite"/></rect>
${[[200, 44], [368, 44], [200, 140], [368, 140], [284, 44], [284, 140]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="2" fill="#fff" stroke="${t}" stroke-width="2"/>`).join('')}
<path d="M284 0V170M0 92H572" stroke="${t}" stroke-opacity=".6" stroke-width="1.5" stroke-dasharray="5 5" style="animation:dash 3s linear infinite"/>
<g transform="translate(330 108)"><g><animateTransform attributeName="transform" type="translate" values="0 0;-30 -20;0 0" dur="4s" repeatCount="indefinite"/><path d="M0 0l22 8-9 3 6 12-5 3-6-12-8 7z" fill="${C.text}" stroke="#0A0F1F" stroke-width="2" stroke-linejoin="round"/></g></g>
<g transform="translate(404 12)"><rect width="120" height="18" rx="9" fill="${t}" fill-opacity=".25"/><text x="60" y="13" class="m" font-size="11" fill="${t}" text-anchor="middle">x 284 · y 44</text></g>`,

  fog: (t) => `
<circle cx="470" cy="48" r="20" fill="${C.amber}" opacity=".9" filter="url(#glow)"/><circle cx="470" cy="48" r="36" fill="${C.amber}" opacity=".12"/>
<path d="M120 52L330 20V90Z" fill="${C.amber}" opacity=".14"><animateTransform attributeName="transform" type="rotate" values="-8 120 52;10 120 52;-8 120 52" dur="6s" repeatCount="indefinite"/></path>
<g><rect x="108" y="56" width="22" height="74" fill="#C9D4F0"/><rect x="104" y="46" width="30" height="12" fill="#FF6B8B"/><path d="M104 46l15-14 15 14z" fill="#1A2350"/><circle cx="119" cy="52" r="5" fill="${C.amber}" filter="url(#glow)"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></circle></g>
<path d="M0 136H572V170H0Z" fill="#0A0F1F"/>
${Array.from({ length: 9 }, (_, i) => `<rect x="${180 + i * 42}" y="122" width="8" height="52" fill="#1B2556"/>`).join('')}
<rect x="170" y="118" width="380" height="8" fill="#26305F"/>
<g filter="url(#blur)" opacity=".9"><ellipse cx="120" cy="130" rx="150" ry="20" fill="#B8C7EE" opacity=".28"><animate attributeName="cx" values="120;180;120" dur="9s" repeatCount="indefinite"/></ellipse><ellipse cx="420" cy="114" rx="190" ry="18" fill="#B8C7EE" opacity=".24"><animate attributeName="cx" values="420;360;420" dur="11s" repeatCount="indefinite"/></ellipse><ellipse cx="300" cy="156" rx="260" ry="16" fill="#B8C7EE" opacity=".3"/></g>
<g stroke="#FF6B8B" stroke-width="2" fill="none" filter="url(#glow)"><path d="M360 50L440 80L520 60L400 102Z" stroke-dasharray="320" stroke-dashoffset="320"><animate attributeName="stroke-dashoffset" values="320;0;0" keyTimes="0;.5;1" dur="5s" repeatCount="indefinite"/></path></g>
${[[360, 50], [440, 80], [520, 60], [400, 102]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#FF6B8B"/>`).join('')}
<g class="m" font-size="11" fill="${C.text}" opacity=".85"><text x="346" y="40">#1 time</text><text x="448" y="94">#2 berth</text></g>`,

  mc: (t) => {
    const k = 0.7, S = 36 * k;
    const cube = (x, y, top, left, right) => `<g><path d="M${f1(x)} ${f1(y)}l${f1(S)} ${f1(S / 2)}l${f1(-S)} ${f1(S / 2)}l${f1(-S)} ${f1(-S / 2)}z" fill="${top}"/><path d="M${f1(x - S)} ${f1(y + S / 2)}l${f1(S)} ${f1(S / 2)}v${f1(S)}l${f1(-S)} ${f1(-S / 2)}z" fill="${left}"/><path d="M${f1(x + S)} ${f1(y + S / 2)}l${f1(-S)} ${f1(S / 2)}v${f1(S)}l${f1(S)} ${f1(-S / 2)}z" fill="${right}"/></g>`;
    const grass = ['#6FD08A', '#3E9B5C', '#2D7646'], dirt = ['#B07A4E', '#8A5C37', '#6B4527'], stone = ['#9AA6BF', '#6F7B96', '#566079'];
    const ice = ['#E2F5FF', '#9CCFF0', '#79B4E0'];
    const cx = 286, base = 98, r = 24 * k;
    let s = '';
    s += cube(cx - 2 * S, base + r, ...stone) + cube(cx, base + r, ...dirt) + cube(cx + 2 * S, base + r, ...ice);
    s += cube(cx - S, base, ...dirt) + cube(cx + S, base, ...grass);
    s += cube(cx, base - r, ...grass);
    const hy = base - 112 * k, hw = 30 * k, hh = 15 * k;
    s += `<g style="animation:sway 3s ease-in-out infinite" filter="url(#glow)"><path d="M${cx} ${f1(hy)}l${f1(hw)} ${f1(hh)}v${f1(hw)}l${f1(-hw)} ${f1(hh)}l${f1(-hw)} ${f1(-hh)}v${f1(-hw)}z" fill="${C.ice}"/><rect x="${cx - 14}" y="${f1(hy + 16)}" width="8" height="8" fill="#0A0F1F"/><rect x="${cx + 6}" y="${f1(hy + 16)}" width="8" height="8" fill="#0A0F1F"/></g>`;
    s += `<g transform="translate(374 30)" filter="url(#glow)"><rect width="150" height="34" rx="8" fill="#0A0F1F" stroke="${t}"/><text x="12" y="22" class="m" font-size="14" fill="${t}">&gt; bot come<tspan><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>_</tspan></text></g>`;
    s += `<g class="m" font-size="12" fill="${C.mute}"><text x="24" y="162">1.8.8 → 26.1</text><text x="550" y="162" text-anchor="end">Paper · Fabric · Forge</text></g>`;
    return s;
  },

  paste: (t) => `
<g transform="rotate(-8 150 100)"><rect x="70" y="36" width="170" height="116" rx="10" fill="#141B3A" stroke="${C.line}" stroke-width="2"/></g>
<g filter="url(#glow)"><rect x="120" y="32" width="190" height="124" rx="10" fill="#1A2350" stroke="${t}" stroke-width="3"/></g>
<text x="136" y="58" class="m" font-size="15" font-weight="700" fill="${t}"># hello.md</text>
<rect x="136" y="72" width="150" height="8" rx="4" fill="${C.text}" opacity=".75"/><rect x="136" y="90" width="110" height="8" rx="4" fill="${C.mute}"/><rect x="136" y="108" width="130" height="8" rx="4" fill="${C.mute}"/>
<rect x="136" y="128" width="60" height="16" rx="8" fill="${t}" fill-opacity=".25"/><text x="166" y="140" class="m" font-size="11" fill="${t}" text-anchor="middle">LOCKED</text>
<g transform="translate(430 92)"><circle r="42" fill="none" stroke="${C.line}" stroke-width="8"/>
<circle r="42" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round" stroke-dasharray="264" stroke-dashoffset="0" transform="rotate(-90)" filter="url(#glow)"><animate attributeName="stroke-dashoffset" values="0;264" dur="6s" repeatCount="indefinite"/></circle>
<text y="6" class="m" font-size="16" font-weight="700" fill="${C.text}" text-anchor="middle">burn</text></g>
<text x="430" y="160" class="m" font-size="12" fill="${C.mute}" text-anchor="middle">view once · expire</text>`,
};

// ---------- workflow: four arrows, one freeze-frame ----------
function archery() {
  const W = 1200, H = 400, Y = 128, x0 = 104;
  const steps = [
    ['01', '拉弓', 'DRAW', ['先想清楚为谁而做', '再定下它的样子'], C.ice, 300],
    ['02', '瞄准', 'AIM', ['原型落在真实页面', '看得见才算数'], C.pink, 560],
    ['03', '放箭', 'RELEASE', ['实现与回归测试', '每一步都能回退'], C.lav, 820],
    ['04', '定格', 'FREEZE', ['独立审查，留存证据', '确认之后再上线'], C.lock, 1080],
  ];
  const D = 6, rel = 0.16, hit = 0.56;
  const tAt = (x) => f3(rel + ((hit - rel) * (x - x0)) / (1080 - x0));
  const tm = `dur="${D}s" repeatCount="indefinite"`;
  const targets = steps.map(([no, zh, en, lines, col, x], i) => {
    const t = Number(tAt(x));
    const k = `0;${f3(Math.max(t - 0.005, 0))};${f3(t + 0.01)};.92;1`;
    return `<g transform="translate(${x} ${Y})">
<g>${spin(0, 0, 18 + i * 4, i % 2 ? -1 : 1)}<polygon points="${hexPts(0, 0, 50)}" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="${i % 2 ? '10 6' : 'none'}" filter="url(#glow)"/></g>
<polygon points="${hexPts(0, 0, 36, 30)}" fill="${col}" fill-opacity=".1" stroke="${col}" stroke-opacity=".6"/>
<circle r="14" fill="${col}" filter="url(#glowL)" opacity=".35"><animate attributeName="opacity" values=".35;.35;1;.55;.35" keyTimes="${k}" ${tm}/><animate attributeName="r" values="12;12;22;14;12" keyTimes="${k}" ${tm}/></circle>
<g opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;${f3(Math.max(t - 0.005, 0))};${f3(t + 0.01)};${f3(t + 0.12)};1" ${tm}/><circle r="10" fill="none" stroke="#fff" stroke-width="2"><animate attributeName="r" values="10;10;70;70" keyTimes="0;${f3(t)};${f3(t + 0.12)};1" ${tm}/></circle></g>
<text y="-66" text-anchor="middle" class="m" font-size="13" fill="${col}" letter-spacing="3">${no} · ${en}</text>
<text y="118" text-anchor="middle" font-size="40" font-weight="900" fill="${C.text}">${zh}</text>
<rect x="-24" y="132" width="48" height="5" rx="2.5" fill="${col}" filter="url(#glow)"/>
<text y="172" text-anchor="middle" font-size="19" fill="${C.text}">${esc(lines[0])}</text>
<text y="200" text-anchor="middle" font-size="19" fill="${C.mute}">${esc(lines[1])}</text>
</g>`;
  }).join('');
  // bow: limbs + string pulled back and released
  const pulled = `M86 ${Y - 82}L46 ${Y}L86 ${Y + 82}`, rest = `M86 ${Y - 82}L86 ${Y}L86 ${Y + 82}`;
  return `${svgOpen(W, H, '四箭定格：拉弓、瞄准、放箭、定格', '我们的工作流像一次射箭：先想清楚为谁而做（拉弓），在真实页面里验收原型（瞄准），带回归测试地实现（放箭），独立审查、留存证据后再上线（定格）。')}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}" rx="24"/></clipPath>
<linearGradient id="bow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.pink}"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="${C.ice}"/></linearGradient></defs>
<g clip-path="url(#r)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${aurora(W, 250, 140, 21)}
${stars(W, H, 70, 91)}
<path d="M${x0} ${Y}H1080" stroke="${C.line}" stroke-width="2" stroke-dasharray="3 6"/>
<path d="M${x0} ${Y}H1080" stroke="url(#brand)" stroke-width="4" filter="url(#glow)" stroke-dasharray="976" stroke-dashoffset="976"><animate attributeName="stroke-dashoffset" values="976;976;0;0;976" keyTimes="0;${rel};${hit};.94;1" ${tm}/><animate attributeName="opacity" values="1;1;1;0;0" keyTimes="0;.6;.88;.94;1" ${tm}/></path>
${targets}
<!-- bow -->
<g filter="url(#glow)">
<path d="M86 ${Y - 82}Q24 ${Y} 86 ${Y + 82}" fill="none" stroke="url(#bow)" stroke-width="6" stroke-linecap="round"/>
<path d="M86 ${Y - 82}q-8 -14 4 -22M86 ${Y + 82}q-8 14 4 22" fill="none" stroke="${C.pink2}" stroke-width="3" stroke-linecap="round"/>
<g>${snow(40, Y, 10, '#fff', 1.8)}</g>
<path d="${rest}" fill="none" stroke="#fff" stroke-width="1.5"><animate attributeName="d" values="${rest};${pulled};${pulled};${rest};${rest}" keyTimes="0;.12;${rel};${f3(rel + 0.02)};1" ${tm}/></path>
</g>
<!-- the arrow -->
<g><animateTransform attributeName="transform" type="translate" values="${x0} ${Y};${x0 - 40} ${Y};${x0 - 40} ${Y};1080 ${Y};1080 ${Y}" keyTimes="0;.12;${rel};${hit};1" ${tm}/><animate attributeName="opacity" values="1;1;1;0;0" keyTimes="0;.85;.9;.92;1" ${tm}/><g filter="url(#glow)">${arrowShape(120)}</g></g>
<!-- freeze frame at the last target -->
<g transform="translate(1080 ${Y})" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${hit};${f3(hit + 0.02)};.88;.94" ${tm}/>
<g filter="url(#glowL)">${snow(0, 0, 44, '#fff', 3)}</g>
<g transform="translate(36 -66) rotate(10)"><rect x="-50" y="-16" width="100" height="32" rx="6" fill="${C.hot}" stroke="#fff" stroke-width="3"/><text x="0" y="7" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">咔嚓！定格</text></g></g>
${snowfall(W, H, 34, 515, { min: 7, max: 12, op: 0.7 })}
</g>
<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="23" fill="none" stroke="url(#prism)" stroke-width="2" opacity=".5"/>
</svg>`;
}

// ---------- footer: photo wall ----------
function footer() {
  const W = 1200, H = 360;
  const yAt = (x) => { const t = (x - 40) / 1120; return (1 - t) * (1 - t) * 34 + 2 * (1 - t) * t * 104 + t * t * 34; };
  const g = {
    api: `<path d="M-30 -8H-6L6 6H30" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="0" cy="0" r="9" fill="#0A0F1F" stroke="#fff" stroke-width="3"/>`,
    proxy: `<path d="M-14 0l9 10 19-22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    atlas: `<rect x="-22" y="-14" width="44" height="28" fill="none" stroke="#fff" stroke-width="3"/>${[[-22, -14], [22, -14], [-22, 14], [22, 14]].map(([a, b]) => `<rect x="${a - 4}" y="${b - 4}" width="8" height="8" fill="#fff"/>`).join('')}`,
    fog: `<rect x="-6" y="-14" width="12" height="30" fill="#fff"/><path d="M6 -10L34 -22V0Z" fill="${C.amber}" opacity=".8"/><circle cx="0" cy="-10" r="3" fill="${C.amber}"/>`,
    mc: `<path d="M0 -18l18 9-18 9-18-9z" fill="#6FD08A"/><path d="M-18 -9l18 9v20l-18-9z" fill="#8A5C37"/><path d="M18 -9l-18 9v20l18-9z" fill="#6B4527"/>`,
    paste: `<rect x="-16" y="-20" width="32" height="40" rx="4" fill="#fff"/><path d="M-9 -9H9M-9 0H9M-9 9H3" stroke="#1A2350" stroke-width="3" stroke-linecap="round"/>`,
  };
  const wall = [['api', C.ice, 'api'], ['proxy', C.lav, 'proxy'], ['atlas', C.pink, 'atlas'], ['fog', C.amber, 'fog harbor'], ['mc', C.lock, 'mc-bot'], ['paste', C.peach, 'paste']];
  const pol = wall.map(([k, tint, cap], i) => {
    const x = 150 + i * 180, y = f1(yAt(x));
    return `<circle cx="${x}" cy="${y}" r="4" fill="${C.hot}"/>` +
      polaroid(x, y + 2, [-5, 4, -3, 6, -4, 3][i], 96, 110, tinted(tint, g[k]), cap, `w${i}`, { tape: [C.pink, C.ice][i % 2], swing: 3, dur: 3 + i * 0.4 });
  }).join('');
  return `${svgOpen(W, H, '咔嚓——这一刻，存进相册。', '一面挂满拍立得的照片墙，每张对应一个项目。愿每一次按下快门，都留下值得回看的东西。')}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}" rx="28"/></clipPath></defs>
<g clip-path="url(#r)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${aurora(W, 210, 150, 31)}
${stars(W, H, 70, 131)}
${volley(6, 707, { xs: [80, 1120], ys: [250, 340], ang: 108, travel: 400, dur: 4.2 })}
<path d="M40 34Q600 174 1160 34" fill="none" stroke="${C.ice2}" stroke-opacity=".7" stroke-width="2"/>
${pol}
${snowfall(W, H, 44, 917)}
</g>
<text x="600" y="246" text-anchor="middle" font-size="40" font-weight="900" fill="url(#prism)" filter="url(#glowL)">咔嚓——这一刻，存进相册。</text>
<text x="600" y="284" text-anchor="middle" font-size="18" fill="${C.text}" opacity=".88">愿每一次按下快门，都留下值得回看的东西。</text>
<text x="600" y="322" text-anchor="middle" class="m" font-size="13" fill="${C.ice}" letter-spacing="3">MARCH7TH · EST. 2022 · 03.07 · SNAP IT, SHIP IT, KEEP IT</text>
${sparkle(220, 250, 12, C.pink2, 0.2)}${sparkle(990, 226, 10, C.ice2, 1)}${sparkle(1080, 310, 14, C.pink, 1.6)}${sparkle(130, 320, 9, C.ice, 2.1)}
<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="27" fill="none" stroke="url(#prism)" stroke-width="2.5" opacity=".7"/>
</svg>`;
}

// ---------- build ----------
write('hero.svg', hero());
write('story.svg', story());
header('h-shards.svg', '01', 'MEMORY SHARDS', '记忆碎片 · 我们做的东西', '每个项目，都是冻住的一个好瞬间', 101);
header('h-arrows.svg', '02', 'FOUR ARROWS', '四箭定格 · 我们怎么做事', '拉弓、瞄准、放箭，然后——咔嚓', 202);
header('h-join.svg', '03', 'JOIN THE FRAME', '一起入镜 · 参与', '反馈、讨论、贡献、安全报告', 303);
write('archery.svg', archery());
write('footer.svg', footer());

card({ file: 'march7th-api', no: '01', name: 'march7th-api', tint: C.ice, art: art.api, seed: 11,
  desc: '自托管 API 目录与模型网关，密钥、限速、积分一站管理', chips: ['Python', 'OpenAI 兼容', 'Docker'] });
card({ file: 'file-download-proxy', no: '02', name: 'file-download-proxy', tint: C.lav, art: art.proxy, seed: 12,
  desc: '只放行白名单域名的流式下载代理，防 SSRF', chips: ['FastAPI', 'Range', 'SSRF-safe'] });
card({ file: 'design-atlas', no: '03', name: 'design-atlas', tint: C.pink, art: art.atlas, seed: 13,
  desc: '浏览器里的前端设计工作台：拼装、调样式、导出源码', chips: ['JavaScript', '无需账号', '源码导出'] });
card({ file: 'fog-harbor-archive', no: '04', name: 'fog-harbor-archive', tint: C.amber, art: art.fog, seed: 14,
  desc: '悬疑解谜：在雾港调查室里重建证据链', chips: ['Next.js 16', 'React 19', 'TypeScript'] });
card({ file: 'mc-bot', no: '05', name: 'mc-bot', tint: C.lock, art: art.mc, seed: 15,
  desc: 'Minecraft 合作生存机器人，可换 AI 后端，可接 MCP', chips: ['Mineflayer', 'Node 22', 'MCP'] });
card({ file: 'march7th-paste', no: '06', name: 'March7th Paste 4.0', tint: C.peach, art: art.paste, seed: 16,
  desc: '在线剪贴板与文件分享，Markdown、密码、阅后即焚', chips: ['Next.js', 'PostgreSQL', 'Markdown'] });

console.log('assets written to', out);
