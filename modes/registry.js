(function initGGModeRegistry(global) {
  class ModeRegistry {
    constructor() {
      this.byCategory = new Map();
    }

    register(category, modeDef) {
      if (!this.byCategory.has(category)) {
        this.byCategory.set(category, []);
      }
      this.byCategory.get(category).push(modeDef);
    }

    list(category) {
      return this.byCategory.get(category) || [];
    }

    map(category) {
      return new Map(this.list(category).map((mode) => [mode.id, mode]));
    }
  }

  global.GGModeRegistry = {
    create() {
      return new ModeRegistry();
    }
  };
})(window);
