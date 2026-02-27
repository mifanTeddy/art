(function initGGPresetStore(global) {
  function load(key, limit) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && typeof item === "object" && item.id && item.name && item.snapshot)
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  function persist(key, items, limit) {
    window.localStorage.setItem(key, JSON.stringify(items.slice(0, limit)));
  }

  function upsert(items, entry, limit) {
    const next = items.slice();
    const idx = next.findIndex((item) => item.id === entry.id || item.name === entry.name);
    if (idx >= 0) {
      next.splice(idx, 1);
    }
    next.unshift(entry);
    return next.slice(0, limit);
  }

  function remove(items, id) {
    return items.filter((item) => item.id !== id);
  }

  global.GGPresetStore = {
    load,
    persist,
    upsert,
    remove
  };
})(window);
