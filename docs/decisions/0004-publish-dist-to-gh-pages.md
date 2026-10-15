# 0004 — Publish a built dist/ to gh-pages

**Date:** 2026-10-15

**Status:** Accepted, in two steps. Step 1 (this change) adds the pipeline; step 2 repoints Pages. This file supersedes 0001 once step 2 is done.

## Decision

The `live` branch stays the source. A GitHub Action builds `dist/` from it (`npm run build`) and publishes `dist/` to the `gh-pages` branch, replacing the branch each time. GitHub Pages is then pointed at `gh-pages`. Nobody edits `gh-pages`.

## Why

Serving the repo root as raw files forced every source file, test and tool to be published and kept the HTML pages in the root. Separating source from served files lets later changes move the sources into `site/` and `src/` without changing any public URL.

## Consequence

- `tools/build-site.mjs` holds an allowlist of served files, not a list of exceptions.
- Until the sources move, `npm run check:dist` proves that `dist/` equals the files Pages serves today.
- Step 2 is one call by the owner after the merge: `gh api -X PUT repos/sbbstudio/portfolio/pages -f source[branch]=gh-pages -f source[path]=/`. Until then Pages serves `live` and 0001 still describes the deploy.
- Rollback is a revert on `live`; the next push republishes `gh-pages`.
