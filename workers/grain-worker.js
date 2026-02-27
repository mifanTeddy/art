function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

self.onmessage = (event) => {
  const width = Math.max(1, event.data.width | 0);
  const height = Math.max(1, event.data.height | 0);
  const rand = mulberry32((event.data.seed | 0) ^ (width * 92821) ^ (height * 68917));
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < pixels.length; i += 4) {
    const v = Math.floor(rand() * 255);
    pixels[i] = v;
    pixels[i + 1] = v;
    pixels[i + 2] = v;
    pixels[i + 3] = 255;
  }

  self.postMessage({ width, height, pixels: pixels.buffer }, [pixels.buffer]);
};
