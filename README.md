# Generative Garden

Interactive generative art website with 30 classic modes, shader 3D rendering, mode combiner, presets, and recording export.

## Links

- GitHub: `https://github.com/mifanTeddy/art`
- Live site: `https://art.mifan.im/`

## Run locally

```bash
python3 -m http.server 8000
```

Open: `http://localhost:8000`

## Art modes (30)

1. `Flow Field`
2. `Orbit Bloom`
3. `Ribbon Weave`
4. `Vortex Drift`
5. `Noisy Dunes`
6. `Noise Mosaic`
7. `Ink Tendrils`
8. `Pulse Rings`
9. `Constellation`
10. `Glass Shards`
11. `Aurora Drift`
12. `Smoke Trails`
13. `Current Lines`
14. `Pollen Storm`
15. `Plasma Veins`
16. `Tidal Bands`
17. `Braid Waves`
18. `Interference Net`
19. `Contour Lines`
20. `Silk Strata`
21. `Helix Orbit`
22. `Petal Bloom`
23. `Sunburst Arc`
24. `Radar Sweep`
25. `Nova Sparks`
26. `Quilt Tiles`
27. `Glyph Grid`
28. `Checker Pulse`
29. `Circuit Matrix`
30. `Bubble Cells`

## Main features

- Three categories:
  - `Classic Canvas` (30 modes)
  - `Shader 3D` (`Nebula Volume`, `Warp Tunnel`, `Metaball Galaxy`)
  - `Mode Combiner` (A/B mode + blend)
- Parameter panel: `Density`, `Speed`, `Line Width`
- Randomize button with selectable attributes:
  - `Category`, `Mode`, `Blend`, `Palette`, `Seed`, `Density`, `Speed`, `Line Width`
- Preset system (localStorage):
  - save/apply/delete presets in browser
- Undo previous generated settings (front-end history stack, max 30)
- URL sync for shareable settings (`c`, `m`, `sm`, `a`, `b`, `bm`, `p`, `s`, `d`, `v`, `w`)
- Export options:
  - `PNG`
  - `WebM` recording (start/stop)
  - `GIF` export (4s clip)
- `Regenerate`, `Pause/Resume`, `Copy Share URL`
- Responsive layout (desktop + mobile)

## Notes

- GIF export uses `gif.js` from CDN:
  - `https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.js`

## Deploy to Vercel

This project is a static site and can be deployed directly.

```bash
npm i -g vercel
vercel
vercel --prod
```

`vercel.json` is included for static hosting config.
