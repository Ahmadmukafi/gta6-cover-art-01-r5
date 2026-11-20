// VICE CITY DUO — poster rendering: duo split, GTA-fy grade, looks,
// title editing, PNG export. All state lives in one object; every change
// re-renders only the SVG bits it owns.
import { boulevardDusk, pierNight } from './scenes.js';

export const LOOKS = {
  sunset: { label: 'Sunset Strip' },
  neon: { label: 'Neon Night' },
  noir: { label: 'Noir Vice' },
};

export const SCENES = {
  boulevard: { label: 'Boulevard Dusk', build: boulevardDusk },
  pier: { label: 'Pier Night', build: pierNight },
};

export const EXPORT_SIZES = [
  { label: '1080 × 1080', w: 1080, h: 1080 },
  { label: '1080 × 1350', w: 1080, h: 1350 },
  { label: '1920 × 1080', w: 1920, h: 1080 },
];

export function defaultState() {
  return {
    scene: 'boulevard',
    look: 'sunset',
    split: 0.5,
    grade: 70,
    title: 'GRAND THEFT AUTO VI',
    tagline: 'LEONIDA',
  };
}

function svgOpen() {
  return `<svg id="poster-svg" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GTA VI style key art poster">`;
}

export function renderPoster(root, state) {
  const build = SCENES[state.scene].build;
  root.innerHTML = svgOpen() + build() + '</svg>';
  root.dataset.look = state.look;
  root.dataset.scene = state.scene;
  root.classList.add('poster-frame');
  const dots = document.createElement('div');
  dots.className = 'halftone';
  dots.setAttribute('aria-hidden', 'true');
  root.appendChild(dots);
  applySplit(root, state.split);
  applyGrade(root, state.grade);
  applyTitles(root, state.title, state.tagline);
}

// The diagonal divider: top and bottom x move in opposite directions as
// the split moves, so the line sweeps across the poster. Both silhouette
// clips and both side tints follow the same polygon.
export function applySplit(root, split) {
  const top = 540 + (split - 0.5) * 560;
  const bottom = 540 - (split - 0.5) * 560;
  const lp = root.querySelector('#clip-lucia-poly');
  const jp = root.querySelector('#clip-jason-poly');
  if (lp) lp.setAttribute('points', `0,0 ${top},0 ${bottom},1080 0,1080`);
  if (jp) jp.setAttribute('points', `${top},0 1080,0 1080,1080 ${bottom},1080`);
  const line = root.querySelector('#split-line-el');
  if (line) { line.setAttribute('x1', top); line.setAttribute('x2', bottom); }
  const twin = root.querySelector('#split-line line:nth-child(2)');
  if (twin) { twin.setAttribute('x1', top); twin.setAttribute('x2', bottom); }
  const lucia = root.querySelector('#duo-lucia');
  const jason = root.querySelector('#duo-jason');
  if (lucia) lucia.setAttribute('transform', `translate(${(split - 0.5) * -70} 0)`);
  if (jason) jason.setAttribute('transform', `translate(${(split - 0.5) * 70} 0)`);
}

export function applyGrade(root, grade) {
  const g = Math.max(0, Math.min(100, grade)) / 100;
  root.style.setProperty('--grade', g.toFixed(2));
  root.style.setProperty('--grade-sat', (1 + g * 0.45).toFixed(2));
  root.style.setProperty('--grade-con', (1 + g * 0.18).toFixed(2));
  root.style.setProperty('--halftone', (g * 0.35).toFixed(2));
  root.style.setProperty('--rim', (0.25 + g * 0.75).toFixed(2));
}

export function applyTitles(root, title, tagline) {
  const main = root.querySelector('#title-main');
  const tag = root.querySelector('#title-tag');
  if (main) main.textContent = (title || 'GRAND THEFT AUTO VI').toUpperCase();
  if (tag) tag.textContent = (tagline || 'LEONIDA').toUpperCase();
}

// Serialize the poster SVG with its look/grade styles inlined, so the
// exported PNG looks exactly like the staged preview. The halftone dots
// and the grade filter are baked into the SVG itself.
export function posterSvgText(root, state) {
  const svg = root.querySelector('#poster-svg');
  if (!svg) return null;
  const clone = svg.cloneNode(true);
  clone.setAttribute('width', '1080');
  clone.setAttribute('height', '1080');
  const g = Math.max(0, Math.min(100, state.grade)) / 100;
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = posterInlineCss(state.look, state.grade);
  clone.insertBefore(style, clone.firstChild);
  const NS = 'http://www.w3.org/2000/svg';
  const defs = clone.querySelector('defs');
  if (defs && g > 0) {
    const pat = document.createElementNS(NS, 'pattern');
    pat.setAttribute('id', 'export-halftone');
    pat.setAttribute('width', '9');
    pat.setAttribute('height', '9');
    pat.setAttribute('patternUnits', 'userSpaceOnUse');
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', '4.5');
    dot.setAttribute('cy', '4.5');
    dot.setAttribute('r', '1.7');
    dot.setAttribute('fill', '#000000');
    pat.appendChild(dot);
    defs.appendChild(pat);
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', '1080');
    rect.setAttribute('height', '1080');
    rect.setAttribute('fill', 'url(#export-halftone)');
    rect.setAttribute('opacity', (g * 0.28).toFixed(2));
    clone.appendChild(rect);
  }
  if (state.look === 'noir') clone.style.filter = 'grayscale(1) contrast(1.15)';
  else clone.style.filter = `saturate(${(1 + g * 0.45).toFixed(2)}) contrast(${(1 + g * 0.18).toFixed(2)})`;
  return new XMLSerializer().serializeToString(clone);
}

export function posterInlineCss(look, grade) {
  const g = Math.max(0, Math.min(100, grade)) / 100;
  const palettes = {
    sunset: ['#2b1055', '#7b2d8b', '#ff5e7a', '#ffb347'],
    neon: ['#0b1035', '#3b0f66', '#c026d3', '#ff2e88'],
    noir: ['#111111', '#2b2b2b', '#4a4a4a', '#8a8a8a'],
  };
  const [t, m, l, h] = palettes[look] || palettes.sunset;
  return [
    `.sky-top{stop-color:${t}} .sky-mid{stop-color:${m}} .sky-low{stop-color:${l}} .sky-hor{stop-color:${h}}`,
    `.rim{opacity:${(0.25 + g * 0.75).toFixed(2)}}`,
    look === 'noir' ? '#poster-svg{filter:grayscale(1) contrast(1.15)}' : `#poster-svg{filter:saturate(${(1 + g * 0.45).toFixed(2)}) contrast(${(1 + g * 0.18).toFixed(2)})}`,
  ].join('\n');
}

export async function exportPng(root, state, size) {
  const text = posterSvgText(root, state);
  if (!text) return null;
  const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#12081f';
    ctx.fillRect(0, 0, size.w, size.h);
    const scale = Math.max(size.w / 1080, size.h / 1080);
    const dw = 1080 * scale;
    const dh = 1080 * scale;
    ctx.drawImage(img, (size.w - dw) / 2, (size.h - dh) / 2, dw, dh);
    const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    return out;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
