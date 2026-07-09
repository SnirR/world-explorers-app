# 🌍 מגלי העולם — World Explorers

A geography-and-space exploration game for kids ages 5–10, entirely in **Hebrew (RTL)** and fully **offline**. Built with React + TypeScript + Vite + three.js, packaged as an Android app with Capacitor.

See **[SPEC.md](./SPEC.md)** for the 2.0 spec and **[SPEC-3.0.md](./SPEC-3.0.md)** for the 3.0 upgrade design.

## What's inside

| Activity | What kids do |
|---|---|
| 🌍 **3D Globe** | Spin a painted-from-real-map Earth, tap continents/countries to discover them (atmosphere glow, stars, day/night, fly-to) |
| 🌦️ **Four Seasons** | Slide through spring→summer→autumn→winter on the globe: land tints, growing/shrinking snow caps, a real sun terminator, and "why we have seasons" |
| 🌊 **Ocean Dives** | Tap any sea → dive 5 oceans × 3 depth zones (reef / open / deep), meet ~38 low-poly sea creatures with god-rays, bioluminescence & bubbles |
| 🚪 **Country Dioramas** | "Visit" a country in a rotating 3D scene: a famous landmark, a local animal and nature (17 hand-built star countries + an emoji diorama for every other) |
| 🗺️ **2D Map** | The classic flat map — same shared progress |
| 🇮🇱 **Israel** | Discover 59 cities on the districts map (nearest-city tap detection) |
| 🚀 **Solar System** | Cinematic launch sequence, realistic planets (real Earth continents + clouds, FBM surfaces), asteroid belt, a comet, the ISS, 10 tappable constellations & shooting-star wishes (14 space objects) |
| 🛂 **Passport cards** | Flag, capital, fun fact + **4 words in the local language** (58 language packs) with Hebrew transliteration and native TTS |
| ❓ **Quiz** | Find-it-on-the-map plus flag & sea-life choice rounds, a deterministic **daily challenge** with a day streak, hints, medals, adaptive pool |
| 📖 **Explorer Encyclopedia** | Everything discovered — countries, continents, space, constellations, sea life — as tappable spoken cards |
| 📒 **Sticker album** | 20+ collectible reward stickers with celebrations |

Everything is spoken with TTS (Hebrew + native language voices), all sound effects are synthesized with WebAudio (zero audio assets), every 3D scene is painted/built procedurally (no model or image files), and progress is stored locally. A parental math-gate guards progress reset.

## Development

```bash
npm install          # postinstall runs patch-package
npm run dev          # vite dev server
npm run lint         # eslint
npm test             # vitest unit tests (data integrity, quiz/sticker logic, globe math)
npm run build        # tsc + vite build
npm run test:e2e     # Playwright end-to-end suite (builds first via test:all)
npm run test:all     # unit → build → e2e
```

## Android

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug   # APK at android/app/build/outputs/apk/debug/
```

CI (`.github/workflows/android-release.yml`) builds the APK and attaches it to a GitHub Release on every push to `main`.

## Architecture notes

- `src/three/GlobeScene.ts` — the 3D Earth engine: paints countries from the bundled TopoJSON (`public/countries-110m.json`) onto a canvas texture; seasons overlay, day/night terminator shader, discovered-country city lights; tap-picking via raycast → lat/lng → point-in-polygon (`d3-geo`) with a nearest-centroid helper and an ocean classifier for water taps.
- `src/three/SolarSystemScene.ts` — realistic planets (real Earth texture + drifting clouds), asteroid belt (InstancedMesh), comet, ISS, constellations, shooting stars.
- `src/three/OceanDiveScene.ts` + `lowPolyLife.ts` — the underwater dive engine and procedural sea-creature builders.
- `src/three/DioramaScene.ts` + `dioramaKit.ts` — the country diorama stage and its low-poly landmark/animal/nature kit.
- `src/three/noise.ts` / `earthPainter.ts` / `proceduralTextures.ts` — pure FBM value-noise and the canvas texture painters shared across scenes.
- `src/data/` — all game content: countries + passport details, 58 language packs, continents, planets, space objects, constellations, oceans + marine life, dioramas, seasons, Israel cities.
- `src/lib/` — pure, unit-tested logic (quiz engine, choice quiz, daily challenge, sticker unlocks).
- Fonts (Heebo) and all geo data are bundled — no network needed after install.
