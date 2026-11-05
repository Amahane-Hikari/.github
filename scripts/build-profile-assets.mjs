// Generates the SVG artwork used by profile/README.md  ·  design t004 "Eternal Ice · Clear"
//   node scripts/build-profile-assets.mjs
// No dependencies. Every SVG is self-contained (system font stacks, no external requests) and has a
// transparent background. Two palettes are written — profile/assets/light and profile/assets/dark —
// and the README picks one per GitHub theme with <picture>.
// Motifs — eternal ice, ice arrows, instant photos, the 03.07 calendar page — are original vector
// drawings; no official artwork is used.
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..', 'profile', 'assets');
fs.rmSync(root, { recursive: true, force: true });

const SANS = "'Segoe UI','Helvetica Neue','PingFang SC','Microsoft YaHei','Noto Sans CJK SC',Arial,sans-serif";
const MONO = "ui-monospace,'SFMono-Regular','Cascadia Mono',Consolas,'Liberation Mono',monospace";

// hi = the "bright" accent (white on dark, deep ice-blue on light); node = a fill that reads as the page background.
const THEMES = {
  dark: {
    text: '#E6EDF3', mute: '#9AA4C4', line: '#2F3858',
    pink: '#FF8FC0', pink2: '#FFC6DF', hot: '#FF5FA2', ice: '#8FD3FF', ice2: '#CDEBFF', lav: '#B9A8FF',
    lock: '#7CF0B5', amber: '#FFD28A', peach: '#FFB38A', red: '#FF6B8B',
    hi: '#FFFFFF', node: '#0D1117', s1: '#151B2E', s2: '#1B2240', s3: '#283152', snow: '#DDF1FF',
    paper: '#F7F4FF', paperLine: 'none', shadow: 0.35, glow: 2.2, starN: 0.6,
    prism: ['#FF8FC0', '#FFC6DF', '#FFFFFF', '#8FD3FF', '#B9A8FF', '#FF8FC0'], phA: 0.26,
  },
  light: {
    text: '#1C2140', mute: '#5A6386', line: '#D3D9EB',
    pink: '#E4579A', pink2: '#C23F7E', hot: '#E23D85', ice: '#2A86D2', ice2: '#3F8FD4', lav: '#7660DA',
    lock: '#1C9660', amber: '#BD7A0C', peach: '#D2672F', red: '#D6405D',
    hi: '#3A6CB4', node: '#FFFFFF', s1: '#F3F6FD', s2: '#E9EEF9', s3: '#D6DEF1', snow: '#86BDEB',
    paper: '#FFFFFF', paperLine: '#D7DCEC', shadow: 0.1, glow: 1.1, starN: 0.45,
    prism: ['#E4579A', '#B34FD0', '#7660DA', '#2A86D2', '#7660DA', '#E4579A'], phA: 0.16,
  },
};
let C = THEMES.dark;
let out = root;

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
  @keyframes bob{50%{transform:translateY(-8px)}}
  @keyframes rise{0%{transform:translateY(14px);opacity:0}100%{transform:none;opacity:1}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;

// ---------- shared defs ----------
const baseDefs = (W) => `
<linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.ice}"/></linearGradient>
<linearGradient id="prism" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${f1(W / 2)}" y2="0" spreadMethod="repeat">
  ${C.prism.map((c, i) => `<stop offset="${f1(i / (C.prism.length - 1))}" stop-color="${c}"/>`).join('')}
  <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="${f1(W / 2)} 0" dur="10s" repeatCount="indefinite"/>
</linearGradient>
<linearGradient id="tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.ice}" stop-opacity="0"/><stop offset=".7" stop-color="${C.ice}" stop-opacity=".6"/><stop offset="1" stop-color="${C.hi}"/></linearGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.hi}" stop-opacity="0"/><stop offset=".5" stop-color="${C.hi}" stop-opacity=".16"/><stop offset="1" stop-color="${C.hi}" stop-opacity="0"/></linearGradient>
<linearGradient id="crys" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset=".45" stop-color="#CDEBFF" stop-opacity=".65"/><stop offset="1" stop-color="#4FA8E8" stop-opacity=".3"/></linearGradient>
<radialGradient id="blobP"><stop offset="0" stop-color="${C.pink}" stop-opacity=".22"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<radialGradient id="blobI"><stop offset="0" stop-color="${C.ice}" stop-opacity=".2"/><stop offset="1" stop-color="${C.ice}" stop-opacity="0"/></radialGradient>
<radialGradient id="blobL"><stop offset="0" stop-color="${C.lav}" stop-opacity=".18"/><stop offset="1" stop-color="${C.lav}" stop-opacity="0"/></radialGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${C.glow}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>`;

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
const sparkle = (x, y, s, fill, delay = 0, dur = 3.6) =>
  `<path d="${starPath(x, y, s)}" fill="${fill}" style="transform-origin:${f1(x)}px ${f1(y)}px;animation:tw ${dur}s ease-in-out ${delay}s infinite"/>`;
const hexPts = (cx, cy, r, off = 0) => Array.from({ length: 6 }, (_, i) => {
  const a = ((i * 60 + off - 90) * Math.PI) / 180;
  return `${f1(cx + r * Math.cos(a))},${f1(cy + r * Math.sin(a))}`;
}).join(' ');

// soft colour washes that fade out well before the edges (no hard panel on a transparent page)
function blobs(list) {
  return list.map(([cx, cy, rx, ry, id, dur]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"><animate attributeName="rx" values="${rx};${f1(rx * 1.12)};${rx}" dur="${dur}s" repeatCount="indefinite"/></ellipse>`).join('');
}

function stars(W, H, n, seed) {
  const r = rng(seed);
  const cols = [C.hi, C.ice, C.pink];
  let s = '';
  for (let i = 0; i < Math.round(n * C.starN); i++) {
    const d = f1(3 + r() * 4);
    s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(0.6 + r() * 1.1)}" fill="${cols[i % 3]}"><animate attributeName="opacity" values=".08;.7;.08" dur="${d}s" begin="-${f1(r() * d)}s" repeatCount="indefinite"/></circle>`;
  }
  return s;
}

function snowfall(W, H, n, seed, { min = 10, max = 18, op = 0.7 } = {}) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = f1(r() * W), drift = f1((r() - 0.5) * 90), d = f1(min + r() * (max - min)), big = r() < 0.3;
    const size = f1(big ? 4 + r() * 4 : 0.9 + r() * 1.6);
    const shape = big
      ? `<g>${snow(0, 0, size, C.snow, 1.1)}${spin(0, 0, f1(8 + r() * 6), r() < 0.5 ? 1 : -1)}</g>`
      : `<circle r="${size}" fill="${C.snow}"/>`;
    s += `<g opacity="${f1(op * (0.45 + r() * 0.55))}">${shape}<animateTransform attributeName="transform" type="translate" values="${x} -12;${f1(x + drift)} ${H + 12}" dur="${d}s" begin="-${f1(r() * d)}s" repeatCount="indefinite"/></g>`;
  }
  return s;
}

const arrowShape = (len) => `<rect x="${-len}" y="-1.6" width="${len}" height="3.2" rx="1.6" fill="url(#tail)"/><path d="M0 -6.5L21 0L0 6.5L5 0Z" fill="${C.hi}"/><path d="M${-len + 8} 0l-12 -7M${-len + 8} 0l-12 7M${-len + 20} 0l-12 -7M${-len + 20} 0l-12 7" stroke="${C.ice}" stroke-width="2" stroke-linecap="round"/>`;

// A volley of ice arrows: each streaks in, lands, and bursts into frost.
function volley(n, seed, { xs = [0, 1200], ys = [200, 400], ang = 112, len = 150, dur = 4.4, travel = 520 } = {}) {
  const r = rng(seed);
  const rad = (ang * Math.PI) / 180, dx = Math.cos(rad), dy = Math.sin(rad);
  let s = '';
  for (let i = 0; i < n; i++) {
    const ex = f1(xs[0] + r() * (xs[1] - xs[0])), ey = f1(ys[0] + r() * (ys[1] - ys[0]));
    const sx = f1(ex - dx * travel), sy = f1(ey - dy * travel);
    const d = f1(dur * (0.8 + r() * 0.6)), b = f1(r() * d);
    const tm = `dur="${d}s" begin="-${b}s" repeatCount="indefinite"`;
    s += `<g opacity="0"><animateTransform attributeName="transform" type="translate" values="${sx} ${sy};${ex} ${ey};${ex} ${ey}" keyTimes="0;.26;1" ${tm}/><animate attributeName="opacity" values="0;.9;.9;0;0" keyTimes="0;.04;.25;.31;1" ${tm}/>
<g transform="rotate(${ang})">${arrowShape(len)}</g></g>
<g transform="translate(${ex} ${ey})" opacity="0"><animate attributeName="opacity" values="0;0;.9;0;0" keyTimes="0;.25;.27;.45;1" ${tm}/>
<circle r="4" fill="none" stroke="${C.ice}" stroke-width="1.6"><animate attributeName="r" values="2;2;24;24" keyTimes="0;.26;.45;1" ${tm}/></circle>${snow(0, 0, 10, C.hi, 1.4)}</g>`;
  }
  return s;
}

function shard(x, y, s, rot, k = 0) {
  const w = s * 0.34, h = s;
  const pts = `0,${-h} ${f1(w)},${f1(-h * 0.55)} ${f1(w)},${f1(h * 0.55)} 0,${h} ${f1(-w)},${f1(h * 0.55)} ${f1(-w)},${f1(-h * 0.55)}`;
  const facet = `0,${-h} ${f1(w)},${f1(-h * 0.55)} ${f1(w)},${f1(h * 0.55)} 0,${h}`;
  return `<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="${5 + (k % 3)}s" begin="-${k}s" repeatCount="indefinite"/>
<g transform="rotate(${rot})"><polygon points="${pts}" fill="url(#crys)" stroke="${C.hi}" stroke-opacity=".75" stroke-width="1.2"/><polygon points="${facet}" fill="#3F8FD8" fill-opacity=".28"/><path d="M0 ${-h}V${h}" stroke="${C.hi}" stroke-opacity=".5"/></g></g></g>`;
}

// ---------- instant photos (fixed colours: they are prints, not page chrome) ----------
const photos = {
  sunset: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9EC8"/><stop offset=".62" stop-color="#FFCBA8"/><stop offset="1" stop-color="#8FD3FF"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/><circle cx="${f1(w * 0.62)}" cy="${f1(h * 0.6)}" r="${f1(h * 0.18)}" fill="#FFF4E6"/><rect y="${f1(h * 0.7)}" width="${w}" height="${f1(h * 0.3)}" fill="#6FA9E8" opacity=".9"/>
<path d="M${f1(w * 0.1)} ${f1(h * 0.8)}H${f1(w * 0.45)}M${f1(w * 0.55)} ${f1(h * 0.9)}H${f1(w * 0.9)}" stroke="#fff" stroke-opacity=".75" stroke-width="2"/><path d="${starPath(w * 0.22, h * 0.24, 6)}" fill="#fff"/>`,
  train: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2D7A"/><stop offset=".7" stop-color="#B7A6FF"/><stop offset="1" stop-color="#FF8FC0"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/><path d="M-4 ${f1(h * 0.5)}Q${f1(w * 0.5)} ${f1(h * 0.05)} ${w + 4} ${f1(h * 0.3)}" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 5" opacity=".8"/>
<path d="M0 ${f1(h * 0.82)}H${w}" stroke="#1A1F45" stroke-width="3"/>${[0, 1, 2].map((i) => `<rect x="${f1(w * 0.12 + i * w * 0.26)}" y="${f1(h * 0.62)}" width="${f1(w * 0.24)}" height="${f1(h * 0.18)}" rx="3" fill="#1A1F45"/><rect x="${f1(w * 0.16 + i * w * 0.26)}" y="${f1(h * 0.66)}" width="${f1(w * 0.07)}" height="${f1(h * 0.06)}" fill="#FFD28A"/>`).join('')}`,
  ice: (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8F7FF"/><stop offset="1" stop-color="#7FBDF0"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/>${[[0.3, 0.55, 0.42, -15], [0.62, 0.5, 0.5, 10], [0.82, 0.68, 0.3, 25]].map(([a, b, s, rot]) => `<g transform="translate(${f1(w * a)} ${f1(h * b)}) rotate(${rot})"><polygon points="0,${f1(-h * s)} ${f1(h * s * 0.3)},${f1(-h * s * 0.5)} ${f1(h * s * 0.3)},${f1(h * s * 0.5)} 0,${f1(h * s)} ${f1(-h * s * 0.3)},${f1(h * s * 0.5)} ${f1(-h * s * 0.3)},${f1(-h * s * 0.5)}" fill="#fff" fill-opacity=".7" stroke="#4F8FD0" stroke-opacity=".6"/></g>`).join('')}`,
  // replaces the old camera: a pastel target with one ice arrow dead centre, frost blooming around it
  bullseye: (w, h, id) => {
    const cx = f1(w * 0.44), cy = f1(h * 0.56), u = h / 100;
    const rings = [[36, '#FFFFFF'], [28, '#FF8FC0'], [20, '#FFFFFF'], [12, '#FF5FA2'], [5, '#FFFFFF']];
    return `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE9FF"/><stop offset="1" stop-color="#FFD6E8"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/>
<g transform="translate(${cx} ${cy})">${rings.map(([r, c]) => `<circle r="${f1(r * u)}" fill="${c}" stroke="#E86FA6" stroke-opacity=".35"/>`).join('')}
<g stroke="#9FD4FF" stroke-width="1.4" stroke-linecap="round" fill="none">${[0, 60, 120, 180, 240, 300].map((a) => `<path transform="rotate(${a})" d="M0 0V${f1(-9 * u)}"/>`).join('')}</g>
<g transform="rotate(-38)"><path d="M0 0H${f1(44 * u)}" stroke="#2C5E9E" stroke-width="${f1(2.6 * u)}" stroke-linecap="round"/><path d="M${f1(36 * u)} 0l${f1(8 * u)} ${f1(-5 * u)}M${f1(36 * u)} 0l${f1(8 * u)} ${f1(5 * u)}M${f1(30 * u)} 0l${f1(8 * u)} ${f1(-5 * u)}M${f1(30 * u)} 0l${f1(8 * u)} ${f1(5 * u)}" stroke="#8FD3FF" stroke-width="${f1(2 * u)}" stroke-linecap="round"/></g></g>
<path d="${starPath(w * 0.82, h * 0.18, 5)}" fill="#fff"/><path d="${starPath(w * 0.14, h * 0.2, 3.5)}" fill="#fff"/>`;
  },
};
function tinted(tint, glyph) {
  return (w, h, id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="#1A2350"/></linearGradient>
<rect width="${w}" height="${h}" fill="url(#${id}g)"/><g transform="translate(${f1(w / 2)} ${f1(h / 2)})">${glyph}</g>`;
}

function polaroid(x, y, rot, w, h, photo, caption, id, { tape = C.pink, swing = 0, dur = 4 } = {}) {
  const pad = 7, ph = h - pad - 28;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${swing ? `<g><animateTransform attributeName="transform" type="rotate" values="${-swing};${swing};${-swing}" dur="${dur}s" repeatCount="indefinite"/>` : '<g>'}
<rect x="${f1(-w / 2 + 3)}" y="5" width="${w}" height="${h}" rx="3" fill="#0A0F2A" opacity="${C.shadow}"/>
<rect x="${f1(-w / 2)}" y="0" width="${w}" height="${h}" rx="3" fill="${C.paper}" stroke="${C.paperLine}"/>
<clipPath id="${id}"><rect x="${f1(-w / 2 + pad)}" y="${pad}" width="${w - 2 * pad}" height="${ph}"/></clipPath>
<g clip-path="url(#${id})"><g transform="translate(${f1(-w / 2 + pad)} ${pad})">${photo(w - 2 * pad, ph, id)}</g></g>
<text x="0" y="${h - 9}" text-anchor="middle" font-size="13" font-style="italic" font-weight="700" fill="#5B5F86">${esc(caption)}</text>
<rect x="-18" y="-9" width="36" height="15" fill="${tape}" opacity=".75" transform="rotate(-5)"/></g></g>`;
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
  const W = C.hi === '#FFFFFF' ? '#FFFFFF' : '#CFE8FF';
  const faces = [
    [['tl', 'tcL', 'bcL', 'bl'], W, 0.24],
    [['tcL', 'tcR', 'bcR', 'bcL'], '#CDEBFF', 0.14],
    [['tcR', 'tr', 'br', 'bcR'], '#5FA6EE', 0.26],
    [['top', 'tcL', 'tl'], W, 0.45],
    [['top', 'tcR', 'tcL'], W, 0.3],
    [['top', 'tr', 'tcR'], '#8FD3FF', 0.38],
    [['bl', 'bcL', 'bot'], '#B9A8FF', 0.28],
    [['bcL', 'bcR', 'bot'], '#FF8FC0', 0.2],
    [['bcR', 'br', 'bot'], '#5FA6EE', 0.32],
  ].map(([ks, col, op]) => `<polygon points="${ks.map(pt).join(' ')}" fill="${col}" fill-opacity="${op}"/>`).join('');
  const edges = [['top', 'tcL'], ['top', 'tcR'], ['tcL', 'bcL'], ['tcR', 'bcR'], ['tcL', 'tcR'], ['bcL', 'bcR'], ['bcL', 'bot'], ['bcR', 'bot'], ['tl', 'tcL'], ['tcR', 'tr'], ['bl', 'bcL'], ['bcR', 'br']]
    .map(([a, b]) => `M${pt(a).replace(',', ' ')}L${pt(b).replace(',', ' ')}`).join('');
  const cracks = [
    `M${cx} ${cy - 10}L${cx - 40} ${cy - 70}L${cx - 70} ${cy - 92}`, `M${cx} ${cy - 10}L${cx + 52} ${cy - 44}L${cx + 90} ${cy - 40}`,
    `M${cx} ${cy - 10}L${cx + 30} ${cy + 64}L${cx + 58} ${cy + 108}`, `M${cx} ${cy - 10}L${cx - 50} ${cy + 50}L${cx - 88} ${cy + 64}`,
    `M${cx} ${cy - 10}L${cx - 6} ${cy - 120}`,
  ];
  return `
<ellipse cx="${cx}" cy="${cy + 214}" rx="150" ry="16" fill="${C.ice}" opacity=".22" filter="url(#soft)"/>
<circle cx="${cx}" cy="${cy}" r="230" fill="url(#halo)"/>
<g>${spin(cx, cy, 90)}<polygon points="${hexPts(cx, cy, 236)}" fill="none" stroke="${C.pink}" stroke-opacity=".35" stroke-width="1.4"/><polygon points="${hexPts(cx, cy, 236, 30)}" fill="none" stroke="${C.ice}" stroke-opacity=".3" stroke-dasharray="2 8"/></g>
<g opacity=".1">${spin(cx, cy, 160, -1)}${snow(cx, cy, 250, C.ice, 3)}</g>
<g>${spin(cx, cy, 60, -1)}<circle cx="${cx}" cy="${cy}" r="214" fill="none" stroke="${C.lav}" stroke-opacity=".35" stroke-dasharray="10 14"/></g>
<circle r="4" fill="${C.hi}"><animateMotion dur="10s" repeatCount="indefinite" path="M${cx - 222} ${cy}a222 222 0 1 1 444 0a222 222 0 1 1 -444 0"/></circle>
<circle r="3.5" fill="${C.pink}"><animateMotion dur="14s" repeatCount="indefinite" path="M${cx - 200} ${cy}a200 200 0 1 0 400 0a200 200 0 1 0 -400 0"/></circle>
<g style="animation:bob 7s ease-in-out infinite">
<polygon points="${outline}" fill="#9CD8FF" fill-opacity=".12" stroke="${C.hi}" stroke-opacity=".85" stroke-width="2.2"/>
${faces}
<path d="${edges}" stroke="${C.hi}" stroke-opacity=".45" stroke-width="1.1" fill="none"/>
<g clip-path="url(#iceclip)">
  <circle cx="${cx}" cy="${cy - 6}" r="56" fill="${C.pink}" opacity=".3" filter="url(#soft)"><animate attributeName="opacity" values=".18;.4;.18" dur="4.5s" repeatCount="indefinite"/></circle>
  <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="58" font-weight="900" fill="url(#prism)" textLength="168" lengthAdjust="spacingAndGlyphs">03.07</text>
  <text x="${cx}" y="${cy + 42}" text-anchor="middle" class="m" font-size="12" fill="${C.hi}" letter-spacing="4" opacity=".85">ETERNAL · ICE</text>
  ${cracks.map((d, i) => `<path d="${d}" fill="none" stroke="${C.hi}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="170" stroke-dashoffset="170"><animate attributeName="stroke-dashoffset" values="170;170;0;0;170" keyTimes="0;${f1(0.08 + i * 0.06)};${f1(0.3 + i * 0.06)};.9;1" dur="8s" repeatCount="indefinite"/></path>`).join('')}
  <rect x="${cx - 260}" y="${cy - 220}" width="90" height="440" fill="url(#sheen)" transform="skewX(-18)"><animate attributeName="x" values="${cx - 260};${cx + 260};${cx + 260}" keyTimes="0;.32;1" dur="6s" repeatCount="indefinite"/></rect>
</g>
</g>
${shard(cx - 150, cy + 170, 40, -28, 0)}${shard(cx + 152, cy + 176, 34, 24, 1)}${shard(cx - 196, cy + 112, 22, -48, 2)}${shard(cx + 196, cy - 150, 18, 36, 1.5)}${shard(cx - 180, cy - 170, 14, -30, 3)}`;
}

// ---------- hero ----------
function hero() {
  const W = 1200, H = 600, CX = 280, CY = 270;
  const tick = '三月七 ✦ MARCH 7TH ✦ 03.07 ✦ WEB APPS ✦ DEVELOPER TOOLS ✦ MINECRAFT AUTOMATION ✦ 正中靶心 ✦ ';
  const icePoly = [[CX, CY - 200], [CX + 96, CY - 128], [CX + 96, CY + 118], [CX, CY + 196], [CX - 96, CY + 118], [CX - 96, CY - 128]].map((q) => q.join(',')).join(' ');
  return `${svgOpen(W, H, 'March7th · 团队主页', '一块永不融化的冰里冻着 03.07，冰箭划过，拍立得在周围漂浮。March7thTeam：把好奇心写成工具，把想象力做成交互。')}
<defs>${baseDefs(W)}
<radialGradient id="halo"><stop offset="0" stop-color="${C.ice}" stop-opacity=".2"/><stop offset=".55" stop-color="${C.pink}" stop-opacity=".07"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<clipPath id="all"><rect width="${W}" height="${H}"/></clipPath>
<clipPath id="iceclip"><polygon points="${icePoly}"/></clipPath>
<clipPath id="t1"><text x="560" y="236" font-size="128" font-weight="900" textLength="590" lengthAdjust="spacingAndGlyphs">MARCH</text></clipPath>
<style>@keyframes tick{to{transform:translateX(-50%)}}</style>
</defs>
<g clip-path="url(#all)">
${blobs([[300, 280, 330, 260, 'blobI', 14], [900, 220, 360, 180, 'blobP', 17], [820, 470, 300, 120, 'blobL', 12]])}
${stars(W, H - 60, 70, 37)}
${volley(5, 307, { xs: [40, 430], ys: [440, 520], ang: 104, travel: 600, len: 160 })}
${eternalIce(CX, CY)}
${polaroid(118, 64, -16, 112, 134, photos.sunset, '03.07 ♡', 'pA', { tape: C.pink, swing: 2.5, dur: 6 })}
${polaroid(452, 360, 12, 104, 124, photos.bullseye, 'bullseye!', 'pB', { tape: C.ice, swing: 2.5, dur: 5.2 })}
${polaroid(440, 70, 9, 92, 112, photos.train, 'next stop', 'pC', { tape: C.lav, swing: 2, dur: 7 })}
${snowfall(W, H - 60, 30, 703)}

<!-- ticker -->
<path d="M40 ${H - 54}H${W - 40}" stroke="url(#brand)" stroke-width="1.5" opacity=".55"/>
<g style="transform-box:fill-box;animation:tick 34s linear infinite"><text x="0" y="${H - 20}" class="m" font-size="17" font-weight="700" fill="url(#prism)" letter-spacing="3">${esc(tick.repeat(4))}</text></g>
</g>

<!-- type -->
<g transform="translate(562 82)"><rect width="262" height="36" rx="18" fill="${C.pink}" fill-opacity=".1" stroke="${C.pink}" stroke-opacity=".7"/>
<g>${spin(22, 18, 10)}${snow(22, 18, 10, C.pink, 2)}</g><text x="42" y="25" font-size="18" font-weight="800" fill="${C.pink2}" letter-spacing="2">三月七 · MARCH 7TH</text></g>
<text x="842" y="106" class="m" font-size="14" fill="${C.ice}" letter-spacing="3">TEAM · EST. 2022</text>

<text x="560" y="236" font-size="128" font-weight="900" fill="url(#prism)" textLength="590" lengthAdjust="spacingAndGlyphs">MARCH</text>
<g clip-path="url(#t1)"><rect x="300" y="110" width="150" height="150" fill="url(#sheen)" transform="skewX(-20)"><animate attributeName="x" values="300;1300;1300" keyTimes="0;.4;1" dur="7s" repeatCount="indefinite"/></rect></g>

<text x="556" y="392" font-size="168" font-weight="900" fill="${C.hi}" fill-opacity=".04" stroke="url(#prism)" stroke-width="3" textLength="350" lengthAdjust="spacingAndGlyphs">7TH</text>
<g transform="translate(934 300)">
  <text x="0" y="0" font-size="50" font-weight="900" fill="${C.pink2}">三月七</text>
  <rect x="0" y="16" width="200" height="4" rx="2" fill="url(#brand)"/>
  <text x="0" y="48" class="m" font-size="15" fill="${C.ice2}" letter-spacing="2">ICE · ARROW · SNAP</text>
  <text x="0" y="74" class="m" font-size="13" fill="${C.mute}" letter-spacing="2">f/3.7 · 1/307s · ISO 307</text>
</g>
<g>${snow(1128, 150, 16, C.ice, 2)}${snow(910, 330, 8, C.ice2, 1.5)}</g>
${sparkle(980, 140, 9, C.hi, 0.4)}${sparkle(1150, 240, 7, C.pink, 1.4)}${sparkle(700, 420, 8, C.ice, 2)}

<text x="562" y="458" font-size="31" font-weight="800" fill="${C.text}">把好奇心写成工具，把想象力做成交互。</text>
<text x="562" y="496" class="m" font-size="15" fill="${C.ice2}" textLength="580" lengthAdjust="spacing">WEB APPS · DEVELOPER TOOLS · MINECRAFT AUTOMATION</text>

<!-- shutter: a frost ripple from the ice and a small sticker, no full-frame flash -->
<circle cx="${CX}" cy="${CY}" r="0" fill="none" stroke="${C.ice}" stroke-width="2"><animate attributeName="r" values="0;0;260;260" keyTimes="0;.8;.92;1" dur="8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;.7;0;0" keyTimes="0;.799;.81;.92;1" dur="8s" repeatCount="indefinite"/></circle>
<g transform="translate(410 300) rotate(-10)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.8;.81;.95;.98;1" dur="8s" repeatCount="indefinite"/>
<g><animateTransform attributeName="transform" type="scale" values=".4;.4;1.15;1;1" keyTimes="0;.8;.83;.86;1" dur="8s" repeatCount="indefinite"/>
<rect x="-62" y="-26" width="124" height="40" rx="10" fill="${C.hot}" stroke="${C.node}" stroke-width="3"/><text x="0" y="3" text-anchor="middle" font-size="24" font-weight="900" fill="#fff">咔嚓！</text></g></g>
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
    const d = 7, b = i * 1.75;
    return `<g opacity="0"><animate attributeName="opacity" values="0;.85;0" keyTimes="0;.1;1" dur="${d}s" begin="${b}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="230 120;${360 + i * 40} ${-60 + i * 20}" dur="${d}s" begin="${b}s" repeatCount="indefinite"/>
<g><animateTransform attributeName="transform" type="rotate" values="0;${200 + i * 60}" dur="${d}s" begin="${b}s" repeatCount="indefinite"/><rect x="-26" y="-18" width="52" height="36" rx="3" fill="${C.paper}" stroke="${C.paperLine}"/><text x="0" y="8" text-anchor="middle" font-size="20" font-weight="900" fill="#9AA6CC">${3 + i}</text></g></g>`;
  }).join('');
  return `${svgOpen(W, H, '名字的由来：03.07', lines.map((l) => l[0]).join(''))}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}"/></clipPath>
<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9F0FF"/></linearGradient>
<linearGradient id="frost" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#8FD3FF" stop-opacity=".7"/><stop offset=".4" stop-color="#CDEBFF" stop-opacity=".2"/><stop offset="1" stop-color="#CDEBFF" stop-opacity="0"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="${C.pink}" stop-opacity=".2"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient></defs>
<g clip-path="url(#r)">
${blobs([[820, 200, 380, 150, 'blobI', 15]])}
${stars(W, H, 40, 77)}
<circle cx="240" cy="210" r="200" fill="url(#halo)"/>
<g opacity=".1">${spin(1100, 330, 110)}${snow(1100, 330, 140, C.ice, 3)}</g>
${torn}
<g transform="translate(240 206) rotate(-6)"><g style="animation:bob 7s ease-in-out infinite">
  <rect x="-128" y="-140" width="256" height="292" rx="16" fill="#0A0F2A" opacity="${C.shadow}" transform="translate(7 9)"/>
  <rect x="-128" y="-140" width="256" height="292" rx="16" fill="url(#paper)" stroke="${C.paperLine}"/>
  <path d="M-128 -124a16 16 0 0 1 16 -16h224a16 16 0 0 1 16 16v54h-256z" fill="${C.hot}"/>
  <text x="0" y="-92" text-anchor="middle" font-size="26" font-weight="900" fill="#fff" letter-spacing="6">MARCH</text>
  ${[-80, -40, 0, 40, 80].map((x) => `<circle cx="${x}" cy="-140" r="7" fill="#1A2350" stroke="#C9D4F0" stroke-width="3"/>`).join('')}
  <text x="0" y="78" text-anchor="middle" font-size="190" font-weight="900" fill="url(#prism)" stroke="#2A3566" stroke-width="2" paint-order="stroke">7</text>
  <text x="0" y="122" text-anchor="middle" font-size="16" font-weight="700" fill="#5B5F86" letter-spacing="3">冰中醒来的那一天</text>
  <rect x="-128" y="40" width="256" height="112" fill="url(#frost)"/>
  <g>${snow(-100, 130, 13, '#fff', 2)}${snow(98, 118, 10, '#fff', 1.8)}${snow(-58, 142, 7, '#fff', 1.5)}</g>
  <g transform="translate(92 -40) rotate(14)"><path d="M0 8C-14 -6 -10 -18 0 -12C10 -18 14 -6 0 8Z" fill="#FF8FC0" stroke="#fff" stroke-width="2.5"/></g>
  <circle cx="0" cy="-30" r="0" fill="none" stroke="#FF5FA2" stroke-width="4" opacity=".8"><animate attributeName="r" values="0;0;96;96" keyTimes="0;.15;.4;1" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.8;.8;0" keyTimes="0;.15;.85;1" dur="7s" repeatCount="indefinite"/></circle>
</g></g>
${polaroid(410, 210, 10, 96, 114, photos.ice, 'day one', 'pI', { tape: C.pink, swing: 2.5, dur: 6 })}
${shard(80, 90, 22, -30, 0)}${shard(420, 70, 16, 26, 1)}${shard(60, 340, 14, 50, 2)}
${snowfall(W, H, 24, 1307)}
</g>
<text x="540" y="78" class="m" font-size="14" fill="${C.ice}" letter-spacing="4">00 · WHY “MARCH 7TH”</text>
<text x="540" y="132" font-size="44" font-weight="900" fill="url(#prism)">名字，来自一块冰</text>
<rect x="540" y="150" width="72" height="5" rx="2.5" fill="${C.hot}"/>
${lines.map(([t, col, wt], i) => `<text x="540" y="${198 + i * 34 + (i >= 3 ? 14 : 0)}" font-size="21" fill="${col}" font-weight="${wt}" style="animation:rise 1s ease-out ${f1(0.2 + i * 0.25)}s both">${esc(t)}</text>`).join('')}
${sparkle(1110, 80, 10, C.pink, 0.5)}${sparkle(1150, 180, 8, C.ice, 1.5)}
</svg>`;
}

// ---------- section header: crystal index + an arrow drawing the underline ----------
function header(file, no, en, zh, sub, seed) {
  const W = 1200, H = 112;
  write(file, `${svgOpen(W, H, `${en} · ${zh}`, sub)}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}"/></clipPath></defs>
<g clip-path="url(#r)">
${stars(W, H, 30, seed)}
<path d="M120 92H1168" stroke="${C.line}" stroke-width="2"/>
<path d="M120 92H1168" stroke="url(#brand)" stroke-width="3" stroke-dasharray="1048" stroke-dashoffset="1048"><animate attributeName="stroke-dashoffset" values="1048;0;0;1048" keyTimes="0;.22;.9;1" dur="7s" repeatCount="indefinite"/></path>
<g opacity="0"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.22;.24;1" dur="7s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="130 92;1180 92;1180 92" keyTimes="0;.22;1" dur="7s" repeatCount="indefinite"/>${arrowShape(110)}</g>
<g transform="translate(1168 92)" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.21;.23;.4;1" dur="7s" repeatCount="indefinite"/><circle r="4" fill="none" stroke="${C.ice}" stroke-width="2"><animate attributeName="r" values="2;2;22;22" keyTimes="0;.22;.4;1" dur="7s" repeatCount="indefinite"/></circle>${snow(0, 0, 11, C.hi, 1.6)}</g>
</g>
<g transform="translate(62 54)">
  <g>${spin(0, 0, 30)}<polygon points="${hexPts(0, 0, 38)}" fill="${C.ice}" fill-opacity=".08" stroke="url(#brand)" stroke-width="2.5"/><polygon points="${hexPts(0, 0, 30, 30)}" fill="none" stroke="${C.hi}" stroke-opacity=".25"/></g>
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
    const s = `<g transform="translate(${f1(x)} 274)"><rect width="${f1(w)}" height="28" rx="6" fill="${tint}" fill-opacity=".1" stroke="${tint}" stroke-opacity=".6"/><text x="${f1(w / 2)}" y="19" text-anchor="middle" font-size="13" fill="${tint}" class="m" font-weight="700">${esc(c)}</text></g>`;
    x += w + 8;
    return s;
  }).join('');
  write(`projects/${file}.svg`, `${svgOpen(W, H, name, `${name}：${desc}`)}
<defs>${baseDefs(W)}
<linearGradient id="ph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint}" stop-opacity="${C.phA}"/><stop offset=".7" stop-color="${tint}" stop-opacity=".03"/><stop offset="1" stop-color="${tint}" stop-opacity="0"/></linearGradient>
<clipPath id="pc"><polygon points="${inner}"/></clipPath>
<clipPath id="cc"><polygon points="${outline}"/></clipPath>
<filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
<style>@keyframes run{from{transform:translateX(0)}to{transform:translateX(var(--d,200px))}}
@keyframes dash{to{stroke-dashoffset:-60}}
@keyframes sway{50%{transform:translateY(-5px)}}</style>
</defs>
<g clip-path="url(#cc)">
<polygon points="${outline}" fill="${tint}" fill-opacity=".04"/>
<g clip-path="url(#pc)">
  <rect width="${W}" height="200" fill="url(#ph)"/>
  <g transform="translate(14 14)">${art(tint)}</g>
  <g transform="translate(14 14)">${snowfall(572, 170, 8, seed, { min: 8, max: 13, op: 0.6 })}</g>
  <rect x="-200" y="0" width="120" height="200" fill="url(#sheen)" transform="skewX(-20)"><animate attributeName="x" values="-200;900;900" keyTimes="0;.35;1" dur="8s" begin="${f1((seed % 7) * 0.8)}s" repeatCount="indefinite"/></rect>
</g>
<polygon points="${inner}" fill="none" stroke="${tint}" stroke-opacity=".35"/>
<text x="586" y="318" text-anchor="end" font-size="96" font-weight="900" fill="none" stroke="${tint}" stroke-opacity=".22" stroke-width="2">${no}</text>
<g opacity=".12">${spin(470, 268, 40)}${snow(470, 268, 34, tint, 3)}</g>
</g>
<polygon points="${outline}" fill="none" stroke="url(#prism)" stroke-width="2"><animate attributeName="stroke-opacity" values=".55;.95;.55" dur="5s" repeatCount="indefinite"/></polygon>
<g transform="translate(556 2)">${shard(0, 18, 20, 40, seed % 4)}</g>
<g transform="translate(26 26)"><polygon points="${hexPts(16, 16, 16)}" fill="${tint}" fill-opacity=".18" stroke="${tint}"/><text x="16" y="21" text-anchor="middle" class="m" font-size="13" font-weight="900" fill="${C.text}">${no}</text></g>
<text x="62" y="47" class="m" font-size="12" fill="${C.text}" opacity=".75" letter-spacing="3">MEMORY SHARD</text>
<text x="28" y="226" class="m" font-size="27" font-weight="800" fill="${C.text}">${esc(name)}</text>
<text x="28" y="256" font-size="17.5" fill="${C.mute}">${esc(desc)}</text>
${chipSvg}
</svg>`);
}

// card artwork (each drawn in a 572x170 box)
const art = {
  api: (t) => `
<g fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 50H170L230 92H350" stroke="${C.ice}"/>
  <path d="M20 138H150L230 92" stroke="${C.pink}"/>
  <path d="M350 92H430L480 50H556" stroke="${C.lav}"/>
  <path d="M350 92H430L480 136H556" stroke="${C.amber}"/>
</g>
<path id="rt" d="M20 50H170L230 92H350H430L480 50H556" fill="none"/>
<path id="rt2" d="M20 138H150L230 92H350H430L480 136H556" fill="none"/>
${[[20, 50], [100, 50], [170, 50], [20, 138], [150, 138], [480, 50], [556, 50], [480, 136], [556, 136]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${C.node}" stroke="${C.text}" stroke-width="3"/>`).join('')}
<g><circle cx="290" cy="92" r="30" fill="${C.node}" stroke="${t}" stroke-width="4"/><circle cx="290" cy="92" r="38" fill="none" stroke="${t}" stroke-opacity=".5" stroke-dasharray="4 7" style="animation:dash 2s linear infinite"/>
<text x="290" y="99" class="m" font-size="20" font-weight="700" fill="${C.text}" text-anchor="middle">/v1</text></g>
<g filter="url(#glow)"><rect x="-11" y="-6" width="22" height="12" rx="6" fill="${C.hi}"/><animateMotion dur="5s" repeatCount="indefinite" rotate="auto"><mpath href="#rt"/></animateMotion></g>
<g filter="url(#glow)"><rect x="-11" y="-6" width="22" height="12" rx="6" fill="${C.pink}"/><animateMotion dur="6s" begin="-2s" repeatCount="indefinite" rotate="auto"><mpath href="#rt2"/></animateMotion></g>
<text x="200" y="162" class="m" font-size="12" fill="${C.mute}">model · key · credit</text>`,

  proxy: (t) => `
<g stroke="${C.line}" stroke-width="2" stroke-dasharray="4 6"><path d="M70 76H250M70 110H250M70 144H250M326 92H520"/></g>
${[76, 110, 144].map((y) => `<circle cx="70" cy="${y}" r="10" fill="${C.node}" stroke="${C.ice}" stroke-width="3"/>`).join('')}
<rect x="262" y="24" width="52" height="136" rx="10" fill="${C.node}" stroke="${t}" stroke-width="3"/>
<path d="M276 92l9 10 17-22" fill="none" stroke="${C.lock}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="288" y="44" class="m" font-size="11" fill="${t}" text-anchor="middle">ALLOW</text>
<circle cx="520" cy="92" r="30" fill="${C.node}" stroke="${t}" stroke-width="3"/><text x="520" y="98" class="m" font-size="14" fill="${t}" text-anchor="middle">origin</text>
<g style="--d:170px"><rect x="84" y="70" width="24" height="12" rx="3" fill="${C.ice}" style="animation:run 2.6s linear infinite"/></g>
<g style="--d:180px"><rect x="330" y="86" width="24" height="12" rx="3" fill="${C.pink}" style="animation:run 2.6s linear infinite .8s"/></g>
<g><rect x="84" y="138" width="24" height="12" rx="3" fill="${C.red}"><animate attributeName="x" values="84;226;226" keyTimes="0;.7;1" dur="3.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.7;1" dur="3.2s" repeatCount="indefinite"/></rect>
<text x="130" y="166" class="m" font-size="12" fill="${C.red}">10.0.0.0/8 ✕</text></g>`,

  atlas: (t) => `
<g stroke="${C.s3}" stroke-width="1">${Array.from({ length: 16 }, (_, i) => `<path d="M${i * 38} 0V170"/>`).join('')}${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${i * 38 + 6}H572"/>`).join('')}</g>
<rect x="30" y="36" width="150" height="112" rx="8" fill="${C.s1}" stroke="${C.line}" stroke-width="2"/>
<rect x="388" y="36" width="154" height="54" rx="8" fill="${C.s1}" stroke="${C.line}" stroke-width="2"/>
<rect x="388" y="102" width="154" height="46" rx="8" fill="${C.s1}" stroke="${C.line}" stroke-width="2"/>
<rect x="200" y="44" width="168" height="96" rx="8" fill="${t}" fill-opacity=".1" stroke="${t}" stroke-width="3"/>
<rect x="216" y="62" width="92" height="12" rx="4" fill="${C.text}" opacity=".75"/><rect x="216" y="84" width="132" height="8" rx="4" fill="${C.mute}"/><rect x="216" y="102" width="64" height="22" rx="11" fill="${t}"><animate attributeName="width" values="64;110;64" dur="4s" repeatCount="indefinite"/></rect>
${[[200, 44], [368, 44], [200, 140], [368, 140], [284, 44], [284, 140]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="2" fill="${C.node}" stroke="${t}" stroke-width="2"/>`).join('')}
<path d="M284 0V170M0 92H572" stroke="${t}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="5 5" style="animation:dash 3s linear infinite"/>
<g transform="translate(330 108)"><g><animateTransform attributeName="transform" type="translate" values="0 0;-30 -20;0 0" dur="4s" repeatCount="indefinite"/><path d="M0 0l22 8-9 3 6 12-5 3-6-12-8 7z" fill="${C.text}" stroke="${C.node}" stroke-width="2" stroke-linejoin="round"/></g></g>
<g transform="translate(404 12)"><rect width="120" height="18" rx="9" fill="${t}" fill-opacity=".18"/><text x="60" y="13" class="m" font-size="11" fill="${t}" text-anchor="middle">x 284 · y 44</text></g>`,

  fog: (t) => `
<circle cx="470" cy="48" r="20" fill="${C.amber}" opacity=".9"/><circle cx="470" cy="48" r="36" fill="${C.amber}" opacity=".12"/>
<path d="M120 52L330 20V90Z" fill="${C.amber}" opacity=".14"><animateTransform attributeName="transform" type="rotate" values="-8 120 52;10 120 52;-8 120 52" dur="6s" repeatCount="indefinite"/></path>
<g><rect x="108" y="56" width="22" height="74" fill="#C9D4F0" stroke="${C.line}"/><rect x="104" y="46" width="30" height="12" fill="${C.red}"/><path d="M104 46l15-14 15 14z" fill="#1A2350"/><circle cx="119" cy="52" r="5" fill="${C.amber}"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></circle></g>
<path d="M0 136H572V170H0Z" fill="${C.s2}"/>
${Array.from({ length: 9 }, (_, i) => `<rect x="${180 + i * 42}" y="122" width="8" height="52" fill="${C.s3}"/>`).join('')}
<rect x="170" y="118" width="380" height="8" fill="${C.s3}"/>
<g filter="url(#blur)" opacity=".9"><ellipse cx="120" cy="130" rx="150" ry="20" fill="#B8C7EE" opacity=".28"><animate attributeName="cx" values="120;180;120" dur="9s" repeatCount="indefinite"/></ellipse><ellipse cx="420" cy="114" rx="190" ry="18" fill="#B8C7EE" opacity=".24"><animate attributeName="cx" values="420;360;420" dur="11s" repeatCount="indefinite"/></ellipse><ellipse cx="300" cy="156" rx="260" ry="16" fill="#B8C7EE" opacity=".3"/></g>
<g stroke="${C.red}" stroke-width="2" fill="none"><path d="M360 50L440 80L520 60L400 102Z" stroke-dasharray="320" stroke-dashoffset="320"><animate attributeName="stroke-dashoffset" values="320;0;0" keyTimes="0;.5;1" dur="5s" repeatCount="indefinite"/></path></g>
${[[360, 50], [440, 80], [520, 60], [400, 102]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.red}"/>`).join('')}
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
    s += `<g style="animation:sway 3s ease-in-out infinite"><path d="M${cx} ${f1(hy)}l${f1(hw)} ${f1(hh)}v${f1(hw)}l${f1(-hw)} ${f1(hh)}l${f1(-hw)} ${f1(-hh)}v${f1(-hw)}z" fill="#8FD3FF" stroke="${C.ice}"/><rect x="${cx - 14}" y="${f1(hy + 16)}" width="8" height="8" fill="#0A0F1F"/><rect x="${cx + 6}" y="${f1(hy + 16)}" width="8" height="8" fill="#0A0F1F"/></g>`;
    s += `<g transform="translate(374 30)"><rect width="150" height="34" rx="8" fill="${C.node}" stroke="${t}"/><text x="12" y="22" class="m" font-size="14" fill="${t}">&gt; bot come<tspan><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>_</tspan></text></g>`;
    s += `<g class="m" font-size="12" fill="${C.mute}"><text x="24" y="162">1.8.8 → 26.1</text><text x="550" y="162" text-anchor="end">Paper · Fabric · Forge</text></g>`;
    return s;
  },

  paste: (t) => `<g transform="translate(40 6)">
<g transform="rotate(-8 150 100)"><rect x="70" y="50" width="170" height="116" rx="10" fill="${C.s1}" stroke="${C.line}" stroke-width="2"/></g>
<rect x="120" y="32" width="190" height="124" rx="10" fill="${C.s2}" stroke="${t}" stroke-width="3"/>
<text x="136" y="58" class="m" font-size="15" font-weight="700" fill="${t}"># hello.md</text>
<rect x="136" y="72" width="150" height="8" rx="4" fill="${C.text}" opacity=".7"/><rect x="136" y="90" width="110" height="8" rx="4" fill="${C.mute}"/><rect x="136" y="108" width="130" height="8" rx="4" fill="${C.mute}"/>
<rect x="136" y="128" width="60" height="16" rx="8" fill="${t}" fill-opacity=".2"/><text x="166" y="140" class="m" font-size="11" fill="${t}" text-anchor="middle">LOCKED</text>
<g transform="translate(430 92)"><circle r="42" fill="none" stroke="${C.line}" stroke-width="8"/>
<circle r="42" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round" stroke-dasharray="264" stroke-dashoffset="0" transform="rotate(-90)"><animate attributeName="stroke-dashoffset" values="0;264" dur="6s" repeatCount="indefinite"/></circle>
<text y="6" class="m" font-size="16" font-weight="700" fill="${C.text}" text-anchor="middle">burn</text></g>
<text x="430" y="160" class="m" font-size="12" fill="${C.mute}" text-anchor="middle">view once · expire</text></g>`,
};

// ---------- workflow: four arrows, one freeze-frame ----------
function archery() {
  // The archer stands on the left: string toward her, the belly of the bow and the arrow point at the targets.
  const W = 1200, H = 400, Y = 128;
  const steps = [
    ['01', '拉弓', 'DRAW', ['先想清楚为谁而做', '再定下它的样子'], C.ice, 300],
    ['02', '瞄准', 'AIM', ['原型落在真实页面', '看得见才算数'], C.pink, 560],
    ['03', '放箭', 'RELEASE', ['实现与回归测试', '每一步都能回退'], C.lav, 820],
    ['04', '定格', 'FREEZE', ['独立审查，留存证据', '确认之后再上线'], C.lock, 1080],
  ];
  const D = 7, LEN = 120, rel = 0.18, hit = 0.56;
  const S = 146, E = 1072; // arrow origin (its tip sits at +21) at full draw, and when it sticks in the last target
  const tm = `dur="${D}s" repeatCount="indefinite"`;
  const tAt = (x) => f3(rel + ((hit - rel) * (x - 8 - S)) / (E - S));

  // bow + string keyframes: rest -> full draw -> hold -> release with a damped twang
  const kt = '0;.04;.14;.18;.195;.21;.225;.24;.26;1';
  const sx = [78, 78, 26, 26, 94, 66, 86, 74, 78, 78];
  const tx = [78, 78, 70, 70, 80, 77, 79, 78, 78, 78];
  const ty = [84, 84, 80, 80, 85, 84, 84, 84, 84, 84];
  const cx = [140, 140, 148, 148, 137, 141, 139, 140, 140, 140];
  const arc = (i) => `M${tx[i] + 10} ${Y - ty[i] - 18}q-12 6 -10 18Q${cx[i]} ${Y} ${tx[i]} ${Y + ty[i]}q-2 12 10 18`;
  const str = (i) => `M${tx[i]} ${Y - ty[i]}L${sx[i]} ${Y}L${tx[i]} ${Y + ty[i]}`;
  const vals = (fn) => sx.map((_, i) => fn(i)).join(';');

  const targets = steps.map(([no, zh, en, lines, col, x], i) => {
    const t = Number(tAt(x));
    const a = f3(Math.max(t - 0.004, 0)), b = f3(t + 0.01), c = f3(t + 0.13);
    const k = `0;${a};${b};.92;1`;
    const sparks = Array.from({ length: 8 }, (_, j) => `<path transform="rotate(${j * 45 + 22.5})" d="M0 -16V-24" stroke="${j % 2 ? C.hi : col}" stroke-width="2.4" stroke-linecap="round"/>`).join('');
    return `<g transform="translate(${x} ${Y})">
<g>${spin(0, 0, 22 + i * 4, i % 2 ? -1 : 1)}<polygon points="${hexPts(0, 0, 50)}" fill="none" stroke="${col}" stroke-width="2.2" stroke-dasharray="${i % 2 ? '10 6' : 'none'}"/></g>
<polygon points="${hexPts(0, 0, 50)}" fill="none" stroke="${C.hi}" stroke-width="2.6" opacity="0"><animate attributeName="opacity" values="0;0;.9;0;0" keyTimes="0;${a};${b};${c};1" ${tm}/></polygon>
<polygon points="${hexPts(0, 0, 36, 30)}" fill="${col}" fill-opacity=".08" stroke="${col}" stroke-opacity=".55"><animate attributeName="fill-opacity" values=".08;.08;.4;.16;.08" keyTimes="${k}" ${tm}/></polygon>
<circle r="12" fill="${col}" opacity=".3"><animate attributeName="opacity" values=".3;.3;.95;.55;.3" keyTimes="${k}" ${tm}/><animate attributeName="r" values="12;12;20;14;12" keyTimes="${k}" ${tm}/></circle>
<g opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;${a};${b};${c};1" ${tm}/><g><animateTransform attributeName="transform" type="scale" values="1;1;1;2.4;2.4" keyTimes="0;${a};${b};${c};1" ${tm}/>${sparks}</g></g>
<g opacity="0"><animate attributeName="opacity" values="0;0;.9;0;0" keyTimes="0;${a};${b};${c};1" ${tm}/><circle r="10" fill="none" stroke="${col}" stroke-width="2"><animate attributeName="r" values="10;10;10;66;66" keyTimes="0;${a};${b};${c};1" ${tm}/></circle></g>
<text y="-66" text-anchor="middle" class="m" font-size="13" fill="${col}" letter-spacing="3">${no} · ${en}</text>
<text y="118" text-anchor="middle" font-size="40" font-weight="900" fill="${C.text}">${zh}</text>
<rect x="-24" y="132" width="48" height="5" rx="2.5" fill="${col}"/>
<text y="172" text-anchor="middle" font-size="19" fill="${C.text}">${esc(lines[0])}</text>
<text y="200" text-anchor="middle" font-size="19" fill="${C.mute}">${esc(lines[1])}</text>
</g>`;
  }).join('');

  // frost gathering at the arrowhead while the bow is held at full draw
  const hx = S + 21;
  const charge = [[-26, -22], [24, -26], [30, 20], [-22, 26]].map(([dx, dy], i) => {
    const s0 = f3(0.05 + i * 0.015);
    return `<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;${s0};${f3(0.08 + i * 0.015)};.165;.18;1" ${tm}/><animateTransform attributeName="transform" type="translate" values="${hx + dx} ${Y + dy};${hx + dx} ${Y + dy};${hx} ${Y};${hx} ${Y}" keyTimes="0;${s0};.17;1" ${tm}/><path d="${starPath(0, 0, 5)}" fill="${i % 2 ? C.pink : C.ice}"/></g>`;
  }).join('');
  const chargeGlow = `<circle cx="${hx}" cy="${Y}" r="0" fill="${C.ice}" opacity=".35"><animate attributeName="r" values="0;0;14;0;0" keyTimes="0;.08;.175;.185;1" ${tm}/></circle>`;

  // the arrow (nocked on the string), with a light streak and two fading echoes in flight
  const arrow = `<g><animateTransform attributeName="transform" type="translate" values="${78 + LEN - 120 + 120} ${Y};${78 + LEN} ${Y};${S} ${Y};${S} ${Y};${E} ${Y};${E} ${Y}" keyTimes="0;.04;.14;${rel};${hit};1" ${tm}/><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.03;.86;.9;1" ${tm}/>
<rect x="${-LEN - 200}" y="-1.2" width="200" height="2.4" rx="1.2" fill="url(#tail)" opacity="0"><animate attributeName="opacity" values="0;0;.8;.8;0;0" keyTimes="0;${rel};${f3(rel + 0.02)};${f3(hit - 0.03)};${hit};1" ${tm}/></rect>
${arrowShape(LEN)}</g>`;
  const echo = (dl, op) => `<g opacity="0"><animateTransform attributeName="transform" type="translate" values="${S} ${Y};${S} ${Y};${E} ${Y};${E} ${Y}" keyTimes="0;${f3(rel + dl)};${f3(hit + dl)};1" ${tm}/><animate attributeName="opacity" values="0;0;${op};${op};0;0" keyTimes="0;${f3(rel + dl)};${f3(rel + dl + 0.01)};${f3(hit + dl - 0.02)};${f3(hit + dl)};1" ${tm}/>${arrowShape(50)}</g>`;
  const trail = 1080 - hx;

  return `${svgOpen(W, H, '四箭定格：拉弓、瞄准、放箭、定格', '我们的工作流像一次射箭：先想清楚为谁而做（拉弓），在真实页面里验收原型（瞄准），带回归测试地实现（放箭），独立审查、留存证据后再上线（定格）。')}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}"/></clipPath>
<linearGradient id="bow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.pink}"/><stop offset=".5" stop-color="${C.lav}"/><stop offset="1" stop-color="${C.ice}"/></linearGradient></defs>
<g clip-path="url(#r)">
${blobs([[600, 330, 520, 90, 'blobL', 16]])}
${stars(W, H, 50, 91)}
<path d="M${hx} ${Y}H1080" stroke="${C.line}" stroke-width="2" stroke-dasharray="3 6"/>
<path d="M${hx} ${Y}H1080" stroke="url(#brand)" stroke-width="3.5" stroke-dasharray="${trail}" stroke-dashoffset="${trail}"><animate attributeName="stroke-dashoffset" values="${trail};${trail};0;0;${trail}" keyTimes="0;${rel};${hit};.94;1" ${tm}/><animate attributeName="opacity" values="1;1;1;0;0" keyTimes="0;.6;.88;.94;1" ${tm}/></path>
${targets}
<!-- bow: belly toward the targets, string toward the archer -->
<path d="${arc(0)}" fill="none" stroke="url(#bow)" stroke-width="6" stroke-linecap="round"><animate attributeName="d" values="${vals(arc)}" keyTimes="${kt}" ${tm}/></path>
<path d="${str(0)}" fill="none" stroke="${C.hi}" stroke-width="1.6" stroke-linejoin="round"><animate attributeName="d" values="${vals(str)}" keyTimes="${kt}" ${tm}/></path>
<rect x="103" y="${Y - 15}" width="12" height="30" rx="5" fill="${C.pink}"/>
<g transform="translate(109 ${Y + 15})"><g><animateTransform attributeName="transform" type="rotate" values="0;0;-14;10;-6;0;0" keyTimes="0;${rel};${f3(rel + 0.03)};${f3(rel + 0.07)};${f3(rel + 0.11)};${f3(rel + 0.15)};1" ${tm}/>
<path d="M0 0V20" stroke="${C.pink}" stroke-width="1.5"/>${snow(0, 28, 8, C.ice, 1.6)}</g></g>
${chargeGlow}${charge}
${echo(0.012, 0.35)}${echo(0.024, 0.18)}
${arrow}
<!-- freeze frame at the last target -->
<g transform="translate(1080 ${Y})" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;${hit};${f3(hit + 0.01)};.88;.94;1" ${tm}/>
<g><animateTransform attributeName="transform" type="scale" values="0;0;1.2;1;1" keyTimes="0;${hit};${f3(hit + 0.04)};${f3(hit + 0.07)};1" ${tm}/><g>${spin(0, 0, 24)}${snow(0, 0, 40, C.hi, 2.6)}</g></g>
<g transform="translate(36 -66) rotate(10)"><g><animateTransform attributeName="transform" type="scale" values="0;0;0;1.25;1;1" keyTimes="0;${hit};${f3(hit + 0.03)};${f3(hit + 0.07)};${f3(hit + 0.1)};1" ${tm}/><rect x="-50" y="-16" width="100" height="32" rx="6" fill="${C.hot}" stroke="${C.node}" stroke-width="3"/><text x="0" y="7" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">咔嚓！定格</text></g></g></g>
${snowfall(W, H, 20, 515, { min: 9, max: 14, op: 0.6 })}
</g>
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
    fog: `<rect x="-6" y="-14" width="12" height="30" fill="#fff"/><path d="M6 -10L34 -22V0Z" fill="#FFD28A" opacity=".8"/><circle cx="0" cy="-10" r="3" fill="#FFD28A"/>`,
    mc: `<path d="M0 -18l18 9-18 9-18-9z" fill="#6FD08A"/><path d="M-18 -9l18 9v20l-18-9z" fill="#8A5C37"/><path d="M18 -9l-18 9v20l18-9z" fill="#6B4527"/>`,
    paste: `<rect x="-16" y="-20" width="32" height="40" rx="4" fill="#fff"/><path d="M-9 -9H9M-9 0H9M-9 9H3" stroke="#1A2350" stroke-width="3" stroke-linecap="round"/>`,
  };
  // print tints stay fixed so the photos look the same in both themes
  const wall = [['api', '#8FD3FF', 'api'], ['proxy', '#B9A8FF', 'proxy'], ['atlas', '#FF8FC0', 'atlas'], ['fog', '#FFD28A', 'fog harbor'], ['mc', '#7CF0B5', 'mc-bot'], ['paste', '#FFB38A', 'paste']];
  const pol = wall.map(([k, tint, cap], i) => {
    const x = 150 + i * 180, y = f1(yAt(x));
    return `<circle cx="${x}" cy="${y}" r="4" fill="${C.hot}"/>` +
      polaroid(x, y + 2, [-5, 4, -3, 6, -4, 3][i], 96, 110, tinted(tint, g[k]), cap, `w${i}`, { tape: [C.pink, C.ice][i % 2], swing: 2.5, dur: 3.6 + i * 0.4 });
  }).join('');
  return `${svgOpen(W, H, '咔嚓——这一刻，存进相册。', '一面挂满拍立得的照片墙，每张对应一个项目。愿每一次按下快门，都留下值得回看的东西。')}
<defs>${baseDefs(W)}<clipPath id="r"><rect width="${W}" height="${H}"/></clipPath></defs>
<g clip-path="url(#r)">
${blobs([[600, 270, 480, 90, 'blobP', 15]])}
${stars(W, H, 50, 131)}
<path d="M40 34Q600 174 1160 34" fill="none" stroke="${C.ice}" stroke-opacity=".6" stroke-width="2"/>
${pol}
${snowfall(W, H, 26, 917)}
</g>
<text x="600" y="246" text-anchor="middle" font-size="40" font-weight="900" fill="url(#prism)">咔嚓——这一刻，存进相册。</text>
<text x="600" y="284" text-anchor="middle" font-size="18" fill="${C.text}" opacity=".85">愿每一次按下快门，都留下值得回看的东西。</text>
<text x="600" y="322" text-anchor="middle" class="m" font-size="13" fill="${C.ice}" letter-spacing="3">MARCH7TH · EST. 2022 · 03.07 · SNAP IT, SHIP IT, KEEP IT</text>
${sparkle(220, 250, 10, C.pink, 0.2)}${sparkle(990, 226, 9, C.ice, 1)}${sparkle(1080, 310, 11, C.lav, 1.6)}${sparkle(130, 320, 8, C.ice, 2.1)}
</svg>`;
}

// ---------- build ----------
for (const theme of ['light', 'dark']) {
  C = THEMES[theme];
  out = path.join(root, theme);
  fs.mkdirSync(path.join(out, 'projects'), { recursive: true });
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
}

console.log('assets written to', root);
