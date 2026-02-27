(function initGGRenderPipeline(global) {
  function create(options) {
    const {
      state,
      beforeRegenerate,
      renderClassicRegenerate,
      renderComboRegenerate,
      renderShaderRegenerate,
      renderClassicFrame,
      renderComboFrame,
      renderShaderFrame,
      afterFrame
    } = options;

    function regenerate() {
      state.frame = 0;
      beforeRegenerate();
      if (state.category === "classic") {
        renderClassicRegenerate();
      } else if (state.category === "combo") {
        renderComboRegenerate();
      } else {
        renderShaderRegenerate();
      }
      afterFrame();
    }

    function step() {
      if (!state.running) {
        return;
      }
      state.frame += 1;
      if (state.category === "classic") {
        renderClassicFrame();
      } else if (state.category === "combo") {
        renderComboFrame();
      } else {
        renderShaderFrame();
      }
      afterFrame();
    }

    return {
      regenerate,
      step
    };
  }

  global.GGRenderPipeline = {
    create
  };
})(window);
