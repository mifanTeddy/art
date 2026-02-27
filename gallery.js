const PRESET_STORAGE_KEY = "generative-garden-presets-v1";
const grid = document.getElementById("galleryGrid");

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

function savePresets(items) {
  localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(items));
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
  params.set("fb", trimFloat(snapshot.post?.bloom ?? 0.4));
  params.set("fc", trimFloat(snapshot.post?.chroma ?? 0.2));
  params.set("fg", trimFloat(snapshot.post?.grain ?? 0.2));
  params.set("fv", trimFloat(snapshot.post?.vignette ?? 0.3));

  return params.toString();
}

function formatDate(timestamp) {
  if (!timestamp) return "unknown";
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "unknown";
  return d.toLocaleString();
}

function renderEmpty() {
  grid.innerHTML = '<div class="empty">No presets saved yet. Go back to generator and save some presets first.</div>';
}

function render() {
  const presets = loadPresets();
  if (presets.length === 0) {
    renderEmpty();
    return;
  }

  grid.innerHTML = "";

  for (const item of presets) {
    const card = document.createElement("article");
    card.className = "card";

    const thumb = document.createElement("img");
    thumb.className = "thumb";
    thumb.alt = item.name || "Preset thumbnail";
    thumb.src =
      item.thumbnail ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3C/svg%3E";
    card.appendChild(thumb);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("p");
    title.className = "card-title";
    title.textContent = item.name || "Untitled Preset";
    body.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = `Updated: ${formatDate(item.updatedAt)}`;
    body.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.textContent = "Open";
    openBtn.addEventListener("click", () => {
      const query = snapshotToQuery(item.snapshot || {});
      window.location.href = `index.html?${query}`;
    });
    actions.appendChild(openBtn);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "Copy Link";
    copyBtn.addEventListener("click", async () => {
      const query = snapshotToQuery(item.snapshot || {});
      const url = `${window.location.origin}${window.location.pathname.replace(/gallery\.html$/, "index.html")}?${query}`;
      try {
        await navigator.clipboard.writeText(url);
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy Link";
        }, 800);
      } catch {
        copyBtn.textContent = "Failed";
        setTimeout(() => {
          copyBtn.textContent = "Copy Link";
        }, 800);
      }
    });
    actions.appendChild(copyBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const next = loadPresets().filter((preset) => preset.id !== item.id);
      savePresets(next);
      render();
    });
    actions.appendChild(deleteBtn);

    body.appendChild(actions);
    card.appendChild(body);
    grid.appendChild(card);
  }
}

render();
