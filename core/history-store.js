(function initGGHistoryStore(global) {
  function cloneLayers(layers) {
    return layers.map((layer) => ({
      mode: layer.mode,
      blend: layer.blend
    }));
  }

  function createSnapshot(state) {
    return {
      category: state.category,
      mode: state.mode,
      shaderMode: state.shaderMode,
      combo: {
        layerCount: state.combo.layerCount,
        layers: cloneLayers(state.combo.layers)
      },
      paletteName: state.paletteName,
      baseTone: state.baseTone,
      seed: state.seed,
      params: {
        density: state.params.density,
        speed: state.params.speed,
        lineWidth: state.params.lineWidth
      },
      post: {
        enabled: state.post.enabled,
        bloom: state.post.bloom,
        chroma: state.post.chroma,
        grain: state.post.grain,
        vignette: state.post.vignette
      },
      audio: {
        enabled: state.audio.enabled,
        input: state.audio.input,
        reactivity: state.audio.reactivity
      }
    };
  }

  function snapshotsEqual(a, b) {
    const layersEqual =
      a.combo.layerCount === b.combo.layerCount &&
      a.combo.layers.length === b.combo.layers.length &&
      a.combo.layers.every(
        (layer, i) => layer.mode === b.combo.layers[i].mode && layer.blend === b.combo.layers[i].blend
      );

    return (
      a.category === b.category &&
      a.mode === b.mode &&
      a.shaderMode === b.shaderMode &&
      layersEqual &&
      a.paletteName === b.paletteName &&
      a.baseTone === b.baseTone &&
      a.seed === b.seed &&
      a.params.density === b.params.density &&
      a.params.speed === b.params.speed &&
      a.params.lineWidth === b.params.lineWidth &&
      a.post.enabled === b.post.enabled &&
      a.post.bloom === b.post.bloom &&
      a.post.chroma === b.post.chroma &&
      a.post.grain === b.post.grain &&
      a.post.vignette === b.post.vignette &&
      a.audio.enabled === b.audio.enabled &&
      a.audio.input === b.audio.input &&
      a.audio.reactivity === b.audio.reactivity
    );
  }

  function push(history, snapshot, limit) {
    const next = {
      category: snapshot.category,
      mode: snapshot.mode,
      shaderMode: snapshot.shaderMode,
      combo: {
        layerCount: snapshot.combo.layerCount,
        layers: cloneLayers(snapshot.combo.layers)
      },
      paletteName: snapshot.paletteName,
      baseTone: snapshot.baseTone,
      seed: snapshot.seed,
      params: {
        density: snapshot.params.density,
        speed: snapshot.params.speed,
        lineWidth: snapshot.params.lineWidth
      },
      post: {
        enabled: snapshot.post.enabled,
        bloom: snapshot.post.bloom,
        chroma: snapshot.post.chroma,
        grain: snapshot.post.grain,
        vignette: snapshot.post.vignette
      },
      audio: {
        enabled: snapshot.audio.enabled,
        input: snapshot.audio.input,
        reactivity: snapshot.audio.reactivity
      }
    };

    const last = history[history.length - 1];
    if (last && snapshotsEqual(last, next)) {
      return history;
    }

    history.push(next);
    if (history.length > limit) {
      history.shift();
    }
    return history;
  }

  global.GGHistoryStore = {
    createSnapshot,
    snapshotsEqual,
    push
  };
})(window);
