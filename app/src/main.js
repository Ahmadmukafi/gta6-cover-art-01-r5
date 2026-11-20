// VICE CITY DUO — wiring: controls, duo-split drag, shot presets.
import { LOOKS, SCENES, EXPORT_SIZES, defaultState, renderPoster, applySplit, applyGrade, applyTitles, exportPng, downloadBlob } from './cover.js';

const state = defaultState();
const posterRoot = document.getElementById('poster');
const params = new URLSearchParams(location.search);
const shot = params.get('shot') || '';

function $(id) { return document.getElementById(id); }

function syncControls() {
  const split = $('split');
  if (split) split.value = String(Math.round(state.split * 100));
  const grade = $('grade');
  if (grade) grade.value = String(state.grade);
  const title = $('title-input');
  if (title) title.value = state.title;
  const tag = $('tagline-input');
  if (tag) tag.value = state.tagline;
  document.querySelectorAll('[data-look]').forEach((b) => b.classList.toggle('active', b.dataset.look === state.look));
  document.querySelectorAll('[data-scene]').forEach((b) => b.classList.toggle('active', b.dataset.scene === state.scene));
  const read = $('split-readout');
  if (read) read.textContent = `${Math.round(state.split * 100)} / ${100 - Math.round(state.split * 100)}`;
  const gread = $('grade-readout');
  if (gread) gread.textContent = `${state.grade}%`;
}

function rerender() {
  renderPoster(posterRoot, state);
  syncControls();
}

function setLook(look) {
  if (!LOOKS[look]) return;
  state.look = look;
  posterRoot.dataset.look = look;
  document.body.dataset.look = look;
  syncControls();
}

function setScene(scene) {
  if (!SCENES[scene]) return;
  state.scene = scene;
  rerender();
}

function setSplit(v) {
  state.split = Math.max(0.05, Math.min(0.95, v));
  applySplit(posterRoot, state.split);
  syncControls();
}

function setGrade(v) {
  state.grade = Math.max(0, Math.min(100, Math.round(v)));
  applyGrade(posterRoot, state.grade);
  syncControls();
}

function setTitle(v) {
  state.title = v;
  applyTitles(posterRoot, state.title, state.tagline);
}

function setTagline(v) {
  state.tagline = v;
  applyTitles(posterRoot, state.title, state.tagline);
}

async function doExport(size) {
  const btn = $('export-status');
  if (btn) btn.textContent = `Exporting ${size.label}…`;
  const blob = await exportPng(posterRoot, state, size);
  if (blob) {
    downloadBlob(blob, `vice-city-duo-${size.w}x${size.h}.png`);
    if (btn) btn.textContent = `Saved vice-city-duo-${size.w}x${size.h}.png`;
  } else if (btn) {
    btn.textContent = 'Export failed — try again.';
  }
}

function buildControls() {
  const lookRow = $('look-row');
  Object.entries(LOOKS).forEach(([key, meta]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.look = key;
    b.textContent = meta.label;
    b.addEventListener('click', () => setLook(key));
    lookRow.appendChild(b);
  });
  const sceneRow = $('scene-row');
  Object.entries(SCENES).forEach(([key, meta]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.scene = key;
    b.textContent = meta.label;
    b.addEventListener('click', () => setScene(key));
    sceneRow.appendChild(b);
  });
  const expRow = $('export-row');
  EXPORT_SIZES.forEach((size) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'export-btn';
    b.textContent = `PNG ${size.label}`;
    b.addEventListener('click', () => doExport(size));
    expRow.appendChild(b);
  });
  $('split').addEventListener('input', (e) => setSplit(Number(e.target.value) / 100));
  $('grade').addEventListener('input', (e) => setGrade(Number(e.target.value)));
  $('grade-toggle').addEventListener('click', () => setGrade(state.grade > 0 ? 0 : 70));
  $('title-input').addEventListener('input', (e) => setTitle(e.target.value));
  $('tagline-input').addEventListener('input', (e) => setTagline(e.target.value));
}

function buildDrag() {
  const stage = $('stage');
  const handle = $('split-handle');
  let dragging = false;
  function fromEvent(e) {
    const r = stage.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    return Math.max(0.05, Math.min(0.95, x / r.width));
  }
  handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); e.preventDefault(); });
  handle.addEventListener('pointermove', (e) => { if (dragging) setSplit(fromEvent(e)); });
  handle.addEventListener('pointerup', () => { dragging = false; });
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#split-handle')) return;
    setSplit(fromEvent(e));
  });
}

function buildShortcuts() {
  const lookKeys = Object.keys(LOOKS);
  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    const k = e.key.toLowerCase();
    if (k >= '1' && k <= String(lookKeys.length)) {
      const look = lookKeys[Number(k) - 1];
      if (look) setLook(look);
    } else if (k === 'g') {
      setGrade(state.grade > 0 ? 0 : 70);
    } else if (k === 'e') {
      doExport(EXPORT_SIZES[0]);
    }
  });
}

function applyShotPreset() {
  if (shot === 'poster') {
    document.body.classList.add('shot-poster');
    state.look = 'sunset';
    state.grade = 70;
    state.split = 0.5;
  } else if (shot === 'editor') {
    document.body.classList.add('shot-editor');
    state.look = 'sunset';
    state.grade = 70;
    state.split = 0.62;
  } else if (shot === 'grade') {
    document.body.classList.add('shot-grade');
    state.look = 'neon';
    state.grade = 100;
    state.split = 0.5;
  } else if (shot === 'export') {
    document.body.classList.add('shot-export');
    state.look = 'neon';
    state.grade = 70;
    state.split = 0.42;
  }
  if (params.get('look') && LOOKS[params.get('look')]) state.look = params.get('look');
  if (params.get('scene') && SCENES[params.get('scene')]) state.scene = params.get('scene');
  document.body.dataset.look = state.look;
}

function buildGradeCompare() {
  if (shot !== 'grade') return;
  const beforeFrame = $('grade-before');
  const afterFrame = $('grade-after');
  if (!beforeFrame || !afterFrame) return;
  const before = defaultState();
  before.scene = state.scene;
  before.look = state.look;
  before.split = state.split;
  before.grade = 0;
  before.title = state.title;
  before.tagline = state.tagline;
  renderPoster(beforeFrame, before);
  const after = { ...before, grade: 100 };
  renderPoster(afterFrame, after);
  const cap = $('grade-before-cap');
  if (cap) cap.textContent = 'BEFORE — clean illustration';
  const cap2 = $('grade-after-cap');
  if (cap2) cap2.textContent = 'AFTER — full GTA-fy grade';
}

buildControls();
buildDrag();
buildShortcuts();
applyShotPreset();
rerender();
buildGradeCompare();
