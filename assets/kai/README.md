# Kai

`kai.glb` is the unchanged approved model from KAIZEN Studio:
`https://kaizenstudio.no/assets/cyan/cyan-approved.glb`.
SHA-256: `b9c1d4de534bfa9bcf3faf22107fe152bce9d22126f510dd3d6c89ce2ac51b78`.

`kai-src/scene.js` reuses the source site's `cyan-runtime.js` lighting.
The portrait keeps the last pose/camera from `approved-entrance.json` (4s).
The card uses the approved 1.4s driving posture in a side view, travelling
left to right at .95 model units per second. Materials and geometry remain
unchanged. Wheel angle equals distance divided by the radius measured from
the GLB vertices (.422 units). Reset happens beyond the clipped stage edge.

Build with `npm ci --ignore-scripts` then `npm run build:kai`. The small
entry loads the renderer/model only when the portrait is visible. Rendering
follows the display's animation-frame cadence (the old 24fps threshold caused
20fps on 60Hz screens). The antialiased renderer supersamples at DPR2–3 with
a hard two-million-pixel drawing-buffer budget. It stops offscreen,
in a hidden document, on Pause, or with reduced motion. A lost WebGL context
or a failed model load returns to the original-model poster.

`kai-poster.webp` is a transparent 1280×1280 WebP rendered from this exact
model and portrait scene. To reproduce, serve the repo,
open `tools/render-kai.html`, wait for `window.kaiPoster`, and save the base64
payload of that WebP data URL. This uses the same renderer as the portfolio.
No image generation or character redesign is involved.

## Method stack

`stack-motion.json` is the unchanged approved KAIZEN stack bake from
`Kai-Seksjon-3-trekker-stack.blend`. `kai-src/stack.js` applies its sampled
transforms and the source affine card projection to four real HTML cards.
The desktop component keeps the approved pull over the first half of 360svh.
CEO method4 then unfolds four real cards into portfolio cells 1, 2, 5 and 6,
complete by 70% scroll; the remaining distance is reading time. During the pull
the DOM carrier keeps the source 600×454 aspect to avoid stretched typography;
actual DOM dimensions reflow smoothly to the grid cells during unfolding.
The centered opening title fades before Kai enters. The prior subtitle, closing
note, step-reading progress bar and custom controls have been removed.
An opaque sticky portfolio grid pins with the scene; the final hold rounds the
track to whole grid modules. All final spacing and type use portfolio tokens.
Rendering is scroll-driven and pauses offscreen. Mobile, reduced motion, unavailable WebGL, or failed assets retain
the complete static method copy without requiring the scene or a long track.
`stack-entry.js` lazy-loads this scene through the same `build:kai` command.
