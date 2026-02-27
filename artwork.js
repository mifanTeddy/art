const PRESET_STORAGE_KEY = "generative-garden-presets-v1";
const titleEl = document.getElementById("artTitle");
const metaEl = document.getElementById("artMeta");
const thumbEl = document.getElementById("artThumb");
const chipsEl = document.getElementById("chips");
const jsonView = document.getElementById("jsonView");
const openGeneratorBtn = document.getElementById("openGeneratorBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const copyJsonBtn = document.getElementById("copyJsonBtn");
const backBtn = document.getElementById("backBtn");

function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function trimFloat(value) {
  return Number(value.toFixed(2)).toString();
}

function snapshotToQuery(snapshot) {
  const params = new URLSearchParams();
  params.set("c", snapshot.category || "classic");
  params.set("m", snapshot.mode || "flow");
  params.set("sm", snapshot.shaderMode || "nebula3d");
  params.set("cl", String(snapshot.combo?.layerCount || 2));

  const layers = snapshot.combo?.layers || [];
  params.set("a", layers[0]?.mode || "flow");
  params.set("b", layers[1]?.mode || "aurora");
  params.set("c3", layers[2]?.mode || "rings");
  params.set("c4", layers[3]?.mode || "mosaic");
  params.set("bm", layers[1]?.blend || "screen");
  params.set("b3", layers[2]?.blend || "lighter");
  params.set("b4", layers[3]?.blend || "multiply");

  params.set("p", snapshot.paletteName || "citrus");
  params.set("bg", snapshot.baseTone || "palette");
  params.set("s", String(snapshot.seed || 1));
  params.set("d", trimFloat(snapshot.params?.density ?? 1));
  params.set("v", trimFloat(snapshot.params?.speed ?? 1));
  params.set("w", trimFloat(snapshot.params?.lineWidth ?? 1));
  params.set("fxe", snapshot.post?.enabled === false ? "0" : "1");
  params.set("fb", trimFloat(snapshot.post?.bloom ?? 0.2));
  params.set("fc", trimFloat(snapshot.post?.chroma ?? 0.08));
  params.set("fg", trimFloat(snapshot.post?.grain ?? 0.1));
  params.set("fv", trimFloat(snapshot.post?.vignette ?? 0.15));
  params.set("ae", snapshot.audio?.enabled ? "1" : "0");
  params.set("ai", snapshot.audio?.input || "demo-beat");
  params.set("ar", trimFloat(snapshot.audio?.reactivity ?? 1));
  return params.toString();
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

function chip(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

function render(item) {
  const snap = item.snapshot || {};
  titleEl.textContent = item.name || "Untitled Preset";
  metaEl.textContent = `Updated: ${formatDate(item.updatedAt)} • ID: ${item.id}`;
  thumbEl.src =
    item.thumbnail ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='560'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3C/svg%3E";

  chipsEl.innerHTML = "";
  chipsEl.appendChild(chip(`Category: ${snap.category || "classic"}`));
  chipsEl.appendChild(chip(`Mode: ${snap.mode || "flow"}`));
  chipsEl.appendChild(chip(`Palette: ${snap.paletteName || "citrus"}`));
  chipsEl.appendChild(chip(`Seed: ${snap.seed || 1}`));
  chipsEl.appendChild(chip(`Density: ${snap.params?.density ?? 1}`));
  chipsEl.appendChild(chip(`Speed: ${snap.params?.speed ?? 1}`));
  chipsEl.appendChild(chip(`Line: ${snap.params?.lineWidth ?? 1}`));
  chipsEl.appendChild(chip(`Audio: ${snap.audio?.enabled ? "on" : "off"}`));

  jsonView.textContent = JSON.stringify(item.snapshot || {}, null, 2);

  openGeneratorBtn.onclick = () => {
    const query = snapshotToQuery(item.snapshot || {});
    window.location.href = `index.html?${query}`;
  };

  copyLinkBtn.onclick = async () => {
    const query = snapshotToQuery(item.snapshot || {});
    const url = `${window.location.origin}${window.location.pathname.replace(/artwork\.html$/, "index.html")}?${query}`;
    try {
      await navigator.clipboard.writeText(url);
      copyLinkBtn.textContent = "Copied";
      setTimeout(() => {
        copyLinkBtn.textContent = "Copy Share URL";
      }, 900);
    } catch {
      copyLinkBtn.textContent = "Failed";
      setTimeout(() => {
        copyLinkBtn.textContent = "Copy Share URL";
      }, 900);
    }
  };

  copyJsonBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(item.snapshot || {}, null, 2));
      copyJsonBtn.textContent = "Copied";
      setTimeout(() => {
        copyJsonBtn.textContent = "Copy JSON";
      }, 900);
    } catch {
      copyJsonBtn.textContent = "Failed";
      setTimeout(() => {
        copyJsonBtn.textContent = "Copy JSON";
      }, 900);
    }
  };
}

function renderNotFound() {
  titleEl.textContent = "Artwork Not Found";
  metaEl.textContent = "This preset may have been removed from local storage.";
  jsonView.textContent = "{}";
  chipsEl.innerHTML = "";
  thumbEl.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='560'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='28'%3ENot Found%3C/text%3E%3C/svg%3E";
  openGeneratorBtn.disabled = true;
  copyLinkBtn.disabled = true;
  copyJsonBtn.disabled = true;
}

backBtn.addEventListener("click", () => {
  window.location.href = "gallery.html";
});

const presetId = new URLSearchParams(window.location.search).get("id");
const presets = loadPresets();
const item = presets.find((p) => p.id === presetId);

if (item) {
  render(item);
} else {
  renderNotFound();
}
