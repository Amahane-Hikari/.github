// Generates the SVG artwork used by profile/README.md.
//   node scripts/build-profile-assets.mjs
// No dependencies. Every SVG is self-contained (system font stacks, no external requests),
// carries its own dark background so it reads the same in GitHub light and dark themes,
// and disables motion under prefers-reduced-motion.
import fs from 'node:fs';
import path from 'node:path';

const out = path.join(import.meta.dirname, '..', 'profile', 'assets');
fs.mkdirSync(path.join(out, 'projects'), { recursive: true });

const SANS = "'Segoe UI','Helvetica Neue','PingFang SC','Microsoft YaHei','Noto Sans CJK SC',Arial,sans-serif";
const MONO = "ui-monospace,'SFMono-Regular','Cascadia Mono',Consolas,'Liberation Mono',monospace";
const C = {
  bg: '#0A0F1F', bg2: '#141B3A', panel: '#0E1428', line: '#2A3566',
  pink: '#FF8FC0', pink2: '#FFC2DD', ice: '#8FD3FF', ice2: '#C9ECFF', lav: '#B7A6FF',
  text: '#EAF2FF', mute: '#8E9BC2', lock: '#7CF0B5', amber: '#FFD28A',
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const write = (name, svg) => fs.writeFileSync(path.join(out, name), svg.replace(/\n\s*\n/g, '\n'));

const STYLE = `<style>
  text{font-family:${SANS}}
  .m{font-family:${MONO}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;
const svgOpen = (w, h, title, desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
${STYLE}`;

// ---------- shared pieces ----------
const defsCommon = `
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>
<linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.ice}"/></linearGradient>`;

function snow(cx, cy, r, stroke, sw = 2, extra = '') {
  let s = `<g transform="translate(${cx} ${cy})" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" fill="none" ${extra}>`;
  for (let i = 0; i < 6; i++) {
    s += `<g transform="rotate(${i * 60})"><path d="M0 0V${-r}M0 ${-r * 0.55}L${r * 0.22} ${-r * 0.78}M0 ${-r * 0.55}L${-r * 0.22} ${-r * 0.78}"/></g>`;
  }
  return s + '</g>';
}
const sparkle = (x, y, s, fill, delay = 0, dur = 3.2) =>
  `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${fill}" style="transform-origin:${x}px ${y}px;animation:tw ${dur}s ease-in-out ${delay}s infinite"/>`;
const twKeyframes = '@keyframes tw{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}';

function filmStrip(w, y, h = 26, id = 'holes', dur = 3) {
  return `<g>
<rect x="0" y="${y}" width="${w}" height="${h}" fill="#060914"/>
<g style="animation:roll ${dur}s linear infinite"><rect x="-40" y="${y + 7}" width="${w + 80}" height="${h - 14}" fill="url(#${id})"/></g>
</g>`;
}
const holesPattern = (id = 'holes', h = 26) =>
  `<pattern id="${id}" width="40" height="${h - 14}" patternUnits="userSpaceOnUse"><rect x="12" y="0" width="16" height="${h - 14}" rx="3" fill="#1D2650"/></pattern>`;
const rollKeyframes = '@keyframes roll{to{transform:translateX(40px)}}';

function brackets(x, y, w, h, len, stroke, sw = 3) {
  const x2 = x + w, y2 = y + h;
  return `<path d="M${x} ${y + len}V${y}H${x + len}M${x2 - len} ${y}H${x2}V${y + len}M${x2} ${y2 - len}V${y2}H${x2 - len}M${x + len} ${y2}H${x}V${y2 - len}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// ---------- hero ----------
function hero() {
  const W = 1200, H = 440;
  return `${svgOpen(W, H, 'March7th · 团队主页', 'March7thTeam：把好奇心写成工具，把想象力做成交互。Web 应用、开发者工具与 Minecraft 自动化。')}
<defs>${defsCommon}
${holesPattern()}
<radialGradient id="glowP" cx=".78" cy=".5" r=".55"><stop offset="0" stop-color="${C.pink}" stop-opacity=".22"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>
<radialGradient id="glowI" cx=".12" cy=".1" r=".6"><stop offset="0" stop-color="${C.ice}" stop-opacity=".16"/><stop offset="1" stop-color="${C.ice}" stop-opacity="0"/></radialGradient>
<linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#232E5E"/><stop offset="1" stop-color="#101732"/></linearGradient>
<radialGradient id="lens" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="${C.ice2}"/><stop offset=".35" stop-color="#4FA8E8"/><stop offset=".75" stop-color="#1A2A6B"/><stop offset="1" stop-color="#0A0F28"/></radialGradient>
<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#26305F"/></pattern>
<style>${rollKeyframes}${twKeyframes}
@keyframes flash{0%,91%,100%{opacity:0}93%{opacity:.9}97%{opacity:0}}
@keyframes lock{0%,18%{stroke:${C.pink};transform:scale(1.35)}30%,100%{stroke:${C.lock};transform:scale(1)}}
@keyframes lockT{0%,18%{opacity:0}30%,92%{opacity:1}100%{opacity:0}}
@keyframes rec{50%{opacity:.25}}
@keyframes glint{0%,100%{transform:translate(0,0);opacity:.9}50%{transform:translate(6px,4px);opacity:.5}}
@keyframes drift{50%{transform:translateY(-8px)}}
</style>
</defs>
<rect width="${W}" height="${H}" rx="22" fill="url(#bg)"/>
<rect width="${W}" height="${H}" rx="22" fill="url(#dots)" opacity=".7"/>
<rect width="${W}" height="${H}" rx="22" fill="url(#glowP)"/>
<rect width="${W}" height="${H}" rx="22" fill="url(#glowI)"/>
<g clip-path="url(#round)"><clipPath id="round"><rect width="${W}" height="${H}" rx="22"/></clipPath>
${filmStrip(W, 0)}${filmStrip(W, H - 26)}
</g>

<!-- viewfinder -->
${brackets(56, 62, 676, 322, 34, C.ice, 3)}
<g class="m" font-size="15" fill="${C.ice}" opacity=".9">
  <text x="72" y="100" class="m" letter-spacing="2">ORG PROFILE · EST. 2022</text>
</g>
<circle cx="600" cy="96" r="6" fill="${C.pink}" style="animation:rec 1.6s steps(1) infinite"/>
<text x="614" y="101" class="m" font-size="15" fill="${C.pink}" letter-spacing="2">REC</text>

<!-- title -->
<text x="68" y="214" font-size="108" font-weight="800" fill="url(#brand)" textLength="590" lengthAdjust="spacingAndGlyphs" style="font-family:${SANS}">MARCH7TH</text>
<rect x="72" y="234" width="120" height="5" rx="2.5" fill="${C.pink}"/>
<rect x="198" y="234" width="40" height="5" rx="2.5" fill="${C.ice}"/>
<text x="72" y="286" font-size="32" font-weight="600" fill="${C.text}">把好奇心写成工具，把想象力做成交互。</text>
<text x="72" y="326" class="m" font-size="17" fill="${C.ice2}" textLength="610" lengthAdjust="spacing">WEB APPS · DEVELOPER TOOLS · MINECRAFT AUTOMATION</text>
<text x="72" y="364" class="m" font-size="14" fill="${C.mute}" textLength="440" lengthAdjust="spacing">M · f/3.7 · 1/307s · ISO 307 · 2022—NOW</text>

<!-- focus lock -->
<g transform="translate(702 148)"><rect x="-22" y="-22" width="44" height="44" rx="4" fill="none" stroke-width="3" style="transform-box:fill-box;transform-origin:center;animation:lock 7s ease-out infinite"/></g>
<text x="702" y="190" class="m" font-size="13" fill="${C.lock}" text-anchor="middle" letter-spacing="1" style="animation:lockT 7s linear infinite">AF ●</text>

<!-- camera (original illustration) -->
<g style="animation:drift 6s ease-in-out infinite">
  <g transform="translate(940 232)">
    <rect x="-132" y="-84" width="264" height="168" rx="28" fill="url(#body)" stroke="#3B4A86" stroke-width="2"/>
    <path d="M-52 -84l14-30h76l14 30z" fill="#182049" stroke="#3B4A86" stroke-width="2" stroke-linejoin="round"/>
    <rect x="86" y="-100" width="30" height="16" rx="6" fill="${C.pink}"/>
    <rect x="-110" y="-66" width="46" height="26" rx="6" fill="#0A0F28" stroke="#3B4A86"/>
    <circle cx="-87" cy="-53" r="6" fill="${C.ice2}" opacity=".85"/>
    <rect x="-132" y="10" width="26" height="52" rx="8" fill="#0C1230" opacity=".7"/>
    <path d="M-132 -20h264" stroke="${C.pink}" stroke-width="3" opacity=".8"/>
    <circle cx="0" cy="6" r="68" fill="#0B1130" stroke="#3B4A86" stroke-width="3"/>
    <circle cx="0" cy="6" r="56" fill="#050816" stroke="${C.ice}" stroke-opacity=".5" stroke-width="2"/>
    <circle cx="0" cy="6" r="44" fill="url(#lens)"/>
    ${snow(0, 6, 26, C.ice2, 2)}
    <circle cx="0" cy="6" r="9" fill="#050816" stroke="${C.ice}" stroke-opacity=".6"/>
    <ellipse cx="-16" cy="-12" rx="11" ry="6" transform="rotate(-35 -16 -12)" fill="#fff" style="animation:glint 5s ease-in-out infinite" opacity=".8"/>
    <text x="96" y="68" class="m" font-size="14" fill="${C.mute}" text-anchor="end" letter-spacing="1">03·07</text>
  </g>
</g>

${sparkle(826, 120, 14, C.pink2, 0.2)}${sparkle(1090, 108, 10, C.ice2, 1.1)}${sparkle(1112, 300, 16, C.pink, 0.6)}${sparkle(790, 330, 9, C.ice, 1.8)}${sparkle(1040, 372, 11, C.lav, 2.4)}

<!-- shutter flash -->
<rect width="${W}" height="${H}" rx="22" fill="#fff" opacity="0" style="animation:flash 7s linear infinite"/>
</svg>`;
}

// ---------- section header ----------
function header(file, no, en, zh, sub) {
  const W = 1200, H = 96;
  write(file, `${svgOpen(W, H, `${en} · ${zh}`, sub)}
<defs>${defsCommon}<style>@keyframes pulse{50%{opacity:.35}}</style></defs>
<rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="15" fill="none" stroke="${C.line}"/>
<g transform="translate(28 18)"><rect width="60" height="60" rx="10" fill="#060914" stroke="${C.line}"/>
<text x="30" y="40" text-anchor="middle" class="m" font-size="26" font-weight="700" fill="url(#brand)">${no}</text></g>
<text x="112" y="46" class="m" font-size="14" letter-spacing="3" fill="${C.ice}">${esc(en)}</text>
<text x="112" y="76" font-size="28" font-weight="700" fill="${C.text}">${esc(zh)}</text>
<text x="${W - 32}" y="56" text-anchor="end" font-size="17" fill="${C.mute}">${esc(sub)}</text>
<circle cx="${W - 32}" cy="30" r="4" fill="${C.pink}" style="animation:pulse 2.4s ease-in-out infinite"/>
</svg>`);
}

// ---------- project cards ----------
const chipW = (s) => [...s].reduce((a, ch) => a + (ch.charCodeAt(0) > 255 ? 14 : 7.9), 0) + 20;

function card({ file, no, name, desc, chips, tint, art, title }) {
  const W = 600, H = 302;
  let x = 28;
  const chipSvg = chips.map((c) => {
    const w = chipW(c);
    const s = `<g transform="translate(${x} 262)"><rect width="${w}" height="26" rx="13" fill="${tint}" fill-opacity=".12" stroke="${tint}" stroke-opacity=".5"/><text x="${w / 2}" y="17.5" text-anchor="middle" font-size="13" fill="${tint}" class="m">${esc(c)}</text></g>`;
    x += w + 8;
    return s;
  }).join('');
  write(`projects/${file}.svg`, `${svgOpen(W, H, title, `${name}：${desc}`)}
<defs>${defsCommon}
<linearGradient id="ph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint}" stop-opacity=".30"/><stop offset=".6" stop-color="#101735"/><stop offset="1" stop-color="#0A0F1F"/></linearGradient>
<clipPath id="pc"><rect x="14" y="14" width="572" height="164" rx="12"/></clipPath>
<filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
<style>${twKeyframes}@keyframes pulse{50%{opacity:.3}}
@keyframes run{from{transform:translateX(0)}to{transform:translateX(var(--d,200px))}}
@keyframes dash{to{stroke-dashoffset:-60}}
@keyframes sway{50%{transform:translateY(-5px)}}</style>
</defs>
<rect width="${W}" height="${H}" rx="20" fill="${C.panel}"/>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="${tint}" stroke-opacity=".45" stroke-width="1.5"/>
<g clip-path="url(#pc)">
  <rect x="14" y="14" width="572" height="164" fill="url(#ph)"/>
  <g transform="translate(14 14)">${art(tint)}</g>
</g>
${brackets(26, 26, 548, 140, 18, '#fff', 2).replace('fill="none"', 'fill="none" opacity=".55"')}
<text x="40" y="52" class="m" font-size="14" fill="#fff" opacity=".85" letter-spacing="2">No.${no}</text>
<circle cx="520" cy="47" r="4" fill="${C.lock}" style="animation:pulse 2.4s ease-in-out infinite"/>
<text x="560" y="52" class="m" font-size="13" fill="#fff" opacity=".85" text-anchor="end">AF</text>
<text x="28" y="212" class="m" font-size="26" font-weight="700" fill="${C.text}">${esc(name)}</text>
<text x="572" y="212" font-size="22" fill="${tint}" text-anchor="end">↗</text>
<text x="28" y="242" font-size="17.5" fill="${C.mute}">${esc(desc)}</text>
${chipSvg}
</svg>`);
}

// card artwork (each drawn in a 572x164 box)
const art = {
  api: (t) => `
<g fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 40H170L230 82H350" stroke="${C.ice}"/>
  <path d="M20 128H150L230 82" stroke="${C.pink}"/>
  <path d="M350 82H430L480 40H556" stroke="${C.lav}"/>
  <path d="M350 82H430L480 126H556" stroke="${C.amber}"/>
  <path id="rt" d="M20 40H170L230 82H350H430L480 40H556" stroke="none"/>
</g>
${[[20, 40], [100, 40], [170, 40], [20, 128], [150, 128], [480, 40], [556, 40], [480, 126], [556, 126]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#0A0F1F" stroke="${C.text}" stroke-width="3"/>`).join('')}
<g><circle cx="290" cy="82" r="30" fill="#0A0F1F" stroke="${t}" stroke-width="4"/><circle cx="290" cy="82" r="38" fill="none" stroke="${t}" stroke-opacity=".35" stroke-dasharray="4 7" style="animation:dash 2s linear infinite"/>
<text x="290" y="89" class="m" font-size="20" font-weight="700" fill="${C.text}" text-anchor="middle">/v1</text></g>
<g><rect x="-11" y="-6" width="22" height="12" rx="6" fill="${C.text}"/><animateMotion dur="5s" repeatCount="indefinite" rotate="auto"><mpath href="#rt"/></animateMotion></g>
<text x="200" y="152" class="m" font-size="12" fill="${C.mute}">model · key · credit</text>`,

  proxy: (t) => `
<g stroke="${C.line}" stroke-width="2" stroke-dasharray="4 6"><path d="M70 66H250M70 100H250M70 134H250M326 82H520"/></g>
${[66, 100, 134].map((y) => `<circle cx="70" cy="${y}" r="10" fill="#0A0F1F" stroke="${C.ice}" stroke-width="3"/>`).join('')}
<g><rect x="262" y="14" width="52" height="136" rx="10" fill="#0A0F1F" stroke="${t}" stroke-width="3"/>
<path d="M276 82l9 10 17-22" fill="none" stroke="${C.lock}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="288" y="34" class="m" font-size="11" fill="${t}" text-anchor="middle">ALLOW</text></g>
<circle cx="520" cy="82" r="30" fill="#0A0F1F" stroke="${t}" stroke-width="3"/><text x="520" y="88" class="m" font-size="14" fill="${t}" text-anchor="middle">origin</text>
<g style="--d:170px"><rect x="84" y="60" width="24" height="12" rx="3" fill="${C.ice}" style="animation:run 2.6s linear infinite"/></g>
<g style="--d:180px"><rect x="330" y="76" width="24" height="12" rx="3" fill="${C.pink}" style="animation:run 2.6s linear infinite .8s"/></g>
<g><rect x="84" y="128" width="24" height="12" rx="3" fill="#FF6B8B"><animate attributeName="x" values="84;226;226" keyTimes="0;.7;1" dur="3.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.7;1" dur="3.2s" repeatCount="indefinite"/></rect>
<text x="130" y="156" class="m" font-size="12" fill="#FF6B8B">10.0.0.0/8 ✕</text></g>`,

  atlas: (t) => `
<g stroke="#26305F" stroke-width="1">${Array.from({ length: 16 }, (_, i) => `<path d="M${i * 38} 0V164"/>`).join('')}${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${i * 38}H572"/>`).join('')}</g>
<rect x="30" y="26" width="150" height="112" rx="8" fill="#141B3A" stroke="${C.line}" stroke-width="2"/>
<rect x="388" y="26" width="154" height="54" rx="8" fill="#141B3A" stroke="${C.line}" stroke-width="2"/>
<rect x="388" y="92" width="154" height="46" rx="8" fill="#141B3A" stroke="${C.line}" stroke-width="2"/>
<g><rect x="200" y="34" width="168" height="96" rx="8" fill="${t}" fill-opacity=".14" stroke="${t}" stroke-width="3"/>
<rect x="216" y="52" width="92" height="12" rx="4" fill="${C.text}" opacity=".8"/><rect x="216" y="74" width="132" height="8" rx="4" fill="${C.mute}"/><rect x="216" y="92" width="64" height="22" rx="11" fill="${t}"/>
${[[200, 34], [368, 34], [200, 130], [368, 130], [284, 34], [284, 130]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="2" fill="#fff" stroke="${t}" stroke-width="2"/>`).join('')}</g>
<path d="M284 0V164M0 82H572" stroke="${t}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="5 5" style="animation:dash 3s linear infinite"/>
<g transform="translate(330 98)"><path d="M0 0l22 8-9 3 6 12-5 3-6-12-8 7z" fill="${C.text}" stroke="#0A0F1F" stroke-width="2" stroke-linejoin="round"/></g>
<g transform="translate(404 8)"><rect width="120" height="18" rx="9" fill="${t}" fill-opacity=".2"/><text x="60" y="13" class="m" font-size="11" fill="${t}" text-anchor="middle">x 284 · y 34</text></g>`,

  fog: (t) => `
<circle cx="470" cy="38" r="20" fill="${C.amber}" opacity=".85"/><circle cx="470" cy="38" r="34" fill="${C.amber}" opacity=".12"/>
<path d="M120 120L190 40V90Z" fill="${C.amber}" opacity=".16"/>
<g><rect x="108" y="46" width="22" height="74" fill="#C9D4F0"/><rect x="104" y="36" width="30" height="12" fill="#FF6B8B"/><path d="M104 36l15-14 15 14z" fill="#1A2350"/><circle cx="119" cy="42" r="5" fill="${C.amber}"/></g>
<path d="M0 126H572V164H0Z" fill="#0A0F1F"/>
${Array.from({ length: 9 }, (_, i) => `<rect x="${180 + i * 42}" y="112" width="8" height="52" fill="#1B2556"/>`).join('')}
<rect x="170" y="108" width="380" height="8" fill="#26305F"/>
<g filter="url(#blur)" opacity=".9"><ellipse cx="120" cy="120" rx="150" ry="20" fill="#B8C7EE" opacity=".28"/><ellipse cx="420" cy="104" rx="190" ry="18" fill="#B8C7EE" opacity=".24"/><ellipse cx="300" cy="146" rx="260" ry="16" fill="#B8C7EE" opacity=".3"/></g>
<g stroke="#FF6B8B" stroke-width="2" fill="none"><path d="M360 40L440 70L520 50L400 92Z"/></g>
${[[360, 40], [440, 70], [520, 50], [400, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#FF6B8B"/>`).join('')}
<g class="m" font-size="11" fill="${C.text}" opacity=".8"><text x="346" y="30">#1 time</text><text x="448" y="84">#2 berth</text></g>`,

  mc: (t) => {
    const k = 0.68, S = 36 * k;
    const cube = (x, y, top, left, right) => `<g><path d="M${x} ${y}l${S} ${S / 2}l${-S} ${S / 2}l${-S} ${-S / 2}z" fill="${top}"/><path d="M${x - S} ${y + S / 2}l${S} ${S / 2}v${S}l${-S} ${-S / 2}z" fill="${left}"/><path d="M${x + S} ${y + S / 2}l${-S} ${S / 2}v${S}l${S} ${-S / 2}z" fill="${right}"/></g>`;
    const grass = ['#6FD08A', '#3E9B5C', '#2D7646'], dirt = ['#B07A4E', '#8A5C37', '#6B4527'], stone = ['#9AA6BF', '#6F7B96', '#566079'];
    const cx = 286, base = 92, r = 24 * k, h = 36 * k;
    let s = '';
    s += cube(cx - 2 * S, base + r, ...stone) + cube(cx, base + r, ...dirt) + cube(cx + 2 * S, base + r, ...stone);
    s += cube(cx - S, base, ...dirt) + cube(cx + S, base, ...grass);
    s += cube(cx, base - r, ...grass);
    const hy = base - 112 * k, hw = 30 * k, hh = 15 * k;
    s += `<g style="animation:sway 3s ease-in-out infinite"><path d="M${cx} ${hy}l${hw} ${hh}v${hw}l${-hw} ${hh}l${-hw} ${-hh}v${-hw}z" fill="${C.ice}"/><rect x="${cx - 14}" y="${hy + 16}" width="8" height="8" fill="#0A0F1F"/><rect x="${cx + 6}" y="${hy + 16}" width="8" height="8" fill="#0A0F1F"/></g>`;
    s += `<g transform="translate(364 24)"><rect width="150" height="34" rx="8" fill="#0A0F1F" stroke="${t}"/><text x="12" y="22" class="m" font-size="14" fill="${t}">&gt; bot come</text></g>`;
    s += `<g class="m" font-size="12" fill="${C.mute}"><text x="24" y="150">1.8.8 → 26.1</text><text x="530" y="150" text-anchor="end">Paper · Fabric · Forge</text></g>`;
    return s;
  },

  paste: (t) => `
<g transform="rotate(-8 150 90)"><rect x="70" y="26" width="170" height="116" rx="10" fill="#141B3A" stroke="${C.line}" stroke-width="2"/></g>
<g><rect x="120" y="22" width="190" height="124" rx="10" fill="#1A2350" stroke="${t}" stroke-width="3"/>
<text x="136" y="48" class="m" font-size="15" font-weight="700" fill="${t}"># hello.md</text>
<rect x="136" y="62" width="150" height="8" rx="4" fill="${C.text}" opacity=".75"/><rect x="136" y="80" width="110" height="8" rx="4" fill="${C.mute}"/><rect x="136" y="98" width="130" height="8" rx="4" fill="${C.mute}"/>
<rect x="136" y="118" width="60" height="16" rx="8" fill="${t}" fill-opacity=".25"/><text x="166" y="130" class="m" font-size="11" fill="${t}" text-anchor="middle">LOCKED</text></g>
<g transform="translate(430 82)"><circle r="42" fill="none" stroke="${C.line}" stroke-width="8"/>
<circle r="42" fill="none" stroke="${t}" stroke-width="8" stroke-linecap="round" stroke-dasharray="264" stroke-dashoffset="0" transform="rotate(-90)"><animate attributeName="stroke-dashoffset" values="0;264" dur="6s" repeatCount="indefinite"/></circle>
<text y="6" class="m" font-size="16" font-weight="700" fill="${C.text}" text-anchor="middle">burn</text></g>
<text x="430" y="150" class="m" font-size="12" fill="${C.mute}" text-anchor="middle">view once · expire</text>`,
};

// ---------- workflow strip ----------
function workflow() {
  const W = 1200, H = 330;
  const steps = [
    ['01', '取景', 'FRAME', ['先想清楚为谁而做', '再定下它的样子'], C.ice,
      `<path d="M-22 -8V-22H-8M8 -22H22V-8M22 8V22H8M-8 22H-22V8" fill="none" stroke="${C.ice}" stroke-width="4" stroke-linecap="round"/><circle r="4" fill="${C.ice}"/>`],
    ['02', '对焦', 'FOCUS', ['原型落在真实页面', '看得见才算数'], C.pink,
      `<circle r="22" fill="none" stroke="${C.pink}" stroke-width="4"/><circle r="9" fill="none" stroke="${C.pink}" stroke-width="3"/><path d="M0 -30V-14M0 14V30M-30 0H-14M14 0H30" stroke="${C.pink}" stroke-width="3" stroke-linecap="round"/>`],
    ['03', '快门', 'SHOOT', ['实现与回归测试', '每一步都能回退'], C.lav,
      `<circle r="24" fill="none" stroke="${C.lav}" stroke-width="4"/>${Array.from({ length: 6 }, (_, i) => `<path transform="rotate(${i * 60})" d="M0 -24L14 -2" stroke="${C.lav}" stroke-width="3" stroke-linecap="round"/>`).join('')}`],
    ['04', '冲洗', 'DEVELOP', ['独立审查，留存证据', '确认之后再上线'], C.lock,
      `<path d="M0 -26C10 -10 18 -2 18 8a18 18 0 0 1-36 0C-18 -2-10 -10 0 -26Z" fill="none" stroke="${C.lock}" stroke-width="4" stroke-linejoin="round"/><path d="M-7 8l5 6 10-12" fill="none" stroke="${C.lock}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`],
  ];
  const fw = 262, gap = 22, x0 = 36;
  const frames = steps.map(([no, zh, en, lines, col, icon], i) => {
    const x = x0 + i * (fw + gap);
    return `<g transform="translate(${x} 50)">
<rect width="${fw}" height="232" rx="14" fill="${C.panel}" stroke="${col}" stroke-opacity=".5" stroke-width="1.5"/>
<text x="18" y="30" class="m" font-size="14" fill="${col}" letter-spacing="2">${no} ▸ ${en}</text>
<g transform="translate(${fw - 50} 44)">${icon}</g>
<text x="18" y="102" font-size="40" font-weight="800" fill="${C.text}">${zh}</text>
<rect x="18" y="116" width="44" height="4" rx="2" fill="${col}"/>
<text x="18" y="156" font-size="19" fill="${C.text}">${esc(lines[0])}</text>
<text x="18" y="184" font-size="19" fill="${C.mute}">${esc(lines[1])}</text>
<text x="18" y="216" class="m" font-size="12" fill="${col}" opacity=".7">${String(i * 3 + 7).padStart(2, '0')}A</text>
</g>${i < 3 ? `<path d="M${x + fw + 3} 166h${gap - 6}" stroke="${C.line}" stroke-width="3" stroke-dasharray="3 4" stroke-linecap="round"/>` : ''}`;
  }).join('');
  return `${svgOpen(W, H, '我们的工作流：取景、对焦、快门、冲洗', '想清楚做给谁，在真实页面里验收原型，带回归测试地实现，独立审查并留存证据后再上线。')}
<defs>${defsCommon}${holesPattern('holes2', 26)}<style>${rollKeyframes}</style></defs>
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<g><clipPath id="r2"><rect width="${W}" height="${H}" rx="20"/></clipPath><g clip-path="url(#r2)">${filmStrip(W, 0, 26, 'holes2', 4)}${filmStrip(W, H - 26, 26, 'holes2', 4)}</g></g>
${frames}
</svg>`;
}

// ---------- footer ----------
function footer() {
  const W = 1200, H = 230;
  return `${svgOpen(W, H, '咔嚓。', '愿每一次按下快门，都留下值得回看的东西。')}
<defs>${defsCommon}<style>${twKeyframes}@keyframes iris{0%,100%{transform:scale(1)}50%{transform:scale(.82)}}</style></defs>
<rect width="${W}" height="${H}" rx="22" fill="url(#bg)"/>
<g transform="translate(600 62)"><g style="animation:iris 7s ease-in-out infinite;transform-box:fill-box;transform-origin:center">
  <circle r="26" fill="none" stroke="url(#brand)" stroke-width="4"/>${Array.from({ length: 6 }, (_, i) => `<path transform="rotate(${i * 60})" d="M0 -26L15 -3" stroke="${C.ice2}" stroke-width="3" stroke-linecap="round"/>`).join('')}
</g></g>
<text x="600" y="134" text-anchor="middle" font-size="36" font-weight="700" fill="${C.text}">愿每一次按下快门，都留下值得回看的东西。</text>
<text x="600" y="168" text-anchor="middle" font-size="18" fill="${C.mute}">Take it slow. Ship it well. Keep the frames that matter.</text>
<text x="600" y="204" text-anchor="middle" class="m" font-size="13" fill="${C.ice}" letter-spacing="3">MARCH7TH · EST. 2022 · 03.07</text>
${sparkle(300, 90, 12, C.pink2, 0.2)}${sparkle(900, 80, 10, C.ice2, 1)}${sparkle(1000, 150, 14, C.pink, 1.6)}${sparkle(200, 160, 9, C.ice, 2.1)}
</svg>`;
}

// ---------- build ----------
write('hero.svg', hero());
header('h-contact.svg', '01', 'CONTACT SHEET', '接触印样 · 项目', '每个项目都是一张值得打印的快照');
header('h-workflow.svg', '02', 'DARKROOM NOTES', '暗房手记 · 我们怎么做事', '从取景到冲洗，一步也不省');
header('h-join.svg', '03', 'JOIN THE FRAME', '一起入镜 · 参与', '反馈、讨论、贡献、安全报告');
write('workflow.svg', workflow());
write('footer.svg', footer());

card({ file: 'march7th-api', no: '01', name: 'march7th-api', title: 'march7th-api', tint: C.ice, art: art.api,
  desc: '自托管 API 目录与模型网关，密钥、限速、积分一站管理', chips: ['Python', 'OpenAI 兼容', 'Docker'] });
card({ file: 'file-download-proxy', no: '02', name: 'file-download-proxy', title: 'file-download-proxy', tint: C.lav, art: art.proxy,
  desc: '只放行白名单域名的流式下载代理，防 SSRF', chips: ['FastAPI', 'Range', 'SSRF-safe'] });
card({ file: 'design-atlas', no: '03', name: 'design-atlas', title: 'design-atlas', tint: C.pink, art: art.atlas,
  desc: '浏览器里的前端设计工作台：拼装、调样式、导出源码', chips: ['JavaScript', '无需账号', '源码导出'] });
card({ file: 'fog-harbor-archive', no: '04', name: 'fog-harbor-archive', title: 'fog-harbor-archive', tint: C.amber, art: art.fog,
  desc: '悬疑解谜：在雾港调查室里重建证据链', chips: ['Next.js 16', 'React 19', 'TypeScript'] });
card({ file: 'mc-bot', no: '05', name: 'mc-bot', title: 'mc-bot', tint: C.lock, art: art.mc,
  desc: 'Minecraft 合作生存机器人，可换 AI 后端，可接 MCP', chips: ['Mineflayer', 'Node 22', 'MCP'] });
card({ file: 'march7th-paste', no: '06', name: 'March7th Paste 4.0', title: 'March7th Paste', tint: '#FFB38A', art: art.paste,
  desc: '在线剪贴板与文件分享，Markdown、密码、阅后即焚', chips: ['Next.js', 'PostgreSQL', 'Markdown'] });

console.log('assets written to', out);
