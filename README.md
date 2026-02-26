# Generative Garden

Interactive generative art website with 10 visual modes, configurable parameters, and shareable URLs.

## Links

- GitHub: `https://github.com/mifanTeddy/art`
- Live site: `https://art.mifan.im/`

## Run locally

```bash
python3 -m http.server 8000
```

Open: `http://localhost:8000`

## Art modes (10)

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

## Main features

- Parameter panel: `Density`, `Speed`, `Line Width`
- Randomize button with selectable attributes:
  - `Mode`, `Palette`, `Seed`, `Density`, `Speed`, `Line Width`
- Undo previous generated settings (front-end history stack, max 30)
- URL sync for shareable settings (`m`, `p`, `s`, `d`, `v`, `w`)
- `Regenerate`, `Pause/Resume`, `Export PNG`, `Copy Share URL`
- Responsive layout (desktop + mobile)

## Deploy to Vercel

This project is a static site and can be deployed directly.

```bash
npm i -g vercel
vercel
vercel --prod
```

`vercel.json` is included for static hosting config.
