(function initGGAudioReactiveCore(global) {
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function factors(reactive, enabled, reactivity) {
    if (!enabled) {
      return { density: 1, speed: 1, line: 1 };
    }

    const densityDrive = clamp(reactive.low * 0.9 + reactive.beat * 0.45, 0, 1.6);
    const speedDrive = clamp(reactive.mid * 0.95 + reactive.beat * 0.4, 0, 1.7);
    const lineDrive = clamp(reactive.volume * 0.8 + reactive.high * 0.45, 0, 1.4);

    return {
      density: 1 + densityDrive * reactivity,
      speed: 1 + speedDrive * reactivity,
      line: 1 + lineDrive * reactivity
    };
  }

  function levelText(reactive) {
    return `Low ${Math.round(reactive.low * 100)}% Mid ${Math.round(reactive.mid * 100)}% High ${Math.round(reactive.high * 100)}%`;
  }

  global.GGAudioReactiveCore = {
    factors,
    levelText
  };
})(window);
