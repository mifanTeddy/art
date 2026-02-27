const canvas = document.getElementById("artCanvas");

const modeSelect = document.getElementById("modeSelect");
const paletteSelect = document.getElementById("paletteSelect");
const baseToneSelect = document.getElementById("baseToneSelect");
const seedInput = document.getElementById("seedInput");
const generateBtn = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn");
const undoBtn = document.getElementById("undoBtn");
const pauseBtn = document.getElementById("pauseBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const historyStatus = document.getElementById("historyStatus");
const presetSelect = document.getElementById("presetSelect");
const presetNameInput = document.getElementById("presetNameInput");
const savePresetBtn = document.getElementById("savePresetBtn");
const applyPresetBtn = document.getElementById("applyPresetBtn");
const deletePresetBtn = document.getElementById("deletePresetBtn");
const recordWebmBtn = document.getElementById("recordWebmBtn");
const exportGifBtn = document.getElementById("exportGifBtn");
const recordStatus = document.getElementById("recordStatus");
const openGalleryBtn = document.getElementById("openGalleryBtn");

const densityRange = document.getElementById("densityRange");
const speedRange = document.getElementById("speedRange");
const lineWidthRange = document.getElementById("lineWidthRange");
const densityValue = document.getElementById("densityValue");
const speedValue = document.getElementById("speedValue");
const lineWidthValue = document.getElementById("lineWidthValue");

const randMode = document.getElementById("randMode");
const randPalette = document.getElementById("randPalette");
const randBaseTone = document.getElementById("randBaseTone");
const randSeed = document.getElementById("randSeed");
const randDensity = document.getElementById("randDensity");
const randSpeed = document.getElementById("randSpeed");
const randLineWidth = document.getElementById("randLineWidth");

const fxEnabled = document.getElementById("fxEnabled");
const fxBloomRange = document.getElementById("fxBloomRange");
const fxChromaRange = document.getElementById("fxChromaRange");
const fxGrainRange = document.getElementById("fxGrainRange");
const fxVignetteRange = document.getElementById("fxVignetteRange");
const fxBloomValue = document.getElementById("fxBloomValue");
const fxChromaValue = document.getElementById("fxChromaValue");
const fxGrainValue = document.getElementById("fxGrainValue");
const fxVignetteValue = document.getElementById("fxVignetteValue");
const audioEnabled = document.getElementById("audioEnabled");
const audioInputSelect = document.getElementById("audioInputSelect");
const audioFileInput = document.getElementById("audioFileInput");
const audioFileLabel = document.getElementById("audioFileLabel");
const audioReactivityRange = document.getElementById("audioReactivityRange");
const audioReactivityValue = document.getElementById("audioReactivityValue");
const audioStatus = document.getElementById("audioStatus");
const audioLevel = document.getElementById("audioLevel");

const HISTORY_LIMIT = 30;
const PRESET_LIMIT = 40;
const PRESET_STORAGE_KEY = "generative-garden-presets-v1";
const GIF_DURATION_MS = 4000;
const GIF_FPS = 16;
const AUDIO_REACTIVITY = { min: 0, max: 2, step: 0.1 };
const AUDIO_INPUT_IDS = ["demo-beat", "demo-ambient", "demo-arp", "upload", "mic"];
const AUDIO_DEMO_FILES = {
  "demo-beat": "assets/audio/demo-beat.wav",
  "demo-ambient": "assets/audio/demo-ambient.wav",
  "demo-arp": "assets/audio/demo-arp.wav"
};

const PARAM_LIMITS = window.GGStateStore.PARAM_LIMITS;
const URL_KEYS = { ...window.GGStateStore.BASE_URL_KEYS };

const palettes = {
  citrus: ["#f8f3e9", "#f06449", "#f5d547", "#4ea7a0", "#102132"],
  dusk: ["#f7efe4", "#ff7f50", "#6f9ceb", "#2f4858", "#b23a48"],
  lagoon: ["#f2f7f3", "#2a9d8f", "#e9c46a", "#264653", "#e76f51"],
  blossom: ["#fff6ec", "#ef476f", "#ffd166", "#118ab2", "#073b4c"],
  ember: ["#fdf6ec", "#d8572a", "#ffc857", "#084c61", "#4f000b"],
  mint: ["#f1fff7", "#00a878", "#57cc99", "#22577a", "#1b4332"]
};

const state = window.GGStateStore.createInitialState();

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

const shaderModeDefs = [
  { id: "nebula3d", label: "Nebula Volume" },
  { id: "tunnel3d", label: "Warp Tunnel" },
  { id: "metaball3d", label: "Metaball Galaxy" }
];

const blendDefs = [
  { id: "screen", label: "Screen" },
  { id: "lighter", label: "Additive" },
  { id: "multiply", label: "Multiply" },
  { id: "source-over", label: "Normal" }
];

const modeRegistry = window.GGModeRegistry.create();
for (const mode of modeDefs) modeRegistry.register("classic", mode);
for (const mode of shaderModeDefs) modeRegistry.register("shader3d", mode);
for (const blend of blendDefs) modeRegistry.register("blend", blend);

const modeMap = modeRegistry.map("classic");
const shaderModeMap = modeRegistry.map("shader3d");
const blendMap = modeRegistry.map("blend");

const categorySelect = document.getElementById("categorySelect");
const classicGroup = document.getElementById("classicGroup");
const shaderGroup = document.getElementById("shaderGroup");
const comboGroup = document.getElementById("comboGroup");
const shaderModeSelect = document.getElementById("shaderModeSelect");
const comboLayerCountSelect = document.getElementById("comboLayerCountSelect");
const comboLayer1 = document.getElementById("comboLayer1");
const comboLayer2 = document.getElementById("comboLayer2");
const comboLayer3 = document.getElementById("comboLayer3");
const comboLayer4 = document.getElementById("comboLayer4");
const comboMode1Select = document.getElementById("comboMode1Select");
const comboMode2Select = document.getElementById("comboMode2Select");
const comboMode3Select = document.getElementById("comboMode3Select");
const comboMode4Select = document.getElementById("comboMode4Select");
const comboBlend2Select = document.getElementById("comboBlend2Select");
const comboBlend3Select = document.getElementById("comboBlend3Select");
const comboBlend4Select = document.getElementById("comboBlend4Select");

const randCategory = document.getElementById("randCategory");
const randBlend = document.getElementById("randBlend");

const glCanvas = document.getElementById("glCanvas");
const fxCanvas = document.getElementById("fxCanvas");
const baseCtx2d = canvas.getContext("2d");
const fxCtx = fxCanvas.getContext("2d", { willReadFrequently: true });
let ctx = baseCtx2d;

const comboLayers = Array.from({ length: 4 }, () => {
  const layerCanvas = document.createElement("canvas");
  return {
    canvas: layerCanvas,
    ctx: layerCanvas.getContext("2d", { willReadFrequently: true })
  };
});

const captureCanvas = document.createElement("canvas");
const captureCtx = captureCanvas.getContext("2d", { willReadFrequently: true });
const grainCanvas = document.createElement("canvas");
const grainCtx = grainCanvas.getContext("2d", { willReadFrequently: true });

const grainWorkerState = {
  worker: null,
  pending: false,
  latest: null
};

const shaderState = {
  gl: null,
  ready: false,
  failed: false,
  program: null,
  position: null,
  uniforms: null,
  buffer: null
};

let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
let width = 1;
let height = 1;
let animationId = 0;
let renderPipeline = null;

URL_KEYS.category = "c";
URL_KEYS.shaderMode = "sm";
URL_KEYS.comboLayerCount = "cl";
URL_KEYS.comboMode1 = "a";
URL_KEYS.comboMode2 = "b";
URL_KEYS.comboMode3 = "c3";
URL_KEYS.comboMode4 = "c4";
URL_KEYS.comboBlend2 = "bm";
URL_KEYS.comboBlend3 = "b3";
URL_KEYS.comboBlend4 = "b4";
URL_KEYS.fxEnabled = "fxe";
URL_KEYS.fxBloom = "fb";
URL_KEYS.fxChroma = "fc";
URL_KEYS.fxGrain = "fg";
URL_KEYS.fxVignette = "fv";
URL_KEYS.audioEnabled = "ae";
URL_KEYS.audioInput = "ai";
URL_KEYS.audioReactive = "ar";

state.category = "classic";
state.shaderMode = "nebula3d";
state.combo = {
  layerCount: 2,
  layers: [
    { mode: "flow", blend: "source-over", data: null },
    { mode: "aurora", blend: "screen", data: null },
    { mode: "rings", blend: "lighter", data: null },
    { mode: "mosaic", blend: "multiply", data: null }
  ]
};

const presetStore = {
  items: [],
  selectedId: ""
};

const recorderState = {
  mediaRecorder: null,
  chunks: [],
  recordingWebm: false,
  exportingGif: false
};

const audioReactiveState = {
  low: 0,
  mid: 0,
  high: 0,
  volume: 0,
  beat: 0
};

const audioRuntime = {
  context: null,
  analyser: null,
  freqData: null,
  timeData: null,
  mediaElement: null,
  mediaSource: null,
  stream: null,
  streamSource: null,
  uploadedUrl: "",
  routeKey: "",
  prevLow: 0,
  beatCooldown: 0
};

for (const mode of modeDefs) {
  const option = document.createElement("option");
  option.value = mode.id;
  option.textContent = mode.label;
  modeSelect.appendChild(option);

  const comboSelects = [comboMode1Select, comboMode2Select, comboMode3Select, comboMode4Select];
  for (const select of comboSelects) {
    const comboOption = document.createElement("option");
    comboOption.value = mode.id;
    comboOption.textContent = mode.label;
    select.appendChild(comboOption);
  }
}

for (const mode of shaderModeDefs) {
  const option = document.createElement("option");
  option.value = mode.id;
  option.textContent = mode.label;
  shaderModeSelect.appendChild(option);
}

for (const blend of blendDefs) {
  const blendSelects = [comboBlend2Select, comboBlend3Select, comboBlend4Select];
  for (const select of blendSelects) {
    const option = document.createElement("option");
    option.value = blend.id;
    option.textContent = blend.label;
    select.appendChild(option);
  }
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
updateCategoryUI();
updateHistoryUI();
loadPresetStore();
refreshPresetSelect();
updateRecordStatus("Recorder idle");
setAudioLevelText();
updateAudioStatus("Audio reactive off");
updateAudioUiVisibility();

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

function hexToRgb01(hex) {
  const [r, g, b] = hexToRgb(hex);
  return [r / 255, g / 255, b / 255];
}

function withAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function paletteAt(index) {
  const p = palettes[state.paletteName];
  return p[clamp(index, 0, p.length - 1)];
}

function baseBackgroundColor() {
  return state.baseTone === "white" ? "#ffffff" : paletteAt(0);
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

function audioDensityFactor() {
  return window.GGAudioReactiveCore.factors(audioReactiveState, state.audio.enabled, state.audio.reactivity).density;
}

function audioSpeedFactor() {
  return window.GGAudioReactiveCore.factors(audioReactiveState, state.audio.enabled, state.audio.reactivity).speed;
}

function audioLineFactor() {
  return window.GGAudioReactiveCore.factors(audioReactiveState, state.audio.enabled, state.audio.reactivity).line;
}

function speedScale(value) {
  return value * state.params.speed * audioSpeedFactor();
}

function lineScale(value) {
  return value * state.params.lineWidth * audioLineFactor();
}

function applyPaletteToUI() {
  const p = palettes[state.paletteName];
  if (state.baseTone === "white") {
    document.documentElement.style.setProperty("--bg-cream", "#ffffff");
    document.documentElement.style.setProperty("--bg-sand", "#ffffff");
  } else {
    document.documentElement.style.setProperty("--bg-cream", p[0]);
    document.documentElement.style.setProperty("--bg-sand", "#e8dcc5");
  }
  document.documentElement.style.setProperty("--accent", p[1]);
  document.documentElement.style.setProperty("--accent-soft", p[3]);
}

function clearWithAlpha(alpha) {
  const pulse = state.audio.enabled ? audioReactiveState.beat * 0.035 + audioReactiveState.volume * 0.015 : 0;
  ctx.fillStyle = withAlpha(baseBackgroundColor(), clamp(alpha + pulse, 0, 1));
  ctx.fillRect(0, 0, width, height);
}

function getMode(modeId = state.mode) {
  return modeMap.get(modeId) || modeDefs[0];
}

function setCanvasVisibility() {
  const shaderActive = state.category === "shader3d";
  canvas.style.display = shaderActive ? "none" : "block";
  glCanvas.style.display = shaderActive ? "block" : "none";
  fxCanvas.style.display = "block";
}

function updateCategoryUI() {
  classicGroup.style.display = state.category === "classic" ? "grid" : "none";
  shaderGroup.style.display = state.category === "shader3d" ? "grid" : "none";
  comboGroup.style.display = state.category === "combo" ? "grid" : "none";
  updateComboLayerUI();
  setCanvasVisibility();
}

function updateComboLayerUI() {
  const count = state.combo.layerCount;
  comboLayer1.style.display = "grid";
  comboLayer2.style.display = count >= 2 ? "grid" : "none";
  comboLayer3.style.display = count >= 3 ? "grid" : "none";
  comboLayer4.style.display = count >= 4 ? "grid" : "none";
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function formatFx(value) {
  return Number(value).toFixed(2);
}

function sanitizeState() {
  if (!["classic", "shader3d", "combo"].includes(state.category)) state.category = "classic";
  if (!modeMap.has(state.mode)) state.mode = modeDefs[0].id;
  if (!shaderModeMap.has(state.shaderMode)) state.shaderMode = shaderModeDefs[0].id;
  state.combo.layerCount = clamp(parseIntSafe(state.combo.layerCount, 2), 2, 4);

  if (!Array.isArray(state.combo.layers) || state.combo.layers.length < 4) {
    const defaults = [
      { mode: modeDefs[0].id, blend: "source-over", data: null },
      { mode: modeDefs[1].id, blend: "screen", data: null },
      { mode: modeDefs[2].id, blend: "lighter", data: null },
      { mode: modeDefs[3].id, blend: "multiply", data: null }
    ];
    state.combo.layers = defaults;
  }

  for (let i = 0; i < 4; i += 1) {
    const layer = state.combo.layers[i];
    if (!modeMap.has(layer.mode)) {
      layer.mode = modeDefs[i % modeDefs.length].id;
    }

    if (i === 0) {
      layer.blend = "source-over";
    } else if (!blendMap.has(layer.blend) || layer.blend === "source-over") {
      layer.blend = blendDefs[0].id;
    }
  }

  if (!palettes[state.paletteName]) state.paletteName = Object.keys(palettes)[0];
  if (!["palette", "white"].includes(state.baseTone)) state.baseTone = "palette";

  state.seed = clamp(Math.floor(parseIntSafe(state.seed, 1)), 1, 9999999);

  for (const key of Object.keys(PARAM_LIMITS)) {
    const rule = PARAM_LIMITS[key];
    const raw = parseNum(state.params[key], 1);
    state.params[key] = clamp(quantize(raw, rule.step), rule.min, rule.max);
  }

  state.post.enabled = Boolean(state.post.enabled);
  state.post.bloom = clamp01(parseNum(state.post.bloom, 0.2));
  state.post.chroma = clamp01(parseNum(state.post.chroma, 0.08));
  state.post.grain = clamp01(parseNum(state.post.grain, 0.1));
  state.post.vignette = clamp01(parseNum(state.post.vignette, 0.15));

  if (!state.audio || typeof state.audio !== "object") {
    state.audio = { enabled: false, input: "demo-beat", reactivity: 1 };
  }
  state.audio.enabled = Boolean(state.audio.enabled);
  if (!AUDIO_INPUT_IDS.includes(state.audio.input)) state.audio.input = "demo-beat";
  state.audio.reactivity = clamp(
    quantize(parseNum(state.audio.reactivity, 1), AUDIO_REACTIVITY.step),
    AUDIO_REACTIVITY.min,
    AUDIO_REACTIVITY.max
  );
}

function snapshotState() {
  return window.GGHistoryStore.createSnapshot(state);
}

function snapshotsEqual(a, b) {
  return window.GGHistoryStore.snapshotsEqual(a, b);
}

function pushHistory(snapshot) {
  window.GGHistoryStore.push(state.history, snapshot, HISTORY_LIMIT);
}

function updateHistoryUI() {
  historyStatus.textContent = `History ${state.history.length}/${HISTORY_LIMIT}`;
  undoBtn.disabled = state.history.length === 0;
}

function updateAudioStatus(text) {
  audioStatus.textContent = text;
}

function updateAudioUiVisibility() {
  const showUpload = state.audio.input === "upload";
  audioFileLabel.style.display = showUpload ? "block" : "none";
  audioFileInput.style.display = showUpload ? "block" : "none";
}

function setAudioLevelText() {
  audioLevel.textContent = window.GGAudioReactiveCore.levelText(audioReactiveState);
}

function resetAudioReactiveState() {
  audioReactiveState.low = 0;
  audioReactiveState.mid = 0;
  audioReactiveState.high = 0;
  audioReactiveState.volume = 0;
  audioReactiveState.beat = 0;
  audioRuntime.prevLow = 0;
  audioRuntime.beatCooldown = 0;
  setAudioLevelText();
}

function ensureAudioContext() {
  if (audioRuntime.context) {
    return true;
  }

  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) {
    updateAudioStatus("Web Audio API not supported");
    return false;
  }

  audioRuntime.context = new Ctx();
  audioRuntime.analyser = audioRuntime.context.createAnalyser();
  audioRuntime.analyser.fftSize = 1024;
  audioRuntime.analyser.smoothingTimeConstant = 0.72;
  audioRuntime.freqData = new Uint8Array(audioRuntime.analyser.frequencyBinCount);
  audioRuntime.timeData = new Uint8Array(audioRuntime.analyser.fftSize);
  return true;
}

function disconnectAudioRouting({ stopStream = true, pauseMedia = true } = {}) {
  if (audioRuntime.mediaSource) {
    try {
      audioRuntime.mediaSource.disconnect();
    } catch {}
  }

  if (audioRuntime.streamSource) {
    try {
      audioRuntime.streamSource.disconnect();
    } catch {}
    audioRuntime.streamSource = null;
  }

  if (pauseMedia && audioRuntime.mediaElement) {
    audioRuntime.mediaElement.pause();
  }

  if (stopStream && audioRuntime.stream) {
    for (const track of audioRuntime.stream.getTracks()) {
      track.stop();
    }
    audioRuntime.stream = null;
  }
}

async function connectMediaAudio(srcUrl, label, loop = true) {
  if (!ensureAudioContext()) {
    return;
  }

  disconnectAudioRouting({ stopStream: true, pauseMedia: true });

  if (!audioRuntime.mediaElement) {
    const media = new Audio();
    media.preload = "auto";
    audioRuntime.mediaElement = media;
  }

  if (!audioRuntime.mediaSource) {
    audioRuntime.mediaSource = audioRuntime.context.createMediaElementSource(audioRuntime.mediaElement);
  }

  const absoluteSrc = new URL(srcUrl, window.location.href).href;
  if (audioRuntime.mediaElement.src !== absoluteSrc) {
    audioRuntime.mediaElement.src = srcUrl;
  }
  audioRuntime.mediaElement.loop = loop;
  audioRuntime.mediaSource.connect(audioRuntime.analyser);
  audioRuntime.mediaSource.connect(audioRuntime.context.destination);
  await audioRuntime.context.resume();
  await audioRuntime.mediaElement.play();
  updateAudioStatus(`Audio reactive on (${label})`);
}

async function connectMicrophoneAudio() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    updateAudioStatus("Microphone not supported");
    return;
  }

  if (!ensureAudioContext()) {
    return;
  }

  disconnectAudioRouting({ stopStream: true, pauseMedia: true });
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioRuntime.stream = stream;
  audioRuntime.streamSource = audioRuntime.context.createMediaStreamSource(stream);
  audioRuntime.streamSource.connect(audioRuntime.analyser);
  await audioRuntime.context.resume();
  updateAudioStatus("Audio reactive on (Microphone)");
}

async function syncAudioSourceFromState(force = false) {
  updateAudioUiVisibility();
  const desiredKey = state.audio.enabled
    ? `${state.audio.input}:${state.audio.input === "upload" ? audioRuntime.uploadedUrl : "builtin"}`
    : "off";

  if (!force && desiredKey === audioRuntime.routeKey) {
    return;
  }

  if (!state.audio.enabled) {
    disconnectAudioRouting({ stopStream: true, pauseMedia: true });
    audioRuntime.routeKey = "off";
    resetAudioReactiveState();
    updateAudioStatus("Audio reactive off");
    return;
  }

  try {
    if (state.audio.input === "mic") {
      await connectMicrophoneAudio();
      audioRuntime.routeKey = desiredKey;
      return;
    }

    if (state.audio.input === "upload") {
      if (!audioRuntime.uploadedUrl) {
        disconnectAudioRouting({ stopStream: true, pauseMedia: true });
        resetAudioReactiveState();
        audioRuntime.routeKey = desiredKey;
        updateAudioStatus("Select an audio file to start");
        return;
      }

      await connectMediaAudio(audioRuntime.uploadedUrl, "Upload", true);
      audioRuntime.routeKey = desiredKey;
      return;
    }

    const demoFile = AUDIO_DEMO_FILES[state.audio.input];
    if (!demoFile) {
      throw new Error("Invalid audio input");
    }

    const label = audioInputSelect.options[audioInputSelect.selectedIndex]?.textContent || "Demo";
    await connectMediaAudio(demoFile, label, true);
    audioRuntime.routeKey = desiredKey;
  } catch (error) {
    audioRuntime.routeKey = "";
    disconnectAudioRouting({ stopStream: true, pauseMedia: true });
    resetAudioReactiveState();
    updateAudioStatus("Audio start failed (check permissions)");
    console.error("audio sync error:", error);
  }
}

function averageBand(data, start, end) {
  const from = clamp(Math.floor(start), 0, data.length - 1);
  const to = clamp(Math.floor(end), from + 1, data.length);
  let sum = 0;
  for (let i = from; i < to; i += 1) {
    sum += data[i];
  }
  return (sum / Math.max(1, to - from)) / 255;
}

function updateAudioReactiveState() {
  if (!state.audio.enabled || !audioRuntime.analyser || !audioRuntime.freqData || !audioRuntime.timeData) {
    audioReactiveState.low *= 0.92;
    audioReactiveState.mid *= 0.92;
    audioReactiveState.high *= 0.92;
    audioReactiveState.volume *= 0.9;
    audioReactiveState.beat *= 0.84;
    if (state.frame % 8 === 0) {
      setAudioLevelText();
    }
    return;
  }

  audioRuntime.analyser.getByteFrequencyData(audioRuntime.freqData);
  audioRuntime.analyser.getByteTimeDomainData(audioRuntime.timeData);

  const freqLen = audioRuntime.freqData.length;
  const low = averageBand(audioRuntime.freqData, 0, freqLen * 0.14);
  const mid = averageBand(audioRuntime.freqData, freqLen * 0.14, freqLen * 0.5);
  const high = averageBand(audioRuntime.freqData, freqLen * 0.5, freqLen);

  let sq = 0;
  for (let i = 0; i < audioRuntime.timeData.length; i += 1) {
    const normalized = (audioRuntime.timeData[i] - 128) / 128;
    sq += normalized * normalized;
  }
  const volume = Math.sqrt(sq / audioRuntime.timeData.length);

  const lowRise = low - audioRuntime.prevLow;
  const beatThreshold = 0.08 + volume * 0.14;
  let beat = 0;
  if (audioRuntime.beatCooldown > 0) {
    audioRuntime.beatCooldown -= 1;
  } else if (lowRise > beatThreshold && low > 0.16) {
    beat = 1;
    audioRuntime.beatCooldown = 8;
  }

  audioRuntime.prevLow = audioRuntime.prevLow * 0.72 + low * 0.28;
  audioReactiveState.low = audioReactiveState.low * 0.78 + low * 0.22;
  audioReactiveState.mid = audioReactiveState.mid * 0.78 + mid * 0.22;
  audioReactiveState.high = audioReactiveState.high * 0.78 + high * 0.22;
  audioReactiveState.volume = audioReactiveState.volume * 0.75 + volume * 0.25;
  audioReactiveState.beat = Math.max(beat, audioReactiveState.beat * 0.82);

  if (state.frame % 6 === 0) {
    setAudioLevelText();
  }
}

function defaultPresetName() {
  const now = new Date();
  const stamp = now.toISOString().replace("T", " ").slice(0, 16);
  return `Preset ${stamp}`;
}

function loadPresetStore() {
  presetStore.items = window.GGPresetStore.load(PRESET_STORAGE_KEY, PRESET_LIMIT);
  presetStore.selectedId = presetStore.items[0]?.id || "";
}

function persistPresetStore() {
  window.GGPresetStore.persist(PRESET_STORAGE_KEY, presetStore.items, PRESET_LIMIT);
}

function refreshPresetSelect() {
  const currentSelected = presetStore.selectedId;
  presetSelect.innerHTML = "";

  if (presetStore.items.length === 0) {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "No presets saved";
    presetSelect.appendChild(empty);
    presetSelect.value = "";
    applyPresetBtn.disabled = true;
    deletePresetBtn.disabled = true;
    return;
  }

  for (const item of presetStore.items) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    presetSelect.appendChild(option);
  }

  presetStore.selectedId = presetStore.items.some((item) => item.id === currentSelected)
    ? currentSelected
    : presetStore.items[0].id;
  presetSelect.value = presetStore.selectedId;
  applyPresetBtn.disabled = false;
  deletePresetBtn.disabled = false;
}

function findPresetById(id) {
  return presetStore.items.find((item) => item.id === id) || null;
}

function saveCurrentPreset() {
  const rawName = (presetNameInput.value || "").trim();
  const name = rawName || defaultPresetName();
  const existingIndex = presetStore.items.findIndex((item) => item.name === name);
  const entry = {
    id: existingIndex >= 0 ? presetStore.items[existingIndex].id : `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name,
    snapshot: snapshotState(),
    thumbnail: captureThumbnailDataUrl(),
    updatedAt: Date.now()
  };

  presetStore.items = window.GGPresetStore.upsert(presetStore.items, entry, PRESET_LIMIT);
  presetStore.selectedId = entry.id;
  persistPresetStore();
  refreshPresetSelect();
  presetNameInput.value = "";
  flashButton(savePresetBtn, "Saved", "Save Preset");
}

function applySelectedPreset() {
  const selected = findPresetById(presetSelect.value);
  if (!selected) {
    return;
  }

  commitChange(() => {
    setStateFromSnapshot(selected.snapshot);
  });
}

function deleteSelectedPreset() {
  const selectedId = presetSelect.value;
  if (!selectedId) {
    return;
  }

  presetStore.items = window.GGPresetStore.remove(presetStore.items, selectedId);
  presetStore.selectedId = presetStore.items[0]?.id || "";
  persistPresetStore();
  refreshPresetSelect();
  flashButton(deletePresetBtn, "Deleted", "Delete Preset");
}

function setStateFromSnapshot(snapshot) {
  state.category = snapshot.category || "classic";
  state.mode = snapshot.mode || state.mode;
  state.shaderMode = snapshot.shaderMode || state.shaderMode;
  if (snapshot.combo?.layerCount) {
    state.combo.layerCount = snapshot.combo.layerCount;
  }
  if (Array.isArray(snapshot.combo?.layers)) {
    for (let i = 0; i < Math.min(4, snapshot.combo.layers.length); i += 1) {
      state.combo.layers[i].mode = snapshot.combo.layers[i].mode || state.combo.layers[i].mode;
      state.combo.layers[i].blend = snapshot.combo.layers[i].blend || state.combo.layers[i].blend;
    }
  }
  state.paletteName = snapshot.paletteName || state.paletteName;
  state.baseTone = snapshot.baseTone ?? "palette";
  state.seed = snapshot.seed || state.seed;
  state.params.density = snapshot.params?.density ?? state.params.density;
  state.params.speed = snapshot.params?.speed ?? state.params.speed;
  state.params.lineWidth = snapshot.params?.lineWidth ?? state.params.lineWidth;
  state.post.enabled = snapshot.post?.enabled ?? state.post.enabled;
  state.post.bloom = snapshot.post?.bloom ?? state.post.bloom;
  state.post.chroma = snapshot.post?.chroma ?? state.post.chroma;
  state.post.grain = snapshot.post?.grain ?? state.post.grain;
  state.post.vignette = snapshot.post?.vignette ?? state.post.vignette;
  state.audio.enabled = snapshot.audio?.enabled ?? false;
  state.audio.input = snapshot.audio?.input ?? "demo-beat";
  state.audio.reactivity = snapshot.audio?.reactivity ?? 1;
  sanitizeState();
}

function syncControlsFromState() {
  categorySelect.value = state.category;
  modeSelect.value = state.mode;
  shaderModeSelect.value = state.shaderMode;
  comboLayerCountSelect.value = String(state.combo.layerCount);
  comboMode1Select.value = state.combo.layers[0].mode;
  comboMode2Select.value = state.combo.layers[1].mode;
  comboMode3Select.value = state.combo.layers[2].mode;
  comboMode4Select.value = state.combo.layers[3].mode;
  comboBlend2Select.value = state.combo.layers[1].blend;
  comboBlend3Select.value = state.combo.layers[2].blend;
  comboBlend4Select.value = state.combo.layers[3].blend;
  paletteSelect.value = state.paletteName;
  baseToneSelect.value = state.baseTone;
  seedInput.value = String(state.seed);
  densityRange.value = String(state.params.density);
  speedRange.value = String(state.params.speed);
  lineWidthRange.value = String(state.params.lineWidth);
  fxEnabled.checked = state.post.enabled;
  fxBloomRange.value = String(state.post.bloom);
  fxChromaRange.value = String(state.post.chroma);
  fxGrainRange.value = String(state.post.grain);
  fxVignetteRange.value = String(state.post.vignette);
  audioEnabled.checked = state.audio.enabled;
  audioInputSelect.value = state.audio.input;
  audioReactivityRange.value = String(state.audio.reactivity);

  densityValue.textContent = formatMult(state.params.density);
  speedValue.textContent = formatMult(state.params.speed);
  lineWidthValue.textContent = formatMult(state.params.lineWidth);
  fxBloomValue.textContent = formatFx(state.post.bloom);
  fxChromaValue.textContent = formatFx(state.post.chroma);
  fxGrainValue.textContent = formatFx(state.post.grain);
  fxVignetteValue.textContent = formatFx(state.post.vignette);
  audioReactivityValue.textContent = formatMult(state.audio.reactivity);
  updateCategoryUI();
  updateAudioUiVisibility();
}

function syncUrlFromState() {
  const url = new URL(window.location.href);
  const qs = window.GGUrlSync;
  qs.set(url, URL_KEYS.category, state.category);
  qs.set(url, URL_KEYS.mode, state.mode);
  qs.set(url, URL_KEYS.shaderMode, state.shaderMode);
  qs.set(url, URL_KEYS.comboLayerCount, String(state.combo.layerCount));
  qs.set(url, URL_KEYS.comboMode1, state.combo.layers[0].mode);
  qs.set(url, URL_KEYS.comboMode2, state.combo.layers[1].mode);
  qs.set(url, URL_KEYS.comboMode3, state.combo.layers[2].mode);
  qs.set(url, URL_KEYS.comboMode4, state.combo.layers[3].mode);
  qs.set(url, URL_KEYS.comboBlend2, state.combo.layers[1].blend);
  qs.set(url, URL_KEYS.comboBlend3, state.combo.layers[2].blend);
  qs.set(url, URL_KEYS.comboBlend4, state.combo.layers[3].blend);
  qs.set(url, URL_KEYS.palette, state.paletteName);
  qs.set(url, URL_KEYS.baseTone, state.baseTone);
  qs.set(url, URL_KEYS.seed, String(state.seed));
  qs.set(url, URL_KEYS.density, trimFloat(state.params.density));
  qs.set(url, URL_KEYS.speed, trimFloat(state.params.speed));
  qs.set(url, URL_KEYS.lineWidth, trimFloat(state.params.lineWidth));
  qs.set(url, URL_KEYS.fxEnabled, state.post.enabled ? "1" : "0");
  qs.set(url, URL_KEYS.fxBloom, trimFloat(state.post.bloom));
  qs.set(url, URL_KEYS.fxChroma, trimFloat(state.post.chroma));
  qs.set(url, URL_KEYS.fxGrain, trimFloat(state.post.grain));
  qs.set(url, URL_KEYS.fxVignette, trimFloat(state.post.vignette));
  qs.set(url, URL_KEYS.audioEnabled, state.audio.enabled ? "1" : "0");
  qs.set(url, URL_KEYS.audioInput, state.audio.input);
  qs.set(url, URL_KEYS.audioReactive, trimFloat(state.audio.reactivity));
  window.history.replaceState(null, "", url);
}

function applyStateFromUrl() {
  const url = new URL(window.location.href);
  const qs = window.GGUrlSync;
  const categoryParam = qs.get(url, URL_KEYS.category);
  const modeParam = qs.get(url, URL_KEYS.mode);
  const shaderModeParam = qs.get(url, URL_KEYS.shaderMode);
  const comboLayerCountParam = qs.get(url, URL_KEYS.comboLayerCount);
  const comboMode1Param = qs.get(url, URL_KEYS.comboMode1);
  const comboMode2Param = qs.get(url, URL_KEYS.comboMode2);
  const comboMode3Param = qs.get(url, URL_KEYS.comboMode3);
  const comboMode4Param = qs.get(url, URL_KEYS.comboMode4);
  const comboBlend2Param = qs.get(url, URL_KEYS.comboBlend2);
  const comboBlend3Param = qs.get(url, URL_KEYS.comboBlend3);
  const comboBlend4Param = qs.get(url, URL_KEYS.comboBlend4);
  const paletteParam = qs.get(url, URL_KEYS.palette);
  const baseToneParam = qs.get(url, URL_KEYS.baseTone);
  const seedParam = qs.get(url, URL_KEYS.seed);
  const densityParam = qs.get(url, URL_KEYS.density);
  const speedParam = qs.get(url, URL_KEYS.speed);
  const lineWidthParam = qs.get(url, URL_KEYS.lineWidth);
  const fxEnabledParam = qs.get(url, URL_KEYS.fxEnabled);
  const fxBloomParam = qs.get(url, URL_KEYS.fxBloom);
  const fxChromaParam = qs.get(url, URL_KEYS.fxChroma);
  const fxGrainParam = qs.get(url, URL_KEYS.fxGrain);
  const fxVignetteParam = qs.get(url, URL_KEYS.fxVignette);
  const audioEnabledParam = qs.get(url, URL_KEYS.audioEnabled);
  const audioInputParam = qs.get(url, URL_KEYS.audioInput);
  const audioReactiveParam = qs.get(url, URL_KEYS.audioReactive);

  if (categoryParam) {
    state.category = categoryParam;
  }

  if (modeParam && modeMap.has(modeParam)) {
    state.mode = modeParam;
  }

  if (shaderModeParam && shaderModeMap.has(shaderModeParam)) {
    state.shaderMode = shaderModeParam;
  }

  if (comboLayerCountParam) {
    state.combo.layerCount = parseIntSafe(comboLayerCountParam, state.combo.layerCount);
  }

  if (comboMode1Param && modeMap.has(comboMode1Param)) {
    state.combo.layers[0].mode = comboMode1Param;
  }

  if (comboMode2Param && modeMap.has(comboMode2Param)) {
    state.combo.layers[1].mode = comboMode2Param;
  }

  if (comboMode3Param && modeMap.has(comboMode3Param)) {
    state.combo.layers[2].mode = comboMode3Param;
  }

  if (comboMode4Param && modeMap.has(comboMode4Param)) {
    state.combo.layers[3].mode = comboMode4Param;
  }

  if (comboBlend2Param && blendMap.has(comboBlend2Param)) {
    state.combo.layers[1].blend = comboBlend2Param;
  }

  if (comboBlend3Param && blendMap.has(comboBlend3Param)) {
    state.combo.layers[2].blend = comboBlend3Param;
  }

  if (comboBlend4Param && blendMap.has(comboBlend4Param)) {
    state.combo.layers[3].blend = comboBlend4Param;
  }

  if (paletteParam && palettes[paletteParam]) {
    state.paletteName = paletteParam;
  }

  if (baseToneParam && ["palette", "white"].includes(baseToneParam)) {
    state.baseTone = baseToneParam;
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

  if (fxEnabledParam !== null) {
    state.post.enabled = fxEnabledParam === "1";
  }

  if (fxBloomParam !== null) {
    state.post.bloom = parseNum(fxBloomParam, state.post.bloom);
  }

  if (fxChromaParam !== null) {
    state.post.chroma = parseNum(fxChromaParam, state.post.chroma);
  }

  if (fxGrainParam !== null) {
    state.post.grain = parseNum(fxGrainParam, state.post.grain);
  }

  if (fxVignetteParam !== null) {
    state.post.vignette = parseNum(fxVignetteParam, state.post.vignette);
  }

  if (audioEnabledParam !== null) {
    state.audio.enabled = audioEnabledParam === "1";
  }

  if (audioInputParam && AUDIO_INPUT_IDS.includes(audioInputParam)) {
    state.audio.input = audioInputParam;
  }

  if (audioReactiveParam !== null) {
    state.audio.reactivity = parseNum(audioReactiveParam, state.audio.reactivity);
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
  } else {
    drawPostFXOverlay();
    composeCaptureCanvas();
  }

  if (options.syncUrl !== false) {
    syncUrlFromState();
  }

  void syncAudioSourceFromState();
  updateHistoryUI();
}

function buildModeData(modeId, seedValue) {
  const prevData = state.data;
  const prevRand = state.rand;
  const rand = mulberry32(seedValue);
  getMode(modeId).build(rand);
  const data = state.data;
  state.data = prevData;
  state.rand = prevRand;
  return data;
}

function drawModeWithData(modeId, data, targetCtx) {
  const prevCtx = ctx;
  const prevData = state.data;
  ctx = targetCtx;
  state.data = data;
  getMode(modeId).draw();
  state.data = prevData;
  ctx = prevCtx;
}

function drawComboFrame() {
  const count = state.combo.layerCount;
  for (let i = 0; i < count; i += 1) {
    const layer = state.combo.layers[i];
    drawModeWithData(layer.mode, layer.data, comboLayers[i].ctx);
  }

  baseCtx2d.save();
  baseCtx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  baseCtx2d.clearRect(0, 0, width, height);
  for (let i = 0; i < count; i += 1) {
    const layer = state.combo.layers[i];
    baseCtx2d.globalCompositeOperation = i === 0 ? "source-over" : layer.blend;
    baseCtx2d.globalAlpha = i === 0 ? 1 : 0.84;
    baseCtx2d.drawImage(comboLayers[i].canvas, 0, 0, width, height);
  }
  baseCtx2d.globalCompositeOperation = "source-over";
  baseCtx2d.globalAlpha = 1;
  baseCtx2d.restore();
}

function regenerateComboData() {
  for (let i = 0; i < state.combo.layerCount; i += 1) {
    state.combo.layers[i].data = buildModeData(state.combo.layers[i].mode, state.seed + i * 7919);
  }

  for (const layer of comboLayers) {
    layer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layer.ctx.fillStyle = baseBackgroundColor();
    layer.ctx.fillRect(0, 0, width, height);
  }
  baseCtx2d.fillStyle = baseBackgroundColor();
  baseCtx2d.fillRect(0, 0, width, height);
}

function compileShader(glCtx, type, source) {
  const shader = glCtx.createShader(type);
  glCtx.shaderSource(shader, source);
  glCtx.compileShader(shader);
  if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
    const error = glCtx.getShaderInfoLog(shader);
    glCtx.deleteShader(shader);
    throw new Error(error || "shader compile failed");
  }
  return shader;
}

function createShaderProgram(glCtx, vertexSource, fragmentSource) {
  const vertex = compileShader(glCtx, glCtx.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(glCtx, glCtx.FRAGMENT_SHADER, fragmentSource);
  const program = glCtx.createProgram();
  glCtx.attachShader(program, vertex);
  glCtx.attachShader(program, fragment);
  glCtx.linkProgram(program);
  glCtx.deleteShader(vertex);
  glCtx.deleteShader(fragment);
  if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
    const error = glCtx.getProgramInfoLog(program);
    glCtx.deleteProgram(program);
    throw new Error(error || "program link failed");
  }
  return program;
}

function initShaderRenderer() {
  if (shaderState.ready || shaderState.failed) {
    return shaderState.ready;
  }

  const glCtx = glCanvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: true });
  if (!glCtx) {
    shaderState.failed = true;
    return false;
  }

  const vertexSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uSeed;
    uniform float uDensity;
    uniform float uSpeed;
    uniform float uLine;
    uniform int uMode;
    uniform vec3 uPalette[5];

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    vec3 palette(float t) {
      t = clamp(t, 0.0, 1.0);
      if (t < 0.25) return mix(uPalette[0], uPalette[1], t / 0.25);
      if (t < 0.5) return mix(uPalette[1], uPalette[2], (t - 0.25) / 0.25);
      if (t < 0.75) return mix(uPalette[2], uPalette[3], (t - 0.5) / 0.25);
      return mix(uPalette[3], uPalette[4], (t - 0.75) / 0.25);
    }

    mat2 rot(float a) {
      float c = cos(a);
      float s = sin(a);
      return mat2(c, -s, s, c);
    }

    float nebula(vec2 uv) {
      vec2 p = uv * rot(uTime * 0.07);
      float d = length(p);
      float n = noise(p * (2.5 + uDensity * 1.2) + uSeed * 0.01);
      float fog = sin((d * 10.0 - uTime * 1.2 * uSpeed) + n * 6.0);
      float glow = exp(-d * (1.8 + uLine * 0.6));
      return clamp(0.5 + 0.35 * fog + glow * 0.9, 0.0, 1.0);
    }

    float tunnel(vec2 uv) {
      vec2 p = uv * rot(uTime * 0.03 + noise(uv * 2.0 + uSeed * 0.01) * 1.2);
      float r = max(length(p), 0.001);
      vec2 dir = p / r;
      float lane = sin(14.0 / r - uTime * 2.0 * uSpeed + dir.x * (6.5 + uDensity * 2.4) + dir.y * 4.1);
      float rip = noise(dir * (2.5 + uDensity) + vec2(8.0 / r + uTime * 0.6, uSeed * 0.03));
      float rim = smoothstep(0.9, 0.02, r);
      return clamp(0.4 + lane * 0.25 + rip * 0.35 + rim * 0.3, 0.0, 1.0);
    }

    float metaball(vec2 uv) {
      float t = uTime * 0.35 * uSpeed;
      float sum = 0.0;
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        vec2 c = vec2(sin(t * (0.9 + fi * 0.13) + fi * 1.9), cos(t * (1.1 + fi * 0.1) + fi * 1.4));
        c *= 0.65;
        float radius = 0.05 + 0.09 * (0.5 + 0.5 * sin(fi + uSeed * 0.05));
        float d = length(uv - c);
        sum += radius / max(d, 0.008);
      }
      float field = smoothstep(0.95, 1.75 + uDensity * 0.35, sum);
      float veins = sin(sum * (2.4 + uLine) - t * 2.0);
      return clamp(field * 0.75 + veins * 0.15 + 0.25, 0.0, 1.0);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
      float v = 0.0;
      if (uMode == 0) v = nebula(uv);
      else if (uMode == 1) v = tunnel(uv);
      else v = metaball(uv);

      vec3 col = palette(v);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  try {
    const program = createShaderProgram(glCtx, vertexSource, fragmentSource);
    const buffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buffer);
    glCtx.bufferData(
      glCtx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      glCtx.STATIC_DRAW
    );

    shaderState.gl = glCtx;
    shaderState.program = program;
    shaderState.buffer = buffer;
    shaderState.position = glCtx.getAttribLocation(program, "aPosition");
    shaderState.uniforms = {
      resolution: glCtx.getUniformLocation(program, "uResolution"),
      time: glCtx.getUniformLocation(program, "uTime"),
      seed: glCtx.getUniformLocation(program, "uSeed"),
      density: glCtx.getUniformLocation(program, "uDensity"),
      speed: glCtx.getUniformLocation(program, "uSpeed"),
      line: glCtx.getUniformLocation(program, "uLine"),
      mode: glCtx.getUniformLocation(program, "uMode"),
      palette0: glCtx.getUniformLocation(program, "uPalette[0]"),
      palette1: glCtx.getUniformLocation(program, "uPalette[1]"),
      palette2: glCtx.getUniformLocation(program, "uPalette[2]"),
      palette3: glCtx.getUniformLocation(program, "uPalette[3]"),
      palette4: glCtx.getUniformLocation(program, "uPalette[4]")
    };
    shaderState.ready = true;
    shaderState.failed = false;
    return true;
  } catch {
    shaderState.failed = true;
    return false;
  }
}

function shaderModeIndex(modeId) {
  if (modeId === "tunnel3d") return 1;
  if (modeId === "metaball3d") return 2;
  return 0;
}

function drawShaderFrame() {
  if (!initShaderRenderer()) {
    commitChange(() => {
      state.category = "classic";
    }, { saveHistory: false });
    return;
  }

  const glCtx = shaderState.gl;
  glCtx.viewport(0, 0, glCanvas.width, glCanvas.height);
  glCtx.useProgram(shaderState.program);
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, shaderState.buffer);
  glCtx.enableVertexAttribArray(shaderState.position);
  glCtx.vertexAttribPointer(shaderState.position, 2, glCtx.FLOAT, false, 0, 0);

  const p = palettes[state.paletteName];
  const p0 = hexToRgb01(baseBackgroundColor());
  const p1 = hexToRgb01(p[1]);
  const p2 = hexToRgb01(p[2]);
  const p3 = hexToRgb01(p[3]);
  const p4 = hexToRgb01(p[4]);

  glCtx.uniform2f(shaderState.uniforms.resolution, glCanvas.width, glCanvas.height);
  glCtx.uniform1f(shaderState.uniforms.time, state.frame * 0.016);
  glCtx.uniform1f(shaderState.uniforms.seed, state.seed);
  glCtx.uniform1f(shaderState.uniforms.density, state.params.density * audioDensityFactor());
  glCtx.uniform1f(shaderState.uniforms.speed, state.params.speed * audioSpeedFactor());
  glCtx.uniform1f(shaderState.uniforms.line, state.params.lineWidth * audioLineFactor());
  glCtx.uniform1i(shaderState.uniforms.mode, shaderModeIndex(state.shaderMode));
  glCtx.uniform3f(shaderState.uniforms.palette0, p0[0], p0[1], p0[2]);
  glCtx.uniform3f(shaderState.uniforms.palette1, p1[0], p1[1], p1[2]);
  glCtx.uniform3f(shaderState.uniforms.palette2, p2[0], p2[1], p2[2]);
  glCtx.uniform3f(shaderState.uniforms.palette3, p3[0], p3[1], p3[2]);
  glCtx.uniform3f(shaderState.uniforms.palette4, p4[0], p4[1], p4[2]);
  glCtx.drawArrays(glCtx.TRIANGLES, 0, 6);
}

function activeDisplayCanvas() {
  return state.category === "shader3d" ? glCanvas : canvas;
}

function initGrainWorker() {
  if (grainWorkerState.worker || typeof Worker === "undefined") {
    return;
  }

  try {
    const worker = new Worker("workers/grain-worker.js");
    worker.onmessage = (event) => {
      const widthVal = event.data.width;
      const heightVal = event.data.height;
      const pixels = new Uint8ClampedArray(event.data.pixels);
      grainWorkerState.latest = new ImageData(pixels, widthVal, heightVal);
      grainWorkerState.pending = false;
    };
    worker.onerror = () => {
      grainWorkerState.pending = false;
    };
    grainWorkerState.worker = worker;
  } catch {
    grainWorkerState.worker = null;
  }
}

function requestGrainFrame() {
  if (!grainWorkerState.worker || grainWorkerState.pending) {
    return;
  }
  grainWorkerState.pending = true;
  grainWorkerState.worker.postMessage({
    width: grainCanvas.width,
    height: grainCanvas.height,
    seed: Math.floor(Math.random() * 0xffffffff)
  });
}

function drawGrainTexture() {
  initGrainWorker();

  if (grainWorkerState.worker) {
    if (grainWorkerState.latest) {
      grainCtx.putImageData(grainWorkerState.latest, 0, 0);
      grainWorkerState.latest = null;
    }
    requestGrainFrame();
    return;
  }

  const image = grainCtx.createImageData(grainCanvas.width, grainCanvas.height);
  const arr = image.data;
  for (let i = 0; i < arr.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    arr[i] = v;
    arr[i + 1] = v;
    arr[i + 2] = v;
    arr[i + 3] = 255;
  }
  grainCtx.putImageData(image, 0, 0);
}

function drawPostFXOverlay() {
  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fxCtx.clearRect(0, 0, width, height);
  if (!state.post.enabled) {
    return;
  }

  const source = activeDisplayCanvas();

  if (state.post.bloom > 0.001) {
    fxCtx.save();
    fxCtx.globalCompositeOperation = "screen";
    fxCtx.globalAlpha = 0.03 + state.post.bloom * 0.14;
    fxCtx.filter = `brightness(${1.05 + state.post.bloom * 0.2}) contrast(${1.02 + state.post.bloom * 0.18}) blur(${
      1 + state.post.bloom * 6
    }px)`;
    fxCtx.drawImage(source, 0, 0, width, height);
    fxCtx.filter = "none";
    fxCtx.restore();
  }

  if (state.post.chroma > 0.001) {
    const shift = 0.25 + state.post.chroma * 1.8;
    fxCtx.save();
    fxCtx.globalCompositeOperation = "screen";
    fxCtx.globalAlpha = 0.02 + state.post.chroma * 0.08;
    fxCtx.drawImage(source, -shift, 0, width, height);
    fxCtx.drawImage(source, shift, 0, width, height);
    fxCtx.restore();
  }

  if (state.post.grain > 0.001) {
    drawGrainTexture();
    fxCtx.save();
    fxCtx.globalCompositeOperation = "soft-light";
    fxCtx.globalAlpha = 0.015 + state.post.grain * 0.09;
    fxCtx.drawImage(grainCanvas, 0, 0, width, height);
    fxCtx.restore();
  }

  if (state.post.vignette > 0.001) {
    const gradient = fxCtx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.12,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.7
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0,0,0,${0.05 + state.post.vignette * 0.25})`);
    fxCtx.fillStyle = gradient;
    fxCtx.fillRect(0, 0, width, height);
  }
}

function composeCaptureCanvas() {
  const source = activeDisplayCanvas();
  captureCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  captureCtx.clearRect(0, 0, width, height);
  captureCtx.drawImage(source, 0, 0, width, height);
  if (state.post.enabled) {
    captureCtx.drawImage(fxCanvas, 0, 0, width, height);
  }
}

function captureThumbnailDataUrl() {
  composeCaptureCanvas();
  const thumb = document.createElement("canvas");
  const ratio = width / height;
  const tw = 320;
  const th = Math.floor(tw / Math.max(0.4, ratio));
  thumb.width = tw;
  thumb.height = th;
  const tctx = thumb.getContext("2d", { willReadFrequently: true });
  tctx.drawImage(captureCanvas, 0, 0, tw, th);
  return thumb.toDataURL("image/png", 0.9);
}

function resize() {
  const frame = canvas.parentElement.getBoundingClientRect();
  width = Math.max(320, Math.floor(frame.width));
  height = Math.max(320, Math.floor(frame.height));

  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  glCanvas.width = Math.floor(width * dpr);
  glCanvas.height = Math.floor(height * dpr);
  fxCanvas.width = Math.floor(width * dpr);
  fxCanvas.height = Math.floor(height * dpr);
  captureCanvas.width = Math.floor(width * dpr);
  captureCanvas.height = Math.floor(height * dpr);

  for (const layer of comboLayers) {
    layer.canvas.width = Math.floor(width * dpr);
    layer.canvas.height = Math.floor(height * dpr);
  }

  grainCanvas.width = 256;
  grainCanvas.height = 256;

  baseCtx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  captureCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (const layer of comboLayers) {
    layer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  if (shaderState.ready) {
    shaderState.gl.viewport(0, 0, glCanvas.width, glCanvas.height);
  }

  regenerate();
}

function getRenderPipeline() {
  if (renderPipeline) {
    return renderPipeline;
  }

  renderPipeline = window.GGRenderPipeline.create({
    state,
    beforeRegenerate() {
      state.rand = mulberry32(state.seed);
      applyPaletteToUI();
      baseCtx2d.setLineDash([]);
      baseCtx2d.fillStyle = baseBackgroundColor();
      baseCtx2d.fillRect(0, 0, width, height);
    },
    renderClassicRegenerate() {
      ctx = baseCtx2d;
      getMode(state.mode).build(state.rand);
      getMode(state.mode).draw();
    },
    renderComboRegenerate() {
      regenerateComboData();
      drawComboFrame();
    },
    renderShaderRegenerate() {
      initShaderRenderer();
      drawShaderFrame();
    },
    renderClassicFrame() {
      ctx = baseCtx2d;
      getMode(state.mode).draw();
    },
    renderComboFrame() {
      drawComboFrame();
    },
    renderShaderFrame() {
      drawShaderFrame();
    },
    afterFrame() {
      drawPostFXOverlay();
      composeCaptureCanvas();
    }
  });

  return renderPipeline;
}

function regenerate() {
  getRenderPipeline().regenerate();
}

function tick() {
  updateAudioReactiveState();
  getRenderPipeline().step();
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
  ctx.fillStyle = baseBackgroundColor();
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

function getActiveRenderCanvas() {
  return captureCanvas;
}

function updateRecordStatus(text) {
  recordStatus.textContent = text;
}

function downloadBlob(blob, filename) {
  window.GGExporterCore.downloadBlob(blob, filename);
}

function pickWebmMimeType() {
  return window.GGExporterCore.pickWebmMimeType();
}

function startWebmRecording() {
  if (recorderState.recordingWebm) {
    return;
  }

  if (typeof MediaRecorder === "undefined") {
    updateRecordStatus("MediaRecorder not supported in this browser");
    flashButton(recordWebmBtn, "Not Supported", "Start WebM");
    return;
  }

  const mimeType = pickWebmMimeType();
  if (!mimeType) {
    updateRecordStatus("No supported WebM mime type");
    flashButton(recordWebmBtn, "No WebM Codec", "Start WebM");
    return;
  }

  const stream = getActiveRenderCanvas().captureStream(60);
  recorderState.chunks = [];

  try {
    recorderState.mediaRecorder = new MediaRecorder(stream, { mimeType });
  } catch {
    updateRecordStatus("Failed to start recorder");
    flashButton(recordWebmBtn, "Recorder Error", "Start WebM");
    return;
  }

  recorderState.mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recorderState.chunks.push(event.data);
    }
  };

  recorderState.mediaRecorder.onstop = () => {
    const blob = new Blob(recorderState.chunks, { type: mimeType });
    const modeLabel = state.category === "classic" ? state.mode : state.category === "shader3d" ? state.shaderMode : "combo";
    downloadBlob(blob, `generative-art-${modeLabel}-${state.seed}.webm`);
    recorderState.recordingWebm = false;
    recordWebmBtn.textContent = "Start WebM";
    updateRecordStatus("WebM exported");
    recorderState.chunks = [];
    recorderState.mediaRecorder = null;
    setTimeout(() => updateRecordStatus("Recorder idle"), 1400);
  };

  recorderState.mediaRecorder.start(300);
  recorderState.recordingWebm = true;
  recordWebmBtn.textContent = "Stop WebM";
  updateRecordStatus("Recording WebM...");
}

function stopWebmRecording() {
  if (!recorderState.recordingWebm || !recorderState.mediaRecorder) {
    return;
  }

  recorderState.mediaRecorder.stop();
}

function toggleWebmRecording() {
  if (recorderState.recordingWebm) {
    stopWebmRecording();
  } else {
    startWebmRecording();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exportGifClip() {
  if (recorderState.exportingGif) {
    return;
  }

  if (!window.GIF) {
    updateRecordStatus("GIF library unavailable");
    flashButton(exportGifBtn, "GIF Unavailable", "Export GIF (4s)");
    return;
  }

  recorderState.exportingGif = true;
  exportGifBtn.disabled = true;
  updateRecordStatus("Capturing GIF frames...");

  const source = getActiveRenderCanvas();
  const maxSide = 720;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const gifWidth = Math.max(240, Math.floor(width * scale));
  const gifHeight = Math.max(240, Math.floor(height * scale));
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = gifWidth;
  tempCanvas.height = gifHeight;
  const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });

  const gif = new window.GIF({
    workers: 1,
    quality: 9,
    width: gifWidth,
    height: gifHeight,
    workerScript: "https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.worker.js"
  });

  const frameDelay = Math.floor(1000 / GIF_FPS);
  const frameCount = Math.floor(GIF_DURATION_MS / frameDelay);

  for (let i = 0; i < frameCount; i += 1) {
    tempCtx.drawImage(source, 0, 0, gifWidth, gifHeight);
    const frameData = tempCtx.getImageData(0, 0, gifWidth, gifHeight);
    gif.addFrame(frameData, { delay: frameDelay });
    updateRecordStatus(`Capturing GIF... ${i + 1}/${frameCount}`);
    await sleep(frameDelay);
  }

  updateRecordStatus("Encoding GIF...");
  const blob = await new Promise((resolve, reject) => {
    gif.on("finished", resolve);
    gif.on("abort", () => reject(new Error("gif aborted")));
    gif.on("error", () => reject(new Error("gif error")));
    gif.render();
  }).catch((error) => {
    console.error("GIF export error:", error);
    return null;
  });

  if (blob) {
    const modeLabel = state.category === "classic" ? state.mode : state.category === "shader3d" ? state.shaderMode : "combo";
    downloadBlob(blob, `generative-art-${modeLabel}-${state.seed}.gif`);
    updateRecordStatus("GIF exported");
    setTimeout(() => updateRecordStatus("Recorder idle"), 1500);
  } else {
    updateRecordStatus("GIF export failed");
  }

  recorderState.exportingGif = false;
  exportGifBtn.disabled = false;
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
  const selected = [randCategory, randMode, randBlend, randPalette, randBaseTone, randSeed, randDensity, randSpeed, randLineWidth].some(
    (item) => item.checked
  );

  if (!selected) {
    flashButton(randomBtn, "Select a random attr", "Randomize Selected");
    return;
  }

  commitChange(() => {
    if (randCategory.checked) {
      state.category = randomChoice(["classic", "shader3d", "combo"]);
    }

    if (randMode.checked) {
      if (state.category === "classic") {
        const ids = modeDefs.map((item) => item.id);
        state.mode = randomChoice(ids);
      } else if (state.category === "shader3d") {
        const ids = shaderModeDefs.map((item) => item.id);
        state.shaderMode = randomChoice(ids);
      } else {
        const ids = modeDefs.map((item) => item.id);
        for (let i = 0; i < state.combo.layerCount; i += 1) {
          state.combo.layers[i].mode = randomChoice(ids);
        }
      }
    }

    if (randBlend.checked && state.category === "combo") {
      const blendIds = blendDefs.map((item) => item.id);
      for (let i = 1; i < state.combo.layerCount; i += 1) {
        state.combo.layers[i].blend = randomChoice(blendIds);
      }
    }

    if (randPalette.checked) {
      const names = Object.keys(palettes);
      state.paletteName = randomChoice(names);
    }

    if (randBaseTone.checked) {
      state.baseTone = randomChoice(["palette", "white"]);
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

categorySelect.addEventListener("change", () => {
  commitChange(() => {
    state.category = categorySelect.value;
  });
});

modeSelect.addEventListener("change", () => {
  commitChange(() => {
    state.mode = modeSelect.value;
  });
});

shaderModeSelect.addEventListener("change", () => {
  commitChange(() => {
    state.shaderMode = shaderModeSelect.value;
  });
});

comboLayerCountSelect.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layerCount = parseIntSafe(comboLayerCountSelect.value, state.combo.layerCount);
  });
});

comboMode1Select.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layers[0].mode = comboMode1Select.value;
  });
});

comboMode2Select.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layers[1].mode = comboMode2Select.value;
  });
});

comboMode3Select.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layers[2].mode = comboMode3Select.value;
  });
});

comboMode4Select.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layers[3].mode = comboMode4Select.value;
  });
});

comboBlend2Select.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layers[1].blend = comboBlend2Select.value;
  });
});

comboBlend3Select.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layers[2].blend = comboBlend3Select.value;
  });
});

comboBlend4Select.addEventListener("change", () => {
  commitChange(() => {
    state.combo.layers[3].blend = comboBlend4Select.value;
  });
});

paletteSelect.addEventListener("change", () => {
  commitChange(() => {
    state.paletteName = paletteSelect.value;
  });
});

baseToneSelect.addEventListener("change", () => {
  commitChange(() => {
    state.baseTone = baseToneSelect.value;
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

fxBloomRange.addEventListener("input", () => {
  fxBloomValue.textContent = formatFx(parseNum(fxBloomRange.value, state.post.bloom));
});

fxChromaRange.addEventListener("input", () => {
  fxChromaValue.textContent = formatFx(parseNum(fxChromaRange.value, state.post.chroma));
});

fxGrainRange.addEventListener("input", () => {
  fxGrainValue.textContent = formatFx(parseNum(fxGrainRange.value, state.post.grain));
});

fxVignetteRange.addEventListener("input", () => {
  fxVignetteValue.textContent = formatFx(parseNum(fxVignetteRange.value, state.post.vignette));
});

audioReactivityRange.addEventListener("input", () => {
  audioReactivityValue.textContent = formatMult(parseNum(audioReactivityRange.value, state.audio.reactivity));
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

fxEnabled.addEventListener("change", () => {
  commitChange(() => {
    state.post.enabled = fxEnabled.checked;
  }, { regenerate: false });
});

fxBloomRange.addEventListener("change", () => {
  commitChange(() => {
    state.post.bloom = parseNum(fxBloomRange.value, state.post.bloom);
  }, { regenerate: false });
});

fxChromaRange.addEventListener("change", () => {
  commitChange(() => {
    state.post.chroma = parseNum(fxChromaRange.value, state.post.chroma);
  }, { regenerate: false });
});

fxGrainRange.addEventListener("change", () => {
  commitChange(() => {
    state.post.grain = parseNum(fxGrainRange.value, state.post.grain);
  }, { regenerate: false });
});

fxVignetteRange.addEventListener("change", () => {
  commitChange(() => {
    state.post.vignette = parseNum(fxVignetteRange.value, state.post.vignette);
  }, { regenerate: false });
});

audioEnabled.addEventListener("change", () => {
  commitChange(() => {
    state.audio.enabled = audioEnabled.checked;
  }, { regenerate: false });
});

audioInputSelect.addEventListener("change", () => {
  commitChange(() => {
    state.audio.input = audioInputSelect.value;
  }, { regenerate: false });
});

audioReactivityRange.addEventListener("change", () => {
  commitChange(() => {
    state.audio.reactivity = parseNum(audioReactivityRange.value, state.audio.reactivity);
  }, { regenerate: false });
});

audioFileInput.addEventListener("change", () => {
  const file = audioFileInput.files && audioFileInput.files[0];
  if (!file) {
    return;
  }

  if (audioRuntime.uploadedUrl) {
    URL.revokeObjectURL(audioRuntime.uploadedUrl);
  }
  audioRuntime.uploadedUrl = URL.createObjectURL(file);

  commitChange(() => {
    state.audio.input = "upload";
  }, { regenerate: false });
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
  void syncAudioSourceFromState();
  updateHistoryUI();
});

pauseBtn.addEventListener("click", () => {
  state.running = !state.running;
  pauseBtn.textContent = state.running ? "Pause" : "Resume";
});

downloadBtn.addEventListener("click", () => {
  const modeLabel = state.category === "classic" ? state.mode : state.category === "shader3d" ? state.shaderMode : "combo";
  const activeCanvas = getActiveRenderCanvas();
  const dataUrl = activeCanvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `generative-art-${modeLabel}-${state.seed}.png`;
  link.href = dataUrl;
  link.click();
});

copyLinkBtn.addEventListener("click", () => {
  copyShareUrl();
});

openGalleryBtn.addEventListener("click", () => {
  window.location.href = "gallery.html";
});

presetSelect.addEventListener("change", () => {
  presetStore.selectedId = presetSelect.value;
});

savePresetBtn.addEventListener("click", () => {
  saveCurrentPreset();
});

applyPresetBtn.addEventListener("click", () => {
  applySelectedPreset();
});

deletePresetBtn.addEventListener("click", () => {
  deleteSelectedPreset();
});

recordWebmBtn.addEventListener("click", () => {
  toggleWebmRecording();
});

exportGifBtn.addEventListener("click", () => {
  exportGifClip();
});

window.addEventListener("resize", resize);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    state._runningBeforeHidden = state.running;
    state.running = false;
  } else if (state._runningBeforeHidden !== undefined) {
    state.running = Boolean(state._runningBeforeHidden);
  }
  pauseBtn.textContent = state.running ? "Pause" : "Resume";
});
window.addEventListener("beforeunload", () => {
  disconnectAudioRouting({ stopStream: true, pauseMedia: true });
  if (grainWorkerState.worker) {
    grainWorkerState.worker.terminate();
    grainWorkerState.worker = null;
  }
  if (audioRuntime.uploadedUrl) {
    URL.revokeObjectURL(audioRuntime.uploadedUrl);
    audioRuntime.uploadedUrl = "";
  }
});

syncUrlFromState();
setCanvasVisibility();
resize();
void syncAudioSourceFromState(true);
cancelAnimationFrame(animationId);
tick();
