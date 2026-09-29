# 0001 — Deploy from the live branch

**Date:** 2026-09-29

**Status:** Accepted

## Decision

GitHub Pages serves the `live` branch of this repo as raw files, from the repo root, with no build step on the server. Deploying means updating `live`: whatever is on `live` is published at runeoverland.no.

## Why

The site is static HTML with prebuilt bundles, so serving the branch as it is publishes exactly the files in git, and nothing on the server can build something different from what was reviewed. The written sources below record the setup, not the alternatives that were weighed when it was chosen; this file records the setup as it stands on the date above.

## Source

- The repo description on GitHub: "Source for runeoverland.no — portfolio and case surface, served by GitHub Pages from the `live` branch."
- `.nojekyll` in the root, which turns off Jekyll so the files are served as they are.
- `CNAME` in the root, which sets the custom domain runeoverland.no.

## Consequence

- Generated code is committed: `npm run build` writes `studio/` and `assets/kai/runtime/`, and the output goes into the same commit as the source change.
- Media and bundles are kept in git, not Git LFS, because Pages does not serve LFS objects.
- The public URLs point at files in the root, so the HTML pages stay in the root.
- Rollback is a revert on `live`, pushed as a new commit, so history stays intact.
