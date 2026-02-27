(function initGGExporterCore(global) {
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function pickWebmMimeType() {
    if (typeof MediaRecorder === "undefined") {
      return "";
    }

    const candidates = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];

    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "";
  }

  global.GGExporterCore = {
    downloadBlob,
    pickWebmMimeType
  };
})(window);
