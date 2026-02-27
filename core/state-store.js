(function initGGStateStore(global) {
  const PARAM_LIMITS = {
    density: { min: 0.4, max: 2.4, step: 0.1 },
    speed: { min: 0.3, max: 2.5, step: 0.1 },
    lineWidth: { min: 0.4, max: 2.5, step: 0.1 }
  };

  const BASE_URL_KEYS = {
    mode: "m",
    palette: "p",
    baseTone: "bg",
    audioEnabled: "ae",
    audioInput: "ai",
    audioReactive: "ar",
    seed: "s",
    density: "d",
    speed: "v",
    lineWidth: "w"
  };

  function createInitialState() {
    return {
      mode: "flow",
      paletteName: "citrus",
      baseTone: "palette",
      running: true,
      seed: Math.floor(Math.random() * 900000) + 100000,
      params: {
        density: 1,
        speed: 1,
        lineWidth: 1
      },
      post: {
        enabled: false,
        bloom: 0.2,
        chroma: 0.08,
        grain: 0.1,
        vignette: 0.15
      },
      audio: {
        enabled: false,
        input: "demo-beat",
        reactivity: 1
      },
      frame: 0,
      data: null,
      rand: null,
      history: []
    };
  }

  global.GGStateStore = {
    PARAM_LIMITS,
    BASE_URL_KEYS,
    createInitialState
  };
})(window);
