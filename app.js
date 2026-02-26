const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");

const modeSelect = document.getElementById("modeSelect");
const paletteSelect = document.getElementById("paletteSelect");
const seedInput = document.getElementById("seedInput");
const generateBtn = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn");
const undoBtn = document.getElementById("undoBtn");
const pauseBtn = document.getElementById("pauseBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const historyStatus = document.getElementById("historyStatus");

const densityRange = document.getElementById("densityRange");
const speedRange = document.getElementById("speedRange");
const lineWidthRange = document.getElementById("lineWidthRange");
const densityValue = document.getElementById("densityValue");
const speedValue = document.getElementById("speedValue");
const lineWidthValue = document.getElementById("lineWidthValue");

const randMode = document.getElementById("randMode");
const randPalette = document.getElementById("randPalette");
const randSeed = document.getElementById("randSeed");
const randDensity = document.getElementById("randDensity");
const randSpeed = document.getElementById("randSpeed");
const randLineWidth = document.getElementById("randLineWidth");

const HISTORY_LIMIT = 30;

const PARAM_LIMITS = {
  density: { min: 0.4, max: 2.4, step: 0.1 },
  speed: { min: 0.3, max: 2.5, step: 0.1 },
  lineWidth: { min: 0.4, max: 2.5, step: 0.1 }
};

const URL_KEYS = {
  mode: "m",
  palette: "p",
  seed: "s",
  density: "d",
  speed: "v",
  lineWidth: "w"
};

const palettes = {
  citrus: ["#f8f3e9", "#f06449", "#f5d547", "#4ea7a0", "#102132"],
  dusk: ["#f7efe4", "#ff7f50", "#6f9ceb", "#2f4858", "#b23a48"],
  lagoon: ["#f2f7f3", "#2a9d8f", "#e9c46a", "#264653", "#e76f51"],
  blossom: ["#fff6ec", "#ef476f", "#ffd166", "#118ab2", "#073b4c"],
  ember: ["#fdf6ec", "#d8572a", "#ffc857", "#084c61", "#4f000b"],
  mint: ["#f1fff7", "#00a878", "#57cc99", "#22577a", "#1b4332"]
};

const state = {
  mode: "flow",
  paletteName: "citrus",
  running: true,
  seed: Math.floor(Math.random() * 900000) + 100000,
  params: {
    density: 1,
    speed: 1,
    lineWidth: 1
  },
  frame: 0,
  data: null,
  rand: null,
  history: []
};

const modeDefs = [
  { id: "flow", label: "Flow Field", build: buildFlow, draw: drawFlow },
  { id: "orbits", label: "Orbit Bloom", build: buildOrbits, draw: drawOrbits },
  { id: "weave", label: "Ribbon Weave", build: buildWeave, draw: drawWeave },
  { id: "vortex", label: "Vortex Drift", build: buildVortex, draw: drawVortex },
  { id: "dunes", label: "Noisy Dunes", build: buildDunes, draw: drawDunes },
  { id: "mosaic", label: "Noise Mosaic", build: buildMosaic, draw: drawMosaic },
  { id: "tendrils", label: "Ink Tendrils", build: buildTendrils, draw: drawTendrils },
  { id: "rings", label: "Pulse Rings", build: buildRings, draw: drawRings },
  { id: "constellation", label: "Constellation", build: buildConstellation, draw: drawConstellation },
  { id: "shards", label: "Glass Shards", build: buildShards, draw: drawShards },
  { id: "aurora", label: "Aurora Drift", build: buildAurora, draw: drawAurora },
  { id: "smoke", label: "Smoke Trails", build: buildSmoke, draw: drawSmoke },
  { id: "current", label: "Current Lines", build: buildCurrent, draw: drawCurrent },
  { id: "pollen", label: "Pollen Storm", build: buildPollen, draw: drawPollen },
  { id: "plasma", label: "Plasma Veins", build: buildPlasma, draw: drawPlasma },
  { id: "tides", label: "Tidal Bands", build: buildTides, draw: drawTides },
  { id: "braid", label: "Braid Waves", build: buildBraid, draw: drawBraid },
  { id: "interference", label: "Interference Net", build: buildInterference, draw: drawInterference },
  { id: "contour", label: "Contour Lines", build: buildContour, draw: drawContour },
  { id: "silk", label: "Silk Strata", build: buildSilk, draw: drawSilk },
  { id: "helix", label: "Helix Orbit", build: buildHelix, draw: drawHelix },
  { id: "petals", label: "Petal Bloom", build: buildPetals, draw: drawPetals },
  { id: "sunburst", label: "Sunburst Arc", build: buildSunburst, draw: drawSunburst },
  { id: "radar", label: "Radar Sweep", build: buildRadar, draw: drawRadar },
  { id: "nova", label: "Nova Sparks", build: buildNova, draw: drawNova },
  { id: "quilt", label: "Quilt Tiles", build: buildQuilt, draw: drawQuilt },
  { id: "glyph", label: "Glyph Grid", build: buildGlyph, draw: drawGlyph },
  { id: "checker", label: "Checker Pulse", build: buildChecker, draw: drawChecker },
  { id: "circuit", label: "Circuit Matrix", build: buildCircuit, draw: drawCircuit },
  { id: "bubbles", label: "Bubble Cells", build: buildBubbles, draw: drawBubbles }
];

const STREAM_VARIANTS = {
  aurora: {
    densityDiv: 980,
    minCount: 150,
    speedMin: 0.35,
    speedMax: 1.4,
    sizeMin: 0.4,
    sizeMax: 1.5,
    noise: 0.0032,
    angle: 10,
    turn: 0.2,
    timeX: 0.65,
    timeY: -0.3,
    fade: 0.06,
    alpha: 0.28,
    lineMult: 1.2,
    margin: 18
  },
  smoke: {
    densityDiv: 840,
    minCount: 180,
    speedMin: 0.22,
    speedMax: 0.95,
    sizeMin: 0.7,
    sizeMax: 2.2,
    noise: 0.0047,
    angle: 7,
    turn: -0.8,
    timeX: 0.42,
    timeY: 0.08,
    fade: 0.035,
    alpha: 0.22,
    lineMult: 1.6,
    margin: 30
  },
  current: {
    densityDiv: 1120,
    minCount: 120,
    speedMin: 0.7,
    speedMax: 2.5,
    sizeMin: 0.35,
    sizeMax: 1.2,
    noise: 0.0024,
    angle: 12,
    turn: 0,
    timeX: 0.9,
    timeY: -0.2,
    fade: 0.1,
    alpha: 0.34,
    lineMult: 0.95,
    margin: 20
  },
  pollen: {
    densityDiv: 760,
    minCount: 220,
    speedMin: 0.55,
    speedMax: 1.7,
    sizeMin: 0.45,
    sizeMax: 1.65,
    noise: 0.0052,
    angle: 9,
    turn: 1.6,
    timeX: 0.58,
    timeY: 0.45,
    fade: 0.075,
    alpha: 0.31,
    lineMult: 1.1,
    margin: 25
  },
  plasma: {
    densityDiv: 900,
    minCount: 180,
    speedMin: 0.45,
    speedMax: 1.55,
    sizeMin: 0.35,
    sizeMax: 1.8,
    noise: 0.0061,
    angle: 15,
    turn: -2.2,
    timeX: 0.75,
    timeY: -0.52,
    fade: 0.055,
    alpha: 0.3,
    lineMult: 1.05,
    margin: 22
  }
};

const WAVE_VARIANTS = {
  tides: {
    countBase: 18,
    countMin: 10,
    ampMin: 20,
    ampMax: 92,
    freqMin: 0.0015,
    freqMax: 0.009,
    speedMin: 0.003,
    speedMax: 0.012,
    widthMin: 0.9,
    widthMax: 2.6,
    fade: 0.1,
    alpha: 0.34,
    step: 8,
    secondFreq: 1.8,
    secondPhase: 0.55,
    mix: 0.36,
    drift: 0.35
  },
  braid: {
    countBase: 16,
    countMin: 9,
    ampMin: 28,
    ampMax: 120,
    freqMin: 0.002,
    freqMax: 0.012,
    speedMin: 0.004,
    speedMax: 0.016,
    widthMin: 0.8,
    widthMax: 2.3,
    fade: 0.075,
    alpha: 0.3,
    step: 7,
    secondFreq: 2.2,
    secondPhase: 0.84,
    mix: 0.42,
    drift: 0.62
  },
  interference: {
    countBase: 24,
    countMin: 12,
    ampMin: 14,
    ampMax: 70,
    freqMin: 0.003,
    freqMax: 0.016,
    speedMin: 0.005,
    speedMax: 0.021,
    widthMin: 0.55,
    widthMax: 1.9,
    fade: 0.12,
    alpha: 0.27,
    step: 6,
    secondFreq: 2.9,
    secondPhase: 1.13,
    mix: 0.48,
    drift: 1.1
  },
  contour: {
    countBase: 20,
    countMin: 10,
    ampMin: 10,
    ampMax: 56,
    freqMin: 0.0012,
    freqMax: 0.0068,
    speedMin: 0.002,
    speedMax: 0.009,
    widthMin: 0.7,
    widthMax: 2,
    fade: 0.085,
    alpha: 0.33,
    step: 10,
    secondFreq: 1.4,
    secondPhase: 0.36,
    mix: 0.25,
    drift: 0.2
  },
  silk: {
    countBase: 22,
    countMin: 11,
    ampMin: 18,
    ampMax: 85,
    freqMin: 0.002,
    freqMax: 0.01,
    speedMin: 0.0028,
    speedMax: 0.012,
    widthMin: 0.55,
    widthMax: 1.6,
    fade: 0.06,
    alpha: 0.24,
    step: 7,
    secondFreq: 2.4,
    secondPhase: 0.72,
    mix: 0.3,
    drift: 0.4
  }
};

const RADIAL_VARIANTS = {
  helix: {
    densityDiv: 3600,
    minCount: 32,
    radiusMin: 14,
    radiusMaxScale: 0.53,
    speedMin: -0.03,
    speedMax: 0.03,
    wobbleMin: 6,
    wobbleMax: 42,
    sizeMin: 0.8,
    sizeMax: 2.2,
    fade: 0.06,
    alpha: 0.36,
    style: "line",
    arcMin: 0.2,
    arcMax: 1.1,
    centerAmpX: 0.11,
    centerAmpY: 0.08,
    centerFreqX: 0.005,
    centerFreqY: 0.004
  },
  petals: {
    densityDiv: 5200,
    minCount: 28,
    radiusMin: 10,
    radiusMaxScale: 0.42,
    speedMin: -0.026,
    speedMax: 0.026,
    wobbleMin: 12,
    wobbleMax: 54,
    sizeMin: 1.1,
    sizeMax: 3.4,
    fade: 0.05,
    alpha: 0.42,
    style: "dot",
    arcMin: 0.5,
    arcMax: 1.7,
    centerAmpX: 0.04,
    centerAmpY: 0.04,
    centerFreqX: 0.003,
    centerFreqY: 0.003
  },
  sunburst: {
    densityDiv: 3000,
    minCount: 36,
    radiusMin: 8,
    radiusMaxScale: 0.6,
    speedMin: 0.01,
    speedMax: 0.05,
    wobbleMin: 3,
    wobbleMax: 24,
    sizeMin: 0.8,
    sizeMax: 2.8,
    fade: 0.085,
    alpha: 0.38,
    style: "arc",
    arcMin: 0.3,
    arcMax: 1.4,
    centerAmpX: 0.08,
    centerAmpY: 0.12,
    centerFreqX: 0.004,
    centerFreqY: 0.006
  },
  radar: {
    densityDiv: 4400,
    minCount: 22,
    radiusMin: 24,
    radiusMaxScale: 0.52,
    speedMin: 0.008,
    speedMax: 0.025,
    wobbleMin: 2,
    wobbleMax: 16,
    sizeMin: 0.7,
    sizeMax: 1.6,
    fade: 0.1,
    alpha: 0.33,
    style: "arc",
    arcMin: 0.12,
    arcMax: 0.65,
    centerAmpX: 0.03,
    centerAmpY: 0.03,
    centerFreqX: 0.002,
    centerFreqY: 0.002
  },
  nova: {
    densityDiv: 2800,
    minCount: 42,
    radiusMin: 6,
    radiusMaxScale: 0.58,
    speedMin: -0.05,
    speedMax: 0.05,
    wobbleMin: 4,
    wobbleMax: 28,
    sizeMin: 0.55,
    sizeMax: 2.1,
    fade: 0.07,
    alpha: 0.35,
    style: "line",
    arcMin: 0.2,
    arcMax: 0.8,
    centerAmpX: 0.14,
    centerAmpY: 0.14,
    centerFreqX: 0.007,
    centerFreqY: 0.006
  }
};

const GRID_VARIANTS = {
  quilt: {
    baseStep: 34,
    minStep: 14,
    maxStep: 56,
    scale: 0.01,
    sizeMin: 0.35,
    sizeMul: 0.82,
    fade: 0.12,
    alpha: 0.36,
    shape: "diamond",
    spin: 1.8,
    tx: 0.62,
    ty: 0.3
  },
  glyph: {
    baseStep: 30,
    minStep: 12,
    maxStep: 50,
    scale: 0.013,
    sizeMin: 0.28,
    sizeMul: 0.78,
    fade: 0.13,
    alpha: 0.34,
    shape: "cross",
    spin: 2.6,
    tx: 0.7,
    ty: 0.5
  },
  checker: {
    baseStep: 28,
    minStep: 11,
    maxStep: 44,
    scale: 0.009,
    sizeMin: 0.3,
    sizeMul: 0.9,
    fade: 0.15,
    alpha: 0.3,
    shape: "rect",
    spin: 0.8,
    tx: 0.35,
    ty: 0.2
  },
  circuit: {
    baseStep: 32,
    minStep: 14,
    maxStep: 54,
    scale: 0.014,
    sizeMin: 0.24,
    sizeMul: 0.72,
    fade: 0.1,
    alpha: 0.33,
    shape: "bar",
    spin: 3.2,
    tx: 0.9,
    ty: 0.74
  },
  bubbles: {
    baseStep: 36,
    minStep: 16,
    maxStep: 60,
    scale: 0.008,
    sizeMin: 0.28,
    sizeMul: 0.86,
    fade: 0.11,
    alpha: 0.38,
    shape: "circle",
    spin: 1.2,
    tx: 0.4,
    ty: 0.64
  }
};

const modeMap = new Map(modeDefs.map((mode) => [mode.id, mode]));

let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
let width = 1;
let height = 1;
let animationId = 0;

for (const mode of modeDefs) {
  const option = document.createElement("option");
  option.value = mode.id;
  option.textContent = mode.label;
  modeSelect.appendChild(option);
}

for (const name of Object.keys(palettes)) {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name[0].toUpperCase() + name.slice(1);
  paletteSelect.appendChild(option);
}

applyStateFromUrl();
sanitizeState();
syncControlsFromState();
updateHistoryUI();

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function fract(value) {
  return value - Math.floor(value);
}

function smooth(value) {
  return value * value * (3 - 2 * value);
}

function hash2(x, y) {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function noise2(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  const ux = smooth(fx);
  const uy = smooth(fy);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x, y) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;

  for (let i = 0; i < 4; i += 1) {
    value += amplitude * noise2(x * frequency, y * frequency);
    frequency *= 2;
    amplitude *= 0.5;
  }

  return value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function quantize(value, step) {
  return Math.round(value / step) * step;
}

function parseNum(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseIntSafe(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function trimFloat(value) {
  return Number(value.toFixed(2)).toString();
}

function formatMult(value) {
  return `${value.toFixed(1)}x`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return [r, g, b];
}

function withAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function paletteAt(index) {
  const p = palettes[state.paletteName];
  return p[clamp(index, 0, p.length - 1)];
}

function randIn(min, max, rand = state.rand) {
  return min + (max - min) * rand();
}

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function countWithDensity(base, min = 1) {
  return Math.max(min, Math.floor(base * state.params.density));
}

function speedScale(value) {
  return value * state.params.speed;
}

function lineScale(value) {
  return value * state.params.lineWidth;
}

function applyPaletteToUI() {
  const p = palettes[state.paletteName];
  document.documentElement.style.setProperty("--bg-cream", p[0]);
  document.documentElement.style.setProperty("--accent", p[1]);
  document.documentElement.style.setProperty("--accent-soft", p[3]);
}

function clearWithAlpha(alpha) {
  ctx.fillStyle = withAlpha(paletteAt(0), alpha);
  ctx.fillRect(0, 0, width, height);
}

function sanitizeState() {
  if (!modeMap.has(state.mode)) state.mode = modeDefs[0].id;
  if (!palettes[state.paletteName]) state.paletteName = Object.keys(palettes)[0];

  state.seed = clamp(Math.floor(parseIntSafe(state.seed, 1)), 1, 9999999);

  for (const key of Object.keys(PARAM_LIMITS)) {
    const rule = PARAM_LIMITS[key];
    const raw = parseNum(state.params[key], 1);
    state.params[key] = clamp(quantize(raw, rule.step), rule.min, rule.max);
  }
}

function snapshotState() {
  return {
    mode: state.mode,
    paletteName: state.paletteName,
    seed: state.seed,
    params: {
      density: state.params.density,
      speed: state.params.speed,
      lineWidth: state.params.lineWidth
    }
  };
}

function snapshotsEqual(a, b) {
  return (
    a.mode === b.mode &&
    a.paletteName === b.paletteName &&
    a.seed === b.seed &&
    a.params.density === b.params.density &&
    a.params.speed === b.params.speed &&
    a.params.lineWidth === b.params.lineWidth
  );
}

function pushHistory(snapshot) {
  const next = {
    mode: snapshot.mode,
    paletteName: snapshot.paletteName,
    seed: snapshot.seed,
    params: {
      density: snapshot.params.density,
      speed: snapshot.params.speed,
      lineWidth: snapshot.params.lineWidth
    }
  };

  const last = state.history[state.history.length - 1];
  if (last && snapshotsEqual(last, next)) {
    return;
  }

  state.history.push(next);
  if (state.history.length > HISTORY_LIMIT) {
    state.history.shift();
  }
}

function updateHistoryUI() {
  historyStatus.textContent = `History ${state.history.length}/${HISTORY_LIMIT}`;
  undoBtn.disabled = state.history.length === 0;
}

function setStateFromSnapshot(snapshot) {
  state.mode = snapshot.mode;
  state.paletteName = snapshot.paletteName;
  state.seed = snapshot.seed;
  state.params.density = snapshot.params.density;
  state.params.speed = snapshot.params.speed;
  state.params.lineWidth = snapshot.params.lineWidth;
  sanitizeState();
}

function syncControlsFromState() {
  modeSelect.value = state.mode;
  paletteSelect.value = state.paletteName;
  seedInput.value = String(state.seed);
  densityRange.value = String(state.params.density);
  speedRange.value = String(state.params.speed);
  lineWidthRange.value = String(state.params.lineWidth);

  densityValue.textContent = formatMult(state.params.density);
  speedValue.textContent = formatMult(state.params.speed);
  lineWidthValue.textContent = formatMult(state.params.lineWidth);
}

function syncUrlFromState() {
  const url = new URL(window.location.href);
  url.searchParams.set(URL_KEYS.mode, state.mode);
  url.searchParams.set(URL_KEYS.palette, state.paletteName);
  url.searchParams.set(URL_KEYS.seed, String(state.seed));
  url.searchParams.set(URL_KEYS.density, trimFloat(state.params.density));
  url.searchParams.set(URL_KEYS.speed, trimFloat(state.params.speed));
  url.searchParams.set(URL_KEYS.lineWidth, trimFloat(state.params.lineWidth));
  window.history.replaceState(null, "", url);
}

function applyStateFromUrl() {
  const url = new URL(window.location.href);
  const modeParam = url.searchParams.get(URL_KEYS.mode);
  const paletteParam = url.searchParams.get(URL_KEYS.palette);
  const seedParam = url.searchParams.get(URL_KEYS.seed);
  const densityParam = url.searchParams.get(URL_KEYS.density);
  const speedParam = url.searchParams.get(URL_KEYS.speed);
  const lineWidthParam = url.searchParams.get(URL_KEYS.lineWidth);

  if (modeParam && modeMap.has(modeParam)) {
    state.mode = modeParam;
  }

  if (paletteParam && palettes[paletteParam]) {
    state.paletteName = paletteParam;
  }

  if (seedParam) {
    state.seed = parseIntSafe(seedParam, state.seed);
  }

  if (densityParam) {
    state.params.density = parseNum(densityParam, state.params.density);
  }

  if (speedParam) {
    state.params.speed = parseNum(speedParam, state.params.speed);
  }

  if (lineWidthParam) {
    state.params.lineWidth = parseNum(lineWidthParam, state.params.lineWidth);
  }
}

function commitChange(mutator, options = {}) {
  const before = snapshotState();
  mutator();
  sanitizeState();
  const after = snapshotState();

  if (snapshotsEqual(before, after)) {
    syncControlsFromState();
    return;
  }

  if (options.saveHistory !== false) {
    pushHistory(before);
  }

  syncControlsFromState();

  if (options.regenerate !== false) {
    regenerate();
  }

  if (options.syncUrl !== false) {
    syncUrlFromState();
  }

  updateHistoryUI();
}

function resize() {
  const frame = canvas.parentElement.getBoundingClientRect();
  width = Math.max(320, Math.floor(frame.width));
  height = Math.max(320, Math.floor(frame.height));

  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  regenerate();
}

function getMode() {
  return modeMap.get(state.mode) || modeDefs[0];
}

function regenerate() {
  state.frame = 0;
  state.rand = mulberry32(state.seed);
  applyPaletteToUI();
  ctx.setLineDash([]);
  ctx.fillStyle = paletteAt(0);
  ctx.fillRect(0, 0, width, height);
  getMode().build(state.rand);
}

function tick() {
  if (state.running) {
    state.frame += 1;
    getMode().draw();
  }
  animationId = requestAnimationFrame(tick);
}

function buildFlow(rand) {
  const count = countWithDensity((width * height) / 1050, 120);
  const particles = [];

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: rand() * width,
      y: rand() * height,
      speed: 0.45 + rand() * 1.8,
      size: 0.5 + rand() * 1.3,
      color: 1 + Math.floor(rand() * 4)
    });
  }

  state.data = { particles };
}

function drawFlow() {
  clearWithAlpha(0.08);
  ctx.lineCap = "round";

  for (const particle of state.data.particles) {
    const x1 = particle.x;
    const y1 = particle.y;
    const n = fbm((x1 + state.frame * 0.6) * 0.0037, (y1 - state.frame * 0.15) * 0.0037);
    const angle = n * Math.PI * 8;

    particle.x += Math.cos(angle) * speedScale(particle.speed);
    particle.y += Math.sin(angle) * speedScale(particle.speed);

    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;

    ctx.strokeStyle = withAlpha(paletteAt(particle.color), 0.38);
    ctx.lineWidth = lineScale(particle.size);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(particle.x, particle.y);
    ctx.stroke();
  }
}

function buildOrbits(rand) {
  const count = countWithDensity((width * height) / 4300, 30);
  const bodies = [];

  for (let i = 0; i < count; i += 1) {
    const theta = rand() * Math.PI * 2;
    const radius = Math.min(width, height) * (0.08 + rand() * 0.47);
    const cx = width * (0.3 + rand() * 0.4);
    const cy = height * (0.3 + rand() * 0.4);

    bodies.push({
      cx,
      cy,
      theta,
      radius,
      speed: (rand() - 0.5) * 0.045,
      wobble: 0.8 + rand() * 2.9,
      amp: 7 + rand() * 22,
      dot: 0.9 + rand() * 2.7,
      color: 1 + Math.floor(rand() * 4),
      px: cx + Math.cos(theta) * radius,
      py: cy + Math.sin(theta) * radius
    });
  }

  state.data = { bodies };
}

function drawOrbits() {
  clearWithAlpha(0.06);
  ctx.lineCap = "round";

  for (const body of state.data.bodies) {
    const x1 = body.px;
    const y1 = body.py;

    body.theta += speedScale(body.speed);
    const warp = Math.sin(body.theta * body.wobble + state.frame * 0.02 * state.params.speed) * body.amp;
    const x2 = body.cx + Math.cos(body.theta) * (body.radius + warp);
    const y2 = body.cy + Math.sin(body.theta) * (body.radius * 0.72 + warp);

    body.px = x2;
    body.py = y2;

    ctx.strokeStyle = withAlpha(paletteAt(body.color), 0.36);
    ctx.lineWidth = lineScale(0.8);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = withAlpha(paletteAt(body.color), 0.62);
    ctx.beginPath();
    ctx.arc(x2, y2, Math.max(0.5, lineScale(body.dot)), 0, Math.PI * 2);
    ctx.fill();
  }
}

function buildWeave(rand) {
  const count = countWithDensity((width * height) / 7600, 20);
  const strips = [];

  for (let i = 0; i < count; i += 1) {
    strips.push({
      y: rand() * height,
      amp: 20 + rand() * 95,
      freq: 0.002 + rand() * 0.014,
      speed: 0.004 + rand() * 0.016,
      width: 0.7 + rand() * 2.1,
      phase: rand() * Math.PI * 2,
      color: 1 + Math.floor(rand() * 4)
    });
  }

  state.data = { strips };
}

function drawWeave() {
  clearWithAlpha(0.09);

  for (const strip of state.data.strips) {
    strip.phase += speedScale(strip.speed);
    ctx.strokeStyle = withAlpha(paletteAt(strip.color), 0.35);
    ctx.lineWidth = lineScale(strip.width);
    ctx.beginPath();

    for (let x = 0; x <= width; x += 8) {
      const y =
        strip.y +
        Math.sin(x * strip.freq + strip.phase) * strip.amp +
        Math.cos(x * strip.freq * 1.7 + strip.phase * 0.8) * (strip.amp * 0.32);

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}

function buildVortex(rand) {
  const maxRadius = Math.min(width, height) * 0.55;
  const count = countWithDensity((width * height) / 1700, 120);
  const particles = [];

  for (let i = 0; i < count; i += 1) {
    particles.push({
      radius: randIn(10, maxRadius, rand),
      theta: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.09,
      drift: (rand() - 0.5) * 1.8,
      pulse: 0.3 + rand() * 0.8,
      color: 1 + Math.floor(rand() * 4),
      width: 0.5 + rand() * 1.1
    });
  }

  state.data = { particles, maxRadius };
}

function drawVortex() {
  clearWithAlpha(0.07);
  const cx = width * 0.5 + Math.sin(state.frame * 0.005 * state.params.speed) * width * 0.1;
  const cy = height * 0.5 + Math.cos(state.frame * 0.004 * state.params.speed) * height * 0.1;

  for (const particle of state.data.particles) {
    const x1 = cx + Math.cos(particle.theta) * particle.radius;
    const y1 = cy + Math.sin(particle.theta) * particle.radius;

    particle.theta += speedScale(particle.spin + Math.sin(state.frame * 0.01 + particle.radius * 0.03) * 0.015);
    particle.radius += speedScale(particle.drift * 0.2 + Math.sin(state.frame * 0.01 + particle.pulse) * 0.15);

    if (particle.radius < 8 || particle.radius > state.data.maxRadius) {
      particle.radius = randIn(12, state.data.maxRadius, state.rand);
      particle.theta = randIn(0, Math.PI * 2, state.rand);
    }

    const x2 = cx + Math.cos(particle.theta) * particle.radius;
    const y2 = cy + Math.sin(particle.theta) * particle.radius;

    ctx.strokeStyle = withAlpha(paletteAt(particle.color), 0.34);
    ctx.lineWidth = lineScale(particle.width);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function buildDunes(rand) {
  const layers = [];
  const count = clamp(Math.floor(16 * state.params.density), 8, 34);

  for (let i = 0; i < count; i += 1) {
    const depth = i / Math.max(1, count - 1);
    layers.push({
      base: height * (0.18 + depth * 0.8),
      amp: 26 + depth * 70 + rand() * 26,
      freq: 0.0015 + rand() * 0.005,
      speed: 0.0008 + rand() * 0.003,
      offset: rand() * 1000,
      ripple: 0.7 + rand() * 2,
      color: 1 + (i % 4),
      alpha: 0.08 + depth * 0.1
    });
  }

  state.data = { layers };
}

function drawDunes() {
  ctx.fillStyle = paletteAt(0);
  ctx.fillRect(0, 0, width, height);

  for (const layer of state.data.layers) {
    ctx.fillStyle = withAlpha(paletteAt(layer.color), layer.alpha);
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x += 10) {
      const n = fbm(x * layer.freq, layer.offset + state.frame * layer.speed * state.params.speed);
      const wave = Math.sin(x * layer.freq * 9 + state.frame * 0.015 * layer.ripple * state.params.speed) * 12;
      const y = layer.base - n * layer.amp + wave;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  }
}

function buildMosaic(rand) {
  state.data = {
    step: Math.floor(randIn(24, 40, rand) / Math.sqrt(state.params.density)),
    scale: randIn(0.008, 0.019, rand),
    twist: randIn(-1.8, 1.8, rand),
    colorShift: randIn(0, 6, rand)
  };
}

function drawMosaic() {
  clearWithAlpha(0.12);

  const step = clamp(state.data.step, 10, 60);
  const scale = state.data.scale;

  for (let y = step * 0.5; y < height; y += step) {
    for (let x = step * 0.5; x < width; x += step) {
      const n = fbm((x + state.frame * 0.85 * state.params.speed) * scale, (y - state.frame * 0.63 * state.params.speed) * scale);
      const index = 1 + Math.floor(((n * 3.9 + state.data.colorShift) % 4 + 4) % 4);
      const size = step * (0.3 + n * 0.9);
      const angle = n * Math.PI * 2 + state.frame * 0.003 * state.data.twist * state.params.speed;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = withAlpha(paletteAt(index), 0.42);
      ctx.fillRect(-size * 0.5, -size * 0.35, size, size * 0.7);
      ctx.restore();
    }
  }
}

function buildTendrils(rand) {
  const count = countWithDensity((width * height) / 2300, 60);
  const walkers = [];

  for (let i = 0; i < count; i += 1) {
    walkers.push({
      x: width * 0.5 + randIn(-40, 40, rand),
      y: height * 0.5 + randIn(-40, 40, rand),
      speed: 0.5 + rand() * 1.7,
      drift: rand() * 1000,
      color: 1 + Math.floor(rand() * 4),
      width: 0.45 + rand() * 1.1
    });
  }

  state.data = { walkers };
}

function drawTendrils() {
  clearWithAlpha(0.03);
  ctx.lineCap = "round";

  for (const walker of state.data.walkers) {
    const x1 = walker.x;
    const y1 = walker.y;
    const n = fbm(
      (walker.x + walker.drift + state.frame * 0.5 * state.params.speed) * 0.0048,
      (walker.y - state.frame * 0.3 * state.params.speed) * 0.0048
    );
    const angle = n * Math.PI * 10 + walker.drift;

    walker.x += Math.cos(angle) * speedScale(walker.speed);
    walker.y += Math.sin(angle) * speedScale(walker.speed);

    if (walker.x < -20 || walker.x > width + 20 || walker.y < -20 || walker.y > height + 20) {
      walker.x = width * 0.5 + randIn(-55, 55, state.rand);
      walker.y = height * 0.5 + randIn(-55, 55, state.rand);
    }

    const cx = (x1 + walker.x) * 0.5 + Math.sin(state.frame * 0.02 + walker.drift) * 4;
    const cy = (y1 + walker.y) * 0.5 + Math.cos(state.frame * 0.02 + walker.drift) * 4;

    ctx.strokeStyle = withAlpha(paletteAt(walker.color), 0.35);
    ctx.lineWidth = lineScale(walker.width);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, walker.x, walker.y);
    ctx.stroke();
  }
}

function buildRings(rand) {
  const count = countWithDensity((width * height) / 14500, 20) + 10;
  const rings = [];
  const maxRadius = Math.hypot(width, height) * 0.6;

  for (let i = 0; i < count; i += 1) {
    rings.push({
      radius: randIn(8, maxRadius, rand),
      speed: randIn(0.35, 1.6, rand),
      width: randIn(0.6, 2.5, rand),
      dash: randIn(8, 28, rand),
      arc: randIn(0.5, 1.9, rand),
      color: 1 + Math.floor(rand() * 4)
    });
  }

  state.data = { rings, maxRadius };
}

function drawRings() {
  clearWithAlpha(0.09);
  const cx = width * 0.5 + Math.sin(state.frame * 0.004 * state.params.speed) * width * 0.07;
  const cy = height * 0.5 + Math.cos(state.frame * 0.003 * state.params.speed) * height * 0.07;

  for (const ring of state.data.rings) {
    ring.radius += speedScale(ring.speed);

    if (ring.radius > state.data.maxRadius) {
      ring.radius = randIn(4, 35, state.rand);
      ring.speed = randIn(0.35, 1.6, state.rand);
      ring.arc = randIn(0.5, 1.9, state.rand);
      ring.color = 1 + Math.floor(state.rand() * 4);
    }

    const start = state.frame * 0.01 * state.params.speed + ring.radius * 0.004;
    ctx.strokeStyle = withAlpha(paletteAt(ring.color), 0.36);
    ctx.lineWidth = lineScale(ring.width);
    ctx.setLineDash([ring.dash, ring.dash * 0.75]);
    ctx.lineDashOffset = -state.frame * ring.speed * 0.8 * state.params.speed;
    ctx.beginPath();
    ctx.arc(cx, cy, ring.radius, start, start + Math.PI * ring.arc);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function buildConstellation(rand) {
  const baseCount = clamp(Math.floor((width * height) / 12000), 36, 82);
  const count = clamp(Math.floor(baseCount * state.params.density), 24, 140);
  const stars = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: rand() * width,
      y: rand() * height,
      vx: (rand() - 0.5) * 0.9,
      vy: (rand() - 0.5) * 0.9,
      r: 0.8 + rand() * 2,
      color: 1 + Math.floor(rand() * 4)
    });
  }

  state.data = { stars };
}

function drawConstellation() {
  clearWithAlpha(0.12);
  const threshold = Math.min(width, height) * 0.17;
  const thresholdSq = threshold * threshold;
  const stars = state.data.stars;

  for (const star of stars) {
    star.x += speedScale(star.vx);
    star.y += speedScale(star.vy);

    if (star.x < 0 || star.x > width) star.vx *= -1;
    if (star.y < 0 || star.y > height) star.vy *= -1;

    star.x = clamp(star.x, 0, width);
    star.y = clamp(star.y, 0, height);

    ctx.fillStyle = withAlpha(paletteAt(star.color), 0.7);
    ctx.beginPath();
    ctx.arc(star.x, star.y, Math.max(0.45, lineScale(star.r)), 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < stars.length; i += 1) {
    for (let j = i + 1; j < stars.length; j += 1) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const distSq = dx * dx + dy * dy;

      if (distSq < thresholdSq) {
        const strength = 1 - distSq / thresholdSq;
        ctx.strokeStyle = withAlpha(paletteAt(4), 0.06 + strength * 0.2);
        ctx.lineWidth = lineScale(0.4 + strength * 1.2);
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }
}

function buildShards(rand) {
  const count = countWithDensity((width * height) / 9200, 20) + 12;
  const shards = [];

  for (let i = 0; i < count; i += 1) {
    shards.push({
      x: rand() * width,
      y: rand() * height,
      vx: (rand() - 0.5) * 1.6,
      vy: (rand() - 0.5) * 1.6,
      rot: rand() * Math.PI * 2,
      vr: (rand() - 0.5) * 0.03,
      size: randIn(14, 70, rand),
      skew: randIn(0.2, 1, rand),
      color: 1 + Math.floor(rand() * 4)
    });
  }

  state.data = { shards };
}

function drawShards() {
  clearWithAlpha(0.11);

  for (const shard of state.data.shards) {
    shard.x += speedScale(shard.vx);
    shard.y += speedScale(shard.vy);
    shard.rot += speedScale(shard.vr);

    if (shard.x < -80) shard.x = width + 80;
    if (shard.x > width + 80) shard.x = -80;
    if (shard.y < -80) shard.y = height + 80;
    if (shard.y > height + 80) shard.y = -80;

    const h = shard.size;
    const w = shard.size * shard.skew;

    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.rotate(shard.rot);

    ctx.fillStyle = withAlpha(paletteAt(shard.color), 0.3);
    ctx.strokeStyle = withAlpha(paletteAt(shard.color), 0.64);
    ctx.lineWidth = lineScale(1);

    ctx.beginPath();
    ctx.moveTo(0, -h * 0.6);
    ctx.lineTo(w * 0.72, h * 0.36);
    ctx.lineTo(-w * 0.62, h * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

function buildStreamVariant(rand, cfg) {
  const count = countWithDensity((width * height) / cfg.densityDiv, cfg.minCount);
  const particles = [];

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: rand() * width,
      y: rand() * height,
      speed: randIn(cfg.speedMin, cfg.speedMax, rand),
      size: randIn(cfg.sizeMin, cfg.sizeMax, rand),
      color: 1 + Math.floor(rand() * 4),
      drift: rand() * 2000
    });
  }

  state.data = { cfg, particles };
}

function drawStreamVariant() {
  const cfg = state.data.cfg;
  clearWithAlpha(cfg.fade);
  ctx.lineCap = "round";

  for (const particle of state.data.particles) {
    const x1 = particle.x;
    const y1 = particle.y;
    const n = fbm(
      (x1 + state.frame * cfg.timeX * state.params.speed + particle.drift) * cfg.noise,
      (y1 + state.frame * cfg.timeY * state.params.speed - particle.drift * 0.2) * cfg.noise
    );
    const angle = n * Math.PI * cfg.angle + cfg.turn + Math.sin(state.frame * 0.01 + particle.drift) * 0.2;

    particle.x += Math.cos(angle) * speedScale(particle.speed);
    particle.y += Math.sin(angle) * speedScale(particle.speed);

    if (particle.x < -cfg.margin) particle.x = width + cfg.margin;
    if (particle.x > width + cfg.margin) particle.x = -cfg.margin;
    if (particle.y < -cfg.margin) particle.y = height + cfg.margin;
    if (particle.y > height + cfg.margin) particle.y = -cfg.margin;

    ctx.strokeStyle = withAlpha(paletteAt(particle.color), cfg.alpha);
    ctx.lineWidth = lineScale(particle.size * cfg.lineMult);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(particle.x, particle.y);
    ctx.stroke();
  }
}

function buildWaveVariant(rand, cfg) {
  const count = clamp(Math.floor(cfg.countBase * state.params.density), cfg.countMin, 64);
  const strips = [];

  for (let i = 0; i < count; i += 1) {
    strips.push({
      y: rand() * height,
      amp: randIn(cfg.ampMin, cfg.ampMax, rand),
      freq: randIn(cfg.freqMin, cfg.freqMax, rand),
      speed: randIn(cfg.speedMin, cfg.speedMax, rand),
      width: randIn(cfg.widthMin, cfg.widthMax, rand),
      phase: rand() * Math.PI * 2,
      drift: rand() * Math.PI * 2,
      color: 1 + Math.floor(rand() * 4)
    });
  }

  state.data = { cfg, strips };
}

function drawWaveVariant() {
  const cfg = state.data.cfg;
  clearWithAlpha(cfg.fade);

  for (const strip of state.data.strips) {
    strip.phase += speedScale(strip.speed);
    const yDrift = Math.sin(state.frame * 0.01 * cfg.drift * state.params.speed + strip.drift) * strip.amp * 0.08;
    ctx.strokeStyle = withAlpha(paletteAt(strip.color), cfg.alpha);
    ctx.lineWidth = lineScale(strip.width);
    ctx.beginPath();

    for (let x = 0; x <= width; x += cfg.step) {
      const y =
        strip.y +
        yDrift +
        Math.sin(x * strip.freq + strip.phase) * strip.amp +
        Math.cos(x * strip.freq * cfg.secondFreq + strip.phase * cfg.secondPhase) * strip.amp * cfg.mix;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}

function buildRadialVariant(rand, cfg) {
  const count = countWithDensity((width * height) / cfg.densityDiv, cfg.minCount);
  const items = [];
  const maxRadius = Math.min(width, height) * cfg.radiusMaxScale;

  for (let i = 0; i < count; i += 1) {
    items.push({
      radius: randIn(cfg.radiusMin, maxRadius, rand),
      theta: rand() * Math.PI * 2,
      speed: randIn(cfg.speedMin, cfg.speedMax, rand),
      wobble: randIn(cfg.wobbleMin, cfg.wobbleMax, rand),
      size: randIn(cfg.sizeMin, cfg.sizeMax, rand),
      arcSpan: randIn(cfg.arcMin, cfg.arcMax, rand),
      seed: rand() * 1000,
      color: 1 + Math.floor(rand() * 4)
    });
  }

  state.data = { cfg, items, maxRadius };
}

function drawRadialVariant() {
  const cfg = state.data.cfg;
  clearWithAlpha(cfg.fade);
  const cx = width * 0.5 + Math.sin(state.frame * cfg.centerFreqX * state.params.speed) * width * cfg.centerAmpX;
  const cy = height * 0.5 + Math.cos(state.frame * cfg.centerFreqY * state.params.speed) * height * cfg.centerAmpY;

  for (const item of state.data.items) {
    const radiusA = Math.abs(item.radius + Math.sin(state.frame * 0.018 * state.params.speed + item.seed) * item.wobble);
    const x1 = cx + Math.cos(item.theta) * radiusA;
    const y1 = cy + Math.sin(item.theta) * radiusA;

    item.theta += speedScale(item.speed);

    const radiusB = Math.abs(item.radius + Math.sin(state.frame * 0.018 * state.params.speed + item.seed + 0.4) * item.wobble);
    const x2 = cx + Math.cos(item.theta) * radiusB;
    const y2 = cy + Math.sin(item.theta) * radiusB;

    ctx.strokeStyle = withAlpha(paletteAt(item.color), cfg.alpha);
    ctx.fillStyle = withAlpha(paletteAt(item.color), cfg.alpha + 0.15);
    ctx.lineWidth = lineScale(item.size);

    if (cfg.style === "line") {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      continue;
    }

    if (cfg.style === "dot") {
      ctx.beginPath();
      ctx.arc(x2, y2, Math.max(0.4, lineScale(item.size)), 0, Math.PI * 2);
      ctx.fill();
      continue;
    }

    const span = item.arcSpan * (0.45 + state.params.speed * 0.55);
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(2, radiusB), item.theta, item.theta + span);
    ctx.stroke();
  }
}

function buildGridVariant(rand, cfg) {
  const step = clamp(Math.floor(cfg.baseStep / Math.sqrt(state.params.density)), cfg.minStep, cfg.maxStep);
  state.data = {
    cfg,
    step,
    phase: rand() * 1000,
    offset: rand() * Math.PI * 2
  };
}

function drawGridShape(shape, size) {
  if (shape === "rect") {
    ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
    return;
  }

  if (shape === "diamond") {
    ctx.rotate(Math.PI * 0.25);
    ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
    return;
  }

  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (shape === "cross") {
    const arm = size * 0.28;
    ctx.fillRect(-arm * 0.5, -size * 0.5, arm, size);
    ctx.fillRect(-size * 0.5, -arm * 0.5, size, arm);
    return;
  }

  ctx.fillRect(-size * 0.5, -size * 0.18, size, size * 0.36);
}

function drawGridVariant() {
  const cfg = state.data.cfg;
  clearWithAlpha(cfg.fade);
  const step = state.data.step;

  for (let y = step * 0.5; y < height; y += step) {
    for (let x = step * 0.5; x < width; x += step) {
      const n = fbm(
        (x + state.frame * cfg.tx * state.params.speed + state.data.phase) * cfg.scale,
        (y - state.frame * cfg.ty * state.params.speed) * cfg.scale
      );
      const idx = 1 + Math.floor(((n * 4.3 + state.data.offset) % 4 + 4) % 4);
      const sizeRaw = step * (cfg.sizeMin + n * cfg.sizeMul);
      const size = clamp(sizeRaw, step * 0.12, step * 0.95);
      const drawSize = size * (0.65 + state.params.lineWidth * 0.35);
      const angle = n * Math.PI * 2 + state.frame * 0.002 * cfg.spin * state.params.speed;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = withAlpha(paletteAt(idx), cfg.alpha);
      drawGridShape(cfg.shape, drawSize);
      ctx.restore();
    }
  }
}

function buildAurora(rand) {
  buildStreamVariant(rand, STREAM_VARIANTS.aurora);
}

function drawAurora() {
  drawStreamVariant();
}

function buildSmoke(rand) {
  buildStreamVariant(rand, STREAM_VARIANTS.smoke);
}

function drawSmoke() {
  drawStreamVariant();
}

function buildCurrent(rand) {
  buildStreamVariant(rand, STREAM_VARIANTS.current);
}

function drawCurrent() {
  drawStreamVariant();
}

function buildPollen(rand) {
  buildStreamVariant(rand, STREAM_VARIANTS.pollen);
}

function drawPollen() {
  drawStreamVariant();
}

function buildPlasma(rand) {
  buildStreamVariant(rand, STREAM_VARIANTS.plasma);
}

function drawPlasma() {
  drawStreamVariant();
}

function buildTides(rand) {
  buildWaveVariant(rand, WAVE_VARIANTS.tides);
}

function drawTides() {
  drawWaveVariant();
}

function buildBraid(rand) {
  buildWaveVariant(rand, WAVE_VARIANTS.braid);
}

function drawBraid() {
  drawWaveVariant();
}

function buildInterference(rand) {
  buildWaveVariant(rand, WAVE_VARIANTS.interference);
}

function drawInterference() {
  drawWaveVariant();
}

function buildContour(rand) {
  buildWaveVariant(rand, WAVE_VARIANTS.contour);
}

function drawContour() {
  drawWaveVariant();
}

function buildSilk(rand) {
  buildWaveVariant(rand, WAVE_VARIANTS.silk);
}

function drawSilk() {
  drawWaveVariant();
}

function buildHelix(rand) {
  buildRadialVariant(rand, RADIAL_VARIANTS.helix);
}

function drawHelix() {
  drawRadialVariant();
}

function buildPetals(rand) {
  buildRadialVariant(rand, RADIAL_VARIANTS.petals);
}

function drawPetals() {
  drawRadialVariant();
}

function buildSunburst(rand) {
  buildRadialVariant(rand, RADIAL_VARIANTS.sunburst);
}

function drawSunburst() {
  drawRadialVariant();
}

function buildRadar(rand) {
  buildRadialVariant(rand, RADIAL_VARIANTS.radar);
}

function drawRadar() {
  drawRadialVariant();
}

function buildNova(rand) {
  buildRadialVariant(rand, RADIAL_VARIANTS.nova);
}

function drawNova() {
  drawRadialVariant();
}

function buildQuilt(rand) {
  buildGridVariant(rand, GRID_VARIANTS.quilt);
}

function drawQuilt() {
  drawGridVariant();
}

function buildGlyph(rand) {
  buildGridVariant(rand, GRID_VARIANTS.glyph);
}

function drawGlyph() {
  drawGridVariant();
}

function buildChecker(rand) {
  buildGridVariant(rand, GRID_VARIANTS.checker);
}

function drawChecker() {
  drawGridVariant();
}

function buildCircuit(rand) {
  buildGridVariant(rand, GRID_VARIANTS.circuit);
}

function drawCircuit() {
  drawGridVariant();
}

function buildBubbles(rand) {
  buildGridVariant(rand, GRID_VARIANTS.bubbles);
}

function drawBubbles() {
  drawGridVariant();
}

async function copyShareUrl() {
  syncUrlFromState();
  const text = window.location.href;

  try {
    await navigator.clipboard.writeText(text);
    flashButton(copyLinkBtn, "Copied URL", "Copy Share URL");
  } catch {
    flashButton(copyLinkBtn, "Copy Failed", "Copy Share URL");
  }
}

function flashButton(button, activeText, defaultText) {
  const previous = button.textContent;
  button.textContent = activeText;
  setTimeout(() => {
    button.textContent = defaultText || previous;
  }, 900);
}

function randomizeSelected() {
  const selected = [randMode, randPalette, randSeed, randDensity, randSpeed, randLineWidth].some((item) => item.checked);

  if (!selected) {
    flashButton(randomBtn, "Select a random attr", "Randomize Selected");
    return;
  }

  commitChange(() => {
    if (randMode.checked) {
      const ids = modeDefs.map((item) => item.id);
      state.mode = randomChoice(ids);
    }

    if (randPalette.checked) {
      const names = Object.keys(palettes);
      state.paletteName = randomChoice(names);
    }

    if (randSeed.checked) {
      state.seed = Math.floor(Math.random() * 9000000) + 1;
    }

    if (randDensity.checked) {
      state.params.density = quantize(randIn(PARAM_LIMITS.density.min, PARAM_LIMITS.density.max, Math.random), PARAM_LIMITS.density.step);
    }

    if (randSpeed.checked) {
      state.params.speed = quantize(randIn(PARAM_LIMITS.speed.min, PARAM_LIMITS.speed.max, Math.random), PARAM_LIMITS.speed.step);
    }

    if (randLineWidth.checked) {
      state.params.lineWidth = quantize(randIn(PARAM_LIMITS.lineWidth.min, PARAM_LIMITS.lineWidth.max, Math.random), PARAM_LIMITS.lineWidth.step);
    }
  });
}

modeSelect.addEventListener("change", () => {
  commitChange(() => {
    state.mode = modeSelect.value;
  });
});

paletteSelect.addEventListener("change", () => {
  commitChange(() => {
    state.paletteName = paletteSelect.value;
  });
});

seedInput.addEventListener("change", () => {
  commitChange(() => {
    state.seed = parseIntSafe(seedInput.value, state.seed);
  });
});

densityRange.addEventListener("input", () => {
  densityValue.textContent = formatMult(parseNum(densityRange.value, state.params.density));
});

speedRange.addEventListener("input", () => {
  speedValue.textContent = formatMult(parseNum(speedRange.value, state.params.speed));
});

lineWidthRange.addEventListener("input", () => {
  lineWidthValue.textContent = formatMult(parseNum(lineWidthRange.value, state.params.lineWidth));
});

densityRange.addEventListener("change", () => {
  commitChange(() => {
    state.params.density = parseNum(densityRange.value, state.params.density);
  });
});

speedRange.addEventListener("change", () => {
  commitChange(() => {
    state.params.speed = parseNum(speedRange.value, state.params.speed);
  });
});

lineWidthRange.addEventListener("change", () => {
  commitChange(() => {
    state.params.lineWidth = parseNum(lineWidthRange.value, state.params.lineWidth);
  });
});

generateBtn.addEventListener("click", () => {
  regenerate();
});

randomBtn.addEventListener("click", () => {
  randomizeSelected();
});

undoBtn.addEventListener("click", () => {
  if (state.history.length === 0) {
    return;
  }

  const previous = state.history.pop();
  setStateFromSnapshot(previous);
  syncControlsFromState();
  regenerate();
  syncUrlFromState();
  updateHistoryUI();
});

pauseBtn.addEventListener("click", () => {
  state.running = !state.running;
  pauseBtn.textContent = state.running ? "Pause" : "Resume";
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `generative-art-${state.mode}-${state.seed}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

copyLinkBtn.addEventListener("click", () => {
  copyShareUrl();
});

window.addEventListener("resize", resize);

syncUrlFromState();
resize();
cancelAnimationFrame(animationId);
tick();
