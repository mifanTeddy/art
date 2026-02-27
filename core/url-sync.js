(function initGGUrlSync(global) {
  function set(url, key, value) {
    url.searchParams.set(key, value);
  }

  function get(url, key) {
    return url.searchParams.get(key);
  }

  function getNum(url, key, fallback) {
    const raw = get(url, key);
    if (raw === null) return fallback;
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getInt(url, key, fallback) {
    const raw = get(url, key);
    if (raw === null) return fallback;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getBoolFlag(url, key, fallback) {
    const raw = get(url, key);
    if (raw === null) return fallback;
    return raw === "1";
  }

  global.GGUrlSync = {
    set,
    get,
    getNum,
    getInt,
    getBoolFlag
  };
})(window);
